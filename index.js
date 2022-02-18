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
			filepath: false, // Path to the open file.
			template: false, // Name of the template the file is built from.
			filedata: {}, // Internal file data.
			author: false, // Author of the file.
			metadata: {}, // Holds data like scripts and dates.
			tags: [] // Used to organize files.
		},
		editorcomponent: false, // Component used by the editor.

		rootpath: {}, // 

		filetemplates: {
			templist: [], // List of all templates by order.
			components: {}, // Template components by name.
			startup: 'New File' // Action at program startup.
		},

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
					'action': ()=>{ Scrivi.notif('Save File', {icon: 'save'}) }
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

		openSettingsTab(tab) { Scrivi.settingspage = tab.name },

		createFileTemplate(input) {

			Scrivi.filetemplates.templist.push({
				'name': input.name, 'icon': input.icon, 'author': input.author
			});
			Scrivi.filetemplates.components[input.name] = input.component;

		},

		newFile(templatename) {

			$('#editor').empty().append( $(`<div id='costruire'></div>`) );

			Scrivi.currentfile = {
				filepath: false,
				template: templatename,
				filedata: {},
				author: false,
				metadata: {},
				tags: []
			};

			Scrivi.editorcomponent = new Scrivi.filetemplates.components[templatename];
			Scrivi.editorcomponent.$mount('#costruire');

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
			let notif = $('<div class="notif">'+icon+text+'</div>').on('click', (event)=>{Scrivi.blip(event.currentTarget)});

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
			Scrivi.notif('Erasing All Data...', {icon: 'check', color: 'var(--notif-success)'})
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