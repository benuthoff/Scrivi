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
	editData('userdata', 'theme', id);

};

var __defaultsettings = [
	['theme', 'Mocha'],
	['sideBar_autoHide', false]
];
function saveDefaultSettings() {

	var store = db.transaction('userdata', 'readwrite').objectStore('userdata');

	// Get All Keys in Storage
	store.getAllKeys().onsuccess = function(event) {

		let list = event.target.result;

		// Add Default Values for Keys not Present
		for (let i=0; i<__defaultsettings.length; i++) {

			let set = __defaultsettings[i];
			if (!list.includes(set[0])) {
				let radd = store.add({'setting': set[0], 'value': set[1]});
				radd.onsuccess = function() {
					createNotif('Added '+set[0]+' to DB.', {color: 'green'});
				};
			};

		};
	};
};