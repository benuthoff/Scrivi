// Settings for Scrivi
// Ben Uthoff

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

function setTheme(id) {

	// Remove all themes
	let cl = $('body').attr('class').split(' ');
	cl.forEach(element => {
		if (element.startsWith('theme_')) {
			$('body').removeClass(element);
		};
	});

	$('body').addClass('theme_'+id);

};