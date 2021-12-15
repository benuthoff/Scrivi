// Data Management for Scrivi
// Ben Uthoff

// For Test Purposes - Delete Database 
var request = indexedDB.deleteDatabase('ScriviDB');
request.onerror = ()=>{ createNotif('Error Deleting "ScriviDB".', {icon: 'alert-triangle', color: 'var(--theme-notiferror'}) };
request.onsuccess = function(event) {


/* Test Data */
var notes = [
	{'fileName': 'Reminder', 'fileType': 'Simple', 'author': 'Ben Uthoff', 'metadata': {
		'title': 'Reminder', 'text': '  - get milk\n - get bread'
	}},
	{'fileName': 'Ebitto "Ebi" Karatasi', 'fileType': 'CharacterSheet', 'author': 'None', 'metadata': {
		'name': 'Ebitto "Ebi" Karatasi', 'class': 'Warlock', 'race': 'Tiefling', 'level': 1, 'experience': 100
	}}	
];


/* For Test Purposes - Create Database */
var db;
var request = window.indexedDB.open('ScriviDB', 1);
request.onupgradeneeded = function(event) {
	
	db = event.target.result;

	// Create the Note Storage
	var nstore = db.createObjectStore('notes', { keyPath: 'fileName'});
	nstore.createIndex('fileType', 'fileType', { unique: false });
	nstore.createIndex('author', 'author', { unique: false })
	nstore.createIndex('metadata', 'metadata', { unique: false });
	nstore.add(notes[0]);
	nstore.add(notes[1]);

	// Create User Metadata Storage
	var ustore = db.createObjectStore('userdata', { keyPath: 'label'});
	ustore.createIndex('value', 'value', { unique: false });
	ustore.add({'label': 'settings', 'value': usersettings});

};
request.onerror = ()=>{ createNotif('Error Creating ScriviDB.', {icon: 'alert-triangle', color: 'var(--theme-notiferror'}) };
request.onsuccess = function(event) {
	createNotif('Loaded ScriviDB.', {icon: 'check', color: 'var(--theme-notifsuccess)'});
	db = event.target.result;
};

};