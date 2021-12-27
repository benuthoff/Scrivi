// Keyboard Controls for Scrivi
// Ben Uthoff

document.addEventListener('keydown', function(e) {

	if (e.key === 's' && e.ctrlKey) {
		e.preventDefault();
		saveFile();
	}

	else if (e.key === 'Escape') {

		if ($('#settings_blind').hasClass('visible')) {
			toggleSettings();
		} else {
			toggleFilesMenu();
		};

	}

	else if (e.key === 'Tab') {

		if ($('#settings_blind').hasClass('visible')) {

			e.preventDefault();

			let tab;
			if (e.shiftKey) {
				tab = $('#settings #tabs .sel').prev();
				if (tab.length === 0) { tab = $('#settings #tabs div').last() };
			} else {
				tab = $('#settings #tabs .sel').next();
				if (tab.length === 0) { tab = $('#settings #tabs div').first() };
			};

			tab.click();

		};

	}

	else if (e.key === 'q' && e.ctrlKey) {

		if ($('#filesmenu_blind').css('display') === 'none') {
			e.preventDefault();
			toggleSettings();
		};

	};

});

document.addEventListener('contextmenu', function(e) {

	e.preventDefault();

});