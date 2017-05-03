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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDQ2MTMyNTEzOGQ3NGNkMWUxYzYiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttRUFtQmtFO0FBQ2xFLDBDQUEyQztBQUMzQyx5Q0FBc0M7QUFFdEMsS0FBTyxjQUFjLENBcVVwQjtBQXJVRCxZQUFPLGNBQWM7S0FDbkI7U0FpQ0Usc0JBQVksT0FBZSxFQUFFLE9BQVc7YUExQmhDLGtCQUFhLEdBQU8sSUFBSSxDQUFDO2FBQ3pCLGtCQUFhLEdBQU8sSUFBSSxDQUFDO2FBQ3pCLGlCQUFZLEdBQVUsSUFBSSxDQUFDO2FBQzNCLHFCQUFnQixHQUFXLEtBQUssQ0FBQzthQUdqQyxjQUFTLEdBQUc7aUJBQ2xCLFFBQVEsRUFBVSxNQUFNO2lCQUN4QixnQkFBZ0IsRUFBTyxFQUFFO2lCQUN6QixTQUFTLEVBQVUsQ0FBQztpQkFDcEIsUUFBUSxFQUFVLE9BQU87aUJBQ3pCLFlBQVksRUFBWSxJQUFJLENBQUMsbUJBQW1CO2lCQUNoRCxVQUFVLEVBQVcsSUFBSTtpQkFDekIsYUFBYSxFQUFVLFlBQVk7aUJBQ25DLE1BQU0sRUFBRTtxQkFDTixLQUFLLEVBQVksSUFBSTtxQkFDckIsU0FBUyxFQUFZLElBQUk7cUJBQ3pCLE1BQU0sRUFBWSxJQUFJO3FCQUN0QixVQUFVLEVBQVksSUFBSTtxQkFDMUIsTUFBTSxFQUFZ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Q0FBQztxQkFDUCxRQUFRLEdBQUcsUUFBUSxDQUFDO2lCQUNyQixDQUFDO2lCQUVELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEIsRUFBRSxDQUFDLE1BQU0sQ0FDUixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3pDO3NCQUNBLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBRXBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDakIsQ0FBQyxDQUFDLENBQUM7U0FDSixDQUFDO1NBQUMsSUFBSSxDQUFDLENBQUM7YUFDUCxhQUFhO2FBQ2IsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3BCLEVBQUUsQ0FBQyxNQUFNLENBQ1IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FDbkQ7a0JBQ0EsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBRXRCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDakIsQ0FBQztTQUdELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3pCLENBQUM7S0FFUywwQ0FBdUIsR0FBakMsVUFBa0MsSUFBUTtTQUN6Qyx3QkFBd0I7U0FDeEIsZ0RBQWdEO1NBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQztLQUMvQyxDQUFDO0tBRUYsZUFBQztBQUFELEVBQUM7QUE5TVksNkJBQVEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQ0NjEzMjUxMzhkNzRjZDFlMWM2IiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWF1dG9jb21wbGV0ZS5qcyB2MS4wLjAtcmMxXG4gKiBodHRwczovL2dpdGh1Yi5jb20veGNhc2gvYm9vdHN0cmFwLWF1dG9jb21wbGV0ZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogRm9ya2VkIGZyb20gYm9vdHN0cmFwMy10eXBlYWhlYWQuanMgdjMuMS4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYmFzc2pvYnNlbi9Cb290c3RyYXAtMy1UeXBlYWhlYWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE9yaWdpbmFsIHdyaXR0ZW4gYnkgQG1kbyBhbmQgQGZhdFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTYgUGFvbG8gQ2FzY2llbGxvIEB4Y2FzaDY2NiBhbmQgY29udHJpYnV0b3JzXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlICh0aGUgJ0xpY2Vuc2UnKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuaW1wb3J0IHsgQWpheFJlc29sdmVyIH0gZnJvbSAnLi9yZXNvbHZlcnMnO1xuaW1wb3J0IHsgRHJvcGRvd24gfSBmcm9tICcuL2Ryb3Bkb3duJztcblxubW9kdWxlIEF1dG9Db21wbGV0ZU5TIHtcbiAgZXhwb3J0IGNsYXNzIEF1dG9Db21wbGV0ZSB7XG4gICAgcHVibGljIHN0YXRpYyBOQU1FOnN0cmluZyA9ICdhdXRvQ29tcGxldGUnO1xuXG4gICAgcHJpdmF0ZSBfZWw6RWxlbWVudDtcbiAgICBwcml2YXRlIF8kZWw6SlF1ZXJ5O1xuICAgIHByaXZhdGUgX2RkOkRyb3Bkb3duO1xuICAgIHByaXZhdGUgX3NlYXJjaFRleHQ6c3RyaW5nO1xuICAgIHByaXZhdGUgX3NlbGVjdGVkSXRlbTphbnkgPSBudWxsO1xuICAgIHByaXZhdGUgX2RlZmF1bHRWYWx1ZTphbnkgPSBudWxsO1xuICAgIHByaXZhdGUgX2RlZmF1bHRUZXh0OnN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBfaXNTZWxlY3RFbGVtZW50OmJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9zZWxlY3RIaWRkZW5GaWVsZDpKUXVlcnk7XG5cbiAgICBwcml2YXRlIF9zZXR0aW5ncyA9IHtcbiAgICAgIHJlc29sdmVyOjxzdHJpbmc+ICdhamF4JyxcbiAgICAgIHJlc29sdmVyU2V0dGluZ3M6PGFueT4ge30sXG4gICAgICBtaW5MZW5ndGg6PG51bWJlcj4gMyxcbiAgICAgIHZhbHVlS2V5OjxzdHJpbmc+ICd2YWx1ZScsXG4gICAgICBmb3JtYXRSZXN1bHQ6PEZ1bmN0aW9uPiB0aGlzLmRlZmF1bHRGb3JtYXRSZXN1bHQsXG4gICAgICBhdXRvU2VsZWN0Ojxib29sZWFuPiB0cnVlLFxuICAgICAgbm9SZXN1bHRzVGV4dDo8c3RyaW5nPiAnTm8gcmVzdWx0cycsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgdHlwZWQ6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWFyY2hQcmU6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWFyY2g6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgICBzZWFyY2hQb3N0OjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VsZWN0OjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgZm9jdXM6PEZ1bmN0aW9uPiBudWxsLFxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHJlc29sdmVyO1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDpFbGVtZW50LCBvcHRpb25zPzp7fSkge1xuICAgICAgdGhpcy5fZWwgPSBlbGVtZW50O1xuICAgICAgdGhpcy5fJGVsID0gJCh0aGlzLl9lbCk7XG5cbiAgICAgIC8vIGVsZW1lbnQgdHlwZVxuICAgICAgaWYgKHRoaXMuXyRlbC5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgdGhpcy5faXNTZWxlY3RFbGVtZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vIGlubGluZSBkYXRhIGF0dHJpYnV0ZXNcbiAgICAgIHRoaXMubWFuYWdlSW5saW5lRGF0YUF0dHJpYnV0ZXMoKTtcbiAgICAgIC8vIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXRTZXR0aW5ncygpLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb252ZXJ0U2VsZWN0VG9UZXh0KCk7XG4gICAgICB9IFxuICAgICAgXG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6aW5nJywgdGhpcy5fc2V0dGluZ3MpO1xuICAgICAgXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hbmFnZUlubGluZURhdGFBdHRyaWJ1dGVzKCkge1xuICAgICAgLy8gdXBkYXRlcyBzZXR0aW5ncyB3aXRoIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICBsZXQgcyA9IHRoaXMuZ2V0U2V0dGluZ3MoKTtcbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgndXJsJykpIHtcbiAgICAgICAgc1sncmVzb2x2ZXJTZXR0aW5ncyddLnVybCA9IHRoaXMuXyRlbC5kYXRhKCd1cmwnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC12YWx1ZScpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXZhbHVlJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRUZXh0ID0gdGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdGV4dCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCdub3Jlc3VsdHMtdGV4dCcpKSB7XG4gICAgICAgIHNbJ25vUmVzdWx0c1RleHQnXSA9IHRoaXMuXyRlbC5kYXRhKCdub3Jlc3VsdHMtdGV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2V0dGluZ3MoKTp7fSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb252ZXJ0U2VsZWN0VG9UZXh0KCkge1xuICAgICAgLy8gY3JlYXRlIGhpZGRlbiBmaWVsZFxuXG4gICAgICBsZXQgaGlkRmllbGQ6SlF1ZXJ5ID0gJCgnPGlucHV0PicpO1xuICAgICAgaGlkRmllbGQuYXR0cigndHlwZScsICdoaWRkZW4nKTtcbiAgICAgIGhpZEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaGlkRmllbGQudmFsKHRoaXMuX2RlZmF1bHRWYWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZCA9IGhpZEZpZWxkO1xuICAgICAgXG4gICAgICBoaWRGaWVsZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXG4gICAgICAvLyBjcmVhdGUgc2VhcmNoIGlucHV0IGVsZW1lbnRcbiAgICAgIGxldCBzZWFyY2hGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICAvLyBjb3B5IGFsbCBhdHRyaWJ1dGVzXG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCd0eXBlJywgJ3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpICsgJ190ZXh0Jyk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdpZCcsIHRoaXMuXyRlbC5hdHRyKCdpZCcpKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2Rpc2FibGVkJywgdGhpcy5fJGVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cigncGxhY2Vob2xkZXInLCB0aGlzLl8kZWwuYXR0cigncGxhY2Vob2xkZXInKSk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XG4gICAgICBzZWFyY2hGaWVsZC5hZGRDbGFzcyh0aGlzLl8kZWwuYXR0cignY2xhc3MnKSk7XG4gICAgICBpZiAodGhpcy5fZGVmYXVsdFRleHQpIHtcbiAgICAgICAgc2VhcmNoRmllbGQudmFsKHRoaXMuX2RlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gYXR0YWNoIGNsYXNzXG4gICAgICBzZWFyY2hGaWVsZC5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCB0aGlzKTtcblxuICAgICAgLy8gcmVwbGFjZSBvcmlnaW5hbCB3aXRoIHNlYXJjaEZpZWxkXG4gICAgICB0aGlzLl8kZWwucmVwbGFjZVdpdGgoc2VhcmNoRmllbGQpO1xuICAgICAgdGhpcy5fJGVsID0gc2VhcmNoRmllbGQ7XG4gICAgICB0aGlzLl9lbCA9IHNlYXJjaEZpZWxkLmdldCgwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXQoKTp2b2lkIHtcbiAgICAgIC8vIGJpbmQgZGVmYXVsdCBldmVudHNcbiAgICAgIHRoaXMuYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpO1xuICAgICAgLy8gUkVTT0xWRVJcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZXNvbHZlciA9PT0gJ2FqYXgnKSB7XG4gICAgICAgIC8vIGNvbmZpZ3VyZSBkZWZhdWx0IHJlc29sdmVyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSBuZXcgQWpheFJlc29sdmVyKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyU2V0dGluZ3MpO1xuICAgICAgfVxuICAgICAgLy8gRHJvcGRvd25cbiAgICAgIHRoaXMuX2RkID0gbmV3IERyb3Bkb3duKHRoaXMuXyRlbCwgdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QsIHRoaXMuX3NldHRpbmdzLm5vUmVzdWx0c1RleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpOnZvaWQge1xuICAgICAgdGhpcy5fJGVsLm9uKCdrZXlkb3duJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgOTogLy8gVEFCXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuYXV0b1NlbGVjdCkge1xuICAgICAgICAgICAgICAvLyBpZiBhdXRvU2VsZWN0IGVuYWJsZWQgc2VsZWN0cyBvbiBibHVyIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbVxuICAgICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdGhpcy5fJGVsLm9uKCdmb2N1cyBrZXl1cCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcbiAgICAgICAgLy8gY2hlY2sga2V5XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG4gICAgICAgICAgY2FzZSAxNjogLy8gc2hpZnRcbiAgICAgICAgICBjYXNlIDE3OiAvLyBjdHJsXG4gICAgICAgICAgY2FzZSAxODogLy8gYWx0XG4gICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgICBjYXNlIDM3OiAvLyBsZWZ0IFxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0XHRcdC8vIGFycm93IERPV05cbiAgICAgICAgICAgIHRoaXMuX2RkLmZvY3VzTmV4dEl0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c1ByZXZpb3VzSXRlbSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMzogLy8gRU5URVJcbiAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG4gICAgICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5fJGVsLnZhbCgpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVyVHlwZWQobmV3VmFsdWUpO1xuXHRcdFx0XHR9XG4gICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuXyRlbC5vbignYmx1cicsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZXZ0KTtcbiAgICAgICAgaWYgKCF0aGlzLl9kZC5pc01vdXNlT3Zlcikge1xuXG4gICAgICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICAgICAgLy8gaWYgaXQncyBhIHNlbGVjdCBlbGVtZW50IHlvdSBtdXN0XG4gICAgICAgICAgICBpZiAodGhpcy5fZGQuaXNJdGVtRm9jdXNlZCkge1xuICAgICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICh0aGlzLl9zZWxlY3RlZEl0ZW0gIT09IG51bGwpICYmICh0aGlzLl8kZWwudmFsKCkgIT09ICcnKSApIHtcbiAgICAgICAgICAgICAgLy8gcmVzZWxlY3QgaXRcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCB0aGlzLl9zZWxlY3RlZEl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKHRoaXMuXyRlbC52YWwoKSAhPT0gJycpICYmICh0aGlzLl9kZWZhdWx0VmFsdWUgIT09IG51bGwpICkge1xuICAgICAgICAgICAgICAvLyBzZWxlY3QgRGVmYXVsdFxuICAgICAgICAgICAgICB0aGlzLl8kZWwudmFsKHRoaXMuX2RlZmF1bHRUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQudmFsKHRoaXMuX2RlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBlbXB0eSB0aGUgdmFsdWVzXG4gICAgICAgICAgICAgIHRoaXMuXyRlbC52YWwoJycpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwoJycpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHNlbGVjdGVkIGV2ZW50XG4gICAgICB0aGlzLl8kZWwub24oJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCBpdGVtOmFueSkgPT4ge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgICAgICB0aGlzLml0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW0pO1xuICAgICAgfSk7XG5cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBoYW5kbGVyVHlwZWQobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGZpZWxkIHZhbHVlIGNoYW5nZWRcblxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy50eXBlZCAhPT0gbnVsbCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy50eXBlZChuZXdWYWx1ZSk7XG4gICAgICAgIGlmICghbmV3VmFsdWUpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB2YWx1ZSA+PSBtaW5MZW5ndGgsIHN0YXJ0IGF1dG9jb21wbGV0ZVxuICAgICAgaWYgKG5ld1ZhbHVlLmxlbmd0aCA+PSB0aGlzLl9zZXR0aW5ncy5taW5MZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fc2VhcmNoVGV4dCA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLmhhbmRsZXJQcmVTZWFyY2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJQcmVTZWFyY2goKTp2b2lkIHtcbiAgICAgIC8vIGRvIG5vdGhpbmcsIHN0YXJ0IHNlYXJjaFxuICAgICAgXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFByZSAhPT0gbnVsbCkge1xuICAgICAgICBsZXQgbmV3VmFsdWU6c3RyaW5nID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFByZSh0aGlzLl9zZWFyY2hUZXh0KTtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3NlYXJjaFRleHQgPSBuZXdWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVyRG9TZWFyY2goKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJEb1NlYXJjaCgpOnZvaWQge1xuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2ggIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaCh0aGlzLl9zZWFyY2hUZXh0LCAocmVzdWx0czphbnkpID0+IHtcbiAgICAgICAgICB0aGlzLnBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBEZWZhdWx0IGJlaGF2aW91clxuICAgICAgICAvLyBzZWFyY2ggdXNpbmcgY3VycmVudCByZXNvbHZlclxuICAgICAgICBpZiAodGhpcy5yZXNvbHZlcikge1xuICAgICAgICAgIHRoaXMucmVzb2x2ZXIuc2VhcmNoKHRoaXMuX3NlYXJjaFRleHQsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0cyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2sgY2FsbGVkJywgcmVzdWx0cyk7XG4gICAgICBcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUG9zdCkge1xuICAgICAgICByZXN1bHRzID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFBvc3QocmVzdWx0cyk7XG4gICAgICAgIGlmICggKHR5cGVvZiByZXN1bHRzID09PSAnYm9vbGVhbicpICYmICFyZXN1bHRzKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVyU3RhcnRTaG93KHJlc3VsdHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlclN0YXJ0U2hvdyhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImRlZmF1bHRFdmVudFN0YXJ0U2hvd1wiLCByZXN1bHRzKTtcbiAgICAgIC8vIGZvciBldmVyeSByZXN1bHQsIGRyYXcgaXRcbiAgICAgIHRoaXMuX2RkLnVwZGF0ZUl0ZW1zKHJlc3VsdHMsIHRoaXMuX3NlYXJjaFRleHQpO1xuICAgICAgdGhpcy5fZGQuc2hvdygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihpdGVtOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXInLCBpdGVtKTtcbiAgICAgIC8vIGRlZmF1bHQgYmVoYXZpb3VyIGlzIHNldCBlbG1lbnQncyAudmFsKClcbiAgICAgIGxldCBpdGVtRm9ybWF0dGVkOmFueSA9IHRoaXMuX3NldHRpbmdzLmZvcm1hdFJlc3VsdChpdGVtKTtcblx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0aXRlbUZvcm1hdHRlZCA9IHsgdGV4dDogaXRlbUZvcm1hdHRlZCB9XG5cdFx0XHR9XG4gICAgICB0aGlzLl8kZWwudmFsKGl0ZW1Gb3JtYXR0ZWQudGV4dCk7XG4gICAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhIHNlbGVjdFxuICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwoaXRlbUZvcm1hdHRlZC52YWx1ZSk7XG4gICAgICB9XG4gICAgICAvLyBzYXZlIHNlbGVjdGVkIGl0ZW1cbiAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGl0ZW07XG4gICAgICAvLyBhbmQgaGlkZVxuICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEZvcm1hdFJlc3VsdChpdGVtOmFueSk6e30ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtIH07XG4gICAgICB9IGVsc2UgaWYgKCBpdGVtLnRleHQgKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV0dXJuIGEgdG9TdHJpbmcgb2YgdGhlIGl0ZW0gYXMgbGFzdCByZXNvcnRcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignTm8gZGVmYXVsdCBmb3JtYXR0ZXIgZm9yIGl0ZW0nLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbS50b1N0cmluZygpIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbWFuYWdlQVBJKEFQSUNtZDphbnksIHBhcmFtczphbnkpIHtcbiAgICAgIC8vIG1hbmFnZXMgcHVibGljIEFQSVxuICAgICAgaWYgKEFQSUNtZCA9PT0gJ3NldCcpIHtcbiAgICAgICAgdGhpcy5pdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihwYXJhbXMpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG59XG5cbihmdW5jdGlvbigkOiBKUXVlcnlTdGF0aWMsIHdpbmRvdzogYW55LCBkb2N1bWVudDogYW55KSB7XG4gICQuZm5bQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUVdID0gZnVuY3Rpb24ob3B0aW9uc09yQVBJOiBhbnksIG9wdGlvbmFsUGFyYW1zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBsdWdpbkNsYXNzOkF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZTtcblxuICAgICAgcGx1Z2luQ2xhc3MgPSAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUpO1xuXG4gICAgICBpZiAoIXBsdWdpbkNsYXNzKSB7XG4gICAgICAgIHBsdWdpbkNsYXNzID0gbmV3IEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZSh0aGlzLCBvcHRpb25zT3JBUEkpOyBcbiAgICAgICAgJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCBwbHVnaW5DbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIHBsdWdpbkNsYXNzLm1hbmFnZUFQSShvcHRpb25zT3JBUEksIG9wdGlvbmFsUGFyYW1zKTtcbiAgICB9KTtcbiAgfTtcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFpbi50cyIsIlxuY2xhc3MgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIHJlc3VsdHM6QXJyYXk8T2JqZWN0PjtcblxuXHRwcm90ZWN0ZWQgX3NldHRpbmdzOmFueTtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldFJlc3VsdHMobGltaXQ/Om51bWJlciwgc3RhcnQ/Om51bWJlciwgZW5kPzpudW1iZXIpOkFycmF5PE9iamVjdD4ge1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLnJlc3VsdHM7XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGNiayh0aGlzLmdldFJlc3VsdHMoKSk7XG5cdH1cblxufVxuXG5leHBvcnQgY2xhc3MgQWpheFJlc29sdmVyIGV4dGVuZHMgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIGpxWEhSOkpRdWVyeVhIUjtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coJ3Jlc29sdmVyIHNldHRpbmdzJywgdGhpcy5fc2V0dGluZ3MpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICcnLFxuXHRcdFx0bWV0aG9kOiAnZ2V0Jyxcblx0XHRcdHF1ZXJ5S2V5OiAncScsXG5cdFx0XHRleHRyYURhdGE6IHt9LFxuXHRcdFx0dGltZW91dDogdW5kZWZpbmVkLFxuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGlmICh0aGlzLmpxWEhSICE9IG51bGwpIHtcblx0XHRcdHRoaXMuanFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHRsZXQgZGF0YTpPYmplY3QgPSB7fTtcblx0XHRkYXRhW3RoaXMuX3NldHRpbmdzLnF1ZXJ5S2V5XSA9IHE7XG5cdFx0JC5leHRlbmQoZGF0YSwgdGhpcy5fc2V0dGluZ3MuZXh0cmFEYXRhKTtcblxuXHRcdHRoaXMuanFYSFIgPSAkLmFqYXgoXG5cdFx0XHR0aGlzLl9zZXR0aW5ncy51cmwsXG5cdFx0XHR7XG5cdFx0XHRcdG1ldGhvZDogdGhpcy5fc2V0dGluZ3MubWV0aG9kLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0aW1lb3V0OiB0aGlzLl9zZXR0aW5ncy50aW1lb3V0XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHRoaXMuanFYSFIuZG9uZSgocmVzdWx0KSA9PiB7XG5cdFx0XHRjYmsocmVzdWx0KTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmpxWEhSLmZhaWwoKGVycikgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuanFYSFIuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuanFYSFIgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZXNvbHZlcnMudHMiLCIvKlxuICpcdERyb3Bkb3duIGNsYXNzLiBNYW5hZ2VzIHRoZSBkcm9wZG93biBkcmF3aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBEcm9wZG93biB7XG5cdHByb3RlY3RlZCBfJGVsOkpRdWVyeTtcblx0cHJvdGVjdGVkIF9kZDpKUXVlcnk7XG5cdHByb3RlY3RlZCBpbml0aWFsaXplZDpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBzaG93bjpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBpdGVtczphbnlbXSA9IFtdO1xuXHRwcm90ZWN0ZWQgZm9ybWF0SXRlbTpGdW5jdGlvbjtcblx0cHJvdGVjdGVkIHNlYXJjaFRleHQ6c3RyaW5nO1xuXHRwcm90ZWN0ZWQgYXV0b1NlbGVjdDpib29sZWFuO1xuXHRwcm90ZWN0ZWQgbW91c2VvdmVyOmJvb2xlYW47XG5cdHByb3RlY3RlZCBub1Jlc3VsdHNUZXh0OnN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbiwgYXV0b1NlbGVjdDpib29sZWFuLCBub1Jlc3VsdHNUZXh0OnN0cmluZykge1xuXHRcdHRoaXMuXyRlbCA9IGU7XG5cdFx0dGhpcy5mb3JtYXRJdGVtID0gZm9ybWF0SXRlbUNiaztcblx0XHR0aGlzLmF1dG9TZWxlY3QgPSBhdXRvU2VsZWN0O1xuXHRcdHRoaXMubm9SZXN1bHRzVGV4dCA9IG5vUmVzdWx0c1RleHQ7XG5cdFx0XG5cdFx0Ly8gaW5pdGlhbGl6ZSBpdCBpbiBsYXp5IG1vZGUgdG8gZGVhbCB3aXRoIGdsaXRjaGVzIGxpa2UgbW9kYWxzXG5cdFx0Ly8gdGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBpbml0KCk6dm9pZCB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSBkcm9wZG93blxuXHRcdGxldCBwb3M6YW55ID0gJC5leHRlbmQoe30sIHRoaXMuXyRlbC5wb3NpdGlvbigpLCB7XG4gICAgICAgIFx0XHRcdFx0aGVpZ2h0OiB0aGlzLl8kZWxbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgXHRcdFx0XHR9KTtcblx0XHRcblx0XHQvLyBjcmVhdGUgZWxlbWVudFxuXHRcdHRoaXMuX2RkID0gJCgnPHVsIC8+Jyk7XG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdHRoaXMuX2RkLmFkZENsYXNzKCdib290c3RyYXAtYXV0b2NvbXBsZXRlIGRyb3Bkb3duLW1lbnUnKTtcblxuXHRcdHRoaXMuX2RkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cdFx0dGhpcy5fZGQuY3NzKHsgdG9wOiBwb3MudG9wICsgdGhpcy5fJGVsLm91dGVySGVpZ2h0KCksIGxlZnQ6IHBvcy5sZWZ0LCB3aWR0aDogdGhpcy5fJGVsLm91dGVyV2lkdGgoKSB9KTtcblx0XHRcblx0XHQvLyBjbGljayBldmVudCBvbiBpdGVtc1xuXHRcdHRoaXMuX2RkLm9uKCdjbGljaycsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdjbGlja2VkJywgZXZ0LmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZygkKGV2dC5jdXJyZW50VGFyZ2V0KSk7XG5cdFx0XHRsZXQgaXRlbTphbnkgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5kYXRhKCdpdGVtJyk7XG5cdFx0XHR0aGlzLml0ZW1TZWxlY3RlZExhdW5jaEV2ZW50KGl0ZW0pO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuX2RkLm9uKCdrZXl1cCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG5cdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdC8vIEVTQ1xuXHRcdFx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRcdFx0XHR0aGlzLl8kZWwuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWVudGVyJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaGF2ZVJlc3VsdHMpIHtcblx0XHRcdFx0JChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCgndWwnKS5maW5kKCdsaS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0dGhpcy5tb3VzZW92ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlbGVhdmUnLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLm1vdXNlb3ZlciA9IGZhbHNlO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XG5cdH1cblxuXHRwcml2YXRlIGNoZWNrSW5pdGlhbGl6ZWQoKTp2b2lkIHtcblx0XHQvLyBMYXp5IGluaXRcblx0XHRpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcblx0XHRcdC8vIGlmIG5vdCBhbHJlYWR5IGluaXRpYWxpemVkXG5cdFx0XHR0aGlzLmluaXQoKTtcblx0XHR9XG5cdH1cblxuXHRnZXQgaXNNb3VzZU92ZXIoKTpib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5tb3VzZW92ZXI7XG5cdH1cblxuXHRnZXQgaGF2ZVJlc3VsdHMoKTpib29sZWFuIHtcblx0XHRyZXR1cm4gKHRoaXMuaXRlbXMubGVuZ3RoID4gMCk7XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNOZXh0SXRlbShyZXZlcnNlZD86Ym9vbGVhbikge1xuXHRcdGlmICh0aGlzLmhhdmVSZXN1bHRzKSB7XG5cdFx0XHQvLyBnZXQgc2VsZWN0ZWRcblx0XHRcdGxldCBjdXJyRWxlbTpKUXVlcnkgPSB0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKTtcblx0XHRcdGxldCBuZXh0RWxlbTpKUXVlcnkgPSByZXZlcnNlZCA/IGN1cnJFbGVtLnByZXYoKSA6IGN1cnJFbGVtLm5leHQoKTtcblxuXHRcdFx0aWYgKG5leHRFbGVtLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdC8vIGZpcnN0IFxuXHRcdFx0XHRuZXh0RWxlbSA9IHJldmVyc2VkID8gdGhpcy5fZGQuZmluZCgnbGknKS5sYXN0KCkgOiB0aGlzLl9kZC5maW5kKCdsaScpLmZpcnN0KCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGN1cnJFbGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdG5leHRFbGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNQcmV2aW91c0l0ZW0oKSB7XG5cdFx0dGhpcy5mb2N1c05leHRJdGVtKHRydWUpO1xuXHR9XG5cblx0cHVibGljIHNlbGVjdEZvY3VzSXRlbSgpIHtcblx0XHR0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKS50cmlnZ2VyKCdjbGljaycpO1xuXHR9XG5cblx0Z2V0IGlzSXRlbUZvY3VzZWQoKTpib29sZWFuIHtcblx0XHRpZiAodGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJykubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBzaG93KCk6dm9pZCB7XG5cdFx0aWYgKCF0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLnNob3coKTtcblx0XHRcdHRoaXMuc2hvd24gPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBpc1Nob3duKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuc2hvd247XG5cdH1cblxuXHRwdWJsaWMgaGlkZSgpOnZvaWQge1xuXHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLmhpZGUoKTtcblx0XHRcdHRoaXMuc2hvd24gPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlSXRlbXMoaXRlbXM6YW55W10sIHNlYXJjaFRleHQ6c3RyaW5nKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZUl0ZW1zJywgaXRlbXMpO1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnNlYXJjaFRleHQgPSBzZWFyY2hUZXh0O1xuXHRcdHRoaXMucmVmcmVzaEl0ZW1MaXN0KCk7XG5cdH1cblxuXHRwcml2YXRlIHNob3dNYXRjaGVkVGV4dCh0ZXh0OnN0cmluZywgcXJ5OnN0cmluZyk6c3RyaW5nIHtcblx0XHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxcnkudG9Mb3dlckNhc2UoKSk7XG5cdFx0aWYgKHN0YXJ0SW5kZXggPiAtMSkge1xuXHRcdFx0bGV0IGVuZEluZGV4Om51bWJlciA9IHN0YXJ0SW5kZXggKyBxcnkubGVuZ3RoO1xuXG5cdFx0XHRyZXR1cm4gdGV4dC5zbGljZSgwLCBzdGFydEluZGV4KSArICc8Yj4nIFxuXHRcdFx0XHQrIHRleHQuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpICsgJzwvYj4nXG5cdFx0XHRcdCsgdGV4dC5zbGljZShlbmRJbmRleCk7XG5cdFx0fVxuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlZnJlc2hJdGVtTGlzdCgpIHtcblx0XHR0aGlzLmNoZWNrSW5pdGlhbGl6ZWQoKTtcblx0XHR0aGlzLl9kZC5lbXB0eSgpO1xuXHRcdGxldCBsaUxpc3Q6SlF1ZXJ5W10gPSBbXTtcblx0XHRpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRcdGxldCBpdGVtRm9ybWF0dGVkOmFueSA9IHRoaXMuZm9ybWF0SXRlbShpdGVtKTtcblx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtRm9ybWF0dGVkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGl0ZW1Gb3JtYXR0ZWQgPSB7IHRleHQ6IGl0ZW1Gb3JtYXR0ZWQgfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxldCBpdGVtVGV4dDpzdHJpbmc7XG5cdFx0XHRcdGxldCBpdGVtSHRtbDphbnk7XG5cblx0XHRcdFx0aXRlbVRleHQgPSB0aGlzLnNob3dNYXRjaGVkVGV4dChpdGVtRm9ybWF0dGVkLnRleHQsIHRoaXMuc2VhcmNoVGV4dCk7XG5cdFx0XHRcdGlmICggaXRlbUZvcm1hdHRlZC5odG1sICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtRm9ybWF0dGVkLmh0bWw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtVGV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0bGV0IGxpID0gJCgnPGxpID4nKTtcblx0XHRcdFx0bGkuYXBwZW5kKFxuXHRcdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLmh0bWwoaXRlbUh0bWwpXG5cdFx0XHRcdClcblx0XHRcdFx0LmRhdGEoJ2l0ZW0nLCBpdGVtKTtcblx0XHRcdFx0XG5cdFx0XHRcdGxpTGlzdC5wdXNoKGxpKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBObyByZXN1bHRzXG5cdFx0XHRsZXQgbGkgPSAkKCc8bGkgPicpO1xuXHRcdFx0bGkuYXBwZW5kKFxuXHRcdFx0XHQkKCc8YT4nKS5hdHRyKCdocmVmJywgJyMnKS5odG1sKHRoaXMubm9SZXN1bHRzVGV4dClcblx0XHRcdClcblx0XHRcdC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuXHRcdFx0bGlMaXN0LnB1c2gobGkpO1xuXHRcdH1cblxuXHRcdCBcblx0XHR0aGlzLl9kZC5hcHBlbmQobGlMaXN0KTtcblx0fVxuXG5cdHByb3RlY3RlZCBpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtOmFueSk6dm9pZCB7XG5cdFx0Ly8gbGF1bmNoIHNlbGVjdGVkIGV2ZW50XG5cdFx0Ly8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZExhdW5jaEV2ZW50JywgaXRlbSk7XG5cdFx0dGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCBpdGVtKVxuXHR9XG5cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZHJvcGRvd24udHMiXSwic291cmNlUm9vdCI6IiJ9