// Simple File Type //
// by Ben Uthoff

Scrivi.createFileTemplate({

	name: 'Simple',
	icon: 'file-text',
	author: 'Scrivi',

	filenamedefault: 'title',

	component: Vue.extend({
		template: `<div>
			<div class='topbound'>
				<div class='title' contenteditable spellcheck='false' fd_bind='title'></div>
				<div class='divider'></div>
			</div>
			<div class='body' contenteditable spellcheck='false' fd_bind='body'></div>
		</div>`
	}),

	filedata: {
		title: '',
		body: ''
	},

	events: {
		onopened: (file)=>{}, // done
		onclosed: (file)=>{},
		onedited: (file)=>{}, // done
		onsaved: (file)=>{}
	}

});