/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
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
	var resolvers_1 = __webpack_require__(1);
	var dropdown_1 = __webpack_require__(2);
	var AutoCompleteNS;
	(function (AutoCompleteNS) {
	    var AutoComplete = (function () {
	        function AutoComplete(element, options) {
	            this._settings = {
	                resolver: 'ajax',
	                resolverSettings: {},
	                minLength: 3,
	                valueKey: 'value',
	                formatResult: this.defaultFormatResult,
	                autoSelect: true,
	                events: {
	                    typed: null,
	                    searchPre: null,
	                    search: null,
	                    searchPost: null,
	                    select: null,
	                    focus: null,
	                }
	            };
	            this._el = element;
	            this._$el = $(this._el);
	            this._settings = $.extend(true, {}, this._settings, options);
	            //console.log('initializing', this._settings);
	            this.init();
	        }
	        AutoComplete.prototype.getSettings = function () {
	            return this._settings;
	        };
	        AutoComplete.prototype.init = function () {
	            // bind default events
	            this.bindDefaultEventListeners();
	            // RESOLVER
	            if (this._settings.resolver === 'ajax') {
	                // configure default resolver
	                this.resolver = new resolvers_1.AjaxResolver(this._settings.resolverSettings);
	            }
	            // Dropdown
	            this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult, this._settings.autoSelect);
	        };
	        AutoComplete.prototype.bindDefaultEventListeners = function () {
	            var _this = this;
	            this._$el.on('keyup', function (evt) {
	                // check key
	                switch (evt.which) {
	                    case 38:
	                        // arrow UP
	                        break;
	                    case 40:
	                        // arrow DOWN
	                        _this._dd.focusItem(0);
	                        break;
	                    case 27:
	                        // ESC
	                        _this._dd.hide();
	                        break;
	                    default:
	                        var newValue = _this._$el.val();
	                        _this.handlerTyped(newValue);
	                }
	            });
	            // selected event
	            this._$el.on('autocomplete.select', function (evt, item) {
	                _this.itemSelectedDefaultHandler(item);
	            });
	        };
	        AutoComplete.prototype.handlerTyped = function (newValue) {
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
	            }
	            else {
	                this._dd.hide();
	            }
	        };
	        AutoComplete.prototype.handlerPreSearch = function () {
	            // do nothing, start search
	            // custom handler may change newValue
	            if (this._settings.events.searchPre !== null) {
	                var newValue = this._settings.events.searchPre(this._searchText);
	                if (!newValue)
	                    return;
	                this._searchText = newValue;
	            }
	            this.handlerDoSearch();
	        };
	        AutoComplete.prototype.handlerDoSearch = function () {
	            var _this = this;
	            // custom handler may change newValue
	            if (this._settings.events.search !== null) {
	                this._settings.events.search(this._searchText, function (results) {
	                    _this.postSearchCallback(results);
	                });
	            }
	            else {
	                // Default behaviour
	                // search using current resolver
	                if (this.resolver) {
	                    this.resolver.search(this._searchText, function (results) {
	                        _this.postSearchCallback(results);
	                    });
	                }
	            }
	        };
	        AutoComplete.prototype.postSearchCallback = function (results) {
	            // console.log('callback called', results);
	            // custom handler may change newValue
	            if (this._settings.events.searchPost) {
	                results = this._settings.events.searchPost(results);
	                if ((typeof results === 'boolean') && !results)
	                    return;
	            }
	            this.handlerStartShow(results);
	        };
	        AutoComplete.prototype.handlerStartShow = function (results) {
	            // console.log("defaultEventStartShow", results);
	            // for every result, draw it
	            this._dd.updateItems(results, this._searchText);
	            this._dd.show();
	        };
	        AutoComplete.prototype.itemSelectedDefaultHandler = function (item) {
	            // console.log('itemSelectedDefaultHandler', item);
	            // default behaviour is set elment's .val()
	            var itemFormatted = this._settings.formatResult(item);
	            if (typeof itemFormatted === 'string') {
	                itemFormatted = { text: itemFormatted };
	            }
	            this._$el.val(itemFormatted.text);
	            // and hide
	            this._dd.hide();
	        };
	        AutoComplete.prototype.defaultFormatResult = function (item) {
	            if (typeof item === 'string') {
	                return { text: item };
	            }
	            else if (item.text) {
	                return item;
	            }
	            else {
	                // return a toString of the item as last resort
	                // console.error('No default formatter for item', item);
	                return { text: item.toString() };
	            }
	        };
	        AutoComplete.NAME = 'autoComplete';
	        return AutoComplete;
	    }());
	    AutoCompleteNS.AutoComplete = AutoComplete;
	})(AutoCompleteNS || (AutoCompleteNS = {}));
	(function ($, window, document) {
	    $.fn[AutoCompleteNS.AutoComplete.NAME] = function (options) {
	        return this.each(function () {
	            var pluginClass;
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BaseResolver = (function () {
	    function BaseResolver(options) {
	        this._settings = $.extend(true, {}, this.getDefaults(), options);
	    }
	    BaseResolver.prototype.getDefaults = function () {
	        return {};
	    };
	    BaseResolver.prototype.getResults = function (limit, start, end) {
	        return this.results;
	    };
	    BaseResolver.prototype.search = function (q, cbk) {
	        cbk(this.getResults());
	    };
	    return BaseResolver;
	}());
	var AjaxResolver = (function (_super) {
	    __extends(AjaxResolver, _super);
	    function AjaxResolver(options) {
	        _super.call(this, options);
	        // console.log('resolver settings', this._settings);
	    }
	    AjaxResolver.prototype.getDefaults = function () {
	        return {
	            url: '',
	            method: 'get',
	            queryKey: 'q',
	            extraData: {},
	            timeout: undefined,
	        };
	    };
	    AjaxResolver.prototype.search = function (q, cbk) {
	        var _this = this;
	        if (this.jqXHR != null) {
	            this.jqXHR.abort();
	        }
	        var data = {};
	        data[this._settings.queryKey] = q;
	        $.extend(data, this._settings.extraData);
	        this.jqXHR = $.ajax(this._settings.url, {
	            method: this._settings.method,
	            data: data,
	            timeout: this._settings.timeout
	        });
	        this.jqXHR.done(function (result) {
	            cbk(result);
	        });
	        this.jqXHR.fail(function (err) {
	            console.log(err);
	        });
	        this.jqXHR.always(function () {
	            _this.jqXHR = null;
	        });
	    };
	    return AjaxResolver;
	}(BaseResolver));
	exports.AjaxResolver = AjaxResolver;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	/*
	 *	Dropdown class. Manages the dropdown drawing
	 */
	var Dropdown = (function () {
	    function Dropdown(e, formatItemCbk, autoSelect) {
	        this.initialized = false;
	        this.shown = false;
	        this.items = [];
	        this._$el = e;
	        this.formatItem = formatItemCbk;
	        this.autoSelect = autoSelect;
	        this.init();
	    }
	    Dropdown.prototype.init = function () {
	        var _this = this;
	        // Initialize dropdown
	        var pos = $.extend({}, this._$el.position(), {
	            height: this._$el[0].offsetHeight
	        });
	        // create element
	        this._dd = $('<ul />');
	        // add our class and basic dropdown-menu class
	        this._dd.addClass('bootstrap-autocomplete dropdown-menu');
	        this._dd.insertAfter(this._$el);
	        this._dd.css({ left: pos.left, width: this._$el.outerWidth() });
	        // click event on items
	        this._dd.on('click', 'li', function (evt) {
	            // console.log('clicked', evt.currentTarget);
	            //console.log($(evt.currentTarget));
	            var item = $(evt.currentTarget).data('item');
	            _this.itemSelectedLaunchEvent(item);
	        });
	        this._dd.on('keyup', function (evt) {
	            if (_this.shown) {
	                switch (evt.which) {
	                    case 27:
	                        // ESC
	                        _this.hide();
	                        _this._$el.focus();
	                        break;
	                }
	                return false;
	            }
	        });
	        this._dd.on('focus', 'li a', function (evt) {
	            $(evt.currentTarget).closest('ul').find('li.active').removeClass('active');
	            $(evt.currentTarget).closest('li').addClass('active');
	        });
	        this._dd.on('mouseenter', 'li', function (evt) {
	            $(evt.currentTarget).find('a').focus();
	        });
	        this.initialized = true;
	    };
	    Dropdown.prototype.focusItem = function (index) {
	        // Focus an item in the list
	        if (this.shown && (this.items.length > index))
	            this._dd.find('li').eq(index).find('a').focus();
	    };
	    Dropdown.prototype.show = function () {
	        if (!this.shown) {
	            this._dd.dropdown().show();
	            this.shown = true;
	        }
	    };
	    Dropdown.prototype.isShown = function () {
	        return this.shown;
	    };
	    Dropdown.prototype.hide = function () {
	        if (this.shown) {
	            this._dd.dropdown().hide();
	            this.shown = false;
	        }
	    };
	    Dropdown.prototype.updateItems = function (items, searchText) {
	        // console.log('updateItems', items);
	        this.items = items;
	        this.searchText = searchText;
	        this.refreshItemList();
	    };
	    Dropdown.prototype.showMatchedText = function (text, qry) {
	        var startIndex = text.toLowerCase().indexOf(qry.toLowerCase());
	        if (startIndex > -1) {
	            var endIndex = startIndex + qry.length;
	            return text.slice(0, startIndex) + '<b>'
	                + text.slice(startIndex, endIndex) + '</b>'
	                + text.slice(endIndex);
	        }
	        return text;
	    };
	    Dropdown.prototype.refreshItemList = function () {
	        var _this = this;
	        this._dd.empty();
	        var liList = [];
	        this.items.forEach(function (item) {
	            var itemFormatted = _this.formatItem(item);
	            if (typeof itemFormatted === 'string') {
	                itemFormatted = { text: itemFormatted };
	            }
	            var itemText;
	            var itemHtml;
	            itemText = _this.showMatchedText(itemFormatted.text, _this.searchText);
	            if (itemFormatted.html !== undefined) {
	                itemHtml = itemFormatted.html;
	            }
	            else {
	                itemHtml = itemText;
	            }
	            var li = $('<li >');
	            li.append($('<a>').attr('href', '#').html(itemHtml))
	                .data('item', item);
	            liList.push(li);
	        });
	        this._dd.append(liList);
	    };
	    Dropdown.prototype.itemSelectedLaunchEvent = function (item) {
	        // launch selected event
	        // console.log('itemSelectedLaunchEvent', item);
	        this._$el.trigger('autocomplete.select', item);
	    };
	    return Dropdown;
	}());
	exports.Dropdown = Dropdown;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzQ0MDBhN2RjMzQ5ODZkMDcwZWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQWtMcEI7QUFsTEQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQTJCRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQW5CaEMsY0FBUyxHQUFHO2lCQUNsQixRQUFRLEVBQVUsTUFBTTtpQkFDeEIsZ0JBQWdCLEVBQU8sRUFBRTtpQkFDekIsU0FBUyxFQUFVLENBQUM7aUJBQ3BCLFFBQVEsRUFBVSxPQUFPO2lCQUN6QixZQUFZLEVBQVksSUFBSSxDQUFDLG1CQUFtQjtpQkFDaEQsVUFBVSxFQUFXLElBQUk7aUJBQ3pCLE1BQU0sRUFBRTtxQkFDTixLQUFLLEVBQVksSUFBSTtxQkFDckIsU0FBUyxFQUFZLElBQUk7cUJBQ3pCLE1BQU0sRUFBWSxJQUFJO3FCQUN0QixVQUFVLEVBQVksSUFBSTtxQkFDMUIsTUFBTSxFQUFZLElBQUk7cUJBQ3RCLEtBQUssRUFBWSxJQUFJO2tCQUN0QjtjQUNGO2FBS0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7YUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxD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O1NBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQztLQUMvQyxDQUFDO0tBRUYsZUFBQztBQUFELEVBQUM7QUFqSlksaUJBQVEsV0FpSnBCIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGM0NDAwYTdkYzM0OTg2ZDA3MGVlXG4gKiovIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWF1dG9jb21wbGV0ZS5qcyB2MC4wLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS94Y2FzaC9ib290c3RyYXAtYXV0b2NvbXBsZXRlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBGb3JrZWQgZnJvbSBib290c3RyYXAzLXR5cGVhaGVhZC5qcyB2My4xLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iYXNzam9ic2VuL0Jvb3RzdHJhcC0zLVR5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogT3JpZ2luYWwgd3JpdHRlbiBieSBAbWRvIGFuZCBAZmF0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxNiBQYW9sbyBDYXNjaWVsbG8gQHhjYXNoNjY2IGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5pbXBvcnQgeyBBamF4UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5tb2R1bGUgQXV0b0NvbXBsZXRlTlMge1xuICBleHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBwdWJsaWMgc3RhdGljIE5BTUU6c3RyaW5nID0gJ2F1dG9Db21wbGV0ZSc7XG5cbiAgICBwcml2YXRlIF9lbDpFbGVtZW50O1xuICAgIHByaXZhdGUgXyRlbDpKUXVlcnk7XG4gICAgcHJpdmF0ZSBfZGQ6RHJvcGRvd247XG4gICAgcHJpdmF0ZSBfc2VhcmNoVGV4dDpzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9zZXR0aW5ncyA9IHtcbiAgICAgIHJlc29sdmVyOjxzdHJpbmc+ICdhamF4JyxcbiAgICAgIHJlc29sdmVyU2V0dGluZ3M6PGFueT4ge30sXG4gICAgICBtaW5MZW5ndGg6PG51bWJlcj4gMyxcbiAgICAgIHZhbHVlS2V5OjxzdHJpbmc+ICd2YWx1ZScsXG4gICAgICBmb3JtYXRSZXN1bHQ6PEZ1bmN0aW9uPiB0aGlzLmRlZmF1bHRGb3JtYXRSZXN1bHQsXG4gICAgICBhdXRvU2VsZWN0Ojxib29sZWFuPiB0cnVlLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHR5cGVkOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUHJlOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUG9zdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlbGVjdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIGZvY3VzOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSByZXNvbHZlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6RWxlbWVudCwgb3B0aW9uczphbnkpIHtcbiAgICAgIHRoaXMuX2VsID0gZWxlbWVudDtcbiAgICAgIHRoaXMuXyRlbCA9ICQodGhpcy5fZWwpO1xuICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fc2V0dGluZ3MsIG9wdGlvbnMpO1xuICAgICAgXG4gICAgICAvL2NvbnNvbGUubG9nKCdpbml0aWFsaXppbmcnLCB0aGlzLl9zZXR0aW5ncyk7XG4gICAgICBcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2V0dGluZ3MoKTp7fSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3M7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoKTp2b2lkIHtcbiAgICAgIC8vIGJpbmQgZGVmYXVsdCBldmVudHNcbiAgICAgIHRoaXMuYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpO1xuICAgICAgLy8gUkVTT0xWRVJcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZXNvbHZlciA9PT0gJ2FqYXgnKSB7XG4gICAgICAgIC8vIGNvbmZpZ3VyZSBkZWZhdWx0IHJlc29sdmVyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSBuZXcgQWpheFJlc29sdmVyKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyU2V0dGluZ3MpO1xuICAgICAgfVxuICAgICAgLy8gRHJvcGRvd25cbiAgICAgIHRoaXMuX2RkID0gbmV3IERyb3Bkb3duKHRoaXMuXyRlbCwgdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0LCB0aGlzLl9zZXR0aW5ncy5hdXRvU2VsZWN0KTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBiaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk6dm9pZCB7XG4gICAgICB0aGlzLl8kZWwub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjaGVjayBrZXlcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgVVBcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c0l0ZW0oMCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG4gICAgICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5fJGVsLnZhbCgpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVyVHlwZWQobmV3VmFsdWUpO1xuXHRcdFx0XHR9XG5cbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZWxlY3RlZCBldmVudFxuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VsZWN0JywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgaXRlbTphbnkpID0+IHtcbiAgICAgICAgdGhpcy5pdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihpdGVtKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgaGFuZGxlclR5cGVkKG5ld1ZhbHVlOnN0cmluZyk6dm9pZCB7XG4gICAgICAvLyBmaWVsZCB2YWx1ZSBjaGFuZ2VkXG5cbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMudHlwZWQgIT09IG51bGwpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMudHlwZWQobmV3VmFsdWUpO1xuICAgICAgICBpZiAoIW5ld1ZhbHVlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdmFsdWUgPj0gbWluTGVuZ3RoLCBzdGFydCBhdXRvY29tcGxldGVcbiAgICAgIGlmIChuZXdWYWx1ZS5sZW5ndGggPj0gdGhpcy5fc2V0dGluZ3MubWluTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3NlYXJjaFRleHQgPSBuZXdWYWx1ZTtcbiAgICAgICAgdGhpcy5oYW5kbGVyUHJlU2VhcmNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyUHJlU2VhcmNoKCk6dm9pZCB7XG4gICAgICAvLyBkbyBub3RoaW5nLCBzdGFydCBzZWFyY2hcbiAgICAgIFxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQcmUgIT09IG51bGwpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlOnN0cmluZyA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQcmUodGhpcy5fc2VhcmNoVGV4dCk7XG4gICAgICAgIGlmICghbmV3VmFsdWUpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlckRvU2VhcmNoKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyRG9TZWFyY2goKTp2b2lkIHtcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2godGhpcy5fc2VhcmNoVGV4dCwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5wb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGVmYXVsdCBiZWhhdmlvdXJcbiAgICAgICAgLy8gc2VhcmNoIHVzaW5nIGN1cnJlbnQgcmVzb2x2ZXJcbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZXIpIHtcbiAgICAgICAgICB0aGlzLnJlc29sdmVyLnNlYXJjaCh0aGlzLl9zZWFyY2hUZXh0LCAocmVzdWx0czphbnkpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrIGNhbGxlZCcsIHJlc3VsdHMpO1xuICAgICAgXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFBvc3QpIHtcbiAgICAgICAgcmVzdWx0cyA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQb3N0KHJlc3VsdHMpO1xuICAgICAgICBpZiAoICh0eXBlb2YgcmVzdWx0cyA9PT0gJ2Jvb2xlYW4nKSAmJiAhcmVzdWx0cylcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlclN0YXJ0U2hvdyhyZXN1bHRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJTdGFydFNob3cocmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJkZWZhdWx0RXZlbnRTdGFydFNob3dcIiwgcmVzdWx0cyk7XG4gICAgICAvLyBmb3IgZXZlcnkgcmVzdWx0LCBkcmF3IGl0XG4gICAgICB0aGlzLl9kZC51cGRhdGVJdGVtcyhyZXN1bHRzLCB0aGlzLl9zZWFyY2hUZXh0KTtcbiAgICAgIHRoaXMuX2RkLnNob3coKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbTphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyJywgaXRlbSk7XG4gICAgICAvLyBkZWZhdWx0IGJlaGF2aW91ciBpcyBzZXQgZWxtZW50J3MgLnZhbCgpXG4gICAgICBsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQoaXRlbSk7XG5cdFx0XHRpZiAodHlwZW9mIGl0ZW1Gb3JtYXR0ZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGl0ZW1Gb3JtYXR0ZWQgPSB7IHRleHQ6IGl0ZW1Gb3JtYXR0ZWQgfVxuXHRcdFx0fVxuICAgICAgdGhpcy5fJGVsLnZhbChpdGVtRm9ybWF0dGVkLnRleHQpO1xuICAgICAgLy8gYW5kIGhpZGVcbiAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRGb3JtYXRSZXN1bHQoaXRlbTphbnkpOnt9IHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0gfTtcbiAgICAgIH0gZWxzZSBpZiAoIGl0ZW0udGV4dCApIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZXR1cm4gYSB0b1N0cmluZyBvZiB0aGUgaXRlbSBhcyBsYXN0IHJlc29ydFxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdObyBkZWZhdWx0IGZvcm1hdHRlciBmb3IgaXRlbScsIGl0ZW0pO1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtLnRvU3RyaW5nKCkgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG59XG5cbihmdW5jdGlvbigkOiBKUXVlcnlTdGF0aWMsIHdpbmRvdzogYW55LCBkb2N1bWVudDogYW55KSB7XG4gICQuZm5bQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUVdID0gZnVuY3Rpb24ob3B0aW9uczogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwbHVnaW5DbGFzczpBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGU7XG5cbiAgICAgIHBsdWdpbkNsYXNzID0gJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FKTtcblxuICAgICAgaWYgKCFwbHVnaW5DbGFzcykge1xuICAgICAgICBwbHVnaW5DbGFzcyA9IG5ldyBBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUodGhpcywgb3B0aW9ucyk7IFxuICAgICAgICAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHBsdWdpbkNsYXNzKTtcbiAgICAgIH1cblxuXG4gICAgfSk7XG4gIH07XG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblxuLy8gICAndXNlIHN0cmljdCc7XG5cbi8vICAgZmFjdG9yeShqUXVlcnkpO1xuXG4vLyB9KHRoaXMsIGZ1bmN0aW9uICgkKSB7XG5cbi8vICAgJ3VzZSBzdHJpY3QnO1xuLy8gICAvLyBqc2hpbnQgbGF4Y29tbWE6IHRydWVcblxuXG4vLyAgLyogVFlQRUFIRUFEIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4vLyAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgdmFyIFR5cGVhaGVhZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4vLyAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4vLyAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4udHlwZWFoZWFkLmRlZmF1bHRzLCBvcHRpb25zKTtcbi8vICAgICB0aGlzLm1hdGNoZXIgPSB0aGlzLm9wdGlvbnMubWF0Y2hlciB8fCB0aGlzLm1hdGNoZXI7XG4vLyAgICAgdGhpcy5zb3J0ZXIgPSB0aGlzLm9wdGlvbnMuc29ydGVyIHx8IHRoaXMuc29ydGVyO1xuLy8gICAgIHRoaXMuc2VsZWN0ID0gdGhpcy5vcHRpb25zLnNlbGVjdCB8fCB0aGlzLnNlbGVjdDtcbi8vICAgICB0aGlzLmF1dG9TZWxlY3QgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmF1dG9TZWxlY3QgPT0gJ2Jvb2xlYW4nID8gdGhpcy5vcHRpb25zLmF1dG9TZWxlY3QgOiB0cnVlO1xuLy8gICAgIHRoaXMuaGlnaGxpZ2h0ZXIgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0ZXIgfHwgdGhpcy5oaWdobGlnaHRlcjtcbi8vICAgICB0aGlzLnJlbmRlciA9IHRoaXMub3B0aW9ucy5yZW5kZXIgfHwgdGhpcy5yZW5kZXI7XG4vLyAgICAgdGhpcy51cGRhdGVyID0gdGhpcy5vcHRpb25zLnVwZGF0ZXIgfHwgdGhpcy51cGRhdGVyO1xuLy8gICAgIHRoaXMuZGlzcGxheVRleHQgPSB0aGlzLm9wdGlvbnMuZGlzcGxheVRleHQgfHwgdGhpcy5kaXNwbGF5VGV4dDtcbi8vICAgICB0aGlzLnNlbGVjdGVkVGV4dCA9IHRoaXMub3B0aW9ucy5zZWxlY3RlZFRleHQgfHwgdGhpcy5zZWxlY3RlZFRleHQ7XG4vLyAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLm9wdGlvbnMuc291cmNlO1xuLy8gICAgIHRoaXMuZGVsYXkgPSB0aGlzLm9wdGlvbnMuZGVsYXk7XG4vLyAgICAgdGhpcy4kbWVudSA9ICQodGhpcy5vcHRpb25zLm1lbnUpO1xuLy8gICAgIHRoaXMuJGFwcGVuZFRvID0gdGhpcy5vcHRpb25zLmFwcGVuZFRvID8gJCh0aGlzLm9wdGlvbnMuYXBwZW5kVG8pIDogbnVsbDtcbi8vICAgICB0aGlzLmZpdFRvRWxlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50ID09ICdib29sZWFuJyA/IHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgOiBmYWxzZTtcbi8vICAgICB0aGlzLnNob3duID0gZmFsc2U7XG4vLyAgICAgdGhpcy5saXN0ZW4oKTtcbi8vICAgICB0aGlzLnNob3dIaW50T25Gb2N1cyA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09ICdib29sZWFuJyB8fCB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09PSBcImFsbFwiID8gdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA6IGZhbHNlO1xuLy8gICAgIHRoaXMuYWZ0ZXJTZWxlY3QgPSB0aGlzLm9wdGlvbnMuYWZ0ZXJTZWxlY3Q7XG4vLyAgICAgdGhpcy5hZGRJdGVtID0gZmFsc2U7XG4vLyAgICAgdGhpcy52YWx1ZSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCk7XG4vLyAgIH07XG4gIFxuLy8gICBUeXBlYWhlYWQucHJvdG90eXBlID0ge1xuXG4vLyAgICAgY29uc3RydWN0b3I6IFR5cGVhaGVhZCxcblxuLy8gICAgIHNlbGVjdDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyIHZhbCA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLmRhdGEoJ3ZhbHVlJyk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIHZhbCk7XG4vLyAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0IHx8IHZhbCkge1xuLy8gICAgICAgICB2YXIgbmV3VmFsID0gdGhpcy51cGRhdGVyKHZhbCk7XG4vLyAgICAgICAgIC8vIFVwZGF0ZXIgY2FuIGJlIHNldCB0byBhbnkgcmFuZG9tIGZ1bmN0aW9ucyB2aWEgXCJvcHRpb25zXCIgcGFyYW1ldGVyIGluIGNvbnN0cnVjdG9yIGFib3ZlLlxuLy8gICAgICAgICAvLyBBZGQgbnVsbCBjaGVjayBmb3IgY2FzZXMgd2hlbiB1cGRhdGVyIHJldHVybnMgdm9pZCBvciB1bmRlZmluZWQuXG4vLyAgICAgICAgIGlmICghbmV3VmFsKSB7XG4vLyAgICAgICAgICAgbmV3VmFsID0gJyc7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdmFyIHNlbGVjdGVkVmFsID0gdGhpcy5zZWxlY3RlZFRleHQobmV3VmFsKTtcbi8vICAgICAgICAgaWYgKHNlbGVjdGVkVmFsICE9PSBmYWxzZSkge1xuLy8gICAgICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgICAgIC52YWwoc2VsZWN0ZWRWYWwpXG4vLyAgICAgICAgICAgICAudGV4dCh0aGlzLmRpc3BsYXlUZXh0KG5ld1ZhbCkgfHwgbmV3VmFsKVxuLy8gICAgICAgICAgICAgLmNoYW5nZSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHRoaXMuYWZ0ZXJTZWxlY3QobmV3VmFsKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBzZXRTb3VyY2U6IGZ1bmN0aW9uIChzb3VyY2UpIHtcbi8vICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuLy8gICAgIH0sXG5cbi8vICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgcG9zID0gJC5leHRlbmQoe30sIHRoaXMuJGVsZW1lbnQucG9zaXRpb24oKSwge1xuLy8gICAgICAgICBoZWlnaHQ6IHRoaXMuJGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgdmFyIHNjcm9sbEhlaWdodCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0ID09ICdmdW5jdGlvbicgP1xuLy8gICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQuY2FsbCgpIDpcbi8vICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0O1xuXG4vLyAgICAgICB2YXIgZWxlbWVudDtcbi8vICAgICAgIGlmICh0aGlzLnNob3duKSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51O1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLiRhcHBlbmRUbykge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudS5hcHBlbmRUbyh0aGlzLiRhcHBlbmRUbyk7XG4vLyAgICAgICAgIHRoaXMuaGFzU2FtZVBhcmVudCA9IHRoaXMuJGFwcGVuZFRvLmlzKHRoaXMuJGVsZW1lbnQucGFyZW50KCkpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnUuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudCk7XG4vLyAgICAgICAgIHRoaXMuaGFzU2FtZVBhcmVudCA9IHRydWU7XG4vLyAgICAgICB9ICAgICAgXG4gICAgICBcbi8vICAgICAgIGlmICghdGhpcy5oYXNTYW1lUGFyZW50KSB7XG4vLyAgICAgICAgICAgLy8gV2UgY2Fubm90IHJlbHkgb24gdGhlIGVsZW1lbnQgcG9zaXRpb24sIG5lZWQgdG8gcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIHdpbmRvd1xuLy8gICAgICAgICAgIGVsZW1lbnQuY3NzKFwicG9zaXRpb25cIiwgXCJmaXhlZFwiKTtcbi8vICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKTtcbi8vICAgICAgICAgICBwb3MudG9wID0gIG9mZnNldC50b3A7XG4vLyAgICAgICAgICAgcG9zLmxlZnQgPSBvZmZzZXQubGVmdDtcbi8vICAgICAgIH1cbi8vICAgICAgIC8vIFRoZSBydWxlcyBmb3IgYm9vdHN0cmFwIGFyZTogJ2Ryb3B1cCcgaW4gdGhlIHBhcmVudCBhbmQgJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnIGluIHRoZSBlbGVtZW50LlxuLy8gICAgICAgLy8gTm90ZSB0aGF0IHRvIGdldCByaWdodCBhbGlnbm1lbnQsIHlvdSdsbCBuZWVkIHRvIHNwZWNpZnkgYG1lbnVgIGluIHRoZSBvcHRpb25zIHRvIGJlOlxuLy8gICAgICAgLy8gJzx1bCBjbGFzcz1cInR5cGVhaGVhZCBkcm9wZG93bi1tZW51XCIgcm9sZT1cImxpc3Rib3hcIj48L3VsPidcbi8vICAgICAgIHZhciBkcm9wdXAgPSAkKGVsZW1lbnQpLnBhcmVudCgpLmhhc0NsYXNzKCdkcm9wdXAnKTtcbi8vICAgICAgIHZhciBuZXdUb3AgPSBkcm9wdXAgPyAnYXV0bycgOiAocG9zLnRvcCArIHBvcy5oZWlnaHQgKyBzY3JvbGxIZWlnaHQpO1xuLy8gICAgICAgdmFyIHJpZ2h0ID0gJChlbGVtZW50KS5oYXNDbGFzcygnZHJvcGRvd24tbWVudS1yaWdodCcpO1xuLy8gICAgICAgdmFyIG5ld0xlZnQgPSByaWdodCA/ICdhdXRvJyA6IHBvcy5sZWZ0O1xuLy8gICAgICAgLy8gaXQgc2VlbXMgbGlrZSBzZXR0aW5nIHRoZSBjc3MgaXMgYSBiYWQgaWRlYSAoanVzdCBsZXQgQm9vdHN0cmFwIGRvIGl0KSwgYnV0IEknbGwga2VlcCB0aGUgb2xkXG4vLyAgICAgICAvLyBsb2dpYyBpbiBwbGFjZSBleGNlcHQgZm9yIHRoZSBkcm9wdXAvcmlnaHQtYWxpZ24gY2FzZXMuXG4vLyAgICAgICBlbGVtZW50LmNzcyh7IHRvcDogbmV3VG9wLCBsZWZ0OiBuZXdMZWZ0IH0pLnNob3coKTtcblxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgPT09IHRydWUpIHtcbi8vICAgICAgICAgICBlbGVtZW50LmNzcyhcIndpZHRoXCIsIHRoaXMuJGVsZW1lbnQub3V0ZXJXaWR0aCgpICsgXCJweFwiKTtcbi8vICAgICAgIH1cbiAgICBcbi8vICAgICAgIHRoaXMuc2hvd24gPSB0cnVlO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJG1lbnUuaGlkZSgpO1xuLy8gICAgICAgdGhpcy5zaG93biA9IGZhbHNlO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGxvb2t1cDogZnVuY3Rpb24gKHF1ZXJ5KSB7XG4vLyAgICAgICB2YXIgaXRlbXM7XG4vLyAgICAgICBpZiAodHlwZW9mKHF1ZXJ5KSAhPSAndW5kZWZpbmVkJyAmJiBxdWVyeSAhPT0gbnVsbCkge1xuLy8gICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKSB8fCAnJztcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKHRoaXMucXVlcnkubGVuZ3RoIDwgdGhpcy5vcHRpb25zLm1pbkxlbmd0aCAmJiAhdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cykge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcztcbi8vICAgICAgIH1cblxuLy8gICAgICAgdmFyIHdvcmtlciA9ICQucHJveHkoZnVuY3Rpb24gKCkge1xuXG4vLyAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24odGhpcy5zb3VyY2UpKSB7XG4vLyAgICAgICAgICAgdGhpcy5zb3VyY2UodGhpcy5xdWVyeSwgJC5wcm94eSh0aGlzLnByb2Nlc3MsIHRoaXMpKTtcbi8vICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNvdXJjZSkge1xuLy8gICAgICAgICAgIHRoaXMucHJvY2Vzcyh0aGlzLnNvdXJjZSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0sIHRoaXMpO1xuXG4vLyAgICAgICBjbGVhclRpbWVvdXQodGhpcy5sb29rdXBXb3JrZXIpO1xuLy8gICAgICAgdGhpcy5sb29rdXBXb3JrZXIgPSBzZXRUaW1lb3V0KHdvcmtlciwgdGhpcy5kZWxheSk7XG4vLyAgICAgfSxcblxuLy8gICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4vLyAgICAgICBpdGVtcyA9ICQuZ3JlcChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgICAgcmV0dXJuIHRoYXQubWF0Y2hlcihpdGVtKTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpdGVtcyA9IHRoaXMuc29ydGVyKGl0ZW1zKTtcblxuLy8gICAgICAgaWYgKCFpdGVtcy5sZW5ndGggJiYgIXRoaXMub3B0aW9ucy5hZGRJdGVtKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnNob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW1zWzBdKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgbnVsbCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIC8vIEFkZCBpdGVtXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkZEl0ZW0pe1xuLy8gICAgICAgICBpdGVtcy5wdXNoKHRoaXMub3B0aW9ucy5hZGRJdGVtKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5pdGVtcyA9PSAnYWxsJykge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoaXRlbXMpLnNob3coKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihpdGVtcy5zbGljZSgwLCB0aGlzLm9wdGlvbnMuaXRlbXMpKS5zaG93KCk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIG1hdGNoZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICB2YXIgaXQgPSB0aGlzLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgcmV0dXJuIH5pdC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5xdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICB9LFxuXG4vLyAgICAgc29ydGVyOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciBiZWdpbnN3aXRoID0gW107XG4vLyAgICAgICB2YXIgY2FzZVNlbnNpdGl2ZSA9IFtdO1xuLy8gICAgICAgdmFyIGNhc2VJbnNlbnNpdGl2ZSA9IFtdO1xuLy8gICAgICAgdmFyIGl0ZW07XG5cbi8vICAgICAgIHdoaWxlICgoaXRlbSA9IGl0ZW1zLnNoaWZ0KCkpKSB7XG4vLyAgICAgICAgIHZhciBpdCA9IHRoaXMuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICAgIGlmICghaXQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSkpIGJlZ2luc3dpdGgucHVzaChpdGVtKTtcbi8vICAgICAgICAgZWxzZSBpZiAofml0LmluZGV4T2YodGhpcy5xdWVyeSkpIGNhc2VTZW5zaXRpdmUucHVzaChpdGVtKTtcbi8vICAgICAgICAgZWxzZSBjYXNlSW5zZW5zaXRpdmUucHVzaChpdGVtKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcmV0dXJuIGJlZ2luc3dpdGguY29uY2F0KGNhc2VTZW5zaXRpdmUsIGNhc2VJbnNlbnNpdGl2ZSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgdmFyIGh0bWwgPSAkKCc8ZGl2PjwvZGl2PicpO1xuLy8gICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyeTtcbi8vICAgICAgIHZhciBpID0gaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgICB2YXIgbGVuID0gcXVlcnkubGVuZ3RoO1xuLy8gICAgICAgdmFyIGxlZnRQYXJ0O1xuLy8gICAgICAgdmFyIG1pZGRsZVBhcnQ7XG4vLyAgICAgICB2YXIgcmlnaHRQYXJ0O1xuLy8gICAgICAgdmFyIHN0cm9uZztcbi8vICAgICAgIGlmIChsZW4gPT09IDApIHtcbi8vICAgICAgICAgcmV0dXJuIGh0bWwudGV4dChpdGVtKS5odG1sKCk7XG4vLyAgICAgICB9XG4vLyAgICAgICB3aGlsZSAoaSA+IC0xKSB7XG4vLyAgICAgICAgIGxlZnRQYXJ0ID0gaXRlbS5zdWJzdHIoMCwgaSk7XG4vLyAgICAgICAgIG1pZGRsZVBhcnQgPSBpdGVtLnN1YnN0cihpLCBsZW4pO1xuLy8gICAgICAgICByaWdodFBhcnQgPSBpdGVtLnN1YnN0cihpICsgbGVuKTtcbi8vICAgICAgICAgc3Ryb25nID0gJCgnPHN0cm9uZz48L3N0cm9uZz4nKS50ZXh0KG1pZGRsZVBhcnQpO1xuLy8gICAgICAgICBodG1sXG4vLyAgICAgICAgICAgLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsZWZ0UGFydCkpXG4vLyAgICAgICAgICAgLmFwcGVuZChzdHJvbmcpO1xuLy8gICAgICAgICBpdGVtID0gcmlnaHRQYXJ0O1xuLy8gICAgICAgICBpID0gaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gaHRtbC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaXRlbSkpLmh0bWwoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgcmVuZGVyOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciB0aGF0ID0gdGhpcztcbi8vICAgICAgIHZhciBzZWxmID0gdGhpcztcbi8vICAgICAgIHZhciBhY3RpdmVGb3VuZCA9IGZhbHNlO1xuLy8gICAgICAgdmFyIGRhdGEgPSBbXTtcbi8vICAgICAgIHZhciBfY2F0ZWdvcnkgPSB0aGF0Lm9wdGlvbnMuc2VwYXJhdG9yO1xuXG4vLyAgICAgICAkLmVhY2goaXRlbXMsIGZ1bmN0aW9uIChrZXksdmFsdWUpIHtcbi8vICAgICAgICAgLy8gaW5qZWN0IHNlcGFyYXRvclxuLy8gICAgICAgICBpZiAoa2V5ID4gMCAmJiB2YWx1ZVtfY2F0ZWdvcnldICE9PSBpdGVtc1trZXkgLSAxXVtfY2F0ZWdvcnldKXtcbi8vICAgICAgICAgICBkYXRhLnB1c2goe1xuLy8gICAgICAgICAgICAgX190eXBlOiAnZGl2aWRlcidcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIC8vIGluamVjdCBjYXRlZ29yeSBoZWFkZXJcbi8vICAgICAgICAgaWYgKHZhbHVlW19jYXRlZ29yeV0gJiYgKGtleSA9PT0gMCB8fCB2YWx1ZVtfY2F0ZWdvcnldICE9PSBpdGVtc1trZXkgLSAxXVtfY2F0ZWdvcnldKSl7XG4vLyAgICAgICAgICAgZGF0YS5wdXNoKHtcbi8vICAgICAgICAgICAgIF9fdHlwZTogJ2NhdGVnb3J5Jyxcbi8vICAgICAgICAgICAgIG5hbWU6IHZhbHVlW19jYXRlZ29yeV1cbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICBkYXRhLnB1c2godmFsdWUpO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGl0ZW1zID0gJChkYXRhKS5tYXAoZnVuY3Rpb24gKGksIGl0ZW0pIHtcbi8vICAgICAgICAgaWYgKChpdGVtLl9fdHlwZSB8fCBmYWxzZSkgPT0gJ2NhdGVnb3J5Jyl7XG4vLyAgICAgICAgICAgcmV0dXJuICQodGhhdC5vcHRpb25zLmhlYWRlckh0bWwpLnRleHQoaXRlbS5uYW1lKVswXTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIGlmICgoaXRlbS5fX3R5cGUgfHwgZmFsc2UpID09ICdkaXZpZGVyJyl7XG4vLyAgICAgICAgICAgcmV0dXJuICQodGhhdC5vcHRpb25zLmhlYWRlckRpdmlkZXIpWzBdO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgdmFyIHRleHQgPSBzZWxmLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgICBpID0gJCh0aGF0Lm9wdGlvbnMuaXRlbSkuZGF0YSgndmFsdWUnLCBpdGVtKTtcbi8vICAgICAgICAgaS5maW5kKCdhJykuaHRtbCh0aGF0LmhpZ2hsaWdodGVyKHRleHQsIGl0ZW0pKTtcbi8vICAgICAgICAgaWYgKHRleHQgPT0gc2VsZi4kZWxlbWVudC52YWwoKSkge1xuLy8gICAgICAgICAgIGkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgICAgIHNlbGYuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbSk7XG4vLyAgICAgICAgICAgYWN0aXZlRm91bmQgPSB0cnVlO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHJldHVybiBpWzBdO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGlmICh0aGlzLmF1dG9TZWxlY3QgJiYgIWFjdGl2ZUZvdW5kKSB7XG4vLyAgICAgICAgIGl0ZW1zLmZpbHRlcignOm5vdCguZHJvcGRvd24taGVhZGVyKScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW1zLmZpcnN0KCkuZGF0YSgndmFsdWUnKSk7XG4vLyAgICAgICB9XG4vLyAgICAgICB0aGlzLiRtZW51Lmh0bWwoaXRlbXMpO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGRpc3BsYXlUZXh0OiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaXRlbS5uYW1lICE9ICd1bmRlZmluZWQnICYmIGl0ZW0ubmFtZSB8fCBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBzZWxlY3RlZFRleHQ6IGZ1bmN0aW9uKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSAhPSAndW5kZWZpbmVkJyAmJiBpdGVtLm5hbWUgfHwgaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgbmV4dDogZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICB2YXIgYWN0aXZlID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgdmFyIG5leHQgPSBhY3RpdmUubmV4dCgpO1xuXG4vLyAgICAgICBpZiAoIW5leHQubGVuZ3RoKSB7XG4vLyAgICAgICAgIG5leHQgPSAkKHRoaXMuJG1lbnUuZmluZCgnbGknKVswXSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBwcmV2OiBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICB2YXIgcHJldiA9IGFjdGl2ZS5wcmV2KCk7XG5cbi8vICAgICAgIGlmICghcHJldi5sZW5ndGgpIHtcbi8vICAgICAgICAgcHJldiA9IHRoaXMuJG1lbnUuZmluZCgnbGknKS5sYXN0KCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHByZXYuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBsaXN0ZW46IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgLm9uKCdmb2N1cycsICAgICQucHJveHkodGhpcy5mb2N1cywgdGhpcykpXG4vLyAgICAgICAgIC5vbignYmx1cicsICAgICAkLnByb3h5KHRoaXMuYmx1ciwgdGhpcykpXG4vLyAgICAgICAgIC5vbigna2V5cHJlc3MnLCAkLnByb3h5KHRoaXMua2V5cHJlc3MsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2lucHV0JywgICAgJC5wcm94eSh0aGlzLmlucHV0LCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdrZXl1cCcsICAgICQucHJveHkodGhpcy5rZXl1cCwgdGhpcykpO1xuXG4vLyAgICAgICBpZiAodGhpcy5ldmVudFN1cHBvcnRlZCgna2V5ZG93bicpKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24nLCAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcykpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB0aGlzLiRtZW51XG4vLyAgICAgICAgIC5vbignY2xpY2snLCAkLnByb3h5KHRoaXMuY2xpY2ssIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlZW50ZXInLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VlbnRlciwgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2VsZWF2ZScsICdsaScsICQucHJveHkodGhpcy5tb3VzZWxlYXZlLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWRvd24nLCAkLnByb3h5KHRoaXMubW91c2Vkb3duLHRoaXMpKTtcbi8vICAgICB9LFxuXG4vLyAgICAgZGVzdHJveSA6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgndHlwZWFoZWFkJyxudWxsKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJyxudWxsKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgLm9mZignZm9jdXMnKVxuLy8gICAgICAgICAub2ZmKCdibHVyJylcbi8vICAgICAgICAgLm9mZigna2V5cHJlc3MnKVxuLy8gICAgICAgICAub2ZmKCdpbnB1dCcpXG4vLyAgICAgICAgIC5vZmYoJ2tleXVwJyk7XG5cbi8vICAgICAgIGlmICh0aGlzLmV2ZW50U3VwcG9ydGVkKCdrZXlkb3duJykpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2tleWRvd24nKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgdGhpcy4kbWVudS5yZW1vdmUoKTtcbi8vICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbi8vICAgICB9LFxuXG4vLyAgICAgZXZlbnRTdXBwb3J0ZWQ6IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbi8vICAgICAgIHZhciBpc1N1cHBvcnRlZCA9IGV2ZW50TmFtZSBpbiB0aGlzLiRlbGVtZW50O1xuLy8gICAgICAgaWYgKCFpc1N1cHBvcnRlZCkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LnNldEF0dHJpYnV0ZShldmVudE5hbWUsICdyZXR1cm47Jyk7XG4vLyAgICAgICAgIGlzU3VwcG9ydGVkID0gdHlwZW9mIHRoaXMuJGVsZW1lbnRbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJztcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBpc1N1cHBvcnRlZDtcbi8vICAgICB9LFxuXG4vLyAgICAgbW92ZTogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuXG4vLyAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuLy8gICAgICAgICBjYXNlIDk6IC8vIHRhYlxuLy8gICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuLy8gICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbi8vICAgICAgICAgICAvLyB3aXRoIHRoZSBzaGlmdEtleSAodGhpcyBpcyBhY3R1YWxseSB0aGUgbGVmdCBwYXJlbnRoZXNpcylcbi8vICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkgcmV0dXJuO1xuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICB0aGlzLnByZXYoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4vLyAgICAgICAgICAgLy8gd2l0aCB0aGUgc2hpZnRLZXkgKHRoaXMgaXMgYWN0dWFsbHkgdGhlIHJpZ2h0IHBhcmVudGhlc2lzKVxuLy8gICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSByZXR1cm47XG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIHRoaXMubmV4dCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5zdXBwcmVzc0tleVByZXNzUmVwZWF0ID0gfiQuaW5BcnJheShlLmtleUNvZGUsIFs0MCwzOCw5LDEzLDI3XSk7XG4vLyAgICAgICBpZiAoIXRoaXMuc2hvd24gJiYgZS5rZXlDb2RlID09IDQwKSB7XG4vLyAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLm1vdmUoZSk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleXByZXNzOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCkgcmV0dXJuO1xuLy8gICAgICAgdGhpcy5tb3ZlKGUpO1xuLy8gICAgIH0sXG5cbi8vICAgICBpbnB1dDogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIC8vIFRoaXMgaXMgYSBmaXhlZCBmb3IgSUUxMC8xMSB0aGF0IGZpcmVzIHRoZSBpbnB1dCBldmVudCB3aGVuIGEgcGxhY2Vob2RlciBpcyBjaGFuZ2VkXG4vLyAgICAgICAvLyAoaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MTA1MzgvaWUtMTEtZmlyZXMtaW5wdXQtZXZlbnQtb24tZm9jdXMpXG4vLyAgICAgICB2YXIgY3VycmVudFZhbHVlID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKTtcbi8vICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBjdXJyZW50VmFsdWUpIHtcbi8vICAgICAgICAgdGhpcy52YWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbi8vICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5dXA6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbi8vICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgfVxuLy8gICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbi8vICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuLy8gICAgICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuLy8gICAgICAgICBjYXNlIDE2OiAvLyBzaGlmdFxuLy8gICAgICAgICBjYXNlIDE3OiAvLyBjdHJsXG4vLyAgICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4vLyAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4vLyAgICAgICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG4vLyAgICAgICAgICAgdGhpcy5zZWxlY3QoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbi8vICAgICAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcbi8vICAgICAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICAgICAgICBicmVhaztcbi8vICAgICAgIH1cblxuXG4vLyAgICAgfSxcblxuLy8gICAgIGZvY3VzOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbi8vICAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbi8vICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgJiYgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzICE9PSB0cnVlKSB7XG4vLyAgICAgICAgICAgaWYodGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PT0gXCJhbGxcIikge1xuLy8gICAgICAgICAgICAgdGhpcy5sb29rdXAoXCJcIik7IFxuLy8gICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgICAgaWYgKHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cykge1xuLy8gICAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSBmYWxzZTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAgYmx1cjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5tb3VzZWRvdmVyICYmICF0aGlzLm1vdXNlZGRvd24gJiYgdGhpcy5zaG93bikge1xuLy8gICAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMubW91c2VkZG93bikge1xuLy8gICAgICAgICAvLyBUaGlzIGlzIGZvciBJRSB0aGF0IGJsdXJzIHRoZSBpbnB1dCB3aGVuIHVzZXIgY2xpY2tzIG9uIHNjcm9sbC5cbi8vICAgICAgICAgLy8gV2Ugc2V0IHRoZSBmb2N1cyBiYWNrIG9uIHRoZSBpbnB1dCBhbmQgcHJldmVudCB0aGUgbG9va3VwIHRvIG9jY3VyIGFnYWluXG4vLyAgICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IHRydWU7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbi8vICAgICAgICAgdGhpcy5tb3VzZWRkb3duID0gZmFsc2U7XG4vLyAgICAgICB9IFxuLy8gICAgIH0sXG5cbi8vICAgICBjbGljazogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IHRydWU7XG4vLyAgICAgICB0aGlzLnNlbGVjdCgpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5mb2N1cygpO1xuLy8gICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZG92ZXIgPSB0cnVlO1xuLy8gICAgICAgdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbW91c2VsZWF2ZTogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2Vkb3ZlciA9IGZhbHNlO1xuLy8gICAgICAgaWYgKCF0aGlzLmZvY3VzZWQgJiYgdGhpcy5zaG93bikgdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgLyoqXG4vLyAgICAgICogV2UgdHJhY2sgdGhlIG1vdXNlZG93biBmb3IgSUUuIFdoZW4gY2xpY2tpbmcgb24gdGhlIG1lbnUgc2Nyb2xsYmFyLCBJRSBtYWtlcyB0aGUgaW5wdXQgYmx1ciB0aHVzIGhpZGluZyB0aGUgbWVudS5cbi8vICAgICAgKi9cbi8vICAgICBtb3VzZWRvd246IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZGRvd24gPSB0cnVlO1xuLy8gICAgICAgdGhpcy4kbWVudS5vbmUoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKGUpe1xuLy8gICAgICAgICAvLyBJRSB3b24ndCBmaXJlIHRoaXMsIGJ1dCBGRiBhbmQgQ2hyb21lIHdpbGwgc28gd2UgcmVzZXQgb3VyIGZsYWcgZm9yIHRoZW0gaGVyZVxuLy8gICAgICAgICB0aGlzLm1vdXNlZGRvd24gPSBmYWxzZTtcbi8vICAgICAgIH0uYmluZCh0aGlzKSk7XG4vLyAgICAgfSxcblxuLy8gICB9O1xuXG5cbi8vICAgLyogVFlQRUFIRUFEIFBMVUdJTiBERUZJTklUSU9OXG4vLyAgICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgIHZhciBvbGQgPSAkLmZuLnR5cGVhaGVhZDtcblxuLy8gICAkLmZuLnR5cGVhaGVhZCA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbi8vICAgICB2YXIgYXJnID0gYXJndW1lbnRzO1xuLy8gICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnICYmIG9wdGlvbiA9PSAnZ2V0QWN0aXZlJykge1xuLy8gICAgICAgcmV0dXJuIHRoaXMuZGF0YSgnYWN0aXZlJyk7XG4vLyAgICAgfVxuLy8gICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbi8vICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgndHlwZWFoZWFkJyk7XG4vLyAgICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uO1xuLy8gICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCd0eXBlYWhlYWQnLCAoZGF0YSA9IG5ldyBUeXBlYWhlYWQodGhpcywgb3B0aW9ucykpKTtcbi8vICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnICYmIGRhdGFbb3B0aW9uXSkge1xuLy8gICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDEpIHtcbi8vICAgICAgICAgICBkYXRhW29wdGlvbl0uYXBwbHkoZGF0YSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJnLCAxKSk7XG4vLyAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgZGF0YVtvcHRpb25dKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfTtcblxuLy8gICAkLmZuLnR5cGVhaGVhZC5kZWZhdWx0cyA9IHtcbi8vICAgICBzb3VyY2U6IFtdLFxuLy8gICAgIGl0ZW1zOiA4LFxuLy8gICAgIG1lbnU6ICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgZHJvcGRvd24tbWVudVwiIHJvbGU9XCJsaXN0Ym94XCI+PC91bD4nLFxuLy8gICAgIGl0ZW06ICc8bGk+PGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cIiNcIiByb2xlPVwib3B0aW9uXCI+PC9hPjwvbGk+Jyxcbi8vICAgICBtaW5MZW5ndGg6IDEsXG4vLyAgICAgc2Nyb2xsSGVpZ2h0OiAwLFxuLy8gICAgIGF1dG9TZWxlY3Q6IHRydWUsXG4vLyAgICAgYWZ0ZXJTZWxlY3Q6ICQubm9vcCxcbi8vICAgICBhZGRJdGVtOiBmYWxzZSxcbi8vICAgICBkZWxheTogMCxcbi8vICAgICBzZXBhcmF0b3I6ICdjYXRlZ29yeScsXG4vLyAgICAgaGVhZGVySHRtbDogJzxsaSBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiPjwvbGk+Jyxcbi8vICAgICBoZWFkZXJEaXZpZGVyOiAnPGxpIGNsYXNzPVwiZGl2aWRlclwiIHJvbGU9XCJzZXBhcmF0b3JcIj48L2xpPidcbi8vICAgfTtcblxuLy8gICAkLmZuLnR5cGVhaGVhZC5Db25zdHJ1Y3RvciA9IFR5cGVhaGVhZDtcblxuLy8gIC8qIFRZUEVBSEVBRCBOTyBDT05GTElDVFxuLy8gICAqID09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICAkLmZuLnR5cGVhaGVhZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICQuZm4udHlwZWFoZWFkID0gb2xkO1xuLy8gICAgIHJldHVybiB0aGlzO1xuLy8gICB9O1xuXG5cbi8vICAvKiBUWVBFQUhFQUQgREFUQS1BUElcbi8vICAgKiA9PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICAkKGRvY3VtZW50KS5vbignZm9jdXMudHlwZWFoZWFkLmRhdGEtYXBpJywgJ1tkYXRhLXByb3ZpZGU9XCJ0eXBlYWhlYWRcIl0nLCBmdW5jdGlvbiAoZSkge1xuLy8gICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4vLyAgICAgaWYgKCR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpKSByZXR1cm47XG4vLyAgICAgJHRoaXMudHlwZWFoZWFkKCR0aGlzLmRhdGEoKSk7XG4vLyAgIH0pO1xuXG4vLyB9KSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9tYWluLnRzXG4gKiovIiwiXG5jbGFzcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQgcmVzdWx0czpBcnJheTxPYmplY3Q+O1xuXG5cdHByb3RlY3RlZCBfc2V0dGluZ3M6YW55O1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0dGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0UmVzdWx0cyhsaW1pdD86bnVtYmVyLCBzdGFydD86bnVtYmVyLCBlbmQ/Om51bWJlcik6QXJyYXk8T2JqZWN0PiB7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMucmVzdWx0cztcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0Y2JrKHRoaXMuZ2V0UmVzdWx0cygpKTtcblx0fVxuXG59XG5cbmV4cG9ydCBjbGFzcyBBamF4UmVzb2x2ZXIgZXh0ZW5kcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQganFYSFI6SlF1ZXJ5WEhSO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHQvLyBjb25zb2xlLmxvZygncmVzb2x2ZXIgc2V0dGluZ3MnLCB0aGlzLl9zZXR0aW5ncyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJycsXG5cdFx0XHRtZXRob2Q6ICdnZXQnLFxuXHRcdFx0cXVlcnlLZXk6ICdxJyxcblx0XHRcdGV4dHJhRGF0YToge30sXG5cdFx0XHR0aW1lb3V0OiB1bmRlZmluZWQsXG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0aWYgKHRoaXMuanFYSFIgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5qcVhIUi5hYm9ydCgpO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhOk9iamVjdCA9IHt9O1xuXHRcdGRhdGFbdGhpcy5fc2V0dGluZ3MucXVlcnlLZXldID0gcTtcblx0XHQkLmV4dGVuZChkYXRhLCB0aGlzLl9zZXR0aW5ncy5leHRyYURhdGEpO1xuXG5cdFx0dGhpcy5qcVhIUiA9ICQuYWpheChcblx0XHRcdHRoaXMuX3NldHRpbmdzLnVybCxcblx0XHRcdHtcblx0XHRcdFx0bWV0aG9kOiB0aGlzLl9zZXR0aW5ncy5tZXRob2QsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHRpbWVvdXQ6IHRoaXMuX3NldHRpbmdzLnRpbWVvdXRcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dGhpcy5qcVhIUi5kb25lKChyZXN1bHQpID0+IHtcblx0XHRcdGNiayhyZXN1bHQpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuanFYSFIuZmFpbCgoZXJyKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5qcVhIUi5hbHdheXMoKCkgPT4ge1xuXHRcdFx0dGhpcy5qcVhIUiA9IG51bGw7XG5cdFx0fSk7XG5cdH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVzb2x2ZXJzLnRzXG4gKiovIiwiLypcbiAqXHREcm9wZG93biBjbGFzcy4gTWFuYWdlcyB0aGUgZHJvcGRvd24gZHJhd2luZ1xuICovXG5leHBvcnQgY2xhc3MgRHJvcGRvd24ge1xuXHRwcm90ZWN0ZWQgXyRlbDpKUXVlcnk7XG5cdHByb3RlY3RlZCBfZGQ6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgc2hvd246Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgaXRlbXM6YW55W10gPSBbXTtcblx0cHJvdGVjdGVkIGZvcm1hdEl0ZW06RnVuY3Rpb247XG5cdHByb3RlY3RlZCBzZWFyY2hUZXh0OnN0cmluZztcblx0cHJvdGVjdGVkIGF1dG9TZWxlY3Q6Ym9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbiwgYXV0b1NlbGVjdDpib29sZWFuKSB7XG5cdFx0dGhpcy5fJGVsID0gZTtcblx0XHR0aGlzLmZvcm1hdEl0ZW0gPSBmb3JtYXRJdGVtQ2JrO1xuXHRcdHRoaXMuYXV0b1NlbGVjdCA9IGF1dG9TZWxlY3Q7XG5cdFx0XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBpbml0KCk6dm9pZCB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSBkcm9wZG93blxuXHRcdGxldCBwb3M6YW55ID0gJC5leHRlbmQoe30sIHRoaXMuXyRlbC5wb3NpdGlvbigpLCB7XG4gICAgICAgIFx0XHRcdFx0aGVpZ2h0OiB0aGlzLl8kZWxbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgXHRcdFx0XHR9KTtcblx0XHRcblx0XHQvLyBjcmVhdGUgZWxlbWVudFxuXHRcdHRoaXMuX2RkID0gJCgnPHVsIC8+Jyk7XG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdHRoaXMuX2RkLmFkZENsYXNzKCdib290c3RyYXAtYXV0b2NvbXBsZXRlIGRyb3Bkb3duLW1lbnUnKTtcblxuXHRcdHRoaXMuX2RkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cdFx0dGhpcy5fZGQuY3NzKHsgbGVmdDogcG9zLmxlZnQsIHdpZHRoOiB0aGlzLl8kZWwub3V0ZXJXaWR0aCgpIH0pO1xuXHRcdFxuXHRcdC8vIGNsaWNrIGV2ZW50IG9uIGl0ZW1zXG5cdFx0dGhpcy5fZGQub24oJ2NsaWNrJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NsaWNrZWQnLCBldnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCQoZXZ0LmN1cnJlbnRUYXJnZXQpKTtcblx0XHRcdGxldCBpdGVtOmFueSA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2l0ZW0nKTtcblx0XHRcdHRoaXMuaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5fZGQub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG5cdFx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcblx0XHRcdFx0XHRcdHRoaXMuXyRlbC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ2ZvY3VzJywgJ2xpIGEnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCd1bCcpLmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ2xpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlZW50ZXInLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5maW5kKCdhJykuZm9jdXMoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFxuXHR9XG5cblx0cHVibGljIGZvY3VzSXRlbShpbmRleDpudW1iZXIpIHtcblx0XHQvLyBGb2N1cyBhbiBpdGVtIGluIHRoZSBsaXN0XG5cdFx0aWYgKHRoaXMuc2hvd24gJiYgKHRoaXMuaXRlbXMubGVuZ3RoID4gaW5kZXgpKVxuXHRcdFx0dGhpcy5fZGQuZmluZCgnbGknKS5lcShpbmRleCkuZmluZCgnYScpLmZvY3VzKCk7XG5cdH1cblxuXHRwdWJsaWMgc2hvdygpOnZvaWQge1xuXHRcdGlmICghdGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5zaG93KCk7XG5cdFx0XHR0aGlzLnNob3duID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgaXNTaG93bigpOmJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLnNob3duO1xuXHR9XG5cblx0cHVibGljIGhpZGUoKTp2b2lkIHtcblx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5oaWRlKCk7XG5cdFx0XHR0aGlzLnNob3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZUl0ZW1zKGl0ZW1zOmFueVtdLCBzZWFyY2hUZXh0OnN0cmluZykge1xuXHRcdC8vIGNvbnNvbGUubG9nKCd1cGRhdGVJdGVtcycsIGl0ZW1zKTtcblx0XHR0aGlzLml0ZW1zID0gaXRlbXM7XG5cdFx0dGhpcy5zZWFyY2hUZXh0ID0gc2VhcmNoVGV4dDtcblx0XHR0aGlzLnJlZnJlc2hJdGVtTGlzdCgpO1xuXHR9XG5cblx0cHJpdmF0ZSBzaG93TWF0Y2hlZFRleHQodGV4dDpzdHJpbmcsIHFyeTpzdHJpbmcpOnN0cmluZyB7XG5cdFx0bGV0IHN0YXJ0SW5kZXg6bnVtYmVyID0gdGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXJ5LnRvTG93ZXJDYXNlKCkpO1xuXHRcdGlmIChzdGFydEluZGV4ID4gLTEpIHtcblx0XHRcdGxldCBlbmRJbmRleDpudW1iZXIgPSBzdGFydEluZGV4ICsgcXJ5Lmxlbmd0aDtcblxuXHRcdFx0cmV0dXJuIHRleHQuc2xpY2UoMCwgc3RhcnRJbmRleCkgKyAnPGI+JyBcblx0XHRcdFx0KyB0ZXh0LnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KSArICc8L2I+J1xuXHRcdFx0XHQrIHRleHQuc2xpY2UoZW5kSW5kZXgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGV4dDtcblx0fVxuXG5cdHByb3RlY3RlZCByZWZyZXNoSXRlbUxpc3QoKSB7XG5cdFx0dGhpcy5fZGQuZW1wdHkoKTtcblx0XHRsZXQgbGlMaXN0OkpRdWVyeVtdID0gW107XG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0bGV0IGl0ZW1Gb3JtYXR0ZWQ6YW55ID0gdGhpcy5mb3JtYXRJdGVtKGl0ZW0pO1xuXHRcdFx0aWYgKHR5cGVvZiBpdGVtRm9ybWF0dGVkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdH1cblx0XHRcdGxldCBpdGVtVGV4dDpzdHJpbmc7XG5cdFx0XHRsZXQgaXRlbUh0bWw6YW55O1xuXG5cdFx0XHRpdGVtVGV4dCA9IHRoaXMuc2hvd01hdGNoZWRUZXh0KGl0ZW1Gb3JtYXR0ZWQudGV4dCwgdGhpcy5zZWFyY2hUZXh0KTtcblx0XHRcdGlmICggaXRlbUZvcm1hdHRlZC5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGl0ZW1IdG1sID0gaXRlbUZvcm1hdHRlZC5odG1sO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtVGV4dDtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0bGV0IGxpID0gJCgnPGxpID4nKTtcblx0XHRcdGxpLmFwcGVuZChcblx0XHRcdFx0JCgnPGE+JykuYXR0cignaHJlZicsICcjJykuaHRtbChpdGVtSHRtbClcblx0XHRcdClcblx0XHRcdC5kYXRhKCdpdGVtJywgaXRlbSk7XG5cdFx0XHRcblx0XHRcdGxpTGlzdC5wdXNoKGxpKTtcblx0XHR9KTtcblx0XHQgXG5cdFx0dGhpcy5fZGQuYXBwZW5kKGxpTGlzdCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbTphbnkpOnZvaWQge1xuXHRcdC8vIGxhdW5jaCBzZWxlY3RlZCBldmVudFxuXHRcdC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudCcsIGl0ZW0pO1xuXHRcdHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VsZWN0JywgaXRlbSlcblx0fVxuXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZHJvcGRvd24udHNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9