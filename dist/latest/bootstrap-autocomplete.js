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
	            this._selectedItem = null;
	            this._defaultValue = null;
	            this._defaultText = null;
	            this._isSelectElement = false;
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
	        AutoComplete.prototype.manageInlineDataAttributes = function () {
	            // updates settings with data-* attributes
	            var s = this.getSettings();
	            if (this._$el.data('url')) {
	                s['resolverSettings'].url = this._$el.data('url');
	            }
	            if (this._$el.data('default-value')) {
	                this._defaultValue = this._$el.data('default-value');
	            }
	            if (this._$el.data('default-text')) {
	                this._defaultText = this._$el.data('default-text');
	            }
	        };
	        AutoComplete.prototype.getSettings = function () {
	            return this._settings;
	        };
	        AutoComplete.prototype.convertSelectToText = function () {
	            // create hidden field
	            var hidField = $('<input>');
	            hidField.attr('type', 'hidden');
	            hidField.attr('name', this._$el.attr('name'));
	            if (this._defaultValue) {
	                hidField.val(this._defaultValue);
	            }
	            this._selectHiddenField = hidField;
	            hidField.insertAfter(this._$el);
	            // create search input element
	            var searchField = $('<input>');
	            searchField.attr('type', 'text');
	            searchField.attr('name', this._$el.attr('name') + '_text');
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
	            this._$el.on('keydown', function (evt) {
	                switch (evt.which) {
	                    case 40:
	                        // arrow DOWN
	                        evt.stopPropagation();
	                        evt.preventDefault();
	                        break;
	                    case 38:
	                        evt.stopPropagation();
	                        evt.preventDefault();
	                        break;
	                    case 9:
	                        if (_this._settings.autoSelect) {
	                            // if autoSelect enabled selects on blur the currently selected item
	                            _this._dd.selectFocusItem();
	                        }
	                        break;
	                }
	            });
	            this._$el.on('focus keyup', function (evt) {
	                // check key
	                switch (evt.which) {
	                    case 16: // shift
	                    case 17: // ctrl
	                    case 18: // alt
	                    case 39: // right
	                    case 37:
	                        break;
	                    case 40:
	                        // arrow DOWN
	                        _this._dd.focusNextItem();
	                        break;
	                    case 38:
	                        _this._dd.focusPreviousItem();
	                        break;
	                    case 13:
	                        _this._dd.selectFocusItem();
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
	            this._$el.on('blur', function (evt) {
	                // console.log(evt);
	                if (!_this._dd.isMouseOver) {
	                    if (_this._isSelectElement) {
	                        // if it's a select element you must
	                        if (_this._dd.isItemFocused) {
	                            _this._dd.selectFocusItem();
	                        }
	                        else if ((_this._selectedItem !== null) && (_this._$el.val() !== '')) {
	                            // reselect it
	                            _this._$el.trigger('autocomplete.select', _this._selectedItem);
	                        }
	                        else if ((_this._$el.val() !== '') && (_this._defaultValue !== null)) {
	                            // select Default
	                            _this._$el.val(_this._defaultText);
	                            _this._selectHiddenField.val(_this._defaultValue);
	                            _this._selectedItem = null;
	                        }
	                        else {
	                            // empty the values
	                            _this._$el.val('');
	                            _this._selectHiddenField.val('');
	                            _this._selectedItem = null;
	                        }
	                    }
	                    _this._dd.hide();
	                }
	            });
	            // selected event
	            this._$el.on('autocomplete.select', function (evt, item) {
	                _this._selectedItem = item;
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
	            // if the element is a select
	            if (this._isSelectElement) {
	                this._selectHiddenField.val(itemFormatted.value);
	            }
	            // save selected item
	            this._selectedItem = item;
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
	            // console.log(err);
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
	        this._dd.on('mouseenter', 'li', function (evt) {
	            $(evt.currentTarget).closest('ul').find('li.active').removeClass('active');
	            $(evt.currentTarget).addClass('active');
	            _this.mouseover = true;
	        });
	        this._dd.on('mouseleave', 'li', function (evt) {
	            _this.mouseover = false;
	        });
	        this.initialized = true;
	    };
	    Object.defineProperty(Dropdown.prototype, "isMouseOver", {
	        get: function () {
	            return this.mouseover;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.focusNextItem = function (reversed) {
	        // get selected
	        var currElem = this._dd.find('li.active');
	        var nextElem = reversed ? currElem.prev() : currElem.next();
	        if (nextElem.length == 0) {
	            // first 
	            nextElem = reversed ? this._dd.find('li').last() : this._dd.find('li').first();
	        }
	        currElem.removeClass('active');
	        nextElem.addClass('active');
	    };
	    Dropdown.prototype.focusPreviousItem = function () {
	        this.focusNextItem(true);
	    };
	    Dropdown.prototype.focusItem = function (index) {
	        // Focus an item in the list
	        if (this.shown && (this.items.length > index))
	            this._dd.find('li').eq(index).find('a').focus();
	    };
	    Dropdown.prototype.selectFocusItem = function () {
	        this._dd.find('li.active').trigger('click');
	    };
	    Object.defineProperty(Dropdown.prototype, "isItemFocused", {
	        get: function () {
	            if (this._dd.find('li.active').length > 0) {
	                return true;
	            }
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGUyNGE1NWUyMjQyODVlMTk3MzIiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQWdUcEI7QUFoVEQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQWdDRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQXpCaEMsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsaUJBQVksR0FBVSxJQUFJLENBQUM7YUFDM0IscUJBQWdCLEdBQVcsS0FBSyxDQUFDO2FBR2pDLGNBQVMsR0FBRztpQkFDbEIsUUFBUSxFQUFVLE1BQU07aUJBQ3hCLGdCQUFnQixFQUFPLEVBQUU7aUJBQ3pCLFNBQVMsRUFBVSxDQUFDO2lCQUNwQixRQUFRLEVBQVUsT0FBTztpQkFDekIsWUFBWSxFQUFZLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2hELFVBQVUsRUFBVyxJQUFJO2lCQUN6QixNQUFNLEVBQUU7cUJBQ04sS0FBSyxFQUFZLElBQUk7cUJBQ3JCLFNBQVMsRUFBWSxJQUFJO3FCQUN6QixNQUFNLEVBQVksSUFBSTtxQkFDdEIsVUFBVSxFQUFZLElBQUk7cUJBQzFCLE1B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LElBQUksUUFBWSxDQUFDO2FBRWpCLFFBQVEsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3JFLEVBQUUsQ0FBQyxDQUFFLGFBQWEsQ0FBQyxJQUFJLEtBQUssU0FBVSxDQUFDLENBQUMsQ0FBQztpQkFDeEMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7YUFDL0IsQ0FBQzthQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNQLFFBQVEsR0FBRyxRQUFRLENBQUM7YUFDckIsQ0FBQzthQUVELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNwQixFQUFFLENBQUMsTUFBTSxDQUNSLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekM7a0JBQ0EsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUVwQixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1NBRUgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekIsQ0FBQztLQUVTLDBDQUF1QixHQUFqQyxVQUFrQyxJQUFRO1NBQ3pDLHdCQUF3QjtTQUN4QixnREFBZ0Q7U0FDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDO0tBQy9DLENBQUM7S0FFRixlQUFDO0FBQUQsRUFBQztBQXBMWSxpQkFBUSxXQW9McEIiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgOGUyNGE1NWUyMjQyODVlMTk3MzJcbiAqKi8iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtYXV0b2NvbXBsZXRlLmpzIHYwLjAuMVxuICogaHR0cHM6Ly9naXRodWIuY29tL3hjYXNoL2Jvb3RzdHJhcC1hdXRvY29tcGxldGVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEZvcmtlZCBmcm9tIGJvb3RzdHJhcDMtdHlwZWFoZWFkLmpzIHYzLjEuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2Jhc3Nqb2JzZW4vQm9vdHN0cmFwLTMtVHlwZWFoZWFkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBPcmlnaW5hbCB3cml0dGVuIGJ5IEBtZG8gYW5kIEBmYXRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDE2IFBhb2xvIENhc2NpZWxsbyBAeGNhc2g2NjYgYW5kIGNvbnRyaWJ1dG9yc1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAodGhlICdMaWNlbnNlJyk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gJ0FTIElTJyBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmltcG9ydCB7IEFqYXhSZXNvbHZlciB9IGZyb20gJy4vcmVzb2x2ZXJzJztcbmltcG9ydCB7IERyb3Bkb3duIH0gZnJvbSAnLi9kcm9wZG93bic7XG5cbm1vZHVsZSBBdXRvQ29tcGxldGVOUyB7XG4gIGV4cG9ydCBjbGFzcyBBdXRvQ29tcGxldGUge1xuICAgIHB1YmxpYyBzdGF0aWMgTkFNRTpzdHJpbmcgPSAnYXV0b0NvbXBsZXRlJztcblxuICAgIHByaXZhdGUgX2VsOkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfJGVsOkpRdWVyeTtcbiAgICBwcml2YXRlIF9kZDpEcm9wZG93bjtcbiAgICBwcml2YXRlIF9zZWFyY2hUZXh0OnN0cmluZztcbiAgICBwcml2YXRlIF9zZWxlY3RlZEl0ZW06YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VmFsdWU6YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VGV4dDpzdHJpbmcgPSBudWxsO1xuICAgIHByaXZhdGUgX2lzU2VsZWN0RWxlbWVudDpib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfc2VsZWN0SGlkZGVuRmllbGQ6SlF1ZXJ5O1xuXG4gICAgcHJpdmF0ZSBfc2V0dGluZ3MgPSB7XG4gICAgICByZXNvbHZlcjo8c3RyaW5nPiAnYWpheCcsXG4gICAgICByZXNvbHZlclNldHRpbmdzOjxhbnk+IHt9LFxuICAgICAgbWluTGVuZ3RoOjxudW1iZXI+IDMsXG4gICAgICB2YWx1ZUtleTo8c3RyaW5nPiAndmFsdWUnLFxuICAgICAgZm9ybWF0UmVzdWx0OjxGdW5jdGlvbj4gdGhpcy5kZWZhdWx0Rm9ybWF0UmVzdWx0LFxuICAgICAgYXV0b1NlbGVjdDo8Ym9vbGVhbj4gdHJ1ZSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICB0eXBlZDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFByZTo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFBvc3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWxlY3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBmb2N1czo8RnVuY3Rpb24+IG51bGwsXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcmVzb2x2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkVsZW1lbnQsIG9wdGlvbnM/Ont9KSB7XG4gICAgICB0aGlzLl9lbCA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLl8kZWwgPSAkKHRoaXMuX2VsKTtcbiAgICAgIC8vIGVsZW1lbnQgdHlwZVxuICAgICAgaWYgKHRoaXMuXyRlbC5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgdGhpcy5faXNTZWxlY3RFbGVtZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGlubGluZSBkYXRhIGF0dHJpYnV0ZXNcbiAgICAgIHRoaXMubWFuYWdlSW5saW5lRGF0YUF0dHJpYnV0ZXMoKTtcbiAgICAgIC8vIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXRTZXR0aW5ncygpLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb252ZXJ0U2VsZWN0VG9UZXh0KCk7XG4gICAgICB9IFxuICAgICAgXG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6aW5nJywgdGhpcy5fc2V0dGluZ3MpO1xuICAgICAgXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hbmFnZUlubGluZURhdGFBdHRyaWJ1dGVzKCkge1xuICAgICAgLy8gdXBkYXRlcyBzZXR0aW5ncyB3aXRoIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICBsZXQgcyA9IHRoaXMuZ2V0U2V0dGluZ3MoKTtcbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgndXJsJykpIHtcbiAgICAgICAgc1sncmVzb2x2ZXJTZXR0aW5ncyddLnVybCA9IHRoaXMuXyRlbC5kYXRhKCd1cmwnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC12YWx1ZScpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXZhbHVlJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRUZXh0ID0gdGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2V0dGluZ3MoKTp7fSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb252ZXJ0U2VsZWN0VG9UZXh0KCkge1xuICAgICAgLy8gY3JlYXRlIGhpZGRlbiBmaWVsZFxuXG4gICAgICBsZXQgaGlkRmllbGQ6SlF1ZXJ5ID0gJCgnPGlucHV0PicpO1xuICAgICAgaGlkRmllbGQuYXR0cigndHlwZScsICdoaWRkZW4nKTtcbiAgICAgIGhpZEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaGlkRmllbGQudmFsKHRoaXMuX2RlZmF1bHRWYWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZCA9IGhpZEZpZWxkO1xuICAgICAgXG4gICAgICBoaWRGaWVsZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXG4gICAgICAvLyBjcmVhdGUgc2VhcmNoIGlucHV0IGVsZW1lbnRcbiAgICAgIGxldCBzZWFyY2hGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCd0eXBlJywgJ3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpICsgJ190ZXh0Jyk7XG4gICAgICBzZWFyY2hGaWVsZC5hZGRDbGFzcyh0aGlzLl8kZWwuYXR0cignY2xhc3MnKSk7XG4gICAgICBpZiAodGhpcy5fZGVmYXVsdFRleHQpIHtcbiAgICAgICAgc2VhcmNoRmllbGQudmFsKHRoaXMuX2RlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gYXR0YWNoIGNsYXNzXG4gICAgICBzZWFyY2hGaWVsZC5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCB0aGlzKTtcblxuICAgICAgLy8gcmVwbGFjZSBvcmlnaW5hbCB3aXRoIHNlYXJjaEZpZWxkXG4gICAgICB0aGlzLl8kZWwucmVwbGFjZVdpdGgoc2VhcmNoRmllbGQpO1xuICAgICAgdGhpcy5fJGVsID0gc2VhcmNoRmllbGQ7XG4gICAgICB0aGlzLl9lbCA9IHNlYXJjaEZpZWxkLmdldCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdCgpOnZvaWQge1xuICAgICAgLy8gYmluZCBkZWZhdWx0IGV2ZW50c1xuICAgICAgdGhpcy5iaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAvLyBSRVNPTFZFUlxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyID09PSAnYWpheCcpIHtcbiAgICAgICAgLy8gY29uZmlndXJlIGRlZmF1bHQgcmVzb2x2ZXJcbiAgICAgICAgdGhpcy5yZXNvbHZlciA9IG5ldyBBamF4UmVzb2x2ZXIodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXJTZXR0aW5ncyk7XG4gICAgICB9XG4gICAgICAvLyBEcm9wZG93blxuICAgICAgdGhpcy5fZGQgPSBuZXcgRHJvcGRvd24odGhpcy5fJGVsLCB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQsIHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTp2b2lkIHtcbiAgICAgIHRoaXMuXyRlbC5vbigna2V5ZG93bicsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgRE9XTlxuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDk6IC8vIFRBQlxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QpIHtcbiAgICAgICAgICAgICAgLy8gaWYgYXV0b1NlbGVjdCBlbmFibGVkIHNlbGVjdHMgb24gYmx1ciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9XG5cdFx0XHRcdFx0XHRicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuXyRlbC5vbignZm9jdXMga2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGtleVxuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuICAgICAgICAgIGNhc2UgMTY6IC8vIHNoaWZ0XG4gICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuICAgICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgICAgY2FzZSAzNzogLy8gbGVmdCBcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c05leHRJdGVtKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgdGhpcy5fZGQuZm9jdXNQcmV2aW91c0l0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTM6IC8vIEVOVEVSXG4gICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0NcbiAgICAgICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLl8kZWwudmFsKCk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXJUeXBlZChuZXdWYWx1ZSk7XG5cdFx0XHRcdH1cbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fJGVsLm9uKCdibHVyJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgICBpZiAoIXRoaXMuX2RkLmlzTW91c2VPdmVyKSB7XG5cbiAgICAgICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgc2VsZWN0IGVsZW1lbnQgeW91IG11c3RcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZC5pc0l0ZW1Gb2N1c2VkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKHRoaXMuX3NlbGVjdGVkSXRlbSAhPT0gbnVsbCkgJiYgKHRoaXMuXyRlbC52YWwoKSAhPT0gJycpICkge1xuICAgICAgICAgICAgICAvLyByZXNlbGVjdCBpdFxuICAgICAgICAgICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIHRoaXMuX3NlbGVjdGVkSXRlbSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAodGhpcy5fJGVsLnZhbCgpICE9PSAnJykgJiYgKHRoaXMuX2RlZmF1bHRWYWx1ZSAhPT0gbnVsbCkgKSB7XG4gICAgICAgICAgICAgIC8vIHNlbGVjdCBEZWZhdWx0XG4gICAgICAgICAgICAgIHRoaXMuXyRlbC52YWwodGhpcy5fZGVmYXVsdFRleHQpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwodGhpcy5fZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGVtcHR5IHRoZSB2YWx1ZXNcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gc2VsZWN0ZWQgZXZlbnRcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIGl0ZW06YW55KSA9PiB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGl0ZW07XG4gICAgICAgIHRoaXMuaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbSk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGhhbmRsZXJUeXBlZChuZXdWYWx1ZTpzdHJpbmcpOnZvaWQge1xuICAgICAgLy8gZmllbGQgdmFsdWUgY2hhbmdlZFxuXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkICE9PSBudWxsKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHZhbHVlID49IG1pbkxlbmd0aCwgc3RhcnQgYXV0b2NvbXBsZXRlXG4gICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID49IHRoaXMuX3NldHRpbmdzLm1pbkxlbmd0aCkge1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuaGFuZGxlclByZVNlYXJjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlclByZVNlYXJjaCgpOnZvaWQge1xuICAgICAgLy8gZG8gbm90aGluZywgc3RhcnQgc2VhcmNoXG4gICAgICBcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlICE9PSBudWxsKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZTpzdHJpbmcgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlKHRoaXMuX3NlYXJjaFRleHQpO1xuICAgICAgICBpZiAoIW5ld1ZhbHVlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc2VhcmNoVGV4dCA9IG5ld1ZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJEb1NlYXJjaCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlckRvU2VhcmNoKCk6dm9pZCB7XG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoKHRoaXMuX3NlYXJjaFRleHQsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAgIHRoaXMucG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQgYmVoYXZpb3VyXG4gICAgICAgIC8vIHNlYXJjaCB1c2luZyBjdXJyZW50IHJlc29sdmVyXG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVyKSB7XG4gICAgICAgICAgdGhpcy5yZXNvbHZlci5zZWFyY2godGhpcy5fc2VhcmNoVGV4dCwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFjayBjYWxsZWQnLCByZXN1bHRzKTtcbiAgICAgIFxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQb3N0KSB7XG4gICAgICAgIHJlc3VsdHMgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUG9zdChyZXN1bHRzKTtcbiAgICAgICAgaWYgKCAodHlwZW9mIHJlc3VsdHMgPT09ICdib29sZWFuJykgJiYgIXJlc3VsdHMpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJTdGFydFNob3cocmVzdWx0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyU3RhcnRTaG93KHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGVmYXVsdEV2ZW50U3RhcnRTaG93XCIsIHJlc3VsdHMpO1xuICAgICAgLy8gZm9yIGV2ZXJ5IHJlc3VsdCwgZHJhdyBpdFxuICAgICAgdGhpcy5fZGQudXBkYXRlSXRlbXMocmVzdWx0cywgdGhpcy5fc2VhcmNoVGV4dCk7XG4gICAgICB0aGlzLl9kZC5zaG93KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGl0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW06YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcicsIGl0ZW0pO1xuICAgICAgLy8gZGVmYXVsdCBiZWhhdmlvdXIgaXMgc2V0IGVsbWVudCdzIC52YWwoKVxuICAgICAgbGV0IGl0ZW1Gb3JtYXR0ZWQ6YW55ID0gdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0KGl0ZW0pO1xuXHRcdFx0aWYgKHR5cGVvZiBpdGVtRm9ybWF0dGVkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdH1cbiAgICAgIHRoaXMuXyRlbC52YWwoaXRlbUZvcm1hdHRlZC50ZXh0KTtcbiAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgc2VsZWN0XG4gICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbChpdGVtRm9ybWF0dGVkLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIC8vIHNhdmUgc2VsZWN0ZWQgaXRlbVxuICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gaXRlbTtcbiAgICAgIC8vIGFuZCBoaWRlXG4gICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0Rm9ybWF0UmVzdWx0KGl0ZW06YW55KTp7fSB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtIH07XG4gICAgICB9IGVsc2UgaWYgKCBpdGVtLnRleHQgKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV0dXJuIGEgdG9TdHJpbmcgb2YgdGhlIGl0ZW0gYXMgbGFzdCByZXNvcnRcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignTm8gZGVmYXVsdCBmb3JtYXR0ZXIgZm9yIGl0ZW0nLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbS50b1N0cmluZygpIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuXG4oZnVuY3Rpb24oJDogSlF1ZXJ5U3RhdGljLCB3aW5kb3c6IGFueSwgZG9jdW1lbnQ6IGFueSkge1xuICAkLmZuW0F1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FXSA9IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGx1Z2luQ2xhc3M6QXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlO1xuXG4gICAgICBwbHVnaW5DbGFzcyA9ICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSk7XG5cbiAgICAgIGlmICghcGx1Z2luQ2xhc3MpIHtcbiAgICAgICAgcGx1Z2luQ2xhc3MgPSBuZXcgQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlKHRoaXMsIG9wdGlvbnMpOyBcbiAgICAgICAgJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCBwbHVnaW5DbGFzcyk7XG4gICAgICB9XG5cblxuICAgIH0pO1xuICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxuLy8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIGZhY3RvcnkoalF1ZXJ5KTtcblxuLy8gfSh0aGlzLCBmdW5jdGlvbiAoJCkge1xuXG4vLyAgICd1c2Ugc3RyaWN0Jztcbi8vICAgLy8ganNoaW50IGxheGNvbW1hOiB0cnVlXG5cblxuLy8gIC8qIFRZUEVBSEVBRCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuLy8gICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgIHZhciBUeXBlYWhlYWQgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuLy8gICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuLy8gICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnR5cGVhaGVhZC5kZWZhdWx0cywgb3B0aW9ucyk7XG4vLyAgICAgdGhpcy5tYXRjaGVyID0gdGhpcy5vcHRpb25zLm1hdGNoZXIgfHwgdGhpcy5tYXRjaGVyO1xuLy8gICAgIHRoaXMuc29ydGVyID0gdGhpcy5vcHRpb25zLnNvcnRlciB8fCB0aGlzLnNvcnRlcjtcbi8vICAgICB0aGlzLnNlbGVjdCA9IHRoaXMub3B0aW9ucy5zZWxlY3QgfHwgdGhpcy5zZWxlY3Q7XG4vLyAgICAgdGhpcy5hdXRvU2VsZWN0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0ID09ICdib29sZWFuJyA/IHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0IDogdHJ1ZTtcbi8vICAgICB0aGlzLmhpZ2hsaWdodGVyID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodGVyIHx8IHRoaXMuaGlnaGxpZ2h0ZXI7XG4vLyAgICAgdGhpcy5yZW5kZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyIHx8IHRoaXMucmVuZGVyO1xuLy8gICAgIHRoaXMudXBkYXRlciA9IHRoaXMub3B0aW9ucy51cGRhdGVyIHx8IHRoaXMudXBkYXRlcjtcbi8vICAgICB0aGlzLmRpc3BsYXlUZXh0ID0gdGhpcy5vcHRpb25zLmRpc3BsYXlUZXh0IHx8IHRoaXMuZGlzcGxheVRleHQ7XG4vLyAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRUZXh0IHx8IHRoaXMuc2VsZWN0ZWRUZXh0O1xuLy8gICAgIHRoaXMuc291cmNlID0gdGhpcy5vcHRpb25zLnNvdXJjZTtcbi8vICAgICB0aGlzLmRlbGF5ID0gdGhpcy5vcHRpb25zLmRlbGF5O1xuLy8gICAgIHRoaXMuJG1lbnUgPSAkKHRoaXMub3B0aW9ucy5tZW51KTtcbi8vICAgICB0aGlzLiRhcHBlbmRUbyA9IHRoaXMub3B0aW9ucy5hcHBlbmRUbyA/ICQodGhpcy5vcHRpb25zLmFwcGVuZFRvKSA6IG51bGw7XG4vLyAgICAgdGhpcy5maXRUb0VsZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA9PSAnYm9vbGVhbicgPyB0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50IDogZmFsc2U7XG4vLyAgICAgdGhpcy5zaG93biA9IGZhbHNlO1xuLy8gICAgIHRoaXMubGlzdGVuKCk7XG4vLyAgICAgdGhpcy5zaG93SGludE9uRm9jdXMgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PSAnYm9vbGVhbicgfHwgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PT0gXCJhbGxcIiA/IHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgOiBmYWxzZTtcbi8vICAgICB0aGlzLmFmdGVyU2VsZWN0ID0gdGhpcy5vcHRpb25zLmFmdGVyU2VsZWN0O1xuLy8gICAgIHRoaXMuYWRkSXRlbSA9IGZhbHNlO1xuLy8gICAgIHRoaXMudmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpO1xuLy8gICB9O1xuICBcbi8vICAgVHlwZWFoZWFkLnByb3RvdHlwZSA9IHtcblxuLy8gICAgIGNvbnN0cnVjdG9yOiBUeXBlYWhlYWQsXG5cbi8vICAgICBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciB2YWwgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5kYXRhKCd2YWx1ZScpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCB2YWwpO1xuLy8gICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCB8fCB2YWwpIHtcbi8vICAgICAgICAgdmFyIG5ld1ZhbCA9IHRoaXMudXBkYXRlcih2YWwpO1xuLy8gICAgICAgICAvLyBVcGRhdGVyIGNhbiBiZSBzZXQgdG8gYW55IHJhbmRvbSBmdW5jdGlvbnMgdmlhIFwib3B0aW9uc1wiIHBhcmFtZXRlciBpbiBjb25zdHJ1Y3RvciBhYm92ZS5cbi8vICAgICAgICAgLy8gQWRkIG51bGwgY2hlY2sgZm9yIGNhc2VzIHdoZW4gdXBkYXRlciByZXR1cm5zIHZvaWQgb3IgdW5kZWZpbmVkLlxuLy8gICAgICAgICBpZiAoIW5ld1ZhbCkge1xuLy8gICAgICAgICAgIG5ld1ZhbCA9ICcnO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHZhciBzZWxlY3RlZFZhbCA9IHRoaXMuc2VsZWN0ZWRUZXh0KG5ld1ZhbCk7XG4vLyAgICAgICAgIGlmIChzZWxlY3RlZFZhbCAhPT0gZmFsc2UpIHtcbi8vICAgICAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgICAgICAudmFsKHNlbGVjdGVkVmFsKVxuLy8gICAgICAgICAgICAgLnRleHQodGhpcy5kaXNwbGF5VGV4dChuZXdWYWwpIHx8IG5ld1ZhbClcbi8vICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB0aGlzLmFmdGVyU2VsZWN0KG5ld1ZhbCk7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2V0U291cmNlOiBmdW5jdGlvbiAoc291cmNlKSB7XG4vLyAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyIHBvcyA9ICQuZXh0ZW5kKHt9LCB0aGlzLiRlbGVtZW50LnBvc2l0aW9uKCksIHtcbi8vICAgICAgICAgaGVpZ2h0OiB0aGlzLiRlbGVtZW50WzBdLm9mZnNldEhlaWdodFxuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodCA9PSAnZnVuY3Rpb24nID9cbi8vICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0LmNhbGwoKSA6XG4vLyAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodDtcblxuLy8gICAgICAgdmFyIGVsZW1lbnQ7XG4vLyAgICAgICBpZiAodGhpcy5zaG93bikge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudTtcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy4kYXBwZW5kVG8pIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnUuYXBwZW5kVG8odGhpcy4kYXBwZW5kVG8pO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0aGlzLiRhcHBlbmRUby5pcyh0aGlzLiRlbGVtZW50LnBhcmVudCgpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51Lmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0cnVlO1xuLy8gICAgICAgfSAgICAgIFxuICAgICAgXG4vLyAgICAgICBpZiAoIXRoaXMuaGFzU2FtZVBhcmVudCkge1xuLy8gICAgICAgICAgIC8vIFdlIGNhbm5vdCByZWx5IG9uIHRoZSBlbGVtZW50IHBvc2l0aW9uLCBuZWVkIHRvIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSB3aW5kb3dcbi8vICAgICAgICAgICBlbGVtZW50LmNzcyhcInBvc2l0aW9uXCIsIFwiZml4ZWRcIik7XG4vLyAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XG4vLyAgICAgICAgICAgcG9zLnRvcCA9ICBvZmZzZXQudG9wO1xuLy8gICAgICAgICAgIHBvcy5sZWZ0ID0gb2Zmc2V0LmxlZnQ7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyBUaGUgcnVsZXMgZm9yIGJvb3RzdHJhcCBhcmU6ICdkcm9wdXAnIGluIHRoZSBwYXJlbnQgYW5kICdkcm9wZG93bi1tZW51LXJpZ2h0JyBpbiB0aGUgZWxlbWVudC5cbi8vICAgICAgIC8vIE5vdGUgdGhhdCB0byBnZXQgcmlnaHQgYWxpZ25tZW50LCB5b3UnbGwgbmVlZCB0byBzcGVjaWZ5IGBtZW51YCBpbiB0aGUgb3B0aW9ucyB0byBiZTpcbi8vICAgICAgIC8vICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgZHJvcGRvd24tbWVudVwiIHJvbGU9XCJsaXN0Ym94XCI+PC91bD4nXG4vLyAgICAgICB2YXIgZHJvcHVwID0gJChlbGVtZW50KS5wYXJlbnQoKS5oYXNDbGFzcygnZHJvcHVwJyk7XG4vLyAgICAgICB2YXIgbmV3VG9wID0gZHJvcHVwID8gJ2F1dG8nIDogKHBvcy50b3AgKyBwb3MuaGVpZ2h0ICsgc2Nyb2xsSGVpZ2h0KTtcbi8vICAgICAgIHZhciByaWdodCA9ICQoZWxlbWVudCkuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnKTtcbi8vICAgICAgIHZhciBuZXdMZWZ0ID0gcmlnaHQgPyAnYXV0bycgOiBwb3MubGVmdDtcbi8vICAgICAgIC8vIGl0IHNlZW1zIGxpa2Ugc2V0dGluZyB0aGUgY3NzIGlzIGEgYmFkIGlkZWEgKGp1c3QgbGV0IEJvb3RzdHJhcCBkbyBpdCksIGJ1dCBJJ2xsIGtlZXAgdGhlIG9sZFxuLy8gICAgICAgLy8gbG9naWMgaW4gcGxhY2UgZXhjZXB0IGZvciB0aGUgZHJvcHVwL3JpZ2h0LWFsaWduIGNhc2VzLlxuLy8gICAgICAgZWxlbWVudC5jc3MoeyB0b3A6IG5ld1RvcCwgbGVmdDogbmV3TGVmdCB9KS5zaG93KCk7XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50ID09PSB0cnVlKSB7XG4vLyAgICAgICAgICAgZWxlbWVudC5jc3MoXCJ3aWR0aFwiLCB0aGlzLiRlbGVtZW50Lm91dGVyV2lkdGgoKSArIFwicHhcIik7XG4vLyAgICAgICB9XG4gICAgXG4vLyAgICAgICB0aGlzLnNob3duID0gdHJ1ZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRtZW51LmhpZGUoKTtcbi8vICAgICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBsb29rdXA6IGZ1bmN0aW9uIChxdWVyeSkge1xuLy8gICAgICAgdmFyIGl0ZW1zO1xuLy8gICAgICAgaWYgKHR5cGVvZihxdWVyeSkgIT0gJ3VuZGVmaW5lZCcgJiYgcXVlcnkgIT09IG51bGwpIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCkgfHwgJyc7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLnF1ZXJ5Lmxlbmd0aCA8IHRoaXMub3B0aW9ucy5taW5MZW5ndGggJiYgIXRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXM7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHZhciB3b3JrZXIgPSAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblxuLy8gICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKHRoaXMuc291cmNlKSkge1xuLy8gICAgICAgICAgIHRoaXMuc291cmNlKHRoaXMucXVlcnksICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSk7XG4vLyAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zb3VyY2UpIHtcbi8vICAgICAgICAgICB0aGlzLnByb2Nlc3ModGhpcy5zb3VyY2UpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9LCB0aGlzKTtcblxuLy8gICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubG9va3VwV29ya2VyKTtcbi8vICAgICAgIHRoaXMubG9va3VwV29ya2VyID0gc2V0VGltZW91dCh3b3JrZXIsIHRoaXMuZGVsYXkpO1xuLy8gICAgIH0sXG5cbi8vICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuLy8gICAgICAgaXRlbXMgPSAkLmdyZXAoaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGF0Lm1hdGNoZXIoaXRlbSk7XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaXRlbXMgPSB0aGlzLnNvcnRlcihpdGVtcyk7XG5cbi8vICAgICAgIGlmICghaXRlbXMubGVuZ3RoICYmICF0aGlzLm9wdGlvbnMuYWRkSXRlbSkge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcztcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtc1swXSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIG51bGwpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICAvLyBBZGQgaXRlbVxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGRJdGVtKXtcbi8vICAgICAgICAgaXRlbXMucHVzaCh0aGlzLm9wdGlvbnMuYWRkSXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXRlbXMgPT0gJ2FsbCcpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zKS5zaG93KCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoaXRlbXMuc2xpY2UoMCwgdGhpcy5vcHRpb25zLml0ZW1zKSkuc2hvdygpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgdmFyIGl0ID0gdGhpcy5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgIHJldHVybiB+aXQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIHNvcnRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgYmVnaW5zd2l0aCA9IFtdO1xuLy8gICAgICAgdmFyIGNhc2VTZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBjYXNlSW5zZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBpdGVtO1xuXG4vLyAgICAgICB3aGlsZSAoKGl0ZW0gPSBpdGVtcy5zaGlmdCgpKSkge1xuLy8gICAgICAgICB2YXIgaXQgPSB0aGlzLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgICBpZiAoIWl0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpKSBiZWdpbnN3aXRoLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgaWYgKH5pdC5pbmRleE9mKHRoaXMucXVlcnkpKSBjYXNlU2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgY2FzZUluc2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiBiZWdpbnN3aXRoLmNvbmNhdChjYXNlU2Vuc2l0aXZlLCBjYXNlSW5zZW5zaXRpdmUpO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHZhciBodG1sID0gJCgnPGRpdj48L2Rpdj4nKTtcbi8vICAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnk7XG4vLyAgICAgICB2YXIgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgdmFyIGxlbiA9IHF1ZXJ5Lmxlbmd0aDtcbi8vICAgICAgIHZhciBsZWZ0UGFydDtcbi8vICAgICAgIHZhciBtaWRkbGVQYXJ0O1xuLy8gICAgICAgdmFyIHJpZ2h0UGFydDtcbi8vICAgICAgIHZhciBzdHJvbmc7XG4vLyAgICAgICBpZiAobGVuID09PSAwKSB7XG4vLyAgICAgICAgIHJldHVybiBodG1sLnRleHQoaXRlbSkuaHRtbCgpO1xuLy8gICAgICAgfVxuLy8gICAgICAgd2hpbGUgKGkgPiAtMSkge1xuLy8gICAgICAgICBsZWZ0UGFydCA9IGl0ZW0uc3Vic3RyKDAsIGkpO1xuLy8gICAgICAgICBtaWRkbGVQYXJ0ID0gaXRlbS5zdWJzdHIoaSwgbGVuKTtcbi8vICAgICAgICAgcmlnaHRQYXJ0ID0gaXRlbS5zdWJzdHIoaSArIGxlbik7XG4vLyAgICAgICAgIHN0cm9uZyA9ICQoJzxzdHJvbmc+PC9zdHJvbmc+JykudGV4dChtaWRkbGVQYXJ0KTtcbi8vICAgICAgICAgaHRtbFxuLy8gICAgICAgICAgIC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGVmdFBhcnQpKVxuLy8gICAgICAgICAgIC5hcHBlbmQoc3Ryb25nKTtcbi8vICAgICAgICAgaXRlbSA9IHJpZ2h0UGFydDtcbi8vICAgICAgICAgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIGh0bWwuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGl0ZW0pKS5odG1sKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHJlbmRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4vLyAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4vLyAgICAgICB2YXIgYWN0aXZlRm91bmQgPSBmYWxzZTtcbi8vICAgICAgIHZhciBkYXRhID0gW107XG4vLyAgICAgICB2YXIgX2NhdGVnb3J5ID0gdGhhdC5vcHRpb25zLnNlcGFyYXRvcjtcblxuLy8gICAgICAgJC5lYWNoKGl0ZW1zLCBmdW5jdGlvbiAoa2V5LHZhbHVlKSB7XG4vLyAgICAgICAgIC8vIGluamVjdCBzZXBhcmF0b3Jcbi8vICAgICAgICAgaWYgKGtleSA+IDAgJiYgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSl7XG4vLyAgICAgICAgICAgZGF0YS5wdXNoKHtcbi8vICAgICAgICAgICAgIF9fdHlwZTogJ2RpdmlkZXInXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICAvLyBpbmplY3QgY2F0ZWdvcnkgaGVhZGVyXG4vLyAgICAgICAgIGlmICh2YWx1ZVtfY2F0ZWdvcnldICYmIChrZXkgPT09IDAgfHwgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSkpe1xuLy8gICAgICAgICAgIGRhdGEucHVzaCh7XG4vLyAgICAgICAgICAgICBfX3R5cGU6ICdjYXRlZ29yeScsXG4vLyAgICAgICAgICAgICBuYW1lOiB2YWx1ZVtfY2F0ZWdvcnldXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgZGF0YS5wdXNoKHZhbHVlKTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpdGVtcyA9ICQoZGF0YSkubWFwKGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4vLyAgICAgICAgIGlmICgoaXRlbS5fX3R5cGUgfHwgZmFsc2UpID09ICdjYXRlZ29yeScpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJIdG1sKS50ZXh0KGl0ZW0ubmFtZSlbMF07XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICBpZiAoKGl0ZW0uX190eXBlIHx8IGZhbHNlKSA9PSAnZGl2aWRlcicpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJEaXZpZGVyKVswXTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIHZhciB0ZXh0ID0gc2VsZi5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgICAgaSA9ICQodGhhdC5vcHRpb25zLml0ZW0pLmRhdGEoJ3ZhbHVlJywgaXRlbSk7XG4vLyAgICAgICAgIGkuZmluZCgnYScpLmh0bWwodGhhdC5oaWdobGlnaHRlcih0ZXh0LCBpdGVtKSk7XG4vLyAgICAgICAgIGlmICh0ZXh0ID09IHNlbGYuJGVsZW1lbnQudmFsKCkpIHtcbi8vICAgICAgICAgICBpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICBzZWxmLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW0pO1xuLy8gICAgICAgICAgIGFjdGl2ZUZvdW5kID0gdHJ1ZTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICByZXR1cm4gaVswXTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0ICYmICFhY3RpdmVGb3VuZCkge1xuLy8gICAgICAgICBpdGVtcy5maWx0ZXIoJzpub3QoLmRyb3Bkb3duLWhlYWRlciknKS5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtcy5maXJzdCgpLmRhdGEoJ3ZhbHVlJykpO1xuLy8gICAgICAgfVxuLy8gICAgICAgdGhpcy4kbWVudS5odG1sKGl0ZW1zKTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBkaXNwbGF5VGV4dDogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSAhPSAndW5kZWZpbmVkJyAmJiBpdGVtLm5hbWUgfHwgaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2VsZWN0ZWRUZXh0OiBmdW5jdGlvbihpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpdGVtLm5hbWUgIT0gJ3VuZGVmaW5lZCcgJiYgaXRlbS5uYW1lIHx8IGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIG5leHQ6IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgIHZhciBuZXh0ID0gYWN0aXZlLm5leHQoKTtcblxuLy8gICAgICAgaWYgKCFuZXh0Lmxlbmd0aCkge1xuLy8gICAgICAgICBuZXh0ID0gJCh0aGlzLiRtZW51LmZpbmQoJ2xpJylbMF0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgcHJldjogZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICB2YXIgYWN0aXZlID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgdmFyIHByZXYgPSBhY3RpdmUucHJldigpO1xuXG4vLyAgICAgICBpZiAoIXByZXYubGVuZ3RoKSB7XG4vLyAgICAgICAgIHByZXYgPSB0aGlzLiRtZW51LmZpbmQoJ2xpJykubGFzdCgpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBwcmV2LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbGlzdGVuOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vbignZm9jdXMnLCAgICAkLnByb3h5KHRoaXMuZm9jdXMsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2JsdXInLCAgICAgJC5wcm94eSh0aGlzLmJsdXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2tleXByZXNzJywgJC5wcm94eSh0aGlzLmtleXByZXNzLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdpbnB1dCcsICAgICQucHJveHkodGhpcy5pbnB1dCwgdGhpcykpXG4vLyAgICAgICAgIC5vbigna2V5dXAnLCAgICAkLnByb3h5KHRoaXMua2V5dXAsIHRoaXMpKTtcblxuLy8gICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgdGhpcy4kbWVudVxuLy8gICAgICAgICAub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLmNsaWNrLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgJ2xpJywgJC5wcm94eSh0aGlzLm1vdXNlZW50ZXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlbGVhdmUnLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VsZWF2ZSwgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2Vkb3duJywgJC5wcm94eSh0aGlzLm1vdXNlZG93bix0aGlzKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGRlc3Ryb3kgOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ3R5cGVhaGVhZCcsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vZmYoJ2ZvY3VzJylcbi8vICAgICAgICAgLm9mZignYmx1cicpXG4vLyAgICAgICAgIC5vZmYoJ2tleXByZXNzJylcbi8vICAgICAgICAgLm9mZignaW5wdXQnKVxuLy8gICAgICAgICAub2ZmKCdrZXl1cCcpO1xuXG4vLyAgICAgICBpZiAodGhpcy5ldmVudFN1cHBvcnRlZCgna2V5ZG93bicpKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duJyk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHRoaXMuJG1lbnUucmVtb3ZlKCk7XG4vLyAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4vLyAgICAgfSxcblxuLy8gICAgIGV2ZW50U3VwcG9ydGVkOiBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4vLyAgICAgICB2YXIgaXNTdXBwb3J0ZWQgPSBldmVudE5hbWUgaW4gdGhpcy4kZWxlbWVudDtcbi8vICAgICAgIGlmICghaXNTdXBwb3J0ZWQpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5zZXRBdHRyaWJ1dGUoZXZlbnROYW1lLCAncmV0dXJuOycpO1xuLy8gICAgICAgICBpc1N1cHBvcnRlZCA9IHR5cGVvZiB0aGlzLiRlbGVtZW50W2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbic7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gaXNTdXBwb3J0ZWQ7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcblxuLy8gICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbi8vICAgICAgICAgY2FzZSA5OiAvLyB0YWJcbi8vICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4vLyAgICAgICAgICAgLy8gd2l0aCB0aGUgc2hpZnRLZXkgKHRoaXMgaXMgYWN0dWFsbHkgdGhlIGxlZnQgcGFyZW50aGVzaXMpXG4vLyAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuLy8gICAgICAgICAgIC8vIHdpdGggdGhlIHNoaWZ0S2V5ICh0aGlzIGlzIGFjdHVhbGx5IHRoZSByaWdodCBwYXJlbnRoZXNpcylcbi8vICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkgcmV0dXJuO1xuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICB0aGlzLm5leHQoKTtcbi8vICAgICAgICAgICBicmVhaztcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5ZG93bjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCA9IH4kLmluQXJyYXkoZS5rZXlDb2RlLCBbNDAsMzgsOSwxMywyN10pO1xuLy8gICAgICAgaWYgKCF0aGlzLnNob3duICYmIGUua2V5Q29kZSA9PSA0MCkge1xuLy8gICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5tb3ZlKGUpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXlwcmVzczogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICh0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQpIHJldHVybjtcbi8vICAgICAgIHRoaXMubW92ZShlKTtcbi8vICAgICB9LFxuXG4vLyAgICAgaW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICAvLyBUaGlzIGlzIGEgZml4ZWQgZm9yIElFMTAvMTEgdGhhdCBmaXJlcyB0aGUgaW5wdXQgZXZlbnQgd2hlbiBhIHBsYWNlaG9kZXIgaXMgY2hhbmdlZFxuLy8gICAgICAgLy8gKGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODEwNTM4L2llLTExLWZpcmVzLWlucHV0LWV2ZW50LW9uLWZvY3VzKVxuLy8gICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCk7XG4vLyAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG4vLyAgICAgICAgIHRoaXMudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4vLyAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleXVwOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4vLyAgICAgICAgIHJldHVybjtcbi8vICAgICAgIH1cbi8vICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4vLyAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbi8vICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbi8vICAgICAgICAgY2FzZSAxNjogLy8gc2hpZnRcbi8vICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuLy8gICAgICAgICBjYXNlIDE4OiAvLyBhbHRcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDk6IC8vIHRhYlxuLy8gICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuLy8gICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuLy8gICAgICAgICAgIHRoaXMuc2VsZWN0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG4vLyAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG5cblxuLy8gICAgIH0sXG5cbi8vICAgICBmb2N1czogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4vLyAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzICYmIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyAhPT0gdHJ1ZSkge1xuLy8gICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT09IFwiYWxsXCIpIHtcbi8vICAgICAgICAgICAgIHRoaXMubG9va3VwKFwiXCIpOyBcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICAgIGlmICh0aGlzLnNraXBTaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gZmFsc2U7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGJsdXI6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMubW91c2Vkb3ZlciAmJiAhdGhpcy5tb3VzZWRkb3duICYmIHRoaXMuc2hvd24pIHtcbi8vICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLm1vdXNlZGRvd24pIHtcbi8vICAgICAgICAgLy8gVGhpcyBpcyBmb3IgSUUgdGhhdCBibHVycyB0aGUgaW5wdXQgd2hlbiB1c2VyIGNsaWNrcyBvbiBzY3JvbGwuXG4vLyAgICAgICAgIC8vIFdlIHNldCB0aGUgZm9jdXMgYmFjayBvbiB0aGUgaW5wdXQgYW5kIHByZXZlbnQgdGhlIGxvb2t1cCB0byBvY2N1ciBhZ2FpblxuLy8gICAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKCk7XG4vLyAgICAgICAgIHRoaXMubW91c2VkZG93biA9IGZhbHNlO1xuLy8gICAgICAgfSBcbi8vICAgICB9LFxuXG4vLyAgICAgY2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgdGhpcy5zZWxlY3QoKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbi8vICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRvdmVyID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdXNlbGVhdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZG92ZXIgPSBmYWxzZTtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkICYmIHRoaXMuc2hvd24pIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgIC8qKlxuLy8gICAgICAqIFdlIHRyYWNrIHRoZSBtb3VzZWRvd24gZm9yIElFLiBXaGVuIGNsaWNraW5nIG9uIHRoZSBtZW51IHNjcm9sbGJhciwgSUUgbWFrZXMgdGhlIGlucHV0IGJsdXIgdGh1cyBoaWRpbmcgdGhlIG1lbnUuXG4vLyAgICAgICovXG4vLyAgICAgbW91c2Vkb3duOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRkb3duID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUub25lKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcbi8vICAgICAgICAgLy8gSUUgd29uJ3QgZmlyZSB0aGlzLCBidXQgRkYgYW5kIENocm9tZSB3aWxsIHNvIHdlIHJlc2V0IG91ciBmbGFnIGZvciB0aGVtIGhlcmVcbi8vICAgICAgICAgdGhpcy5tb3VzZWRkb3duID0gZmFsc2U7XG4vLyAgICAgICB9LmJpbmQodGhpcykpO1xuLy8gICAgIH0sXG5cbi8vICAgfTtcblxuXG4vLyAgIC8qIFRZUEVBSEVBRCBQTFVHSU4gREVGSU5JVElPTlxuLy8gICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICB2YXIgb2xkID0gJC5mbi50eXBlYWhlYWQ7XG5cbi8vICAgJC5mbi50eXBlYWhlYWQgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4vLyAgICAgdmFyIGFyZyA9IGFyZ3VtZW50cztcbi8vICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBvcHRpb24gPT0gJ2dldEFjdGl2ZScpIHtcbi8vICAgICAgIHJldHVybiB0aGlzLmRhdGEoJ2FjdGl2ZScpO1xuLy8gICAgIH1cbi8vICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4vLyAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpO1xuLy8gICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbjtcbi8vICAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgndHlwZWFoZWFkJywgKGRhdGEgPSBuZXcgVHlwZWFoZWFkKHRoaXMsIG9wdGlvbnMpKSk7XG4vLyAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBkYXRhW29wdGlvbl0pIHtcbi8vICAgICAgICAgaWYgKGFyZy5sZW5ndGggPiAxKSB7XG4vLyAgICAgICAgICAgZGF0YVtvcHRpb25dLmFwcGx5KGRhdGEsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZywgMSkpO1xuLy8gICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgIGRhdGFbb3B0aW9uXSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMgPSB7XG4vLyAgICAgc291cmNlOiBbXSxcbi8vICAgICBpdGVtczogOCxcbi8vICAgICBtZW51OiAnPHVsIGNsYXNzPVwidHlwZWFoZWFkIGRyb3Bkb3duLW1lbnVcIiByb2xlPVwibGlzdGJveFwiPjwvdWw+Jyxcbi8vICAgICBpdGVtOiAnPGxpPjxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgcm9sZT1cIm9wdGlvblwiPjwvYT48L2xpPicsXG4vLyAgICAgbWluTGVuZ3RoOiAxLFxuLy8gICAgIHNjcm9sbEhlaWdodDogMCxcbi8vICAgICBhdXRvU2VsZWN0OiB0cnVlLFxuLy8gICAgIGFmdGVyU2VsZWN0OiAkLm5vb3AsXG4vLyAgICAgYWRkSXRlbTogZmFsc2UsXG4vLyAgICAgZGVsYXk6IDAsXG4vLyAgICAgc2VwYXJhdG9yOiAnY2F0ZWdvcnknLFxuLy8gICAgIGhlYWRlckh0bWw6ICc8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIj48L2xpPicsXG4vLyAgICAgaGVhZGVyRGl2aWRlcjogJzxsaSBjbGFzcz1cImRpdmlkZXJcIiByb2xlPVwic2VwYXJhdG9yXCI+PC9saT4nXG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuQ29uc3RydWN0b3IgPSBUeXBlYWhlYWQ7XG5cbi8vICAvKiBUWVBFQUhFQUQgTk8gQ09ORkxJQ1Rcbi8vICAgKiA9PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJC5mbi50eXBlYWhlYWQubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAkLmZuLnR5cGVhaGVhZCA9IG9sZDtcbi8vICAgICByZXR1cm4gdGhpcztcbi8vICAgfTtcblxuXG4vLyAgLyogVFlQRUFIRUFEIERBVEEtQVBJXG4vLyAgICogPT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJChkb2N1bWVudCkub24oJ2ZvY3VzLnR5cGVhaGVhZC5kYXRhLWFwaScsICdbZGF0YS1wcm92aWRlPVwidHlwZWFoZWFkXCJdJywgZnVuY3Rpb24gKGUpIHtcbi8vICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuLy8gICAgIGlmICgkdGhpcy5kYXRhKCd0eXBlYWhlYWQnKSkgcmV0dXJuO1xuLy8gICAgICR0aGlzLnR5cGVhaGVhZCgkdGhpcy5kYXRhKCkpO1xuLy8gICB9KTtcblxuLy8gfSkpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbWFpbi50c1xuICoqLyIsIlxuY2xhc3MgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIHJlc3VsdHM6QXJyYXk8T2JqZWN0PjtcblxuXHRwcm90ZWN0ZWQgX3NldHRpbmdzOmFueTtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldFJlc3VsdHMobGltaXQ/Om51bWJlciwgc3RhcnQ/Om51bWJlciwgZW5kPzpudW1iZXIpOkFycmF5PE9iamVjdD4ge1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLnJlc3VsdHM7XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGNiayh0aGlzLmdldFJlc3VsdHMoKSk7XG5cdH1cblxufVxuXG5leHBvcnQgY2xhc3MgQWpheFJlc29sdmVyIGV4dGVuZHMgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIGpxWEhSOkpRdWVyeVhIUjtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coJ3Jlc29sdmVyIHNldHRpbmdzJywgdGhpcy5fc2V0dGluZ3MpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICcnLFxuXHRcdFx0bWV0aG9kOiAnZ2V0Jyxcblx0XHRcdHF1ZXJ5S2V5OiAncScsXG5cdFx0XHRleHRyYURhdGE6IHt9LFxuXHRcdFx0dGltZW91dDogdW5kZWZpbmVkLFxuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGlmICh0aGlzLmpxWEhSICE9IG51bGwpIHtcblx0XHRcdHRoaXMuanFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHRsZXQgZGF0YTpPYmplY3QgPSB7fTtcblx0XHRkYXRhW3RoaXMuX3NldHRpbmdzLnF1ZXJ5S2V5XSA9IHE7XG5cdFx0JC5leHRlbmQoZGF0YSwgdGhpcy5fc2V0dGluZ3MuZXh0cmFEYXRhKTtcblxuXHRcdHRoaXMuanFYSFIgPSAkLmFqYXgoXG5cdFx0XHR0aGlzLl9zZXR0aW5ncy51cmwsXG5cdFx0XHR7XG5cdFx0XHRcdG1ldGhvZDogdGhpcy5fc2V0dGluZ3MubWV0aG9kLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0aW1lb3V0OiB0aGlzLl9zZXR0aW5ncy50aW1lb3V0XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHRoaXMuanFYSFIuZG9uZSgocmVzdWx0KSA9PiB7XG5cdFx0XHRjYmsocmVzdWx0KTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmpxWEhSLmZhaWwoKGVycikgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuanFYSFIuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuanFYSFIgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3Jlc29sdmVycy50c1xuICoqLyIsIi8qXG4gKlx0RHJvcGRvd24gY2xhc3MuIE1hbmFnZXMgdGhlIGRyb3Bkb3duIGRyYXdpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIERyb3Bkb3duIHtcblx0cHJvdGVjdGVkIF8kZWw6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgX2RkOkpRdWVyeTtcblx0cHJvdGVjdGVkIGluaXRpYWxpemVkOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIHNob3duOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIGl0ZW1zOmFueVtdID0gW107XG5cdHByb3RlY3RlZCBmb3JtYXRJdGVtOkZ1bmN0aW9uO1xuXHRwcm90ZWN0ZWQgc2VhcmNoVGV4dDpzdHJpbmc7XG5cdHByb3RlY3RlZCBhdXRvU2VsZWN0OmJvb2xlYW47XG5cdHByb3RlY3RlZCBtb3VzZW92ZXI6Ym9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbiwgYXV0b1NlbGVjdDpib29sZWFuKSB7XG5cdFx0dGhpcy5fJGVsID0gZTtcblx0XHR0aGlzLmZvcm1hdEl0ZW0gPSBmb3JtYXRJdGVtQ2JrO1xuXHRcdHRoaXMuYXV0b1NlbGVjdCA9IGF1dG9TZWxlY3Q7XG5cdFx0XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBpbml0KCk6dm9pZCB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSBkcm9wZG93blxuXHRcdGxldCBwb3M6YW55ID0gJC5leHRlbmQoe30sIHRoaXMuXyRlbC5wb3NpdGlvbigpLCB7XG4gICAgICAgIFx0XHRcdFx0aGVpZ2h0OiB0aGlzLl8kZWxbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgXHRcdFx0XHR9KTtcblx0XHRcblx0XHQvLyBjcmVhdGUgZWxlbWVudFxuXHRcdHRoaXMuX2RkID0gJCgnPHVsIC8+Jyk7XG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdHRoaXMuX2RkLmFkZENsYXNzKCdib290c3RyYXAtYXV0b2NvbXBsZXRlIGRyb3Bkb3duLW1lbnUnKTtcblxuXHRcdHRoaXMuX2RkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cdFx0dGhpcy5fZGQuY3NzKHsgbGVmdDogcG9zLmxlZnQsIHdpZHRoOiB0aGlzLl8kZWwub3V0ZXJXaWR0aCgpIH0pO1xuXHRcdFxuXHRcdC8vIGNsaWNrIGV2ZW50IG9uIGl0ZW1zXG5cdFx0dGhpcy5fZGQub24oJ2NsaWNrJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NsaWNrZWQnLCBldnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCQoZXZ0LmN1cnJlbnRUYXJnZXQpKTtcblx0XHRcdGxldCBpdGVtOmFueSA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2l0ZW0nKTtcblx0XHRcdHRoaXMuaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5fZGQub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG5cdFx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcblx0XHRcdFx0XHRcdHRoaXMuXyRlbC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlZW50ZXInLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCd1bCcpLmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdHRoaXMubW91c2VvdmVyID0gdHJ1ZTtcblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWxlYXZlJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5tb3VzZW92ZXIgPSBmYWxzZTtcblx0XHR9KTtcblxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFxuXHR9XG5cblx0Z2V0IGlzTW91c2VPdmVyKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubW91c2VvdmVyO1xuXHR9XG5cblx0cHVibGljIGZvY3VzTmV4dEl0ZW0ocmV2ZXJzZWQ/OmJvb2xlYW4pIHtcblx0XHQvLyBnZXQgc2VsZWN0ZWRcblx0XHRsZXQgY3VyckVsZW06SlF1ZXJ5ID0gdGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJyk7XG5cdFx0bGV0IG5leHRFbGVtOkpRdWVyeSA9IHJldmVyc2VkID8gY3VyckVsZW0ucHJldigpIDogY3VyckVsZW0ubmV4dCgpO1xuXG5cdFx0aWYgKG5leHRFbGVtLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHQvLyBmaXJzdCBcblx0XHRcdG5leHRFbGVtID0gcmV2ZXJzZWQgPyB0aGlzLl9kZC5maW5kKCdsaScpLmxhc3QoKSA6IHRoaXMuX2RkLmZpbmQoJ2xpJykuZmlyc3QoKTtcblx0XHR9XG5cdFx0XG5cdFx0Y3VyckVsZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdG5leHRFbGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0fVxuXG5cdHB1YmxpYyBmb2N1c1ByZXZpb3VzSXRlbSgpIHtcblx0XHR0aGlzLmZvY3VzTmV4dEl0ZW0odHJ1ZSk7XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNJdGVtKGluZGV4Om51bWJlcikge1xuXHRcdC8vIEZvY3VzIGFuIGl0ZW0gaW4gdGhlIGxpc3Rcblx0XHRpZiAodGhpcy5zaG93biAmJiAodGhpcy5pdGVtcy5sZW5ndGggPiBpbmRleCkpXG5cdFx0XHR0aGlzLl9kZC5maW5kKCdsaScpLmVxKGluZGV4KS5maW5kKCdhJykuZm9jdXMoKTtcblx0fVxuXHRcblx0cHVibGljIHNlbGVjdEZvY3VzSXRlbSgpIHtcblx0XHR0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKS50cmlnZ2VyKCdjbGljaycpO1xuXHR9XG5cblx0Z2V0IGlzSXRlbUZvY3VzZWQoKTpib29sZWFuIHtcblx0XHRpZiAodGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJykubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBzaG93KCk6dm9pZCB7XG5cdFx0aWYgKCF0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLnNob3coKTtcblx0XHRcdHRoaXMuc2hvd24gPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBpc1Nob3duKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuc2hvd247XG5cdH1cblxuXHRwdWJsaWMgaGlkZSgpOnZvaWQge1xuXHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLmhpZGUoKTtcblx0XHRcdHRoaXMuc2hvd24gPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlSXRlbXMoaXRlbXM6YW55W10sIHNlYXJjaFRleHQ6c3RyaW5nKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZUl0ZW1zJywgaXRlbXMpO1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnNlYXJjaFRleHQgPSBzZWFyY2hUZXh0O1xuXHRcdHRoaXMucmVmcmVzaEl0ZW1MaXN0KCk7XG5cdH1cblxuXHRwcml2YXRlIHNob3dNYXRjaGVkVGV4dCh0ZXh0OnN0cmluZywgcXJ5OnN0cmluZyk6c3RyaW5nIHtcblx0XHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxcnkudG9Mb3dlckNhc2UoKSk7XG5cdFx0aWYgKHN0YXJ0SW5kZXggPiAtMSkge1xuXHRcdFx0bGV0IGVuZEluZGV4Om51bWJlciA9IHN0YXJ0SW5kZXggKyBxcnkubGVuZ3RoO1xuXG5cdFx0XHRyZXR1cm4gdGV4dC5zbGljZSgwLCBzdGFydEluZGV4KSArICc8Yj4nIFxuXHRcdFx0XHQrIHRleHQuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpICsgJzwvYj4nXG5cdFx0XHRcdCsgdGV4dC5zbGljZShlbmRJbmRleCk7XG5cdFx0fVxuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlZnJlc2hJdGVtTGlzdCgpIHtcblx0XHR0aGlzLl9kZC5lbXB0eSgpO1xuXHRcdGxldCBsaUxpc3Q6SlF1ZXJ5W10gPSBbXTtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLmZvcm1hdEl0ZW0oaXRlbSk7XG5cdFx0XHRpZiAodHlwZW9mIGl0ZW1Gb3JtYXR0ZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGl0ZW1Gb3JtYXR0ZWQgPSB7IHRleHQ6IGl0ZW1Gb3JtYXR0ZWQgfVxuXHRcdFx0fVxuXHRcdFx0bGV0IGl0ZW1UZXh0OnN0cmluZztcblx0XHRcdGxldCBpdGVtSHRtbDphbnk7XG5cblx0XHRcdGl0ZW1UZXh0ID0gdGhpcy5zaG93TWF0Y2hlZFRleHQoaXRlbUZvcm1hdHRlZC50ZXh0LCB0aGlzLnNlYXJjaFRleHQpO1xuXHRcdFx0aWYgKCBpdGVtRm9ybWF0dGVkLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtRm9ybWF0dGVkLmh0bWw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1UZXh0O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRsZXQgbGkgPSAkKCc8bGkgPicpO1xuXHRcdFx0bGkuYXBwZW5kKFxuXHRcdFx0XHQkKCc8YT4nKS5hdHRyKCdocmVmJywgJyMnKS5odG1sKGl0ZW1IdG1sKVxuXHRcdFx0KVxuXHRcdFx0LmRhdGEoJ2l0ZW0nLCBpdGVtKTtcblx0XHRcdFxuXHRcdFx0bGlMaXN0LnB1c2gobGkpO1xuXHRcdH0pO1xuXHRcdCBcblx0XHR0aGlzLl9kZC5hcHBlbmQobGlMaXN0KTtcblx0fVxuXG5cdHByb3RlY3RlZCBpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtOmFueSk6dm9pZCB7XG5cdFx0Ly8gbGF1bmNoIHNlbGVjdGVkIGV2ZW50XG5cdFx0Ly8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZExhdW5jaEV2ZW50JywgaXRlbSk7XG5cdFx0dGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCBpdGVtKVxuXHR9XG5cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kcm9wZG93bi50c1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=