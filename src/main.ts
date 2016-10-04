/* =============================================================
 * bootstrap-autocomplete.js v0.0.1
 * https://github.com/xcash/bootstrap-autocomplete
 * =============================================================
 * Forked from bootstrap3-typeahead.js v3.1.0
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2016 Paolo Casciello @xcash666 and contributors
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
import { AjaxResolver } from './resolvers';
import { Dropdown } from './dropdown';

module AutoCompleteNS {
  export class AutoComplete {
    public static NAME:string = 'autoComplete';

    private _el:Element;
    private _$el:JQuery;
    private _dd:Dropdown;
    private _searchText:string;
    private _selectedItem:any = null;
    private _defaultValue:any = null;
    private _defaultText:string = null;
    private _isSelectElement:boolean = false;
    private _selectHiddenField:JQuery;

    private _settings = {
      resolver:<string> 'ajax',
      resolverSettings:<any> {},
      minLength:<number> 3,
      valueKey:<string> 'value',
      formatResult:<Function> this.defaultFormatResult,
      autoSelect:<boolean> true,
      events: {
        typed:<Function> null,
        searchPre:<Function> null,
        search:<Function> null,
        searchPost:<Function> null,
        select:<Function> null,
        focus:<Function> null,
      }
    }
    
    private resolver;

    constructor(element:Element, options?:{}) {
      this._el = element;
      this._$el = $(this._el);
      // element type
      if (this._$el.is('select')) {
        this._isSelectElement = true;
      }
      // inline data attributes
      this.manageInlineDataAttributes();
      // constructor options
      if (typeof options === 'object') {
        this._settings = $.extend(true, {}, this.getSettings(), options);
      }
      if (this._isSelectElement) {
        this.convertSelectToText();
      } 
      
      // console.log('initializing', this._settings);
      
      this.init();
    }

    private manageInlineDataAttributes() {
      // updates settings with data-* attributes
      let s = this.getSettings();
      if (this._$el.data('url')) {
        s['resolverSettings'].url = this._$el.data('url');
      }
      if (this._$el.data('default-value')) {
        this._defaultValue = this._$el.data('default-value');
      }
      if (this._$el.data('default-text')) {
        this._defaultText = this._$el.data('default-text');
      }
    }

    private getSettings():{} {
      return this._settings;
    }

    private convertSelectToText() {
      // create hidden field

      let hidField:JQuery = $('<input>');
      hidField.attr('type', 'hidden');
      hidField.attr('name', this._$el.attr('name'));
      if (this._defaultValue) {
        hidField.val(this._defaultValue);
      }
      this._selectHiddenField = hidField;
      
      hidField.insertAfter(this._$el);

      // create search input element
      let searchField:JQuery = $('<input>');
      // copy all attributes
      searchField.attr('type', 'text');
      searchField.attr('name', this._$el.attr('name') + '_text');
      searchField.attr('id', this._$el.attr('id'));
      searchField.addClass(this._$el.attr('class'));
      if (this._defaultText) {
        searchField.val(this._defaultText);
      }
      
      // attach class
      searchField.data(AutoCompleteNS.AutoComplete.NAME, this);

      // replace original with searchField
      this._$el.replaceWith(searchField);
      this._$el = searchField;
      this._el = searchField.get(0);
    }

    public init():void {
      // bind default events
      this.bindDefaultEventListeners();
      // RESOLVER
      if (this._settings.resolver === 'ajax') {
        // configure default resolver
        this.resolver = new AjaxResolver(this._settings.resolverSettings);
      }
      // Dropdown
      this._dd = new Dropdown(this._$el, this._settings.formatResult, this._settings.autoSelect);
    }
    
    private bindDefaultEventListeners():void {
      this._$el.on('keydown', (evt:JQueryEventObject) => {
				switch (evt.which) {
					case 40:
						// arrow DOWN
            evt.stopPropagation();
            evt.preventDefault();
						break;
					case 38: // up arrow
            evt.stopPropagation();
            evt.preventDefault();
						break;
					case 9: // TAB
            if (this._settings.autoSelect) {
              // if autoSelect enabled selects on blur the currently selected item
              this._dd.selectFocusItem();
            }
						break;
        }
      });
      
      this._$el.on('focus keyup', (evt:JQueryEventObject) => {
        // check key
				switch (evt.which) {
          case 16: // shift
          case 17: // ctrl
          case 18: // alt
          case 39: // right
          case 37: // left 
						break;
					case 40:
						// arrow DOWN
            this._dd.focusNextItem();
						break;
					case 38: // up arrow
            this._dd.focusPreviousItem();
						break;
					case 13: // ENTER
            this._dd.selectFocusItem();
						break;
					case 27:
						// ESC
            this._dd.hide();
						break;
          default:
            let newValue = this._$el.val();
            this.handlerTyped(newValue);
				}
        
      });

      this._$el.on('blur', (evt:JQueryEventObject) => {
        // console.log(evt);
        if (!this._dd.isMouseOver) {

          if (this._isSelectElement) {
            // if it's a select element you must
            if (this._dd.isItemFocused) {
              this._dd.selectFocusItem();
            } else if ( (this._selectedItem !== null) && (this._$el.val() !== '') ) {
              // reselect it
              this._$el.trigger('autocomplete.select', this._selectedItem);
            } else if ( (this._$el.val() !== '') && (this._defaultValue !== null) ) {
              // select Default
              this._$el.val(this._defaultText);
              this._selectHiddenField.val(this._defaultValue);
              this._selectedItem = null;
            } else {
              // empty the values
              this._$el.val('');
              this._selectHiddenField.val('');
              this._selectedItem = null;
            }
          }

          this._dd.hide();
        }
      });

      // selected event
      this._$el.on('autocomplete.select', (evt:JQueryEventObject, item:any) => {
        this._selectedItem = item;
        this.itemSelectedDefaultHandler(item);
      });

    }
    
    private handlerTyped(newValue:string):void {
      // field value changed

      // custom handler may change newValue
      if (this._settings.events.typed !== null) {
        newValue = this._settings.events.typed(newValue);
        if (!newValue)
          return;
      }

      // if value >= minLength, start autocomplete
      if (newValue.length >= this._settings.minLength) {
        this._searchText = newValue;
        this.handlerPreSearch();
      } else {
        this._dd.hide();
      }
    }

    private handlerPreSearch():void {
      // do nothing, start search
      
      // custom handler may change newValue
      if (this._settings.events.searchPre !== null) {
        let newValue:string = this._settings.events.searchPre(this._searchText);
        if (!newValue)
          return;
        this._searchText = newValue;
      }

      this.handlerDoSearch();
    }

    private handlerDoSearch():void {
      // custom handler may change newValue
      if (this._settings.events.search !== null) {
        this._settings.events.search(this._searchText, (results:any) => {
          this.postSearchCallback(results);
        });
      } else {
        // Default behaviour
        // search using current resolver
        if (this.resolver) {
          this.resolver.search(this._searchText, (results:any) => {
            this.postSearchCallback(results);
          });
        }
      }
    }

    private postSearchCallback(results:any):void {
      // console.log('callback called', results);
      
      // custom handler may change newValue
      if (this._settings.events.searchPost) {
        results = this._settings.events.searchPost(results);
        if ( (typeof results === 'boolean') && !results)
          return;
      }

      this.handlerStartShow(results);
    }

    private handlerStartShow(results:any):void {
      // console.log("defaultEventStartShow", results);
      // for every result, draw it
      this._dd.updateItems(results, this._searchText);
      this._dd.show();
    }

    protected itemSelectedDefaultHandler(item:any):void {
      // console.log('itemSelectedDefaultHandler', item);
      // default behaviour is set elment's .val()
      let itemFormatted:any = this._settings.formatResult(item);
			if (typeof itemFormatted === 'string') {
				itemFormatted = { text: itemFormatted }
			}
      this._$el.val(itemFormatted.text);
      // if the element is a select
      if (this._isSelectElement) {
        this._selectHiddenField.val(itemFormatted.value);
      }
      // save selected item
      this._selectedItem = item;
      // and hide
      this._dd.hide();
    }

    private defaultFormatResult(item:any):{} {
      if (typeof item === 'string' ) {
        return { text: item };
      } else if ( item.text ) {
        return item;
      } else {
        // return a toString of the item as last resort
        // console.error('No default formatter for item', item);
        return { text: item.toString() }
      }
    }

  }
}

(function($: JQueryStatic, window: any, document: any) {
  $.fn[AutoCompleteNS.AutoComplete.NAME] = function(options: any) {
    return this.each(function() {
      let pluginClass:AutoCompleteNS.AutoComplete;

      pluginClass = $(this).data(AutoCompleteNS.AutoComplete.NAME);

      if (!pluginClass) {
        pluginClass = new AutoCompleteNS.AutoComplete(this, options); 
        $(this).data(AutoCompleteNS.AutoComplete.NAME, pluginClass);
      }


    });
  };
})(jQuery, window, document);

// (function (root, factory) {

//   'use strict';

//   factory(jQuery);

// }(this, function ($) {

//   'use strict';
//   // jshint laxcomma: true


//  /* TYPEAHEAD PUBLIC CLASS DEFINITION
//   * ================================= */

//   var Typeahead = function (element, options) {
//     this.$element = $(element);
//     this.options = $.extend({}, $.fn.typeahead.defaults, options);
//     this.matcher = this.options.matcher || this.matcher;
//     this.sorter = this.options.sorter || this.sorter;
//     this.select = this.options.select || this.select;
//     this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
//     this.highlighter = this.options.highlighter || this.highlighter;
//     this.render = this.options.render || this.render;
//     this.updater = this.options.updater || this.updater;
//     this.displayText = this.options.displayText || this.displayText;
//     this.selectedText = this.options.selectedText || this.selectedText;
//     this.source = this.options.source;
//     this.delay = this.options.delay;
//     this.$menu = $(this.options.menu);
//     this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
//     this.fitToElement = typeof this.options.fitToElement == 'boolean' ? this.options.fitToElement : false;
//     this.shown = false;
//     this.listen();
//     this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' || this.options.showHintOnFocus === "all" ? this.options.showHintOnFocus : false;
//     this.afterSelect = this.options.afterSelect;
//     this.addItem = false;
//     this.value = this.$element.val() || this.$element.text();
//   };
  
//   Typeahead.prototype = {

//     constructor: Typeahead,

//     select: function () {
//       var val = this.$menu.find('.active').data('value');
//       this.$element.data('active', val);
//       if (this.autoSelect || val) {
//         var newVal = this.updater(val);
//         // Updater can be set to any random functions via "options" parameter in constructor above.
//         // Add null check for cases when updater returns void or undefined.
//         if (!newVal) {
//           newVal = '';
//         }
//         var selectedVal = this.selectedText(newVal);
//         if (selectedVal !== false) {
//           this.$element
//             .val(selectedVal)
//             .text(this.displayText(newVal) || newVal)
//             .change();
//         }
//         this.afterSelect(newVal);
//       }
//       return this.hide();
//     },

//     updater: function (item) {
//       return item;
//     },

//     setSource: function (source) {
//       this.source = source;
//     },

//     show: function () {
//       var pos = $.extend({}, this.$element.position(), {
//         height: this.$element[0].offsetHeight
//       });

//       var scrollHeight = typeof this.options.scrollHeight == 'function' ?
//           this.options.scrollHeight.call() :
//           this.options.scrollHeight;

//       var element;
//       if (this.shown) {
//         element = this.$menu;
//       } else if (this.$appendTo) {
//         element = this.$menu.appendTo(this.$appendTo);
//         this.hasSameParent = this.$appendTo.is(this.$element.parent());
//       } else {
//         element = this.$menu.insertAfter(this.$element);
//         this.hasSameParent = true;
//       }      
      
//       if (!this.hasSameParent) {
//           // We cannot rely on the element position, need to position relative to the window
//           element.css("position", "fixed");
//           var offset = this.$element.offset();
//           pos.top =  offset.top;
//           pos.left = offset.left;
//       }
//       // The rules for bootstrap are: 'dropup' in the parent and 'dropdown-menu-right' in the element.
//       // Note that to get right alignment, you'll need to specify `menu` in the options to be:
//       // '<ul class="typeahead dropdown-menu" role="listbox"></ul>'
//       var dropup = $(element).parent().hasClass('dropup');
//       var newTop = dropup ? 'auto' : (pos.top + pos.height + scrollHeight);
//       var right = $(element).hasClass('dropdown-menu-right');
//       var newLeft = right ? 'auto' : pos.left;
//       // it seems like setting the css is a bad idea (just let Bootstrap do it), but I'll keep the old
//       // logic in place except for the dropup/right-align cases.
//       element.css({ top: newTop, left: newLeft }).show();

//       if (this.options.fitToElement === true) {
//           element.css("width", this.$element.outerWidth() + "px");
//       }
    
//       this.shown = true;
//       return this;
//     },

//     hide: function () {
//       this.$menu.hide();
//       this.shown = false;
//       return this;
//     },

//     lookup: function (query) {
//       var items;
//       if (typeof(query) != 'undefined' && query !== null) {
//         this.query = query;
//       } else {
//         this.query = this.$element.val() || this.$element.text() || '';
//       }

//       if (this.query.length < this.options.minLength && !this.options.showHintOnFocus) {
//         return this.shown ? this.hide() : this;
//       }

//       var worker = $.proxy(function () {

//         if ($.isFunction(this.source)) {
//           this.source(this.query, $.proxy(this.process, this));
//         } else if (this.source) {
//           this.process(this.source);
//         }
//       }, this);

//       clearTimeout(this.lookupWorker);
//       this.lookupWorker = setTimeout(worker, this.delay);
//     },

//     process: function (items) {
//       var that = this;

//       items = $.grep(items, function (item) {
//         return that.matcher(item);
//       });

//       items = this.sorter(items);

//       if (!items.length && !this.options.addItem) {
//         return this.shown ? this.hide() : this;
//       }

//       if (items.length > 0) {
//         this.$element.data('active', items[0]);
//       } else {
//         this.$element.data('active', null);
//       }

//       // Add item
//       if (this.options.addItem){
//         items.push(this.options.addItem);
//       }

//       if (this.options.items == 'all') {
//         return this.render(items).show();
//       } else {
//         return this.render(items.slice(0, this.options.items)).show();
//       }
//     },

//     matcher: function (item) {
//       var it = this.displayText(item);
//       return ~it.toLowerCase().indexOf(this.query.toLowerCase());
//     },

//     sorter: function (items) {
//       var beginswith = [];
//       var caseSensitive = [];
//       var caseInsensitive = [];
//       var item;

//       while ((item = items.shift())) {
//         var it = this.displayText(item);
//         if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
//         else if (~it.indexOf(this.query)) caseSensitive.push(item);
//         else caseInsensitive.push(item);
//       }

//       return beginswith.concat(caseSensitive, caseInsensitive);
//     },

//     highlighter: function (item) {
//       var html = $('<div></div>');
//       var query = this.query;
//       var i = item.toLowerCase().indexOf(query.toLowerCase());
//       var len = query.length;
//       var leftPart;
//       var middlePart;
//       var rightPart;
//       var strong;
//       if (len === 0) {
//         return html.text(item).html();
//       }
//       while (i > -1) {
//         leftPart = item.substr(0, i);
//         middlePart = item.substr(i, len);
//         rightPart = item.substr(i + len);
//         strong = $('<strong></strong>').text(middlePart);
//         html
//           .append(document.createTextNode(leftPart))
//           .append(strong);
//         item = rightPart;
//         i = item.toLowerCase().indexOf(query.toLowerCase());
//       }
//       return html.append(document.createTextNode(item)).html();
//     },

//     render: function (items) {
//       var that = this;
//       var self = this;
//       var activeFound = false;
//       var data = [];
//       var _category = that.options.separator;

//       $.each(items, function (key,value) {
//         // inject separator
//         if (key > 0 && value[_category] !== items[key - 1][_category]){
//           data.push({
//             __type: 'divider'
//           });
//         }

//         // inject category header
//         if (value[_category] && (key === 0 || value[_category] !== items[key - 1][_category])){
//           data.push({
//             __type: 'category',
//             name: value[_category]
//           });
//         }
//         data.push(value);
//       });

//       items = $(data).map(function (i, item) {
//         if ((item.__type || false) == 'category'){
//           return $(that.options.headerHtml).text(item.name)[0];
//         }

//         if ((item.__type || false) == 'divider'){
//           return $(that.options.headerDivider)[0];
//         }

//         var text = self.displayText(item);
//         i = $(that.options.item).data('value', item);
//         i.find('a').html(that.highlighter(text, item));
//         if (text == self.$element.val()) {
//           i.addClass('active');
//           self.$element.data('active', item);
//           activeFound = true;
//         }
//         return i[0];
//       });

//       if (this.autoSelect && !activeFound) {
//         items.filter(':not(.dropdown-header)').first().addClass('active');
//         this.$element.data('active', items.first().data('value'));
//       }
//       this.$menu.html(items);
//       return this;
//     },

//     displayText: function (item) {
//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
//     },

//     selectedText: function(item) {
//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
//     },

//     next: function (event) {
//       var active = this.$menu.find('.active').removeClass('active');
//       var next = active.next();

//       if (!next.length) {
//         next = $(this.$menu.find('li')[0]);
//       }

//       next.addClass('active');
//     },

//     prev: function (event) {
//       var active = this.$menu.find('.active').removeClass('active');
//       var prev = active.prev();

//       if (!prev.length) {
//         prev = this.$menu.find('li').last();
//       }

//       prev.addClass('active');
//     },

//     listen: function () {
//       this.$element
//         .on('focus',    $.proxy(this.focus, this))
//         .on('blur',     $.proxy(this.blur, this))
//         .on('keypress', $.proxy(this.keypress, this))
//         .on('input',    $.proxy(this.input, this))
//         .on('keyup',    $.proxy(this.keyup, this));

//       if (this.eventSupported('keydown')) {
//         this.$element.on('keydown', $.proxy(this.keydown, this));
//       }

//       this.$menu
//         .on('click', $.proxy(this.click, this))
//         .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
//         .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
//         .on('mousedown', $.proxy(this.mousedown,this));
//     },

//     destroy : function () {
//       this.$element.data('typeahead',null);
//       this.$element.data('active',null);
//       this.$element
//         .off('focus')
//         .off('blur')
//         .off('keypress')
//         .off('input')
//         .off('keyup');

//       if (this.eventSupported('keydown')) {
//         this.$element.off('keydown');
//       }

//       this.$menu.remove();
//       this.destroyed = true;
//     },

//     eventSupported: function (eventName) {
//       var isSupported = eventName in this.$element;
//       if (!isSupported) {
//         this.$element.setAttribute(eventName, 'return;');
//         isSupported = typeof this.$element[eventName] === 'function';
//       }
//       return isSupported;
//     },

//     move: function (e) {
//       if (!this.shown) return;

//       switch (e.keyCode) {
//         case 9: // tab
//         case 13: // enter
//         case 27: // escape
//           e.preventDefault();
//           break;

//         case 38: // up arrow
//           // with the shiftKey (this is actually the left parenthesis)
//           if (e.shiftKey) return;
//           e.preventDefault();
//           this.prev();
//           break;

//         case 40: // down arrow
//           // with the shiftKey (this is actually the right parenthesis)
//           if (e.shiftKey) return;
//           e.preventDefault();
//           this.next();
//           break;
//       }
//     },

//     keydown: function (e) {
//       this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
//       if (!this.shown && e.keyCode == 40) {
//         this.lookup();
//       } else {
//         this.move(e);
//       }
//     },

//     keypress: function (e) {
//       if (this.suppressKeyPressRepeat) return;
//       this.move(e);
//     },

//     input: function (e) {
//       // This is a fixed for IE10/11 that fires the input event when a placehoder is changed
//       // (https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus)
//       var currentValue = this.$element.val() || this.$element.text();
//       if (this.value !== currentValue) {
//         this.value = currentValue;
//         this.lookup();
//       }
//     },

//     keyup: function (e) {
//       if (this.destroyed) {
//         return;
//       }
//       switch (e.keyCode) {
//         case 40: // down arrow
//         case 38: // up arrow
//         case 16: // shift
//         case 17: // ctrl
//         case 18: // alt
//           break;

//         case 9: // tab
//         case 13: // enter
//           if (!this.shown) return;
//           this.select();
//           break;

//         case 27: // escape
//           if (!this.shown) return;
//           this.hide();
//           break;
//       }


//     },

//     focus: function (e) {
//       if (!this.focused) {
//         this.focused = true;
//         if (this.options.showHintOnFocus && this.skipShowHintOnFocus !== true) {
//           if(this.options.showHintOnFocus === "all") {
//             this.lookup(""); 
//           } else {
//             this.lookup();
//           }
//         }
//       }
//       if (this.skipShowHintOnFocus) {
//         this.skipShowHintOnFocus = false;
//       }
//     },

//     blur: function (e) {
//       if (!this.mousedover && !this.mouseddown && this.shown) {
//         this.hide();
//         this.focused = false;
//       } else if (this.mouseddown) {
//         // This is for IE that blurs the input when user clicks on scroll.
//         // We set the focus back on the input and prevent the lookup to occur again
//         this.skipShowHintOnFocus = true;
//         this.$element.focus();
//         this.mouseddown = false;
//       } 
//     },

//     click: function (e) {
//       e.preventDefault();
//       this.skipShowHintOnFocus = true;
//       this.select();
//       this.$element.focus();
//       this.hide();
//     },

//     mouseenter: function (e) {
//       this.mousedover = true;
//       this.$menu.find('.active').removeClass('active');
//       $(e.currentTarget).addClass('active');
//     },

//     mouseleave: function (e) {
//       this.mousedover = false;
//       if (!this.focused && this.shown) this.hide();
//     },

//    /**
//      * We track the mousedown for IE. When clicking on the menu scrollbar, IE makes the input blur thus hiding the menu.
//      */
//     mousedown: function (e) {
//       this.mouseddown = true;
//       this.$menu.one("mouseup", function(e){
//         // IE won't fire this, but FF and Chrome will so we reset our flag for them here
//         this.mouseddown = false;
//       }.bind(this));
//     },

//   };


//   /* TYPEAHEAD PLUGIN DEFINITION
//    * =========================== */

//   var old = $.fn.typeahead;

//   $.fn.typeahead = function (option) {
//     var arg = arguments;
//     if (typeof option == 'string' && option == 'getActive') {
//       return this.data('active');
//     }
//     return this.each(function () {
//       var $this = $(this);
//       var data = $this.data('typeahead');
//       var options = typeof option == 'object' && option;
//       if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
//       if (typeof option == 'string' && data[option]) {
//         if (arg.length > 1) {
//           data[option].apply(data, Array.prototype.slice.call(arg, 1));
//         } else {
//           data[option]();
//         }
//       }
//     });
//   };

//   $.fn.typeahead.defaults = {
//     source: [],
//     items: 8,
//     menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
//     item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
//     minLength: 1,
//     scrollHeight: 0,
//     autoSelect: true,
//     afterSelect: $.noop,
//     addItem: false,
//     delay: 0,
//     separator: 'category',
//     headerHtml: '<li class="dropdown-header"></li>',
//     headerDivider: '<li class="divider" role="separator"></li>'
//   };

//   $.fn.typeahead.Constructor = Typeahead;

//  /* TYPEAHEAD NO CONFLICT
//   * =================== */

//   $.fn.typeahead.noConflict = function () {
//     $.fn.typeahead = old;
//     return this;
//   };


//  /* TYPEAHEAD DATA-API
//   * ================== */

//   $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
//     var $this = $(this);
//     if ($this.data('typeahead')) return;
//     $this.typeahead($this.data());
//   });

// }));
