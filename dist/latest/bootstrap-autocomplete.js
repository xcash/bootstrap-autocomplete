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
	                noResultsText: 'No results',
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
	            if (this._$el.data('noresults-text')) {
	                s['noResultsText'] = this._$el.data('noresults-text');
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
	            searchField.attr('disabled', this._$el.attr('disabled'));
	            searchField.attr('placeholder', this._$el.attr('placeholder'));
	            searchField.attr('autocomplete', 'off');
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
	            this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText);
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
	                        evt.stopPropagation();
	                        evt.preventDefault();
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
	    function Dropdown(e, formatItemCbk, autoSelect, noResultsText) {
	        this.initialized = false;
	        this.shown = false;
	        this.items = [];
	        this._$el = e;
	        this.formatItem = formatItemCbk;
	        this.autoSelect = autoSelect;
	        this.noResultsText = noResultsText;
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
	            if (_this.haveResults) {
	                $(evt.currentTarget).closest('ul').find('li.active').removeClass('active');
	                $(evt.currentTarget).addClass('active');
	                _this.mouseover = true;
	            }
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
	    Object.defineProperty(Dropdown.prototype, "haveResults", {
	        get: function () {
	            return (this.items.length > 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.focusNextItem = function (reversed) {
	        if (this.haveResults) {
	            // get selected
	            var currElem = this._dd.find('li.active');
	            var nextElem = reversed ? currElem.prev() : currElem.next();
	            if (nextElem.length == 0) {
	                // first 
	                nextElem = reversed ? this._dd.find('li').last() : this._dd.find('li').first();
	            }
	            currElem.removeClass('active');
	            nextElem.addClass('active');
	        }
	    };
	    Dropdown.prototype.focusPreviousItem = function () {
	        this.focusNextItem(true);
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
	        if (this.items.length > 0) {
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
	        }
	        else {
	            // No results
	            var li = $('<li >');
	            li.append($('<a>').attr('href', '#').html(this.noResultsText))
	                .addClass('disabled');
	            liList.push(li);
	        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmY1ZGY1ZTliNTc1MzkyNDhiZWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQTZUcEI7QUE3VEQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQWlDRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQTFCaEMsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsaUJBQVksR0FBVSxJQUFJLENBQUM7YUFDM0IscUJBQWdCLEdBQVcsS0FBSyxDQUFDO2FBR2pDLGNBQVMsR0FBRztpQkFDbEIsUUFBUSxFQUFVLE1BQU07aUJBQ3hCLGdCQUFnQixFQUFPLEVBQUU7aUJBQ3pCLFNBQVMsRUFBVSxDQUFDO2lCQUNwQixRQUFRLEVBQVUsT0FBTztpQkFDekIsWUFBWSxFQUFZLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2hELFVBQVUsRUFBVyxJQUFJO2lCQUN6QixhQUFhLEVBQVUsWUFBWTtpQkFDbkMsTUFBTSxFQUFFO3FCQUNOLEtBQUssRUFBWSxJQUFJO3FCQUNyQixTQUFTLEVBQVksSUFBSTtxQkFDekIsTUFBTSxFQUFZLElBQUk7cUJBQ3RCLFVB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ZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBiZjVkZjVlOWI1NzUzOTI0OGJlYlxuICoqLyIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGJvb3RzdHJhcC1hdXRvY29tcGxldGUuanMgdjAuMC4xXG4gKiBodHRwczovL2dpdGh1Yi5jb20veGNhc2gvYm9vdHN0cmFwLWF1dG9jb21wbGV0ZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogRm9ya2VkIGZyb20gYm9vdHN0cmFwMy10eXBlYWhlYWQuanMgdjMuMS4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYmFzc2pvYnNlbi9Cb290c3RyYXAtMy1UeXBlYWhlYWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE9yaWdpbmFsIHdyaXR0ZW4gYnkgQG1kbyBhbmQgQGZhdFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTYgUGFvbG8gQ2FzY2llbGxvIEB4Y2FzaDY2NiBhbmQgY29udHJpYnV0b3JzXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlICh0aGUgJ0xpY2Vuc2UnKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuaW1wb3J0IHsgQWpheFJlc29sdmVyIH0gZnJvbSAnLi9yZXNvbHZlcnMnO1xuaW1wb3J0IHsgRHJvcGRvd24gfSBmcm9tICcuL2Ryb3Bkb3duJztcblxubW9kdWxlIEF1dG9Db21wbGV0ZU5TIHtcbiAgZXhwb3J0IGNsYXNzIEF1dG9Db21wbGV0ZSB7XG4gICAgcHVibGljIHN0YXRpYyBOQU1FOnN0cmluZyA9ICdhdXRvQ29tcGxldGUnO1xuXG4gICAgcHJpdmF0ZSBfZWw6RWxlbWVudDtcbiAgICBwcml2YXRlIF8kZWw6SlF1ZXJ5O1xuICAgIHByaXZhdGUgX2RkOkRyb3Bkb3duO1xuICAgIHByaXZhdGUgX3NlYXJjaFRleHQ6c3RyaW5nO1xuICAgIHByaXZhdGUgX3NlbGVjdGVkSXRlbTphbnkgPSBudWxsO1xuICAgIHByaXZhdGUgX2RlZmF1bHRWYWx1ZTphbnkgPSBudWxsO1xuICAgIHByaXZhdGUgX2RlZmF1bHRUZXh0OnN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBfaXNTZWxlY3RFbGVtZW50OmJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9zZWxlY3RIaWRkZW5GaWVsZDpKUXVlcnk7XG5cbiAgICBwcml2YXRlIF9zZXR0aW5ncyA9IHtcbiAgICAgIHJlc29sdmVyOjxzdHJpbmc+ICdhamF4JyxcbiAgICAgIHJlc29sdmVyU2V0dGluZ3M6PGFueT4ge30sXG4gICAgICBtaW5MZW5ndGg6PG51bWJlcj4gMyxcbiAgICAgIHZhbHVlS2V5OjxzdHJpbmc+ICd2YWx1ZScsXG4gICAgICBmb3JtYXRSZXN1bHQ6PEZ1bmN0aW9uPiB0aGlzLmRlZmF1bHRGb3JtYXRSZXN1bHQsXG4gICAgICBhdXRvU2VsZWN0Ojxib29sZWFuPiB0cnVlLFxuICAgICAgbm9SZXN1bHRzVGV4dDo8c3RyaW5nPiAnTm8gcmVzdWx0cycsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgdHlwZWQ6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWFyY2hQcmU6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWFyY2g6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWFyY2hQb3N0OjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VsZWN0OjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgZm9jdXM6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHJlc29sdmVyO1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDpFbGVtZW50LCBvcHRpb25zPzp7fSkge1xuICAgICAgdGhpcy5fZWwgPSBlbGVtZW50O1xuICAgICAgdGhpcy5fJGVsID0gJCh0aGlzLl9lbCk7XG4gICAgICAvLyBlbGVtZW50IHR5cGVcbiAgICAgIGlmICh0aGlzLl8kZWwuaXMoJ3NlbGVjdCcpKSB7XG4gICAgICAgIHRoaXMuX2lzU2VsZWN0RWxlbWVudCA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBpbmxpbmUgZGF0YSBhdHRyaWJ1dGVzXG4gICAgICB0aGlzLm1hbmFnZUlubGluZURhdGFBdHRyaWJ1dGVzKCk7XG4gICAgICAvLyBjb25zdHJ1Y3RvciBvcHRpb25zXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZ2V0U2V0dGluZ3MoKSwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuY29udmVydFNlbGVjdFRvVGV4dCgpO1xuICAgICAgfSBcbiAgICAgIFxuICAgICAgLy8gY29uc29sZS5sb2coJ2luaXRpYWxpemluZycsIHRoaXMuX3NldHRpbmdzKTtcbiAgICAgIFxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYW5hZ2VJbmxpbmVEYXRhQXR0cmlidXRlcygpIHtcbiAgICAgIC8vIHVwZGF0ZXMgc2V0dGluZ3Mgd2l0aCBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgbGV0IHMgPSB0aGlzLmdldFNldHRpbmdzKCk7XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ3VybCcpKSB7XG4gICAgICAgIHNbJ3Jlc29sdmVyU2V0dGluZ3MnXS51cmwgPSB0aGlzLl8kZWwuZGF0YSgndXJsJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdmFsdWUnKSkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0VmFsdWUgPSB0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC12YWx1ZScpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXRleHQnKSkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0VGV4dCA9IHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXRleHQnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnbm9yZXN1bHRzLXRleHQnKSkge1xuICAgICAgICBzWydub1Jlc3VsdHNUZXh0J10gPSB0aGlzLl8kZWwuZGF0YSgnbm9yZXN1bHRzLXRleHQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNldHRpbmdzKCk6e30ge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29udmVydFNlbGVjdFRvVGV4dCgpIHtcbiAgICAgIC8vIGNyZWF0ZSBoaWRkZW4gZmllbGRcblxuICAgICAgbGV0IGhpZEZpZWxkOkpRdWVyeSA9ICQoJzxpbnB1dD4nKTtcbiAgICAgIGhpZEZpZWxkLmF0dHIoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICBoaWRGaWVsZC5hdHRyKCduYW1lJywgdGhpcy5fJGVsLmF0dHIoJ25hbWUnKSk7XG4gICAgICBpZiAodGhpcy5fZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIGhpZEZpZWxkLnZhbCh0aGlzLl9kZWZhdWx0VmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQgPSBoaWRGaWVsZDtcbiAgICAgIFxuICAgICAgaGlkRmllbGQuaW5zZXJ0QWZ0ZXIodGhpcy5fJGVsKTtcblxuICAgICAgLy8gY3JlYXRlIHNlYXJjaCBpbnB1dCBlbGVtZW50XG4gICAgICBsZXQgc2VhcmNoRmllbGQ6SlF1ZXJ5ID0gJCgnPGlucHV0PicpO1xuICAgICAgLy8gY29weSBhbGwgYXR0cmlidXRlc1xuICAgICAgc2VhcmNoRmllbGQuYXR0cigndHlwZScsICd0ZXh0Jyk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCduYW1lJywgdGhpcy5fJGVsLmF0dHIoJ25hbWUnKSArICdfdGV4dCcpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignaWQnLCB0aGlzLl8kZWwuYXR0cignaWQnKSk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdkaXNhYmxlZCcsIHRoaXMuXyRlbC5hdHRyKCdkaXNhYmxlZCcpKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ3BsYWNlaG9sZGVyJywgdGhpcy5fJGVsLmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignYXV0b2NvbXBsZXRlJywgJ29mZicpO1xuICAgICAgc2VhcmNoRmllbGQuYWRkQ2xhc3ModGhpcy5fJGVsLmF0dHIoJ2NsYXNzJykpO1xuICAgICAgaWYgKHRoaXMuX2RlZmF1bHRUZXh0KSB7XG4gICAgICAgIHNlYXJjaEZpZWxkLnZhbCh0aGlzLl9kZWZhdWx0VGV4dCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIGF0dGFjaCBjbGFzc1xuICAgICAgc2VhcmNoRmllbGQuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSwgdGhpcyk7XG5cbiAgICAgIC8vIHJlcGxhY2Ugb3JpZ2luYWwgd2l0aCBzZWFyY2hGaWVsZFxuICAgICAgdGhpcy5fJGVsLnJlcGxhY2VXaXRoKHNlYXJjaEZpZWxkKTtcbiAgICAgIHRoaXMuXyRlbCA9IHNlYXJjaEZpZWxkO1xuICAgICAgdGhpcy5fZWwgPSBzZWFyY2hGaWVsZC5nZXQoMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoKTp2b2lkIHtcbiAgICAgIC8vIGJpbmQgZGVmYXVsdCBldmVudHNcbiAgICAgIHRoaXMuYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpO1xuICAgICAgLy8gUkVTT0xWRVJcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZXNvbHZlciA9PT0gJ2FqYXgnKSB7XG4gICAgICAgIC8vIGNvbmZpZ3VyZSBkZWZhdWx0IHJlc29sdmVyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSBuZXcgQWpheFJlc29sdmVyKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyU2V0dGluZ3MpO1xuICAgICAgfVxuICAgICAgLy8gRHJvcGRvd25cbiAgICAgIHRoaXMuX2RkID0gbmV3IERyb3Bkb3duKHRoaXMuXyRlbCwgdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QsIHRoaXMuX3NldHRpbmdzLm5vUmVzdWx0c1RleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpOnZvaWQge1xuICAgICAgdGhpcy5fJGVsLm9uKCdrZXlkb3duJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgOTogLy8gVEFCXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuYXV0b1NlbGVjdCkge1xuICAgICAgICAgICAgICAvLyBpZiBhdXRvU2VsZWN0IGVuYWJsZWQgc2VsZWN0cyBvbiBibHVyIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbVxuICAgICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5fJGVsLm9uKCdmb2N1cyBrZXl1cCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcbiAgICAgICAgLy8gY2hlY2sga2V5XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG4gICAgICAgICAgY2FzZSAxNjogLy8gc2hpZnRcbiAgICAgICAgICBjYXNlIDE3OiAvLyBjdHJsXG4gICAgICAgICAgY2FzZSAxODogLy8gYWx0XG4gICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgICBjYXNlIDM3OiAvLyBsZWZ0IFxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHRcdC8vIGFycm93IERPV05cbiAgICAgICAgICAgIHRoaXMuX2RkLmZvY3VzTmV4dEl0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c1ByZXZpb3VzSXRlbSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMzogLy8gRU5URVJcbiAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG4gICAgICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5fJGVsLnZhbCgpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVyVHlwZWQobmV3VmFsdWUpO1xuXHRcdFx0XHR9XG4gICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuXyRlbC5vbignYmx1cicsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZXZ0KTtcbiAgICAgICAgaWYgKCF0aGlzLl9kZC5pc01vdXNlT3Zlcikge1xuXG4gICAgICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICAgICAgLy8gaWYgaXQncyBhIHNlbGVjdCBlbGVtZW50IHlvdSBtdXN0XG4gICAgICAgICAgICBpZiAodGhpcy5fZGQuaXNJdGVtRm9jdXNlZCkge1xuICAgICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICh0aGlzLl9zZWxlY3RlZEl0ZW0gIT09IG51bGwpICYmICh0aGlzLl8kZWwudmFsKCkgIT09ICcnKSApIHtcbiAgICAgICAgICAgICAgLy8gcmVzZWxlY3QgaXRcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCB0aGlzLl9zZWxlY3RlZEl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKHRoaXMuXyRlbC52YWwoKSAhPT0gJycpICYmICh0aGlzLl9kZWZhdWx0VmFsdWUgIT09IG51bGwpICkge1xuICAgICAgICAgICAgICAvLyBzZWxlY3QgRGVmYXVsdFxuICAgICAgICAgICAgICB0aGlzLl8kZWwudmFsKHRoaXMuX2RlZmF1bHRUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQudmFsKHRoaXMuX2RlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBlbXB0eSB0aGUgdmFsdWVzXG4gICAgICAgICAgICAgIHRoaXMuXyRlbC52YWwoJycpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwoJycpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHNlbGVjdGVkIGV2ZW50XG4gICAgICB0aGlzLl8kZWwub24oJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCBpdGVtOmFueSkgPT4ge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgICAgICB0aGlzLml0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW0pO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBoYW5kbGVyVHlwZWQobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGZpZWxkIHZhbHVlIGNoYW5nZWRcblxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy50eXBlZCAhPT0gbnVsbCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy50eXBlZChuZXdWYWx1ZSk7XG4gICAgICAgIGlmICghbmV3VmFsdWUpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB2YWx1ZSA+PSBtaW5MZW5ndGgsIHN0YXJ0IGF1dG9jb21wbGV0ZVxuICAgICAgaWYgKG5ld1ZhbHVlLmxlbmd0aCA+PSB0aGlzLl9zZXR0aW5ncy5taW5MZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fc2VhcmNoVGV4dCA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLmhhbmRsZXJQcmVTZWFyY2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJQcmVTZWFyY2goKTp2b2lkIHtcbiAgICAgIC8vIGRvIG5vdGhpbmcsIHN0YXJ0IHNlYXJjaFxuICAgICAgXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFByZSAhPT0gbnVsbCkge1xuICAgICAgICBsZXQgbmV3VmFsdWU6c3RyaW5nID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFByZSh0aGlzLl9zZWFyY2hUZXh0KTtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3NlYXJjaFRleHQgPSBuZXdWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVyRG9TZWFyY2goKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJEb1NlYXJjaCgpOnZvaWQge1xuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2ggIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaCh0aGlzLl9zZWFyY2hUZXh0LCAocmVzdWx0czphbnkpID0+IHtcbiAgICAgICAgICB0aGlzLnBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEZWZhdWx0IGJlaGF2aW91clxuICAgICAgICAvLyBzZWFyY2ggdXNpbmcgY3VycmVudCByZXNvbHZlclxuICAgICAgICBpZiAodGhpcy5yZXNvbHZlcikge1xuICAgICAgICAgIHRoaXMucmVzb2x2ZXIuc2VhcmNoKHRoaXMuX3NlYXJjaFRleHQsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0cyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2sgY2FsbGVkJywgcmVzdWx0cyk7XG4gICAgICBcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUG9zdCkge1xuICAgICAgICByZXN1bHRzID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFBvc3QocmVzdWx0cyk7XG4gICAgICAgIGlmICggKHR5cGVvZiByZXN1bHRzID09PSAnYm9vbGVhbicpICYmICFyZXN1bHRzKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVyU3RhcnRTaG93KHJlc3VsdHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlclN0YXJ0U2hvdyhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImRlZmF1bHRFdmVudFN0YXJ0U2hvd1wiLCByZXN1bHRzKTtcbiAgICAgIC8vIGZvciBldmVyeSByZXN1bHQsIGRyYXcgaXRcbiAgICAgIHRoaXMuX2RkLnVwZGF0ZUl0ZW1zKHJlc3VsdHMsIHRoaXMuX3NlYXJjaFRleHQpO1xuICAgICAgdGhpcy5fZGQuc2hvdygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihpdGVtOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXInLCBpdGVtKTtcbiAgICAgIC8vIGRlZmF1bHQgYmVoYXZpb3VyIGlzIHNldCBlbG1lbnQncyAudmFsKClcbiAgICAgIGxldCBpdGVtRm9ybWF0dGVkOmFueSA9IHRoaXMuX3NldHRpbmdzLmZvcm1hdFJlc3VsdChpdGVtKTtcblx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0aXRlbUZvcm1hdHRlZCA9IHsgdGV4dDogaXRlbUZvcm1hdHRlZCB9XG5cdFx0XHR9XG4gICAgICB0aGlzLl8kZWwudmFsKGl0ZW1Gb3JtYXR0ZWQudGV4dCk7XG4gICAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhIHNlbGVjdFxuICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwoaXRlbUZvcm1hdHRlZC52YWx1ZSk7XG4gICAgICB9XG4gICAgICAvLyBzYXZlIHNlbGVjdGVkIGl0ZW1cbiAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGl0ZW07XG4gICAgICAvLyBhbmQgaGlkZVxuICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEZvcm1hdFJlc3VsdChpdGVtOmFueSk6e30ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbSB9O1xuICAgICAgfSBlbHNlIGlmICggaXRlbS50ZXh0ICkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJldHVybiBhIHRvU3RyaW5nIG9mIHRoZSBpdGVtIGFzIGxhc3QgcmVzb3J0XG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ05vIGRlZmF1bHQgZm9ybWF0dGVyIGZvciBpdGVtJywgaXRlbSk7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0udG9TdHJpbmcoKSB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn1cblxuKGZ1bmN0aW9uKCQ6IEpRdWVyeVN0YXRpYywgd2luZG93OiBhbnksIGRvY3VtZW50OiBhbnkpIHtcbiAgJC5mbltBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRV0gPSBmdW5jdGlvbihvcHRpb25zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBsdWdpbkNsYXNzOkF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZTtcblxuICAgICAgcGx1Z2luQ2xhc3MgPSAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUpO1xuXG4gICAgICBpZiAoIXBsdWdpbkNsYXNzKSB7XG4gICAgICAgIHBsdWdpbkNsYXNzID0gbmV3IEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZSh0aGlzLCBvcHRpb25zKTsgXG4gICAgICAgICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSwgcGx1Z2luQ2xhc3MpO1xuICAgICAgfVxuXG5cbiAgICB9KTtcbiAgfTtcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbi8vIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXG4vLyAgICd1c2Ugc3RyaWN0JztcblxuLy8gICBmYWN0b3J5KGpRdWVyeSk7XG5cbi8vIH0odGhpcywgZnVuY3Rpb24gKCQpIHtcblxuLy8gICAndXNlIHN0cmljdCc7XG4vLyAgIC8vIGpzaGludCBsYXhjb21tYTogdHJ1ZVxuXG5cbi8vICAvKiBUWVBFQUhFQUQgUFVCTElDIENMQVNTIERFRklOSVRJT05cbi8vICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICB2YXIgVHlwZWFoZWFkID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbi8vICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbi8vICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMsIG9wdGlvbnMpO1xuLy8gICAgIHRoaXMubWF0Y2hlciA9IHRoaXMub3B0aW9ucy5tYXRjaGVyIHx8IHRoaXMubWF0Y2hlcjtcbi8vICAgICB0aGlzLnNvcnRlciA9IHRoaXMub3B0aW9ucy5zb3J0ZXIgfHwgdGhpcy5zb3J0ZXI7XG4vLyAgICAgdGhpcy5zZWxlY3QgPSB0aGlzLm9wdGlvbnMuc2VsZWN0IHx8IHRoaXMuc2VsZWN0O1xuLy8gICAgIHRoaXMuYXV0b1NlbGVjdCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuYXV0b1NlbGVjdCA9PSAnYm9vbGVhbicgPyB0aGlzLm9wdGlvbnMuYXV0b1NlbGVjdCA6IHRydWU7XG4vLyAgICAgdGhpcy5oaWdobGlnaHRlciA9IHRoaXMub3B0aW9ucy5oaWdobGlnaHRlciB8fCB0aGlzLmhpZ2hsaWdodGVyO1xuLy8gICAgIHRoaXMucmVuZGVyID0gdGhpcy5vcHRpb25zLnJlbmRlciB8fCB0aGlzLnJlbmRlcjtcbi8vICAgICB0aGlzLnVwZGF0ZXIgPSB0aGlzLm9wdGlvbnMudXBkYXRlciB8fCB0aGlzLnVwZGF0ZXI7XG4vLyAgICAgdGhpcy5kaXNwbGF5VGV4dCA9IHRoaXMub3B0aW9ucy5kaXNwbGF5VGV4dCB8fCB0aGlzLmRpc3BsYXlUZXh0O1xuLy8gICAgIHRoaXMuc2VsZWN0ZWRUZXh0ID0gdGhpcy5vcHRpb25zLnNlbGVjdGVkVGV4dCB8fCB0aGlzLnNlbGVjdGVkVGV4dDtcbi8vICAgICB0aGlzLnNvdXJjZSA9IHRoaXMub3B0aW9ucy5zb3VyY2U7XG4vLyAgICAgdGhpcy5kZWxheSA9IHRoaXMub3B0aW9ucy5kZWxheTtcbi8vICAgICB0aGlzLiRtZW51ID0gJCh0aGlzLm9wdGlvbnMubWVudSk7XG4vLyAgICAgdGhpcy4kYXBwZW5kVG8gPSB0aGlzLm9wdGlvbnMuYXBwZW5kVG8gPyAkKHRoaXMub3B0aW9ucy5hcHBlbmRUbykgOiBudWxsO1xuLy8gICAgIHRoaXMuZml0VG9FbGVtZW50ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgPT0gJ2Jvb2xlYW4nID8gdGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA6IGZhbHNlO1xuLy8gICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbi8vICAgICB0aGlzLmxpc3RlbigpO1xuLy8gICAgIHRoaXMuc2hvd0hpbnRPbkZvY3VzID0gdHlwZW9mIHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT0gJ2Jvb2xlYW4nIHx8IHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT09IFwiYWxsXCIgPyB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzIDogZmFsc2U7XG4vLyAgICAgdGhpcy5hZnRlclNlbGVjdCA9IHRoaXMub3B0aW9ucy5hZnRlclNlbGVjdDtcbi8vICAgICB0aGlzLmFkZEl0ZW0gPSBmYWxzZTtcbi8vICAgICB0aGlzLnZhbHVlID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKTtcbi8vICAgfTtcbiAgXG4vLyAgIFR5cGVhaGVhZC5wcm90b3R5cGUgPSB7XG5cbi8vICAgICBjb25zdHJ1Y3RvcjogVHlwZWFoZWFkLFxuXG4vLyAgICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgdmFsID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykuZGF0YSgndmFsdWUnKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgdmFsKTtcbi8vICAgICAgIGlmICh0aGlzLmF1dG9TZWxlY3QgfHwgdmFsKSB7XG4vLyAgICAgICAgIHZhciBuZXdWYWwgPSB0aGlzLnVwZGF0ZXIodmFsKTtcbi8vICAgICAgICAgLy8gVXBkYXRlciBjYW4gYmUgc2V0IHRvIGFueSByYW5kb20gZnVuY3Rpb25zIHZpYSBcIm9wdGlvbnNcIiBwYXJhbWV0ZXIgaW4gY29uc3RydWN0b3IgYWJvdmUuXG4vLyAgICAgICAgIC8vIEFkZCBudWxsIGNoZWNrIGZvciBjYXNlcyB3aGVuIHVwZGF0ZXIgcmV0dXJucyB2b2lkIG9yIHVuZGVmaW5lZC5cbi8vICAgICAgICAgaWYgKCFuZXdWYWwpIHtcbi8vICAgICAgICAgICBuZXdWYWwgPSAnJztcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgc2VsZWN0ZWRWYWwgPSB0aGlzLnNlbGVjdGVkVGV4dChuZXdWYWwpO1xuLy8gICAgICAgICBpZiAoc2VsZWN0ZWRWYWwgIT09IGZhbHNlKSB7XG4vLyAgICAgICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAgICAgLnZhbChzZWxlY3RlZFZhbClcbi8vICAgICAgICAgICAgIC50ZXh0KHRoaXMuZGlzcGxheVRleHQobmV3VmFsKSB8fCBuZXdWYWwpXG4vLyAgICAgICAgICAgICAuY2hhbmdlKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdGhpcy5hZnRlclNlbGVjdChuZXdWYWwpO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIHNldFNvdXJjZTogZnVuY3Rpb24gKHNvdXJjZSkge1xuLy8gICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4vLyAgICAgfSxcblxuLy8gICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciBwb3MgPSAkLmV4dGVuZCh7fSwgdGhpcy4kZWxlbWVudC5wb3NpdGlvbigpLCB7XG4vLyAgICAgICAgIGhlaWdodDogdGhpcy4kZWxlbWVudFswXS5vZmZzZXRIZWlnaHRcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQgPT0gJ2Z1bmN0aW9uJyA/XG4vLyAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodC5jYWxsKCkgOlxuLy8gICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQ7XG5cbi8vICAgICAgIHZhciBlbGVtZW50O1xuLy8gICAgICAgaWYgKHRoaXMuc2hvd24pIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnU7XG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMuJGFwcGVuZFRvKSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51LmFwcGVuZFRvKHRoaXMuJGFwcGVuZFRvKTtcbi8vICAgICAgICAgdGhpcy5oYXNTYW1lUGFyZW50ID0gdGhpcy4kYXBwZW5kVG8uaXModGhpcy4kZWxlbWVudC5wYXJlbnQoKSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudS5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KTtcbi8vICAgICAgICAgdGhpcy5oYXNTYW1lUGFyZW50ID0gdHJ1ZTtcbi8vICAgICAgIH0gICAgICBcbiAgICAgIFxuLy8gICAgICAgaWYgKCF0aGlzLmhhc1NhbWVQYXJlbnQpIHtcbi8vICAgICAgICAgICAvLyBXZSBjYW5ub3QgcmVseSBvbiB0aGUgZWxlbWVudCBwb3NpdGlvbiwgbmVlZCB0byBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgd2luZG93XG4vLyAgICAgICAgICAgZWxlbWVudC5jc3MoXCJwb3NpdGlvblwiLCBcImZpeGVkXCIpO1xuLy8gICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpO1xuLy8gICAgICAgICAgIHBvcy50b3AgPSAgb2Zmc2V0LnRvcDtcbi8vICAgICAgICAgICBwb3MubGVmdCA9IG9mZnNldC5sZWZ0O1xuLy8gICAgICAgfVxuLy8gICAgICAgLy8gVGhlIHJ1bGVzIGZvciBib290c3RyYXAgYXJlOiAnZHJvcHVwJyBpbiB0aGUgcGFyZW50IGFuZCAnZHJvcGRvd24tbWVudS1yaWdodCcgaW4gdGhlIGVsZW1lbnQuXG4vLyAgICAgICAvLyBOb3RlIHRoYXQgdG8gZ2V0IHJpZ2h0IGFsaWdubWVudCwgeW91J2xsIG5lZWQgdG8gc3BlY2lmeSBgbWVudWAgaW4gdGhlIG9wdGlvbnMgdG8gYmU6XG4vLyAgICAgICAvLyAnPHVsIGNsYXNzPVwidHlwZWFoZWFkIGRyb3Bkb3duLW1lbnVcIiByb2xlPVwibGlzdGJveFwiPjwvdWw+J1xuLy8gICAgICAgdmFyIGRyb3B1cCA9ICQoZWxlbWVudCkucGFyZW50KCkuaGFzQ2xhc3MoJ2Ryb3B1cCcpO1xuLy8gICAgICAgdmFyIG5ld1RvcCA9IGRyb3B1cCA/ICdhdXRvJyA6IChwb3MudG9wICsgcG9zLmhlaWdodCArIHNjcm9sbEhlaWdodCk7XG4vLyAgICAgICB2YXIgcmlnaHQgPSAkKGVsZW1lbnQpLmhhc0NsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4vLyAgICAgICB2YXIgbmV3TGVmdCA9IHJpZ2h0ID8gJ2F1dG8nIDogcG9zLmxlZnQ7XG4vLyAgICAgICAvLyBpdCBzZWVtcyBsaWtlIHNldHRpbmcgdGhlIGNzcyBpcyBhIGJhZCBpZGVhIChqdXN0IGxldCBCb290c3RyYXAgZG8gaXQpLCBidXQgSSdsbCBrZWVwIHRoZSBvbGRcbi8vICAgICAgIC8vIGxvZ2ljIGluIHBsYWNlIGV4Y2VwdCBmb3IgdGhlIGRyb3B1cC9yaWdodC1hbGlnbiBjYXNlcy5cbi8vICAgICAgIGVsZW1lbnQuY3NzKHsgdG9wOiBuZXdUb3AsIGxlZnQ6IG5ld0xlZnQgfSkuc2hvdygpO1xuXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA9PT0gdHJ1ZSkge1xuLy8gICAgICAgICAgIGVsZW1lbnQuY3NzKFwid2lkdGhcIiwgdGhpcy4kZWxlbWVudC5vdXRlcldpZHRoKCkgKyBcInB4XCIpO1xuLy8gICAgICAgfVxuICAgIFxuLy8gICAgICAgdGhpcy5zaG93biA9IHRydWU7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kbWVudS5oaWRlKCk7XG4vLyAgICAgICB0aGlzLnNob3duID0gZmFsc2U7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgbG9va3VwOiBmdW5jdGlvbiAocXVlcnkpIHtcbi8vICAgICAgIHZhciBpdGVtcztcbi8vICAgICAgIGlmICh0eXBlb2YocXVlcnkpICE9ICd1bmRlZmluZWQnICYmIHF1ZXJ5ICE9PSBudWxsKSB7XG4vLyAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpIHx8ICcnO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAodGhpcy5xdWVyeS5sZW5ndGggPCB0aGlzLm9wdGlvbnMubWluTGVuZ3RoICYmICF0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnNob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB2YXIgd29ya2VyID0gJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cbi8vICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbih0aGlzLnNvdXJjZSkpIHtcbi8vICAgICAgICAgICB0aGlzLnNvdXJjZSh0aGlzLnF1ZXJ5LCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpO1xuLy8gICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc291cmNlKSB7XG4vLyAgICAgICAgICAgdGhpcy5wcm9jZXNzKHRoaXMuc291cmNlKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSwgdGhpcyk7XG5cbi8vICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmxvb2t1cFdvcmtlcik7XG4vLyAgICAgICB0aGlzLmxvb2t1cFdvcmtlciA9IHNldFRpbWVvdXQod29ya2VyLCB0aGlzLmRlbGF5KTtcbi8vICAgICB9LFxuXG4vLyAgICAgcHJvY2VzczogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbi8vICAgICAgIGl0ZW1zID0gJC5ncmVwKGl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgICByZXR1cm4gdGhhdC5tYXRjaGVyKGl0ZW0pO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGl0ZW1zID0gdGhpcy5zb3J0ZXIoaXRlbXMpO1xuXG4vLyAgICAgICBpZiAoIWl0ZW1zLmxlbmd0aCAmJiAhdGhpcy5vcHRpb25zLmFkZEl0ZW0pIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXM7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbXNbMF0pO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBudWxsKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgLy8gQWRkIGl0ZW1cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRkSXRlbSl7XG4vLyAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5vcHRpb25zLmFkZEl0ZW0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLml0ZW1zID09ICdhbGwnKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihpdGVtcykuc2hvdygpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zLnNsaWNlKDAsIHRoaXMub3B0aW9ucy5pdGVtcykpLnNob3coKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHZhciBpdCA9IHRoaXMuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICByZXR1cm4gfml0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgIH0sXG5cbi8vICAgICBzb3J0ZXI6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIGJlZ2luc3dpdGggPSBbXTtcbi8vICAgICAgIHZhciBjYXNlU2Vuc2l0aXZlID0gW107XG4vLyAgICAgICB2YXIgY2FzZUluc2Vuc2l0aXZlID0gW107XG4vLyAgICAgICB2YXIgaXRlbTtcblxuLy8gICAgICAgd2hpbGUgKChpdGVtID0gaXRlbXMuc2hpZnQoKSkpIHtcbi8vICAgICAgICAgdmFyIGl0ID0gdGhpcy5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgICAgaWYgKCFpdC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5xdWVyeS50b0xvd2VyQ2FzZSgpKSkgYmVnaW5zd2l0aC5wdXNoKGl0ZW0pO1xuLy8gICAgICAgICBlbHNlIGlmICh+aXQuaW5kZXhPZih0aGlzLnF1ZXJ5KSkgY2FzZVNlbnNpdGl2ZS5wdXNoKGl0ZW0pO1xuLy8gICAgICAgICBlbHNlIGNhc2VJbnNlbnNpdGl2ZS5wdXNoKGl0ZW0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gYmVnaW5zd2l0aC5jb25jYXQoY2FzZVNlbnNpdGl2ZSwgY2FzZUluc2Vuc2l0aXZlKTtcbi8vICAgICB9LFxuXG4vLyAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICB2YXIgaHRtbCA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4vLyAgICAgICB2YXIgcXVlcnkgPSB0aGlzLnF1ZXJ5O1xuLy8gICAgICAgdmFyIGkgPSBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICAgIHZhciBsZW4gPSBxdWVyeS5sZW5ndGg7XG4vLyAgICAgICB2YXIgbGVmdFBhcnQ7XG4vLyAgICAgICB2YXIgbWlkZGxlUGFydDtcbi8vICAgICAgIHZhciByaWdodFBhcnQ7XG4vLyAgICAgICB2YXIgc3Ryb25nO1xuLy8gICAgICAgaWYgKGxlbiA9PT0gMCkge1xuLy8gICAgICAgICByZXR1cm4gaHRtbC50ZXh0KGl0ZW0pLmh0bWwoKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHdoaWxlIChpID4gLTEpIHtcbi8vICAgICAgICAgbGVmdFBhcnQgPSBpdGVtLnN1YnN0cigwLCBpKTtcbi8vICAgICAgICAgbWlkZGxlUGFydCA9IGl0ZW0uc3Vic3RyKGksIGxlbik7XG4vLyAgICAgICAgIHJpZ2h0UGFydCA9IGl0ZW0uc3Vic3RyKGkgKyBsZW4pO1xuLy8gICAgICAgICBzdHJvbmcgPSAkKCc8c3Ryb25nPjwvc3Ryb25nPicpLnRleHQobWlkZGxlUGFydCk7XG4vLyAgICAgICAgIGh0bWxcbi8vICAgICAgICAgICAuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxlZnRQYXJ0KSlcbi8vICAgICAgICAgICAuYXBwZW5kKHN0cm9uZyk7XG4vLyAgICAgICAgIGl0ZW0gPSByaWdodFBhcnQ7XG4vLyAgICAgICAgIGkgPSBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBodG1sLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpdGVtKSkuaHRtbCgpO1xuLy8gICAgIH0sXG5cbi8vICAgICByZW5kZXI6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuLy8gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuLy8gICAgICAgdmFyIGFjdGl2ZUZvdW5kID0gZmFsc2U7XG4vLyAgICAgICB2YXIgZGF0YSA9IFtdO1xuLy8gICAgICAgdmFyIF9jYXRlZ29yeSA9IHRoYXQub3B0aW9ucy5zZXBhcmF0b3I7XG5cbi8vICAgICAgICQuZWFjaChpdGVtcywgZnVuY3Rpb24gKGtleSx2YWx1ZSkge1xuLy8gICAgICAgICAvLyBpbmplY3Qgc2VwYXJhdG9yXG4vLyAgICAgICAgIGlmIChrZXkgPiAwICYmIHZhbHVlW19jYXRlZ29yeV0gIT09IGl0ZW1zW2tleSAtIDFdW19jYXRlZ29yeV0pe1xuLy8gICAgICAgICAgIGRhdGEucHVzaCh7XG4vLyAgICAgICAgICAgICBfX3R5cGU6ICdkaXZpZGVyJ1xuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgLy8gaW5qZWN0IGNhdGVnb3J5IGhlYWRlclxuLy8gICAgICAgICBpZiAodmFsdWVbX2NhdGVnb3J5XSAmJiAoa2V5ID09PSAwIHx8IHZhbHVlW19jYXRlZ29yeV0gIT09IGl0ZW1zW2tleSAtIDFdW19jYXRlZ29yeV0pKXtcbi8vICAgICAgICAgICBkYXRhLnB1c2goe1xuLy8gICAgICAgICAgICAgX190eXBlOiAnY2F0ZWdvcnknLFxuLy8gICAgICAgICAgICAgbmFtZTogdmFsdWVbX2NhdGVnb3J5XVxuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIGRhdGEucHVzaCh2YWx1ZSk7XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaXRlbXMgPSAkKGRhdGEpLm1hcChmdW5jdGlvbiAoaSwgaXRlbSkge1xuLy8gICAgICAgICBpZiAoKGl0ZW0uX190eXBlIHx8IGZhbHNlKSA9PSAnY2F0ZWdvcnknKXtcbi8vICAgICAgICAgICByZXR1cm4gJCh0aGF0Lm9wdGlvbnMuaGVhZGVySHRtbCkudGV4dChpdGVtLm5hbWUpWzBdO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgaWYgKChpdGVtLl9fdHlwZSB8fCBmYWxzZSkgPT0gJ2RpdmlkZXInKXtcbi8vICAgICAgICAgICByZXR1cm4gJCh0aGF0Lm9wdGlvbnMuaGVhZGVyRGl2aWRlcilbMF07XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICB2YXIgdGV4dCA9IHNlbGYuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICAgIGkgPSAkKHRoYXQub3B0aW9ucy5pdGVtKS5kYXRhKCd2YWx1ZScsIGl0ZW0pO1xuLy8gICAgICAgICBpLmZpbmQoJ2EnKS5odG1sKHRoYXQuaGlnaGxpZ2h0ZXIodGV4dCwgaXRlbSkpO1xuLy8gICAgICAgICBpZiAodGV4dCA9PSBzZWxmLiRlbGVtZW50LnZhbCgpKSB7XG4vLyAgICAgICAgICAgaS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAgICAgc2VsZi4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtKTtcbi8vICAgICAgICAgICBhY3RpdmVGb3VuZCA9IHRydWU7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgcmV0dXJuIGlbMF07XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCAmJiAhYWN0aXZlRm91bmQpIHtcbi8vICAgICAgICAgaXRlbXMuZmlsdGVyKCc6bm90KC5kcm9wZG93bi1oZWFkZXIpJykuZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbXMuZmlyc3QoKS5kYXRhKCd2YWx1ZScpKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHRoaXMuJG1lbnUuaHRtbChpdGVtcyk7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgZGlzcGxheVRleHQ6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpdGVtLm5hbWUgIT0gJ3VuZGVmaW5lZCcgJiYgaXRlbS5uYW1lIHx8IGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIHNlbGVjdGVkVGV4dDogZnVuY3Rpb24oaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaXRlbS5uYW1lICE9ICd1bmRlZmluZWQnICYmIGl0ZW0ubmFtZSB8fCBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBuZXh0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICB2YXIgbmV4dCA9IGFjdGl2ZS5uZXh0KCk7XG5cbi8vICAgICAgIGlmICghbmV4dC5sZW5ndGgpIHtcbi8vICAgICAgICAgbmV4dCA9ICQodGhpcy4kbWVudS5maW5kKCdsaScpWzBdKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgbmV4dC5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIHByZXY6IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgIHZhciBwcmV2ID0gYWN0aXZlLnByZXYoKTtcblxuLy8gICAgICAgaWYgKCFwcmV2Lmxlbmd0aCkge1xuLy8gICAgICAgICBwcmV2ID0gdGhpcy4kbWVudS5maW5kKCdsaScpLmxhc3QoKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcHJldi5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIGxpc3RlbjogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAub24oJ2ZvY3VzJywgICAgJC5wcm94eSh0aGlzLmZvY3VzLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdibHVyJywgICAgICQucHJveHkodGhpcy5ibHVyLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdrZXlwcmVzcycsICQucHJveHkodGhpcy5rZXlwcmVzcywgdGhpcykpXG4vLyAgICAgICAgIC5vbignaW5wdXQnLCAgICAkLnByb3h5KHRoaXMuaW5wdXQsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2tleXVwJywgICAgJC5wcm94eSh0aGlzLmtleXVwLCB0aGlzKSk7XG5cbi8vICAgICAgIGlmICh0aGlzLmV2ZW50U3VwcG9ydGVkKCdrZXlkb3duJykpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bicsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHRoaXMuJG1lbnVcbi8vICAgICAgICAgLm9uKCdjbGljaycsICQucHJveHkodGhpcy5jbGljaywgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2VlbnRlcicsICdsaScsICQucHJveHkodGhpcy5tb3VzZWVudGVyLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgJ2xpJywgJC5wcm94eSh0aGlzLm1vdXNlbGVhdmUsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlZG93bicsICQucHJveHkodGhpcy5tb3VzZWRvd24sdGhpcykpO1xuLy8gICAgIH0sXG5cbi8vICAgICBkZXN0cm95IDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCd0eXBlYWhlYWQnLG51bGwpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLG51bGwpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAub2ZmKCdmb2N1cycpXG4vLyAgICAgICAgIC5vZmYoJ2JsdXInKVxuLy8gICAgICAgICAub2ZmKCdrZXlwcmVzcycpXG4vLyAgICAgICAgIC5vZmYoJ2lucHV0Jylcbi8vICAgICAgICAgLm9mZigna2V5dXAnKTtcblxuLy8gICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5ZG93bicpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB0aGlzLiRtZW51LnJlbW92ZSgpO1xuLy8gICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuLy8gICAgIH0sXG5cbi8vICAgICBldmVudFN1cHBvcnRlZDogZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuLy8gICAgICAgdmFyIGlzU3VwcG9ydGVkID0gZXZlbnROYW1lIGluIHRoaXMuJGVsZW1lbnQ7XG4vLyAgICAgICBpZiAoIWlzU3VwcG9ydGVkKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuc2V0QXR0cmlidXRlKGV2ZW50TmFtZSwgJ3JldHVybjsnKTtcbi8vICAgICAgICAgaXNTdXBwb3J0ZWQgPSB0eXBlb2YgdGhpcy4kZWxlbWVudFtldmVudE5hbWVdID09PSAnZnVuY3Rpb24nO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIGlzU3VwcG9ydGVkO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3ZlOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG5cbi8vICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4vLyAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4vLyAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4vLyAgICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuLy8gICAgICAgICAgIC8vIHdpdGggdGhlIHNoaWZ0S2V5ICh0aGlzIGlzIGFjdHVhbGx5IHRoZSBsZWZ0IHBhcmVudGhlc2lzKVxuLy8gICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSByZXR1cm47XG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIHRoaXMucHJldigpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbi8vICAgICAgICAgICAvLyB3aXRoIHRoZSBzaGlmdEtleSAodGhpcyBpcyBhY3R1YWxseSB0aGUgcmlnaHQgcGFyZW50aGVzaXMpXG4vLyAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleWRvd246IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQgPSB+JC5pbkFycmF5KGUua2V5Q29kZSwgWzQwLDM4LDksMTMsMjddKTtcbi8vICAgICAgIGlmICghdGhpcy5zaG93biAmJiBlLmtleUNvZGUgPT0gNDApIHtcbi8vICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMubW92ZShlKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5cHJlc3M6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAodGhpcy5zdXBwcmVzc0tleVByZXNzUmVwZWF0KSByZXR1cm47XG4vLyAgICAgICB0aGlzLm1vdmUoZSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGlucHV0OiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgLy8gVGhpcyBpcyBhIGZpeGVkIGZvciBJRTEwLzExIHRoYXQgZmlyZXMgdGhlIGlucHV0IGV2ZW50IHdoZW4gYSBwbGFjZWhvZGVyIGlzIGNoYW5nZWRcbi8vICAgICAgIC8vIChodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzgxMDUzOC9pZS0xMS1maXJlcy1pbnB1dC1ldmVudC1vbi1mb2N1cylcbi8vICAgICAgIHZhciBjdXJyZW50VmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpO1xuLy8gICAgICAgaWYgKHRoaXMudmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xuLy8gICAgICAgICB0aGlzLnZhbHVlID0gY3VycmVudFZhbHVlO1xuLy8gICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXl1cDogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuLy8gICAgICAgICByZXR1cm47XG4vLyAgICAgICB9XG4vLyAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuLy8gICAgICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4vLyAgICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4vLyAgICAgICAgIGNhc2UgMTY6IC8vIHNoaWZ0XG4vLyAgICAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbi8vICAgICAgICAgY2FzZSAxODogLy8gYWx0XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSA5OiAvLyB0YWJcbi8vICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbi8vICAgICAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcbi8vICAgICAgICAgICB0aGlzLnNlbGVjdCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuLy8gICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuLy8gICAgICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgfVxuXG5cbi8vICAgICB9LFxuXG4vLyAgICAgZm9jdXM6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuLy8gICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuLy8gICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyAmJiB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgIT09IHRydWUpIHtcbi8vICAgICAgICAgICBpZih0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09PSBcImFsbFwiKSB7XG4vLyAgICAgICAgICAgICB0aGlzLmxvb2t1cChcIlwiKTsgXG4vLyAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgICBpZiAodGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzKSB7XG4vLyAgICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IGZhbHNlO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBibHVyOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLm1vdXNlZG92ZXIgJiYgIXRoaXMubW91c2VkZG93biAmJiB0aGlzLnNob3duKSB7XG4vLyAgICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb3VzZWRkb3duKSB7XG4vLyAgICAgICAgIC8vIFRoaXMgaXMgZm9yIElFIHRoYXQgYmx1cnMgdGhlIGlucHV0IHdoZW4gdXNlciBjbGlja3Mgb24gc2Nyb2xsLlxuLy8gICAgICAgICAvLyBXZSBzZXQgdGhlIGZvY3VzIGJhY2sgb24gdGhlIGlucHV0IGFuZCBwcmV2ZW50IHRoZSBsb29rdXAgdG8gb2NjdXIgYWdhaW5cbi8vICAgICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gdHJ1ZTtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5mb2N1cygpO1xuLy8gICAgICAgICB0aGlzLm1vdXNlZGRvd24gPSBmYWxzZTtcbi8vICAgICAgIH0gXG4vLyAgICAgfSxcblxuLy8gICAgIGNsaWNrOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuc2VsZWN0KCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKCk7XG4vLyAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2Vkb3ZlciA9IHRydWU7XG4vLyAgICAgICB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3VzZWxlYXZlOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRvdmVyID0gZmFsc2U7XG4vLyAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCAmJiB0aGlzLnNob3duKSB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAvKipcbi8vICAgICAgKiBXZSB0cmFjayB0aGUgbW91c2Vkb3duIGZvciBJRS4gV2hlbiBjbGlja2luZyBvbiB0aGUgbWVudSBzY3JvbGxiYXIsIElFIG1ha2VzIHRoZSBpbnB1dCBibHVyIHRodXMgaGlkaW5nIHRoZSBtZW51LlxuLy8gICAgICAqL1xuLy8gICAgIG1vdXNlZG93bjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2VkZG93biA9IHRydWU7XG4vLyAgICAgICB0aGlzLiRtZW51Lm9uZShcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSl7XG4vLyAgICAgICAgIC8vIElFIHdvbid0IGZpcmUgdGhpcywgYnV0IEZGIGFuZCBDaHJvbWUgd2lsbCBzbyB3ZSByZXNldCBvdXIgZmxhZyBmb3IgdGhlbSBoZXJlXG4vLyAgICAgICAgIHRoaXMubW91c2VkZG93biA9IGZhbHNlO1xuLy8gICAgICAgfS5iaW5kKHRoaXMpKTtcbi8vICAgICB9LFxuXG4vLyAgIH07XG5cblxuLy8gICAvKiBUWVBFQUhFQUQgUExVR0lOIERFRklOSVRJT05cbi8vICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgdmFyIG9sZCA9ICQuZm4udHlwZWFoZWFkO1xuXG4vLyAgICQuZm4udHlwZWFoZWFkID0gZnVuY3Rpb24gKG9wdGlvbikge1xuLy8gICAgIHZhciBhcmcgPSBhcmd1bWVudHM7XG4vLyAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgJiYgb3B0aW9uID09ICdnZXRBY3RpdmUnKSB7XG4vLyAgICAgICByZXR1cm4gdGhpcy5kYXRhKCdhY3RpdmUnKTtcbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuLy8gICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCd0eXBlYWhlYWQnKTtcbi8vICAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb247XG4vLyAgICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcsIChkYXRhID0gbmV3IFR5cGVhaGVhZCh0aGlzLCBvcHRpb25zKSkpO1xuLy8gICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgJiYgZGF0YVtvcHRpb25dKSB7XG4vLyAgICAgICAgIGlmIChhcmcubGVuZ3RoID4gMSkge1xuLy8gICAgICAgICAgIGRhdGFbb3B0aW9uXS5hcHBseShkYXRhLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmcsIDEpKTtcbi8vICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICBkYXRhW29wdGlvbl0oKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICB9O1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLmRlZmF1bHRzID0ge1xuLy8gICAgIHNvdXJjZTogW10sXG4vLyAgICAgaXRlbXM6IDgsXG4vLyAgICAgbWVudTogJzx1bCBjbGFzcz1cInR5cGVhaGVhZCBkcm9wZG93bi1tZW51XCIgcm9sZT1cImxpc3Rib3hcIj48L3VsPicsXG4vLyAgICAgaXRlbTogJzxsaT48YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiI1wiIHJvbGU9XCJvcHRpb25cIj48L2E+PC9saT4nLFxuLy8gICAgIG1pbkxlbmd0aDogMSxcbi8vICAgICBzY3JvbGxIZWlnaHQ6IDAsXG4vLyAgICAgYXV0b1NlbGVjdDogdHJ1ZSxcbi8vICAgICBhZnRlclNlbGVjdDogJC5ub29wLFxuLy8gICAgIGFkZEl0ZW06IGZhbHNlLFxuLy8gICAgIGRlbGF5OiAwLFxuLy8gICAgIHNlcGFyYXRvcjogJ2NhdGVnb3J5Jyxcbi8vICAgICBoZWFkZXJIdG1sOiAnPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCI+PC9saT4nLFxuLy8gICAgIGhlYWRlckRpdmlkZXI6ICc8bGkgY2xhc3M9XCJkaXZpZGVyXCIgcm9sZT1cInNlcGFyYXRvclwiPjwvbGk+J1xuLy8gICB9O1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLkNvbnN0cnVjdG9yID0gVHlwZWFoZWFkO1xuXG4vLyAgLyogVFlQRUFIRUFEIE5PIENPTkZMSUNUXG4vLyAgICogPT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4vLyAgICAgJC5mbi50eXBlYWhlYWQgPSBvbGQ7XG4vLyAgICAgcmV0dXJuIHRoaXM7XG4vLyAgIH07XG5cblxuLy8gIC8qIFRZUEVBSEVBRCBEQVRBLUFQSVxuLy8gICAqID09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgICQoZG9jdW1lbnQpLm9uKCdmb2N1cy50eXBlYWhlYWQuZGF0YS1hcGknLCAnW2RhdGEtcHJvdmlkZT1cInR5cGVhaGVhZFwiXScsIGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbi8vICAgICBpZiAoJHRoaXMuZGF0YSgndHlwZWFoZWFkJykpIHJldHVybjtcbi8vICAgICAkdGhpcy50eXBlYWhlYWQoJHRoaXMuZGF0YSgpKTtcbi8vICAgfSk7XG5cbi8vIH0pKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21haW4udHNcbiAqKi8iLCJcbmNsYXNzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCByZXN1bHRzOkFycmF5PE9iamVjdD47XG5cblx0cHJvdGVjdGVkIF9zZXR0aW5nczphbnk7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHR0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXRSZXN1bHRzKGxpbWl0PzpudW1iZXIsIHN0YXJ0PzpudW1iZXIsIGVuZD86bnVtYmVyKTpBcnJheTxPYmplY3Q+IHtcblx0XHRcblx0XHRyZXR1cm4gdGhpcy5yZXN1bHRzO1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRjYmsodGhpcy5nZXRSZXN1bHRzKCkpO1xuXHR9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEFqYXhSZXNvbHZlciBleHRlbmRzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCBqcVhIUjpKUXVlcnlYSFI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIGNvbnNvbGUubG9nKCdyZXNvbHZlciBzZXR0aW5ncycsIHRoaXMuX3NldHRpbmdzKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnJyxcblx0XHRcdG1ldGhvZDogJ2dldCcsXG5cdFx0XHRxdWVyeUtleTogJ3EnLFxuXHRcdFx0ZXh0cmFEYXRhOiB7fSxcblx0XHRcdHRpbWVvdXQ6IHVuZGVmaW5lZCxcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRpZiAodGhpcy5qcVhIUiAhPSBudWxsKSB7XG5cdFx0XHR0aGlzLmpxWEhSLmFib3J0KCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGE6T2JqZWN0ID0ge307XG5cdFx0ZGF0YVt0aGlzLl9zZXR0aW5ncy5xdWVyeUtleV0gPSBxO1xuXHRcdCQuZXh0ZW5kKGRhdGEsIHRoaXMuX3NldHRpbmdzLmV4dHJhRGF0YSk7XG5cblx0XHR0aGlzLmpxWEhSID0gJC5hamF4KFxuXHRcdFx0dGhpcy5fc2V0dGluZ3MudXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRtZXRob2Q6IHRoaXMuX3NldHRpbmdzLm1ldGhvZCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dGltZW91dDogdGhpcy5fc2V0dGluZ3MudGltZW91dFxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHR0aGlzLmpxWEhSLmRvbmUoKHJlc3VsdCkgPT4ge1xuXHRcdFx0Y2JrKHJlc3VsdCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5qcVhIUi5mYWlsKChlcnIpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmpxWEhSLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmpxWEhSID0gbnVsbDtcblx0XHR9KTtcblx0fVxuXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXNvbHZlcnMudHNcbiAqKi8iLCIvKlxuICpcdERyb3Bkb3duIGNsYXNzLiBNYW5hZ2VzIHRoZSBkcm9wZG93biBkcmF3aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBEcm9wZG93biB7XG5cdHByb3RlY3RlZCBfJGVsOkpRdWVyeTtcblx0cHJvdGVjdGVkIF9kZDpKUXVlcnk7XG5cdHByb3RlY3RlZCBpbml0aWFsaXplZDpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBzaG93bjpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBpdGVtczphbnlbXSA9IFtdO1xuXHRwcm90ZWN0ZWQgZm9ybWF0SXRlbTpGdW5jdGlvbjtcblx0cHJvdGVjdGVkIHNlYXJjaFRleHQ6c3RyaW5nO1xuXHRwcm90ZWN0ZWQgYXV0b1NlbGVjdDpib29sZWFuO1xuXHRwcm90ZWN0ZWQgbW91c2VvdmVyOmJvb2xlYW47XG5cdHByb3RlY3RlZCBub1Jlc3VsdHNUZXh0OnN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbiwgYXV0b1NlbGVjdDpib29sZWFuLCBub1Jlc3VsdHNUZXh0OnN0cmluZykge1xuXHRcdHRoaXMuXyRlbCA9IGU7XG5cdFx0dGhpcy5mb3JtYXRJdGVtID0gZm9ybWF0SXRlbUNiaztcblx0XHR0aGlzLmF1dG9TZWxlY3QgPSBhdXRvU2VsZWN0O1xuXHRcdHRoaXMubm9SZXN1bHRzVGV4dCA9IG5vUmVzdWx0c1RleHQ7XG5cdFx0XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBpbml0KCk6dm9pZCB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSBkcm9wZG93blxuXHRcdGxldCBwb3M6YW55ID0gJC5leHRlbmQoe30sIHRoaXMuXyRlbC5wb3NpdGlvbigpLCB7XG4gICAgICAgIFx0XHRcdFx0aGVpZ2h0OiB0aGlzLl8kZWxbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgXHRcdFx0XHR9KTtcblx0XHRcblx0XHQvLyBjcmVhdGUgZWxlbWVudFxuXHRcdHRoaXMuX2RkID0gJCgnPHVsIC8+Jyk7XG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdHRoaXMuX2RkLmFkZENsYXNzKCdib290c3RyYXAtYXV0b2NvbXBsZXRlIGRyb3Bkb3duLW1lbnUnKTtcblxuXHRcdHRoaXMuX2RkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cdFx0dGhpcy5fZGQuY3NzKHsgbGVmdDogcG9zLmxlZnQsIHdpZHRoOiB0aGlzLl8kZWwub3V0ZXJXaWR0aCgpIH0pO1xuXHRcdFxuXHRcdC8vIGNsaWNrIGV2ZW50IG9uIGl0ZW1zXG5cdFx0dGhpcy5fZGQub24oJ2NsaWNrJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NsaWNrZWQnLCBldnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCQoZXZ0LmN1cnJlbnRUYXJnZXQpKTtcblx0XHRcdGxldCBpdGVtOmFueSA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2l0ZW0nKTtcblx0XHRcdHRoaXMuaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5fZGQub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG5cdFx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcblx0XHRcdFx0XHRcdHRoaXMuXyRlbC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlZW50ZXInLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRpZiAodGhpcy5oYXZlUmVzdWx0cykge1xuXHRcdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCd1bCcpLmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0JChldnQuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHR0aGlzLm1vdXNlb3ZlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kZC5vbignbW91c2VsZWF2ZScsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdHRoaXMubW91c2VvdmVyID0gZmFsc2U7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcblx0fVxuXG5cdGdldCBpc01vdXNlT3ZlcigpOmJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLm1vdXNlb3Zlcjtcblx0fVxuXG5cdGdldCBoYXZlUmVzdWx0cygpOmJvb2xlYW4ge1xuXHRcdHJldHVybiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKTtcblx0fVxuXG5cdHB1YmxpYyBmb2N1c05leHRJdGVtKHJldmVyc2VkPzpib29sZWFuKSB7XG5cdFx0aWYgKHRoaXMuaGF2ZVJlc3VsdHMpIHtcblx0XHRcdC8vIGdldCBzZWxlY3RlZFxuXHRcdFx0bGV0IGN1cnJFbGVtOkpRdWVyeSA9IHRoaXMuX2RkLmZpbmQoJ2xpLmFjdGl2ZScpO1xuXHRcdFx0bGV0IG5leHRFbGVtOkpRdWVyeSA9IHJldmVyc2VkID8gY3VyckVsZW0ucHJldigpIDogY3VyckVsZW0ubmV4dCgpO1xuXG5cdFx0XHRpZiAobmV4dEVsZW0ubGVuZ3RoID09IDApIHtcblx0XHRcdFx0Ly8gZmlyc3QgXG5cdFx0XHRcdG5leHRFbGVtID0gcmV2ZXJzZWQgPyB0aGlzLl9kZC5maW5kKCdsaScpLmxhc3QoKSA6IHRoaXMuX2RkLmZpbmQoJ2xpJykuZmlyc3QoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Y3VyckVsZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0bmV4dEVsZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBmb2N1c1ByZXZpb3VzSXRlbSgpIHtcblx0XHR0aGlzLmZvY3VzTmV4dEl0ZW0odHJ1ZSk7XG5cdH1cblxuXHRwdWJsaWMgc2VsZWN0Rm9jdXNJdGVtKCkge1xuXHRcdHRoaXMuX2RkLmZpbmQoJ2xpLmFjdGl2ZScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdH1cblxuXHRnZXQgaXNJdGVtRm9jdXNlZCgpOmJvb2xlYW4ge1xuXHRcdGlmICh0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHVibGljIHNob3coKTp2b2lkIHtcblx0XHRpZiAoIXRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuc2hvdygpO1xuXHRcdFx0dGhpcy5zaG93biA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGlzU2hvd24oKTpib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5zaG93bjtcblx0fVxuXG5cdHB1YmxpYyBoaWRlKCk6dm9pZCB7XG5cdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuaGlkZSgpO1xuXHRcdFx0dGhpcy5zaG93biA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVJdGVtcyhpdGVtczphbnlbXSwgc2VhcmNoVGV4dDpzdHJpbmcpIHtcblx0XHQvLyBjb25zb2xlLmxvZygndXBkYXRlSXRlbXMnLCBpdGVtcyk7XG5cdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xuXHRcdHRoaXMuc2VhcmNoVGV4dCA9IHNlYXJjaFRleHQ7XG5cdFx0dGhpcy5yZWZyZXNoSXRlbUxpc3QoKTtcblx0fVxuXG5cdHByaXZhdGUgc2hvd01hdGNoZWRUZXh0KHRleHQ6c3RyaW5nLCBxcnk6c3RyaW5nKTpzdHJpbmcge1xuXHRcdGxldCBzdGFydEluZGV4Om51bWJlciA9IHRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHFyeS50b0xvd2VyQ2FzZSgpKTtcblx0XHRpZiAoc3RhcnRJbmRleCA+IC0xKSB7XG5cdFx0XHRsZXQgZW5kSW5kZXg6bnVtYmVyID0gc3RhcnRJbmRleCArIHFyeS5sZW5ndGg7XG5cblx0XHRcdHJldHVybiB0ZXh0LnNsaWNlKDAsIHN0YXJ0SW5kZXgpICsgJzxiPicgXG5cdFx0XHRcdCsgdGV4dC5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCkgKyAnPC9iPidcblx0XHRcdFx0KyB0ZXh0LnNsaWNlKGVuZEluZGV4KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRleHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVmcmVzaEl0ZW1MaXN0KCkge1xuXHRcdHRoaXMuX2RkLmVtcHR5KCk7XG5cdFx0bGV0IGxpTGlzdDpKUXVlcnlbXSA9IFtdO1xuXHRcdGlmICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdFx0bGV0IGl0ZW1Gb3JtYXR0ZWQ6YW55ID0gdGhpcy5mb3JtYXRJdGVtKGl0ZW0pO1xuXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW1Gb3JtYXR0ZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0aXRlbUZvcm1hdHRlZCA9IHsgdGV4dDogaXRlbUZvcm1hdHRlZCB9XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGl0ZW1UZXh0OnN0cmluZztcblx0XHRcdFx0bGV0IGl0ZW1IdG1sOmFueTtcblxuXHRcdFx0XHRpdGVtVGV4dCA9IHRoaXMuc2hvd01hdGNoZWRUZXh0KGl0ZW1Gb3JtYXR0ZWQudGV4dCwgdGhpcy5zZWFyY2hUZXh0KTtcblx0XHRcdFx0aWYgKCBpdGVtRm9ybWF0dGVkLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1Gb3JtYXR0ZWQuaHRtbDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1UZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgbGkgPSAkKCc8bGkgPicpO1xuXHRcdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdFx0JCgnPGE+JykuYXR0cignaHJlZicsICcjJykuaHRtbChpdGVtSHRtbClcblx0XHRcdFx0KVxuXHRcdFx0XHQuZGF0YSgnaXRlbScsIGl0ZW0pO1xuXHRcdFx0XHRcblx0XHRcdFx0bGlMaXN0LnB1c2gobGkpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIE5vIHJlc3VsdHNcblx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLmh0bWwodGhpcy5ub1Jlc3VsdHNUZXh0KVxuXHRcdFx0KVxuXHRcdFx0LmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0XHRsaUxpc3QucHVzaChsaSk7XG5cdFx0fVxuXG5cdFx0IFxuXHRcdHRoaXMuX2RkLmFwcGVuZChsaUxpc3QpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGl0ZW1TZWxlY3RlZExhdW5jaEV2ZW50KGl0ZW06YW55KTp2b2lkIHtcblx0XHQvLyBsYXVuY2ggc2VsZWN0ZWQgZXZlbnRcblx0XHQvLyBjb25zb2xlLmxvZygnaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQnLCBpdGVtKTtcblx0XHR0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIGl0ZW0pXG5cdH1cblxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Ryb3Bkb3duLnRzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==