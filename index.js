// Scrivi App
// Written by Ben Uthoff

var Scrivi = new Vue({

	el: '#scriviapp',

	updated() {
		feather.replace({'class': 'icon'});
	},

	data: {

		client: 'web', // The Current Client, Web or Desktop

		currentfile: {},

		dialog: {
			visible: false,
		},

		settings: { // Attributes saved to usersettings
			sidebar_autohide: false,
			authorname: 'Anonymous'
		},

		filetemplates: [],

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

		ui: { // Holds which UI menus + features are active
			menublur: false,
			uiblur: false,
			settingsmenu: false,
		},

		sidebar: { // Used to render the app's sidebar(s)
			left: [
				{
					'icon': 'plus',
					'name': 'New File',
					'action': ()=>{ Scrivi.notif('New File', {icon: 'plus'}) }
				},
				{
					'icon': 'save',
					'name': 'Save File',
					'action': ()=>{ Scrivi.notif('Save File', {icon: 'save'}) }
				},
				{
					'icon': 'folder',
					'name': 'Files',
					'action': ()=>{ Scrivi.notif('Files', {icon: 'folder'}) }
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
			Scrivi.ui.menublur = !Scrivi.ui.menublur;
			Scrivi.ui.settingsmenu = !Scrivi.ui.settingsmenu;
		},

		openSettingsTab(tab) {
			Scrivi.settingspage = tab.name;
		},

		createFileTemplate(options) {

			// Options: {}
			// .name = String
			// .html = String (HTML)
			// .icon = String

			/*Scrivi.component(options.name, {
				template: options.html
			});*/

			/*Scrivi.filetemplates.append({
				name: options.name,
				icon: options.icon
			});*/

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