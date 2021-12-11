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

	else if (e.key === 'q' && e.ctrlKey) {

		e.preventDefault();
		toggleSettings();

	};

});