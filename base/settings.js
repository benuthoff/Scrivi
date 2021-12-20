// Settings for Scrivi
// Ben Uthoff

var usersettings = {
	'theme': 'Dark',
	'sidebar_autoHide': false,
	'authorname': 'Anonymous'
};

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

	executeSettings();

};

function executeSettings() {

	/* Change Theme */
	// Remove all themes
	let cl = $('body').attr('class').split(' ');
	cl.forEach(element => {
		if (element.startsWith('theme_')) {
			$('body').removeClass(element);
		};
	});
	// Apply Theme
	$('body').addClass('theme_'+usersettings.theme);

	/* Auto-Hide Sidebar */
	$('#sidebar_autoHide').attr('value', usersettings.sidebar_autoHide);
	$('#sidebar').attr('autohide', usersettings.sidebar_autoHide);

	/* Author Name */
	$('#authorname input').val(usersettings.authorname);
	
}

function sttng(id, value) {
	usersettings[id] = value;
	saveAllSettings();
};