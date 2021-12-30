// Data Management for Scrivi
// Ben Uthoff

// For Test Purposes - Delete Database 
/*var request = indexedDB.deleteDatabase('ScriviDB');
request.onerror = ()=>{ createNotif('Error Deleting "ScriviDB".', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };*/

createNotif('Loading ScriviDB...', {icon: 'loader'});

/* For Test Purposes - Create Database */
var db;
var dbrequest = window.indexedDB.open('ScriviDB', 1);
dbrequest.onupgradeneeded = function(event) {

	// Create the Database
	createNotif('Creating ScriviDB...', {icon: 'loader'});
	
	db = event.target.result;

	// Create the Note Storage
	var nstore = db.createObjectStore('notes', { keyPath: 'path'});
	nstore.createIndex('author', 'author', { unique: false })
	nstore.createIndex('metadata', 'metadata', { unique: false });
	nstore.createIndex('template', 'template', { unique: false });
	nstore.createIndex('scipts', 'scripts', { unique: false });

	// Create User Metadata Storage
	var ustore = db.createObjectStore('userdata', { keyPath: 'label'});
	ustore.createIndex('value', 'value', { unique: false });
	ustore.add({'label': 'settings', 'value': usersettings});

};
dbrequest.onerror = ()=>{ createNotif('Error Creating ScriviDB.', {icon: 'alert-triangle', color: 'var(--theme-notiferror'}) };
dbrequest.onsuccess = function(event) {
	createNotif('ScriviDB Loaded.', {icon: 'check', color: 'var(--theme-notifsuccess)'});
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
		// Startup Setting
		if (usersettings.startup === 'newfile') {
			newFile('simple');
		} else if (usersettings.startup === 'templates') {
			newFile();
		};
	};

	// Load User Data to variables.
	loadDataPoint(rootpath, 'rootpath');

	// Execute datapoints where applicable.
	drives["root"].render(); // (Uses `rootpath`)

};

function loadDataPoint(variable, label, defaultset=true) {
	let setstore = db.transaction(['userdata']).objectStore('userdata');
	let req = setstore.get(label);
	req.onerror = (event)=>{ createNotif('Error loading '+label+'.', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };
	req.onsuccess = (event)=>{
		if (req.result) {
			variable = req.result.value;
		} else { // If there is no result, save the default value.
			saveDataPoint(label, variable);
		};
	};
};

function saveDataPoint(label, value) {
	let req = db.transaction(['userdata'], 'readwrite')
		.objectStore('userdata').put({'label': label, 'value': value});
	req.onerror = ()=>{ createNotif('Error saving '+label+'.', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };
	//req.onsuccess = ()=>{ createNotif('Settings Saved', {icon: 'check', color: 'var(--theme-notifsuccess)'}) };
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