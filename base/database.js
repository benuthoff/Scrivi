// Data Management for Scrivi
// Ben Uthoff

/* For Test Purposes - Delete Database 
var request = indexedDB.deleteDatabase('ScriviDB');
request.onerror = ()=>{ createNotif('Error Deleting "ScriviDB".', {icon: 'alert-triangle', color: 'var(--theme-notiferror'}) };
request.onsuccess = ()=>{ createNotif('Deleted "ScriviDB".', {icon: 'check', color: 'var(--theme-notifsuccess)'}) };*/


/* Test Data */
var notes = [
	{'fileName': 'Reminder', 'fileType': 'Simple', 'metadata': {
		'title': 'Reminder', 'text': '  - get milk\n - get bread'
	}},
	{'fileName': 'Ebitto "Ebi" Karatasi', 'fileType': 'CharacterSheet', 'metadata': {
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
	nstore.createIndex('metadata', 'metadata', { unique: false });

	// Create User Metadata Storage
	var metastore = db.createObjectStore('userdata', { keyPath: 'setting'});
	nstore.createIndex('value', 'value', { unique: false });

	// Create Addon Data Storage
	var addstore = db.createObjectStore('addons', { keyPath: 'addonId'});

};
request.onerror = ()=>{ createNotif('Error Creating ScriviDB.', {icon: 'alert-triangle', color: 'var(--theme-notiferror'}) };
request.onsuccess = function(event) {
	createNotif('Loaded ScriviDB.', {icon: 'check', color: 'var(--theme-notifsuccess)'});
	db = event.target.result;

	/*var nstore = db.transaction('notes', 'readwrite').objectStore('notes');
	nstore.add(notes[0]);
	nstore.add(notes[1]);

	var metastore = db.transaction('userdata', 'readwrite').objectStore('userdata');
	metastore.add({ setting: 'theme', value: 'Mocha' });*/

	let autotheme = db.transaction('userdata').objectStore('userdata').get('theme');
	autotheme.onerror = function() {
		createNotif('Error loading theme.', {icon: 'alert-triangle', color: 'var(--theme-notiferror'});
	};
	autotheme.onsuccess = function(event) {
		setTheme(event.target.result.value);
	};
	

};