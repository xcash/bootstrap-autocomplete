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
	            this._defaults = {
	                resolver: 'ajax',
	                resolverSettings: {},
	                minLength: 3,
	                formatResult: this.defaultFormatResult
	            };
	            this._el = element;
	            this._$el = $(this._el);
	            this._settings = $.extend(true, {}, this._defaults, options);
	            console.log('initializing', this._$el);
	            this.init();
	        }
	        AutoComplete.prototype.init = function () {
	            // bind default events
	            this.bindDefaultEventListeners();
	            // RESOLVER
	            if (this._settings.resolver == 'ajax') {
	                // configure default resolver
	                this.resolver = new resolvers_1.AjaxResolver(this._settings.resolverSettings);
	            }
	            // Dropdown
	            this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult);
	        };
	        AutoComplete.prototype.bindDefaultEventListeners = function () {
	            var _this = this;
	            this._$el.on('keyup', function (evt) {
	                // check key
	                var newValue = _this._$el.val();
	                _this._$el.trigger('autocomplete.search.typed', newValue);
	            });
	            // typed. event launched when field's value changes
	            this._$el.on('autocomplete.search.typed', function (evt, newValue) {
	                _this.defaultEventTyped(newValue);
	            });
	            // search.pre. event launched before actual search
	            this._$el.on('autocomplete.search.pre', function (evt, newValue) {
	                _this.defaultEventPreSearch(newValue);
	            });
	            // search.do. event launched to perform a search, it calls the callback upon search results
	            this._$el.on('autocomplete.search.do', function (evt, newValue, callback) {
	                _this.defaultEventDoSearch(newValue, callback);
	            });
	            // search.post. event launched after the search returns with data, before drawing
	            // receives `results`
	            this._$el.on('autocomplete.search.post', function (evt, results) {
	                _this.defaultEventPostSearch(results);
	            });
	        };
	        AutoComplete.prototype.defaultEventTyped = function (newValue) {
	            // field value changed
	            // if value >= minLength, start autocomplete
	            if (newValue.length >= this._settings.minLength) {
	                this._$el.trigger('autocomplete.search.pre', newValue);
	            }
	        };
	        AutoComplete.prototype.defaultEventPreSearch = function (newValue) {
	            var _this = this;
	            // do nothing, start search
	            this._$el.trigger('autocomplete.search.do', [newValue, function (results) {
	                    // to prevent `this` problems
	                    _this.defaultEventPostSearchCallback(results);
	                }]);
	        };
	        AutoComplete.prototype.defaultEventDoSearch = function (newValue, callback) {
	            // search using current resolver
	            if (this.resolver) {
	                this.resolver.search(newValue, callback);
	            }
	            else {
	                console.error('NO SEARCH RESOLVER DEFINES');
	            }
	        };
	        AutoComplete.prototype.defaultEventPostSearchCallback = function (results) {
	            console.log('callback called', results);
	            this._$el.trigger('autocomplete.search.post', [results]);
	        };
	        AutoComplete.prototype.defaultEventPostSearch = function (results) {
	            this.defaultEventStartShow(results);
	        };
	        AutoComplete.prototype.defaultEventStartShow = function (results) {
	            console.log("defaultEventStartShow", results);
	            // for every result, draw it
	            this._dd.updateItems(results);
	            this._dd.show();
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
	        console.log('resolver settings', this._settings);
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
	    function Dropdown(e, formatItemCbk) {
	        this.initialized = false;
	        this.shown = false;
	        this.items = [];
	        this._$el = e;
	        this.formatItem = formatItemCbk;
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
	        // selected event
	        this._$el.on('autocomplete.select', function (evt, item) {
	            _this.itemSelectedDefaultHandler(item);
	        });
	        // click event on items
	        this._dd.on('click', 'li', function (evt) {
	            // console.log('clicked', evt.currentTarget);
	            console.log($(evt.currentTarget));
	            var item = $(evt.currentTarget).data('item');
	            _this.itemSelectedLaunchEvent(item);
	        });
	        this.initialized = true;
	        // DEBUG - TODO remove
	        // this.show();
	    };
	    Dropdown.prototype.show = function () {
	        if (!this.shown) {
	            this._dd.dropdown().show();
	            this.shown = true;
	        }
	    };
	    Dropdown.prototype.hide = function () {
	        if (this.shown) {
	            this._dd.dropdown().hide();
	            this.shown = false;
	        }
	    };
	    Dropdown.prototype.updateItems = function (items) {
	        console.log('updateItems', items);
	        this.items = items;
	        this.refreshItemList();
	    };
	    Dropdown.prototype.refreshItemList = function () {
	        var _this = this;
	        this._dd.empty();
	        this.items.forEach(function (item) {
	            var itemFormatted = _this.formatItem(item);
	            var li = $('<li >');
	            li.append($('<a>').attr('href', '#').text(itemFormatted.text))
	                .data('item', item);
	            // TODO optimize 
	            _this._dd.append(li);
	        });
	    };
	    Dropdown.prototype.itemSelectedLaunchEvent = function (item) {
	        // launch selected event
	        // console.log('itemSelectedLaunchEvent', item);
	        this._$el.trigger('autocomplete.select', item);
	    };
	    Dropdown.prototype.itemSelectedDefaultHandler = function (item) {
	        console.log('itemSelectedDefaultHandler', item);
	        // default behaviour is set elment's .val()
	        var itemFormatted = this.formatItem(item);
	        this._$el.val(itemFormatted.text);
	        // and hide
	        this.hide();
	    };
	    return Dropdown;
	}());
	exports.Dropdown = Dropdown;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDQ5NzU1ZDNmZTQ1YTkxMmMzMmQiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQWtJcEI7QUFsSUQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQXVCRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQWhCaEMsY0FBUyxHQUFPO2lCQUN0QixRQUFRLEVBQVUsTUFBTTtpQkFDeEIsZ0JBQWdCLEVBQU8sRUFBRTtpQkFDekIsU0FBUyxFQUFVLENBQUM7aUJBQ3BCLFlBQVksRUFBWSxJQUFJLENBQUMsbUJBQW1CO2NBQ2pEO2FBWUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7YUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FB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QUMsSUFBSSxFQUFFLENBQUM7S0FDYixDQUFDO0tBRUYsZUFBQztBQUFELEVBQUM7QUFqR1ksaUJBQVEsV0FpR3BCIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDA0OTc1NWQzZmU0NWE5MTJjMzJkXG4gKiovIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWF1dG9jb21wbGV0ZS5qcyB2MC4wLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS94Y2FzaC9ib290c3RyYXAtYXV0b2NvbXBsZXRlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBGb3JrZWQgZnJvbSBib290c3RyYXAzLXR5cGVhaGVhZC5qcyB2My4xLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iYXNzam9ic2VuL0Jvb3RzdHJhcC0zLVR5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogT3JpZ2luYWwgd3JpdHRlbiBieSBAbWRvIGFuZCBAZmF0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxNiBQYW9sbyBDYXNjaWVsbG8gQHhjYXNoNjY2IGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5pbXBvcnQgeyBBamF4UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5tb2R1bGUgQXV0b0NvbXBsZXRlTlMge1xuICBleHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBwdWJsaWMgc3RhdGljIE5BTUU6c3RyaW5nID0gJ2F1dG9Db21wbGV0ZSc7XG5cbiAgICBwcml2YXRlIF9lbDpFbGVtZW50O1xuICAgIHByaXZhdGUgXyRlbDpKUXVlcnk7XG4gICAgcHJpdmF0ZSBfZGQ6RHJvcGRvd247XG5cbiAgICBwcml2YXRlIF9kZWZhdWx0czphbnkgPSB7XG4gICAgICByZXNvbHZlcjo8c3RyaW5nPiAnYWpheCcsXG4gICAgICByZXNvbHZlclNldHRpbmdzOjxhbnk+IHt9LFxuICAgICAgbWluTGVuZ3RoOjxudW1iZXI+IDMsXG4gICAgICBmb3JtYXRSZXN1bHQ6PEZ1bmN0aW9uPiB0aGlzLmRlZmF1bHRGb3JtYXRSZXN1bHRcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBfc2V0dGluZ3M6e1xuICAgICAgcmVzb2x2ZXI6c3RyaW5nLFxuICAgICAgcmVzb2x2ZXJTZXR0aW5nczp7fSxcbiAgICAgIG1pbkxlbmd0aDpudW1iZXIsXG4gICAgICBmb3JtYXRSZXN1bHQ6RnVuY3Rpb25cbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXNvbHZlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6RWxlbWVudCwgb3B0aW9uczphbnkpIHtcbiAgICAgIHRoaXMuX2VsID0gZWxlbWVudDtcbiAgICAgIHRoaXMuXyRlbCA9ICQodGhpcy5fZWwpO1xuICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6aW5nJywgdGhpcy5fJGVsKTtcbiAgICAgIFxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoKTp2b2lkIHtcbiAgICAgIC8vIGJpbmQgZGVmYXVsdCBldmVudHNcbiAgICAgIHRoaXMuYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpO1xuICAgICAgLy8gUkVTT0xWRVJcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZXNvbHZlciA9PSAnYWpheCcpIHtcbiAgICAgICAgLy8gY29uZmlndXJlIGRlZmF1bHQgcmVzb2x2ZXJcbiAgICAgICAgdGhpcy5yZXNvbHZlciA9IG5ldyBBamF4UmVzb2x2ZXIodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXJTZXR0aW5ncyk7XG4gICAgICB9XG4gICAgICAvLyBEcm9wZG93blxuICAgICAgdGhpcy5fZGQgPSBuZXcgRHJvcGRvd24odGhpcy5fJGVsLCB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTp2b2lkIHtcbiAgICAgIHRoaXMuXyRlbC5vbigna2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGtleVxuXG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMuXyRlbC52YWwoKTtcbiAgICAgICAgdGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWFyY2gudHlwZWQnLCBuZXdWYWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gdHlwZWQuIGV2ZW50IGxhdW5jaGVkIHdoZW4gZmllbGQncyB2YWx1ZSBjaGFuZ2VzXG4gICAgICB0aGlzLl8kZWwub24oJ2F1dG9jb21wbGV0ZS5zZWFyY2gudHlwZWQnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCBuZXdWYWx1ZTpzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5kZWZhdWx0RXZlbnRUeXBlZChuZXdWYWx1ZSk7XG4gICAgICB9KVxuICAgICAgXG4gICAgICAvLyBzZWFyY2gucHJlLiBldmVudCBsYXVuY2hlZCBiZWZvcmUgYWN0dWFsIHNlYXJjaFxuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VhcmNoLnByZScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIG5ld1ZhbHVlOnN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLmRlZmF1bHRFdmVudFByZVNlYXJjaChuZXdWYWx1ZSk7XG4gICAgICB9KVxuICAgICAgXG4gICAgICAvLyBzZWFyY2guZG8uIGV2ZW50IGxhdW5jaGVkIHRvIHBlcmZvcm0gYSBzZWFyY2gsIGl0IGNhbGxzIHRoZSBjYWxsYmFjayB1cG9uIHNlYXJjaCByZXN1bHRzXG4gICAgICB0aGlzLl8kZWwub24oJ2F1dG9jb21wbGV0ZS5zZWFyY2guZG8nLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCBuZXdWYWx1ZTpzdHJpbmcsIGNhbGxiYWNrOkZ1bmN0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuZGVmYXVsdEV2ZW50RG9TZWFyY2gobmV3VmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgIH0pXG4gICAgICBcbiAgICAgIC8vIHNlYXJjaC5wb3N0LiBldmVudCBsYXVuY2hlZCBhZnRlciB0aGUgc2VhcmNoIHJldHVybnMgd2l0aCBkYXRhLCBiZWZvcmUgZHJhd2luZ1xuICAgICAgLy8gcmVjZWl2ZXMgYHJlc3VsdHNgXG4gICAgICB0aGlzLl8kZWwub24oJ2F1dG9jb21wbGV0ZS5zZWFyY2gucG9zdCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgIHRoaXMuZGVmYXVsdEV2ZW50UG9zdFNlYXJjaChyZXN1bHRzKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnRUeXBlZChuZXdWYWx1ZTpzdHJpbmcpOnZvaWQge1xuICAgICAgLy8gZmllbGQgdmFsdWUgY2hhbmdlZFxuICAgICAgLy8gaWYgdmFsdWUgPj0gbWluTGVuZ3RoLCBzdGFydCBhdXRvY29tcGxldGVcbiAgICAgIGlmIChuZXdWYWx1ZS5sZW5ndGggPj0gdGhpcy5fc2V0dGluZ3MubWluTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VhcmNoLnByZScsIG5ld1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRFdmVudFByZVNlYXJjaChuZXdWYWx1ZTpzdHJpbmcpOnZvaWQge1xuICAgICAgLy8gZG8gbm90aGluZywgc3RhcnQgc2VhcmNoXG4gICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlYXJjaC5kbycsIFtuZXdWYWx1ZSwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgIC8vIHRvIHByZXZlbnQgYHRoaXNgIHByb2JsZW1zXG4gICAgICAgIHRoaXMuZGVmYXVsdEV2ZW50UG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgfV0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50RG9TZWFyY2gobmV3VmFsdWU6c3RyaW5nLCBjYWxsYmFjazpGdW5jdGlvbik6dm9pZCB7XG4gICAgICAvLyBzZWFyY2ggdXNpbmcgY3VycmVudCByZXNvbHZlclxuICAgICAgaWYgKHRoaXMucmVzb2x2ZXIpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlci5zZWFyY2gobmV3VmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ05PIFNFQVJDSCBSRVNPTFZFUiBERUZJTkVTJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnRQb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgY29uc29sZS5sb2coJ2NhbGxiYWNrIGNhbGxlZCcsIHJlc3VsdHMpO1xuICAgICAgdGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWFyY2gucG9zdCcsIFtyZXN1bHRzXSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnRQb3N0U2VhcmNoKHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIHRoaXMuZGVmYXVsdEV2ZW50U3RhcnRTaG93KHJlc3VsdHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50U3RhcnRTaG93KHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGVmYXVsdEV2ZW50U3RhcnRTaG93XCIsIHJlc3VsdHMpO1xuICAgICAgLy8gZm9yIGV2ZXJ5IHJlc3VsdCwgZHJhdyBpdFxuICAgICAgdGhpcy5fZGQudXBkYXRlSXRlbXMocmVzdWx0cyk7XG4gICAgICB0aGlzLl9kZC5zaG93KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0Rm9ybWF0UmVzdWx0KGl0ZW06YW55KTp7fSB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtIH07XG4gICAgICB9IGVsc2UgaWYgKCBpdGVtLnRleHQgKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV0dXJuIGEgdG9TdHJpbmcgb2YgdGhlIGl0ZW0gYXMgbGFzdCByZXNvcnRcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignTm8gZGVmYXVsdCBmb3JtYXR0ZXIgZm9yIGl0ZW0nLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbS50b1N0cmluZygpIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuXG4oZnVuY3Rpb24oJDogSlF1ZXJ5U3RhdGljLCB3aW5kb3c6IGFueSwgZG9jdW1lbnQ6IGFueSkge1xuICAkLmZuW0F1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FXSA9IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGx1Z2luQ2xhc3M6QXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlO1xuXG4gICAgICBwbHVnaW5DbGFzcyA9ICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSk7XG5cbiAgICAgIGlmICghcGx1Z2luQ2xhc3MpIHtcbiAgICAgICAgcGx1Z2luQ2xhc3MgPSBuZXcgQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlKHRoaXMsIG9wdGlvbnMpOyBcbiAgICAgICAgJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCBwbHVnaW5DbGFzcyk7XG4gICAgICB9XG5cblxuICAgIH0pO1xuICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxuLy8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIGZhY3RvcnkoalF1ZXJ5KTtcblxuLy8gfSh0aGlzLCBmdW5jdGlvbiAoJCkge1xuXG4vLyAgICd1c2Ugc3RyaWN0Jztcbi8vICAgLy8ganNoaW50IGxheGNvbW1hOiB0cnVlXG5cblxuLy8gIC8qIFRZUEVBSEVBRCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuLy8gICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgIHZhciBUeXBlYWhlYWQgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuLy8gICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuLy8gICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnR5cGVhaGVhZC5kZWZhdWx0cywgb3B0aW9ucyk7XG4vLyAgICAgdGhpcy5tYXRjaGVyID0gdGhpcy5vcHRpb25zLm1hdGNoZXIgfHwgdGhpcy5tYXRjaGVyO1xuLy8gICAgIHRoaXMuc29ydGVyID0gdGhpcy5vcHRpb25zLnNvcnRlciB8fCB0aGlzLnNvcnRlcjtcbi8vICAgICB0aGlzLnNlbGVjdCA9IHRoaXMub3B0aW9ucy5zZWxlY3QgfHwgdGhpcy5zZWxlY3Q7XG4vLyAgICAgdGhpcy5hdXRvU2VsZWN0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0ID09ICdib29sZWFuJyA/IHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0IDogdHJ1ZTtcbi8vICAgICB0aGlzLmhpZ2hsaWdodGVyID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodGVyIHx8IHRoaXMuaGlnaGxpZ2h0ZXI7XG4vLyAgICAgdGhpcy5yZW5kZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyIHx8IHRoaXMucmVuZGVyO1xuLy8gICAgIHRoaXMudXBkYXRlciA9IHRoaXMub3B0aW9ucy51cGRhdGVyIHx8IHRoaXMudXBkYXRlcjtcbi8vICAgICB0aGlzLmRpc3BsYXlUZXh0ID0gdGhpcy5vcHRpb25zLmRpc3BsYXlUZXh0IHx8IHRoaXMuZGlzcGxheVRleHQ7XG4vLyAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRUZXh0IHx8IHRoaXMuc2VsZWN0ZWRUZXh0O1xuLy8gICAgIHRoaXMuc291cmNlID0gdGhpcy5vcHRpb25zLnNvdXJjZTtcbi8vICAgICB0aGlzLmRlbGF5ID0gdGhpcy5vcHRpb25zLmRlbGF5O1xuLy8gICAgIHRoaXMuJG1lbnUgPSAkKHRoaXMub3B0aW9ucy5tZW51KTtcbi8vICAgICB0aGlzLiRhcHBlbmRUbyA9IHRoaXMub3B0aW9ucy5hcHBlbmRUbyA/ICQodGhpcy5vcHRpb25zLmFwcGVuZFRvKSA6IG51bGw7XG4vLyAgICAgdGhpcy5maXRUb0VsZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA9PSAnYm9vbGVhbicgPyB0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50IDogZmFsc2U7XG4vLyAgICAgdGhpcy5zaG93biA9IGZhbHNlO1xuLy8gICAgIHRoaXMubGlzdGVuKCk7XG4vLyAgICAgdGhpcy5zaG93SGludE9uRm9jdXMgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PSAnYm9vbGVhbicgfHwgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PT0gXCJhbGxcIiA/IHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgOiBmYWxzZTtcbi8vICAgICB0aGlzLmFmdGVyU2VsZWN0ID0gdGhpcy5vcHRpb25zLmFmdGVyU2VsZWN0O1xuLy8gICAgIHRoaXMuYWRkSXRlbSA9IGZhbHNlO1xuLy8gICAgIHRoaXMudmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpO1xuLy8gICB9O1xuICBcbi8vICAgVHlwZWFoZWFkLnByb3RvdHlwZSA9IHtcblxuLy8gICAgIGNvbnN0cnVjdG9yOiBUeXBlYWhlYWQsXG5cbi8vICAgICBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciB2YWwgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5kYXRhKCd2YWx1ZScpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCB2YWwpO1xuLy8gICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCB8fCB2YWwpIHtcbi8vICAgICAgICAgdmFyIG5ld1ZhbCA9IHRoaXMudXBkYXRlcih2YWwpO1xuLy8gICAgICAgICAvLyBVcGRhdGVyIGNhbiBiZSBzZXQgdG8gYW55IHJhbmRvbSBmdW5jdGlvbnMgdmlhIFwib3B0aW9uc1wiIHBhcmFtZXRlciBpbiBjb25zdHJ1Y3RvciBhYm92ZS5cbi8vICAgICAgICAgLy8gQWRkIG51bGwgY2hlY2sgZm9yIGNhc2VzIHdoZW4gdXBkYXRlciByZXR1cm5zIHZvaWQgb3IgdW5kZWZpbmVkLlxuLy8gICAgICAgICBpZiAoIW5ld1ZhbCkge1xuLy8gICAgICAgICAgIG5ld1ZhbCA9ICcnO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHZhciBzZWxlY3RlZFZhbCA9IHRoaXMuc2VsZWN0ZWRUZXh0KG5ld1ZhbCk7XG4vLyAgICAgICAgIGlmIChzZWxlY3RlZFZhbCAhPT0gZmFsc2UpIHtcbi8vICAgICAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgICAgICAudmFsKHNlbGVjdGVkVmFsKVxuLy8gICAgICAgICAgICAgLnRleHQodGhpcy5kaXNwbGF5VGV4dChuZXdWYWwpIHx8IG5ld1ZhbClcbi8vICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB0aGlzLmFmdGVyU2VsZWN0KG5ld1ZhbCk7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2V0U291cmNlOiBmdW5jdGlvbiAoc291cmNlKSB7XG4vLyAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyIHBvcyA9ICQuZXh0ZW5kKHt9LCB0aGlzLiRlbGVtZW50LnBvc2l0aW9uKCksIHtcbi8vICAgICAgICAgaGVpZ2h0OiB0aGlzLiRlbGVtZW50WzBdLm9mZnNldEhlaWdodFxuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodCA9PSAnZnVuY3Rpb24nID9cbi8vICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0LmNhbGwoKSA6XG4vLyAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodDtcblxuLy8gICAgICAgdmFyIGVsZW1lbnQ7XG4vLyAgICAgICBpZiAodGhpcy5zaG93bikge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudTtcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy4kYXBwZW5kVG8pIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnUuYXBwZW5kVG8odGhpcy4kYXBwZW5kVG8pO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0aGlzLiRhcHBlbmRUby5pcyh0aGlzLiRlbGVtZW50LnBhcmVudCgpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51Lmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0cnVlO1xuLy8gICAgICAgfSAgICAgIFxuICAgICAgXG4vLyAgICAgICBpZiAoIXRoaXMuaGFzU2FtZVBhcmVudCkge1xuLy8gICAgICAgICAgIC8vIFdlIGNhbm5vdCByZWx5IG9uIHRoZSBlbGVtZW50IHBvc2l0aW9uLCBuZWVkIHRvIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSB3aW5kb3dcbi8vICAgICAgICAgICBlbGVtZW50LmNzcyhcInBvc2l0aW9uXCIsIFwiZml4ZWRcIik7XG4vLyAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XG4vLyAgICAgICAgICAgcG9zLnRvcCA9ICBvZmZzZXQudG9wO1xuLy8gICAgICAgICAgIHBvcy5sZWZ0ID0gb2Zmc2V0LmxlZnQ7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyBUaGUgcnVsZXMgZm9yIGJvb3RzdHJhcCBhcmU6ICdkcm9wdXAnIGluIHRoZSBwYXJlbnQgYW5kICdkcm9wZG93bi1tZW51LXJpZ2h0JyBpbiB0aGUgZWxlbWVudC5cbi8vICAgICAgIC8vIE5vdGUgdGhhdCB0byBnZXQgcmlnaHQgYWxpZ25tZW50LCB5b3UnbGwgbmVlZCB0byBzcGVjaWZ5IGBtZW51YCBpbiB0aGUgb3B0aW9ucyB0byBiZTpcbi8vICAgICAgIC8vICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgZHJvcGRvd24tbWVudVwiIHJvbGU9XCJsaXN0Ym94XCI+PC91bD4nXG4vLyAgICAgICB2YXIgZHJvcHVwID0gJChlbGVtZW50KS5wYXJlbnQoKS5oYXNDbGFzcygnZHJvcHVwJyk7XG4vLyAgICAgICB2YXIgbmV3VG9wID0gZHJvcHVwID8gJ2F1dG8nIDogKHBvcy50b3AgKyBwb3MuaGVpZ2h0ICsgc2Nyb2xsSGVpZ2h0KTtcbi8vICAgICAgIHZhciByaWdodCA9ICQoZWxlbWVudCkuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnKTtcbi8vICAgICAgIHZhciBuZXdMZWZ0ID0gcmlnaHQgPyAnYXV0bycgOiBwb3MubGVmdDtcbi8vICAgICAgIC8vIGl0IHNlZW1zIGxpa2Ugc2V0dGluZyB0aGUgY3NzIGlzIGEgYmFkIGlkZWEgKGp1c3QgbGV0IEJvb3RzdHJhcCBkbyBpdCksIGJ1dCBJJ2xsIGtlZXAgdGhlIG9sZFxuLy8gICAgICAgLy8gbG9naWMgaW4gcGxhY2UgZXhjZXB0IGZvciB0aGUgZHJvcHVwL3JpZ2h0LWFsaWduIGNhc2VzLlxuLy8gICAgICAgZWxlbWVudC5jc3MoeyB0b3A6IG5ld1RvcCwgbGVmdDogbmV3TGVmdCB9KS5zaG93KCk7XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50ID09PSB0cnVlKSB7XG4vLyAgICAgICAgICAgZWxlbWVudC5jc3MoXCJ3aWR0aFwiLCB0aGlzLiRlbGVtZW50Lm91dGVyV2lkdGgoKSArIFwicHhcIik7XG4vLyAgICAgICB9XG4gICAgXG4vLyAgICAgICB0aGlzLnNob3duID0gdHJ1ZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRtZW51LmhpZGUoKTtcbi8vICAgICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBsb29rdXA6IGZ1bmN0aW9uIChxdWVyeSkge1xuLy8gICAgICAgdmFyIGl0ZW1zO1xuLy8gICAgICAgaWYgKHR5cGVvZihxdWVyeSkgIT0gJ3VuZGVmaW5lZCcgJiYgcXVlcnkgIT09IG51bGwpIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCkgfHwgJyc7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLnF1ZXJ5Lmxlbmd0aCA8IHRoaXMub3B0aW9ucy5taW5MZW5ndGggJiYgIXRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXM7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHZhciB3b3JrZXIgPSAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblxuLy8gICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKHRoaXMuc291cmNlKSkge1xuLy8gICAgICAgICAgIHRoaXMuc291cmNlKHRoaXMucXVlcnksICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSk7XG4vLyAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zb3VyY2UpIHtcbi8vICAgICAgICAgICB0aGlzLnByb2Nlc3ModGhpcy5zb3VyY2UpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9LCB0aGlzKTtcblxuLy8gICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubG9va3VwV29ya2VyKTtcbi8vICAgICAgIHRoaXMubG9va3VwV29ya2VyID0gc2V0VGltZW91dCh3b3JrZXIsIHRoaXMuZGVsYXkpO1xuLy8gICAgIH0sXG5cbi8vICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuLy8gICAgICAgaXRlbXMgPSAkLmdyZXAoaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGF0Lm1hdGNoZXIoaXRlbSk7XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaXRlbXMgPSB0aGlzLnNvcnRlcihpdGVtcyk7XG5cbi8vICAgICAgIGlmICghaXRlbXMubGVuZ3RoICYmICF0aGlzLm9wdGlvbnMuYWRkSXRlbSkge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcztcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtc1swXSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIG51bGwpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICAvLyBBZGQgaXRlbVxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGRJdGVtKXtcbi8vICAgICAgICAgaXRlbXMucHVzaCh0aGlzLm9wdGlvbnMuYWRkSXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXRlbXMgPT0gJ2FsbCcpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zKS5zaG93KCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoaXRlbXMuc2xpY2UoMCwgdGhpcy5vcHRpb25zLml0ZW1zKSkuc2hvdygpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgdmFyIGl0ID0gdGhpcy5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgIHJldHVybiB+aXQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIHNvcnRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgYmVnaW5zd2l0aCA9IFtdO1xuLy8gICAgICAgdmFyIGNhc2VTZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBjYXNlSW5zZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBpdGVtO1xuXG4vLyAgICAgICB3aGlsZSAoKGl0ZW0gPSBpdGVtcy5zaGlmdCgpKSkge1xuLy8gICAgICAgICB2YXIgaXQgPSB0aGlzLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgICBpZiAoIWl0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpKSBiZWdpbnN3aXRoLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgaWYgKH5pdC5pbmRleE9mKHRoaXMucXVlcnkpKSBjYXNlU2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgY2FzZUluc2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiBiZWdpbnN3aXRoLmNvbmNhdChjYXNlU2Vuc2l0aXZlLCBjYXNlSW5zZW5zaXRpdmUpO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHZhciBodG1sID0gJCgnPGRpdj48L2Rpdj4nKTtcbi8vICAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnk7XG4vLyAgICAgICB2YXIgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgdmFyIGxlbiA9IHF1ZXJ5Lmxlbmd0aDtcbi8vICAgICAgIHZhciBsZWZ0UGFydDtcbi8vICAgICAgIHZhciBtaWRkbGVQYXJ0O1xuLy8gICAgICAgdmFyIHJpZ2h0UGFydDtcbi8vICAgICAgIHZhciBzdHJvbmc7XG4vLyAgICAgICBpZiAobGVuID09PSAwKSB7XG4vLyAgICAgICAgIHJldHVybiBodG1sLnRleHQoaXRlbSkuaHRtbCgpO1xuLy8gICAgICAgfVxuLy8gICAgICAgd2hpbGUgKGkgPiAtMSkge1xuLy8gICAgICAgICBsZWZ0UGFydCA9IGl0ZW0uc3Vic3RyKDAsIGkpO1xuLy8gICAgICAgICBtaWRkbGVQYXJ0ID0gaXRlbS5zdWJzdHIoaSwgbGVuKTtcbi8vICAgICAgICAgcmlnaHRQYXJ0ID0gaXRlbS5zdWJzdHIoaSArIGxlbik7XG4vLyAgICAgICAgIHN0cm9uZyA9ICQoJzxzdHJvbmc+PC9zdHJvbmc+JykudGV4dChtaWRkbGVQYXJ0KTtcbi8vICAgICAgICAgaHRtbFxuLy8gICAgICAgICAgIC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGVmdFBhcnQpKVxuLy8gICAgICAgICAgIC5hcHBlbmQoc3Ryb25nKTtcbi8vICAgICAgICAgaXRlbSA9IHJpZ2h0UGFydDtcbi8vICAgICAgICAgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIGh0bWwuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGl0ZW0pKS5odG1sKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHJlbmRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4vLyAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4vLyAgICAgICB2YXIgYWN0aXZlRm91bmQgPSBmYWxzZTtcbi8vICAgICAgIHZhciBkYXRhID0gW107XG4vLyAgICAgICB2YXIgX2NhdGVnb3J5ID0gdGhhdC5vcHRpb25zLnNlcGFyYXRvcjtcblxuLy8gICAgICAgJC5lYWNoKGl0ZW1zLCBmdW5jdGlvbiAoa2V5LHZhbHVlKSB7XG4vLyAgICAgICAgIC8vIGluamVjdCBzZXBhcmF0b3Jcbi8vICAgICAgICAgaWYgKGtleSA+IDAgJiYgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSl7XG4vLyAgICAgICAgICAgZGF0YS5wdXNoKHtcbi8vICAgICAgICAgICAgIF9fdHlwZTogJ2RpdmlkZXInXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICAvLyBpbmplY3QgY2F0ZWdvcnkgaGVhZGVyXG4vLyAgICAgICAgIGlmICh2YWx1ZVtfY2F0ZWdvcnldICYmIChrZXkgPT09IDAgfHwgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSkpe1xuLy8gICAgICAgICAgIGRhdGEucHVzaCh7XG4vLyAgICAgICAgICAgICBfX3R5cGU6ICdjYXRlZ29yeScsXG4vLyAgICAgICAgICAgICBuYW1lOiB2YWx1ZVtfY2F0ZWdvcnldXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgZGF0YS5wdXNoKHZhbHVlKTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpdGVtcyA9ICQoZGF0YSkubWFwKGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4vLyAgICAgICAgIGlmICgoaXRlbS5fX3R5cGUgfHwgZmFsc2UpID09ICdjYXRlZ29yeScpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJIdG1sKS50ZXh0KGl0ZW0ubmFtZSlbMF07XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICBpZiAoKGl0ZW0uX190eXBlIHx8IGZhbHNlKSA9PSAnZGl2aWRlcicpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJEaXZpZGVyKVswXTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIHZhciB0ZXh0ID0gc2VsZi5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgICAgaSA9ICQodGhhdC5vcHRpb25zLml0ZW0pLmRhdGEoJ3ZhbHVlJywgaXRlbSk7XG4vLyAgICAgICAgIGkuZmluZCgnYScpLmh0bWwodGhhdC5oaWdobGlnaHRlcih0ZXh0LCBpdGVtKSk7XG4vLyAgICAgICAgIGlmICh0ZXh0ID09IHNlbGYuJGVsZW1lbnQudmFsKCkpIHtcbi8vICAgICAgICAgICBpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICBzZWxmLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW0pO1xuLy8gICAgICAgICAgIGFjdGl2ZUZvdW5kID0gdHJ1ZTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICByZXR1cm4gaVswXTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0ICYmICFhY3RpdmVGb3VuZCkge1xuLy8gICAgICAgICBpdGVtcy5maWx0ZXIoJzpub3QoLmRyb3Bkb3duLWhlYWRlciknKS5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtcy5maXJzdCgpLmRhdGEoJ3ZhbHVlJykpO1xuLy8gICAgICAgfVxuLy8gICAgICAgdGhpcy4kbWVudS5odG1sKGl0ZW1zKTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBkaXNwbGF5VGV4dDogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSAhPSAndW5kZWZpbmVkJyAmJiBpdGVtLm5hbWUgfHwgaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2VsZWN0ZWRUZXh0OiBmdW5jdGlvbihpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpdGVtLm5hbWUgIT0gJ3VuZGVmaW5lZCcgJiYgaXRlbS5uYW1lIHx8IGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIG5leHQ6IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgIHZhciBuZXh0ID0gYWN0aXZlLm5leHQoKTtcblxuLy8gICAgICAgaWYgKCFuZXh0Lmxlbmd0aCkge1xuLy8gICAgICAgICBuZXh0ID0gJCh0aGlzLiRtZW51LmZpbmQoJ2xpJylbMF0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgcHJldjogZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICB2YXIgYWN0aXZlID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgdmFyIHByZXYgPSBhY3RpdmUucHJldigpO1xuXG4vLyAgICAgICBpZiAoIXByZXYubGVuZ3RoKSB7XG4vLyAgICAgICAgIHByZXYgPSB0aGlzLiRtZW51LmZpbmQoJ2xpJykubGFzdCgpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBwcmV2LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbGlzdGVuOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vbignZm9jdXMnLCAgICAkLnByb3h5KHRoaXMuZm9jdXMsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2JsdXInLCAgICAgJC5wcm94eSh0aGlzLmJsdXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2tleXByZXNzJywgJC5wcm94eSh0aGlzLmtleXByZXNzLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdpbnB1dCcsICAgICQucHJveHkodGhpcy5pbnB1dCwgdGhpcykpXG4vLyAgICAgICAgIC5vbigna2V5dXAnLCAgICAkLnByb3h5KHRoaXMua2V5dXAsIHRoaXMpKTtcblxuLy8gICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgdGhpcy4kbWVudVxuLy8gICAgICAgICAub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLmNsaWNrLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgJ2xpJywgJC5wcm94eSh0aGlzLm1vdXNlZW50ZXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlbGVhdmUnLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VsZWF2ZSwgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2Vkb3duJywgJC5wcm94eSh0aGlzLm1vdXNlZG93bix0aGlzKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGRlc3Ryb3kgOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ3R5cGVhaGVhZCcsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vZmYoJ2ZvY3VzJylcbi8vICAgICAgICAgLm9mZignYmx1cicpXG4vLyAgICAgICAgIC5vZmYoJ2tleXByZXNzJylcbi8vICAgICAgICAgLm9mZignaW5wdXQnKVxuLy8gICAgICAgICAub2ZmKCdrZXl1cCcpO1xuXG4vLyAgICAgICBpZiAodGhpcy5ldmVudFN1cHBvcnRlZCgna2V5ZG93bicpKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duJyk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHRoaXMuJG1lbnUucmVtb3ZlKCk7XG4vLyAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4vLyAgICAgfSxcblxuLy8gICAgIGV2ZW50U3VwcG9ydGVkOiBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4vLyAgICAgICB2YXIgaXNTdXBwb3J0ZWQgPSBldmVudE5hbWUgaW4gdGhpcy4kZWxlbWVudDtcbi8vICAgICAgIGlmICghaXNTdXBwb3J0ZWQpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5zZXRBdHRyaWJ1dGUoZXZlbnROYW1lLCAncmV0dXJuOycpO1xuLy8gICAgICAgICBpc1N1cHBvcnRlZCA9IHR5cGVvZiB0aGlzLiRlbGVtZW50W2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbic7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gaXNTdXBwb3J0ZWQ7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcblxuLy8gICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbi8vICAgICAgICAgY2FzZSA5OiAvLyB0YWJcbi8vICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4vLyAgICAgICAgICAgLy8gd2l0aCB0aGUgc2hpZnRLZXkgKHRoaXMgaXMgYWN0dWFsbHkgdGhlIGxlZnQgcGFyZW50aGVzaXMpXG4vLyAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuLy8gICAgICAgICAgIC8vIHdpdGggdGhlIHNoaWZ0S2V5ICh0aGlzIGlzIGFjdHVhbGx5IHRoZSByaWdodCBwYXJlbnRoZXNpcylcbi8vICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkgcmV0dXJuO1xuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICB0aGlzLm5leHQoKTtcbi8vICAgICAgICAgICBicmVhaztcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5ZG93bjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCA9IH4kLmluQXJyYXkoZS5rZXlDb2RlLCBbNDAsMzgsOSwxMywyN10pO1xuLy8gICAgICAgaWYgKCF0aGlzLnNob3duICYmIGUua2V5Q29kZSA9PSA0MCkge1xuLy8gICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5tb3ZlKGUpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXlwcmVzczogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICh0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQpIHJldHVybjtcbi8vICAgICAgIHRoaXMubW92ZShlKTtcbi8vICAgICB9LFxuXG4vLyAgICAgaW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICAvLyBUaGlzIGlzIGEgZml4ZWQgZm9yIElFMTAvMTEgdGhhdCBmaXJlcyB0aGUgaW5wdXQgZXZlbnQgd2hlbiBhIHBsYWNlaG9kZXIgaXMgY2hhbmdlZFxuLy8gICAgICAgLy8gKGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODEwNTM4L2llLTExLWZpcmVzLWlucHV0LWV2ZW50LW9uLWZvY3VzKVxuLy8gICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCk7XG4vLyAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG4vLyAgICAgICAgIHRoaXMudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4vLyAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleXVwOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4vLyAgICAgICAgIHJldHVybjtcbi8vICAgICAgIH1cbi8vICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4vLyAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbi8vICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbi8vICAgICAgICAgY2FzZSAxNjogLy8gc2hpZnRcbi8vICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuLy8gICAgICAgICBjYXNlIDE4OiAvLyBhbHRcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDk6IC8vIHRhYlxuLy8gICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuLy8gICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuLy8gICAgICAgICAgIHRoaXMuc2VsZWN0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG4vLyAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG5cblxuLy8gICAgIH0sXG5cbi8vICAgICBmb2N1czogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4vLyAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzICYmIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyAhPT0gdHJ1ZSkge1xuLy8gICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT09IFwiYWxsXCIpIHtcbi8vICAgICAgICAgICAgIHRoaXMubG9va3VwKFwiXCIpOyBcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICAgIGlmICh0aGlzLnNraXBTaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gZmFsc2U7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGJsdXI6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMubW91c2Vkb3ZlciAmJiAhdGhpcy5tb3VzZWRkb3duICYmIHRoaXMuc2hvd24pIHtcbi8vICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLm1vdXNlZGRvd24pIHtcbi8vICAgICAgICAgLy8gVGhpcyBpcyBmb3IgSUUgdGhhdCBibHVycyB0aGUgaW5wdXQgd2hlbiB1c2VyIGNsaWNrcyBvbiBzY3JvbGwuXG4vLyAgICAgICAgIC8vIFdlIHNldCB0aGUgZm9jdXMgYmFjayBvbiB0aGUgaW5wdXQgYW5kIHByZXZlbnQgdGhlIGxvb2t1cCB0byBvY2N1ciBhZ2FpblxuLy8gICAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKCk7XG4vLyAgICAgICAgIHRoaXMubW91c2VkZG93biA9IGZhbHNlO1xuLy8gICAgICAgfSBcbi8vICAgICB9LFxuXG4vLyAgICAgY2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgdGhpcy5zZWxlY3QoKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbi8vICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRvdmVyID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdXNlbGVhdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZG92ZXIgPSBmYWxzZTtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkICYmIHRoaXMuc2hvd24pIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgIC8qKlxuLy8gICAgICAqIFdlIHRyYWNrIHRoZSBtb3VzZWRvd24gZm9yIElFLiBXaGVuIGNsaWNraW5nIG9uIHRoZSBtZW51IHNjcm9sbGJhciwgSUUgbWFrZXMgdGhlIGlucHV0IGJsdXIgdGh1cyBoaWRpbmcgdGhlIG1lbnUuXG4vLyAgICAgICovXG4vLyAgICAgbW91c2Vkb3duOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRkb3duID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUub25lKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcbi8vICAgICAgICAgLy8gSUUgd29uJ3QgZmlyZSB0aGlzLCBidXQgRkYgYW5kIENocm9tZSB3aWxsIHNvIHdlIHJlc2V0IG91ciBmbGFnIGZvciB0aGVtIGhlcmVcbi8vICAgICAgICAgdGhpcy5tb3VzZWRkb3duID0gZmFsc2U7XG4vLyAgICAgICB9LmJpbmQodGhpcykpO1xuLy8gICAgIH0sXG5cbi8vICAgfTtcblxuXG4vLyAgIC8qIFRZUEVBSEVBRCBQTFVHSU4gREVGSU5JVElPTlxuLy8gICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICB2YXIgb2xkID0gJC5mbi50eXBlYWhlYWQ7XG5cbi8vICAgJC5mbi50eXBlYWhlYWQgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4vLyAgICAgdmFyIGFyZyA9IGFyZ3VtZW50cztcbi8vICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBvcHRpb24gPT0gJ2dldEFjdGl2ZScpIHtcbi8vICAgICAgIHJldHVybiB0aGlzLmRhdGEoJ2FjdGl2ZScpO1xuLy8gICAgIH1cbi8vICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4vLyAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpO1xuLy8gICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbjtcbi8vICAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgndHlwZWFoZWFkJywgKGRhdGEgPSBuZXcgVHlwZWFoZWFkKHRoaXMsIG9wdGlvbnMpKSk7XG4vLyAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBkYXRhW29wdGlvbl0pIHtcbi8vICAgICAgICAgaWYgKGFyZy5sZW5ndGggPiAxKSB7XG4vLyAgICAgICAgICAgZGF0YVtvcHRpb25dLmFwcGx5KGRhdGEsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZywgMSkpO1xuLy8gICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgIGRhdGFbb3B0aW9uXSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMgPSB7XG4vLyAgICAgc291cmNlOiBbXSxcbi8vICAgICBpdGVtczogOCxcbi8vICAgICBtZW51OiAnPHVsIGNsYXNzPVwidHlwZWFoZWFkIGRyb3Bkb3duLW1lbnVcIiByb2xlPVwibGlzdGJveFwiPjwvdWw+Jyxcbi8vICAgICBpdGVtOiAnPGxpPjxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgcm9sZT1cIm9wdGlvblwiPjwvYT48L2xpPicsXG4vLyAgICAgbWluTGVuZ3RoOiAxLFxuLy8gICAgIHNjcm9sbEhlaWdodDogMCxcbi8vICAgICBhdXRvU2VsZWN0OiB0cnVlLFxuLy8gICAgIGFmdGVyU2VsZWN0OiAkLm5vb3AsXG4vLyAgICAgYWRkSXRlbTogZmFsc2UsXG4vLyAgICAgZGVsYXk6IDAsXG4vLyAgICAgc2VwYXJhdG9yOiAnY2F0ZWdvcnknLFxuLy8gICAgIGhlYWRlckh0bWw6ICc8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIj48L2xpPicsXG4vLyAgICAgaGVhZGVyRGl2aWRlcjogJzxsaSBjbGFzcz1cImRpdmlkZXJcIiByb2xlPVwic2VwYXJhdG9yXCI+PC9saT4nXG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuQ29uc3RydWN0b3IgPSBUeXBlYWhlYWQ7XG5cbi8vICAvKiBUWVBFQUhFQUQgTk8gQ09ORkxJQ1Rcbi8vICAgKiA9PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJC5mbi50eXBlYWhlYWQubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAkLmZuLnR5cGVhaGVhZCA9IG9sZDtcbi8vICAgICByZXR1cm4gdGhpcztcbi8vICAgfTtcblxuXG4vLyAgLyogVFlQRUFIRUFEIERBVEEtQVBJXG4vLyAgICogPT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJChkb2N1bWVudCkub24oJ2ZvY3VzLnR5cGVhaGVhZC5kYXRhLWFwaScsICdbZGF0YS1wcm92aWRlPVwidHlwZWFoZWFkXCJdJywgZnVuY3Rpb24gKGUpIHtcbi8vICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuLy8gICAgIGlmICgkdGhpcy5kYXRhKCd0eXBlYWhlYWQnKSkgcmV0dXJuO1xuLy8gICAgICR0aGlzLnR5cGVhaGVhZCgkdGhpcy5kYXRhKCkpO1xuLy8gICB9KTtcblxuLy8gfSkpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbWFpbi50c1xuICoqLyIsIlxuY2xhc3MgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIHJlc3VsdHM6QXJyYXk8T2JqZWN0PjtcblxuXHRwcm90ZWN0ZWQgX3NldHRpbmdzOmFueTtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldFJlc3VsdHMobGltaXQ/Om51bWJlciwgc3RhcnQ/Om51bWJlciwgZW5kPzpudW1iZXIpOkFycmF5PE9iamVjdD4ge1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLnJlc3VsdHM7XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGNiayh0aGlzLmdldFJlc3VsdHMoKSk7XG5cdH1cblxufVxuXG5leHBvcnQgY2xhc3MgQWpheFJlc29sdmVyIGV4dGVuZHMgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIGpxWEhSOkpRdWVyeVhIUjtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0Y29uc29sZS5sb2coJ3Jlc29sdmVyIHNldHRpbmdzJywgdGhpcy5fc2V0dGluZ3MpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICcnLFxuXHRcdFx0bWV0aG9kOiAnZ2V0Jyxcblx0XHRcdHF1ZXJ5S2V5OiAncScsXG5cdFx0XHRleHRyYURhdGE6IHt9LFxuXHRcdFx0dGltZW91dDogdW5kZWZpbmVkLFxuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGlmICh0aGlzLmpxWEhSICE9IG51bGwpIHtcblx0XHRcdHRoaXMuanFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHRsZXQgZGF0YTpPYmplY3QgPSB7fTtcblx0XHRkYXRhW3RoaXMuX3NldHRpbmdzLnF1ZXJ5S2V5XSA9IHE7XG5cdFx0JC5leHRlbmQoZGF0YSwgdGhpcy5fc2V0dGluZ3MuZXh0cmFEYXRhKTtcblxuXHRcdHRoaXMuanFYSFIgPSAkLmFqYXgoXG5cdFx0XHR0aGlzLl9zZXR0aW5ncy51cmwsXG5cdFx0XHR7XG5cdFx0XHRcdG1ldGhvZDogdGhpcy5fc2V0dGluZ3MubWV0aG9kLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0aW1lb3V0OiB0aGlzLl9zZXR0aW5ncy50aW1lb3V0XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHRoaXMuanFYSFIuZG9uZSgocmVzdWx0KSA9PiB7XG5cdFx0XHRjYmsocmVzdWx0KTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmpxWEhSLmZhaWwoKGVycikgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuanFYSFIuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuanFYSFIgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cblxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3Jlc29sdmVycy50c1xuICoqLyIsIi8qXG4gKlx0RHJvcGRvd24gY2xhc3MuIE1hbmFnZXMgdGhlIGRyb3Bkb3duIGRyYXdpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIERyb3Bkb3duIHtcblx0cHJvdGVjdGVkIF8kZWw6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgX2RkOkpRdWVyeTtcblx0cHJvdGVjdGVkIGluaXRpYWxpemVkOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIHNob3duOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIGl0ZW1zOmFueVtdID0gW107XG5cdHByb3RlY3RlZCBmb3JtYXRJdGVtOkZ1bmN0aW9uO1xuXG5cdGNvbnN0cnVjdG9yKGU6SlF1ZXJ5LCBmb3JtYXRJdGVtQ2JrOkZ1bmN0aW9uKSB7XG5cdFx0dGhpcy5fJGVsID0gZTtcblx0XHR0aGlzLmZvcm1hdEl0ZW0gPSBmb3JtYXRJdGVtQ2JrO1xuXHRcdFxuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cdFxuXHRwcm90ZWN0ZWQgaW5pdCgpOnZvaWQge1xuXHRcdC8vIEluaXRpYWxpemUgZHJvcGRvd25cblx0XHRsZXQgcG9zOmFueSA9ICQuZXh0ZW5kKHt9LCB0aGlzLl8kZWwucG9zaXRpb24oKSwge1xuICAgICAgICBcdFx0XHRcdGhlaWdodDogdGhpcy5fJGVsWzBdLm9mZnNldEhlaWdodFxuICAgIFx0XHRcdFx0fSk7XG5cdFx0XG5cdFx0Ly8gY3JlYXRlIGVsZW1lbnRcblx0XHR0aGlzLl9kZCA9ICQoJzx1bCAvPicpO1xuXHRcdC8vIGFkZCBvdXIgY2xhc3MgYW5kIGJhc2ljIGRyb3Bkb3duLW1lbnUgY2xhc3Ncblx0XHR0aGlzLl9kZC5hZGRDbGFzcygnYm9vdHN0cmFwLWF1dG9jb21wbGV0ZSBkcm9wZG93bi1tZW51Jyk7XG5cblx0XHR0aGlzLl9kZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXHRcdHRoaXMuX2RkLmNzcyh7IGxlZnQ6IHBvcy5sZWZ0LCB3aWR0aDogdGhpcy5fJGVsLm91dGVyV2lkdGgoKSB9KTtcblx0XHRcblx0XHQvLyBzZWxlY3RlZCBldmVudFxuXHRcdHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIGl0ZW06YW55KSA9PiB7XG5cdFx0XHR0aGlzLml0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW0pO1xuXHRcdH0pO1xuXHRcdC8vIGNsaWNrIGV2ZW50IG9uIGl0ZW1zXG5cdFx0dGhpcy5fZGQub24oJ2NsaWNrJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NsaWNrZWQnLCBldnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHRjb25zb2xlLmxvZygkKGV2dC5jdXJyZW50VGFyZ2V0KSk7XG5cdFx0XHRsZXQgaXRlbTphbnkgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5kYXRhKCdpdGVtJyk7XG5cdFx0XHR0aGlzLml0ZW1TZWxlY3RlZExhdW5jaEV2ZW50KGl0ZW0pO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XG5cdFx0Ly8gREVCVUcgLSBUT0RPIHJlbW92ZVxuXHRcdC8vIHRoaXMuc2hvdygpO1xuXHR9XG5cblx0cHVibGljIHNob3coKTp2b2lkIHtcblx0XHRpZiAoIXRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuc2hvdygpO1xuXHRcdFx0dGhpcy5zaG93biA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGhpZGUoKTp2b2lkIHtcblx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5oaWRlKCk7XG5cdFx0XHR0aGlzLnNob3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZUl0ZW1zKGl0ZW1zOmFueVtdKSB7XG5cdFx0Y29uc29sZS5sb2coJ3VwZGF0ZUl0ZW1zJywgaXRlbXMpO1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnJlZnJlc2hJdGVtTGlzdCgpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlZnJlc2hJdGVtTGlzdCgpIHtcblx0XHR0aGlzLl9kZC5lbXB0eSgpO1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGxldCBpdGVtRm9ybWF0dGVkOnsgaWQ/Om51bWJlciwgdGV4dDpzdHJpbmcgfSA9IHRoaXMuZm9ybWF0SXRlbShpdGVtKTtcblx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLnRleHQoaXRlbUZvcm1hdHRlZC50ZXh0KVxuXHRcdFx0KVxuXHRcdFx0LmRhdGEoJ2l0ZW0nLCBpdGVtKTtcblx0XHRcdFxuXHRcdFx0Ly8gVE9ETyBvcHRpbWl6ZSBcblx0XHRcdHRoaXMuX2RkLmFwcGVuZChsaSk7XG5cdFx0fSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbTphbnkpOnZvaWQge1xuXHRcdC8vIGxhdW5jaCBzZWxlY3RlZCBldmVudFxuXHRcdC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudCcsIGl0ZW0pO1xuXHRcdHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VsZWN0JywgaXRlbSlcblx0fVxuXG5cdHByb3RlY3RlZCBpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihpdGVtOmFueSk6dm9pZCB7XG5cdFx0Y29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyJywgaXRlbSk7XG5cdFx0Ly8gZGVmYXVsdCBiZWhhdmlvdXIgaXMgc2V0IGVsbWVudCdzIC52YWwoKVxuXHRcdGxldCBpdGVtRm9ybWF0dGVkOnsgaWQ/Om51bWJlciwgdGV4dDpzdHJpbmcgfSA9IHRoaXMuZm9ybWF0SXRlbShpdGVtKTtcblx0XHR0aGlzLl8kZWwudmFsKGl0ZW1Gb3JtYXR0ZWQudGV4dCk7XG5cdFx0Ly8gYW5kIGhpZGVcblx0XHR0aGlzLmhpZGUoKTtcblx0fVxuXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZHJvcGRvd24udHNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9