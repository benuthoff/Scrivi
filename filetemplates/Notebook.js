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
		menuopen: false,
		pagelist: [],
		pages: {}
	},

	events: {
		onopened: (file)=>{
			file.menuopen = false;
			Scrivi.sidebar.right.push({
				'icon': 'menu',
				'name': 'Notebook Pages',
				'action': ()=>{ file.menuopen = !file.menuopen; }
			});
		},
		onclosed: (file)=>{
			Scrivi.sidebar.right.pop();
		},
		onedited: (file)=>{},
		onsaved: (file)=>{}
	}

});