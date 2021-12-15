// Settings for Scrivi
// Ben Uthoff

var usersettings = {
	'theme': 'Light',
	'sidebar_autoHide': false
};

function toggleSettings() {
	$('#settings_blind').toggleClass('visible');
	$('body').toggleClass('blur');
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
	scw.onsuccess = ()=>{ createNotif('Settings Saved', {icon: 'check', color: 'var(--theme-notifsuccess)'}) };

};

function executeSettings() {

	setTheme(usersettings.theme);
	
}

function setTheme(id) {

	// Remove all themes
	let cl = $('body').attr('class').split(' ');
	cl.forEach(element => {
		if (element.startsWith('theme_')) {
			$('body').removeClass(element);
		};
	});

	// Apply Theme
	$('body').addClass('theme_'+id);
	usersettings.theme = id;
	saveAllSettings();

};