/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resolvers__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dropdown__ = __webpack_require__(2);
/* =============================================================
 * bootstrap-autocomplete.js v2.0.0
 * https://github.com/xcash/bootstrap-autocomplete
 * =============================================================
 * Forked from bootstrap3-typeahead.js v3.1.0
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2018 Paolo Casciello @xcash666 and contributors
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


var AutoCompleteNS;
(function (AutoCompleteNS) {
    var AutoComplete = /** @class */ (function () {
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
        AutoComplete.prototype.getBootstrapVersion = function () {
            var version_string = $.fn.button.Constructor.VERSION;
            var version_array = version_string.split('.');
            return version_array;
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
                this.resolver = new __WEBPACK_IMPORTED_MODULE_0__resolvers__["a" /* AjaxResolver */](this._settings.resolverSettings);
            }
            // Dropdown
            if (this.getBootstrapVersion()[0] == 4) {
                // v4
                this._dd = new __WEBPACK_IMPORTED_MODULE_1__dropdown__["b" /* DropdownV4 */](this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText);
            }
            else {
                this._dd = new __WEBPACK_IMPORTED_MODULE_1__dropdown__["a" /* Dropdown */](this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText);
            }
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
                    case 38: // up arrow
                        evt.stopPropagation();
                        evt.preventDefault();
                        break;
                    case 9: // TAB
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
                    case 37: // left 
                        break;
                    case 40:
                        // arrow DOWN
                        _this._dd.focusNextItem();
                        break;
                    case 38: // up arrow
                        _this._dd.focusPreviousItem();
                        break;
                    case 13: // ENTER
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
        AutoComplete.NAME = 'autoComplete';
        return AutoComplete;
    }());
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export BaseResolver */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AjaxResolver; });
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
var BaseResolver = /** @class */ (function () {
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

var AjaxResolver = /** @class */ (function (_super) {
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



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dropdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DropdownV4; });
/*
 *	Dropdown class. Manages the dropdown drawing
 */
var Dropdown = /** @class */ (function () {
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

var DropdownV4 = /** @class */ (function () {
    function DropdownV4(e, formatItemCbk, autoSelect, noResultsText) {
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
    DropdownV4.prototype.getElPos = function () {
        var pos = $.extend({}, this._$el.position(), {
            height: this._$el[0].offsetHeight
        });
        return pos;
    };
    DropdownV4.prototype.init = function () {
        var _this = this;
        // Initialize dropdown
        var pos = this.getElPos();
        // create element
        this._dd = $('<div />');
        // add our class and basic dropdown-menu class
        this._dd.addClass('bootstrap-autocomplete dropdown-menu');
        this._dd.insertAfter(this._$el);
        this._dd.css({ top: pos.top + this._$el.outerHeight(), left: pos.left, width: this._$el.outerWidth() });
        // click event on items
        this._dd.on('click', '.dropdown-item', function (evt) {
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
        this._dd.on('mouseenter', '.dropdown-item', function (evt) {
            if (_this.haveResults) {
                $(evt.currentTarget).closest('div').find('.dropdown-item.active').removeClass('active');
                $(evt.currentTarget).addClass('active');
                _this.mouseover = true;
            }
        });
        this._dd.on('mouseleave', '.dropdown-item', function (evt) {
            _this.mouseover = false;
        });
        this.initialized = true;
    };
    DropdownV4.prototype.checkInitialized = function () {
        // Lazy init
        if (!this.initialized) {
            // if not already initialized
            this.init();
        }
    };
    Object.defineProperty(DropdownV4.prototype, "isMouseOver", {
        get: function () {
            return this.mouseover;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropdownV4.prototype, "haveResults", {
        get: function () {
            return (this.items.length > 0);
        },
        enumerable: true,
        configurable: true
    });
    DropdownV4.prototype.focusNextItem = function (reversed) {
        if (this.haveResults) {
            // get selected
            var currElem = this._dd.find('.dropdown-item.active');
            var nextElem = reversed ? currElem.prev() : currElem.next();
            if (nextElem.length == 0) {
                // first 
                nextElem = reversed ? this._dd.find('.dropdown-item').last() : this._dd.find('.dropdown-item').first();
            }
            currElem.removeClass('active');
            nextElem.addClass('active');
        }
    };
    DropdownV4.prototype.focusPreviousItem = function () {
        this.focusNextItem(true);
    };
    DropdownV4.prototype.selectFocusItem = function () {
        this._dd.find('.dropdown-item.active').trigger('click');
    };
    Object.defineProperty(DropdownV4.prototype, "isItemFocused", {
        get: function () {
            if (this._dd.find('.dropdown-item.active').length > 0) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    DropdownV4.prototype.show = function () {
        if (!this.shown) {
            var pos = this.getElPos();
            // this._dd.css({ top: pos.top + this._$el.outerHeight(), left: pos.left, width: this._$el.outerWidth() });
            this._dd.addClass('show');
            this.shown = true;
        }
    };
    DropdownV4.prototype.isShown = function () {
        return this.shown;
    };
    DropdownV4.prototype.hide = function () {
        if (this.shown) {
            this._dd.removeClass('show');
            this.shown = false;
        }
    };
    DropdownV4.prototype.updateItems = function (items, searchText) {
        // console.log('updateItems', items);
        this.items = items;
        this.searchText = searchText;
        this.refreshItemList();
    };
    DropdownV4.prototype.showMatchedText = function (text, qry) {
        var startIndex = text.toLowerCase().indexOf(qry.toLowerCase());
        if (startIndex > -1) {
            var endIndex = startIndex + qry.length;
            return text.slice(0, startIndex) + '<b>'
                + text.slice(startIndex, endIndex) + '</b>'
                + text.slice(endIndex);
        }
        return text;
    };
    DropdownV4.prototype.refreshItemList = function () {
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
                var li = $('<a >');
                li.attr('href', '#')
                    .addClass('dropdown-item')
                    .html(itemHtml)
                    .data('item', item);
                liList.push(li);
            });
        }
        else {
            // No results
            var li = $('<a >');
            li.attr('href', '#')
                .addClass('dropdown-item disabled')
                .html(this.noResultsText);
            liList.push(li);
        }
        this._dd.append(liList);
    };
    DropdownV4.prototype.itemSelectedLaunchEvent = function (item) {
        // launch selected event
        // console.log('itemSelectedLaunchEvent', item);
        this._$el.trigger('autocomplete.select', item);
    };
    return DropdownV4;
}());



/***/ })
/******/ ]);