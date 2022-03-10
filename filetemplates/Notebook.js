// Simple File Type //
// by Ben Uthoff

Scrivi.createFileTemplate({

	name: 'Notebook',
	icon: 'book',
	author: 'Scrivi',

	filenamedefault: 'title',

	component: Vue.extend({
		template: `<div>
			<div class='topbound'>
				<div class='title' contenteditable spellcheck='false' fd_bind='title'></div>
				<div class='divider'></div>
			</div>

		</div>`
	}),

	filedata: {
		title: '',
		page: false,
		pagelist: [],
		pages: {}
	},

	events: {
		onopened: (file)=>{},
		onclosed: (file)=>{},
		onedited: (file)=>{},
		onsaved: (file)=>{}
	}

});