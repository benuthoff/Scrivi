// User Interface for Scrivi
// Ben Uthoff

function createDialog(label, buttons) {

	// Undefined buttons
	if (typeof buttons === 'string') {
		buttons = [buttons];
	} else if (!Array.isArray(buttons)) {
		buttons = ['Okay']
	};

	// Create Base Dialog Element
	let box = $(
		"<div class='dialog'>\
			<div class='label'>" + label + "</div>\
			<div class='buttons'></div>\
		</div>"
	);

	// Function for deleting dialog;
	let deleteself = (event)=>{
		$('body').removeClass('blur');
		$(event.target).parents().eq(2).remove();
	};


	// Add Buttons
	for (let i=0; i < buttons.length; i++) {

		b = buttons[i];
		
		// Single string, just text used... //
		if (typeof b === 'string') {

			box.children('.buttons').append(
				$('<div>' + b + '</div>').on('click', deleteself)
			);
		
		// Array, for string and function... //
		} else if (typeof b === 'object' && Array.isArray(b)) {

			box.children('.buttons').append(
				$('<div>' + b[0] + '</div>')
					.on('click', deleteself)
					.on('click', b[1])
			);

		// Error Message //
		} else {

			console.error('Unsuportted variable type used for "createDialog()".');
			return;

		};

	};


	$('body').append( $('<div class="blind"></div>').append(box) ).addClass('blur');

}