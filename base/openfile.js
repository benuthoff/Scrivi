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
			'close': function(mtdt) {}
		},
		'metadata': {
			'title': 'Title',
			'body': 'Type some text here...'
		}
	},
	'notebook': {
		'displayname': 'Notebook',
		'icon': 'book', 
		'html': '<div class="title">Under Construction...</div>',
		'css': '#editor { display: flex; align-items: center; user-select: none; }',
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
	}
};

var currentfile;
var unsavedchanges = false;

function newFile(templatename) {

	if (unsavedchanges) {

		createDialog('You have unsaved changes. Continue?', [
			['Save and Exit', ()=>{
				saveFile(); newFile();
			}],
			['Forget Changes', ()=>{
				unsavedchanges=false; newFile();
			}],
			['Cancel']
		]);

	} else if (!templatename) {

		// Close current file.
		if (currentfile) {
			console.log('Overwriting file...');
			filetemplates[currentfile.template].scripts.close(currentfile.metadata);
			$('#editor').html('');
			$('#templatecss').text('');
			currentfile = undefined;
		};

		// Open Template View
		$('#filetemps').css('display', 'block');

	} else {

		openFile({
			'path': '', // root\test.scv
			'metadata': Object.assign({}, filetemplates[templatename].metadata),
			'template': templatename,
			'author': usersettings.authorname,
			'scripts': []
		});

	};

};

function openFile(data) {

	if (Object.keys(filetemplates).includes(data.template)) {

		// Hide the Template menu.
		$('#filetemps').fadeOut(100);

		// Set the current file.
		currentfile = data;

		// Wrap the template.
		let t = filetemplates[data.template];
		$('#editor').html(t.html);
		$('#templatecss').text(t.css);
		t.scripts.load(data.metadata);

		// Detect Changes
		$('#editor [contenteditable]').on('input', (e)=>{
			unsavedchanges = true;
		});

	} else {

		createNotif('Unable to load file, template not found.', {
			icon: 'alert-triangle', color: 'var(--theme-notiferror)'
		});

	};

};

var savereq = false;

function saveFile() {

	if (currentfile && unsavedchanges) {

		// Update the file's metadata.
		currentfile.metadata = filetemplates[currentfile.template].scripts.save(currentfile.metadata);
		console.log(currentfile.metadata);

		// Clear changes.
		unsavedchanges = false;
		
	} else if (!unsavedchanges) {
		createNotif('There are no changes.')
	};

};