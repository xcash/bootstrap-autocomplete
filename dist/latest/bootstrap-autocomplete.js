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
	        return AutoComplete;
	    }());
	    AutoComplete.NAME = 'autoComplete';
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
	        return _super.call(this, options) || this;
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
	        this._dd.css({ top: pos.top + this._$el.outerHeight(), left: pos.left, width: this._$el.outerWidth() });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjk1NjRiNzY3NWI0MDE4ODRjYmUiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsMENBQTJDO0FBQzNDLHlDQUFzQztBQUV0QyxLQUFPLGNBQWMsQ0E2VHBCO0FBN1RELFlBQU8sY0FBYztLQUNuQjtTQWlDRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQTFCaEMsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsaUJBQVksR0FBVSxJQUFJLENBQUM7YUFDM0IscUJBQWdCLEdBQVcsS0FBSyxDQUFDO2FBR2pDLGNBQVMsR0FBRztpQkFDbEIsUUFBUSxFQUFVLE1BQU07aUJBQ3hCLGdCQUFnQixFQUFPLEVBQUU7aUJBQ3pCLFNBQVMsRUFBVSxDQUFDO2lCQUNwQixRQUFRLEVBQVUsT0FBTztpQkFDekIsWUFBWSxFQUFZLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2hELFVBQVUsRUFBVyxJQUFJO2lCQUN6QixhQUFhLEVBQVUsWUFBWTtpQkFDbkMsTUFBTSxFQUFFO3FCQUNOLEtBQUssRUFBWSxJQUFJO3FCQUNyQixTQUFTLEVBQVksSUFBSTtxQkFDekIsTUFBTSxFQUFZLElBQUk7cUJBQ3RCLFVBQVUsRUFBWSxJQUFJO3FCQUMxQixNQUFNLEVBQVks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IiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY5NTY0Yjc2NzViNDAxODg0Y2JlIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWF1dG9jb21wbGV0ZS5qcyB2MC4wLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS94Y2FzaC9ib290c3RyYXAtYXV0b2NvbXBsZXRlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBGb3JrZWQgZnJvbSBib290c3RyYXAzLXR5cGVhaGVhZC5qcyB2My4xLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iYXNzam9ic2VuL0Jvb3RzdHJhcC0zLVR5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogT3JpZ2luYWwgd3JpdHRlbiBieSBAbWRvIGFuZCBAZmF0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxNiBQYW9sbyBDYXNjaWVsbG8gQHhjYXNoNjY2IGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5pbXBvcnQgeyBBamF4UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5tb2R1bGUgQXV0b0NvbXBsZXRlTlMge1xuICBleHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBwdWJsaWMgc3RhdGljIE5BTUU6c3RyaW5nID0gJ2F1dG9Db21wbGV0ZSc7XG5cbiAgICBwcml2YXRlIF9lbDpFbGVtZW50O1xuICAgIHByaXZhdGUgXyRlbDpKUXVlcnk7XG4gICAgcHJpdmF0ZSBfZGQ6RHJvcGRvd247XG4gICAgcHJpdmF0ZSBfc2VhcmNoVGV4dDpzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRJdGVtOmFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZGVmYXVsdFZhbHVlOmFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZGVmYXVsdFRleHQ6c3RyaW5nID0gbnVsbDtcbiAgICBwcml2YXRlIF9pc1NlbGVjdEVsZW1lbnQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3NlbGVjdEhpZGRlbkZpZWxkOkpRdWVyeTtcblxuICAgIHByaXZhdGUgX3NldHRpbmdzID0ge1xuICAgICAgcmVzb2x2ZXI6PHN0cmluZz4gJ2FqYXgnLFxuICAgICAgcmVzb2x2ZXJTZXR0aW5nczo8YW55PiB7fSxcbiAgICAgIG1pbkxlbmd0aDo8bnVtYmVyPiAzLFxuICAgICAgdmFsdWVLZXk6PHN0cmluZz4gJ3ZhbHVlJyxcbiAgICAgIGZvcm1hdFJlc3VsdDo8RnVuY3Rpb24+IHRoaXMuZGVmYXVsdEZvcm1hdFJlc3VsdCxcbiAgICAgIGF1dG9TZWxlY3Q6PGJvb2xlYW4+IHRydWUsXG4gICAgICBub1Jlc3VsdHNUZXh0OjxzdHJpbmc+ICdObyByZXN1bHRzJyxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICB0eXBlZDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFByZTo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFBvc3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWxlY3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBmb2N1czo8RnVuY3Rpb24+IG51bGwsXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcmVzb2x2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkVsZW1lbnQsIG9wdGlvbnM/Ont9KSB7XG4gICAgICB0aGlzLl9lbCA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLl8kZWwgPSAkKHRoaXMuX2VsKTtcbiAgICAgIC8vIGVsZW1lbnQgdHlwZVxuICAgICAgaWYgKHRoaXMuXyRlbC5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgdGhpcy5faXNTZWxlY3RFbGVtZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGlubGluZSBkYXRhIGF0dHJpYnV0ZXNcbiAgICAgIHRoaXMubWFuYWdlSW5saW5lRGF0YUF0dHJpYnV0ZXMoKTtcbiAgICAgIC8vIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXRTZXR0aW5ncygpLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb252ZXJ0U2VsZWN0VG9UZXh0KCk7XG4gICAgICB9IFxuICAgICAgXG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6aW5nJywgdGhpcy5fc2V0dGluZ3MpO1xuICAgICAgXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hbmFnZUlubGluZURhdGFBdHRyaWJ1dGVzKCkge1xuICAgICAgLy8gdXBkYXRlcyBzZXR0aW5ncyB3aXRoIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICBsZXQgcyA9IHRoaXMuZ2V0U2V0dGluZ3MoKTtcbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgndXJsJykpIHtcbiAgICAgICAgc1sncmVzb2x2ZXJTZXR0aW5ncyddLnVybCA9IHRoaXMuXyRlbC5kYXRhKCd1cmwnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC12YWx1ZScpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXZhbHVlJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRUZXh0ID0gdGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCdub3Jlc3VsdHMtdGV4dCcpKSB7XG4gICAgICAgIHNbJ25vUmVzdWx0c1RleHQnXSA9IHRoaXMuXyRlbC5kYXRhKCdub3Jlc3VsdHMtdGV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2V0dGluZ3MoKTp7fSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb252ZXJ0U2VsZWN0VG9UZXh0KCkge1xuICAgICAgLy8gY3JlYXRlIGhpZGRlbiBmaWVsZFxuXG4gICAgICBsZXQgaGlkRmllbGQ6SlF1ZXJ5ID0gJCgnPGlucHV0PicpO1xuICAgICAgaGlkRmllbGQuYXR0cigndHlwZScsICdoaWRkZW4nKTtcbiAgICAgIGhpZEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaGlkRmllbGQudmFsKHRoaXMuX2RlZmF1bHRWYWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZCA9IGhpZEZpZWxkO1xuICAgICAgXG4gICAgICBoaWRGaWVsZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXG4gICAgICAvLyBjcmVhdGUgc2VhcmNoIGlucHV0IGVsZW1lbnRcbiAgICAgIGxldCBzZWFyY2hGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICAvLyBjb3B5IGFsbCBhdHRyaWJ1dGVzXG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCd0eXBlJywgJ3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpICsgJ190ZXh0Jyk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdpZCcsIHRoaXMuXyRlbC5hdHRyKCdpZCcpKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2Rpc2FibGVkJywgdGhpcy5fJGVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cigncGxhY2Vob2xkZXInLCB0aGlzLl8kZWwuYXR0cigncGxhY2Vob2xkZXInKSk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XG4gICAgICBzZWFyY2hGaWVsZC5hZGRDbGFzcyh0aGlzLl8kZWwuYXR0cignY2xhc3MnKSk7XG4gICAgICBpZiAodGhpcy5fZGVmYXVsdFRleHQpIHtcbiAgICAgICAgc2VhcmNoRmllbGQudmFsKHRoaXMuX2RlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gYXR0YWNoIGNsYXNzXG4gICAgICBzZWFyY2hGaWVsZC5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCB0aGlzKTtcblxuICAgICAgLy8gcmVwbGFjZSBvcmlnaW5hbCB3aXRoIHNlYXJjaEZpZWxkXG4gICAgICB0aGlzLl8kZWwucmVwbGFjZVdpdGgoc2VhcmNoRmllbGQpO1xuICAgICAgdGhpcy5fJGVsID0gc2VhcmNoRmllbGQ7XG4gICAgICB0aGlzLl9lbCA9IHNlYXJjaEZpZWxkLmdldCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdCgpOnZvaWQge1xuICAgICAgLy8gYmluZCBkZWZhdWx0IGV2ZW50c1xuICAgICAgdGhpcy5iaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAvLyBSRVNPTFZFUlxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyID09PSAnYWpheCcpIHtcbiAgICAgICAgLy8gY29uZmlndXJlIGRlZmF1bHQgcmVzb2x2ZXJcbiAgICAgICAgdGhpcy5yZXNvbHZlciA9IG5ldyBBamF4UmVzb2x2ZXIodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXJTZXR0aW5ncyk7XG4gICAgICB9XG4gICAgICAvLyBEcm9wZG93blxuICAgICAgdGhpcy5fZGQgPSBuZXcgRHJvcGRvd24odGhpcy5fJGVsLCB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MuYXV0b1NlbGVjdCwgdGhpcy5fc2V0dGluZ3Mubm9SZXN1bHRzVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBiaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk6dm9pZCB7XG4gICAgICB0aGlzLl8kZWwub24oJ2tleWRvd24nLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG5cdFx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHRcdC8vIGFycm93IERPV05cbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzODogLy8gdXAgYXJyb3dcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA5OiAvLyBUQUJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5hdXRvU2VsZWN0KSB7XG4gICAgICAgICAgICAgIC8vIGlmIGF1dG9TZWxlY3QgZW5hYmxlZCBzZWxlY3RzIG9uIGJsdXIgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBpdGVtXG4gICAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfVxuXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICB0aGlzLl8kZWwub24oJ2ZvY3VzIGtleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjaGVjayBrZXlcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcbiAgICAgICAgICBjYXNlIDE2OiAvLyBzaGlmdFxuICAgICAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbiAgICAgICAgICBjYXNlIDE4OiAvLyBhbHRcbiAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodFxuICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnQgXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgRE9XTlxuICAgICAgICAgICAgdGhpcy5fZGQuZm9jdXNOZXh0SXRlbSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzODogLy8gdXAgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuX2RkLmZvY3VzUHJldmlvdXNJdGVtKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDEzOiAvLyBFTlRFUlxuICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0NcbiAgICAgICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLl8kZWwudmFsKCk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXJUeXBlZChuZXdWYWx1ZSk7XG5cdFx0XHRcdH1cbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fJGVsLm9uKCdibHVyJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgICBpZiAoIXRoaXMuX2RkLmlzTW91c2VPdmVyKSB7XG5cbiAgICAgICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgc2VsZWN0IGVsZW1lbnQgeW91IG11c3RcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZC5pc0l0ZW1Gb2N1c2VkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKHRoaXMuX3NlbGVjdGVkSXRlbSAhPT0gbnVsbCkgJiYgKHRoaXMuXyRlbC52YWwoKSAhPT0gJycpICkge1xuICAgICAgICAgICAgICAvLyByZXNlbGVjdCBpdFxuICAgICAgICAgICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIHRoaXMuX3NlbGVjdGVkSXRlbSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAodGhpcy5fJGVsLnZhbCgpICE9PSAnJykgJiYgKHRoaXMuX2RlZmF1bHRWYWx1ZSAhPT0gbnVsbCkgKSB7XG4gICAgICAgICAgICAgIC8vIHNlbGVjdCBEZWZhdWx0XG4gICAgICAgICAgICAgIHRoaXMuXyRlbC52YWwodGhpcy5fZGVmYXVsdFRleHQpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwodGhpcy5fZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGVtcHR5IHRoZSB2YWx1ZXNcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gc2VsZWN0ZWQgZXZlbnRcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIGl0ZW06YW55KSA9PiB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGl0ZW07XG4gICAgICAgIHRoaXMuaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbSk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGhhbmRsZXJUeXBlZChuZXdWYWx1ZTpzdHJpbmcpOnZvaWQge1xuICAgICAgLy8gZmllbGQgdmFsdWUgY2hhbmdlZFxuXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkICE9PSBudWxsKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHZhbHVlID49IG1pbkxlbmd0aCwgc3RhcnQgYXV0b2NvbXBsZXRlXG4gICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID49IHRoaXMuX3NldHRpbmdzLm1pbkxlbmd0aCkge1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuaGFuZGxlclByZVNlYXJjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlclByZVNlYXJjaCgpOnZvaWQge1xuICAgICAgLy8gZG8gbm90aGluZywgc3RhcnQgc2VhcmNoXG4gICAgICBcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlICE9PSBudWxsKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZTpzdHJpbmcgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlKHRoaXMuX3NlYXJjaFRleHQpO1xuICAgICAgICBpZiAoIW5ld1ZhbHVlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc2VhcmNoVGV4dCA9IG5ld1ZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJEb1NlYXJjaCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlckRvU2VhcmNoKCk6dm9pZCB7XG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoKHRoaXMuX3NlYXJjaFRleHQsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAgIHRoaXMucG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQgYmVoYXZpb3VyXG4gICAgICAgIC8vIHNlYXJjaCB1c2luZyBjdXJyZW50IHJlc29sdmVyXG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVyKSB7XG4gICAgICAgICAgdGhpcy5yZXNvbHZlci5zZWFyY2godGhpcy5fc2VhcmNoVGV4dCwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFjayBjYWxsZWQnLCByZXN1bHRzKTtcbiAgICAgIFxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQb3N0KSB7XG4gICAgICAgIHJlc3VsdHMgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUG9zdChyZXN1bHRzKTtcbiAgICAgICAgaWYgKCAodHlwZW9mIHJlc3VsdHMgPT09ICdib29sZWFuJykgJiYgIXJlc3VsdHMpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJTdGFydFNob3cocmVzdWx0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyU3RhcnRTaG93KHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGVmYXVsdEV2ZW50U3RhcnRTaG93XCIsIHJlc3VsdHMpO1xuICAgICAgLy8gZm9yIGV2ZXJ5IHJlc3VsdCwgZHJhdyBpdFxuICAgICAgdGhpcy5fZGQudXBkYXRlSXRlbXMocmVzdWx0cywgdGhpcy5fc2VhcmNoVGV4dCk7XG4gICAgICB0aGlzLl9kZC5zaG93KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGl0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW06YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcicsIGl0ZW0pO1xuICAgICAgLy8gZGVmYXVsdCBiZWhhdmlvdXIgaXMgc2V0IGVsbWVudCdzIC52YWwoKVxuICAgICAgbGV0IGl0ZW1Gb3JtYXR0ZWQ6YW55ID0gdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0KGl0ZW0pO1xuXHRcdFx0aWYgKHR5cGVvZiBpdGVtRm9ybWF0dGVkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdH1cbiAgICAgIHRoaXMuXyRlbC52YWwoaXRlbUZvcm1hdHRlZC50ZXh0KTtcbiAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgc2VsZWN0XG4gICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbChpdGVtRm9ybWF0dGVkLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIC8vIHNhdmUgc2VsZWN0ZWQgaXRlbVxuICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gaXRlbTtcbiAgICAgIC8vIGFuZCBoaWRlXG4gICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0Rm9ybWF0UmVzdWx0KGl0ZW06YW55KTp7fSB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtIH07XG4gICAgICB9IGVsc2UgaWYgKCBpdGVtLnRleHQgKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV0dXJuIGEgdG9TdHJpbmcgb2YgdGhlIGl0ZW0gYXMgbGFzdCByZXNvcnRcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignTm8gZGVmYXVsdCBmb3JtYXR0ZXIgZm9yIGl0ZW0nLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbS50b1N0cmluZygpIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuXG4oZnVuY3Rpb24oJDogSlF1ZXJ5U3RhdGljLCB3aW5kb3c6IGFueSwgZG9jdW1lbnQ6IGFueSkge1xuICAkLmZuW0F1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FXSA9IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGx1Z2luQ2xhc3M6QXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlO1xuXG4gICAgICBwbHVnaW5DbGFzcyA9ICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSk7XG5cbiAgICAgIGlmICghcGx1Z2luQ2xhc3MpIHtcbiAgICAgICAgcGx1Z2luQ2xhc3MgPSBuZXcgQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlKHRoaXMsIG9wdGlvbnMpOyBcbiAgICAgICAgJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCBwbHVnaW5DbGFzcyk7XG4gICAgICB9XG5cblxuICAgIH0pO1xuICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxuLy8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIGZhY3RvcnkoalF1ZXJ5KTtcblxuLy8gfSh0aGlzLCBmdW5jdGlvbiAoJCkge1xuXG4vLyAgICd1c2Ugc3RyaWN0Jztcbi8vICAgLy8ganNoaW50IGxheGNvbW1hOiB0cnVlXG5cblxuLy8gIC8qIFRZUEVBSEVBRCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuLy8gICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgIHZhciBUeXBlYWhlYWQgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuLy8gICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuLy8gICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnR5cGVhaGVhZC5kZWZhdWx0cywgb3B0aW9ucyk7XG4vLyAgICAgdGhpcy5tYXRjaGVyID0gdGhpcy5vcHRpb25zLm1hdGNoZXIgfHwgdGhpcy5tYXRjaGVyO1xuLy8gICAgIHRoaXMuc29ydGVyID0gdGhpcy5vcHRpb25zLnNvcnRlciB8fCB0aGlzLnNvcnRlcjtcbi8vICAgICB0aGlzLnNlbGVjdCA9IHRoaXMub3B0aW9ucy5zZWxlY3QgfHwgdGhpcy5zZWxlY3Q7XG4vLyAgICAgdGhpcy5hdXRvU2VsZWN0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0ID09ICdib29sZWFuJyA/IHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0IDogdHJ1ZTtcbi8vICAgICB0aGlzLmhpZ2hsaWdodGVyID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodGVyIHx8IHRoaXMuaGlnaGxpZ2h0ZXI7XG4vLyAgICAgdGhpcy5yZW5kZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyIHx8IHRoaXMucmVuZGVyO1xuLy8gICAgIHRoaXMudXBkYXRlciA9IHRoaXMub3B0aW9ucy51cGRhdGVyIHx8IHRoaXMudXBkYXRlcjtcbi8vICAgICB0aGlzLmRpc3BsYXlUZXh0ID0gdGhpcy5vcHRpb25zLmRpc3BsYXlUZXh0IHx8IHRoaXMuZGlzcGxheVRleHQ7XG4vLyAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRUZXh0IHx8IHRoaXMuc2VsZWN0ZWRUZXh0O1xuLy8gICAgIHRoaXMuc291cmNlID0gdGhpcy5vcHRpb25zLnNvdXJjZTtcbi8vICAgICB0aGlzLmRlbGF5ID0gdGhpcy5vcHRpb25zLmRlbGF5O1xuLy8gICAgIHRoaXMuJG1lbnUgPSAkKHRoaXMub3B0aW9ucy5tZW51KTtcbi8vICAgICB0aGlzLiRhcHBlbmRUbyA9IHRoaXMub3B0aW9ucy5hcHBlbmRUbyA/ICQodGhpcy5vcHRpb25zLmFwcGVuZFRvKSA6IG51bGw7XG4vLyAgICAgdGhpcy5maXRUb0VsZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA9PSAnYm9vbGVhbicgPyB0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50IDogZmFsc2U7XG4vLyAgICAgdGhpcy5zaG93biA9IGZhbHNlO1xuLy8gICAgIHRoaXMubGlzdGVuKCk7XG4vLyAgICAgdGhpcy5zaG93SGludE9uRm9jdXMgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PSAnYm9vbGVhbicgfHwgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PT0gXCJhbGxcIiA/IHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgOiBmYWxzZTtcbi8vICAgICB0aGlzLmFmdGVyU2VsZWN0ID0gdGhpcy5vcHRpb25zLmFmdGVyU2VsZWN0O1xuLy8gICAgIHRoaXMuYWRkSXRlbSA9IGZhbHNlO1xuLy8gICAgIHRoaXMudmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpO1xuLy8gICB9O1xuICBcbi8vICAgVHlwZWFoZWFkLnByb3RvdHlwZSA9IHtcblxuLy8gICAgIGNvbnN0cnVjdG9yOiBUeXBlYWhlYWQsXG5cbi8vICAgICBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciB2YWwgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5kYXRhKCd2YWx1ZScpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCB2YWwpO1xuLy8gICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCB8fCB2YWwpIHtcbi8vICAgICAgICAgdmFyIG5ld1ZhbCA9IHRoaXMudXBkYXRlcih2YWwpO1xuLy8gICAgICAgICAvLyBVcGRhdGVyIGNhbiBiZSBzZXQgdG8gYW55IHJhbmRvbSBmdW5jdGlvbnMgdmlhIFwib3B0aW9uc1wiIHBhcmFtZXRlciBpbiBjb25zdHJ1Y3RvciBhYm92ZS5cbi8vICAgICAgICAgLy8gQWRkIG51bGwgY2hlY2sgZm9yIGNhc2VzIHdoZW4gdXBkYXRlciByZXR1cm5zIHZvaWQgb3IgdW5kZWZpbmVkLlxuLy8gICAgICAgICBpZiAoIW5ld1ZhbCkge1xuLy8gICAgICAgICAgIG5ld1ZhbCA9ICcnO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHZhciBzZWxlY3RlZFZhbCA9IHRoaXMuc2VsZWN0ZWRUZXh0KG5ld1ZhbCk7XG4vLyAgICAgICAgIGlmIChzZWxlY3RlZFZhbCAhPT0gZmFsc2UpIHtcbi8vICAgICAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgICAgICAudmFsKHNlbGVjdGVkVmFsKVxuLy8gICAgICAgICAgICAgLnRleHQodGhpcy5kaXNwbGF5VGV4dChuZXdWYWwpIHx8IG5ld1ZhbClcbi8vICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB0aGlzLmFmdGVyU2VsZWN0KG5ld1ZhbCk7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2V0U291cmNlOiBmdW5jdGlvbiAoc291cmNlKSB7XG4vLyAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyIHBvcyA9ICQuZXh0ZW5kKHt9LCB0aGlzLiRlbGVtZW50LnBvc2l0aW9uKCksIHtcbi8vICAgICAgICAgaGVpZ2h0OiB0aGlzLiRlbGVtZW50WzBdLm9mZnNldEhlaWdodFxuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodCA9PSAnZnVuY3Rpb24nID9cbi8vICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0LmNhbGwoKSA6XG4vLyAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodDtcblxuLy8gICAgICAgdmFyIGVsZW1lbnQ7XG4vLyAgICAgICBpZiAodGhpcy5zaG93bikge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudTtcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy4kYXBwZW5kVG8pIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnUuYXBwZW5kVG8odGhpcy4kYXBwZW5kVG8pO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0aGlzLiRhcHBlbmRUby5pcyh0aGlzLiRlbGVtZW50LnBhcmVudCgpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51Lmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0cnVlO1xuLy8gICAgICAgfSAgICAgIFxuICAgICAgXG4vLyAgICAgICBpZiAoIXRoaXMuaGFzU2FtZVBhcmVudCkge1xuLy8gICAgICAgICAgIC8vIFdlIGNhbm5vdCByZWx5IG9uIHRoZSBlbGVtZW50IHBvc2l0aW9uLCBuZWVkIHRvIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSB3aW5kb3dcbi8vICAgICAgICAgICBlbGVtZW50LmNzcyhcInBvc2l0aW9uXCIsIFwiZml4ZWRcIik7XG4vLyAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XG4vLyAgICAgICAgICAgcG9zLnRvcCA9ICBvZmZzZXQudG9wO1xuLy8gICAgICAgICAgIHBvcy5sZWZ0ID0gb2Zmc2V0LmxlZnQ7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyBUaGUgcnVsZXMgZm9yIGJvb3RzdHJhcCBhcmU6ICdkcm9wdXAnIGluIHRoZSBwYXJlbnQgYW5kICdkcm9wZG93bi1tZW51LXJpZ2h0JyBpbiB0aGUgZWxlbWVudC5cbi8vICAgICAgIC8vIE5vdGUgdGhhdCB0byBnZXQgcmlnaHQgYWxpZ25tZW50LCB5b3UnbGwgbmVlZCB0byBzcGVjaWZ5IGBtZW51YCBpbiB0aGUgb3B0aW9ucyB0byBiZTpcbi8vICAgICAgIC8vICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgZHJvcGRvd24tbWVudVwiIHJvbGU9XCJsaXN0Ym94XCI+PC91bD4nXG4vLyAgICAgICB2YXIgZHJvcHVwID0gJChlbGVtZW50KS5wYXJlbnQoKS5oYXNDbGFzcygnZHJvcHVwJyk7XG4vLyAgICAgICB2YXIgbmV3VG9wID0gZHJvcHVwID8gJ2F1dG8nIDogKHBvcy50b3AgKyBwb3MuaGVpZ2h0ICsgc2Nyb2xsSGVpZ2h0KTtcbi8vICAgICAgIHZhciByaWdodCA9ICQoZWxlbWVudCkuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnKTtcbi8vICAgICAgIHZhciBuZXdMZWZ0ID0gcmlnaHQgPyAnYXV0bycgOiBwb3MubGVmdDtcbi8vICAgICAgIC8vIGl0IHNlZW1zIGxpa2Ugc2V0dGluZyB0aGUgY3NzIGlzIGEgYmFkIGlkZWEgKGp1c3QgbGV0IEJvb3RzdHJhcCBkbyBpdCksIGJ1dCBJJ2xsIGtlZXAgdGhlIG9sZFxuLy8gICAgICAgLy8gbG9naWMgaW4gcGxhY2UgZXhjZXB0IGZvciB0aGUgZHJvcHVwL3JpZ2h0LWFsaWduIGNhc2VzLlxuLy8gICAgICAgZWxlbWVudC5jc3MoeyB0b3A6IG5ld1RvcCwgbGVmdDogbmV3TGVmdCB9KS5zaG93KCk7XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50ID09PSB0cnVlKSB7XG4vLyAgICAgICAgICAgZWxlbWVudC5jc3MoXCJ3aWR0aFwiLCB0aGlzLiRlbGVtZW50Lm91dGVyV2lkdGgoKSArIFwicHhcIik7XG4vLyAgICAgICB9XG4gICAgXG4vLyAgICAgICB0aGlzLnNob3duID0gdHJ1ZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRtZW51LmhpZGUoKTtcbi8vICAgICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBsb29rdXA6IGZ1bmN0aW9uIChxdWVyeSkge1xuLy8gICAgICAgdmFyIGl0ZW1zO1xuLy8gICAgICAgaWYgKHR5cGVvZihxdWVyeSkgIT0gJ3VuZGVmaW5lZCcgJiYgcXVlcnkgIT09IG51bGwpIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCkgfHwgJyc7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLnF1ZXJ5Lmxlbmd0aCA8IHRoaXMub3B0aW9ucy5taW5MZW5ndGggJiYgIXRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXM7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHZhciB3b3JrZXIgPSAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblxuLy8gICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKHRoaXMuc291cmNlKSkge1xuLy8gICAgICAgICAgIHRoaXMuc291cmNlKHRoaXMucXVlcnksICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSk7XG4vLyAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zb3VyY2UpIHtcbi8vICAgICAgICAgICB0aGlzLnByb2Nlc3ModGhpcy5zb3VyY2UpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9LCB0aGlzKTtcblxuLy8gICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubG9va3VwV29ya2VyKTtcbi8vICAgICAgIHRoaXMubG9va3VwV29ya2VyID0gc2V0VGltZW91dCh3b3JrZXIsIHRoaXMuZGVsYXkpO1xuLy8gICAgIH0sXG5cbi8vICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuLy8gICAgICAgaXRlbXMgPSAkLmdyZXAoaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGF0Lm1hdGNoZXIoaXRlbSk7XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaXRlbXMgPSB0aGlzLnNvcnRlcihpdGVtcyk7XG5cbi8vICAgICAgIGlmICghaXRlbXMubGVuZ3RoICYmICF0aGlzLm9wdGlvbnMuYWRkSXRlbSkge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcztcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtc1swXSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIG51bGwpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICAvLyBBZGQgaXRlbVxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGRJdGVtKXtcbi8vICAgICAgICAgaXRlbXMucHVzaCh0aGlzLm9wdGlvbnMuYWRkSXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXRlbXMgPT0gJ2FsbCcpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zKS5zaG93KCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoaXRlbXMuc2xpY2UoMCwgdGhpcy5vcHRpb25zLml0ZW1zKSkuc2hvdygpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgdmFyIGl0ID0gdGhpcy5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgIHJldHVybiB+aXQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIHNvcnRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgYmVnaW5zd2l0aCA9IFtdO1xuLy8gICAgICAgdmFyIGNhc2VTZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBjYXNlSW5zZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBpdGVtO1xuXG4vLyAgICAgICB3aGlsZSAoKGl0ZW0gPSBpdGVtcy5zaGlmdCgpKSkge1xuLy8gICAgICAgICB2YXIgaXQgPSB0aGlzLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgICBpZiAoIWl0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpKSBiZWdpbnN3aXRoLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgaWYgKH5pdC5pbmRleE9mKHRoaXMucXVlcnkpKSBjYXNlU2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgY2FzZUluc2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiBiZWdpbnN3aXRoLmNvbmNhdChjYXNlU2Vuc2l0aXZlLCBjYXNlSW5zZW5zaXRpdmUpO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHZhciBodG1sID0gJCgnPGRpdj48L2Rpdj4nKTtcbi8vICAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnk7XG4vLyAgICAgICB2YXIgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgdmFyIGxlbiA9IHF1ZXJ5Lmxlbmd0aDtcbi8vICAgICAgIHZhciBsZWZ0UGFydDtcbi8vICAgICAgIHZhciBtaWRkbGVQYXJ0O1xuLy8gICAgICAgdmFyIHJpZ2h0UGFydDtcbi8vICAgICAgIHZhciBzdHJvbmc7XG4vLyAgICAgICBpZiAobGVuID09PSAwKSB7XG4vLyAgICAgICAgIHJldHVybiBodG1sLnRleHQoaXRlbSkuaHRtbCgpO1xuLy8gICAgICAgfVxuLy8gICAgICAgd2hpbGUgKGkgPiAtMSkge1xuLy8gICAgICAgICBsZWZ0UGFydCA9IGl0ZW0uc3Vic3RyKDAsIGkpO1xuLy8gICAgICAgICBtaWRkbGVQYXJ0ID0gaXRlbS5zdWJzdHIoaSwgbGVuKTtcbi8vICAgICAgICAgcmlnaHRQYXJ0ID0gaXRlbS5zdWJzdHIoaSArIGxlbik7XG4vLyAgICAgICAgIHN0cm9uZyA9ICQoJzxzdHJvbmc+PC9zdHJvbmc+JykudGV4dChtaWRkbGVQYXJ0KTtcbi8vICAgICAgICAgaHRtbFxuLy8gICAgICAgICAgIC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGVmdFBhcnQpKVxuLy8gICAgICAgICAgIC5hcHBlbmQoc3Ryb25nKTtcbi8vICAgICAgICAgaXRlbSA9IHJpZ2h0UGFydDtcbi8vICAgICAgICAgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIGh0bWwuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGl0ZW0pKS5odG1sKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHJlbmRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4vLyAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4vLyAgICAgICB2YXIgYWN0aXZlRm91bmQgPSBmYWxzZTtcbi8vICAgICAgIHZhciBkYXRhID0gW107XG4vLyAgICAgICB2YXIgX2NhdGVnb3J5ID0gdGhhdC5vcHRpb25zLnNlcGFyYXRvcjtcblxuLy8gICAgICAgJC5lYWNoKGl0ZW1zLCBmdW5jdGlvbiAoa2V5LHZhbHVlKSB7XG4vLyAgICAgICAgIC8vIGluamVjdCBzZXBhcmF0b3Jcbi8vICAgICAgICAgaWYgKGtleSA+IDAgJiYgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSl7XG4vLyAgICAgICAgICAgZGF0YS5wdXNoKHtcbi8vICAgICAgICAgICAgIF9fdHlwZTogJ2RpdmlkZXInXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICAvLyBpbmplY3QgY2F0ZWdvcnkgaGVhZGVyXG4vLyAgICAgICAgIGlmICh2YWx1ZVtfY2F0ZWdvcnldICYmIChrZXkgPT09IDAgfHwgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSkpe1xuLy8gICAgICAgICAgIGRhdGEucHVzaCh7XG4vLyAgICAgICAgICAgICBfX3R5cGU6ICdjYXRlZ29yeScsXG4vLyAgICAgICAgICAgICBuYW1lOiB2YWx1ZVtfY2F0ZWdvcnldXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgZGF0YS5wdXNoKHZhbHVlKTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpdGVtcyA9ICQoZGF0YSkubWFwKGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4vLyAgICAgICAgIGlmICgoaXRlbS5fX3R5cGUgfHwgZmFsc2UpID09ICdjYXRlZ29yeScpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJIdG1sKS50ZXh0KGl0ZW0ubmFtZSlbMF07XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICBpZiAoKGl0ZW0uX190eXBlIHx8IGZhbHNlKSA9PSAnZGl2aWRlcicpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJEaXZpZGVyKVswXTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIHZhciB0ZXh0ID0gc2VsZi5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgICAgaSA9ICQodGhhdC5vcHRpb25zLml0ZW0pLmRhdGEoJ3ZhbHVlJywgaXRlbSk7XG4vLyAgICAgICAgIGkuZmluZCgnYScpLmh0bWwodGhhdC5oaWdobGlnaHRlcih0ZXh0LCBpdGVtKSk7XG4vLyAgICAgICAgIGlmICh0ZXh0ID09IHNlbGYuJGVsZW1lbnQudmFsKCkpIHtcbi8vICAgICAgICAgICBpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICBzZWxmLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW0pO1xuLy8gICAgICAgICAgIGFjdGl2ZUZvdW5kID0gdHJ1ZTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICByZXR1cm4gaVswXTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0ICYmICFhY3RpdmVGb3VuZCkge1xuLy8gICAgICAgICBpdGVtcy5maWx0ZXIoJzpub3QoLmRyb3Bkb3duLWhlYWRlciknKS5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtcy5maXJzdCgpLmRhdGEoJ3ZhbHVlJykpO1xuLy8gICAgICAgfVxuLy8gICAgICAgdGhpcy4kbWVudS5odG1sKGl0ZW1zKTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBkaXNwbGF5VGV4dDogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSAhPSAndW5kZWZpbmVkJyAmJiBpdGVtLm5hbWUgfHwgaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2VsZWN0ZWRUZXh0OiBmdW5jdGlvbihpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpdGVtLm5hbWUgIT0gJ3VuZGVmaW5lZCcgJiYgaXRlbS5uYW1lIHx8IGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIG5leHQ6IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgIHZhciBuZXh0ID0gYWN0aXZlLm5leHQoKTtcblxuLy8gICAgICAgaWYgKCFuZXh0Lmxlbmd0aCkge1xuLy8gICAgICAgICBuZXh0ID0gJCh0aGlzLiRtZW51LmZpbmQoJ2xpJylbMF0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgcHJldjogZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICB2YXIgYWN0aXZlID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgdmFyIHByZXYgPSBhY3RpdmUucHJldigpO1xuXG4vLyAgICAgICBpZiAoIXByZXYubGVuZ3RoKSB7XG4vLyAgICAgICAgIHByZXYgPSB0aGlzLiRtZW51LmZpbmQoJ2xpJykubGFzdCgpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBwcmV2LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbGlzdGVuOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vbignZm9jdXMnLCAgICAkLnByb3h5KHRoaXMuZm9jdXMsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2JsdXInLCAgICAgJC5wcm94eSh0aGlzLmJsdXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2tleXByZXNzJywgJC5wcm94eSh0aGlzLmtleXByZXNzLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdpbnB1dCcsICAgICQucHJveHkodGhpcy5pbnB1dCwgdGhpcykpXG4vLyAgICAgICAgIC5vbigna2V5dXAnLCAgICAkLnByb3h5KHRoaXMua2V5dXAsIHRoaXMpKTtcblxuLy8gICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgdGhpcy4kbWVudVxuLy8gICAgICAgICAub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLmNsaWNrLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgJ2xpJywgJC5wcm94eSh0aGlzLm1vdXNlZW50ZXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlbGVhdmUnLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VsZWF2ZSwgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2Vkb3duJywgJC5wcm94eSh0aGlzLm1vdXNlZG93bix0aGlzKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGRlc3Ryb3kgOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ3R5cGVhaGVhZCcsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vZmYoJ2ZvY3VzJylcbi8vICAgICAgICAgLm9mZignYmx1cicpXG4vLyAgICAgICAgIC5vZmYoJ2tleXByZXNzJylcbi8vICAgICAgICAgLm9mZignaW5wdXQnKVxuLy8gICAgICAgICAub2ZmKCdrZXl1cCcpO1xuXG4vLyAgICAgICBpZiAodGhpcy5ldmVudFN1cHBvcnRlZCgna2V5ZG93bicpKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duJyk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHRoaXMuJG1lbnUucmVtb3ZlKCk7XG4vLyAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4vLyAgICAgfSxcblxuLy8gICAgIGV2ZW50U3VwcG9ydGVkOiBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4vLyAgICAgICB2YXIgaXNTdXBwb3J0ZWQgPSBldmVudE5hbWUgaW4gdGhpcy4kZWxlbWVudDtcbi8vICAgICAgIGlmICghaXNTdXBwb3J0ZWQpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5zZXRBdHRyaWJ1dGUoZXZlbnROYW1lLCAncmV0dXJuOycpO1xuLy8gICAgICAgICBpc1N1cHBvcnRlZCA9IHR5cGVvZiB0aGlzLiRlbGVtZW50W2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbic7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gaXNTdXBwb3J0ZWQ7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcblxuLy8gICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbi8vICAgICAgICAgY2FzZSA5OiAvLyB0YWJcbi8vICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4vLyAgICAgICAgICAgLy8gd2l0aCB0aGUgc2hpZnRLZXkgKHRoaXMgaXMgYWN0dWFsbHkgdGhlIGxlZnQgcGFyZW50aGVzaXMpXG4vLyAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuLy8gICAgICAgICAgIC8vIHdpdGggdGhlIHNoaWZ0S2V5ICh0aGlzIGlzIGFjdHVhbGx5IHRoZSByaWdodCBwYXJlbnRoZXNpcylcbi8vICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkgcmV0dXJuO1xuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICB0aGlzLm5leHQoKTtcbi8vICAgICAgICAgICBicmVhaztcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5ZG93bjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCA9IH4kLmluQXJyYXkoZS5rZXlDb2RlLCBbNDAsMzgsOSwxMywyN10pO1xuLy8gICAgICAgaWYgKCF0aGlzLnNob3duICYmIGUua2V5Q29kZSA9PSA0MCkge1xuLy8gICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5tb3ZlKGUpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXlwcmVzczogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICh0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQpIHJldHVybjtcbi8vICAgICAgIHRoaXMubW92ZShlKTtcbi8vICAgICB9LFxuXG4vLyAgICAgaW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICAvLyBUaGlzIGlzIGEgZml4ZWQgZm9yIElFMTAvMTEgdGhhdCBmaXJlcyB0aGUgaW5wdXQgZXZlbnQgd2hlbiBhIHBsYWNlaG9kZXIgaXMgY2hhbmdlZFxuLy8gICAgICAgLy8gKGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODEwNTM4L2llLTExLWZpcmVzLWlucHV0LWV2ZW50LW9uLWZvY3VzKVxuLy8gICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCk7XG4vLyAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG4vLyAgICAgICAgIHRoaXMudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4vLyAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleXVwOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4vLyAgICAgICAgIHJldHVybjtcbi8vICAgICAgIH1cbi8vICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4vLyAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbi8vICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbi8vICAgICAgICAgY2FzZSAxNjogLy8gc2hpZnRcbi8vICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuLy8gICAgICAgICBjYXNlIDE4OiAvLyBhbHRcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDk6IC8vIHRhYlxuLy8gICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuLy8gICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuLy8gICAgICAgICAgIHRoaXMuc2VsZWN0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG4vLyAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG5cblxuLy8gICAgIH0sXG5cbi8vICAgICBmb2N1czogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4vLyAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzICYmIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyAhPT0gdHJ1ZSkge1xuLy8gICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT09IFwiYWxsXCIpIHtcbi8vICAgICAgICAgICAgIHRoaXMubG9va3VwKFwiXCIpOyBcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICAgIGlmICh0aGlzLnNraXBTaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gZmFsc2U7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGJsdXI6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMubW91c2Vkb3ZlciAmJiAhdGhpcy5tb3VzZWRkb3duICYmIHRoaXMuc2hvd24pIHtcbi8vICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLm1vdXNlZGRvd24pIHtcbi8vICAgICAgICAgLy8gVGhpcyBpcyBmb3IgSUUgdGhhdCBibHVycyB0aGUgaW5wdXQgd2hlbiB1c2VyIGNsaWNrcyBvbiBzY3JvbGwuXG4vLyAgICAgICAgIC8vIFdlIHNldCB0aGUgZm9jdXMgYmFjayBvbiB0aGUgaW5wdXQgYW5kIHByZXZlbnQgdGhlIGxvb2t1cCB0byBvY2N1ciBhZ2FpblxuLy8gICAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKCk7XG4vLyAgICAgICAgIHRoaXMubW91c2VkZG93biA9IGZhbHNlO1xuLy8gICAgICAgfSBcbi8vICAgICB9LFxuXG4vLyAgICAgY2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgdGhpcy5zZWxlY3QoKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbi8vICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRvdmVyID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdXNlbGVhdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZG92ZXIgPSBmYWxzZTtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkICYmIHRoaXMuc2hvd24pIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgIC8qKlxuLy8gICAgICAqIFdlIHRyYWNrIHRoZSBtb3VzZWRvd24gZm9yIElFLiBXaGVuIGNsaWNraW5nIG9uIHRoZSBtZW51IHNjcm9sbGJhciwgSUUgbWFrZXMgdGhlIGlucHV0IGJsdXIgdGh1cyBoaWRpbmcgdGhlIG1lbnUuXG4vLyAgICAgICovXG4vLyAgICAgbW91c2Vkb3duOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRkb3duID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUub25lKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcbi8vICAgICAgICAgLy8gSUUgd29uJ3QgZmlyZSB0aGlzLCBidXQgRkYgYW5kIENocm9tZSB3aWxsIHNvIHdlIHJlc2V0IG91ciBmbGFnIGZvciB0aGVtIGhlcmVcbi8vICAgICAgICAgdGhpcy5tb3VzZWRkb3duID0gZmFsc2U7XG4vLyAgICAgICB9LmJpbmQodGhpcykpO1xuLy8gICAgIH0sXG5cbi8vICAgfTtcblxuXG4vLyAgIC8qIFRZUEVBSEVBRCBQTFVHSU4gREVGSU5JVElPTlxuLy8gICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICB2YXIgb2xkID0gJC5mbi50eXBlYWhlYWQ7XG5cbi8vICAgJC5mbi50eXBlYWhlYWQgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4vLyAgICAgdmFyIGFyZyA9IGFyZ3VtZW50cztcbi8vICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBvcHRpb24gPT0gJ2dldEFjdGl2ZScpIHtcbi8vICAgICAgIHJldHVybiB0aGlzLmRhdGEoJ2FjdGl2ZScpO1xuLy8gICAgIH1cbi8vICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4vLyAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpO1xuLy8gICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbjtcbi8vICAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgndHlwZWFoZWFkJywgKGRhdGEgPSBuZXcgVHlwZWFoZWFkKHRoaXMsIG9wdGlvbnMpKSk7XG4vLyAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBkYXRhW29wdGlvbl0pIHtcbi8vICAgICAgICAgaWYgKGFyZy5sZW5ndGggPiAxKSB7XG4vLyAgICAgICAgICAgZGF0YVtvcHRpb25dLmFwcGx5KGRhdGEsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZywgMSkpO1xuLy8gICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgIGRhdGFbb3B0aW9uXSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMgPSB7XG4vLyAgICAgc291cmNlOiBbXSxcbi8vICAgICBpdGVtczogOCxcbi8vICAgICBtZW51OiAnPHVsIGNsYXNzPVwidHlwZWFoZWFkIGRyb3Bkb3duLW1lbnVcIiByb2xlPVwibGlzdGJveFwiPjwvdWw+Jyxcbi8vICAgICBpdGVtOiAnPGxpPjxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgcm9sZT1cIm9wdGlvblwiPjwvYT48L2xpPicsXG4vLyAgICAgbWluTGVuZ3RoOiAxLFxuLy8gICAgIHNjcm9sbEhlaWdodDogMCxcbi8vICAgICBhdXRvU2VsZWN0OiB0cnVlLFxuLy8gICAgIGFmdGVyU2VsZWN0OiAkLm5vb3AsXG4vLyAgICAgYWRkSXRlbTogZmFsc2UsXG4vLyAgICAgZGVsYXk6IDAsXG4vLyAgICAgc2VwYXJhdG9yOiAnY2F0ZWdvcnknLFxuLy8gICAgIGhlYWRlckh0bWw6ICc8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIj48L2xpPicsXG4vLyAgICAgaGVhZGVyRGl2aWRlcjogJzxsaSBjbGFzcz1cImRpdmlkZXJcIiByb2xlPVwic2VwYXJhdG9yXCI+PC9saT4nXG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuQ29uc3RydWN0b3IgPSBUeXBlYWhlYWQ7XG5cbi8vICAvKiBUWVBFQUhFQUQgTk8gQ09ORkxJQ1Rcbi8vICAgKiA9PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJC5mbi50eXBlYWhlYWQubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAkLmZuLnR5cGVhaGVhZCA9IG9sZDtcbi8vICAgICByZXR1cm4gdGhpcztcbi8vICAgfTtcblxuXG4vLyAgLyogVFlQRUFIRUFEIERBVEEtQVBJXG4vLyAgICogPT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJChkb2N1bWVudCkub24oJ2ZvY3VzLnR5cGVhaGVhZC5kYXRhLWFwaScsICdbZGF0YS1wcm92aWRlPVwidHlwZWFoZWFkXCJdJywgZnVuY3Rpb24gKGUpIHtcbi8vICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuLy8gICAgIGlmICgkdGhpcy5kYXRhKCd0eXBlYWhlYWQnKSkgcmV0dXJuO1xuLy8gICAgICR0aGlzLnR5cGVhaGVhZCgkdGhpcy5kYXRhKCkpO1xuLy8gICB9KTtcblxuLy8gfSkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4udHMiLCJcbmNsYXNzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCByZXN1bHRzOkFycmF5PE9iamVjdD47XG5cblx0cHJvdGVjdGVkIF9zZXR0aW5nczphbnk7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHR0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXRSZXN1bHRzKGxpbWl0PzpudW1iZXIsIHN0YXJ0PzpudW1iZXIsIGVuZD86bnVtYmVyKTpBcnJheTxPYmplY3Q+IHtcblx0XHRcblx0XHRyZXR1cm4gdGhpcy5yZXN1bHRzO1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRjYmsodGhpcy5nZXRSZXN1bHRzKCkpO1xuXHR9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEFqYXhSZXNvbHZlciBleHRlbmRzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCBqcVhIUjpKUXVlcnlYSFI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIGNvbnNvbGUubG9nKCdyZXNvbHZlciBzZXR0aW5ncycsIHRoaXMuX3NldHRpbmdzKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnJyxcblx0XHRcdG1ldGhvZDogJ2dldCcsXG5cdFx0XHRxdWVyeUtleTogJ3EnLFxuXHRcdFx0ZXh0cmFEYXRhOiB7fSxcblx0XHRcdHRpbWVvdXQ6IHVuZGVmaW5lZCxcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRpZiAodGhpcy5qcVhIUiAhPSBudWxsKSB7XG5cdFx0XHR0aGlzLmpxWEhSLmFib3J0KCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGE6T2JqZWN0ID0ge307XG5cdFx0ZGF0YVt0aGlzLl9zZXR0aW5ncy5xdWVyeUtleV0gPSBxO1xuXHRcdCQuZXh0ZW5kKGRhdGEsIHRoaXMuX3NldHRpbmdzLmV4dHJhRGF0YSk7XG5cblx0XHR0aGlzLmpxWEhSID0gJC5hamF4KFxuXHRcdFx0dGhpcy5fc2V0dGluZ3MudXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRtZXRob2Q6IHRoaXMuX3NldHRpbmdzLm1ldGhvZCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dGltZW91dDogdGhpcy5fc2V0dGluZ3MudGltZW91dFxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHR0aGlzLmpxWEhSLmRvbmUoKHJlc3VsdCkgPT4ge1xuXHRcdFx0Y2JrKHJlc3VsdCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5qcVhIUi5mYWlsKChlcnIpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmpxWEhSLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmpxWEhSID0gbnVsbDtcblx0XHR9KTtcblx0fVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVzb2x2ZXJzLnRzIiwiLypcbiAqXHREcm9wZG93biBjbGFzcy4gTWFuYWdlcyB0aGUgZHJvcGRvd24gZHJhd2luZ1xuICovXG5leHBvcnQgY2xhc3MgRHJvcGRvd24ge1xuXHRwcm90ZWN0ZWQgXyRlbDpKUXVlcnk7XG5cdHByb3RlY3RlZCBfZGQ6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgc2hvd246Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgaXRlbXM6YW55W10gPSBbXTtcblx0cHJvdGVjdGVkIGZvcm1hdEl0ZW06RnVuY3Rpb247XG5cdHByb3RlY3RlZCBzZWFyY2hUZXh0OnN0cmluZztcblx0cHJvdGVjdGVkIGF1dG9TZWxlY3Q6Ym9vbGVhbjtcblx0cHJvdGVjdGVkIG1vdXNlb3Zlcjpib29sZWFuO1xuXHRwcm90ZWN0ZWQgbm9SZXN1bHRzVGV4dDpzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IoZTpKUXVlcnksIGZvcm1hdEl0ZW1DYms6RnVuY3Rpb24sIGF1dG9TZWxlY3Q6Ym9vbGVhbiwgbm9SZXN1bHRzVGV4dDpzdHJpbmcpIHtcblx0XHR0aGlzLl8kZWwgPSBlO1xuXHRcdHRoaXMuZm9ybWF0SXRlbSA9IGZvcm1hdEl0ZW1DYms7XG5cdFx0dGhpcy5hdXRvU2VsZWN0ID0gYXV0b1NlbGVjdDtcblx0XHR0aGlzLm5vUmVzdWx0c1RleHQgPSBub1Jlc3VsdHNUZXh0O1xuXHRcdFxuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cdFxuXHRwcm90ZWN0ZWQgaW5pdCgpOnZvaWQge1xuXHRcdC8vIEluaXRpYWxpemUgZHJvcGRvd25cblx0XHRsZXQgcG9zOmFueSA9ICQuZXh0ZW5kKHt9LCB0aGlzLl8kZWwucG9zaXRpb24oKSwge1xuICAgICAgICBcdFx0XHRcdGhlaWdodDogdGhpcy5fJGVsWzBdLm9mZnNldEhlaWdodFxuICAgIFx0XHRcdFx0fSk7XG5cdFx0XG5cdFx0Ly8gY3JlYXRlIGVsZW1lbnRcblx0XHR0aGlzLl9kZCA9ICQoJzx1bCAvPicpO1xuXHRcdC8vIGFkZCBvdXIgY2xhc3MgYW5kIGJhc2ljIGRyb3Bkb3duLW1lbnUgY2xhc3Ncblx0XHR0aGlzLl9kZC5hZGRDbGFzcygnYm9vdHN0cmFwLWF1dG9jb21wbGV0ZSBkcm9wZG93bi1tZW51Jyk7XG5cblx0XHR0aGlzLl9kZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXHRcdHRoaXMuX2RkLmNzcyh7IHRvcDogcG9zLnRvcCArIHRoaXMuXyRlbC5vdXRlckhlaWdodCgpLCBsZWZ0OiBwb3MubGVmdCwgd2lkdGg6IHRoaXMuXyRlbC5vdXRlcldpZHRoKCkgfSk7XG5cdFx0XG5cdFx0Ly8gY2xpY2sgZXZlbnQgb24gaXRlbXNcblx0XHR0aGlzLl9kZC5vbignY2xpY2snLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2xpY2tlZCcsIGV2dC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdC8vY29uc29sZS5sb2coJChldnQuY3VycmVudFRhcmdldCkpO1xuXHRcdFx0bGV0IGl0ZW06YW55ID0gJChldnQuY3VycmVudFRhcmdldCkuZGF0YSgnaXRlbScpO1xuXHRcdFx0dGhpcy5pdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtKTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLl9kZC5vbigna2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0Ncblx0XHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5fJGVsLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kZC5vbignbW91c2VlbnRlcicsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdGlmICh0aGlzLmhhdmVSZXN1bHRzKSB7XG5cdFx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3VsJykuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdHRoaXMubW91c2VvdmVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWxlYXZlJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5tb3VzZW92ZXIgPSBmYWxzZTtcblx0XHR9KTtcblxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFxuXHR9XG5cblx0Z2V0IGlzTW91c2VPdmVyKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubW91c2VvdmVyO1xuXHR9XG5cblx0Z2V0IGhhdmVSZXN1bHRzKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApO1xuXHR9XG5cblx0cHVibGljIGZvY3VzTmV4dEl0ZW0ocmV2ZXJzZWQ/OmJvb2xlYW4pIHtcblx0XHRpZiAodGhpcy5oYXZlUmVzdWx0cykge1xuXHRcdFx0Ly8gZ2V0IHNlbGVjdGVkXG5cdFx0XHRsZXQgY3VyckVsZW06SlF1ZXJ5ID0gdGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJyk7XG5cdFx0XHRsZXQgbmV4dEVsZW06SlF1ZXJ5ID0gcmV2ZXJzZWQgPyBjdXJyRWxlbS5wcmV2KCkgOiBjdXJyRWxlbS5uZXh0KCk7XG5cblx0XHRcdGlmIChuZXh0RWxlbS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHQvLyBmaXJzdCBcblx0XHRcdFx0bmV4dEVsZW0gPSByZXZlcnNlZCA/IHRoaXMuX2RkLmZpbmQoJ2xpJykubGFzdCgpIDogdGhpcy5fZGQuZmluZCgnbGknKS5maXJzdCgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRjdXJyRWxlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRuZXh0RWxlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGZvY3VzUHJldmlvdXNJdGVtKCkge1xuXHRcdHRoaXMuZm9jdXNOZXh0SXRlbSh0cnVlKTtcblx0fVxuXG5cdHB1YmxpYyBzZWxlY3RGb2N1c0l0ZW0oKSB7XG5cdFx0dGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJykudHJpZ2dlcignY2xpY2snKTtcblx0fVxuXG5cdGdldCBpc0l0ZW1Gb2N1c2VkKCk6Ym9vbGVhbiB7XG5cdFx0aWYgKHRoaXMuX2RkLmZpbmQoJ2xpLmFjdGl2ZScpLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgc2hvdygpOnZvaWQge1xuXHRcdGlmICghdGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5zaG93KCk7XG5cdFx0XHR0aGlzLnNob3duID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgaXNTaG93bigpOmJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLnNob3duO1xuXHR9XG5cblx0cHVibGljIGhpZGUoKTp2b2lkIHtcblx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5oaWRlKCk7XG5cdFx0XHR0aGlzLnNob3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZUl0ZW1zKGl0ZW1zOmFueVtdLCBzZWFyY2hUZXh0OnN0cmluZykge1xuXHRcdC8vIGNvbnNvbGUubG9nKCd1cGRhdGVJdGVtcycsIGl0ZW1zKTtcblx0XHR0aGlzLml0ZW1zID0gaXRlbXM7XG5cdFx0dGhpcy5zZWFyY2hUZXh0ID0gc2VhcmNoVGV4dDtcblx0XHR0aGlzLnJlZnJlc2hJdGVtTGlzdCgpO1xuXHR9XG5cblx0cHJpdmF0ZSBzaG93TWF0Y2hlZFRleHQodGV4dDpzdHJpbmcsIHFyeTpzdHJpbmcpOnN0cmluZyB7XG5cdFx0bGV0IHN0YXJ0SW5kZXg6bnVtYmVyID0gdGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXJ5LnRvTG93ZXJDYXNlKCkpO1xuXHRcdGlmIChzdGFydEluZGV4ID4gLTEpIHtcblx0XHRcdGxldCBlbmRJbmRleDpudW1iZXIgPSBzdGFydEluZGV4ICsgcXJ5Lmxlbmd0aDtcblxuXHRcdFx0cmV0dXJuIHRleHQuc2xpY2UoMCwgc3RhcnRJbmRleCkgKyAnPGI+JyBcblx0XHRcdFx0KyB0ZXh0LnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KSArICc8L2I+J1xuXHRcdFx0XHQrIHRleHQuc2xpY2UoZW5kSW5kZXgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGV4dDtcblx0fVxuXG5cdHByb3RlY3RlZCByZWZyZXNoSXRlbUxpc3QoKSB7XG5cdFx0dGhpcy5fZGQuZW1wdHkoKTtcblx0XHRsZXQgbGlMaXN0OkpRdWVyeVtdID0gW107XG5cdFx0aWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0XHRsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLmZvcm1hdEl0ZW0oaXRlbSk7XG5cdFx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgaXRlbVRleHQ6c3RyaW5nO1xuXHRcdFx0XHRsZXQgaXRlbUh0bWw6YW55O1xuXG5cdFx0XHRcdGl0ZW1UZXh0ID0gdGhpcy5zaG93TWF0Y2hlZFRleHQoaXRlbUZvcm1hdHRlZC50ZXh0LCB0aGlzLnNlYXJjaFRleHQpO1xuXHRcdFx0XHRpZiAoIGl0ZW1Gb3JtYXR0ZWQuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGl0ZW1IdG1sID0gaXRlbUZvcm1hdHRlZC5odG1sO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGl0ZW1IdG1sID0gaXRlbVRleHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRcdGxpLmFwcGVuZChcblx0XHRcdFx0XHQkKCc8YT4nKS5hdHRyKCdocmVmJywgJyMnKS5odG1sKGl0ZW1IdG1sKVxuXHRcdFx0XHQpXG5cdFx0XHRcdC5kYXRhKCdpdGVtJywgaXRlbSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRsaUxpc3QucHVzaChsaSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gTm8gcmVzdWx0c1xuXHRcdFx0bGV0IGxpID0gJCgnPGxpID4nKTtcblx0XHRcdGxpLmFwcGVuZChcblx0XHRcdFx0JCgnPGE+JykuYXR0cignaHJlZicsICcjJykuaHRtbCh0aGlzLm5vUmVzdWx0c1RleHQpXG5cdFx0XHQpXG5cdFx0XHQuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRcdGxpTGlzdC5wdXNoKGxpKTtcblx0XHR9XG5cblx0XHQgXG5cdFx0dGhpcy5fZGQuYXBwZW5kKGxpTGlzdCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbTphbnkpOnZvaWQge1xuXHRcdC8vIGxhdW5jaCBzZWxlY3RlZCBldmVudFxuXHRcdC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudCcsIGl0ZW0pO1xuXHRcdHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VsZWN0JywgaXRlbSlcblx0fVxuXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Ryb3Bkb3duLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==