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
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/* =============================================================
	 * bootstrap-autocomplete.js v1.0.0-rc1
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
	                    else {
	                        // It's a text element, we accept custom value.
	                        // Developers may subscribe to `autocomplete.freevalue` to get notified of this
	                        if ((_this._selectedItem === null) && (_this._$el.val() !== '')) {
	                            _this._$el.trigger('autocomplete.freevalue', _this._$el.val());
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
	        AutoComplete.prototype.manageAPI = function (APICmd, params) {
	            // manages public API
	            if (APICmd === 'set') {
	                this.itemSelectedDefaultHandler(params);
	            }
	        };
	        return AutoComplete;
	    }());
	    AutoComplete.NAME = 'autoComplete';
	    AutoCompleteNS.AutoComplete = AutoComplete;
	})(AutoCompleteNS || (AutoCompleteNS = {}));
	(function ($, window, document) {
	    $.fn[AutoCompleteNS.AutoComplete.NAME] = function (optionsOrAPI, optionalParams) {
	        return this.each(function () {
	            var pluginClass;
	            pluginClass = $(this).data(AutoCompleteNS.AutoComplete.NAME);
	            if (!pluginClass) {
	                pluginClass = new AutoCompleteNS.AutoComplete(this, optionsOrAPI);
	                $(this).data(AutoCompleteNS.AutoComplete.NAME, pluginClass);
	            }
	            pluginClass.manageAPI(optionsOrAPI, optionalParams);
	        });
	    };
	})(jQuery, window, document);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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
	        // initialize it in lazy mode to deal with glitches like modals
	        // this.init();
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
	    Dropdown.prototype.checkInitialized = function () {
	        // Lazy init
	        if (!this.initialized) {
	            // if not already initialized
	            this.init();
	        }
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
	        this.checkInitialized();
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTk0ZGI2Zjc4MWE3MGIzM2IyMWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttRUFtQmtFO0FBQ2xFLDBDQUEyQztBQUMzQyx5Q0FBc0M7QUFFdEMsS0FBTyxjQUFjLENBMlVwQjtBQTNVRCxZQUFPLGNBQWM7S0FDbkI7U0FpQ0Usc0JBQVksT0FBZSxFQUFFLE9BQVc7YUExQmhDLGtCQUFhLEdBQU8sSUFBSSxDQUFDO2FBQ3pCLGtCQUFhLEdBQU8sSUFBSSxDQUFDO2FBQ3pCLGlCQUFZLEdBQVUsSUFBSSxDQUFDO2FBQzNCLHFCQUFnQixHQUFXLEtBQUssQ0FBQzthQUdqQyxjQUFTLEdBQUc7aUJBQ2xCLFFBQVEsRUFBVSxNQUFNO2lCQUN4QixnQkFBZ0IsRUFBTyxFQUFFO2lCQUN6QixTQUFTLEVBQVUsQ0FBQztpQkFDcEIsUUFBUSxFQUFVLE9BQU87aUJBQ3pCLFlBQVksRUFBWSxJQUFJLENBQUMsbUJBQW1CO2lCQUNoRCxVQUFVLEVBQVcsSUFBSTtpQkFDekIsYUFBYSxFQUFVLFlBQVk7aUJBQ25DLE1BQU0sRUFBRTtxQkFDTixLQUFLLEVBQVksSUFBSTtxQkFDckIsU0FBUyxFQUFZLElBQUk7cUJBQ3pCLE1BQU0sRUFBWSxJQUFJO3FCQUN0QixVQUFVLEVBQVksSUFBSTtxQkFDMUIsTUFBTSxFQUFZ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QUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekIsQ0FBQztLQUVTLDBDQUF1QixHQUFqQyxVQUFrQyxJQUFRO1NBQ3pDLHdCQUF3QjtTQUN4QixnREFBZ0Q7U0FDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDO0tBQy9DLENBQUM7S0FFRixlQUFDO0FBQUQsRUFBQztBQTlNWSw2QkFBUSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTk0ZGI2Zjc4MWE3MGIzM2IyMWYiLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtYXV0b2NvbXBsZXRlLmpzIHYxLjAuMC1yYzFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS94Y2FzaC9ib290c3RyYXAtYXV0b2NvbXBsZXRlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBGb3JrZWQgZnJvbSBib290c3RyYXAzLXR5cGVhaGVhZC5qcyB2My4xLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iYXNzam9ic2VuL0Jvb3RzdHJhcC0zLVR5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogT3JpZ2luYWwgd3JpdHRlbiBieSBAbWRvIGFuZCBAZmF0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxNiBQYW9sbyBDYXNjaWVsbG8gQHhjYXNoNjY2IGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5pbXBvcnQgeyBBamF4UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5tb2R1bGUgQXV0b0NvbXBsZXRlTlMge1xuICBleHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBwdWJsaWMgc3RhdGljIE5BTUU6c3RyaW5nID0gJ2F1dG9Db21wbGV0ZSc7XG5cbiAgICBwcml2YXRlIF9lbDpFbGVtZW50O1xuICAgIHByaXZhdGUgXyRlbDpKUXVlcnk7XG4gICAgcHJpdmF0ZSBfZGQ6RHJvcGRvd247XG4gICAgcHJpdmF0ZSBfc2VhcmNoVGV4dDpzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRJdGVtOmFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZGVmYXVsdFZhbHVlOmFueSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZGVmYXVsdFRleHQ6c3RyaW5nID0gbnVsbDtcbiAgICBwcml2YXRlIF9pc1NlbGVjdEVsZW1lbnQ6Ym9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3NlbGVjdEhpZGRlbkZpZWxkOkpRdWVyeTtcblxuICAgIHByaXZhdGUgX3NldHRpbmdzID0ge1xuICAgICAgcmVzb2x2ZXI6PHN0cmluZz4gJ2FqYXgnLFxuICAgICAgcmVzb2x2ZXJTZXR0aW5nczo8YW55PiB7fSxcbiAgICAgIG1pbkxlbmd0aDo8bnVtYmVyPiAzLFxuICAgICAgdmFsdWVLZXk6PHN0cmluZz4gJ3ZhbHVlJyxcbiAgICAgIGZvcm1hdFJlc3VsdDo8RnVuY3Rpb24+IHRoaXMuZGVmYXVsdEZvcm1hdFJlc3VsdCxcbiAgICAgIGF1dG9TZWxlY3Q6PGJvb2xlYW4+IHRydWUsXG4gICAgICBub1Jlc3VsdHNUZXh0OjxzdHJpbmc+ICdObyByZXN1bHRzJyxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICB0eXBlZDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFByZTo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlYXJjaFBvc3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWxlY3Q6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBmb2N1czo8RnVuY3Rpb24+IG51bGwsXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcmVzb2x2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkVsZW1lbnQsIG9wdGlvbnM/Ont9KSB7XG4gICAgICB0aGlzLl9lbCA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLl8kZWwgPSAkKHRoaXMuX2VsKTtcblxuICAgICAgLy8gZWxlbWVudCB0eXBlXG4gICAgICBpZiAodGhpcy5fJGVsLmlzKCdzZWxlY3QnKSkge1xuICAgICAgICB0aGlzLl9pc1NlbGVjdEVsZW1lbnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gaW5saW5lIGRhdGEgYXR0cmlidXRlc1xuICAgICAgdGhpcy5tYW5hZ2VJbmxpbmVEYXRhQXR0cmlidXRlcygpO1xuICAgICAgLy8gY29uc3RydWN0b3Igb3B0aW9uc1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldFNldHRpbmdzKCksIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICB0aGlzLmNvbnZlcnRTZWxlY3RUb1RleHQoKTtcbiAgICAgIH0gXG4gICAgICBcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpbml0aWFsaXppbmcnLCB0aGlzLl9zZXR0aW5ncyk7XG4gICAgICBcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFuYWdlSW5saW5lRGF0YUF0dHJpYnV0ZXMoKSB7XG4gICAgICAvLyB1cGRhdGVzIHNldHRpbmdzIHdpdGggZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgIGxldCBzID0gdGhpcy5nZXRTZXR0aW5ncygpO1xuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCd1cmwnKSkge1xuICAgICAgICBzWydyZXNvbHZlclNldHRpbmdzJ10udXJsID0gdGhpcy5fJGVsLmRhdGEoJ3VybCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXZhbHVlJykpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFZhbHVlID0gdGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdmFsdWUnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC10ZXh0JykpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFRleHQgPSB0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC10ZXh0Jyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ25vcmVzdWx0cy10ZXh0JykpIHtcbiAgICAgICAgc1snbm9SZXN1bHRzVGV4dCddID0gdGhpcy5fJGVsLmRhdGEoJ25vcmVzdWx0cy10ZXh0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTZXR0aW5ncygpOnt9IHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnZlcnRTZWxlY3RUb1RleHQoKSB7XG4gICAgICAvLyBjcmVhdGUgaGlkZGVuIGZpZWxkXG5cbiAgICAgIGxldCBoaWRGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICBoaWRGaWVsZC5hdHRyKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgaGlkRmllbGQuYXR0cignbmFtZScsIHRoaXMuXyRlbC5hdHRyKCduYW1lJykpO1xuICAgICAgaWYgKHRoaXMuX2RlZmF1bHRWYWx1ZSkge1xuICAgICAgICBoaWRGaWVsZC52YWwodGhpcy5fZGVmYXVsdFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkID0gaGlkRmllbGQ7XG4gICAgICBcbiAgICAgIGhpZEZpZWxkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cbiAgICAgIC8vIGNyZWF0ZSBzZWFyY2ggaW5wdXQgZWxlbWVudFxuICAgICAgbGV0IHNlYXJjaEZpZWxkOkpRdWVyeSA9ICQoJzxpbnB1dD4nKTtcbiAgICAgIC8vIGNvcHkgYWxsIGF0dHJpYnV0ZXNcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignbmFtZScsIHRoaXMuXyRlbC5hdHRyKCduYW1lJykgKyAnX3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2lkJywgdGhpcy5fJGVsLmF0dHIoJ2lkJykpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignZGlzYWJsZWQnLCB0aGlzLl8kZWwuYXR0cignZGlzYWJsZWQnKSk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdwbGFjZWhvbGRlcicsIHRoaXMuXyRlbC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2F1dG9jb21wbGV0ZScsICdvZmYnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmFkZENsYXNzKHRoaXMuXyRlbC5hdHRyKCdjbGFzcycpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VGV4dCkge1xuICAgICAgICBzZWFyY2hGaWVsZC52YWwodGhpcy5fZGVmYXVsdFRleHQpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBhdHRhY2ggY2xhc3NcbiAgICAgIHNlYXJjaEZpZWxkLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHRoaXMpO1xuXG4gICAgICAvLyByZXBsYWNlIG9yaWdpbmFsIHdpdGggc2VhcmNoRmllbGRcbiAgICAgIHRoaXMuXyRlbC5yZXBsYWNlV2l0aChzZWFyY2hGaWVsZCk7XG4gICAgICB0aGlzLl8kZWwgPSBzZWFyY2hGaWVsZDtcbiAgICAgIHRoaXMuX2VsID0gc2VhcmNoRmllbGQuZ2V0KDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdCgpOnZvaWQge1xuICAgICAgLy8gYmluZCBkZWZhdWx0IGV2ZW50c1xuICAgICAgdGhpcy5iaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAvLyBSRVNPTFZFUlxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyID09PSAnYWpheCcpIHtcbiAgICAgICAgLy8gY29uZmlndXJlIGRlZmF1bHQgcmVzb2x2ZXJcbiAgICAgICAgdGhpcy5yZXNvbHZlciA9IG5ldyBBamF4UmVzb2x2ZXIodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXJTZXR0aW5ncyk7XG4gICAgICB9XG4gICAgICAvLyBEcm9wZG93blxuICAgICAgdGhpcy5fZGQgPSBuZXcgRHJvcGRvd24odGhpcy5fJGVsLCB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MuYXV0b1NlbGVjdCwgdGhpcy5fc2V0dGluZ3Mubm9SZXN1bHRzVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBiaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk6dm9pZCB7XG4gICAgICB0aGlzLl8kZWwub24oJ2tleWRvd24nLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG5cdFx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHRcdC8vIGFycm93IERPV05cbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzODogLy8gdXAgYXJyb3dcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA5OiAvLyBUQUJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5hdXRvU2VsZWN0KSB7XG4gICAgICAgICAgICAgIC8vIGlmIGF1dG9TZWxlY3QgZW5hYmxlZCBzZWxlY3RzIG9uIGJsdXIgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBpdGVtXG4gICAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfVxuXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICB0aGlzLl8kZWwub24oJ2ZvY3VzIGtleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjaGVjayBrZXlcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcbiAgICAgICAgICBjYXNlIDE2OiAvLyBzaGlmdFxuICAgICAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbiAgICAgICAgICBjYXNlIDE4OiAvLyBhbHRcbiAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodFxuICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnQgXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgRE9XTlxuICAgICAgICAgICAgdGhpcy5fZGQuZm9jdXNOZXh0SXRlbSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzODogLy8gdXAgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuX2RkLmZvY3VzUHJldmlvdXNJdGVtKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDEzOiAvLyBFTlRFUlxuICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0NcbiAgICAgICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLl8kZWwudmFsKCk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXJUeXBlZChuZXdWYWx1ZSk7XG5cdFx0XHRcdH1cbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fJGVsLm9uKCdibHVyJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgICBpZiAoIXRoaXMuX2RkLmlzTW91c2VPdmVyKSB7XG5cbiAgICAgICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgc2VsZWN0IGVsZW1lbnQgeW91IG11c3RcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZC5pc0l0ZW1Gb2N1c2VkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKHRoaXMuX3NlbGVjdGVkSXRlbSAhPT0gbnVsbCkgJiYgKHRoaXMuXyRlbC52YWwoKSAhPT0gJycpICkge1xuICAgICAgICAgICAgICAvLyByZXNlbGVjdCBpdFxuICAgICAgICAgICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIHRoaXMuX3NlbGVjdGVkSXRlbSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAodGhpcy5fJGVsLnZhbCgpICE9PSAnJykgJiYgKHRoaXMuX2RlZmF1bHRWYWx1ZSAhPT0gbnVsbCkgKSB7XG4gICAgICAgICAgICAgIC8vIHNlbGVjdCBEZWZhdWx0XG4gICAgICAgICAgICAgIHRoaXMuXyRlbC52YWwodGhpcy5fZGVmYXVsdFRleHQpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwodGhpcy5fZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGVtcHR5IHRoZSB2YWx1ZXNcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0J3MgYSB0ZXh0IGVsZW1lbnQsIHdlIGFjY2VwdCBjdXN0b20gdmFsdWUuXG4gICAgICAgICAgICAvLyBEZXZlbG9wZXJzIG1heSBzdWJzY3JpYmUgdG8gYGF1dG9jb21wbGV0ZS5mcmVldmFsdWVgIHRvIGdldCBub3RpZmllZCBvZiB0aGlzXG4gICAgICAgICAgICBpZiAoICh0aGlzLl9zZWxlY3RlZEl0ZW0gPT09IG51bGwpICYmICh0aGlzLl8kZWwudmFsKCkgIT09ICcnKSApIHtcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5mcmVldmFsdWUnLCB0aGlzLl8kZWwudmFsKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHNlbGVjdGVkIGV2ZW50XG4gICAgICB0aGlzLl8kZWwub24oJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCBpdGVtOmFueSkgPT4ge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgICAgICB0aGlzLml0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW0pO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBoYW5kbGVyVHlwZWQobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGZpZWxkIHZhbHVlIGNoYW5nZWRcblxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy50eXBlZCAhPT0gbnVsbCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy50eXBlZChuZXdWYWx1ZSk7XG4gICAgICAgIGlmICghbmV3VmFsdWUpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB2YWx1ZSA+PSBtaW5MZW5ndGgsIHN0YXJ0IGF1dG9jb21wbGV0ZVxuICAgICAgaWYgKG5ld1ZhbHVlLmxlbmd0aCA+PSB0aGlzLl9zZXR0aW5ncy5taW5MZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fc2VhcmNoVGV4dCA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLmhhbmRsZXJQcmVTZWFyY2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJQcmVTZWFyY2goKTp2b2lkIHtcbiAgICAgIC8vIGRvIG5vdGhpbmcsIHN0YXJ0IHNlYXJjaFxuICAgICAgXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFByZSAhPT0gbnVsbCkge1xuICAgICAgICBsZXQgbmV3VmFsdWU6c3RyaW5nID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFByZSh0aGlzLl9zZWFyY2hUZXh0KTtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3NlYXJjaFRleHQgPSBuZXdWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVyRG9TZWFyY2goKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJEb1NlYXJjaCgpOnZvaWQge1xuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2ggIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaCh0aGlzLl9zZWFyY2hUZXh0LCAocmVzdWx0czphbnkpID0+IHtcbiAgICAgICAgICB0aGlzLnBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEZWZhdWx0IGJlaGF2aW91clxuICAgICAgICAvLyBzZWFyY2ggdXNpbmcgY3VycmVudCByZXNvbHZlclxuICAgICAgICBpZiAodGhpcy5yZXNvbHZlcikge1xuICAgICAgICAgIHRoaXMucmVzb2x2ZXIuc2VhcmNoKHRoaXMuX3NlYXJjaFRleHQsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0cyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2sgY2FsbGVkJywgcmVzdWx0cyk7XG4gICAgICBcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUG9zdCkge1xuICAgICAgICByZXN1bHRzID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFBvc3QocmVzdWx0cyk7XG4gICAgICAgIGlmICggKHR5cGVvZiByZXN1bHRzID09PSAnYm9vbGVhbicpICYmICFyZXN1bHRzKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVyU3RhcnRTaG93KHJlc3VsdHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlclN0YXJ0U2hvdyhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImRlZmF1bHRFdmVudFN0YXJ0U2hvd1wiLCByZXN1bHRzKTtcbiAgICAgIC8vIGZvciBldmVyeSByZXN1bHQsIGRyYXcgaXRcbiAgICAgIHRoaXMuX2RkLnVwZGF0ZUl0ZW1zKHJlc3VsdHMsIHRoaXMuX3NlYXJjaFRleHQpO1xuICAgICAgdGhpcy5fZGQuc2hvdygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihpdGVtOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXInLCBpdGVtKTtcbiAgICAgIC8vIGRlZmF1bHQgYmVoYXZpb3VyIGlzIHNldCBlbG1lbnQncyAudmFsKClcbiAgICAgIGxldCBpdGVtRm9ybWF0dGVkOmFueSA9IHRoaXMuX3NldHRpbmdzLmZvcm1hdFJlc3VsdChpdGVtKTtcblx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0aXRlbUZvcm1hdHRlZCA9IHsgdGV4dDogaXRlbUZvcm1hdHRlZCB9XG5cdFx0XHR9XG4gICAgICB0aGlzLl8kZWwudmFsKGl0ZW1Gb3JtYXR0ZWQudGV4dCk7XG4gICAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhIHNlbGVjdFxuICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwoaXRlbUZvcm1hdHRlZC52YWx1ZSk7XG4gICAgICB9XG4gICAgICAvLyBzYXZlIHNlbGVjdGVkIGl0ZW1cbiAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGl0ZW07XG4gICAgICAvLyBhbmQgaGlkZVxuICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEZvcm1hdFJlc3VsdChpdGVtOmFueSk6e30ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtIH07XG4gICAgICB9IGVsc2UgaWYgKCBpdGVtLnRleHQgKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV0dXJuIGEgdG9TdHJpbmcgb2YgdGhlIGl0ZW0gYXMgbGFzdCByZXNvcnRcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignTm8gZGVmYXVsdCBmb3JtYXR0ZXIgZm9yIGl0ZW0nLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbS50b1N0cmluZygpIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbWFuYWdlQVBJKEFQSUNtZDphbnksIHBhcmFtczphbnkpIHtcbiAgICAgIC8vIG1hbmFnZXMgcHVibGljIEFQSVxuICAgICAgaWYgKEFQSUNtZCA9PT0gJ3NldCcpIHtcbiAgICAgICAgdGhpcy5pdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihwYXJhbXMpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG59XG5cbihmdW5jdGlvbigkOiBKUXVlcnlTdGF0aWMsIHdpbmRvdzogYW55LCBkb2N1bWVudDogYW55KSB7XG4gICQuZm5bQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUVdID0gZnVuY3Rpb24ob3B0aW9uc09yQVBJOiBhbnksIG9wdGlvbmFsUGFyYW1zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBsdWdpbkNsYXNzOkF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZTtcblxuICAgICAgcGx1Z2luQ2xhc3MgPSAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUpO1xuXG4gICAgICBpZiAoIXBsdWdpbkNsYXNzKSB7XG4gICAgICAgIHBsdWdpbkNsYXNzID0gbmV3IEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZSh0aGlzLCBvcHRpb25zT3JBUEkpOyBcbiAgICAgICAgJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCBwbHVnaW5DbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIHBsdWdpbkNsYXNzLm1hbmFnZUFQSShvcHRpb25zT3JBUEksIG9wdGlvbmFsUGFyYW1zKTtcbiAgICB9KTtcbiAgfTtcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFpbi50cyIsIlxuY2xhc3MgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIHJlc3VsdHM6QXJyYXk8T2JqZWN0PjtcblxuXHRwcm90ZWN0ZWQgX3NldHRpbmdzOmFueTtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldFJlc3VsdHMobGltaXQ/Om51bWJlciwgc3RhcnQ/Om51bWJlciwgZW5kPzpudW1iZXIpOkFycmF5PE9iamVjdD4ge1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLnJlc3VsdHM7XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGNiayh0aGlzLmdldFJlc3VsdHMoKSk7XG5cdH1cblxufVxuXG5leHBvcnQgY2xhc3MgQWpheFJlc29sdmVyIGV4dGVuZHMgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIGpxWEhSOkpRdWVyeVhIUjtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coJ3Jlc29sdmVyIHNldHRpbmdzJywgdGhpcy5fc2V0dGluZ3MpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICcnLFxuXHRcdFx0bWV0aG9kOiAnZ2V0Jyxcblx0XHRcdHF1ZXJ5S2V5OiAncScsXG5cdFx0XHRleHRyYURhdGE6IHt9LFxuXHRcdFx0dGltZW91dDogdW5kZWZpbmVkLFxuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGlmICh0aGlzLmpxWEhSICE9IG51bGwpIHtcblx0XHRcdHRoaXMuanFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHRsZXQgZGF0YTpPYmplY3QgPSB7fTtcblx0XHRkYXRhW3RoaXMuX3NldHRpbmdzLnF1ZXJ5S2V5XSA9IHE7XG5cdFx0JC5leHRlbmQoZGF0YSwgdGhpcy5fc2V0dGluZ3MuZXh0cmFEYXRhKTtcblxuXHRcdHRoaXMuanFYSFIgPSAkLmFqYXgoXG5cdFx0XHR0aGlzLl9zZXR0aW5ncy51cmwsXG5cdFx0XHR7XG5cdFx0XHRcdG1ldGhvZDogdGhpcy5fc2V0dGluZ3MubWV0aG9kLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0aW1lb3V0OiB0aGlzLl9zZXR0aW5ncy50aW1lb3V0XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHRoaXMuanFYSFIuZG9uZSgocmVzdWx0KSA9PiB7XG5cdFx0XHRjYmsocmVzdWx0KTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmpxWEhSLmZhaWwoKGVycikgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuanFYSFIuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuanFYSFIgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZXNvbHZlcnMudHMiLCIvKlxuICpcdERyb3Bkb3duIGNsYXNzLiBNYW5hZ2VzIHRoZSBkcm9wZG93biBkcmF3aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBEcm9wZG93biB7XG5cdHByb3RlY3RlZCBfJGVsOkpRdWVyeTtcblx0cHJvdGVjdGVkIF9kZDpKUXVlcnk7XG5cdHByb3RlY3RlZCBpbml0aWFsaXplZDpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBzaG93bjpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBpdGVtczphbnlbXSA9IFtdO1xuXHRwcm90ZWN0ZWQgZm9ybWF0SXRlbTpGdW5jdGlvbjtcblx0cHJvdGVjdGVkIHNlYXJjaFRleHQ6c3RyaW5nO1xuXHRwcm90ZWN0ZWQgYXV0b1NlbGVjdDpib29sZWFuO1xuXHRwcm90ZWN0ZWQgbW91c2VvdmVyOmJvb2xlYW47XG5cdHByb3RlY3RlZCBub1Jlc3VsdHNUZXh0OnN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbiwgYXV0b1NlbGVjdDpib29sZWFuLCBub1Jlc3VsdHNUZXh0OnN0cmluZykge1xuXHRcdHRoaXMuXyRlbCA9IGU7XG5cdFx0dGhpcy5mb3JtYXRJdGVtID0gZm9ybWF0SXRlbUNiaztcblx0XHR0aGlzLmF1dG9TZWxlY3QgPSBhdXRvU2VsZWN0O1xuXHRcdHRoaXMubm9SZXN1bHRzVGV4dCA9IG5vUmVzdWx0c1RleHQ7XG5cdFx0XG5cdFx0Ly8gaW5pdGlhbGl6ZSBpdCBpbiBsYXp5IG1vZGUgdG8gZGVhbCB3aXRoIGdsaXRjaGVzIGxpa2UgbW9kYWxzXG5cdFx0Ly8gdGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBpbml0KCk6dm9pZCB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSBkcm9wZG93blxuXHRcdGxldCBwb3M6YW55ID0gJC5leHRlbmQoe30sIHRoaXMuXyRlbC5wb3NpdGlvbigpLCB7XG4gICAgICAgIFx0XHRcdFx0aGVpZ2h0OiB0aGlzLl8kZWxbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgXHRcdFx0XHR9KTtcblx0XHRcblx0XHQvLyBjcmVhdGUgZWxlbWVudFxuXHRcdHRoaXMuX2RkID0gJCgnPHVsIC8+Jyk7XG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdHRoaXMuX2RkLmFkZENsYXNzKCdib290c3RyYXAtYXV0b2NvbXBsZXRlIGRyb3Bkb3duLW1lbnUnKTtcblxuXHRcdHRoaXMuX2RkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cdFx0dGhpcy5fZGQuY3NzKHsgdG9wOiBwb3MudG9wICsgdGhpcy5fJGVsLm91dGVySGVpZ2h0KCksIGxlZnQ6IHBvcy5sZWZ0LCB3aWR0aDogdGhpcy5fJGVsLm91dGVyV2lkdGgoKSB9KTtcblx0XHRcblx0XHQvLyBjbGljayBldmVudCBvbiBpdGVtc1xuXHRcdHRoaXMuX2RkLm9uKCdjbGljaycsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdjbGlja2VkJywgZXZ0LmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZygkKGV2dC5jdXJyZW50VGFyZ2V0KSk7XG5cdFx0XHRsZXQgaXRlbTphbnkgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5kYXRhKCdpdGVtJyk7XG5cdFx0XHR0aGlzLml0ZW1TZWxlY3RlZExhdW5jaEV2ZW50KGl0ZW0pO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuX2RkLm9uKCdrZXl1cCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG5cdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdC8vIEVTQ1xuXHRcdFx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRcdFx0XHR0aGlzLl8kZWwuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWVudGVyJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaGF2ZVJlc3VsdHMpIHtcblx0XHRcdFx0JChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCgndWwnKS5maW5kKCdsaS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0dGhpcy5tb3VzZW92ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlbGVhdmUnLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLm1vdXNlb3ZlciA9IGZhbHNlO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XG5cdH1cblxuXHRwcml2YXRlIGNoZWNrSW5pdGlhbGl6ZWQoKTp2b2lkIHtcblx0XHQvLyBMYXp5IGluaXRcblx0XHRpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcblx0XHRcdC8vIGlmIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkXG5cdFx0XHR0aGlzLmluaXQoKTtcblx0XHR9XG5cdH1cblxuXHRnZXQgaXNNb3VzZU92ZXIoKTpib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5tb3VzZW92ZXI7XG5cdH1cblxuXHRnZXQgaGF2ZVJlc3VsdHMoKTpib29sZWFuIHtcblx0XHRyZXR1cm4gKHRoaXMuaXRlbXMubGVuZ3RoID4gMCk7XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNOZXh0SXRlbShyZXZlcnNlZD86Ym9vbGVhbikge1xuXHRcdGlmICh0aGlzLmhhdmVSZXN1bHRzKSB7XG5cdFx0XHQvLyBnZXQgc2VsZWN0ZWRcblx0XHRcdGxldCBjdXJyRWxlbTpKUXVlcnkgPSB0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKTtcblx0XHRcdGxldCBuZXh0RWxlbTpKUXVlcnkgPSByZXZlcnNlZCA/IGN1cnJFbGVtLnByZXYoKSA6IGN1cnJFbGVtLm5leHQoKTtcblxuXHRcdFx0aWYgKG5leHRFbGVtLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdC8vIGZpcnN0IFxuXHRcdFx0XHRuZXh0RWxlbSA9IHJldmVyc2VkID8gdGhpcy5fZGQuZmluZCgnbGknKS5sYXN0KCkgOiB0aGlzLl9kZC5maW5kKCdsaScpLmZpcnN0KCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGN1cnJFbGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdG5leHRFbGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNQcmV2aW91c0l0ZW0oKSB7XG5cdFx0dGhpcy5mb2N1c05leHRJdGVtKHRydWUpO1xuXHR9XG5cblx0cHVibGljIHNlbGVjdEZvY3VzSXRlbSgpIHtcblx0XHR0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKS50cmlnZ2VyKCdjbGljaycpO1xuXHR9XG5cblx0Z2V0IGlzSXRlbUZvY3VzZWQoKTpib29sZWFuIHtcblx0XHRpZiAodGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJykubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBzaG93KCk6dm9pZCB7XG5cdFx0aWYgKCF0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLnNob3coKTtcblx0XHRcdHRoaXMuc2hvd24gPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBpc1Nob3duKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuc2hvd247XG5cdH1cblxuXHRwdWJsaWMgaGlkZSgpOnZvaWQge1xuXHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLmhpZGUoKTtcblx0XHRcdHRoaXMuc2hvd24gPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlSXRlbXMoaXRlbXM6YW55W10sIHNlYXJjaFRleHQ6c3RyaW5nKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZUl0ZW1zJywgaXRlbXMpO1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnNlYXJjaFRleHQgPSBzZWFyY2hUZXh0O1xuXHRcdHRoaXMucmVmcmVzaEl0ZW1MaXN0KCk7XG5cdH1cblxuXHRwcml2YXRlIHNob3dNYXRjaGVkVGV4dCh0ZXh0OnN0cmluZywgcXJ5OnN0cmluZyk6c3RyaW5nIHtcblx0XHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxcnkudG9Mb3dlckNhc2UoKSk7XG5cdFx0aWYgKHN0YXJ0SW5kZXggPiAtMSkge1xuXHRcdFx0bGV0IGVuZEluZGV4Om51bWJlciA9IHN0YXJ0SW5kZXggKyBxcnkubGVuZ3RoO1xuXG5cdFx0XHRyZXR1cm4gdGV4dC5zbGljZSgwLCBzdGFydEluZGV4KSArICc8Yj4nIFxuXHRcdFx0XHQrIHRleHQuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpICsgJzwvYj4nXG5cdFx0XHRcdCsgdGV4dC5zbGljZShlbmRJbmRleCk7XG5cdFx0fVxuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlZnJlc2hJdGVtTGlzdCgpIHtcblx0XHR0aGlzLmNoZWNrSW5pdGlhbGl6ZWQoKTtcblx0XHR0aGlzLl9kZC5lbXB0eSgpO1xuXHRcdGxldCBsaUxpc3Q6SlF1ZXJ5W10gPSBbXTtcblx0XHRpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRcdGxldCBpdGVtRm9ybWF0dGVkOmFueSA9IHRoaXMuZm9ybWF0SXRlbShpdGVtKTtcblx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtRm9ybWF0dGVkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGl0ZW1Gb3JtYXR0ZWQgPSB7IHRleHQ6IGl0ZW1Gb3JtYXR0ZWQgfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBpdGVtVGV4dDpzdHJpbmc7XG5cdFx0XHRcdGxldCBpdGVtSHRtbDphbnk7XG5cblx0XHRcdFx0aXRlbVRleHQgPSB0aGlzLnNob3dNYXRjaGVkVGV4dChpdGVtRm9ybWF0dGVkLnRleHQsIHRoaXMuc2VhcmNoVGV4dCk7XG5cdFx0XHRcdGlmICggaXRlbUZvcm1hdHRlZC5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtRm9ybWF0dGVkLmh0bWw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtVGV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0bGV0IGxpID0gJCgnPGxpID4nKTtcblx0XHRcdFx0bGkuYXBwZW5kKFxuXHRcdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLmh0bWwoaXRlbUh0bWwpXG5cdFx0XHRcdClcblx0XHRcdFx0LmRhdGEoJ2l0ZW0nLCBpdGVtKTtcblx0XHRcdFx0XG5cdFx0XHRcdGxpTGlzdC5wdXNoKGxpKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBObyByZXN1bHRzXG5cdFx0XHRsZXQgbGkgPSAkKCc8bGkgPicpO1xuXHRcdFx0bGkuYXBwZW5kKFxuXHRcdFx0XHQkKCc8YT4nKS5hdHRyKCdocmVmJywgJyMnKS5odG1sKHRoaXMubm9SZXN1bHRzVGV4dClcblx0XHRcdClcblx0XHRcdC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdFx0bGlMaXN0LnB1c2gobGkpO1xuXHRcdH1cblxuXHRcdCBcblx0XHR0aGlzLl9kZC5hcHBlbmQobGlMaXN0KTtcblx0fVxuXG5cdHByb3RlY3RlZCBpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtOmFueSk6dm9pZCB7XG5cdFx0Ly8gbGF1bmNoIHNlbGVjdGVkIGV2ZW50XG5cdFx0Ly8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZExhdW5jaEV2ZW50JywgaXRlbSk7XG5cdFx0dGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCBpdGVtKVxuXHR9XG5cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZHJvcGRvd24udHMiXSwic291cmNlUm9vdCI6IiJ9