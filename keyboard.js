// Scrivi App Keyboard Commands //
// by Ben Uthoff


document.addEventListener('keydown', function(e) {

	let map = Scrivi.keyboard;
	let mapmatch = (k) => { // Matches keymap to inputed key
		if (e.key.toLowerCase() === k[0].toLowerCase() && e.ctrlKey === k[1] && e.shiftKey === k[2]) {
			return true;
		} else { return false };
	};

	// Change Keyset for Command.
	if (Scrivi.keyedit && e.key !== 'Shift' && e.key !== 'Control') {
		e.preventDefault();
		let kk = e.key.charAt(0).toUpperCase() + e.key.slice(1);
		Scrivi.keyboard[Scrivi.keyedit] = [kk, e.ctrlKey, e.shiftKey];
		Scrivi.editKeyCode(false);
		Scrivi.saveData('keyboard');
		return;
	};

	// Dialog commands.
	if (Scrivi.dialogs.length > 0) {
		let all = Scrivi.dialogs[0].buttons;
		all.forEach((btn,i) => {
			if ( btn[2] && mapmatch(map[ btn[2] ]) ) {
				btn[1](); Scrivi.dialogs.shift();
			};
		});
	};

	// New File
	if (mapmatch(map.newfile) && !Scrivi.ui.menublur && !Scrivi.ui.uiblur) {
		e.preventDefault();
		Scrivi.newFile('Simple');
	};

	// Save File
	if (mapmatch(map.save) && !Scrivi.ui.menublur && !Scrivi.ui.uiblur) {
		e.preventDefault();
		Scrivi.saveFile();
	};
	// Save File As
	if (mapmatch(map.saveas) && !Scrivi.ui.menublur && !Scrivi.ui.uiblur) {
		e.preventDefault();
		Scrivi.toggleSaveAsDialog();
	};

	// Enter
	if (mapmatch(map.enter)) {

		if (Scrivi.ui.saveas) { Scrivi.saveFileAs() };

	};

	// Cancel/ Exit out of UI
	if (mapmatch(map.cancel)) {

		e.preventDefault();

		// Out of settings menu.
		if (Scrivi.ui.settingsmenu) { Scrivi.toggleSettings(); return; };
		// Out of files menu.
		if (Scrivi.ui.filesmenu) { Scrivi.toggleFilesMenu(); return; };
		// Out of save-as dialog.
		if (Scrivi.ui.saveas) { Scrivi.toggleSaveAsDialog(); return; };
		// Out of file info dialog.
		if (Scrivi.ui.fileinfo) { Scrivi.ui.fileinfo = false; return; };

	};

	// Open Files Menu
	if (mapmatch(map.filesmenu) && ((!Scrivi.ui.menublur && !Scrivi.ui.uiblur) || Scrivi.ui.filesmenu)) {
		e.preventDefault();
		Scrivi.toggleFilesMenu();
		return;
	};

	// Delete Selected files-
	if (mapmatch(map.delete_sel) && Scrivi.ui.filesmenu && Scrivi.filesmenu.sel.length > 0) {
		Scrivi.deleteWarning();
		return;
	};

	// Open Settings - If there are no menus open OR settings menu is open.
	if (mapmatch(map.settings) && ((!Scrivi.ui.menublur && !Scrivi.ui.uiblur) || Scrivi.ui.settingsmenu)) {
		e.preventDefault();
		Scrivi.toggleSettings();
		return;
	};

	// Navigation Forward + Backward
	if (mapmatch(map.nav_fwrd)) {
		if ($(':focus').attr('nav') === 'true') {
			console.log('Forward!');
			return;
		} else {
			e.preventDefault();
		};

		if (Scrivi.ui.settingsmenu) {
			let tab = $('#settings #tabs > div.sel').next();
			if (tab.length === 0) { tab = $('#settings #tabs > div').first() };
			tab.click();
			return;
		};

		if (Scrivi.ui.filesmenu) {
			let tab = $('#filenav > div.sel').next();
			if (tab.length === 0) { tab = $('#filenav > div').first() };
			tab.click();
			return;
		};

	};
	if (mapmatch(map.nav_back)) {
		if ($(':focus').attr('nav') === 'true') {
			console.log('Forward!');
			return;
		} else {
			e.preventDefault();
		};

		if (Scrivi.ui.settingsmenu) {
			let tab = $('#settings #tabs > div.sel').prev();
			if (tab.length === 0) { tab = $('#settings #tabs > div').last() };
			tab.click();
			return;
		};

		if (Scrivi.ui.filesmenu) {
			let tab = $('#filenav > div.sel').prev();
			if (tab[0].nodeName === 'H1') { tab = $('#filenav > div').last() };
			tab.click();
			return;
		};

	};

});