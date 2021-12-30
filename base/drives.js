var drives = {};



// ROOT DRIVE, BASE DRIVE FOR LOCAL STORAGE IN THE INDEXED DATABASE
drives['root'] = {

	'render': ()=>{ // Runs when the drive is changed in the files menu.

		// Update the pathbar.
		$('#pathbar').html('<i data-feather="hard-drive"></i><div contenteditable spellcheck="false">//</div>');
		feather.replace({'stroke-width': 2, 'width': 24, 'height': 24, 'class': 'icon'});

		// Empty the fileview.
		$('#fileview').empty();

	},

	'load': (path)=>{ // Runs when a file is loaded from this drive.

	}

};



// USERDATA DRIVE, DEVELOPER TOOL FOR VIEWING AND MANUALLY EDITING SCRIVI METADATA
drives['userdata'] = {

	'render': ()=>{ // Runs when the drive is changed in the files menu.

		// Update the pathbar.
		$('#pathbar').html('<i data-feather="database"></i><div>//</div>');
		feather.replace({'stroke-width': 2, 'width': 24, 'height': 24, 'class': 'icon'});

		// Send a request for all datapoints.
		let req = db.transaction(['userdata']).objectStore('userdata').getAllKeys();
		req.onsuccess = (event)=>{

			// For every userdata file, add an icon.
			$('#fileview').empty();
			req.result.forEach((datapoint)=>{
				addFileIcon({
					'path': 'userdata\\'+datapoint,
					'name': datapoint,
					'template': 'userdata',
					'author': 'Scrivi',
					'scripts': [],
					'tags': []
				});
			})

		};
	},

	'load': (path)=>{ // Runs when a file is loaded from this drive.

		// Get the name of the file.
		let f = path.split('\\')[1];

		// Request the file
		let setstore = db.transaction(['userdata']).objectStore('userdata');
		let req = setstore.get(f);
		req.onerror = (event)=>{ createNotif('Error loading '+f+'.', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };
		req.onsuccess = (event)=>{
			if (req.result) {
				
				// Open the file.
				openFile({
					'path': path,
					'metadata': { 'value': JSON.stringify(req.result.value, null, '\t') },
					'template': 'userdata',
					'author': 'Scrivi',
					'scripts': []
				});

			} else { // If there is no result, save the default value.
				createNotif('File not found.', {icon: 'alert-triangle', color: 'var(--theme-notiferror)'})
			};
		};

	}

};