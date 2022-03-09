// Scrivi App Index //
// by Ben Uthoff

var Scrivi = new Vue({

	el: '#scriviapp',

	updated() {
		feather.replace({'class': 'icon'});
	},

	data: {

		client: 'web', // The Current Client, Web or Desktop
		idbenabled: false, // Checked if IDB is supported.
		idb: false, // References the IDB.

		ui: { // Holds which UI menus + features are active
			menublur: false, // Blur used by menus like settings + files.
			uiblur: false, // Blur used by UI like dialog boxes.
			settingsmenu: false,
			filesmenu: false,
			saveas: false
		},

		currentfile: { // The file present in the editor.
			filepath: false, // Path to the open file. For IDB, is the file's name.
			template: false, // Name of the template the file is built from.
			filedata: {}, // Internal file data.
			author: false, // Author of the file.
			metadata: {}, // Holds data like scripts and dates.
			tags: [] // Used to organize files.
		},
		editorcomponent: false, // Component used by the editor.
		unsavedchanges: false, // Whether the current file has unsaved changes.

		// Data on the files menu, including pointers and folder structure, backed up in the IDB.
		file: {
			dbpath: { // Object for IDB file pointers by filepath/ name
				/*'%\\Testfile': {
					name: 'Testfile',
					template: 'Simple',
					author: 'Ben Uthoff',
					metastats: {}, // Data about file metadata. (i.e. no scripts but # of them)
					tags: []
				}*/
			},
			dblist: { // List of IDB filepath/ names as well as folders in order.
				path: '%',
				folders: {
					/*'New Folder': {
						path: '%\\New Folder',
						folders: [],
						files: []
					}*/
				},
				files: [
					// '%\\Testfile'
				]
			},
			dbrecent: [],
			dbstar: [ // Ordered list of filepath/ names of starred/ pinned files
	
			]
		},

		
		filesmenu: { // The UI file menu and properties.
			page: 'home', // The open page.
			path: '%', // The location of the user in the file explorer
			// other examples are %\newfolder , %\otherfolder\furtherfolder
			saveaspath: '%', // Location of the user in the saveas menu.
			saveasname: '' // The value of the filename input in the saveas menu. 
		},


		filetemplates: {}, // Data of file templates.
		templatelist: [], // List of template names in order.

		settings: { // Attributes saved to usersettings
			sidebar_autohide: false,
			authorname: 'Anonymous',
			theme: 'dark'
		},

		settingspage: 'Basic', // The current settings page open
		settingstabs: [ // Outlines Tabs in Settings menu
			{ name: 'Basic', icon: 'settings' },
			{ name: 'Appearance', icon: 'droplet' },
			{ name: 'Keyboard', icon: 'command' },
			{ name: 'Addons', icon: 'package' },
			{ name: 'About', icon: 'info' }
		],

		sidebar: { // Used to render the app's sidebar(s)
			left: [
				{
					'icon': 'plus',
					'name': 'New File',
					'action': ()=>{
						Scrivi.newFile('Notebook');
						//Scrivi.notif('File Created', {icon: 'check', color: 'var(--notif-success)'});
					}
				},
				{
					'icon': 'save',
					'name': 'Save File',
					'action': ()=>{ Scrivi.saveFile() }
				},
				{
					'icon': 'folder',
					'name': 'Files',
					'action': ()=>{ Scrivi.toggleFileMenu() }
				},
				{
					'icon': 'sliders',
					'name': 'Settings',
					'action': ()=>{ Scrivi.toggleSettings() }
				}
			],
			right: [
				
			]
		},

		themes: [
			{ name: 'Dark', id: 'dark' },
			{ name: 'Light', id: 'light' }
		],

		keyboard: { // ["keycode", Ctrl?, Shift?]
			enter: ['Enter', false, false],
			cancel: ['Escape', false, false], 

			settings: ['`', true, false],
			filesmenu: ['Escape', false, false],
			nav_fwrd: ['Tab', false, false],
			nav_back: ['Tab', false, true],

			save: ['S', true, false],
			saveas: ['S', true, true],
			newfile: ['D', true, false],
		},
		keycommandlist: [
			'Basic',
			['Enter', 'enter'],
			['Cancel', 'cancel'],
			'Files',
			['New File', 'newfile'],
			['Save File', 'save'],
			['Save File As', 'saveas'],
			'Menus',
			['Toggle File View', 'filesmenu'],
			['Toggle Settings', 'settings'],
			['Navigate Forward', 'nav_fwrd'],
			['Navigate Backward', 'nav_back']
		],
		keyedit: false,

		dialogs: []

	},
	watch: {
		dialogs: (next, prev) => {
			Scrivi.ui.uiblur = (Scrivi.dialogs.length > 0);
		},
		'settings.theme': (next, prev) => {
			$('body').attr('theme', next);
		}
	},
	methods: {

		blip(elmnt) {
			$(elmnt).addClass('dying').fadeOut(200,()=>{ $(elmnt).remove() });
		},

		toggleSettings() {
			Scrivi.ui.menublur = !Scrivi.ui.menublur; // Toggle blur.
			Scrivi.ui.settingsmenu = !Scrivi.ui.settingsmenu; // Toggle menu.
			Scrivi.editKeyCode(false);
			if (!Scrivi.ui.settingsmenu) {
				Scrivi.saveData('settings');
				Scrivi.notif('Settings saved.', {icon: 'check', color: 'var(--notif-success)'});
			};
		},

		toggleFileMenu() {
			Scrivi.ui.menublur = !Scrivi.ui.menublur; // Toggle blur.
			Scrivi.ui.filesmenu = !Scrivi.ui.filesmenu; // Toggle menu.
		},

		toggleSaveAsDialog() {
			if (!Scrivi.ui.saveas) {
				Scrivi.ui.saveas = true; // Show the save-as window.
				Scrivi.ui.menublur = true;
				Scrivi.filesmenu.saveaspath = '%'; // Set the save-as explorer path to root.
				Scrivi.filesmenu.saveasname = ''; // Empty the save-as name input.
				setTimeout(()=>{ $('#saveas-name input').focus() }, 10);
			} else {
				Scrivi.ui.saveas = false;
				Scrivi.ui.menublur = false;
			};
		},

		getFileList(pth) { // Gets the file/folder list for a specified directory.

			let x = Scrivi.file.dblist; // Full list of files.
			let i = pth || Scrivi.filesmenu.path; // Path to specified folder.

			i = i.split('\\') // Splits the path into a list of directories.
			i.shift(); // Removes the first folder, which is root.

			i.forEach((elm,ind)=>{ // Gets deeper into the directory for each dir.
				x = x.folders[elm];
			});
			return x;

		},

		openSettingsTab(tab) { Scrivi.settingspage = tab.name; Scrivi.editKeyCode(false); },

		createFileTemplate(input) {
			Scrivi.filetemplates[input.name] = input;
			Scrivi.templatelist.push(input.name);
		},

		newFile(templatename) {

			// On close template event.
			if (Scrivi.currentfile.template) {
				Scrivi.filetemplates[Scrivi.currentfile.template].events.onclosed(Scrivi.currentfile);
			};

			if (Scrivi.unsavedchanges) {
				Scrivi.saveWarning(Scrivi.newFile, templatename);
				return;
			};

			$('#editor').empty().append( $(`<div id='costruire'></div>`) );

			let t = Scrivi.filetemplates[templatename];
			let date = new Date().toDateString();

			// Reset current file
			Scrivi.currentfile = {
				'filepath': false,
				'template': templatename,
				'filedata': _(t.filedata),
				'author': Scrivi.settings.authorname,
				'metadata': {
					'scripts': [],
					'dateCreated': date,
					'dateModified': date
				},
				'tags': []
			};
			Scrivi.unsavedchanges = false;

			Scrivi.editorcomponent = new t.component;
			Scrivi.editorcomponent.$mount('#costruire');

			t.events.onopened(Scrivi.currentfile); // Runs opening function.
			Scrivi.fileDataBind(); // Binds data from the DOM to the file data.

		},

		saveFile(aftersave = ()=>{}) {
			if (Scrivi.currentfile.filepath) {

				// Set 'Date Modified'.
				let date = new Date().toDateString();
				Scrivi.currentfile.metadata.dateModified = date;
				Scrivi.file.dbpath[ Scrivi.currentfile.filepath ].metastats.dateModified = date;

				// Set file to recently used.
				Scrivi.setRecentFile();

				// Run save event for current template.
				Scrivi.filetemplates[Scrivi.currentfile.template].events.onsaved( Scrivi.currentfile);

				// Save to IDB.
				let req = Scrivi.idb.transaction(['rootdrive'], 'readwrite')
					.objectStore('rootdrive').put(Scrivi.currentfile);
				req.onerror = ()=>{ Scrivi.notif('Error saving '+ Scrivi.currentfile.filepath +'.', {'color': 'var(--notif-error)'}) };
				req.onsuccess = ()=>{
					Scrivi.unsavedchanges = false;
					Scrivi.notif('File Saved', {'icon': 'check', 'color': 'var(--notif-success)'});
					aftersave(); // Specific function to run after saving.
				};
				
			} else { Scrivi.toggleSaveAsDialog() }; // If no path, save file as...
		},

		saveFileAs() {

			let fname = $('#saveas-name input').val(); // Gets the name input value.
			let valid = Scrivi.validFileName(fname); // Check filename validity.

			if (valid[0]) { // If name is valid.
				// P = the file path; CF = pointer to Scrivi.currentfile.
				let p = Scrivi.filesmenu.saveaspath + '\\' + fname;
				Scrivi.currentfile.filepath = p;
				let cf = Scrivi.currentfile;
				// Create Path Pointer-
				Scrivi.file.dbpath[p] = {
					'name': fname,
					'template': cf.template,
					'author': cf.author,
					'metastats': {
						'scripts': cf.metadata.scripts.length, //length
						'dateCreated': cf.metadata.dateCreated,
						'dateModified': cf.metadata.dateModified
					},
					'tags': cf.tags
				};

				if (valid[1] !== 'overwrite') { // Add to file list- if doesnt exist already.
					Scrivi.getFileList( Scrivi.filesmenu.savepath ).files.push( p );
				};
				Scrivi.saveData('file'); // Save file path data.
				Scrivi.saveFile(); // Saves the current file to IDB.
				Scrivi.toggleSaveAsDialog(); // Close dialog.

			} else { // Invalid name: error msg.
				Scrivi.notif({
					'empty': 'Include a file name.',
					'length': 'File name is too long.',
					'forbidden': 'Name contains forbidden characters.'
				}[valid[1]], {'color': 'var(--notif-error)', 'icon': 'alert-triangle'});
			};

		},

		openFile(path) {

			// On close template event.
			if (Scrivi.currentfile.template) {
				Scrivi.filetemplates[Scrivi.currentfile.template].events.onclosed(Scrivi.currentfile);
			};

			if (Scrivi.unsavedchanges) {
				Scrivi.saveWarning(Scrivi.openFile, path);
				return;
			};

			let setstore = Scrivi.idb.transaction(['rootdrive']).objectStore('rootdrive');
			let req = setstore.get(path);
			req.onerror = ()=>{ Scrivi.notif('Unable to load '+ path +'.', {'color': 'var(--notif-error)'}) };
			req.onsuccess = ()=>{
				if (!req.result) { // If no value.
					Scrivi.notif('File not found.', {'color': 'var(--notif-error)'});
				} else if ( !Object.keys(Scrivi.filetemplates).includes(req.result.template) ) {
					Scrivi.notif('Unknown template: '+ req.result.template +'.', {'color': 'var(--notif-error)'});
				} else { // If value exists

					Scrivi.currentfile = req.result; // Set currentfile to loaded data.
					Scrivi.unsavedchanges = false;

					$('#editor').empty().append( $(`<div id='costruire'></div>`) );
					let t = Scrivi.filetemplates[ Scrivi.currentfile.template ];
					Scrivi.editorcomponent = new t.component;
					Scrivi.editorcomponent.$mount('#costruire'); // Mount component to editor.

					t.events.onopened(Scrivi.currentfile); // Runs opening function.
					Scrivi.fileDataBind(); // Binds data from the DOM to the file data.

					// Close files menu.
					if (Scrivi.ui.filesmenu) { Scrivi.toggleFileMenu() };

					// Add to list of recently used files.
					Scrivi.setRecentFile();

				};
			};
		},

		validFileName(name) {
			if (name.length === 0) {
				return [false, 'empty'];
			};
			if (name.length > 64) {
				return [false, 'length'];
			};
			// Regular expression used to check whether the filename
			// contains forbidden characters...
			if (name.match( /^[\w. \-&()\[\]!]+$/g ) === null) {
				return [false, 'forbidden'];
			};
			if ( Object.keys(Scrivi.file.dbpath).includes( Scrivi.filesmenu.saveaspath + '\\' + name )) {
				return [true, 'overwrite'];
			};
			return [true, 'valid'];
		},

		fileDataBind() { // Causes the `filedata` to update when contenteditable text is changed.
			$('#editor [fd_bind]').each((i,e)=>{

				// Set HTML to saved data.
				$(e).html( Scrivi.currentfile.filedata[ $(e).attr('fd_bind') ] );

				// BREAKPOINT
				// REMOVE ALL BINDING EVENT LISTENERS.

				// Create updater for when data is changed. 
				e.addEventListener('input', ()=>{

					// Update Variables
					let p = $(e).attr('fd_bind'); // Gets the binded variable.
					if ($(e).prop('contenteditable')) { // For contenteditable.
						Scrivi.currentfile.filedata[p] = $(e).html();
						if ($(e).text() === '') { $(e).html('') };
					} else { // For input elements.
						Scrivi.currentfile.filedata[p] = e.value;
					};

					// Updated app & run event.
					Scrivi.unsavedchanges = true;
					Scrivi.filetemplates[Scrivi.currentfile.template].events.onedited(Scrivi.currentfile);

				});
			});
		},

		saveWarning(func, peram) {
			Scrivi.dialogs.push({
				text: 'You have unsaved changes. Continue?',
				buttons: [
					['Save and Exit', ()=>{
						if (Scrivi.currentfile.filepath) {
							Scrivi.unsavedchanges = false;
							Scrivi.saveFile(aftersave=()=>{ func(peram) });
						} else {
							Scrivi.saveFile();
						};
					}, false],
					['Exit Without Saving', ()=>{
						Scrivi.unsavedchanges = false;
						func(peram);
					}, false],
					['Cancel', ()=>{}, 'cancel']
				]
			});
		},

		setRecentFile() {
			let dbrecent = Scrivi.file.dbrecent; // Pointers
			let currentpath = Scrivi.currentfile.filepath;

			// The current file is not at the beggining of the list.
			if (currentpath && dbrecent[0] !== currentpath) { 
				
				// If already in list later.
				let a = dbrecent.indexOf(currentpath)
				if ( a > -1 ) { dbrecent.splice(a,1) };
				
				dbrecent.unshift( currentpath ); // Add to beginning of list.

				// Max 3 items in recent file list.
				if (dbrecent.length > 3) { dbrecent.pop() };
				
				Scrivi.saveData('file'); // Save to storage.
			};
		},

		editKeyCode(keyid) {
			$('.keyinput').removeClass('edit'); // Remove Edit from all inputs.
			Scrivi.keyedit = keyid;
			$('#keyin_'+keyid).addClass('edit'); // Add to specific input.
		},

		notif(text, options) { // NOTIFICATIONS

			// OPTIONS: {} || undefined
			// .icon = ''
			// .color = ''

			// Set the icon
			let icon = '';
			if (options && options.icon) {
				icon = '<i data-feather="' + options.icon + '" width="24px" height="24px"></i>';
			};

			// Blip for fading out...

			// Create the html element
			let notif = $('<div class="notif">'+icon+text+'</div>')
				.on('click', (event)=>{Scrivi.blip(event.currentTarget)});

			// Adds the custom color property
			if (options && options.color) {
				notif.css('border-color', options.color);
			};

			// Adds the element to the DOM
			$('#notifs').prepend(notif);

			// Auto-delete after set time
			setTimeout(function(){
				Scrivi.blip($('#notifs .notif:not(.dying)').last());
			}, 2000);

			// Render Icon
			feather.replace({'class': 'icon'});

		},

		saveData(label, value, onsuccess) {
			if (!value) { value = Scrivi[label] };
			let req = Scrivi.idb.transaction(['appdata'], 'readwrite')
				.objectStore('appdata').put({'label': label, 'value': value});
			req.onerror = ()=>{ Scrivi.notif('Error saving '+ label +'.', {'color': 'var(--notif-error)'}) };
			req.onsuccess = ()=>{
				if (onsuccess) { onsuccess() };
				//\/\/\Scrivi.notif('Datapoint Saved', {'icon': 'check', 'color': 'var(--notif-success)'});
			};
		},

		loadData(label, onsuccess, defaultset=true, updater=false) {
			let setstore = Scrivi.idb.transaction(['appdata']).objectStore('appdata');
			let req = setstore.get(label);
			req.onerror = ()=>{ Scrivi.notif('Error loading '+ label +'.', {'color': 'var(--notif-error)'}) };
			req.onsuccess = ()=>{
				if (!req.result) { // If no value.
					Scrivi.notif('No '+ label +' found.', {'color': 'var(--notif-error)'});
				} else { // If value exists

					//\/\/\Scrivi.notif('Datapoint Loaded', {'icon': 'check', 'color': 'var(--notif-success)'});
					if (onsuccess) { onsuccess(req.result.value) }; // Custom success event.
					if (defaultset) { // Sets Scrivi property of the same name to the value.
						if (updater && typeof req.result.value === 'object') {
							// This if adds each property to the existent object to account for possibly added values.
							// Only occurs if the updater peram is true.
							Scrivi[label] = { ...Scrivi[label], ...req.result.value };
						} else {
							Scrivi[label] = req.result.value;
						};
					};

					return req.result.value;

				};
			};
		},

		__resetAll() {
			let request = indexedDB.deleteDatabase('scriviapp');
			Scrivi.notif('Erasing All Data...', {icon: 'loader'})
			setTimeout(function(){
				window.location.href = window.location.href;
			}, 1000);
		}

	},

	components: {

		'subheader': {
			template: `<h2><i data-feather='corner-down-right' width='28px' height='28px'></i> {{ text }}</h2>`,
			props: ['text']
		},

		'xinput': {
			template: `<div class='xinput'>
				<div class='label'>{{ label }} </div>
				<input :type='type' :value='value' @input='update'/>
			</div>`,
			props: ['label', 'value', 'type'],
			methods: {
				update(event) {
					this.$emit('input', event.target.value)
				}
			}
		},

		'check-form': {
			template: `<div class='xinput' @click='toggle'>
				<div class='box' :value='value'><i data-feather='check'></i></div>
				<div class='label'>{{ label }} </div>
			</div>`,
			props: ['label', 'value'],
			methods: {
				toggle(event) {
					this.value = !this.value;
					this.$emit('input', this.value);
				}
			}
		},

		'theme-svg': {
			template: `<div class='themedisplay' :theme='theme' @click='Scrivi.settings.theme = theme;'>
				<svg class='prev' width='200px' height='120px'>
					<rect class='rect' x='50' y='20' rx='4' ry='4' width='100' height='80'></rect>
					<circle class='circ' cx='30' cy='60' r='4'></circle>
					<circle class='circ' cx='30' cy='40' r='4'></circle>
					<circle class='circ' cx='30' cy='80' r='4'></circle>
				</svg>
					<div class='label'>{{ label }}</div>
				</div>`,
			props: ['theme', 'label']
		}

	}
});

// For dev use OR to remove pointers.
function _(obj) { return {...obj} /*return JSON.parse(JSON.stringify(obj))*/ };

// Initialize Icons.
feather.replace({'class': 'icon'});