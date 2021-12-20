// Settings for Scrivi
// Ben Uthoff

var usersettings = {
	'theme': 'Dark',
	'sidebar_autoHide': false,
	'authorname': 'Anonymous'
};

var settingfunctions = {
	'theme': () => {
		// Remove all themes
		let cl = $('body').attr('class').split(' ');
		cl.forEach(element => {
			if (element.startsWith('theme_')) {
				$('body').removeClass(element);
			};
		});
		// Apply Theme
		$('body').addClass('theme_'+usersettings.theme);
	},

	'sidebar_autoHide': () => {
		$('#sidebar_autoHide').attr('value', usersettings.sidebar_autoHide);
		$('#sidebar').attr('autohide', usersettings.sidebar_autoHide);
	},

	'authorname': () => {
		$('#authorname').val(usersettings.authorname);
	}
}

function toggleSettings() {
	$('#settings_blind').toggleClass('visible');
	$('body').toggleClass('menu_blur');
};

function openSettingsTab(id) {

	// Select Tab	
	$('#settings #tabs .sel').removeClass('sel');
	$('#settings #tabs div[tabid=' + id + ']').addClass('sel');

	// Show Correct Page
	$('.settingspage').css('display', 'none');
	$('#settings_'+id).css('display', 'block');

};

function saveAllSettings() {

	let scw = db.transaction(['userdata'], 'readwrite')
		.objectStore('userdata').put({'label': 'settings', 'value': usersettings});
	scw.onerror = ()=>{ createNotif('Error saving settings.', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };
	//scw.onsuccess = ()=>{ createNotif('Settings Saved', {icon: 'check', color: 'var(--theme-notifsuccess)'}) };

};

function executeAllSettings() {

	let all = Object.keys(settingfunctions);
	for (let i=0; i<all.length; i++) {

		settingfunctions[ all[i] ]();

	};
	
};

function settingsMenuSetup() {

	// Apply Icons & Open Default Settings Page
	feather.replace({'stroke-width': 2, 'width': 28, 'height': 28, 'class': 'icon'});
	openSettingsTab('basic');

	// Generate Theme Preview SVG
	$('.themegal > div').each( (i)=>{
		let b = $($('.themegal > div').get(i));
		let st = b.attr('st');
		b.prepend(
			'<svg class="prev" width="200px" height="120px" simtheme="' + st + '">\
			<rect class="rect" x="50" y="20" rx="4" ry="4" width="100" height="80"></rect>\
			<circle class="circ" cx="30" cy="60" r="4"></circle>\
			<circle class="circ" cx="30" cy="40" r="4"></circle>\
			\<circle class="circ" cx="30" cy="80" r="4"></circle></svg>');
	});

	// Apply Event to UI Inputs
	$('.settingspage .checkform').on('click', toggleCheckbox);
	$('.settingspage .textin input').on('blur', settingsTextin);

}

function sttng(id, value) {
	// Set the Value
	usersettings[id] = value;
	// Execute Function
	settingfunctions[id]();
	// Save to DB
	saveAllSettings();
};