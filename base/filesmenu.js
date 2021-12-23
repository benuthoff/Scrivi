// Files Menu for Scrivi
// Ben Uthoff

function toggleFilesMenu() {
	$('#filesmenu_blind').toggleClass('visible');
	$('body').toggleClass('menu_blur');
};

function isValidFileName(str) {
	let rg = /[A-Za-z0-9()!@#^&()_+;.,]+/g;
};