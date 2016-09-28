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
	protected searchText:string;

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
		
		// selected event
		this._$el.on('autocomplete.select', (evt:JQueryEventObject, item:any) => {
			this.itemSelectedDefaultHandler(item);
		});
		// click event on items
		this._dd.on('click', 'li', (evt:JQueryEventObject) => {
			// console.log('clicked', evt.currentTarget);
			console.log($(evt.currentTarget));
			let item:any = $(evt.currentTarget).data('item');
			this.itemSelectedLaunchEvent(item);
		});

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

	public updateItems(items:any[], searchText:string) {
		// console.log('updateItems', items);
		this.items = items;
		this.searchText = searchText;
		this.refreshItemList();
	}

	private showMatchedText(text:string, qry:string):string {
		let startIndex:number = text.toLowerCase().indexOf(qry.toLowerCase());
		if (startIndex > -1) {
			let endIndex:number = startIndex + qry.length;

			return text.slice(0, startIndex) + '<b>' 
				+ text.slice(startIndex, endIndex) + '</b>'
				+ text.slice(endIndex);
		}
		return text;
	}

	protected refreshItemList() {
		this._dd.empty();
		this.items.forEach(item => {
			let itemFormatted:{ id?:number, text:string } = this.formatItem(item);
			let itemText = itemFormatted.text;

			itemText = this.showMatchedText(itemText, this.searchText);

			let li = $('<li >');
			li.append(
				$('<a>').attr('href', '#').html(itemText)
			)
			.data('item', item);
			
			// TODO optimize 
			this._dd.append(li);
		});
	}

	protected itemSelectedLaunchEvent(item:any):void {
		// launch selected event
		// console.log('itemSelectedLaunchEvent', item);
		this._$el.trigger('autocomplete.select', item)
	}

	protected itemSelectedDefaultHandler(item:any):void {
		// console.log('itemSelectedDefaultHandler', item);
		// default behaviour is set elment's .val()
		let itemFormatted:{ id?:number, text:string } = this.formatItem(item);
		this._$el.val(itemFormatted.text);
		// and hide
		this.hide();
	}

}