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

	setTimeout(()=>{
		createNotif('ScriviDB Loaded.', {icon: 'check', color: 'var(--theme-notifsuccess)'});
	}, 150);
	db = event.target.result;

	// Load Settings.
	loadDataPoint('settings', (value)=>{
		// Saved values
		Object.keys(value).forEach((indx)=>{
			usersettings[indx] = value[indx];
		});
		// Run saved settings when page loaded in;
		executeAllSettings();
		// Startup Setting
		if (usersettings.startup === 'newfile') {
			newFile('simple');
		} else if (usersettings.startup === 'templates') {
			newFile();
		};
	}, dflt=usersettings);

	// Load Path for ROOT drive.
	loadDataPoint('rootpath', (value)=>{
		rootpath=value;
		drives["root"].render();
	}, dflt=rootpath);

};

function loadDataPoint(label, onsuccess, dflt=undefined) {
	let setstore = db.transaction(['userdata']).objectStore('userdata');
	let req = setstore.get(label);
	req.onerror = (event)=>{ error('Error loading '+label+'.') };
	req.onsuccess = (event)=>{
		if (req.result) {
			onsuccess(req.result.value);
		} else { // If there is no result, save the default value.
			saveDataPoint(label, dflt);
		};
	};
};

function saveDataPoint(label, value) {
	let req = db.transaction(['userdata'], 'readwrite')
		.objectStore('userdata').put({'label': label, 'value': value});
	req.onerror = ()=>{ error('Error saving '+label+'.') };
	//req.onsuccess = ()=>{ createNotif('Datapoint Saved', {icon: 'check', color: 'var(--theme-notifsuccess)'}) };
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