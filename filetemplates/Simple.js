// Simple File Type //
// by Ben Uthoff

Scrivi.createFileTemplate({

	name: 'Simple',
	icon: 'file-text',

	component: Vue.extend({
		template: `<div>
			<div class='topbound'>
				<div class='title' contenteditable spellcheck='false'></div>
				<div class='divider'></div>
			</div>
			<div class='body' contenteditable spellcheck='false'></div>
		</div>`
	})

});