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

	// Apply Theme
	$('body').addClass('theme_'+id);

	// Save to Storage
	let store = db.transaction('userdata', 'readwrite').objectStore('userdata')
	let req = store.get('theme');
	req.onerror = function() {
		createNotif('Error reaching DB.', {icon: 'alert-triangle', color: 'var(--theme-notiferror'});
	};
	req.onsuccess = function(event) {
		
		let data = event.target.result;
		data.value = id;
		let upreq = store.put(data);
		upreq.onsuccess = function() {
			createNotif('Saved to ScriviDB.', {icon: 'check', color: 'var(--theme-notifsuccess)'});
		};
		upreq.onerror = function() {
			createNotif('Error saving theme.', {icon: 'alert-triangle', color: 'var(--theme-notiferror'});
		};

	};

};