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
	            this._dd = new dropdown_1.Dropdown(this._$el);
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
	        };
	        AutoComplete.prototype.defaultEventTyped = function (newValue) {
	            // field value changed
	            // if value >= minLength, start autocomplete
	            if (newValue.length >= this._settings.minLength) {
	                this._$el.trigger('autocomplete.search.pre', newValue);
	            }
	        };
	        AutoComplete.prototype.defaultEventPreSearch = function (newValue) {
	            // do nothing, start search
	            this._$el.trigger('autocomplete.search.do', [newValue, this.defaultEventPostSearchCallback]);
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
	            this._$el.trigger('autocomplete.search.post', results);
	        };
	        AutoComplete.prototype.defaultEventPostSearch = function (results) {
	            this._$el.trigger('autocomplete.show.start', results);
	        };
	        AutoComplete.prototype.defaultEventStartShow = function (results) {
	            // for every result, draw it
	            // Initialize dropdown component
	            console.log(results);
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
	                console.error('No default formatter for item', item);
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
	            console.log(result);
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
	    function Dropdown(e) {
	        this.initialized = false;
	        this._$el = e;
	        this.init();
	    }
	    Dropdown.prototype.init = function () {
	        // Initialize dropdown
	        var ddUl = $('<ul />');
	        // add our class and basic dropdown-menu class
	        ddUl.addClass('bootstrap-autocomplete dropdown-menu');
	        ddUl.append("<li><a href='#'>t1</a></li>");
	        ddUl.insertAfter(this._$el);
	        ddUl.dropdown().show();
	        this.initialized = true;
	    };
	    Dropdown.prototype.show = function () {
	        if (!this.initialized)
	            this.init();
	        return;
	    };
	    return Dropdown;
	}());
	exports.Dropdown = Dropdown;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDFjZDNlMjI3ZDA0OGIyMDkzNGIiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQXVIcEI7QUF2SEQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQXVCRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQWhCaEMsY0FBUyxHQUFPO2lCQUN0QixRQUFRLEVBQVUsTUFBTTtpQkFDeEIsZ0JBQWdCLEVBQU8sRUFBRTtpQkFDekIsU0FBUyxFQUFVLENBQUM7aUJBQ3BCLFlBQVksRUFBWSxJQUFJLENBQUMsbUJBQW1CO2NBQ2pEO2FBWUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7YUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FB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LENBQUM7U0FDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBRTNDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztLQUN6QixDQUFDO0tBRU0sdUJBQUksR0FBWDtTQUNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FFYixNQUFNLENBQUM7S0FDUixDQUFDO0tBQ0YsZUFBQztBQUFELEVBQUM7QUE1QlksaUJBQVEsV0E0QnBCIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGQxY2QzZTIyN2QwNDhiMjA5MzRiXG4gKiovIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWF1dG9jb21wbGV0ZS5qcyB2MC4wLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS94Y2FzaC9ib290c3RyYXAtYXV0b2NvbXBsZXRlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBGb3JrZWQgZnJvbSBib290c3RyYXAzLXR5cGVhaGVhZC5qcyB2My4xLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iYXNzam9ic2VuL0Jvb3RzdHJhcC0zLVR5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogT3JpZ2luYWwgd3JpdHRlbiBieSBAbWRvIGFuZCBAZmF0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxNiBQYW9sbyBDYXNjaWVsbG8gQHhjYXNoNjY2IGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5pbXBvcnQgeyBBamF4UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5tb2R1bGUgQXV0b0NvbXBsZXRlTlMge1xuICBleHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBwdWJsaWMgc3RhdGljIE5BTUU6c3RyaW5nID0gJ2F1dG9Db21wbGV0ZSc7XG5cbiAgICBwcml2YXRlIF9lbDpFbGVtZW50O1xuICAgIHByaXZhdGUgXyRlbDpKUXVlcnk7XG4gICAgcHJpdmF0ZSBfZGQ6RHJvcGRvd247XG5cbiAgICBwcml2YXRlIF9kZWZhdWx0czphbnkgPSB7XG4gICAgICByZXNvbHZlcjo8c3RyaW5nPiAnYWpheCcsXG4gICAgICByZXNvbHZlclNldHRpbmdzOjxhbnk+IHt9LFxuICAgICAgbWluTGVuZ3RoOjxudW1iZXI+IDMsXG4gICAgICBmb3JtYXRSZXN1bHQ6PEZ1bmN0aW9uPiB0aGlzLmRlZmF1bHRGb3JtYXRSZXN1bHRcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBfc2V0dGluZ3M6e1xuICAgICAgcmVzb2x2ZXI6c3RyaW5nLFxuICAgICAgcmVzb2x2ZXJTZXR0aW5nczp7fSxcbiAgICAgIG1pbkxlbmd0aDpudW1iZXIsXG4gICAgICBmb3JtYXRSZXN1bHQ6RnVuY3Rpb25cbiAgICB9O1xuXG4gICAgcHJpdmF0ZSByZXNvbHZlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6RWxlbWVudCwgb3B0aW9uczphbnkpIHtcbiAgICAgIHRoaXMuX2VsID0gZWxlbWVudDtcbiAgICAgIHRoaXMuXyRlbCA9ICQodGhpcy5fZWwpO1xuICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6aW5nJywgdGhpcy5fJGVsKTtcbiAgICAgIFxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoKTp2b2lkIHtcbiAgICAgIC8vIGJpbmQgZGVmYXVsdCBldmVudHNcbiAgICAgIHRoaXMuYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpO1xuICAgICAgLy8gUkVTT0xWRVJcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZXNvbHZlciA9PSAnYWpheCcpIHtcbiAgICAgICAgLy8gY29uZmlndXJlIGRlZmF1bHQgcmVzb2x2ZXJcbiAgICAgICAgdGhpcy5yZXNvbHZlciA9IG5ldyBBamF4UmVzb2x2ZXIodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXJTZXR0aW5ncyk7XG4gICAgICB9XG4gICAgICAvLyBEcm9wZG93blxuICAgICAgdGhpcy5fZGQgPSBuZXcgRHJvcGRvd24odGhpcy5fJGVsKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBiaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk6dm9pZCB7XG4gICAgICB0aGlzLl8kZWwub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjaGVjayBrZXlcblxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLl8kZWwudmFsKCk7XG4gICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VhcmNoLnR5cGVkJywgbmV3VmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHR5cGVkLiBldmVudCBsYXVuY2hlZCB3aGVuIGZpZWxkJ3MgdmFsdWUgY2hhbmdlc1xuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VhcmNoLnR5cGVkJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgbmV3VmFsdWU6c3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuZGVmYXVsdEV2ZW50VHlwZWQobmV3VmFsdWUpO1xuICAgICAgfSlcbiAgICAgIFxuICAgICAgLy8gc2VhcmNoLnByZS4gZXZlbnQgbGF1bmNoZWQgYmVmb3JlIGFjdHVhbCBzZWFyY2hcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlYXJjaC5wcmUnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCBuZXdWYWx1ZTpzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5kZWZhdWx0RXZlbnRQcmVTZWFyY2gobmV3VmFsdWUpO1xuICAgICAgfSlcbiAgICAgIFxuICAgICAgLy8gc2VhcmNoLmRvLiBldmVudCBsYXVuY2hlZCB0byBwZXJmb3JtIGEgc2VhcmNoLCBpdCBjYWxscyB0aGUgY2FsbGJhY2sgdXBvbiBzZWFyY2ggcmVzdWx0c1xuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VhcmNoLmRvJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgbmV3VmFsdWU6c3RyaW5nLCBjYWxsYmFjazpGdW5jdGlvbikgPT4ge1xuICAgICAgICB0aGlzLmRlZmF1bHRFdmVudERvU2VhcmNoKG5ld1ZhbHVlLCBjYWxsYmFjayk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50VHlwZWQobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGZpZWxkIHZhbHVlIGNoYW5nZWRcbiAgICAgIC8vIGlmIHZhbHVlID49IG1pbkxlbmd0aCwgc3RhcnQgYXV0b2NvbXBsZXRlXG4gICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID49IHRoaXMuX3NldHRpbmdzLm1pbkxlbmd0aCkge1xuICAgICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlYXJjaC5wcmUnLCBuZXdWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnRQcmVTZWFyY2gobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGRvIG5vdGhpbmcsIHN0YXJ0IHNlYXJjaFxuICAgICAgdGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWFyY2guZG8nLCBbbmV3VmFsdWUsIHRoaXMuZGVmYXVsdEV2ZW50UG9zdFNlYXJjaENhbGxiYWNrXSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnREb1NlYXJjaChuZXdWYWx1ZTpzdHJpbmcsIGNhbGxiYWNrOkZ1bmN0aW9uKTp2b2lkIHtcbiAgICAgIC8vIHNlYXJjaCB1c2luZyBjdXJyZW50IHJlc29sdmVyXG4gICAgICBpZiAodGhpcy5yZXNvbHZlcikge1xuICAgICAgICB0aGlzLnJlc29sdmVyLnNlYXJjaChuZXdWYWx1ZSwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignTk8gU0VBUkNIIFJFU09MVkVSIERFRklORVMnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRFdmVudFBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlYXJjaC5wb3N0JywgcmVzdWx0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnRQb3N0U2VhcmNoKHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2hvdy5zdGFydCcsIHJlc3VsdHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50U3RhcnRTaG93KHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGZvciBldmVyeSByZXN1bHQsIGRyYXcgaXRcbiAgICAgIC8vIEluaXRpYWxpemUgZHJvcGRvd24gY29tcG9uZW50XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRGb3JtYXRSZXN1bHQoaXRlbTphbnkpOnt9IHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0gfTtcbiAgICAgIH0gZWxzZSBpZiAoIGl0ZW0udGV4dCApIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZXR1cm4gYSB0b1N0cmluZyBvZiB0aGUgaXRlbSBhcyBsYXN0IHJlc29ydFxuICAgICAgICBjb25zb2xlLmVycm9yKCdObyBkZWZhdWx0IGZvcm1hdHRlciBmb3IgaXRlbScsIGl0ZW0pO1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtLnRvU3RyaW5nKCkgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG59XG5cbihmdW5jdGlvbigkOiBKUXVlcnlTdGF0aWMsIHdpbmRvdzogYW55LCBkb2N1bWVudDogYW55KSB7XG4gICQuZm5bQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUVdID0gZnVuY3Rpb24ob3B0aW9uczogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwbHVnaW5DbGFzczpBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGU7XG5cbiAgICAgIHBsdWdpbkNsYXNzID0gJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FKTtcblxuICAgICAgaWYgKCFwbHVnaW5DbGFzcykge1xuICAgICAgICBwbHVnaW5DbGFzcyA9IG5ldyBBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUodGhpcywgb3B0aW9ucyk7IFxuICAgICAgICAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHBsdWdpbkNsYXNzKTtcbiAgICAgIH1cblxuXG4gICAgfSk7XG4gIH07XG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblxuLy8gICAndXNlIHN0cmljdCc7XG5cbi8vICAgZmFjdG9yeShqUXVlcnkpO1xuXG4vLyB9KHRoaXMsIGZ1bmN0aW9uICgkKSB7XG5cbi8vICAgJ3VzZSBzdHJpY3QnO1xuLy8gICAvLyBqc2hpbnQgbGF4Y29tbWE6IHRydWVcblxuXG4vLyAgLyogVFlQRUFIRUFEIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4vLyAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgdmFyIFR5cGVhaGVhZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4vLyAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4vLyAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4udHlwZWFoZWFkLmRlZmF1bHRzLCBvcHRpb25zKTtcbi8vICAgICB0aGlzLm1hdGNoZXIgPSB0aGlzLm9wdGlvbnMubWF0Y2hlciB8fCB0aGlzLm1hdGNoZXI7XG4vLyAgICAgdGhpcy5zb3J0ZXIgPSB0aGlzLm9wdGlvbnMuc29ydGVyIHx8IHRoaXMuc29ydGVyO1xuLy8gICAgIHRoaXMuc2VsZWN0ID0gdGhpcy5vcHRpb25zLnNlbGVjdCB8fCB0aGlzLnNlbGVjdDtcbi8vICAgICB0aGlzLmF1dG9TZWxlY3QgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmF1dG9TZWxlY3QgPT0gJ2Jvb2xlYW4nID8gdGhpcy5vcHRpb25zLmF1dG9TZWxlY3QgOiB0cnVlO1xuLy8gICAgIHRoaXMuaGlnaGxpZ2h0ZXIgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0ZXIgfHwgdGhpcy5oaWdobGlnaHRlcjtcbi8vICAgICB0aGlzLnJlbmRlciA9IHRoaXMub3B0aW9ucy5yZW5kZXIgfHwgdGhpcy5yZW5kZXI7XG4vLyAgICAgdGhpcy51cGRhdGVyID0gdGhpcy5vcHRpb25zLnVwZGF0ZXIgfHwgdGhpcy51cGRhdGVyO1xuLy8gICAgIHRoaXMuZGlzcGxheVRleHQgPSB0aGlzLm9wdGlvbnMuZGlzcGxheVRleHQgfHwgdGhpcy5kaXNwbGF5VGV4dDtcbi8vICAgICB0aGlzLnNlbGVjdGVkVGV4dCA9IHRoaXMub3B0aW9ucy5zZWxlY3RlZFRleHQgfHwgdGhpcy5zZWxlY3RlZFRleHQ7XG4vLyAgICAgdGhpcy5zb3VyY2UgPSB0aGlzLm9wdGlvbnMuc291cmNlO1xuLy8gICAgIHRoaXMuZGVsYXkgPSB0aGlzLm9wdGlvbnMuZGVsYXk7XG4vLyAgICAgdGhpcy4kbWVudSA9ICQodGhpcy5vcHRpb25zLm1lbnUpO1xuLy8gICAgIHRoaXMuJGFwcGVuZFRvID0gdGhpcy5vcHRpb25zLmFwcGVuZFRvID8gJCh0aGlzLm9wdGlvbnMuYXBwZW5kVG8pIDogbnVsbDtcbi8vICAgICB0aGlzLmZpdFRvRWxlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50ID09ICdib29sZWFuJyA/IHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgOiBmYWxzZTtcbi8vICAgICB0aGlzLnNob3duID0gZmFsc2U7XG4vLyAgICAgdGhpcy5saXN0ZW4oKTtcbi8vICAgICB0aGlzLnNob3dIaW50T25Gb2N1cyA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09ICdib29sZWFuJyB8fCB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09PSBcImFsbFwiID8gdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA6IGZhbHNlO1xuLy8gICAgIHRoaXMuYWZ0ZXJTZWxlY3QgPSB0aGlzLm9wdGlvbnMuYWZ0ZXJTZWxlY3Q7XG4vLyAgICAgdGhpcy5hZGRJdGVtID0gZmFsc2U7XG4vLyAgICAgdGhpcy52YWx1ZSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCk7XG4vLyAgIH07XG4gIFxuLy8gICBUeXBlYWhlYWQucHJvdG90eXBlID0ge1xuXG4vLyAgICAgY29uc3RydWN0b3I6IFR5cGVhaGVhZCxcblxuLy8gICAgIHNlbGVjdDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyIHZhbCA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLmRhdGEoJ3ZhbHVlJyk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIHZhbCk7XG4vLyAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0IHx8IHZhbCkge1xuLy8gICAgICAgICB2YXIgbmV3VmFsID0gdGhpcy51cGRhdGVyKHZhbCk7XG4vLyAgICAgICAgIC8vIFVwZGF0ZXIgY2FuIGJlIHNldCB0byBhbnkgcmFuZG9tIGZ1bmN0aW9ucyB2aWEgXCJvcHRpb25zXCIgcGFyYW1ldGVyIGluIGNvbnN0cnVjdG9yIGFib3ZlLlxuLy8gICAgICAgICAvLyBBZGQgbnVsbCBjaGVjayBmb3IgY2FzZXMgd2hlbiB1cGRhdGVyIHJldHVybnMgdm9pZCBvciB1bmRlZmluZWQuXG4vLyAgICAgICAgIGlmICghbmV3VmFsKSB7XG4vLyAgICAgICAgICAgbmV3VmFsID0gJyc7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdmFyIHNlbGVjdGVkVmFsID0gdGhpcy5zZWxlY3RlZFRleHQobmV3VmFsKTtcbi8vICAgICAgICAgaWYgKHNlbGVjdGVkVmFsICE9PSBmYWxzZSkge1xuLy8gICAgICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgICAgIC52YWwoc2VsZWN0ZWRWYWwpXG4vLyAgICAgICAgICAgICAudGV4dCh0aGlzLmRpc3BsYXlUZXh0KG5ld1ZhbCkgfHwgbmV3VmFsKVxuLy8gICAgICAgICAgICAgLmNoYW5nZSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHRoaXMuYWZ0ZXJTZWxlY3QobmV3VmFsKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgdXBkYXRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBzZXRTb3VyY2U6IGZ1bmN0aW9uIChzb3VyY2UpIHtcbi8vICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuLy8gICAgIH0sXG5cbi8vICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgcG9zID0gJC5leHRlbmQoe30sIHRoaXMuJGVsZW1lbnQucG9zaXRpb24oKSwge1xuLy8gICAgICAgICBoZWlnaHQ6IHRoaXMuJGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgdmFyIHNjcm9sbEhlaWdodCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0ID09ICdmdW5jdGlvbicgP1xuLy8gICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQuY2FsbCgpIDpcbi8vICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0O1xuXG4vLyAgICAgICB2YXIgZWxlbWVudDtcbi8vICAgICAgIGlmICh0aGlzLnNob3duKSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51O1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLiRhcHBlbmRUbykge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudS5hcHBlbmRUbyh0aGlzLiRhcHBlbmRUbyk7XG4vLyAgICAgICAgIHRoaXMuaGFzU2FtZVBhcmVudCA9IHRoaXMuJGFwcGVuZFRvLmlzKHRoaXMuJGVsZW1lbnQucGFyZW50KCkpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnUuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudCk7XG4vLyAgICAgICAgIHRoaXMuaGFzU2FtZVBhcmVudCA9IHRydWU7XG4vLyAgICAgICB9ICAgICAgXG4gICAgICBcbi8vICAgICAgIGlmICghdGhpcy5oYXNTYW1lUGFyZW50KSB7XG4vLyAgICAgICAgICAgLy8gV2UgY2Fubm90IHJlbHkgb24gdGhlIGVsZW1lbnQgcG9zaXRpb24sIG5lZWQgdG8gcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIHdpbmRvd1xuLy8gICAgICAgICAgIGVsZW1lbnQuY3NzKFwicG9zaXRpb25cIiwgXCJmaXhlZFwiKTtcbi8vICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKTtcbi8vICAgICAgICAgICBwb3MudG9wID0gIG9mZnNldC50b3A7XG4vLyAgICAgICAgICAgcG9zLmxlZnQgPSBvZmZzZXQubGVmdDtcbi8vICAgICAgIH1cbi8vICAgICAgIC8vIFRoZSBydWxlcyBmb3IgYm9vdHN0cmFwIGFyZTogJ2Ryb3B1cCcgaW4gdGhlIHBhcmVudCBhbmQgJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnIGluIHRoZSBlbGVtZW50LlxuLy8gICAgICAgLy8gTm90ZSB0aGF0IHRvIGdldCByaWdodCBhbGlnbm1lbnQsIHlvdSdsbCBuZWVkIHRvIHNwZWNpZnkgYG1lbnVgIGluIHRoZSBvcHRpb25zIHRvIGJlOlxuLy8gICAgICAgLy8gJzx1bCBjbGFzcz1cInR5cGVhaGVhZCBkcm9wZG93bi1tZW51XCIgcm9sZT1cImxpc3Rib3hcIj48L3VsPidcbi8vICAgICAgIHZhciBkcm9wdXAgPSAkKGVsZW1lbnQpLnBhcmVudCgpLmhhc0NsYXNzKCdkcm9wdXAnKTtcbi8vICAgICAgIHZhciBuZXdUb3AgPSBkcm9wdXAgPyAnYXV0bycgOiAocG9zLnRvcCArIHBvcy5oZWlnaHQgKyBzY3JvbGxIZWlnaHQpO1xuLy8gICAgICAgdmFyIHJpZ2h0ID0gJChlbGVtZW50KS5oYXNDbGFzcygnZHJvcGRvd24tbWVudS1yaWdodCcpO1xuLy8gICAgICAgdmFyIG5ld0xlZnQgPSByaWdodCA/ICdhdXRvJyA6IHBvcy5sZWZ0O1xuLy8gICAgICAgLy8gaXQgc2VlbXMgbGlrZSBzZXR0aW5nIHRoZSBjc3MgaXMgYSBiYWQgaWRlYSAoanVzdCBsZXQgQm9vdHN0cmFwIGRvIGl0KSwgYnV0IEknbGwga2VlcCB0aGUgb2xkXG4vLyAgICAgICAvLyBsb2dpYyBpbiBwbGFjZSBleGNlcHQgZm9yIHRoZSBkcm9wdXAvcmlnaHQtYWxpZ24gY2FzZXMuXG4vLyAgICAgICBlbGVtZW50LmNzcyh7IHRvcDogbmV3VG9wLCBsZWZ0OiBuZXdMZWZ0IH0pLnNob3coKTtcblxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgPT09IHRydWUpIHtcbi8vICAgICAgICAgICBlbGVtZW50LmNzcyhcIndpZHRoXCIsIHRoaXMuJGVsZW1lbnQub3V0ZXJXaWR0aCgpICsgXCJweFwiKTtcbi8vICAgICAgIH1cbiAgICBcbi8vICAgICAgIHRoaXMuc2hvd24gPSB0cnVlO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJG1lbnUuaGlkZSgpO1xuLy8gICAgICAgdGhpcy5zaG93biA9IGZhbHNlO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGxvb2t1cDogZnVuY3Rpb24gKHF1ZXJ5KSB7XG4vLyAgICAgICB2YXIgaXRlbXM7XG4vLyAgICAgICBpZiAodHlwZW9mKHF1ZXJ5KSAhPSAndW5kZWZpbmVkJyAmJiBxdWVyeSAhPT0gbnVsbCkge1xuLy8gICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKSB8fCAnJztcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKHRoaXMucXVlcnkubGVuZ3RoIDwgdGhpcy5vcHRpb25zLm1pbkxlbmd0aCAmJiAhdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cykge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcztcbi8vICAgICAgIH1cblxuLy8gICAgICAgdmFyIHdvcmtlciA9ICQucHJveHkoZnVuY3Rpb24gKCkge1xuXG4vLyAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24odGhpcy5zb3VyY2UpKSB7XG4vLyAgICAgICAgICAgdGhpcy5zb3VyY2UodGhpcy5xdWVyeSwgJC5wcm94eSh0aGlzLnByb2Nlc3MsIHRoaXMpKTtcbi8vICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNvdXJjZSkge1xuLy8gICAgICAgICAgIHRoaXMucHJvY2Vzcyh0aGlzLnNvdXJjZSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0sIHRoaXMpO1xuXG4vLyAgICAgICBjbGVhclRpbWVvdXQodGhpcy5sb29rdXBXb3JrZXIpO1xuLy8gICAgICAgdGhpcy5sb29rdXBXb3JrZXIgPSBzZXRUaW1lb3V0KHdvcmtlciwgdGhpcy5kZWxheSk7XG4vLyAgICAgfSxcblxuLy8gICAgIHByb2Nlc3M6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4vLyAgICAgICBpdGVtcyA9ICQuZ3JlcChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgICAgcmV0dXJuIHRoYXQubWF0Y2hlcihpdGVtKTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpdGVtcyA9IHRoaXMuc29ydGVyKGl0ZW1zKTtcblxuLy8gICAgICAgaWYgKCFpdGVtcy5sZW5ndGggJiYgIXRoaXMub3B0aW9ucy5hZGRJdGVtKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnNob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW1zWzBdKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgbnVsbCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIC8vIEFkZCBpdGVtXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkZEl0ZW0pe1xuLy8gICAgICAgICBpdGVtcy5wdXNoKHRoaXMub3B0aW9ucy5hZGRJdGVtKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5pdGVtcyA9PSAnYWxsJykge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoaXRlbXMpLnNob3coKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihpdGVtcy5zbGljZSgwLCB0aGlzLm9wdGlvbnMuaXRlbXMpKS5zaG93KCk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIG1hdGNoZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICB2YXIgaXQgPSB0aGlzLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgcmV0dXJuIH5pdC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5xdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICB9LFxuXG4vLyAgICAgc29ydGVyOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciBiZWdpbnN3aXRoID0gW107XG4vLyAgICAgICB2YXIgY2FzZVNlbnNpdGl2ZSA9IFtdO1xuLy8gICAgICAgdmFyIGNhc2VJbnNlbnNpdGl2ZSA9IFtdO1xuLy8gICAgICAgdmFyIGl0ZW07XG5cbi8vICAgICAgIHdoaWxlICgoaXRlbSA9IGl0ZW1zLnNoaWZ0KCkpKSB7XG4vLyAgICAgICAgIHZhciBpdCA9IHRoaXMuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICAgIGlmICghaXQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSkpIGJlZ2luc3dpdGgucHVzaChpdGVtKTtcbi8vICAgICAgICAgZWxzZSBpZiAofml0LmluZGV4T2YodGhpcy5xdWVyeSkpIGNhc2VTZW5zaXRpdmUucHVzaChpdGVtKTtcbi8vICAgICAgICAgZWxzZSBjYXNlSW5zZW5zaXRpdmUucHVzaChpdGVtKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcmV0dXJuIGJlZ2luc3dpdGguY29uY2F0KGNhc2VTZW5zaXRpdmUsIGNhc2VJbnNlbnNpdGl2ZSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGhpZ2hsaWdodGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgdmFyIGh0bWwgPSAkKCc8ZGl2PjwvZGl2PicpO1xuLy8gICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyeTtcbi8vICAgICAgIHZhciBpID0gaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgICB2YXIgbGVuID0gcXVlcnkubGVuZ3RoO1xuLy8gICAgICAgdmFyIGxlZnRQYXJ0O1xuLy8gICAgICAgdmFyIG1pZGRsZVBhcnQ7XG4vLyAgICAgICB2YXIgcmlnaHRQYXJ0O1xuLy8gICAgICAgdmFyIHN0cm9uZztcbi8vICAgICAgIGlmIChsZW4gPT09IDApIHtcbi8vICAgICAgICAgcmV0dXJuIGh0bWwudGV4dChpdGVtKS5odG1sKCk7XG4vLyAgICAgICB9XG4vLyAgICAgICB3aGlsZSAoaSA+IC0xKSB7XG4vLyAgICAgICAgIGxlZnRQYXJ0ID0gaXRlbS5zdWJzdHIoMCwgaSk7XG4vLyAgICAgICAgIG1pZGRsZVBhcnQgPSBpdGVtLnN1YnN0cihpLCBsZW4pO1xuLy8gICAgICAgICByaWdodFBhcnQgPSBpdGVtLnN1YnN0cihpICsgbGVuKTtcbi8vICAgICAgICAgc3Ryb25nID0gJCgnPHN0cm9uZz48L3N0cm9uZz4nKS50ZXh0KG1pZGRsZVBhcnQpO1xuLy8gICAgICAgICBodG1sXG4vLyAgICAgICAgICAgLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsZWZ0UGFydCkpXG4vLyAgICAgICAgICAgLmFwcGVuZChzdHJvbmcpO1xuLy8gICAgICAgICBpdGVtID0gcmlnaHRQYXJ0O1xuLy8gICAgICAgICBpID0gaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gaHRtbC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaXRlbSkpLmh0bWwoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgcmVuZGVyOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciB0aGF0ID0gdGhpcztcbi8vICAgICAgIHZhciBzZWxmID0gdGhpcztcbi8vICAgICAgIHZhciBhY3RpdmVGb3VuZCA9IGZhbHNlO1xuLy8gICAgICAgdmFyIGRhdGEgPSBbXTtcbi8vICAgICAgIHZhciBfY2F0ZWdvcnkgPSB0aGF0Lm9wdGlvbnMuc2VwYXJhdG9yO1xuXG4vLyAgICAgICAkLmVhY2goaXRlbXMsIGZ1bmN0aW9uIChrZXksdmFsdWUpIHtcbi8vICAgICAgICAgLy8gaW5qZWN0IHNlcGFyYXRvclxuLy8gICAgICAgICBpZiAoa2V5ID4gMCAmJiB2YWx1ZVtfY2F0ZWdvcnldICE9PSBpdGVtc1trZXkgLSAxXVtfY2F0ZWdvcnldKXtcbi8vICAgICAgICAgICBkYXRhLnB1c2goe1xuLy8gICAgICAgICAgICAgX190eXBlOiAnZGl2aWRlcidcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIC8vIGluamVjdCBjYXRlZ29yeSBoZWFkZXJcbi8vICAgICAgICAgaWYgKHZhbHVlW19jYXRlZ29yeV0gJiYgKGtleSA9PT0gMCB8fCB2YWx1ZVtfY2F0ZWdvcnldICE9PSBpdGVtc1trZXkgLSAxXVtfY2F0ZWdvcnldKSl7XG4vLyAgICAgICAgICAgZGF0YS5wdXNoKHtcbi8vICAgICAgICAgICAgIF9fdHlwZTogJ2NhdGVnb3J5Jyxcbi8vICAgICAgICAgICAgIG5hbWU6IHZhbHVlW19jYXRlZ29yeV1cbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICBkYXRhLnB1c2godmFsdWUpO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGl0ZW1zID0gJChkYXRhKS5tYXAoZnVuY3Rpb24gKGksIGl0ZW0pIHtcbi8vICAgICAgICAgaWYgKChpdGVtLl9fdHlwZSB8fCBmYWxzZSkgPT0gJ2NhdGVnb3J5Jyl7XG4vLyAgICAgICAgICAgcmV0dXJuICQodGhhdC5vcHRpb25zLmhlYWRlckh0bWwpLnRleHQoaXRlbS5uYW1lKVswXTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIGlmICgoaXRlbS5fX3R5cGUgfHwgZmFsc2UpID09ICdkaXZpZGVyJyl7XG4vLyAgICAgICAgICAgcmV0dXJuICQodGhhdC5vcHRpb25zLmhlYWRlckRpdmlkZXIpWzBdO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgdmFyIHRleHQgPSBzZWxmLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgICBpID0gJCh0aGF0Lm9wdGlvbnMuaXRlbSkuZGF0YSgndmFsdWUnLCBpdGVtKTtcbi8vICAgICAgICAgaS5maW5kKCdhJykuaHRtbCh0aGF0LmhpZ2hsaWdodGVyKHRleHQsIGl0ZW0pKTtcbi8vICAgICAgICAgaWYgKHRleHQgPT0gc2VsZi4kZWxlbWVudC52YWwoKSkge1xuLy8gICAgICAgICAgIGkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgICAgIHNlbGYuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbSk7XG4vLyAgICAgICAgICAgYWN0aXZlRm91bmQgPSB0cnVlO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHJldHVybiBpWzBdO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGlmICh0aGlzLmF1dG9TZWxlY3QgJiYgIWFjdGl2ZUZvdW5kKSB7XG4vLyAgICAgICAgIGl0ZW1zLmZpbHRlcignOm5vdCguZHJvcGRvd24taGVhZGVyKScpLmZpcnN0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW1zLmZpcnN0KCkuZGF0YSgndmFsdWUnKSk7XG4vLyAgICAgICB9XG4vLyAgICAgICB0aGlzLiRtZW51Lmh0bWwoaXRlbXMpO1xuLy8gICAgICAgcmV0dXJuIHRoaXM7XG4vLyAgICAgfSxcblxuLy8gICAgIGRpc3BsYXlUZXh0OiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaXRlbS5uYW1lICE9ICd1bmRlZmluZWQnICYmIGl0ZW0ubmFtZSB8fCBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBzZWxlY3RlZFRleHQ6IGZ1bmN0aW9uKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSAhPSAndW5kZWZpbmVkJyAmJiBpdGVtLm5hbWUgfHwgaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgbmV4dDogZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICB2YXIgYWN0aXZlID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgdmFyIG5leHQgPSBhY3RpdmUubmV4dCgpO1xuXG4vLyAgICAgICBpZiAoIW5leHQubGVuZ3RoKSB7XG4vLyAgICAgICAgIG5leHQgPSAkKHRoaXMuJG1lbnUuZmluZCgnbGknKVswXSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBwcmV2OiBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICB2YXIgcHJldiA9IGFjdGl2ZS5wcmV2KCk7XG5cbi8vICAgICAgIGlmICghcHJldi5sZW5ndGgpIHtcbi8vICAgICAgICAgcHJldiA9IHRoaXMuJG1lbnUuZmluZCgnbGknKS5sYXN0KCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHByZXYuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBsaXN0ZW46IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgLm9uKCdmb2N1cycsICAgICQucHJveHkodGhpcy5mb2N1cywgdGhpcykpXG4vLyAgICAgICAgIC5vbignYmx1cicsICAgICAkLnByb3h5KHRoaXMuYmx1ciwgdGhpcykpXG4vLyAgICAgICAgIC5vbigna2V5cHJlc3MnLCAkLnByb3h5KHRoaXMua2V5cHJlc3MsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2lucHV0JywgICAgJC5wcm94eSh0aGlzLmlucHV0LCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdrZXl1cCcsICAgICQucHJveHkodGhpcy5rZXl1cCwgdGhpcykpO1xuXG4vLyAgICAgICBpZiAodGhpcy5ldmVudFN1cHBvcnRlZCgna2V5ZG93bicpKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24nLCAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcykpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB0aGlzLiRtZW51XG4vLyAgICAgICAgIC5vbignY2xpY2snLCAkLnByb3h5KHRoaXMuY2xpY2ssIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlZW50ZXInLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VlbnRlciwgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2VsZWF2ZScsICdsaScsICQucHJveHkodGhpcy5tb3VzZWxlYXZlLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWRvd24nLCAkLnByb3h5KHRoaXMubW91c2Vkb3duLHRoaXMpKTtcbi8vICAgICB9LFxuXG4vLyAgICAgZGVzdHJveSA6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgndHlwZWFoZWFkJyxudWxsKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJyxudWxsKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnRcbi8vICAgICAgICAgLm9mZignZm9jdXMnKVxuLy8gICAgICAgICAub2ZmKCdibHVyJylcbi8vICAgICAgICAgLm9mZigna2V5cHJlc3MnKVxuLy8gICAgICAgICAub2ZmKCdpbnB1dCcpXG4vLyAgICAgICAgIC5vZmYoJ2tleXVwJyk7XG5cbi8vICAgICAgIGlmICh0aGlzLmV2ZW50U3VwcG9ydGVkKCdrZXlkb3duJykpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2tleWRvd24nKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgdGhpcy4kbWVudS5yZW1vdmUoKTtcbi8vICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbi8vICAgICB9LFxuXG4vLyAgICAgZXZlbnRTdXBwb3J0ZWQ6IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbi8vICAgICAgIHZhciBpc1N1cHBvcnRlZCA9IGV2ZW50TmFtZSBpbiB0aGlzLiRlbGVtZW50O1xuLy8gICAgICAgaWYgKCFpc1N1cHBvcnRlZCkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LnNldEF0dHJpYnV0ZShldmVudE5hbWUsICdyZXR1cm47Jyk7XG4vLyAgICAgICAgIGlzU3VwcG9ydGVkID0gdHlwZW9mIHRoaXMuJGVsZW1lbnRbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJztcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBpc1N1cHBvcnRlZDtcbi8vICAgICB9LFxuXG4vLyAgICAgbW92ZTogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuXG4vLyAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuLy8gICAgICAgICBjYXNlIDk6IC8vIHRhYlxuLy8gICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuLy8gICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbi8vICAgICAgICAgICAvLyB3aXRoIHRoZSBzaGlmdEtleSAodGhpcyBpcyBhY3R1YWxseSB0aGUgbGVmdCBwYXJlbnRoZXNpcylcbi8vICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkgcmV0dXJuO1xuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICB0aGlzLnByZXYoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4vLyAgICAgICAgICAgLy8gd2l0aCB0aGUgc2hpZnRLZXkgKHRoaXMgaXMgYWN0dWFsbHkgdGhlIHJpZ2h0IHBhcmVudGhlc2lzKVxuLy8gICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSByZXR1cm47XG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIHRoaXMubmV4dCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5zdXBwcmVzc0tleVByZXNzUmVwZWF0ID0gfiQuaW5BcnJheShlLmtleUNvZGUsIFs0MCwzOCw5LDEzLDI3XSk7XG4vLyAgICAgICBpZiAoIXRoaXMuc2hvd24gJiYgZS5rZXlDb2RlID09IDQwKSB7XG4vLyAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLm1vdmUoZSk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleXByZXNzOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCkgcmV0dXJuO1xuLy8gICAgICAgdGhpcy5tb3ZlKGUpO1xuLy8gICAgIH0sXG5cbi8vICAgICBpbnB1dDogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIC8vIFRoaXMgaXMgYSBmaXhlZCBmb3IgSUUxMC8xMSB0aGF0IGZpcmVzIHRoZSBpbnB1dCBldmVudCB3aGVuIGEgcGxhY2Vob2RlciBpcyBjaGFuZ2VkXG4vLyAgICAgICAvLyAoaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MTA1MzgvaWUtMTEtZmlyZXMtaW5wdXQtZXZlbnQtb24tZm9jdXMpXG4vLyAgICAgICB2YXIgY3VycmVudFZhbHVlID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKTtcbi8vICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBjdXJyZW50VmFsdWUpIHtcbi8vICAgICAgICAgdGhpcy52YWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbi8vICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5dXA6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbi8vICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgfVxuLy8gICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbi8vICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuLy8gICAgICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuLy8gICAgICAgICBjYXNlIDE2OiAvLyBzaGlmdFxuLy8gICAgICAgICBjYXNlIDE3OiAvLyBjdHJsXG4vLyAgICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4vLyAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4vLyAgICAgICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG4vLyAgICAgICAgICAgdGhpcy5zZWxlY3QoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbi8vICAgICAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcbi8vICAgICAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICAgICAgICBicmVhaztcbi8vICAgICAgIH1cblxuXG4vLyAgICAgfSxcblxuLy8gICAgIGZvY3VzOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHtcbi8vICAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbi8vICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgJiYgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzICE9PSB0cnVlKSB7XG4vLyAgICAgICAgICAgaWYodGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PT0gXCJhbGxcIikge1xuLy8gICAgICAgICAgICAgdGhpcy5sb29rdXAoXCJcIik7IFxuLy8gICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgICAgaWYgKHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cykge1xuLy8gICAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSBmYWxzZTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAgYmx1cjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5tb3VzZWRvdmVyICYmICF0aGlzLm1vdXNlZGRvd24gJiYgdGhpcy5zaG93bikge1xuLy8gICAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMubW91c2VkZG93bikge1xuLy8gICAgICAgICAvLyBUaGlzIGlzIGZvciBJRSB0aGF0IGJsdXJzIHRoZSBpbnB1dCB3aGVuIHVzZXIgY2xpY2tzIG9uIHNjcm9sbC5cbi8vICAgICAgICAgLy8gV2Ugc2V0IHRoZSBmb2N1cyBiYWNrIG9uIHRoZSBpbnB1dCBhbmQgcHJldmVudCB0aGUgbG9va3VwIHRvIG9jY3VyIGFnYWluXG4vLyAgICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IHRydWU7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbi8vICAgICAgICAgdGhpcy5tb3VzZWRkb3duID0gZmFsc2U7XG4vLyAgICAgICB9IFxuLy8gICAgIH0sXG5cbi8vICAgICBjbGljazogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IHRydWU7XG4vLyAgICAgICB0aGlzLnNlbGVjdCgpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5mb2N1cygpO1xuLy8gICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZG92ZXIgPSB0cnVlO1xuLy8gICAgICAgdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbW91c2VsZWF2ZTogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2Vkb3ZlciA9IGZhbHNlO1xuLy8gICAgICAgaWYgKCF0aGlzLmZvY3VzZWQgJiYgdGhpcy5zaG93bikgdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgLyoqXG4vLyAgICAgICogV2UgdHJhY2sgdGhlIG1vdXNlZG93biBmb3IgSUUuIFdoZW4gY2xpY2tpbmcgb24gdGhlIG1lbnUgc2Nyb2xsYmFyLCBJRSBtYWtlcyB0aGUgaW5wdXQgYmx1ciB0aHVzIGhpZGluZyB0aGUgbWVudS5cbi8vICAgICAgKi9cbi8vICAgICBtb3VzZWRvd246IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZGRvd24gPSB0cnVlO1xuLy8gICAgICAgdGhpcy4kbWVudS5vbmUoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKGUpe1xuLy8gICAgICAgICAvLyBJRSB3b24ndCBmaXJlIHRoaXMsIGJ1dCBGRiBhbmQgQ2hyb21lIHdpbGwgc28gd2UgcmVzZXQgb3VyIGZsYWcgZm9yIHRoZW0gaGVyZVxuLy8gICAgICAgICB0aGlzLm1vdXNlZGRvd24gPSBmYWxzZTtcbi8vICAgICAgIH0uYmluZCh0aGlzKSk7XG4vLyAgICAgfSxcblxuLy8gICB9O1xuXG5cbi8vICAgLyogVFlQRUFIRUFEIFBMVUdJTiBERUZJTklUSU9OXG4vLyAgICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgIHZhciBvbGQgPSAkLmZuLnR5cGVhaGVhZDtcblxuLy8gICAkLmZuLnR5cGVhaGVhZCA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbi8vICAgICB2YXIgYXJnID0gYXJndW1lbnRzO1xuLy8gICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnICYmIG9wdGlvbiA9PSAnZ2V0QWN0aXZlJykge1xuLy8gICAgICAgcmV0dXJuIHRoaXMuZGF0YSgnYWN0aXZlJyk7XG4vLyAgICAgfVxuLy8gICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbi8vICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgndHlwZWFoZWFkJyk7XG4vLyAgICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uO1xuLy8gICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCd0eXBlYWhlYWQnLCAoZGF0YSA9IG5ldyBUeXBlYWhlYWQodGhpcywgb3B0aW9ucykpKTtcbi8vICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnICYmIGRhdGFbb3B0aW9uXSkge1xuLy8gICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDEpIHtcbi8vICAgICAgICAgICBkYXRhW29wdGlvbl0uYXBwbHkoZGF0YSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJnLCAxKSk7XG4vLyAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgZGF0YVtvcHRpb25dKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfTtcblxuLy8gICAkLmZuLnR5cGVhaGVhZC5kZWZhdWx0cyA9IHtcbi8vICAgICBzb3VyY2U6IFtdLFxuLy8gICAgIGl0ZW1zOiA4LFxuLy8gICAgIG1lbnU6ICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgZHJvcGRvd24tbWVudVwiIHJvbGU9XCJsaXN0Ym94XCI+PC91bD4nLFxuLy8gICAgIGl0ZW06ICc8bGk+PGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cIiNcIiByb2xlPVwib3B0aW9uXCI+PC9hPjwvbGk+Jyxcbi8vICAgICBtaW5MZW5ndGg6IDEsXG4vLyAgICAgc2Nyb2xsSGVpZ2h0OiAwLFxuLy8gICAgIGF1dG9TZWxlY3Q6IHRydWUsXG4vLyAgICAgYWZ0ZXJTZWxlY3Q6ICQubm9vcCxcbi8vICAgICBhZGRJdGVtOiBmYWxzZSxcbi8vICAgICBkZWxheTogMCxcbi8vICAgICBzZXBhcmF0b3I6ICdjYXRlZ29yeScsXG4vLyAgICAgaGVhZGVySHRtbDogJzxsaSBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiPjwvbGk+Jyxcbi8vICAgICBoZWFkZXJEaXZpZGVyOiAnPGxpIGNsYXNzPVwiZGl2aWRlclwiIHJvbGU9XCJzZXBhcmF0b3JcIj48L2xpPidcbi8vICAgfTtcblxuLy8gICAkLmZuLnR5cGVhaGVhZC5Db25zdHJ1Y3RvciA9IFR5cGVhaGVhZDtcblxuLy8gIC8qIFRZUEVBSEVBRCBOTyBDT05GTElDVFxuLy8gICAqID09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICAkLmZuLnR5cGVhaGVhZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICQuZm4udHlwZWFoZWFkID0gb2xkO1xuLy8gICAgIHJldHVybiB0aGlzO1xuLy8gICB9O1xuXG5cbi8vICAvKiBUWVBFQUhFQUQgREFUQS1BUElcbi8vICAgKiA9PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICAkKGRvY3VtZW50KS5vbignZm9jdXMudHlwZWFoZWFkLmRhdGEtYXBpJywgJ1tkYXRhLXByb3ZpZGU9XCJ0eXBlYWhlYWRcIl0nLCBmdW5jdGlvbiAoZSkge1xuLy8gICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4vLyAgICAgaWYgKCR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpKSByZXR1cm47XG4vLyAgICAgJHRoaXMudHlwZWFoZWFkKCR0aGlzLmRhdGEoKSk7XG4vLyAgIH0pO1xuXG4vLyB9KSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9tYWluLnRzXG4gKiovIiwiXG5jbGFzcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQgcmVzdWx0czpBcnJheTxPYmplY3Q+O1xuXG5cdHByb3RlY3RlZCBfc2V0dGluZ3M6YW55O1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0dGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0UmVzdWx0cyhsaW1pdD86bnVtYmVyLCBzdGFydD86bnVtYmVyLCBlbmQ/Om51bWJlcik6QXJyYXk8T2JqZWN0PiB7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMucmVzdWx0cztcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0Y2JrKHRoaXMuZ2V0UmVzdWx0cygpKTtcblx0fVxuXG59XG5cbmV4cG9ydCBjbGFzcyBBamF4UmVzb2x2ZXIgZXh0ZW5kcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQganFYSFI6SlF1ZXJ5WEhSO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHRjb25zb2xlLmxvZygncmVzb2x2ZXIgc2V0dGluZ3MnLCB0aGlzLl9zZXR0aW5ncyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJycsXG5cdFx0XHRtZXRob2Q6ICdnZXQnLFxuXHRcdFx0cXVlcnlLZXk6ICdxJyxcblx0XHRcdGV4dHJhRGF0YToge30sXG5cdFx0XHR0aW1lb3V0OiB1bmRlZmluZWQsXG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0aWYgKHRoaXMuanFYSFIgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5qcVhIUi5hYm9ydCgpO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhOk9iamVjdCA9IHt9O1xuXHRcdGRhdGFbdGhpcy5fc2V0dGluZ3MucXVlcnlLZXldID0gcTtcblx0XHQkLmV4dGVuZChkYXRhLCB0aGlzLl9zZXR0aW5ncy5leHRyYURhdGEpO1xuXG5cdFx0dGhpcy5qcVhIUiA9ICQuYWpheChcblx0XHRcdHRoaXMuX3NldHRpbmdzLnVybCxcblx0XHRcdHtcblx0XHRcdFx0bWV0aG9kOiB0aGlzLl9zZXR0aW5ncy5tZXRob2QsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHRpbWVvdXQ6IHRoaXMuX3NldHRpbmdzLnRpbWVvdXRcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dGhpcy5qcVhIUi5kb25lKChyZXN1bHQpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5qcVhIUi5mYWlsKChlcnIpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmpxWEhSLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmpxWEhSID0gbnVsbDtcblx0XHR9KTtcblx0fVxuXG5cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXNvbHZlcnMudHNcbiAqKi8iLCIvKlxuICpcdERyb3Bkb3duIGNsYXNzLiBNYW5hZ2VzIHRoZSBkcm9wZG93biBkcmF3aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBEcm9wZG93biB7XG5cdHByb3RlY3RlZCBfJGVsOkpRdWVyeTtcblx0cHJvdGVjdGVkIGluaXRpYWxpemVkOmJvb2xlYW4gPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSkge1xuXHRcdHRoaXMuXyRlbCA9IGU7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBpbml0KCk6dm9pZCB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSBkcm9wZG93blxuXHRcdGxldCBkZFVsOkpRdWVyeSA9ICQoJzx1bCAvPicpO1xuXG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdGRkVWwuYWRkQ2xhc3MoJ2Jvb3RzdHJhcC1hdXRvY29tcGxldGUgZHJvcGRvd24tbWVudScpO1xuXHRcdGRkVWwuYXBwZW5kKFwiPGxpPjxhIGhyZWY9JyMnPnQxPC9hPjwvbGk+XCIpO1xuXG5cdFx0ZGRVbC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXHRcdGRkVWwuZHJvcGRvd24oKS5zaG93KCk7XG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdH1cblxuXHRwdWJsaWMgc2hvdygpOnZvaWQge1xuXHRcdGlmICghdGhpcy5pbml0aWFsaXplZClcblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdFxuXHRcdHJldHVybjtcblx0fVxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Ryb3Bkb3duLnRzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==