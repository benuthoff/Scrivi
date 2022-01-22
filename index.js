// Scrivi App
// Written by Ben Uthoff

var Scrivi = new Vue({

	el: '#scriviapp',

	updated() {
		feather.replace({'class': 'icon'});
	},

	data: {

		client: 'web',

		settings: {
			autohide: false
		},

		authorname: 'Anonymous',

		settingspage: 'Basic',
		settingstabs: false,

		ui: {
			menublur: false,
			uiblur: false,
			settingsmenu: false,
		},

		sidebar: {
			left: [
				{
					'icon': 'plus',
					'name': 'New File',
					'action': ()=>{ Scrivi.notif('New File') }
				},
				{
					'icon': 'save',
					'name': 'Save File',
					'action': ()=>{ Scrivi.notif('Save File') }
				},
				{
					'icon': 'folder',
					'name': 'Files',
					'action': ()=>{ Scrivi.notif('Files') }
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
			if (Scrivi.ui.settingsmenu) { this.renderSettings() };
		},

		renderSettings() {
			
		},

		openSettingsTab(tab) {
			Scrivi.settingspage = tab.name;
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
		}
	}

});