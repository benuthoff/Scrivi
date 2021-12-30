// Files Menu for Scrivi
// Ben Uthoff

var menupath = 'root\\';
var rootpath = {
	'files': {
		'reminder.scv': {
			'path': 'root\\reminder.scv',
			'template': 'simple',
			'author': 'testuser',
			'scripts': [],
			'tags': []
		}
	},
	'folders': {
		'Examples': {
			'files': [
				{
					'path': 'root\\Examples\\Test.scv',
					'template': 'simple',
					'scripts': [],
					'tags': []
				}
			],
			'folders': {

			}
		}
	}
};

function toggleFilesMenu() {
	$('#filesmenu_blind').toggleClass('visible');
	$('body').toggleClass('menu_blur');
};

function parsePath(path) { // Algorithm used for rendering under the root directory.
	
	// Test: parsePath('root\\Examples\\Test.scv');

	// Trim end of menupath(?)
	if (path.endsWith('\\')) { path.slice(0,-2)	};

	let ccc = rootpath; // REMINDER: parsePath returns a POINTER to rootpath.
	let split = path.split('\\');
	split.shift(); // Removes the drive name.
	let lastitem = split.pop(); // Saves the last element.
	
	// Go deeper within the CCC for each directory "split".
	for (let i=0; i<split.length; i++) {
		let ctwo = ccc.folders[ split[i] ];
		if (ctwo) {
			ccc = ctwo;
		} else {
			// ERROR! Directory not found.
			return false;
		};
	};

	// Check last item to tell if its a file. Prioritize it being a folder.
	if (lastitem === '') { // When empty

	} else if (ccc.folders[lastitem]) { // When a folder
		ccc = ccc.folders[lastitem];
	} else if (ccc.files[lastitem]) { // When a file
		loadFile(ccc.files[lastitem].path);
	} else { // When error
		return false;
	};

	return ccc;

};

function isValidFileName(str) {
	let rg = /^[A-Za-z0-9()!@#^&()_+;.,]+$/g;
	return rg.test(str);
};

function addFileIcon(filedata, fldr=false) {

	// If file, use template icon.
	let icn = 'folder';
	if (!fldr) { icn = filetemplates[filedata.template].icon };

	// Create element.
	let i = $('<div class="file"></div>');
	i.append( $('<i data-feather="'+ icn +'"></i>') );
	i.append( $('<div></div>').text(filedata.name) );

	// Event on double click.
	if (fldr) { // FOLDER Event
		i.on('dblclick', ()=>{
			if (!menupath.endsWith('\\')) { menupath+='\\' };
			menupath += filedata.name;
			drives[menupath.split('\\')[0]].render();
		});

	} else { // FILE Event
		i.on('dblclick', ()=>{
			loadFile(filedata.path);
		});
	};

	// Send element to page.
	$('#fileview').append(i);
	feather.replace({'stroke-width': 2, 'width': 52, 'height': 52, 'class': 'icon'});

};