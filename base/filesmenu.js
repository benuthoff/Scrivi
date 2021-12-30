// Files Menu for Scrivi
// Ben Uthoff

var rootpath = {
	'files': [
		{
			'path': 'root\\reminder.scv',
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
};

function toggleFilesMenu() {
	$('#filesmenu_blind').toggleClass('visible');
	$('body').toggleClass('menu_blur');
};

function parsePath(path) {
	let split = path.split('\\');
	if (split[0] === 'root') {

	};
};

function isValidFileName(str) {
	let rg = /^[A-Za-z0-9()!@#^&()_+;.,]+$/g;
	return rg.test(str);
};

function addFileIcon(filedata) {

	// Create element.
	let i = $('<div class="file"></div>');
	i.append( $('<i data-feather="'+ filetemplates[filedata.template].icon +'"></i>') );
	i.append( $('<div></div>').text(filedata.name) );

	// Give element event.
	i.on('dblclick', ()=>{
		console.log(filedata);
		loadFile(filedata.path);
	});

	// Send element to page.
	$('#fileview').append(i);
	feather.replace({'stroke-width': 2, 'width': 52, 'height': 52, 'class': 'icon'});

};