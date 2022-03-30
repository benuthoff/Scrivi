// Simple File Type //
// by Ben Uthoff

Scrivi.createFileTemplate({

	name: 'Notebook',
	icon: 'book',
	author: 'Scrivi',

	filenamedefault: 'title',

	component: Vue.extend({
		template: `<div>
			<div v-show='!pageview'>
				<!-- Page Select Menu -->
				<div class='topbound'>
					<div class='title' contenteditable spellcheck='false' fd_bind='title'></div>
					<div class='divider'></div>
				</div>
				<div class='pagelist'>
					<div v-for=''></div>
					<div><i data-feather='plus' width='24px' height='24px'></i> New Page</div>
				</div>

			</div>
			<div v-show='pageview'>
				<!-- Page View -->
				<div class='topbound'>
					<div class='title' contenteditable spellcheck='false'></div>
					<div class='divider'></div>
				</div>

			</div>
		</div>`,
		data: ()=> { return { // Component Data
			pageview: false
		}},
		watch: ()=> { return { // Data Change Event
			pageview: (next, prev)=>{
				
			}
		}}
	}),

	filedata: {
		title: '',
		pagelist: [],
		pages: {},

		_title: '', // Current page's metadata.
		_body: ''
	},

	events: {
		onopened: (file)=>{},
		onclosed: (file)=>{},
		onedited: (file)=>{},
		onsaved: (file)=>{}
	}

});