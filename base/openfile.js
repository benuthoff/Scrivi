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
		'html': '',
		'css': '',
		'scripts': {
			'save': function(mtdt) {},
			'load': function(mtdt) {}
		},
		'metadata': {}
	}
};

var currentfile;
var unsavedchanges = false;

function newFile(templatename) {

	if (!templatename) {

		// Close current file.
		if (currentfile) {
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
			'metadata': filetemplates[templatename].metadata,
			'template': templatename,
			'author': usersettings.authorname,
			'scripts': [],
			'tags': []
		});

	};

};

function openFile(data) {

	if (Object.keys(filetemplates).includes(data.template)) {

		// Hide the Template menu.
		$('#filetemps').css('display', 'none');

		// Set the current file.
		currentfile = data;

		// Wrap the template.
		let t = filetemplates[data.template];
		$('#editor').html(t.html);
		$('#templatecss').text(t.css);
		t.scripts.load(data.metadata);

	} else {

		createNotif('Unable to load file, template not found.', {
			icon: 'alert-triangle', color: 'var(--theme-notiferror)'
		});

	};

};

function saveFile() {

	//if (unsavedchanges) {

	currentfile.metadata = filetemplates[currentfile.template].scripts.save(currentfile.metadata);

	console.log(currentfile.metadata)
		
	//};

};