// Keyboard Controls for Scrivi
// Ben Uthoff

document.addEventListener('keydown', function(e) {

	if (e.key === 's' && e.ctrlKey) {
		e.preventDefault();
		createNotif('Under Construction', {icon: 'alert-triangle'});
	}

	else if (e.key === 'Escape') {

		if ($('#settings_blind').hasClass('visible')) {
			toggleSettings();
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

		e.preventDefault();
		toggleSettings();

	};

});