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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTZmZTMyYzAyMDNiMzAxNDY0ZTYiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQWtUcEI7QUFsVEQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQWdDRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQXpCaEMsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsaUJBQVksR0FBVSxJQUFJLENBQUM7YUFDM0IscUJBQWdCLEdBQVcsS0FBSyxDQUFDO2FBR2pDLGNBQVMsR0FBRztpQkFDbEIsUUFBUSxFQUFVLE1BQU07aUJBQ3hCLGdCQUFnQixFQUFPLEVBQUU7aUJBQ3pCLFNBQVMsRUFBVSxDQUFDO2lCQUNwQixRQUFRLEVBQVUsT0FBTztpQkFDekIsWUFBWSxFQUFZLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2hELFVBQVUsRUFBVyxJQUFJO2lCQUN6QixNQUFNLEVBQUU7cUJBQ04sS0FBSyxFQUFZLElBQUk7cUJBQ3JCLFNBQVMsRUFBWSxJQUFJO3FCQUN6QixNQUFNLEVBQVksSUFBSTtxQkFDdEIsVUFBVSxFQUFZLElBQUk7cUJBQzFCLE1B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Y2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZTZmZTMyYzAyMDNiMzAxNDY0ZTZcbiAqKi8iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtYXV0b2NvbXBsZXRlLmpzIHYwLjAuMVxuICogaHR0cHM6Ly9naXRodWIuY29tL3hjYXNoL2Jvb3RzdHJhcC1hdXRvY29tcGxldGVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEZvcmtlZCBmcm9tIGJvb3RzdHJhcDMtdHlwZWFoZWFkLmpzIHYzLjEuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2Jhc3Nqb2JzZW4vQm9vdHN0cmFwLTMtVHlwZWFoZWFkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBPcmlnaW5hbCB3cml0dGVuIGJ5IEBtZG8gYW5kIEBmYXRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDE2IFBhb2xvIENhc2NpZWxsbyBAeGNhc2g2NjYgYW5kIGNvbnRyaWJ1dG9yc1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAodGhlICdMaWNlbnNlJyk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gJ0FTIElTJyBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmltcG9ydCB7IEFqYXhSZXNvbHZlciB9IGZyb20gJy4vcmVzb2x2ZXJzJztcbmltcG9ydCB7IERyb3Bkb3duIH0gZnJvbSAnLi9kcm9wZG93bic7XG5cbm1vZHVsZSBBdXRvQ29tcGxldGVOUyB7XG4gIGV4cG9ydCBjbGFzcyBBdXRvQ29tcGxldGUge1xuICAgIHB1YmxpYyBzdGF0aWMgTkFNRTpzdHJpbmcgPSAnYXV0b0NvbXBsZXRlJztcblxuICAgIHByaXZhdGUgX2VsOkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfJGVsOkpRdWVyeTtcbiAgICBwcml2YXRlIF9kZDpEcm9wZG93bjtcbiAgICBwcml2YXRlIF9zZWFyY2hUZXh0OnN0cmluZztcbiAgICBwcml2YXRlIF9zZWxlY3RlZEl0ZW06YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VmFsdWU6YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VGV4dDpzdHJpbmcgPSBudWxsO1xuICAgIHByaXZhdGUgX2lzU2VsZWN0RWxlbWVudDpib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfc2VsZWN0SGlkZGVuRmllbGQ6SlF1ZXJ5O1xuXG4gICAgcHJpdmF0ZSBfc2V0dGluZ3MgPSB7XG4gICAgICByZXNvbHZlcjo8c3RyaW5nPiAnYWpheCcsXG4gICAgICByZXNvbHZlclNldHRpbmdzOjxhbnk+IHt9LFxuICAgICAgbWluTGVuZ3RoOjxudW1iZXI+IDMsXG4gICAgICB2YWx1ZUtleTo8c3RyaW5nPiAndmFsdWUnLFxuICAgICAgZm9ybWF0UmVzdWx0OjxGdW5jdGlvbj4gdGhpcy5kZWZhdWx0Rm9ybWF0UmVzdWx0LFxuICAgICAgYXV0b1NlbGVjdDo8Ym9vbGVhbj4gdHJ1ZSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICB0eXBlZDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFByZTo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFBvc3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWxlY3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBmb2N1czo8RnVuY3Rpb24+IG51bGwsXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcmVzb2x2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkVsZW1lbnQsIG9wdGlvbnM/Ont9KSB7XG4gICAgICB0aGlzLl9lbCA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLl8kZWwgPSAkKHRoaXMuX2VsKTtcbiAgICAgIC8vIGVsZW1lbnQgdHlwZVxuICAgICAgaWYgKHRoaXMuXyRlbC5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgdGhpcy5faXNTZWxlY3RFbGVtZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGlubGluZSBkYXRhIGF0dHJpYnV0ZXNcbiAgICAgIHRoaXMubWFuYWdlSW5saW5lRGF0YUF0dHJpYnV0ZXMoKTtcbiAgICAgIC8vIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXRTZXR0aW5ncygpLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb252ZXJ0U2VsZWN0VG9UZXh0KCk7XG4gICAgICB9IFxuICAgICAgXG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6aW5nJywgdGhpcy5fc2V0dGluZ3MpO1xuICAgICAgXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hbmFnZUlubGluZURhdGFBdHRyaWJ1dGVzKCkge1xuICAgICAgLy8gdXBkYXRlcyBzZXR0aW5ncyB3aXRoIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICBsZXQgcyA9IHRoaXMuZ2V0U2V0dGluZ3MoKTtcbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgndXJsJykpIHtcbiAgICAgICAgc1sncmVzb2x2ZXJTZXR0aW5ncyddLnVybCA9IHRoaXMuXyRlbC5kYXRhKCd1cmwnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC12YWx1ZScpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXZhbHVlJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRUZXh0ID0gdGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2V0dGluZ3MoKTp7fSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb252ZXJ0U2VsZWN0VG9UZXh0KCkge1xuICAgICAgLy8gY3JlYXRlIGhpZGRlbiBmaWVsZFxuXG4gICAgICBsZXQgaGlkRmllbGQ6SlF1ZXJ5ID0gJCgnPGlucHV0PicpO1xuICAgICAgaGlkRmllbGQuYXR0cigndHlwZScsICdoaWRkZW4nKTtcbiAgICAgIGhpZEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaGlkRmllbGQudmFsKHRoaXMuX2RlZmF1bHRWYWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZCA9IGhpZEZpZWxkO1xuICAgICAgXG4gICAgICBoaWRGaWVsZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXG4gICAgICAvLyBjcmVhdGUgc2VhcmNoIGlucHV0IGVsZW1lbnRcbiAgICAgIGxldCBzZWFyY2hGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICAvLyBjb3B5IGFsbCBhdHRyaWJ1dGVzXG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCd0eXBlJywgJ3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpICsgJ190ZXh0Jyk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdpZCcsIHRoaXMuXyRlbC5hdHRyKCdpZCcpKTtcbiAgICAgIHNlYXJjaEZpZWxkLmFkZENsYXNzKHRoaXMuXyRlbC5hdHRyKCdjbGFzcycpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VGV4dCkge1xuICAgICAgICBzZWFyY2hGaWVsZC52YWwodGhpcy5fZGVmYXVsdFRleHQpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBhdHRhY2ggY2xhc3NcbiAgICAgIHNlYXJjaEZpZWxkLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHRoaXMpO1xuXG4gICAgICAvLyByZXBsYWNlIG9yaWdpbmFsIHdpdGggc2VhcmNoRmllbGRcbiAgICAgIHRoaXMuXyRlbC5yZXBsYWNlV2l0aChzZWFyY2hGaWVsZCk7XG4gICAgICB0aGlzLl8kZWwgPSBzZWFyY2hGaWVsZDtcbiAgICAgIHRoaXMuX2VsID0gc2VhcmNoRmllbGQuZ2V0KDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6dm9pZCB7XG4gICAgICAvLyBiaW5kIGRlZmF1bHQgZXZlbnRzXG4gICAgICB0aGlzLmJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIC8vIFJFU09MVkVSXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXIgPT09ICdhamF4Jykge1xuICAgICAgICAvLyBjb25maWd1cmUgZGVmYXVsdCByZXNvbHZlclxuICAgICAgICB0aGlzLnJlc29sdmVyID0gbmV3IEFqYXhSZXNvbHZlcih0aGlzLl9zZXR0aW5ncy5yZXNvbHZlclNldHRpbmdzKTtcbiAgICAgIH1cbiAgICAgIC8vIERyb3Bkb3duXG4gICAgICB0aGlzLl9kZCA9IG5ldyBEcm9wZG93bih0aGlzLl8kZWwsIHRoaXMuX3NldHRpbmdzLmZvcm1hdFJlc3VsdCwgdGhpcy5fc2V0dGluZ3MuYXV0b1NlbGVjdCk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpOnZvaWQge1xuICAgICAgdGhpcy5fJGVsLm9uKCdrZXlkb3duJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgOTogLy8gVEFCXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuYXV0b1NlbGVjdCkge1xuICAgICAgICAgICAgICAvLyBpZiBhdXRvU2VsZWN0IGVuYWJsZWQgc2VsZWN0cyBvbiBibHVyIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbVxuICAgICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5fJGVsLm9uKCdmb2N1cyBrZXl1cCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcbiAgICAgICAgLy8gY2hlY2sga2V5XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG4gICAgICAgICAgY2FzZSAxNjogLy8gc2hpZnRcbiAgICAgICAgICBjYXNlIDE3OiAvLyBjdHJsXG4gICAgICAgICAgY2FzZSAxODogLy8gYWx0XG4gICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgICBjYXNlIDM3OiAvLyBsZWZ0IFxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHRcdC8vIGFycm93IERPV05cbiAgICAgICAgICAgIHRoaXMuX2RkLmZvY3VzTmV4dEl0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c1ByZXZpb3VzSXRlbSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMzogLy8gRU5URVJcbiAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdC8vIEVTQ1xuICAgICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMuXyRlbC52YWwoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlclR5cGVkKG5ld1ZhbHVlKTtcblx0XHRcdFx0fVxuICAgICAgICBcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl8kZWwub24oJ2JsdXInLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgIGlmICghdGhpcy5fZGQuaXNNb3VzZU92ZXIpIHtcblxuICAgICAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgYSBzZWxlY3QgZWxlbWVudCB5b3UgbXVzdFxuICAgICAgICAgICAgaWYgKHRoaXMuX2RkLmlzSXRlbUZvY3VzZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAodGhpcy5fc2VsZWN0ZWRJdGVtICE9PSBudWxsKSAmJiAodGhpcy5fJGVsLnZhbCgpICE9PSAnJykgKSB7XG4gICAgICAgICAgICAgIC8vIHJlc2VsZWN0IGl0XG4gICAgICAgICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VsZWN0JywgdGhpcy5fc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICh0aGlzLl8kZWwudmFsKCkgIT09ICcnKSAmJiAodGhpcy5fZGVmYXVsdFZhbHVlICE9PSBudWxsKSApIHtcbiAgICAgICAgICAgICAgLy8gc2VsZWN0IERlZmF1bHRcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnZhbCh0aGlzLl9kZWZhdWx0VGV4dCk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbCh0aGlzLl9kZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gZW1wdHkgdGhlIHZhbHVlc1xuICAgICAgICAgICAgICB0aGlzLl8kZWwudmFsKCcnKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQudmFsKCcnKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZWxlY3RlZCBldmVudFxuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VsZWN0JywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgaXRlbTphbnkpID0+IHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gaXRlbTtcbiAgICAgICAgdGhpcy5pdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihpdGVtKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgaGFuZGxlclR5cGVkKG5ld1ZhbHVlOnN0cmluZyk6dm9pZCB7XG4gICAgICAvLyBmaWVsZCB2YWx1ZSBjaGFuZ2VkXG5cbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMudHlwZWQgIT09IG51bGwpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMudHlwZWQobmV3VmFsdWUpO1xuICAgICAgICBpZiAoIW5ld1ZhbHVlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdmFsdWUgPj0gbWluTGVuZ3RoLCBzdGFydCBhdXRvY29tcGxldGVcbiAgICAgIGlmIChuZXdWYWx1ZS5sZW5ndGggPj0gdGhpcy5fc2V0dGluZ3MubWluTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3NlYXJjaFRleHQgPSBuZXdWYWx1ZTtcbiAgICAgICAgdGhpcy5oYW5kbGVyUHJlU2VhcmNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyUHJlU2VhcmNoKCk6dm9pZCB7XG4gICAgICAvLyBkbyBub3RoaW5nLCBzdGFydCBzZWFyY2hcbiAgICAgIFxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQcmUgIT09IG51bGwpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlOnN0cmluZyA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQcmUodGhpcy5fc2VhcmNoVGV4dCk7XG4gICAgICAgIGlmICghbmV3VmFsdWUpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlckRvU2VhcmNoKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyRG9TZWFyY2goKTp2b2lkIHtcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2godGhpcy5fc2VhcmNoVGV4dCwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5wb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGVmYXVsdCBiZWhhdmlvdXJcbiAgICAgICAgLy8gc2VhcmNoIHVzaW5nIGN1cnJlbnQgcmVzb2x2ZXJcbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZXIpIHtcbiAgICAgICAgICB0aGlzLnJlc29sdmVyLnNlYXJjaCh0aGlzLl9zZWFyY2hUZXh0LCAocmVzdWx0czphbnkpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrIGNhbGxlZCcsIHJlc3VsdHMpO1xuICAgICAgXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFBvc3QpIHtcbiAgICAgICAgcmVzdWx0cyA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQb3N0KHJlc3VsdHMpO1xuICAgICAgICBpZiAoICh0eXBlb2YgcmVzdWx0cyA9PT0gJ2Jvb2xlYW4nKSAmJiAhcmVzdWx0cylcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlclN0YXJ0U2hvdyhyZXN1bHRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJTdGFydFNob3cocmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJkZWZhdWx0RXZlbnRTdGFydFNob3dcIiwgcmVzdWx0cyk7XG4gICAgICAvLyBmb3IgZXZlcnkgcmVzdWx0LCBkcmF3IGl0XG4gICAgICB0aGlzLl9kZC51cGRhdGVJdGVtcyhyZXN1bHRzLCB0aGlzLl9zZWFyY2hUZXh0KTtcbiAgICAgIHRoaXMuX2RkLnNob3coKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbTphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyJywgaXRlbSk7XG4gICAgICAvLyBkZWZhdWx0IGJlaGF2aW91ciBpcyBzZXQgZWxtZW50J3MgLnZhbCgpXG4gICAgICBsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQoaXRlbSk7XG5cdFx0XHRpZiAodHlwZW9mIGl0ZW1Gb3JtYXR0ZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGl0ZW1Gb3JtYXR0ZWQgPSB7IHRleHQ6IGl0ZW1Gb3JtYXR0ZWQgfVxuXHRcdFx0fVxuICAgICAgdGhpcy5fJGVsLnZhbChpdGVtRm9ybWF0dGVkLnRleHQpO1xuICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYSBzZWxlY3RcbiAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQudmFsKGl0ZW1Gb3JtYXR0ZWQudmFsdWUpO1xuICAgICAgfVxuICAgICAgLy8gc2F2ZSBzZWxlY3RlZCBpdGVtXG4gICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgICAgLy8gYW5kIGhpZGVcbiAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRGb3JtYXRSZXN1bHQoaXRlbTphbnkpOnt9IHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0gfTtcbiAgICAgIH0gZWxzZSBpZiAoIGl0ZW0udGV4dCApIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZXR1cm4gYSB0b1N0cmluZyBvZiB0aGUgaXRlbSBhcyBsYXN0IHJlc29ydFxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdObyBkZWZhdWx0IGZvcm1hdHRlciBmb3IgaXRlbScsIGl0ZW0pO1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtLnRvU3RyaW5nKCkgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG59XG5cbihmdW5jdGlvbigkOiBKUXVlcnlTdGF0aWMsIHdpbmRvdzogYW55LCBkb2N1bWVudDogYW55KSB7XG4gICQuZm5bQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUVdID0gZnVuY3Rpb24ob3B0aW9uczogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwbHVnaW5DbGFzczpBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGU7XG5cbiAgICAgIHBsdWdpbkNsYXNzID0gJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FKTtcblxuICAgICAgaWYgKCFwbHVnaW5DbGFzcykge1xuICAgICAgICBwbHVnaW5DbGFzcyA9IG5ldyBBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUodGhpcywgb3B0aW9ucyk7IFxuICAgICAgICAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHBsdWdpbkNsYXNzKTtcbiAgICAgIH1cblxuXG4gICAgfSk7XG4gIH07XG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblxuLy8gICAndXNlIHN0cmljdCc7XG5cbi8vICAgZmFjdG9yeShqUXVlcnkpO1xuXG4vLyB9KHRoaXMsIGZ1bmN0aW9uICgkKSB7XG5cbi8vICAgJ3VzZSBzdHJpY3QnO1xuLy8gICAvLyBqc2hpbnQgbGF4Y29tbWE6IHRydWVcblxuXG4vLyAgLyogVFlQRUFIRUFEIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4vLyAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgdmFyIFR5cGVhaGVhZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4vLyAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4vLyAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4udHlwZWFoZWFkLmRlZmF1bHRzLCBvcHRpb25zKTtcbi8vICAgICB0aGlzLm1hdGNoZXIgPSB0aGlzLm9wdGlvbnMubWF0Y2hlciB8fCB0aGlzLm1hdGNoZXI7XG4vLyAgICAgdGhpcy5zb3J0ZXIgPSB0aGlzLm9wdGlvbnMuc29ydGVyIHx8IHRoaXMuc29ydGVyO1xuLy8gICAgIHRoaXMuc2VsZWN0ID0gdGhpcy5vcHRpb25zLnNlbGVjdCB8fCB0aGlzLnNlbGVjdDtcbi8vICAgICB0aGlzLmF1dG9TZWxlY3QgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmF1dG9TZWxlY3QgPT0gJ2Jvb2xlYW4nID8gdGhpcy5vcHRpb25zLmF1dG9TZWxlY3QgOiB0cnVlO1xuLy8gICAgIHRoaXMuaGlnaGxpZ2h0ZXIgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0ZXIgfHwgdGhpcy5oaWdobGlnaHRlcjtcbi8vICAgICB0aGlzLnJlbmRlciA9IHRoaXMub3B0aW9ucy5yZW5kZXIgfHwgdGhpcy5yZW5kZXI7XG4vLyAgICAgdGhpcy51cGRhdGVyID0gdGhpcy5vcHRpb25zLnVwZGF0ZXIgfHwgdGhpcy51cGRhdGVyO1xuLy8gICAgIHRoaXMuZGlzcGxheVRleHQgPSB0aGlzLm9wdGlvbnMuZGlzcGxheVRleHQgfHwgdGhpcy5kaXNwbGF5VGV4dDtcbi8vICAgICB0aGlzLnNlbGVjdGVkVGV4dCA9IHRoaXMub3B0aW9ucy5zZWxlY3RlZFRleHQgfHwgdGhpcy5zZWxlY3RlZFRleHQ7XG4vLyAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLm9wdGlvbnMuc291cmNlO1xuLy8gICAgIHRoaXMuZGVsYXkgPSB0aGlzLm9wdGlvbnMuZGVsYXk7XG4vLyAgICAgdGhpcy4kbWVudSA9ICQodGhpcy5vcHRpb25zLm1lbnUpO1xuLy8gICAgIHRoaXMuJGFwcGVuZFRvID0gdGhpcy5vcHRpb25zLmFwcGVuZFRvID8gJCh0aGlzLm9wdGlvbnMuYXBwZW5kVG8pIDogbnVsbDtcbi8vICAgICB0aGlzLmZpdFRvRWxlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50ID09ICdib29sZWFuJyA/IHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgOiBmYWxzZTtcbi8vICAgICB0aGlzLnNob3duID0gZmFsc2U7XG4vLyAgICAgdGhpcy5saXN0ZW4oKTtcbi8vICAgICB0aGlzLnNob3dIaW50T25Gb2N1cyA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09ICdib29sZWFuJyB8fCB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09PSBcImFsbFwiID8gdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA6IGZhbHNlO1xuLy8gICAgIHRoaXMuYWZ0ZXJTZWxlY3QgPSB0aGlzLm9wdGlvbnMuYWZ0ZXJTZWxlY3Q7XG4vLyAgICAgdGhpcy5hZGRJdGVtID0gZmFsc2U7XG4vLyAgICAgdGhpcy52YWx1ZSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCk7XG4vLyAgIH07XG4gIFxuLy8gICBUeXBlYWhlYWQucHJvdG90eXBlID0ge1xuXG4vLyAgICAgY29uc3RydWN0b3I6IFR5cGVhaGVhZCxcblxuLy8gICAgIHNlbGVjdDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyIHZhbCA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLmRhdGEoJ3ZhbHVlJyk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIHZhbCk7XG4vLyAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0IHx8IHZhbCkge1xuLy8gICAgICAgICB2YXIgbmV3VmFsID0gdGhpcy51cGRhdGVyKHZhbCk7XG4vLyAgICAgICAgIC8vIFVwZGF0ZXIgY2FuIGJlIHNldCB0byBhbnkgcmFuZG9tIGZ1bmN0aW9ucyB2aWEgXCJvcHRpb25zXCIgcGFyYW1ldGVyIGluIGNvbnN0cnVjdG9yIGFib3ZlLlxuLy8gICAgICAgICAvLyBBZGQgbnVsbCBjaGVjayBmb3IgY2FzZXMgd2hlbiB1cGRhdGVyIHJldHVybnMgdm9pZCBvciB1bmRlZmluZWQuXG4vLyAgICAgICAgIGlmICghbmV3VmFsKSB7XG4vLyAgICAgICAgICAgbmV3VmFsID0gJyc7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdmFyIHNlbGVjdGVkVmFsID0gdGhpcy5zZWxlY3RlZFRleHQobmV3VmFsKTtcbi8vICAgICAgICAgaWYgKHNlbGVjdGVkVmFsICE9PSBmYWxzZSkge1xuLy8gICAgICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgICAgIC52YWwoc2VsZWN0ZWRWYWwpXG4vLyAgICAgICAgICAgICAudGV4dCh0aGlzLmRpc3BsYXlUZXh0KG5ld1ZhbCkgfHwgbmV3VmFsKVxuLy8gICAgICAgICAgICAgLmNoYW5nZSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHRoaXMuYWZ0ZXJTZWxlY3QobmV3VmFsKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBzZXRTb3VyY2U6IGZ1bmN0aW9uIChzb3VyY2UpIHtcbi8vICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuLy8gICAgIH0sXG5cbi8vICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgcG9zID0gJC5leHRlbmQoe30sIHRoaXMuJGVsZW1lbnQucG9zaXRpb24oKSwge1xuLy8gICAgICAgICBoZWlnaHQ6IHRoaXMuJGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgdmFyIHNjcm9sbEhlaWdodCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0ID09ICdmdW5jdGlvbicgP1xuLy8gICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQuY2FsbCgpIDpcbi8vICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0O1xuXG4vLyAgICAgICB2YXIgZWxlbWVudDtcbi8vICAgICAgIGlmICh0aGlzLnNob3duKSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51O1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLiRhcHBlbmRUbykge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudS5hcHBlbmRUbyh0aGlzLiRhcHBlbmRUbyk7XG4vLyAgICAgICAgIHRoaXMuaGFzU2FtZVBhcmVudCA9IHRoaXMuJGFwcGVuZFRvLmlzKHRoaXMuJGVsZW1lbnQucGFyZW50KCkpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnUuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudCk7XG4vLyAgICAgICAgIHRoaXMuaGFzU2FtZVBhcmVudCA9IHRydWU7XG4vLyAgICAgICB9ICAgICAgXG4gICAgICBcbi8vICAgICAgIGlmICghdGhpcy5oYXNTYW1lUGFyZW50KSB7XG4vLyAgICAgICAgICAgLy8gV2UgY2Fubm90IHJlbHkgb24gdGhlIGVsZW1lbnQgcG9zaXRpb24sIG5lZWQgdG8gcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIHdpbmRvd1xuLy8gICAgICAgICAgIGVsZW1lbnQuY3NzKFwicG9zaXRpb25cIiwgXCJmaXhlZFwiKTtcbi8vICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKTtcbi8vICAgICAgICAgICBwb3MudG9wID0gIG9mZnNldC50b3A7XG4vLyAgICAgICAgICAgcG9zLmxlZnQgPSBvZmZzZXQubGVmdDtcbi8vICAgICAgIH1cbi8vICAgICAgIC8vIFRoZSBydWxlcyBmb3IgYm9vdHN0cmFwIGFyZTogJ2Ryb3B1cCcgaW4gdGhlIHBhcmVudCBhbmQgJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnIGluIHRoZSBlbGVtZW50LlxuLy8gICAgICAgLy8gTm90ZSB0aGF0IHRvIGdldCByaWdodCBhbGlnbm1lbnQsIHlvdSdsbCBuZWVkIHRvIHNwZWNpZnkgYG1lbnVgIGluIHRoZSBvcHRpb25zIHRvIGJlOlxuLy8gICAgICAgLy8gJzx1bCBjbGFzcz1cInR5cGVhaGVhZCBkcm9wZG93bi1tZW51XCIgcm9sZT1cImxpc3Rib3hcIj48L3VsPidcbi8vICAgICAgIHZhciBkcm9wdXAgPSAkKGVsZW1lbnQpLnBhcmVudCgpLmhhc0NsYXNzKCdkcm9wdXAnKTtcbi8vICAgICAgIHZhciBuZXdUb3AgPSBkcm9wdXAgPyAnYXV0bycgOiAocG9zLnRvcCArIHBvcy5oZWlnaHQgKyBzY3JvbGxIZWlnaHQpO1xuLy8gICAgICAgdmFyIHJpZ2h0ID0gJChlbGVtZW50KS5oYXNDbGFzcygnZHJvcGRvd24tbWVudS1yaWdodCcpO1xuLy8gICAgICAgdmFyIG5ld0xlZnQgPSByaWdodCA/ICdhdXRvJyA6IHBvcy5sZWZ0O1xuLy8gICAgICAgLy8gaXQgc2VlbXMgbGlrZSBzZXR0aW5nIHRoZSBjc3MgaXMgYSBiYWQgaWRlYSAoanVzdCBsZXQgQm9vdHN0cmFwIGRvIGl0KSwgYnV0IEknbGwga2VlcCB0aGUgb2xkXG4vLyAgICAgICAvLyBsb2dpYyBpbiBwbGFjZSBleGNlcHQgZm9yIHRoZSBkcm9wdXAvcmlnaHQtYWxpZ24gY2FzZXMuXG4vLyAgICAgICBlbGVtZW50LmNzcyh7IHRvcDogbmV3VG9wLCBsZWZ0OiBuZXdMZWZ0IH0pLnNob3coKTtcblxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgPT09IHRydWUpIHtcbi8vICAgICAgICAgICBlbGVtZW50LmNzcyhcIndpZHRoXCIsIHRoaXMuJGVsZW1lbnQub3V0ZXJXaWR0aCgpICsgXCJweFwiKTtcbi8vICAgICAgIH1cbiAgICBcbi8vICAgICAgIHRoaXMuc2hvd24gPSB0cnVlO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJG1lbnUuaGlkZSgpO1xuLy8gICAgICAgdGhpcy5zaG93biA9IGZhbHNlO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGxvb2t1cDogZnVuY3Rpb24gKHF1ZXJ5KSB7XG4vLyAgICAgICB2YXIgaXRlbXM7XG4vLyAgICAgICBpZiAodHlwZW9mKHF1ZXJ5KSAhPSAndW5kZWZpbmVkJyAmJiBxdWVyeSAhPT0gbnVsbCkge1xuLy8gICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKSB8fCAnJztcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKHRoaXMucXVlcnkubGVuZ3RoIDwgdGhpcy5vcHRpb25zLm1pbkxlbmd0aCAmJiAhdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cykge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcztcbi8vICAgICAgIH1cblxuLy8gICAgICAgdmFyIHdvcmtlciA9ICQucHJveHkoZnVuY3Rpb24gKCkge1xuXG4vLyAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24odGhpcy5zb3VyY2UpKSB7XG4vLyAgICAgICAgICAgdGhpcy5zb3VyY2UodGhpcy5xdWVyeSwgJC5wcm94eSh0aGlzLnByb2Nlc3MsIHRoaXMpKTtcbi8vICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNvdXJjZSkge1xuLy8gICAgICAgICAgIHRoaXMucHJvY2Vzcyh0aGlzLnNvdXJjZSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0sIHRoaXMpO1xuXG4vLyAgICAgICBjbGVhclRpbWVvdXQodGhpcy5sb29rdXBXb3JrZXIpO1xuLy8gICAgICAgdGhpcy5sb29rdXBXb3JrZXIgPSBzZXRUaW1lb3V0KHdvcmtlciwgdGhpcy5kZWxheSk7XG4vLyAgICAgfSxcblxuLy8gICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4vLyAgICAgICBpdGVtcyA9ICQuZ3JlcChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgICAgcmV0dXJuIHRoYXQubWF0Y2hlcihpdGVtKTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpdGVtcyA9IHRoaXMuc29ydGVyKGl0ZW1zKTtcblxuLy8gICAgICAgaWYgKCFpdGVtcy5sZW5ndGggJiYgIXRoaXMub3B0aW9ucy5hZGRJdGVtKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnNob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW1zWzBdKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgbnVsbCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIC8vIEFkZCBpdGVtXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkZEl0ZW0pe1xuLy8gICAgICAgICBpdGVtcy5wdXNoKHRoaXMub3B0aW9ucy5hZGRJdGVtKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5pdGVtcyA9PSAnYWxsJykge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoaXRlbXMpLnNob3coKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihpdGVtcy5zbGljZSgwLCB0aGlzLm9wdGlvbnMuaXRlbXMpKS5zaG93KCk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIG1hdGNoZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICB2YXIgaXQgPSB0aGlzLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgcmV0dXJuIH5pdC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5xdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICB9LFxuXG4vLyAgICAgc29ydGVyOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciBiZWdpbnN3aXRoID0gW107XG4vLyAgICAgICB2YXIgY2FzZVNlbnNpdGl2ZSA9IFtdO1xuLy8gICAgICAgdmFyIGNhc2VJbnNlbnNpdGl2ZSA9IFtdO1xuLy8gICAgICAgdmFyIGl0ZW07XG5cbi8vICAgICAgIHdoaWxlICgoaXRlbSA9IGl0ZW1zLnNoaWZ0KCkpKSB7XG4vLyAgICAgICAgIHZhciBpdCA9IHRoaXMuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICAgIGlmICghaXQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSkpIGJlZ2luc3dpdGgucHVzaChpdGVtKTtcbi8vICAgICAgICAgZWxzZSBpZiAofml0LmluZGV4T2YodGhpcy5xdWVyeSkpIGNhc2VTZW5zaXRpdmUucHVzaChpdGVtKTtcbi8vICAgICAgICAgZWxzZSBjYXNlSW5zZW5zaXRpdmUucHVzaChpdGVtKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcmV0dXJuIGJlZ2luc3dpdGguY29uY2F0KGNhc2VTZW5zaXRpdmUsIGNhc2VJbnNlbnNpdGl2ZSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgdmFyIGh0bWwgPSAkKCc8ZGl2PjwvZGl2PicpO1xuLy8gICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyeTtcbi8vICAgICAgIHZhciBpID0gaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgICB2YXIgbGVuID0gcXVlcnkubGVuZ3RoO1xuLy8gICAgICAgdmFyIGxlZnRQYXJ0O1xuLy8gICAgICAgdmFyIG1pZGRsZVBhcnQ7XG4vLyAgICAgICB2YXIgcmlnaHRQYXJ0O1xuLy8gICAgICAgdmFyIHN0cm9uZztcbi8vICAgICAgIGlmIChsZW4gPT09IDApIHtcbi8vICAgICAgICAgcmV0dXJuIGh0bWwudGV4dChpdGVtKS5odG1sKCk7XG4vLyAgICAgICB9XG4vLyAgICAgICB3aGlsZSAoaSA+IC0xKSB7XG4vLyAgICAgICAgIGxlZnRQYXJ0ID0gaXRlbS5zdWJzdHIoMCwgaSk7XG4vLyAgICAgICAgIG1pZGRsZVBhcnQgPSBpdGVtLnN1YnN0cihpLCBsZW4pO1xuLy8gICAgICAgICByaWdodFBhcnQgPSBpdGVtLnN1YnN0cihpICsgbGVuKTtcbi8vICAgICAgICAgc3Ryb25nID0gJCgnPHN0cm9uZz48L3N0cm9uZz4nKS50ZXh0KG1pZGRsZVBhcnQpO1xuLy8gICAgICAgICBodG1sXG4vLyAgICAgICAgICAgLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsZWZ0UGFydCkpXG4vLyAgICAgICAgICAgLmFwcGVuZChzdHJvbmcpO1xuLy8gICAgICAgICBpdGVtID0gcmlnaHRQYXJ0O1xuLy8gICAgICAgICBpID0gaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gaHRtbC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaXRlbSkpLmh0bWwoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgcmVuZGVyOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciB0aGF0ID0gdGhpcztcbi8vICAgICAgIHZhciBzZWxmID0gdGhpcztcbi8vICAgICAgIHZhciBhY3RpdmVGb3VuZCA9IGZhbHNlO1xuLy8gICAgICAgdmFyIGRhdGEgPSBbXTtcbi8vICAgICAgIHZhciBfY2F0ZWdvcnkgPSB0aGF0Lm9wdGlvbnMuc2VwYXJhdG9yO1xuXG4vLyAgICAgICAkLmVhY2goaXRlbXMsIGZ1bmN0aW9uIChrZXksdmFsdWUpIHtcbi8vICAgICAgICAgLy8gaW5qZWN0IHNlcGFyYXRvclxuLy8gICAgICAgICBpZiAoa2V5ID4gMCAmJiB2YWx1ZVtfY2F0ZWdvcnldICE9PSBpdGVtc1trZXkgLSAxXVtfY2F0ZWdvcnldKXtcbi8vICAgICAgICAgICBkYXRhLnB1c2goe1xuLy8gICAgICAgICAgICAgX190eXBlOiAnZGl2aWRlcidcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIC8vIGluamVjdCBjYXRlZ29yeSBoZWFkZXJcbi8vICAgICAgICAgaWYgKHZhbHVlW19jYXRlZ29yeV0gJiYgKGtleSA9PT0gMCB8fCB2YWx1ZVtfY2F0ZWdvcnldICE9PSBpdGVtc1trZXkgLSAxXVtfY2F0ZWdvcnldKSl7XG4vLyAgICAgICAgICAgZGF0YS5wdXNoKHtcbi8vICAgICAgICAgICAgIF9fdHlwZTogJ2NhdGVnb3J5Jyxcbi8vICAgICAgICAgICAgIG5hbWU6IHZhbHVlW19jYXRlZ29yeV1cbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICBkYXRhLnB1c2godmFsdWUpO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGl0ZW1zID0gJChkYXRhKS5tYXAoZnVuY3Rpb24gKGksIGl0ZW0pIHtcbi8vICAgICAgICAgaWYgKChpdGVtLl9fdHlwZSB8fCBmYWxzZSkgPT0gJ2NhdGVnb3J5Jyl7XG4vLyAgICAgICAgICAgcmV0dXJuICQodGhhdC5vcHRpb25zLmhlYWRlckh0bWwpLnRleHQoaXRlbS5uYW1lKVswXTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIGlmICgoaXRlbS5fX3R5cGUgfHwgZmFsc2UpID09ICdkaXZpZGVyJyl7XG4vLyAgICAgICAgICAgcmV0dXJuICQodGhhdC5vcHRpb25zLmhlYWRlckRpdmlkZXIpWzBdO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgdmFyIHRleHQgPSBzZWxmLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgICBpID0gJCh0aGF0Lm9wdGlvbnMuaXRlbSkuZGF0YSgndmFsdWUnLCBpdGVtKTtcbi8vICAgICAgICAgaS5maW5kKCdhJykuaHRtbCh0aGF0LmhpZ2hsaWdodGVyKHRleHQsIGl0ZW0pKTtcbi8vICAgICAgICAgaWYgKHRleHQgPT0gc2VsZi4kZWxlbWVudC52YWwoKSkge1xuLy8gICAgICAgICAgIGkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgICAgIHNlbGYuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbSk7XG4vLyAgICAgICAgICAgYWN0aXZlRm91bmQgPSB0cnVlO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHJldHVybiBpWzBdO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGlmICh0aGlzLmF1dG9TZWxlY3QgJiYgIWFjdGl2ZUZvdW5kKSB7XG4vLyAgICAgICAgIGl0ZW1zLmZpbHRlcignOm5vdCguZHJvcGRvd24taGVhZGVyKScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW1zLmZpcnN0KCkuZGF0YSgndmFsdWUnKSk7XG4vLyAgICAgICB9XG4vLyAgICAgICB0aGlzLiRtZW51Lmh0bWwoaXRlbXMpO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGRpc3BsYXlUZXh0OiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaXRlbS5uYW1lICE9ICd1bmRlZmluZWQnICYmIGl0ZW0ubmFtZSB8fCBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBzZWxlY3RlZFRleHQ6IGZ1bmN0aW9uKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSAhPSAndW5kZWZpbmVkJyAmJiBpdGVtLm5hbWUgfHwgaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgbmV4dDogZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICB2YXIgYWN0aXZlID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgdmFyIG5leHQgPSBhY3RpdmUubmV4dCgpO1xuXG4vLyAgICAgICBpZiAoIW5leHQubGVuZ3RoKSB7XG4vLyAgICAgICAgIG5leHQgPSAkKHRoaXMuJG1lbnUuZmluZCgnbGknKVswXSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBwcmV2OiBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICB2YXIgcHJldiA9IGFjdGl2ZS5wcmV2KCk7XG5cbi8vICAgICAgIGlmICghcHJldi5sZW5ndGgpIHtcbi8vICAgICAgICAgcHJldiA9IHRoaXMuJG1lbnUuZmluZCgnbGknKS5sYXN0KCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHByZXYuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBsaXN0ZW46IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgLm9uKCdmb2N1cycsICAgICQucHJveHkodGhpcy5mb2N1cywgdGhpcykpXG4vLyAgICAgICAgIC5vbignYmx1cicsICAgICAkLnByb3h5KHRoaXMuYmx1ciwgdGhpcykpXG4vLyAgICAgICAgIC5vbigna2V5cHJlc3MnLCAkLnByb3h5KHRoaXMua2V5cHJlc3MsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2lucHV0JywgICAgJC5wcm94eSh0aGlzLmlucHV0LCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdrZXl1cCcsICAgICQucHJveHkodGhpcy5rZXl1cCwgdGhpcykpO1xuXG4vLyAgICAgICBpZiAodGhpcy5ldmVudFN1cHBvcnRlZCgna2V5ZG93bicpKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24nLCAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcykpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB0aGlzLiRtZW51XG4vLyAgICAgICAgIC5vbignY2xpY2snLCAkLnByb3h5KHRoaXMuY2xpY2ssIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlZW50ZXInLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VlbnRlciwgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2VsZWF2ZScsICdsaScsICQucHJveHkodGhpcy5tb3VzZWxlYXZlLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWRvd24nLCAkLnByb3h5KHRoaXMubW91c2Vkb3duLHRoaXMpKTtcbi8vICAgICB9LFxuXG4vLyAgICAgZGVzdHJveSA6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgndHlwZWFoZWFkJyxudWxsKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJyxudWxsKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgLm9mZignZm9jdXMnKVxuLy8gICAgICAgICAub2ZmKCdibHVyJylcbi8vICAgICAgICAgLm9mZigna2V5cHJlc3MnKVxuLy8gICAgICAgICAub2ZmKCdpbnB1dCcpXG4vLyAgICAgICAgIC5vZmYoJ2tleXVwJyk7XG5cbi8vICAgICAgIGlmICh0aGlzLmV2ZW50U3VwcG9ydGVkKCdrZXlkb3duJykpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2tleWRvd24nKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgdGhpcy4kbWVudS5yZW1vdmUoKTtcbi8vICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbi8vICAgICB9LFxuXG4vLyAgICAgZXZlbnRTdXBwb3J0ZWQ6IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbi8vICAgICAgIHZhciBpc1N1cHBvcnRlZCA9IGV2ZW50TmFtZSBpbiB0aGlzLiRlbGVtZW50O1xuLy8gICAgICAgaWYgKCFpc1N1cHBvcnRlZCkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LnNldEF0dHJpYnV0ZShldmVudE5hbWUsICdyZXR1cm47Jyk7XG4vLyAgICAgICAgIGlzU3VwcG9ydGVkID0gdHlwZW9mIHRoaXMuJGVsZW1lbnRbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJztcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBpc1N1cHBvcnRlZDtcbi8vICAgICB9LFxuXG4vLyAgICAgbW92ZTogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuXG4vLyAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuLy8gICAgICAgICBjYXNlIDk6IC8vIHRhYlxuLy8gICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuLy8gICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbi8vICAgICAgICAgICAvLyB3aXRoIHRoZSBzaGlmdEtleSAodGhpcyBpcyBhY3R1YWxseSB0aGUgbGVmdCBwYXJlbnRoZXNpcylcbi8vICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkgcmV0dXJuO1xuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICB0aGlzLnByZXYoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4vLyAgICAgICAgICAgLy8gd2l0aCB0aGUgc2hpZnRLZXkgKHRoaXMgaXMgYWN0dWFsbHkgdGhlIHJpZ2h0IHBhcmVudGhlc2lzKVxuLy8gICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSByZXR1cm47XG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIHRoaXMubmV4dCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5zdXBwcmVzc0tleVByZXNzUmVwZWF0ID0gfiQuaW5BcnJheShlLmtleUNvZGUsIFs0MCwzOCw5LDEzLDI3XSk7XG4vLyAgICAgICBpZiAoIXRoaXMuc2hvd24gJiYgZS5rZXlDb2RlID09IDQwKSB7XG4vLyAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLm1vdmUoZSk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleXByZXNzOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCkgcmV0dXJuO1xuLy8gICAgICAgdGhpcy5tb3ZlKGUpO1xuLy8gICAgIH0sXG5cbi8vICAgICBpbnB1dDogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIC8vIFRoaXMgaXMgYSBmaXhlZCBmb3IgSUUxMC8xMSB0aGF0IGZpcmVzIHRoZSBpbnB1dCBldmVudCB3aGVuIGEgcGxhY2Vob2RlciBpcyBjaGFuZ2VkXG4vLyAgICAgICAvLyAoaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MTA1MzgvaWUtMTEtZmlyZXMtaW5wdXQtZXZlbnQtb24tZm9jdXMpXG4vLyAgICAgICB2YXIgY3VycmVudFZhbHVlID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKTtcbi8vICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBjdXJyZW50VmFsdWUpIHtcbi8vICAgICAgICAgdGhpcy52YWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbi8vICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5dXA6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbi8vICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgfVxuLy8gICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbi8vICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuLy8gICAgICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuLy8gICAgICAgICBjYXNlIDE2OiAvLyBzaGlmdFxuLy8gICAgICAgICBjYXNlIDE3OiAvLyBjdHJsXG4vLyAgICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4vLyAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4vLyAgICAgICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG4vLyAgICAgICAgICAgdGhpcy5zZWxlY3QoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbi8vICAgICAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcbi8vICAgICAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICAgICAgICBicmVhaztcbi8vICAgICAgIH1cblxuXG4vLyAgICAgfSxcblxuLy8gICAgIGZvY3VzOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbi8vICAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbi8vICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgJiYgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzICE9PSB0cnVlKSB7XG4vLyAgICAgICAgICAgaWYodGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PT0gXCJhbGxcIikge1xuLy8gICAgICAgICAgICAgdGhpcy5sb29rdXAoXCJcIik7IFxuLy8gICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgICAgaWYgKHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cykge1xuLy8gICAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSBmYWxzZTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAgYmx1cjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5tb3VzZWRvdmVyICYmICF0aGlzLm1vdXNlZGRvd24gJiYgdGhpcy5zaG93bikge1xuLy8gICAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMubW91c2VkZG93bikge1xuLy8gICAgICAgICAvLyBUaGlzIGlzIGZvciBJRSB0aGF0IGJsdXJzIHRoZSBpbnB1dCB3aGVuIHVzZXIgY2xpY2tzIG9uIHNjcm9sbC5cbi8vICAgICAgICAgLy8gV2Ugc2V0IHRoZSBmb2N1cyBiYWNrIG9uIHRoZSBpbnB1dCBhbmQgcHJldmVudCB0aGUgbG9va3VwIHRvIG9jY3VyIGFnYWluXG4vLyAgICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IHRydWU7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbi8vICAgICAgICAgdGhpcy5tb3VzZWRkb3duID0gZmFsc2U7XG4vLyAgICAgICB9IFxuLy8gICAgIH0sXG5cbi8vICAgICBjbGljazogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IHRydWU7XG4vLyAgICAgICB0aGlzLnNlbGVjdCgpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5mb2N1cygpO1xuLy8gICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZG92ZXIgPSB0cnVlO1xuLy8gICAgICAgdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbW91c2VsZWF2ZTogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2Vkb3ZlciA9IGZhbHNlO1xuLy8gICAgICAgaWYgKCF0aGlzLmZvY3VzZWQgJiYgdGhpcy5zaG93bikgdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgLyoqXG4vLyAgICAgICogV2UgdHJhY2sgdGhlIG1vdXNlZG93biBmb3IgSUUuIFdoZW4gY2xpY2tpbmcgb24gdGhlIG1lbnUgc2Nyb2xsYmFyLCBJRSBtYWtlcyB0aGUgaW5wdXQgYmx1ciB0aHVzIGhpZGluZyB0aGUgbWVudS5cbi8vICAgICAgKi9cbi8vICAgICBtb3VzZWRvd246IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZGRvd24gPSB0cnVlO1xuLy8gICAgICAgdGhpcy4kbWVudS5vbmUoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKGUpe1xuLy8gICAgICAgICAvLyBJRSB3b24ndCBmaXJlIHRoaXMsIGJ1dCBGRiBhbmQgQ2hyb21lIHdpbGwgc28gd2UgcmVzZXQgb3VyIGZsYWcgZm9yIHRoZW0gaGVyZVxuLy8gICAgICAgICB0aGlzLm1vdXNlZGRvd24gPSBmYWxzZTtcbi8vICAgICAgIH0uYmluZCh0aGlzKSk7XG4vLyAgICAgfSxcblxuLy8gICB9O1xuXG5cbi8vICAgLyogVFlQRUFIRUFEIFBMVUdJTiBERUZJTklUSU9OXG4vLyAgICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgIHZhciBvbGQgPSAkLmZuLnR5cGVhaGVhZDtcblxuLy8gICAkLmZuLnR5cGVhaGVhZCA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbi8vICAgICB2YXIgYXJnID0gYXJndW1lbnRzO1xuLy8gICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnICYmIG9wdGlvbiA9PSAnZ2V0QWN0aXZlJykge1xuLy8gICAgICAgcmV0dXJuIHRoaXMuZGF0YSgnYWN0aXZlJyk7XG4vLyAgICAgfVxuLy8gICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbi8vICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgndHlwZWFoZWFkJyk7XG4vLyAgICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uO1xuLy8gICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCd0eXBlYWhlYWQnLCAoZGF0YSA9IG5ldyBUeXBlYWhlYWQodGhpcywgb3B0aW9ucykpKTtcbi8vICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnICYmIGRhdGFbb3B0aW9uXSkge1xuLy8gICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDEpIHtcbi8vICAgICAgICAgICBkYXRhW29wdGlvbl0uYXBwbHkoZGF0YSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJnLCAxKSk7XG4vLyAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgZGF0YVtvcHRpb25dKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfTtcblxuLy8gICAkLmZuLnR5cGVhaGVhZC5kZWZhdWx0cyA9IHtcbi8vICAgICBzb3VyY2U6IFtdLFxuLy8gICAgIGl0ZW1zOiA4LFxuLy8gICAgIG1lbnU6ICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgZHJvcGRvd24tbWVudVwiIHJvbGU9XCJsaXN0Ym94XCI+PC91bD4nLFxuLy8gICAgIGl0ZW06ICc8bGk+PGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cIiNcIiByb2xlPVwib3B0aW9uXCI+PC9hPjwvbGk+Jyxcbi8vICAgICBtaW5MZW5ndGg6IDEsXG4vLyAgICAgc2Nyb2xsSGVpZ2h0OiAwLFxuLy8gICAgIGF1dG9TZWxlY3Q6IHRydWUsXG4vLyAgICAgYWZ0ZXJTZWxlY3Q6ICQubm9vcCxcbi8vICAgICBhZGRJdGVtOiBmYWxzZSxcbi8vICAgICBkZWxheTogMCxcbi8vICAgICBzZXBhcmF0b3I6ICdjYXRlZ29yeScsXG4vLyAgICAgaGVhZGVySHRtbDogJzxsaSBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiPjwvbGk+Jyxcbi8vICAgICBoZWFkZXJEaXZpZGVyOiAnPGxpIGNsYXNzPVwiZGl2aWRlclwiIHJvbGU9XCJzZXBhcmF0b3JcIj48L2xpPidcbi8vICAgfTtcblxuLy8gICAkLmZuLnR5cGVhaGVhZC5Db25zdHJ1Y3RvciA9IFR5cGVhaGVhZDtcblxuLy8gIC8qIFRZUEVBSEVBRCBOTyBDT05GTElDVFxuLy8gICAqID09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICAkLmZuLnR5cGVhaGVhZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICQuZm4udHlwZWFoZWFkID0gb2xkO1xuLy8gICAgIHJldHVybiB0aGlzO1xuLy8gICB9O1xuXG5cbi8vICAvKiBUWVBFQUhFQUQgREFUQS1BUElcbi8vICAgKiA9PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICAkKGRvY3VtZW50KS5vbignZm9jdXMudHlwZWFoZWFkLmRhdGEtYXBpJywgJ1tkYXRhLXByb3ZpZGU9XCJ0eXBlYWhlYWRcIl0nLCBmdW5jdGlvbiAoZSkge1xuLy8gICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4vLyAgICAgaWYgKCR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpKSByZXR1cm47XG4vLyAgICAgJHRoaXMudHlwZWFoZWFkKCR0aGlzLmRhdGEoKSk7XG4vLyAgIH0pO1xuXG4vLyB9KSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9tYWluLnRzXG4gKiovIiwiXG5jbGFzcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQgcmVzdWx0czpBcnJheTxPYmplY3Q+O1xuXG5cdHByb3RlY3RlZCBfc2V0dGluZ3M6YW55O1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0dGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0UmVzdWx0cyhsaW1pdD86bnVtYmVyLCBzdGFydD86bnVtYmVyLCBlbmQ/Om51bWJlcik6QXJyYXk8T2JqZWN0PiB7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMucmVzdWx0cztcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0Y2JrKHRoaXMuZ2V0UmVzdWx0cygpKTtcblx0fVxuXG59XG5cbmV4cG9ydCBjbGFzcyBBamF4UmVzb2x2ZXIgZXh0ZW5kcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQganFYSFI6SlF1ZXJ5WEhSO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHQvLyBjb25zb2xlLmxvZygncmVzb2x2ZXIgc2V0dGluZ3MnLCB0aGlzLl9zZXR0aW5ncyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJycsXG5cdFx0XHRtZXRob2Q6ICdnZXQnLFxuXHRcdFx0cXVlcnlLZXk6ICdxJyxcblx0XHRcdGV4dHJhRGF0YToge30sXG5cdFx0XHR0aW1lb3V0OiB1bmRlZmluZWQsXG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0aWYgKHRoaXMuanFYSFIgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5qcVhIUi5hYm9ydCgpO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhOk9iamVjdCA9IHt9O1xuXHRcdGRhdGFbdGhpcy5fc2V0dGluZ3MucXVlcnlLZXldID0gcTtcblx0XHQkLmV4dGVuZChkYXRhLCB0aGlzLl9zZXR0aW5ncy5leHRyYURhdGEpO1xuXG5cdFx0dGhpcy5qcVhIUiA9ICQuYWpheChcblx0XHRcdHRoaXMuX3NldHRpbmdzLnVybCxcblx0XHRcdHtcblx0XHRcdFx0bWV0aG9kOiB0aGlzLl9zZXR0aW5ncy5tZXRob2QsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHRpbWVvdXQ6IHRoaXMuX3NldHRpbmdzLnRpbWVvdXRcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dGhpcy5qcVhIUi5kb25lKChyZXN1bHQpID0+IHtcblx0XHRcdGNiayhyZXN1bHQpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuanFYSFIuZmFpbCgoZXJyKSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhlcnIpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5qcVhIUi5hbHdheXMoKCkgPT4ge1xuXHRcdFx0dGhpcy5qcVhIUiA9IG51bGw7XG5cdFx0fSk7XG5cdH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVzb2x2ZXJzLnRzXG4gKiovIiwiLypcbiAqXHREcm9wZG93biBjbGFzcy4gTWFuYWdlcyB0aGUgZHJvcGRvd24gZHJhd2luZ1xuICovXG5leHBvcnQgY2xhc3MgRHJvcGRvd24ge1xuXHRwcm90ZWN0ZWQgXyRlbDpKUXVlcnk7XG5cdHByb3RlY3RlZCBfZGQ6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgc2hvd246Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgaXRlbXM6YW55W10gPSBbXTtcblx0cHJvdGVjdGVkIGZvcm1hdEl0ZW06RnVuY3Rpb247XG5cdHByb3RlY3RlZCBzZWFyY2hUZXh0OnN0cmluZztcblx0cHJvdGVjdGVkIGF1dG9TZWxlY3Q6Ym9vbGVhbjtcblx0cHJvdGVjdGVkIG1vdXNlb3Zlcjpib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yKGU6SlF1ZXJ5LCBmb3JtYXRJdGVtQ2JrOkZ1bmN0aW9uLCBhdXRvU2VsZWN0OmJvb2xlYW4pIHtcblx0XHR0aGlzLl8kZWwgPSBlO1xuXHRcdHRoaXMuZm9ybWF0SXRlbSA9IGZvcm1hdEl0ZW1DYms7XG5cdFx0dGhpcy5hdXRvU2VsZWN0ID0gYXV0b1NlbGVjdDtcblx0XHRcblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXHRcblx0cHJvdGVjdGVkIGluaXQoKTp2b2lkIHtcblx0XHQvLyBJbml0aWFsaXplIGRyb3Bkb3duXG5cdFx0bGV0IHBvczphbnkgPSAkLmV4dGVuZCh7fSwgdGhpcy5fJGVsLnBvc2l0aW9uKCksIHtcbiAgICAgICAgXHRcdFx0XHRoZWlnaHQ6IHRoaXMuXyRlbFswXS5vZmZzZXRIZWlnaHRcbiAgICBcdFx0XHRcdH0pO1xuXHRcdFxuXHRcdC8vIGNyZWF0ZSBlbGVtZW50XG5cdFx0dGhpcy5fZGQgPSAkKCc8dWwgLz4nKTtcblx0XHQvLyBhZGQgb3VyIGNsYXNzIGFuZCBiYXNpYyBkcm9wZG93bi1tZW51IGNsYXNzXG5cdFx0dGhpcy5fZGQuYWRkQ2xhc3MoJ2Jvb3RzdHJhcC1hdXRvY29tcGxldGUgZHJvcGRvd24tbWVudScpO1xuXG5cdFx0dGhpcy5fZGQuaW5zZXJ0QWZ0ZXIodGhpcy5fJGVsKTtcblx0XHR0aGlzLl9kZC5jc3MoeyBsZWZ0OiBwb3MubGVmdCwgd2lkdGg6IHRoaXMuXyRlbC5vdXRlcldpZHRoKCkgfSk7XG5cdFx0XG5cdFx0Ly8gY2xpY2sgZXZlbnQgb24gaXRlbXNcblx0XHR0aGlzLl9kZC5vbignY2xpY2snLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2xpY2tlZCcsIGV2dC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdC8vY29uc29sZS5sb2coJChldnQuY3VycmVudFRhcmdldCkpO1xuXHRcdFx0bGV0IGl0ZW06YW55ID0gJChldnQuY3VycmVudFRhcmdldCkuZGF0YSgnaXRlbScpO1xuXHRcdFx0dGhpcy5pdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtKTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLl9kZC5vbigna2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0Ncblx0XHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5fJGVsLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kZC5vbignbW91c2VlbnRlcicsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3VsJykuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0JChldnQuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0dGhpcy5tb3VzZW92ZXIgPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlbGVhdmUnLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLm1vdXNlb3ZlciA9IGZhbHNlO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XG5cdH1cblxuXHRnZXQgaXNNb3VzZU92ZXIoKTpib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5tb3VzZW92ZXI7XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNOZXh0SXRlbShyZXZlcnNlZD86Ym9vbGVhbikge1xuXHRcdC8vIGdldCBzZWxlY3RlZFxuXHRcdGxldCBjdXJyRWxlbTpKUXVlcnkgPSB0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKTtcblx0XHRsZXQgbmV4dEVsZW06SlF1ZXJ5ID0gcmV2ZXJzZWQgPyBjdXJyRWxlbS5wcmV2KCkgOiBjdXJyRWxlbS5uZXh0KCk7XG5cblx0XHRpZiAobmV4dEVsZW0ubGVuZ3RoID09IDApIHtcblx0XHRcdC8vIGZpcnN0IFxuXHRcdFx0bmV4dEVsZW0gPSByZXZlcnNlZCA/IHRoaXMuX2RkLmZpbmQoJ2xpJykubGFzdCgpIDogdGhpcy5fZGQuZmluZCgnbGknKS5maXJzdCgpO1xuXHRcdH1cblx0XHRcblx0XHRjdXJyRWxlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0bmV4dEVsZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHR9XG5cblx0cHVibGljIGZvY3VzUHJldmlvdXNJdGVtKCkge1xuXHRcdHRoaXMuZm9jdXNOZXh0SXRlbSh0cnVlKTtcblx0fVxuXG5cdHB1YmxpYyBmb2N1c0l0ZW0oaW5kZXg6bnVtYmVyKSB7XG5cdFx0Ly8gRm9jdXMgYW4gaXRlbSBpbiB0aGUgbGlzdFxuXHRcdGlmICh0aGlzLnNob3duICYmICh0aGlzLml0ZW1zLmxlbmd0aCA+IGluZGV4KSlcblx0XHRcdHRoaXMuX2RkLmZpbmQoJ2xpJykuZXEoaW5kZXgpLmZpbmQoJ2EnKS5mb2N1cygpO1xuXHR9XG5cdFxuXHRwdWJsaWMgc2VsZWN0Rm9jdXNJdGVtKCkge1xuXHRcdHRoaXMuX2RkLmZpbmQoJ2xpLmFjdGl2ZScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdH1cblxuXHRnZXQgaXNJdGVtRm9jdXNlZCgpOmJvb2xlYW4ge1xuXHRcdGlmICh0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHVibGljIHNob3coKTp2b2lkIHtcblx0XHRpZiAoIXRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuc2hvdygpO1xuXHRcdFx0dGhpcy5zaG93biA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGlzU2hvd24oKTpib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5zaG93bjtcblx0fVxuXG5cdHB1YmxpYyBoaWRlKCk6dm9pZCB7XG5cdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuaGlkZSgpO1xuXHRcdFx0dGhpcy5zaG93biA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVJdGVtcyhpdGVtczphbnlbXSwgc2VhcmNoVGV4dDpzdHJpbmcpIHtcblx0XHQvLyBjb25zb2xlLmxvZygndXBkYXRlSXRlbXMnLCBpdGVtcyk7XG5cdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xuXHRcdHRoaXMuc2VhcmNoVGV4dCA9IHNlYXJjaFRleHQ7XG5cdFx0dGhpcy5yZWZyZXNoSXRlbUxpc3QoKTtcblx0fVxuXG5cdHByaXZhdGUgc2hvd01hdGNoZWRUZXh0KHRleHQ6c3RyaW5nLCBxcnk6c3RyaW5nKTpzdHJpbmcge1xuXHRcdGxldCBzdGFydEluZGV4Om51bWJlciA9IHRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHFyeS50b0xvd2VyQ2FzZSgpKTtcblx0XHRpZiAoc3RhcnRJbmRleCA+IC0xKSB7XG5cdFx0XHRsZXQgZW5kSW5kZXg6bnVtYmVyID0gc3RhcnRJbmRleCArIHFyeS5sZW5ndGg7XG5cblx0XHRcdHJldHVybiB0ZXh0LnNsaWNlKDAsIHN0YXJ0SW5kZXgpICsgJzxiPicgXG5cdFx0XHRcdCsgdGV4dC5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCkgKyAnPC9iPidcblx0XHRcdFx0KyB0ZXh0LnNsaWNlKGVuZEluZGV4KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRleHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVmcmVzaEl0ZW1MaXN0KCkge1xuXHRcdHRoaXMuX2RkLmVtcHR5KCk7XG5cdFx0bGV0IGxpTGlzdDpKUXVlcnlbXSA9IFtdO1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGxldCBpdGVtRm9ybWF0dGVkOmFueSA9IHRoaXMuZm9ybWF0SXRlbShpdGVtKTtcblx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0aXRlbUZvcm1hdHRlZCA9IHsgdGV4dDogaXRlbUZvcm1hdHRlZCB9XG5cdFx0XHR9XG5cdFx0XHRsZXQgaXRlbVRleHQ6c3RyaW5nO1xuXHRcdFx0bGV0IGl0ZW1IdG1sOmFueTtcblxuXHRcdFx0aXRlbVRleHQgPSB0aGlzLnNob3dNYXRjaGVkVGV4dChpdGVtRm9ybWF0dGVkLnRleHQsIHRoaXMuc2VhcmNoVGV4dCk7XG5cdFx0XHRpZiAoIGl0ZW1Gb3JtYXR0ZWQuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1Gb3JtYXR0ZWQuaHRtbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGl0ZW1IdG1sID0gaXRlbVRleHQ7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLmh0bWwoaXRlbUh0bWwpXG5cdFx0XHQpXG5cdFx0XHQuZGF0YSgnaXRlbScsIGl0ZW0pO1xuXHRcdFx0XG5cdFx0XHRsaUxpc3QucHVzaChsaSk7XG5cdFx0fSk7XG5cdFx0IFxuXHRcdHRoaXMuX2RkLmFwcGVuZChsaUxpc3QpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGl0ZW1TZWxlY3RlZExhdW5jaEV2ZW50KGl0ZW06YW55KTp2b2lkIHtcblx0XHQvLyBsYXVuY2ggc2VsZWN0ZWQgZXZlbnRcblx0XHQvLyBjb25zb2xlLmxvZygnaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQnLCBpdGVtKTtcblx0XHR0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIGl0ZW0pXG5cdH1cblxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Ryb3Bkb3duLnRzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==