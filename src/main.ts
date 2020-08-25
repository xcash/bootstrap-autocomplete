/* =============================================================
 * bootstrap-autocomplete.js v2.3.4
 * https://github.com/xcash/bootstrap-autocomplete
 * =============================================================
 * Forked from bootstrap3-typeahead.js v3.1.0
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2018-2020 Paolo Casciello @xcash666 and contributors
 *
 * Licensed under the MIT License (the 'License');
 * you may not use this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */
import { AjaxResolver, BaseResolver } from './resolvers';
import { DropdownV3 } from './dropdownV3';
import { DropdownV4 } from './dropdownV4';


export interface AutoCompleteSettings {
  resolver: string,
  resolverSettings: any,
  minLength: number,
  valueKey: string,
  formatResult: (item: any) => {},
  autoSelect: boolean,
  noResultsText: string,
  bootstrapVersion: string,
  preventEnter: boolean,
  events: {
    typed: (newValue: string, el: JQuery<HTMLElement>) => string,
    searchPre: (searchText: string, el: JQuery<HTMLElement>) => string,
    search: (searchText: string, cbk: (results: any) => void, el: JQuery<HTMLElement>) => void,
    searchPost: (results: any, el: JQuery<HTMLElement>) => any,
    select: () => void,
    focus: () => void,
  }
}

export class AutoComplete {
  public static NAME: string = 'autoComplete';

  private _el: Element;
  private _$el: JQuery<HTMLElement>;
  private _dd: DropdownV3 | DropdownV4;
  private _searchText: string;
  private _selectedItem: any = null;
  private _defaultValue: any = null;
  private _defaultText: string = null;
  private _isSelectElement: boolean = false;
  private _selectHiddenField: JQuery;

  private _settings: AutoCompleteSettings = {
    resolver: 'ajax',
    resolverSettings: {},
    minLength: 3,
    valueKey: 'value',
    formatResult: this.defaultFormatResult,
    autoSelect: true,
    noResultsText: 'No results',
    bootstrapVersion: 'auto',
    preventEnter: false,
    events: {
      typed: null,
      searchPre: null,
      search: null,
      searchPost: null,
      select: null,
      focus: null,
    }
  }

  private resolver: BaseResolver;

  constructor(element: HTMLElement, options?: {}) {
    this._el = element;
    this._$el = $(this._el) as JQuery<HTMLElement>;

    // element type
    if (this._$el.is('select')) {
      this._isSelectElement = true;
    }
    // inline data attributes
    this.manageInlineDataAttributes();
    // constructor options
    if (typeof options === 'object') {
      this._settings = $.extend(true, {}, this.getSettings(), options) as AutoCompleteSettings;
    }
    if (this._isSelectElement) {
      this.convertSelectToText();
    }

    // console.log('initializing', this._settings);

    this.init();
  }

  private manageInlineDataAttributes() {
    // updates settings with data-* attributes
    const s = this.getSettings();
    if (this._$el.data('url')) {
      s.resolverSettings.url = this._$el.data('url');
    }
    if (this._$el.data('default-value')) {
      this._defaultValue = this._$el.data('default-value');
    }
    if (this._$el.data('default-text')) {
      this._defaultText = this._$el.data('default-text');
    }
    if (this._$el.data('noresults-text') !== undefined) {
      s.noResultsText = this._$el.data('noresults-text');
    }
  }

  private getSettings(): AutoCompleteSettings {
    return this._settings;
  }

  private getBootstrapVersion(): number[] {
    let versionArray: number[];
    if (this._settings.bootstrapVersion === 'auto') {
      // @ts-ignore
      const versionString = $.fn.button.Constructor.VERSION;
      versionArray = versionString.split('.').map(parseInt);
    } else if (this._settings.bootstrapVersion === '4') {
      versionArray = [4];
    } else if (this._settings.bootstrapVersion === '3') {
      versionArray = [3];
    } else {
      // tslint:disable-next-line: no-console
      console.error(`INVALID value for \'bootstrapVersion\' settings property: ${this._settings.bootstrapVersion} defaulting to 4`);
      versionArray = [4];
    }
    return versionArray;
  }

  private convertSelectToText() {
    // create hidden field

    const hidField: JQuery = $('<input>');
    hidField.attr('type', 'hidden');
    hidField.attr('name', this._$el.attr('name'));
    if (this._defaultValue) {
      hidField.val(this._defaultValue);
    }
    this._selectHiddenField = hidField;

    hidField.insertAfter(this._$el);

    // create search input element
    const searchField: JQuery = $('<input>');
    // copy all attributes
    searchField.attr('type', 'search');
    searchField.attr('name', this._$el.attr('name') + '_text');
    searchField.attr('id', this._$el.attr('id'));
    searchField.attr('disabled', this._$el.attr('disabled'));
    searchField.attr('placeholder', this._$el.attr('placeholder'));
    searchField.attr('autocomplete', 'off');
    searchField.addClass(this._$el.attr('class'));
    if (this._defaultText) {
      searchField.val(this._defaultText);
    }

    const requiredAttribute: string = this._$el.attr('required');
    if (requiredAttribute) {
      searchField.attr('required', requiredAttribute);
    }

    // attach class
    searchField.data(AutoComplete.NAME, this);

    // replace original with searchField
    this._$el.replaceWith(searchField);
    this._$el = searchField;
    this._el = searchField.get(0);
  }

  private init(): void {
    // bind default events
    this.bindDefaultEventListeners();
    // RESOLVER
    if (this._settings.resolver === 'ajax') {
      // configure default resolver
      this.resolver = new AjaxResolver(this._settings.resolverSettings);
    }
    // Dropdown
    if (this.getBootstrapVersion()[0] === 4) {
      // v4
      this._dd = new DropdownV4(this._$el, this._settings.formatResult,
        this._settings.autoSelect, this._settings.noResultsText
      );
    } else {
      this._dd = new DropdownV3(this._$el, this._settings.formatResult,
        this._settings.autoSelect, this._settings.noResultsText
      );
    }
  }

  private bindDefaultEventListeners(): void {
    this._$el.on('keydown', (evt: JQueryEventObject) => {
      // console.log('keydown', evt.which, evt);
      switch (evt.which) {
        case 9: // TAB
          // if (this._settings.autoSelect) {
          //   // if autoSelect enabled selects on blur the currently selected item
          //   this._dd.selectFocusItem();
          // }
          if (this._dd.isItemFocused) {
            this._dd.selectFocusItem();
          } else if (!this._selectedItem) {
            // if we haven't selected an item (thus firing the corresponding event) we fire the free value
            // related to issue #71
            if (this._$el.val() !== '') {
              this._$el.trigger('autocomplete.freevalue', this._$el.val());
            }
          }
          this._dd.hide();
          break;
        case 13: // ENTER
          if (this._dd.isItemFocused) {
            this._dd.selectFocusItem();
          } else if (!this._selectedItem) {
            if (this._$el.val() !== '') {
              this._$el.trigger('autocomplete.freevalue', this._$el.val());
            }
          }
          this._dd.hide();
          if (this._settings.preventEnter) {
            // console.log('preventDefault');
            evt.preventDefault();
          }
          break;
        case 40:
          // arrow DOWN (here for usability - issue #80)
          this._dd.focusNextItem();
          break;
        case 38: // up arrow (here for usability - issue #80)
          this._dd.focusPreviousItem();
          break;
      }
    });

    this._$el.on('keyup', (evt: JQueryEventObject) => {
      // console.log('keyup', evt.which, evt);
      // check key
      switch (evt.which) {
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case 39: // right
        case 37: // left
        case 36: // home
        case 35: // end
          break;
        case 13:
          // ENTER
          this._dd.hide();
          break;
        case 27:
          // ESC
          this._dd.hide();
          break;
        case 40:
          // arrow DOWN
          // this._dd.focusNextItem();
          break;
        case 38: // up arrow
          // this._dd.focusPreviousItem();
          break;
        default:
          // reset selectedItem as we modified input value (related to issue #71)
          this._selectedItem = null;
          const newValue = this._$el.val() as string;
          this.handlerTyped(newValue);
      }

    });

    this._$el.on('blur', (evt: JQueryEventObject) => {
      // console.log(evt);
      if (!this._dd.isMouseOver && this._dd.isDdMouseOver && this._dd.isShown()) {
        // Firefox Workaround
        setTimeout(() => { this._$el.focus(); });
        // Other browsers
        this._$el.focus();
      } else if (!this._dd.isMouseOver) {
        if (this._isSelectElement) {
          // if it's a select element
          if (this._dd.isItemFocused) {
            this._dd.selectFocusItem();
          } else if ((this._selectedItem !== null) && (this._$el.val() !== '')) {
            // reselect it
            this._$el.trigger('autocomplete.select', this._selectedItem);
          } else if ((this._$el.val() !== '') && (this._defaultValue !== null)) {
            // select Default
            this._$el.val(this._defaultText);
            this._selectHiddenField.val(this._defaultValue);
            this._selectedItem = null;
            this._$el.trigger('autocomplete.select', this._selectedItem);
          } else {
            // empty the values
            this._$el.val('');
            this._selectHiddenField.val('');
            this._selectedItem = null;
            this._$el.trigger('autocomplete.select', this._selectedItem);
          }
        } else {
          // It's a text element, we accept custom value.
          // Developers may subscribe to `autocomplete.freevalue` to get notified of this
          if (this._selectedItem === null) {
            this._$el.trigger('autocomplete.freevalue', this._$el.val());
          }
        }

        this._dd.hide();
      }
    });

    // selected event
    // @ts-ignore - Ignoring TS type checking
    this._$el.on('autocomplete.select', (evt: JQueryEventObject, item: any) => {
      this._selectedItem = item;
      this.itemSelectedDefaultHandler(item);
    });

    // Paste event
    // The event occurs before the value is pasted. safe behaviour should be triggering `keyup`
    this._$el.on('paste', (evt: JQueryEventObject) => {
      setTimeout(() => {
        this._$el.trigger('keyup', evt);
      }, 0)
    });

  }

  private handlerTyped(newValue: string): void {
    // field value changed

    // custom handler may change newValue
    if (this._settings.events.typed !== null) {
      newValue = this._settings.events.typed(newValue, this._$el);
      if (!newValue) {
        return;
      }
    }

    // if value >= minLength, start autocomplete
    if (newValue.length >= this._settings.minLength) {
      this._searchText = newValue;
      this.handlerPreSearch();
    } else {
      this._dd.hide();
    }
  }

  private handlerPreSearch(): void {
    // do nothing, start search

    // custom handler may change newValue
    if (this._settings.events.searchPre !== null) {
      const newValue: string = this._settings.events.searchPre(this._searchText, this._$el);
      if (!newValue)
        return;
      this._searchText = newValue;
    }

    this.handlerDoSearch();
  }

  private handlerDoSearch(): void {
    // custom handler may change newValue
    if (this._settings.events.search !== null) {
      this._settings.events.search(this._searchText, (results: any) => {
        this.postSearchCallback(results);
      }, this._$el);
    } else {
      // Default behaviour
      // search using current resolver
      if (this.resolver) {
        this.resolver.search(this._searchText, (results: any) => {
          this.postSearchCallback(results);
        });
      }
    }
  }

  private postSearchCallback(results: any): void {
    // console.log('callback called', results);

    // custom handler may change newValue
    if (this._settings.events.searchPost) {
      results = this._settings.events.searchPost(results, this._$el);
      if ((typeof results === 'boolean') && !results)
        return;
    }

    this.handlerStartShow(results);
  }

  private handlerStartShow(results: any[]): void {
    // console.log("defaultEventStartShow", results);
    // for every result, draw it
    this._dd.updateItems(results, this._searchText);
  }

  protected itemSelectedDefaultHandler(item: any): void {
    // this is a coerce check (!=) to cover null or undefined
    if (item != null) {
      // default behaviour is set elment's .val()
      let itemFormatted: any = this._settings.formatResult(item);
      if (typeof itemFormatted === 'string') {
        itemFormatted = { text: itemFormatted }
      }
      this._$el.val(itemFormatted.text);
      // if the element is a select
      if (this._isSelectElement) {
        this._selectHiddenField.val(itemFormatted.value);
      }
    } else {
      // item is null -> clear the value
      this._$el.val('');
      if (this._isSelectElement) {
        this._selectHiddenField.val('');
      }
    }
    // save selected item
    this._selectedItem = item;
    // and hide
    this._dd.hide();
  }

  private defaultFormatResult(item: any): {} {
    if (typeof item === 'string') {
      return { text: item };
    } else if (item.text) {
      return item;
    } else {
      // return a toString of the item as last resort
      // console.error('No default formatter for item', item);
      return { text: item.toString() }
    }
  }

  public manageAPI(APICmd: any, params: any) {
    // manages public API
    if (APICmd === 'set') {
      this.itemSelectedDefaultHandler(params);
    } else if (APICmd === 'clear') {
      // shortcut
      this.itemSelectedDefaultHandler(null);
    } else if (APICmd === 'show') {
      // shortcut
      this._$el.trigger('keyup');
    } else if (APICmd === 'updateResolver') {
      // update resolver
      this.resolver = new AjaxResolver(params);
    }
  }

}

(($: JQueryStatic, window: any, document: any) => {
  // @ts-ignore
  $.fn[AutoComplete.NAME] = function (optionsOrAPI: any, optionalParams: any) {
    return this.each(function () {
      let pluginClass: AutoComplete;

      pluginClass = $(this).data(AutoComplete.NAME);

      if (!pluginClass) {
        pluginClass = new AutoComplete(this, optionsOrAPI);
        $(this).data(AutoComplete.NAME, pluginClass);
      }

      pluginClass.manageAPI(optionsOrAPI, optionalParams);
    });
  };
})(jQuery, window, document);
