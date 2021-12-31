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
		$('body').removeClass('ui_blur');
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

	$('body').append( $('<div class="blind"></div>').append(box) ).addClass('ui_blur');

};

function createNotif(text, options) {

	// Set the icon
	let icon = '';
	if (options && options.icon) {
		icon = '<i data-feather="' + options.icon + '"></i>'
	};

	// Blip for fading out...
	let blip = (elmnt)=>{
		$(elmnt).addClass('dying').fadeOut(200,()=>{
			$('#notifplane .notif').last().remove();
		});
	}

	// Create the html element
	let notif = $('<div class="notif">'+icon+text+'</div>').on('click', (event)=>{blip(event.currentTarget)});

	// Adds the custom color property
	if (options && options.color) {
		notif.css('border-color', options.color);
	};

	// Adds the element to the DOM
	$('#notifplane').prepend(notif);

	// Auto-delete after set time
	setTimeout(function(){
		blip($('#notifplane .notif:not(.dying)').last());
	}, 2000);

	// Initializes Icon
	if (options && options.icon) { feather.replace({'stroke-width': 2, 'width': 24, 'height': 24, 'class': 'icon'}) };

};

function error(msg) { createNotif(msg, {icon: 'alert-triangle', color: 'var(--theme-notiferror)'}) };
function undercons() { createNotif('Under Construction', {icon: 'alert-triangle'}) };

function toggleCheckbox(event) {
	let box = $(this);
	let val = !(box.attr('value') === 'true'); // Get value as boolean.
	box.attr('value', val); // Swap state.
	if (box.hasClass('autoset')) { sttng(box.attr('id'),box.attr('value')) };
};

function settingsXInput(event) {
	let inp = $(this);
	let val = inp.val();
	if (inp.hasClass('autoset')) {
		sttng(inp.attr('id'),val);
		// Animate
		inp.css('border-color', 'var(--theme-notifsuccess)');
		setTimeout( ()=>{ inp.css('border-color', '') }, 1000 );
	};
};