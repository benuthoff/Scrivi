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

		/*rootpath: { // Used for IDB File Management
			pinned: [],
			main: [
				{ // Sample file pointer for IDB file.
					// This pointer should be updated every time a file is saved.
					filepath: 'Testfile',
					template: 'Simple',
					author: 'Ben Uthoff',
					metastats: {}, // Data about file metadata. (i.e. no scripts but # of them)
					tags: []
				},
				{
					filepath: 'Theres an issue with this file...',
					template: 'error',
					author: 'Ben Uthoff',
					metastats: {},
					tags: []
				}
			]
		},*/

		file: {
			dbpath: { // Object for IDB file pointers by filepath/ name
				'%\\Testfile': {
					name: 'Testfile',
					template: 'Simple',
					author: 'Ben Uthoff',
					metastats: {}, // Data about file metadata. (i.e. no scripts but # of them)
					tags: []
				}
			},
			dblist: { // List of IDB filepath/ names as well as folders in order.
				path: '%',
				folders: {
					'New Folder': {
						path: '%\\New Folder',
						folders: [],
						files: []
					}
				},
				files: [
					'%\\Testfile', '%\\Testfile', '%\\Testfile'
				]
			},
			dbstar: [ // Ordered list of filepath/ names of starred/ pinned files
	
			]
		},
		path: '%', // The location of the user in the file explorer
		// other examples are %\newfolder , %\otherfolder\furtherfolder


		filetemplates: {}, // Data of file templates.
		templatelist: [], // List of template names in order.

		ui: { // Holds which UI menus + features are active
			menublur: false,
			uiblur: false,
			settingsmenu: false,
			filesmenu: false
		},

		settings: { // Attributes saved to usersettings
			sidebar_autohide: false,
			authorname: 'Anonymous'
		},

		filesmenu: {
			page: 'home'
		},

		settingspage: 'Basic', // The current settings page open
		settingstabs: [ // Outlines Tabs in Settings menu
			{
				name: 'Basic',
				icon: 'settings'
			},
			{
				name: 'Appearance',
				icon: 'droplet'
			},
			{
				name: 'Keyboard',
				icon: 'command'
			},
			{
				name: 'Addons',
				icon: 'package'
			},
			{
				name: 'Credits',
				icon: 'info'
			}
		],

		sidebar: { // Used to render the app's sidebar(s)
			left: [
				{
					'icon': 'plus',
					'name': 'New File',
					'action': ()=>{
						Scrivi.newFile('Simple');
						Scrivi.notif('File Created', {icon: 'check', color: 'var(--notif-success)'});
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
		}
	},
	methods: {

		blip(elmnt) {
			$(elmnt).addClass('dying').fadeOut(200,()=>{
				$(elmnt).remove();
			});
		},

		toggleSettings() {
			Scrivi.ui.menublur = !Scrivi.ui.menublur; // Toggle blur.
			Scrivi.ui.settingsmenu = !Scrivi.ui.settingsmenu; // Toggle menu.
			if (!Scrivi.ui.settingsmenu) {
				Scrivi.saveData('settings');
				Scrivi.notif('Settings saved.', {icon: 'check', color: 'var(--notif-success)'});
			};
		},

		toggleFileMenu() {
			Scrivi.ui.menublur = !Scrivi.ui.menublur; // Toggle blur.
			Scrivi.ui.filesmenu = !Scrivi.ui.filesmenu; // Toggle menu.
		},

		getFileList(pth) { // Gets the file/folder list for a specified directory.

			let x = Scrivi.file.dblist; // Full list of files.
			let i = pth || Scrivi.path; // Path to specified folder.

			i = i.split('\\') // Splits the path into a list of directories.
			i.shift(); // Removes the first folder, which is root.

			i.forEach((elm,ind)=>{ // Gets deeper into the directory for each dir.
				x = x.folders[elm];
			});
			return x;

		},

		openSettingsTab(tab) { Scrivi.settingspage = tab.name },

		createFileTemplate(input) {
			Scrivi.filetemplates[input.name] = input;
			Scrivi.templatelist.push(input.name);
		},

		newFile(templatename) {

			$('#editor').empty().append( $(`<div id='costruire'></div>`) );

			let t = Scrivi.filetemplates[templatename];
			let date = new Date().toDateString();

			Scrivi.currentfile = {
				filepath: false,
				template: templatename,
				filedata: t.filedata,
				author: Scrivi.settings.authorname,
				metadata: {
					scripts: [],
					dateCreated: date,
					dateModified: date
				},
				tags: []
			};
			Scrivi.unsavedchanges = false;

			Scrivi.editorcomponent = new t.component;
			Scrivi.editorcomponent.$mount('#costruire');

			t.events.onopened(Scrivi.currentfile); // Runs opening function.
			Scrivi.fileDataBind(); // Binds data from the DOM to the file data.

		},

		saveFile() {
			if (Scrivi.currentfile.filepath) {

			} else {
				Scrivi.saveFileAs();
			}
		},

		saveFileAs() {
			alert('Save As');
		},

		openFile() {

		},

		fileDataBind() { // Causes the `filedata` to update when element values are changed.
			$('#editor [fd_bind]').each((i,e)=>{
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
			req.onerror = ()=>{ Scrivi.notif('Error saving '+ label +'.', {'color': 'var(---notif-error)'}) };
			req.onsuccess = ()=>{
				if (onsuccess) { onsuccess() };
				//\/\/\Scrivi.notif('Datapoint Saved', {'icon': 'check', 'color': 'var(--notif-success)'});
			};
		},

		loadData(label, onsuccess, defaultset=true, updater=false) {
			let setstore = Scrivi.idb.transaction(['appdata']).objectStore('appdata');
			let req = setstore.get(label);
			req.onerror = ()=>{ Scrivi.notif('Error loading '+ label +'.', {'color': 'var(---notif-error)'}) };
			req.onsuccess = ()=>{
				if (!req.result) { // If no value.
					Scrivi.notif('No '+ label +' found.', {'color': 'var(---notif-error)'});
				} else { // If value exists

					//\/\/\Scrivi.notif('Datapoint Loaded', {'icon': 'check', 'color': 'var(--notif-success)'});
					if (onsuccess) { onsuccess(req.result.value) }; // Custom success event.
					if (defaultset) { // Sets Scrivi property of the same name to the value.
						if (updater && typeof req.result.value === 'object') {
							// This if adds each property to the existent object to account for possibly added values.
							// Only occurs if the updater peram is true.
							Object.assign(Scrivi[label], req.result.value);
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
		}

	}
});


// Initialize Icons.
feather.replace({'class': 'icon'});