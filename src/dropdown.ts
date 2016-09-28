/*
 *	Dropdown class. Manages the dropdown drawing
 */
export class Dropdown {
	protected _$el:JQuery;
	protected _dd:JQuery;
	protected initialized:boolean = false;
	protected shown:boolean = false;
	protected items:any[] = [];
	protected formatItem:Function;

	constructor(e:JQuery, formatItemCbk:Function) {
		this._$el = e;
		this.formatItem = formatItemCbk;
		
		this.init();
	}
	
	protected init():void {
		// Initialize dropdown
		let pos:any = $.extend({}, this._$el.position(), {
        				height: this._$el[0].offsetHeight
    				});
		
		// create element
		this._dd = $('<ul />');
		// add our class and basic dropdown-menu class
		this._dd.addClass('bootstrap-autocomplete dropdown-menu');

		this._dd.insertAfter(this._$el);
		this._dd.css({ left: pos.left, width: this._$el.outerWidth() });
		
		this.initialized = true;
		
		// DEBUG - TODO remove
		// this.show();
	}

	public show():void {
		if (!this.shown) {
			this._dd.dropdown().show();
			this.shown = true;
		}
	}

	public hide():void {
		if (this.shown) {
			this._dd.dropdown().hide();
			this.shown = false;
		}
	}

	public updateItems(items:any[]) {
		console.log('updateItems', items);
		this.items = items;
		this.refreshItemList();
	}

	protected refreshItemList() {
		this._dd.empty();
		this.items.forEach(item => {
			let itemFormatted:{ id?:number, text:string } = this.formatItem(item);
			let li = $('<li >');
			li.append(
				$('<a>').attr('href', '#').text(itemFormatted.text)
			);
			li.on('click', () => {
				console.log('clicked');
			});
			// TODO optimize 
			this._dd.append(li);
		});
	}

}