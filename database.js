// Database Management //
// by Ben Uthoff

// Check if indexedDB exists...
if (window.indexedDB) {
	Scrivi.idbenabled = true
};

// Deletes database for testing purposes
/*indexedDB.deleteDatabase('scriviapp').onerror=()=>{ 
	Scrivi.notif('Error Deleting database.', {icon: 'alert-triangle', color: 'var(--notif-error)'});
};*/

let request = window.indexedDB.open('scriviapp', 1);
request.onerror = (event) => {
	console.log('There was an error loading the database.');
};
request.onsuccess = (event) => {
	Scrivi.idb = event.target.result;
	setTimeout(()=>{ // Timeout Database load.
		Scrivi.notif('Database Loaded.', {icon: 'check', color: 'var(--notif-success)'});
	}, 200);
	Scrivi.idb.onerror = (e)=>{ console.error('DB Error: '+ e.target.errorCode) };

	// Load Data!
	Scrivi.loadData('settings', ()=>{}, defaultset=true, updater=true);
	Scrivi.loadData('file', ()=>{}, defaultset=true, updater=true);
	Scrivi.loadData('keyboard', ()=>{}, defaultset=true, updater=true);

	// Open empty file.
	Scrivi.newFile('Simple');

};
request.onupgradeneeded = (event) => {

	Scrivi.notif('Creating ScriviDB...', {icon: 'loader'});
	Scrivi.idb = event.target.result;

	// Store for locally stored files.
	var rootdrive = Scrivi.idb.createObjectStore('rootdrive', { keyPath: 'filepath' });
	['template', 'filedata', 'author', 'metadata', 'tags'].forEach((value)=>{
		rootdrive.createIndex(value, value, { unique: false });
	});

	// Store for app metadata such as settings, path variable, templates, etc.
	var appdata = Scrivi.idb.createObjectStore('appdata', { keyPath: 'label' });
	appdata.createIndex('value', 'value', { unique: false });

	appdata.add({ label: 'settings', value: Scrivi.settings }); // User Settings
	appdata.add({ label: 'file', value: Scrivi.file }); // Root Drive Path
	// appdata.add({ label: 'filetemplates', value: Scrivi.filetemplates }); // Saved file templates

};





// Serialize Deserialize Functions for JSON //
// Written by Ben Morel https://stackoverflow.com/users/759866/benmorel
// https://stackoverflow.com/questions/22545031/store-a-function-in-indexeddb-datastore
/*
function serialize(key, value) {
    if (typeof value === 'function') {
        return value.toString();
    };
    return value;
};

function deserialize(key, value) {
    if (value && typeof value === 'string' && value.substring(0, 8) === 'function') {
        var startBody = value.indexOf('{') + 1;
        var endBody = value.lastIndexOf('}');
        var startArgs = value.indexOf('(') + 1;
        var endArgs = value.indexOf(')');
        return new Function(value.substring(startArgs, endArgs), value.substring(startBody, endBody));
    };
    return value;
};*/