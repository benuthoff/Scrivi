// Data Management for Scrivi
// Ben Uthoff

// For Test Purposes - Delete Database 
/*var request = indexedDB.deleteDatabase('ScriviDB');
request.onerror = ()=>{ createNotif('Error Deleting "ScriviDB".', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };*/


/* For Test Purposes - Create Database */
var db;
var request = window.indexedDB.open('ScriviDB', 1);
request.onupgradeneeded = function(event) {

	// Create the Database
	createNotif('Creating ScriviDB...', {icon: 'loader'});
	
	db = event.target.result;

	// Create the Note Storage
	var nstore = db.createObjectStore('notes', { keyPath: 'fileName'});
	nstore.createIndex('author', 'author', { unique: false })
	nstore.createIndex('metadata', 'metadata', { unique: false });
	nstore.createIndex('template', 'template', { unique: false });
	nstore.createIndex('scipts', 'scripts', { unique: false });
	nstore.createIndex('tags', 'tags', { unique: false });

	// Create User Metadata Storage
	var ustore = db.createObjectStore('userdata', { keyPath: 'label'});
	ustore.createIndex('value', 'value', { unique: false });
	ustore.add({'label': 'settings', 'value': usersettings});

};
request.onerror = ()=>{ createNotif('Error Creating ScriviDB.', {icon: 'alert-triangle', color: 'var(--theme-notiferror'}) };
request.onsuccess = function(event) {
	createNotif('Loaded ScriviDB.', {icon: 'check', color: 'var(--theme-notifsuccess)'});
	db = event.target.result;

	// Get and load Settings;
	let setstore = db.transaction(['userdata']).objectStore('userdata');
	let req = setstore.get('settings');
	req.onerror = (event)=>{ createNotif('Error loading settings.', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };
	req.onsuccess = (event)=>{
		// Saved values
		let savesettings = req.result.value;
		Object.keys(savesettings).forEach((indx)=>{
			usersettings[indx] = savesettings[indx];
		});

		// Run saved settings when page loaded in;
		executeAllSettings();
	};

	// ...

};

function __resetAll() {

	createDialog('Are you sure you want to reset everything? All data will be lost.', [
		['Yes', ()=>{

			var request = indexedDB.deleteDatabase('ScriviDB');
			createNotif('Erasing ScriviDB...', {icon: 'check', color: 'var(--theme-notifsuccess)'})
			setTimeout(function(){
				window.location.href = window.location.href;
			}, 1000);

		}],
		'Cancel'
	]);

};