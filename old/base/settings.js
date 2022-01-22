// Settings for Scrivi
// Ben Uthoff

var usersettings = {
	'theme': 'Dark',
	'sidebar_autoHide': false,
	'authorname': 'Anonymous',
	'startup': 'newfile',
	'devtools_userdata': false
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
		// Change the value and add the hiding css class.
		$('#sidebar_autoHide').attr('value', usersettings.sidebar_autoHide);
		$('#sideleft').attr('autohide', usersettings.sidebar_autoHide);
	},

	'authorname': () => {
		$('#authorname').val(usersettings.authorname);
	},

	'startup': () => {
		$('#startup').attr('value', usersettings.startup);
	},

	'devtools_userdata': ()=>{
		// Set the value.
		$('#devtools_userdata').attr('value', usersettings.devtools_userdata);
		// If set to true, add to the drive list.
		if (usersettings.devtools_userdata) {
			if ($('#dvsel').length == 0) { // If the drive isnt listed yet...
				$('#rtsel').after( // Add after the ROOT drive.
					$('<h2 id="dvsel"><i data-feather="database"></i> User Data</h2>').click(()=>{
						drives['userdata'].render();
					})
				);
				feather.replace({'stroke-width': 2, 'width': 24, 'height': 24, 'class': 'icon'});
			};
		} else {
			$('#dvsel').remove();
		};
	}


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
	$('.settingspage .xinput input').on('blur', settingsXInput);
	$('.settingspage .xinput select').on('change', settingsXInput);
	
};

function sttng(id, value) {
	// Set the Value
	usersettings[id] = value;
	// Execute Function
	settingfunctions[id]();
	// Save to DB
	saveDataPoint('settings', usersettings);
};