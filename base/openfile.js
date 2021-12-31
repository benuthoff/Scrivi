// File Types and Present File Management for Scrivi
// Ben Uthoff

var filetemplates = {

	'simple': {
		'displayname': 'Simple', // Display Name
		'icon': 'file-text', // Icon used for the template and file.
		'html': '<div class="topbound"><div class="title" contenteditable spellcheck="false">\
			</div><div class="divider"></div></div><div class="body" contenteditable spellcheck="false"></div>',
		'css': '',
		'scripts': {
			'save': function(mtdt) {
				mtdt.title = $('#editor .title').html();
				mtdt.body = $('#editor .body').html();
				return mtdt;
			},
			'load': function(mtdt) {
				$('#editor .title').html(mtdt.title);
				$('#editor .body').html(mtdt.body);
			},
			'edit': function (mtdt, evnt) {
				if ($('#editor .title').text() === '') { $('#editor .title').empty() };
				if ($('#editor .body').text() === '') { $('#editor .body').empty() };
			},
			'close': function(mtdt) {}
		},
		'metadata': {
			'title': '',
			'body': ''
		}
	},

	'notebook': {
		'displayname': 'Notebook',
		'icon': 'book', 
		'html': '<div class="title">Under Construction...</div>',
		'css': '#editor { display: flex; user-select: none; }',
		'scripts': {
			'save': function(mtdt) {

			},
			'load': function(mtdt) {
				$('body').addClass('wide_editor');
			},
			'close': function(mtdt) {
				$('body').removeClass('wide_editor');
			}
		},
		'metadata': {}
	},
	
	'userdata': {
		'displayname': false,
		'icon': 'archive',
		'html': '<div class="body" contenteditable spellcheck="false"></div>',
		'css': '',
		'scripts': {
			'save': function(mtdt) {
				mtdt.value = $('#editor .body').text();
				return mtdt;
			},
			'load': function(mtdt) {
				$('#editor .body').text(mtdt.value);
			},
			'edit': function (mtdt, evnt) {

			},
			'close': function(mtdt) {
				
			}
		},
		'metadata': {
			'value': '',
		}
	}
};

var currentfile;
var unsavedchanges = false;

function newFile(templatename) {

	// Warn about unsaved changes.
	if (unsavedchanges) {

		createDialog('You have unsaved changes. Continue?', [
			['Save and Continue', ()=>{
				saveFile(); newFile();
			}],
			['Ignore', ()=>{
				unsavedchanges=false;
				newFile();
			}],
			['Cancel']
		]);

	// Opens the template view if peramteter not specified.
	} else if (!templatename) {

		// Close current file.
		if (currentfile) {
			filetemplates[currentfile.template].scripts.close(currentfile.metadata);
			$('#editor').html('');
			$('#templatecss').text('');
			currentfile = undefined;
		};

		// Open Template View
		$('#filetemps').css('display', 'block');

	// Open a new file with the provided template name.
	} else {

		openFile({
			'path': 'root\\default.scv', //false,
			'metadata': Object.assign({}, filetemplates[templatename].metadata),
			'template': templatename,
			'author': usersettings.authorname,
			'scripts': []
		});

	};

};

function loadFile(path) {

	let d = path.split('\\')[0]; // Get the drive name.

	if (unsavedchanges) {
		createDialog('You have unsaved changes. Continue?', [
			['Save and Continue', ()=>{
				saveFile(); drives[d].load(path);
			}],
			['Ignore', ()=>{
				unsavedchanges=false; drives[d].load(path);
			}],
			['Cancel']
		]);
	} else {
		drives[d].load(path);
	};

};

function openFile(data) {

	if (Object.keys(filetemplates).includes(data.template)) {

		// Hide the Template and Files menus.
		$('#filetemps').fadeOut(100);
		$('#filesmenu_blind').removeClass('visible');
		$('body').removeClass('menu_blur');

		// Set the current file.
		currentfile = data;

		// Wrap the template.
		let t = filetemplates[data.template];
		$('#editor').html(t.html);
		$('#editor').attr('template', data.template);
		$('#templatecss').text(t.css);
		t.scripts.load(data.metadata);

		// Detect Changes
		$('#editor [contenteditable]').on('input', (e)=>{
			unsavedchanges = true;
			if (filetemplates[currentfile.template].scripts.edit) {
				filetemplates[currentfile.template].scripts.edit(currentfile.metadata,e);
			};
		});

	} else {

		createNotif('Unable to load file, template not found.', {
			icon: 'alert-triangle', color: 'var(--theme-notiferror)'
		});

	};

};

function saveFile() {

	if (currentfile && unsavedchanges) {

		// Update the file's metadata.
		currentfile.metadata = filetemplates[currentfile.template].scripts.save(currentfile.metadata);

		// Clear changes.
		unsavedchanges = false;

		// If the current file has a path to save to
		if (currentfile.path) {

			drives[currentfile.path.split('\\')[0]].save(currentfile);

		// If the current file has DOESNT have a path yet.
		} else {

		};

	} else if (currentfile && !unsavedchanges) {
		createNotif('There are no changes.');
	};

};

function saveFileAs() {

};