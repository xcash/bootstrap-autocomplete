/*
 *	Dropdown class. Manages the dropdown drawing
 */

export class DropdownV4 {
  // For Bootstrap 4 new dropdown syntax
  protected _$el: JQuery;
  // dropdown element
  protected _dd: JQuery;
  protected initialized: boolean = false;
  protected shown: boolean = false;
  protected items: any[] = [];
  protected formatItem: (item: any) => any;
  protected searchText: string;
  protected autoSelect: boolean;
  protected mouseover: boolean;
  protected ddMouseover: boolean = false;
  protected noResultsText: string;

  constructor(e: JQuery, formatItemCbk: (item: any) => any, autoSelect: boolean, noResultsText: string) {
    this._$el = e;
    this.formatItem = formatItemCbk;
    this.autoSelect = autoSelect;
    this.noResultsText = noResultsText;

    // initialize it in lazy mode to deal with glitches like modals
    // this.init();
  }

  protected getElPos(): any {
    const pos: any = $.extend({}, this._$el.position(), {
      height: this._$el[0].offsetHeight
    });
    return pos;
  }
  protected init(): void {
    // Initialize dropdown
    const pos = this.getElPos();

    // create element
    this._dd = $('<div />');
    // add our class and basic dropdown-menu class
    this._dd.addClass('bootstrap-autocomplete dropdown-menu');

    this._dd.insertAfter(this._$el);
    this._dd.css({ top: pos.top + this._$el.outerHeight(), left: pos.left, width: this._$el.outerWidth() });

    // click event on items
    this._dd.on('click', '.dropdown-item', (evt: JQueryEventObject) => {
      // console.log('clicked', evt.currentTarget);
      // console.log($(evt.currentTarget));
      const item: any = $(evt.currentTarget).data('item');
      this.itemSelectedLaunchEvent(item);
      // stop default event on mouse click.
      evt.preventDefault();
    });

    this._dd.on('keyup', (evt: JQueryEventObject) => {
      if (this.shown) {
        switch (evt.which) {
          case 27:
            // ESC
            this.hide();
            this._$el.focus();
            break;

        }
        return false;
      }
    });

    this._dd.on('mouseenter', (evt: JQueryEventObject) => {
      this.ddMouseover = true;
    });

    this._dd.on('mouseleave', (evt: JQueryEventObject) => {
      this.ddMouseover = false;
    });

    this._dd.on('mouseenter', '.dropdown-item', (evt: JQueryEventObject) => {
      if (this.haveResults) {
        $(evt.currentTarget).closest('div').find('.dropdown-item.active').removeClass('active');
        $(evt.currentTarget).addClass('active');
        this.mouseover = true;
      }
    });

    this._dd.on('mouseleave', '.dropdown-item', (evt: JQueryEventObject) => {
      this.mouseover = false;
    });

    this.initialized = true;

  }

  private checkInitialized(): void {
    // Lazy init
    if (!this.initialized) {
      // if not already initialized
      this.init();
    }
  }

  get isMouseOver(): boolean {
    return this.mouseover;
  }

  get isDdMouseOver(): boolean {
    return this.ddMouseover;
  }

  get haveResults(): boolean {
    return (this.items.length > 0);
  }

  public focusNextItem(reversed?: boolean) {
    if (this.haveResults) {
      // get selected
      const currElem: JQuery = this._dd.find('.dropdown-item.active');
      let nextElem: JQuery = reversed ? currElem.prev() : currElem.next();

      if (nextElem.length === 0) {
        // first
        nextElem = reversed ? this._dd.find('.dropdown-item').last() : this._dd.find('.dropdown-item').first();
      }

      currElem.removeClass('active');
      nextElem.addClass('active');
    }
  }

  public focusPreviousItem() {
    this.focusNextItem(true);
  }

  public selectFocusItem() {
    this._dd.find('.dropdown-item.active').trigger('click');
  }

  get isItemFocused(): boolean {
    if (this._dd && this.isShown() && (this._dd.find('.dropdown-item.active').length > 0)) {
      return true;
    }
    return false;
  }

  public show(): void {
    if (!this.shown) {
      const pos = this.getElPos();
      // this._dd.css({ top: pos.top + this._$el.outerHeight(), left: pos.left, width: this._$el.outerWidth() });
      this._dd.addClass('show');
      this.shown = true;
      this._$el.trigger('autocomplete.dd.shown');
    }
  }

  public isShown(): boolean {
    return this.shown;
  }

  public hide(): void {
    if (this.shown) {
      this._dd.removeClass('show');
      this.shown = false;
      this._$el.trigger('autocomplete.dd.hidden');
    }
  }

  public updateItems(items: any[], searchText: string) {
    // console.log('updateItems', items);
    this.items = items;
    this.searchText = searchText;
    this.refreshItemList();
  }

  private showMatchedText(text: string, qry: string): string {
    const startIndex: number = text.toLowerCase().indexOf(qry.toLowerCase());
    if (startIndex > -1) {
      const endIndex: number = startIndex + qry.length;

      return text.slice(0, startIndex) + '<b>'
        + text.slice(startIndex, endIndex) + '</b>'
        + text.slice(endIndex);
    }
    return text;
  }

  protected refreshItemList() {
    this.checkInitialized();
    this._dd.empty();
    const liList: JQuery[] = [];
    if (this.items.length > 0) {
      this.items.forEach(item => {
        let itemFormatted: any = this.formatItem(item);
        if (typeof itemFormatted === 'string') {
          itemFormatted = { text: itemFormatted }
        }
        let itemText: string;
        let itemHtml: any;

        itemText = this.showMatchedText(itemFormatted.text, this.searchText);
        if (itemFormatted.html !== undefined) {
          itemHtml = itemFormatted.html;
        } else {
          itemHtml = itemText;
        }

        const disabledItem = itemFormatted.disabled;

        const li = $('<a >');
        li.addClass('dropdown-item')
          .css({ 'overflow': 'hidden', 'text-overflow': 'ellipsis' })
          .html(itemHtml)
          .data('item', item);

        if (disabledItem) {
          li.addClass('disabled');
        }
        liList.push(li);
      });
      this._dd.append(liList);
      this.show();
    } else {
      // No results
      if (this.noResultsText === '') {
        // hide the dropdown
        this.hide();
      } else {
        // show no results message
        const li = $('<a >');
        li.addClass('dropdown-item disabled')
          .html(this.noResultsText);

          liList.push(li);
        this._dd.append(liList);
        this.show();
      }
    }
  }

  protected itemSelectedLaunchEvent(item: any): void {
    // launch selected event
    // console.log('itemSelectedLaunchEvent', item);
    this._$el.trigger('autocomplete.select', item)
  }

}
