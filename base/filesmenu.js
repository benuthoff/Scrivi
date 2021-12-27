// Files Menu for Scrivi
// Ben Uthoff

var rootpath = {
	'files': [
		{
			'name': 'reminder.scv',
			'template': 'simple',
			'author': 'testuser',
			'scripts': [],
			'tags': []
		}
	],
	'folders': {
		'Examples': {
			'files':[],
			'folders': {}
		}
	}
}

function toggleFilesMenu() {
	$('#filesmenu_blind').toggleClass('visible');
	$('body').toggleClass('menu_blur');
};

function isValidFileName(str) {
	let rg = /^[A-Za-z0-9()!@#^&()_+;.,]+$/g;
	return rg.test(str);
};