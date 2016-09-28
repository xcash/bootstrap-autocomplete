/*
 *	Dropdown class. Manages the dropdown drawing
 */
export class Dropdown {
	protected _$el:JQuery;
	protected initialized:boolean = false;

	constructor(e:JQuery) {
		this._$el = e;
		this.init();
	}
	
	protected init():void {
		// Initialize dropdown
		let ddUl:JQuery = $('<ul />');

		// add our class and basic dropdown-menu class
		ddUl.addClass('bootstrap-autocomplete dropdown-menu');
		ddUl.append("<li><a href='#'>t1</a></li>");

		ddUl.insertAfter(this._$el);
		ddUl.dropdown().show();
		this.initialized = true;
	}

	public show():void {
		if (!this.initialized)
			this.init();
		
		return;
	}
}