// Simple File Type //
// by Ben Uthoff

Scrivi.createFileTemplate({

	name: 'Simple',
	icon: 'file-text',
	author: 'Scrivi',

	component: Vue.extend({
		template: `<div>
			<div class='topbound'>
				<div class='title' contenteditable spellcheck='false'></div>
				<div class='divider'></div>
			</div>
			<div class='body' contenteditable spellcheck='false'></div>
		</div>`
	}),

	filedata: { // Work In Progress
		title: '',
		body: ''
	},

	events: { // Work In Progress

		onopened: ()=>{},
		onclosed: ()=>{},
		onedited: ()=>{},
		onsaved: ()=>{}

	}

});