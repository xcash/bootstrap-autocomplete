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
	                this.resolver = new resolvers_1.AjaxResolver(this._settings.resolverSettings);
	            }
	            // Dropdown
	            if (this.getBootstrapVersion()[0] == 4) {
	                // v4
	                this._dd = new dropdown_1.DropdownV4(this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText);
	            }
	            else {
	                this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText);
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
	exports.AjaxResolver = AjaxResolver;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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
	exports.Dropdown = Dropdown;
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
	exports.DropdownV4 = DropdownV4;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWQ0NWQzNTNhYjM2NjEwMzcwYWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttRUFtQmtFO0FBQ2xFLDBDQUEyQztBQUMzQyx5Q0FBa0Q7QUFFbEQsS0FBTyxjQUFjLENBeVZwQjtBQXpWRCxZQUFPLGNBQWM7S0FDbkI7U0FpQ0Usc0JBQVksT0FBZSxFQUFFLE9BQVc7YUExQmhDLGtCQUFhLEdBQU8sSUFBSSxDQUFDO2FBQ3pCLGtCQUFhLEdBQU8sSUFBSSxDQUFDO2FBQ3pCLGlCQUFZLEdBQVUsSUFBSSxDQUFDO2FBQzNCLHFCQUFnQixHQUFXLEtBQUssQ0FBQzthQUdqQyxjQUFTLEdBQUc7aUJBQ2xCLFFBQVEsRUFBVSxNQUFNO2lCQUN4QixnQkFBZ0IsRUFBTyxFQUFFO2lCQUN6QixTQUFTLEVBQVUsQ0FBQztpQkFDcEIsUUFBUSxFQUFVLE9BQU87aUJBQ3pCLFlBQVksRUFBWSxJQUFJLENBQUMsbUJBQW1CO2lCQUNoRCxVQUFVLEVBQVcsSUFBSTtpQkFDekIsYUFBYSxFQUFVLFlBQVk7aUJBQ25DLE1BQU0sRUFBRTtxQkFDTixLQUFLLEVBQVksSUFBSTtxQkFDckIsU0FBUyxFQUFZLElBQUk7cUJBQ3pCLE1BQU0sRUFBWSxJQUFJO3FCQUN0QixVQUFVLEVBQVksSUFBSTtxQkFDMUIsTUFBTSxFQUFZ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QWEsQ0FBQyxDQUFDO2FBRTNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7VUFDaEI7U0FHRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6QixDQUFDO0tBRVMsNENBQXVCLEdBQWpDLFVBQWtDLElBQVE7U0FDekMsd0JBQXdCO1NBQ3hCLGdEQUFnRDtTQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUM7S0FDL0MsQ0FBQztLQUVGLGlCQUFDO0FBQUQsRUFBQztBQXJOWSxpQ0FBVSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOWQ0NWQzNTNhYjM2NjEwMzcwYWUiLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtYXV0b2NvbXBsZXRlLmpzIHYxLjAuMC1yYzFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS94Y2FzaC9ib290c3RyYXAtYXV0b2NvbXBsZXRlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBGb3JrZWQgZnJvbSBib290c3RyYXAzLXR5cGVhaGVhZC5qcyB2My4xLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iYXNzam9ic2VuL0Jvb3RzdHJhcC0zLVR5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogT3JpZ2luYWwgd3JpdHRlbiBieSBAbWRvIGFuZCBAZmF0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxNiBQYW9sbyBDYXNjaWVsbG8gQHhjYXNoNjY2IGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5pbXBvcnQgeyBBamF4UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBEcm9wZG93biwgRHJvcGRvd25WNCB9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5tb2R1bGUgQXV0b0NvbXBsZXRlTlMge1xuICBleHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBwdWJsaWMgc3RhdGljIE5BTUU6c3RyaW5nID0gJ2F1dG9Db21wbGV0ZSc7XG5cbiAgICBwcml2YXRlIF9lbDpFbGVtZW50O1xuICAgIHByaXZhdGUgXyRlbDpKUXVlcnk7XG4gICAgcHJpdmF0ZSBfZGQ6RHJvcGRvd258RHJvcGRvd25WNDtcbiAgICBwcml2YXRlIF9zZWFyY2hUZXh0OnN0cmluZztcbiAgICBwcml2YXRlIF9zZWxlY3RlZEl0ZW06YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VmFsdWU6YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VGV4dDpzdHJpbmcgPSBudWxsO1xuICAgIHByaXZhdGUgX2lzU2VsZWN0RWxlbWVudDpib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfc2VsZWN0SGlkZGVuRmllbGQ6SlF1ZXJ5O1xuXG4gICAgcHJpdmF0ZSBfc2V0dGluZ3MgPSB7XG4gICAgICByZXNvbHZlcjo8c3RyaW5nPiAnYWpheCcsXG4gICAgICByZXNvbHZlclNldHRpbmdzOjxhbnk+IHt9LFxuICAgICAgbWluTGVuZ3RoOjxudW1iZXI+IDMsXG4gICAgICB2YWx1ZUtleTo8c3RyaW5nPiAndmFsdWUnLFxuICAgICAgZm9ybWF0UmVzdWx0OjxGdW5jdGlvbj4gdGhpcy5kZWZhdWx0Rm9ybWF0UmVzdWx0LFxuICAgICAgYXV0b1NlbGVjdDo8Ym9vbGVhbj4gdHJ1ZSxcbiAgICAgIG5vUmVzdWx0c1RleHQ6PHN0cmluZz4gJ05vIHJlc3VsdHMnLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHR5cGVkOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUHJlOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUG9zdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlbGVjdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIGZvY3VzOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSByZXNvbHZlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6RWxlbWVudCwgb3B0aW9ucz86e30pIHtcbiAgICAgIHRoaXMuX2VsID0gZWxlbWVudDtcbiAgICAgIHRoaXMuXyRlbCA9ICQodGhpcy5fZWwpO1xuXG4gICAgICAvLyBlbGVtZW50IHR5cGVcbiAgICAgIGlmICh0aGlzLl8kZWwuaXMoJ3NlbGVjdCcpKSB7XG4gICAgICAgIHRoaXMuX2lzU2VsZWN0RWxlbWVudCA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBpbmxpbmUgZGF0YSBhdHRyaWJ1dGVzXG4gICAgICB0aGlzLm1hbmFnZUlubGluZURhdGFBdHRyaWJ1dGVzKCk7XG4gICAgICAvLyBjb25zdHJ1Y3RvciBvcHRpb25zXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZ2V0U2V0dGluZ3MoKSwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuY29udmVydFNlbGVjdFRvVGV4dCgpO1xuICAgICAgfSBcbiAgICAgIFxuICAgICAgLy8gY29uc29sZS5sb2coJ2luaXRpYWxpemluZycsIHRoaXMuX3NldHRpbmdzKTtcbiAgICAgIFxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYW5hZ2VJbmxpbmVEYXRhQXR0cmlidXRlcygpIHtcbiAgICAgIC8vIHVwZGF0ZXMgc2V0dGluZ3Mgd2l0aCBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgbGV0IHMgPSB0aGlzLmdldFNldHRpbmdzKCk7XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ3VybCcpKSB7XG4gICAgICAgIHNbJ3Jlc29sdmVyU2V0dGluZ3MnXS51cmwgPSB0aGlzLl8kZWwuZGF0YSgndXJsJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdmFsdWUnKSkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0VmFsdWUgPSB0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC12YWx1ZScpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXRleHQnKSkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0VGV4dCA9IHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXRleHQnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnbm9yZXN1bHRzLXRleHQnKSkge1xuICAgICAgICBzWydub1Jlc3VsdHNUZXh0J10gPSB0aGlzLl8kZWwuZGF0YSgnbm9yZXN1bHRzLXRleHQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNldHRpbmdzKCk6e30ge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Qm9vdHN0cmFwVmVyc2lvbigpOkFycmF5PG51bWJlcj4ge1xuICAgICAgbGV0IHZlcnNpb25fc3RyaW5nID0gJC5mbi5idXR0b24uQ29uc3RydWN0b3IuVkVSU0lPTjtcbiAgICAgIGxldCB2ZXJzaW9uX2FycmF5ID0gdmVyc2lvbl9zdHJpbmcuc3BsaXQoJy4nKTtcblxuICAgICAgcmV0dXJuIHZlcnNpb25fYXJyYXk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb252ZXJ0U2VsZWN0VG9UZXh0KCkge1xuICAgICAgLy8gY3JlYXRlIGhpZGRlbiBmaWVsZFxuXG4gICAgICBsZXQgaGlkRmllbGQ6SlF1ZXJ5ID0gJCgnPGlucHV0PicpO1xuICAgICAgaGlkRmllbGQuYXR0cigndHlwZScsICdoaWRkZW4nKTtcbiAgICAgIGhpZEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaGlkRmllbGQudmFsKHRoaXMuX2RlZmF1bHRWYWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZCA9IGhpZEZpZWxkO1xuICAgICAgXG4gICAgICBoaWRGaWVsZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXG4gICAgICAvLyBjcmVhdGUgc2VhcmNoIGlucHV0IGVsZW1lbnRcbiAgICAgIGxldCBzZWFyY2hGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICAvLyBjb3B5IGFsbCBhdHRyaWJ1dGVzXG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCd0eXBlJywgJ3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ25hbWUnLCB0aGlzLl8kZWwuYXR0cignbmFtZScpICsgJ190ZXh0Jyk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdpZCcsIHRoaXMuXyRlbC5hdHRyKCdpZCcpKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2Rpc2FibGVkJywgdGhpcy5fJGVsLmF0dHIoJ2Rpc2FibGVkJykpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cigncGxhY2Vob2xkZXInLCB0aGlzLl8kZWwuYXR0cigncGxhY2Vob2xkZXInKSk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XG4gICAgICBzZWFyY2hGaWVsZC5hZGRDbGFzcyh0aGlzLl8kZWwuYXR0cignY2xhc3MnKSk7XG4gICAgICBpZiAodGhpcy5fZGVmYXVsdFRleHQpIHtcbiAgICAgICAgc2VhcmNoRmllbGQudmFsKHRoaXMuX2RlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gYXR0YWNoIGNsYXNzXG4gICAgICBzZWFyY2hGaWVsZC5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCB0aGlzKTtcblxuICAgICAgLy8gcmVwbGFjZSBvcmlnaW5hbCB3aXRoIHNlYXJjaEZpZWxkXG4gICAgICB0aGlzLl8kZWwucmVwbGFjZVdpdGgoc2VhcmNoRmllbGQpO1xuICAgICAgdGhpcy5fJGVsID0gc2VhcmNoRmllbGQ7XG4gICAgICB0aGlzLl9lbCA9IHNlYXJjaEZpZWxkLmdldCgwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXQoKTp2b2lkIHtcbiAgICAgIC8vIGJpbmQgZGVmYXVsdCBldmVudHNcbiAgICAgIHRoaXMuYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpO1xuICAgICAgLy8gUkVTT0xWRVJcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZXNvbHZlciA9PT0gJ2FqYXgnKSB7XG4gICAgICAgIC8vIGNvbmZpZ3VyZSBkZWZhdWx0IHJlc29sdmVyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSBuZXcgQWpheFJlc29sdmVyKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyU2V0dGluZ3MpO1xuICAgICAgfVxuICAgICAgLy8gRHJvcGRvd25cbiAgICAgIGlmICh0aGlzLmdldEJvb3RzdHJhcFZlcnNpb24oKVswXSA9PSA0KSB7XG4gICAgICAgIC8vIHY0XG4gICAgICAgIHRoaXMuX2RkID0gbmV3IERyb3Bkb3duVjQodGhpcy5fJGVsLCB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQsIFxuICAgICAgICAgIHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QsIHRoaXMuX3NldHRpbmdzLm5vUmVzdWx0c1RleHRcbiAgICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGQgPSBuZXcgRHJvcGRvd24odGhpcy5fJGVsLCB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQsIFxuICAgICAgICAgIHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QsIHRoaXMuX3NldHRpbmdzLm5vUmVzdWx0c1RleHRcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTp2b2lkIHtcbiAgICAgIHRoaXMuXyRlbC5vbigna2V5ZG93bicsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgRE9XTlxuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDk6IC8vIFRBQlxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QpIHtcbiAgICAgICAgICAgICAgLy8gaWYgYXV0b1NlbGVjdCBlbmFibGVkIHNlbGVjdHMgb24gYmx1ciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9XG5cdFx0XHRcdFx0XHRicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuXyRlbC5vbignZm9jdXMga2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGtleVxuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuICAgICAgICAgIGNhc2UgMTY6IC8vIHNoaWZ0XG4gICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuICAgICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgICAgY2FzZSAzNzogLy8gbGVmdCBcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c05leHRJdGVtKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgdGhpcy5fZGQuZm9jdXNQcmV2aW91c0l0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTM6IC8vIEVOVEVSXG4gICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdC8vIEVTQ1xuICAgICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMuXyRlbC52YWwoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlclR5cGVkKG5ld1ZhbHVlKTtcblx0XHRcdFx0fVxuICAgICAgICBcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl8kZWwub24oJ2JsdXInLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgIGlmICghdGhpcy5fZGQuaXNNb3VzZU92ZXIpIHtcblxuICAgICAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgYSBzZWxlY3QgZWxlbWVudCB5b3UgbXVzdFxuICAgICAgICAgICAgaWYgKHRoaXMuX2RkLmlzSXRlbUZvY3VzZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAodGhpcy5fc2VsZWN0ZWRJdGVtICE9PSBudWxsKSAmJiAodGhpcy5fJGVsLnZhbCgpICE9PSAnJykgKSB7XG4gICAgICAgICAgICAgIC8vIHJlc2VsZWN0IGl0XG4gICAgICAgICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VsZWN0JywgdGhpcy5fc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICh0aGlzLl8kZWwudmFsKCkgIT09ICcnKSAmJiAodGhpcy5fZGVmYXVsdFZhbHVlICE9PSBudWxsKSApIHtcbiAgICAgICAgICAgICAgLy8gc2VsZWN0IERlZmF1bHRcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnZhbCh0aGlzLl9kZWZhdWx0VGV4dCk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbCh0aGlzLl9kZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gZW1wdHkgdGhlIHZhbHVlc1xuICAgICAgICAgICAgICB0aGlzLl8kZWwudmFsKCcnKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQudmFsKCcnKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXQncyBhIHRleHQgZWxlbWVudCwgd2UgYWNjZXB0IGN1c3RvbSB2YWx1ZS5cbiAgICAgICAgICAgIC8vIERldmVsb3BlcnMgbWF5IHN1YnNjcmliZSB0byBgYXV0b2NvbXBsZXRlLmZyZWV2YWx1ZWAgdG8gZ2V0IG5vdGlmaWVkIG9mIHRoaXNcbiAgICAgICAgICAgIGlmICggKHRoaXMuX3NlbGVjdGVkSXRlbSA9PT0gbnVsbCkgJiYgKHRoaXMuXyRlbC52YWwoKSAhPT0gJycpICkge1xuICAgICAgICAgICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLmZyZWV2YWx1ZScsIHRoaXMuXyRlbC52YWwoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gc2VsZWN0ZWQgZXZlbnRcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIGl0ZW06YW55KSA9PiB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGl0ZW07XG4gICAgICAgIHRoaXMuaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbSk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGhhbmRsZXJUeXBlZChuZXdWYWx1ZTpzdHJpbmcpOnZvaWQge1xuICAgICAgLy8gZmllbGQgdmFsdWUgY2hhbmdlZFxuXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkICE9PSBudWxsKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHZhbHVlID49IG1pbkxlbmd0aCwgc3RhcnQgYXV0b2NvbXBsZXRlXG4gICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID49IHRoaXMuX3NldHRpbmdzLm1pbkxlbmd0aCkge1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuaGFuZGxlclByZVNlYXJjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlclByZVNlYXJjaCgpOnZvaWQge1xuICAgICAgLy8gZG8gbm90aGluZywgc3RhcnQgc2VhcmNoXG4gICAgICBcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlICE9PSBudWxsKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZTpzdHJpbmcgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlKHRoaXMuX3NlYXJjaFRleHQpO1xuICAgICAgICBpZiAoIW5ld1ZhbHVlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc2VhcmNoVGV4dCA9IG5ld1ZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJEb1NlYXJjaCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlckRvU2VhcmNoKCk6dm9pZCB7XG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoKHRoaXMuX3NlYXJjaFRleHQsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAgIHRoaXMucG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQgYmVoYXZpb3VyXG4gICAgICAgIC8vIHNlYXJjaCB1c2luZyBjdXJyZW50IHJlc29sdmVyXG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVyKSB7XG4gICAgICAgICAgdGhpcy5yZXNvbHZlci5zZWFyY2godGhpcy5fc2VhcmNoVGV4dCwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFjayBjYWxsZWQnLCByZXN1bHRzKTtcbiAgICAgIFxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQb3N0KSB7XG4gICAgICAgIHJlc3VsdHMgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUG9zdChyZXN1bHRzKTtcbiAgICAgICAgaWYgKCAodHlwZW9mIHJlc3VsdHMgPT09ICdib29sZWFuJykgJiYgIXJlc3VsdHMpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJTdGFydFNob3cocmVzdWx0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyU3RhcnRTaG93KHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGVmYXVsdEV2ZW50U3RhcnRTaG93XCIsIHJlc3VsdHMpO1xuICAgICAgLy8gZm9yIGV2ZXJ5IHJlc3VsdCwgZHJhdyBpdFxuICAgICAgdGhpcy5fZGQudXBkYXRlSXRlbXMocmVzdWx0cywgdGhpcy5fc2VhcmNoVGV4dCk7XG4gICAgICB0aGlzLl9kZC5zaG93KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGl0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW06YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcicsIGl0ZW0pO1xuICAgICAgLy8gZGVmYXVsdCBiZWhhdmlvdXIgaXMgc2V0IGVsbWVudCdzIC52YWwoKVxuICAgICAgbGV0IGl0ZW1Gb3JtYXR0ZWQ6YW55ID0gdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0KGl0ZW0pO1xuXHRcdFx0aWYgKHR5cGVvZiBpdGVtRm9ybWF0dGVkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdH1cbiAgICAgIHRoaXMuXyRlbC52YWwoaXRlbUZvcm1hdHRlZC50ZXh0KTtcbiAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgc2VsZWN0XG4gICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbChpdGVtRm9ybWF0dGVkLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIC8vIHNhdmUgc2VsZWN0ZWQgaXRlbVxuICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gaXRlbTtcbiAgICAgIC8vIGFuZCBoaWRlXG4gICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0Rm9ybWF0UmVzdWx0KGl0ZW06YW55KTp7fSB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0gfTtcbiAgICAgIH0gZWxzZSBpZiAoIGl0ZW0udGV4dCApIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZXR1cm4gYSB0b1N0cmluZyBvZiB0aGUgaXRlbSBhcyBsYXN0IHJlc29ydFxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdObyBkZWZhdWx0IGZvcm1hdHRlciBmb3IgaXRlbScsIGl0ZW0pO1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtLnRvU3RyaW5nKCkgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBtYW5hZ2VBUEkoQVBJQ21kOmFueSwgcGFyYW1zOmFueSkge1xuICAgICAgLy8gbWFuYWdlcyBwdWJsaWMgQVBJXG4gICAgICBpZiAoQVBJQ21kID09PSAnc2V0Jykge1xuICAgICAgICB0aGlzLml0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKHBhcmFtcyk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn1cblxuKGZ1bmN0aW9uKCQ6IEpRdWVyeVN0YXRpYywgd2luZG93OiBhbnksIGRvY3VtZW50OiBhbnkpIHtcbiAgJC5mbltBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRV0gPSBmdW5jdGlvbihvcHRpb25zT3JBUEk6IGFueSwgb3B0aW9uYWxQYXJhbXM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGx1Z2luQ2xhc3M6QXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlO1xuXG4gICAgICBwbHVnaW5DbGFzcyA9ICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSk7XG5cbiAgICAgIGlmICghcGx1Z2luQ2xhc3MpIHtcbiAgICAgICAgcGx1Z2luQ2xhc3MgPSBuZXcgQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlKHRoaXMsIG9wdGlvbnNPckFQSSk7IFxuICAgICAgICAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHBsdWdpbkNsYXNzKTtcbiAgICAgIH1cblxuICAgICAgcGx1Z2luQ2xhc3MubWFuYWdlQVBJKG9wdGlvbnNPckFQSSwgb3B0aW9uYWxQYXJhbXMpO1xuICAgIH0pO1xuICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYWluLnRzIiwiXG5jbGFzcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQgcmVzdWx0czpBcnJheTxPYmplY3Q+O1xuXG5cdHByb3RlY3RlZCBfc2V0dGluZ3M6YW55O1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0dGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0UmVzdWx0cyhsaW1pdD86bnVtYmVyLCBzdGFydD86bnVtYmVyLCBlbmQ/Om51bWJlcik6QXJyYXk8T2JqZWN0PiB7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMucmVzdWx0cztcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0Y2JrKHRoaXMuZ2V0UmVzdWx0cygpKTtcblx0fVxuXG59XG5cbmV4cG9ydCBjbGFzcyBBamF4UmVzb2x2ZXIgZXh0ZW5kcyBCYXNlUmVzb2x2ZXIge1xuXHRwcm90ZWN0ZWQganFYSFI6SlF1ZXJ5WEhSO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6YW55KSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHQvLyBjb25zb2xlLmxvZygncmVzb2x2ZXIgc2V0dGluZ3MnLCB0aGlzLl9zZXR0aW5ncyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJycsXG5cdFx0XHRtZXRob2Q6ICdnZXQnLFxuXHRcdFx0cXVlcnlLZXk6ICdxJyxcblx0XHRcdGV4dHJhRGF0YToge30sXG5cdFx0XHR0aW1lb3V0OiB1bmRlZmluZWQsXG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBzZWFyY2gocTpzdHJpbmcsIGNiazpGdW5jdGlvbik6dm9pZCB7XG5cdFx0aWYgKHRoaXMuanFYSFIgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5qcVhIUi5hYm9ydCgpO1xuXHRcdH1cblxuXHRcdGxldCBkYXRhOk9iamVjdCA9IHt9O1xuXHRcdGRhdGFbdGhpcy5fc2V0dGluZ3MucXVlcnlLZXldID0gcTtcblx0XHQkLmV4dGVuZChkYXRhLCB0aGlzLl9zZXR0aW5ncy5leHRyYURhdGEpO1xuXG5cdFx0dGhpcy5qcVhIUiA9ICQuYWpheChcblx0XHRcdHRoaXMuX3NldHRpbmdzLnVybCxcblx0XHRcdHtcblx0XHRcdFx0bWV0aG9kOiB0aGlzLl9zZXR0aW5ncy5tZXRob2QsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdHRpbWVvdXQ6IHRoaXMuX3NldHRpbmdzLnRpbWVvdXRcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dGhpcy5qcVhIUi5kb25lKChyZXN1bHQpID0+IHtcblx0XHRcdGNiayhyZXN1bHQpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuanFYSFIuZmFpbCgoZXJyKSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhlcnIpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5qcVhIUi5hbHdheXMoKCkgPT4ge1xuXHRcdFx0dGhpcy5qcVhIUiA9IG51bGw7XG5cdFx0fSk7XG5cdH1cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Jlc29sdmVycy50cyIsIi8qXG4gKlx0RHJvcGRvd24gY2xhc3MuIE1hbmFnZXMgdGhlIGRyb3Bkb3duIGRyYXdpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIERyb3Bkb3duIHtcblx0cHJvdGVjdGVkIF8kZWw6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgX2RkOkpRdWVyeTtcblx0cHJvdGVjdGVkIGluaXRpYWxpemVkOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIHNob3duOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIGl0ZW1zOmFueVtdID0gW107XG5cdHByb3RlY3RlZCBmb3JtYXRJdGVtOkZ1bmN0aW9uO1xuXHRwcm90ZWN0ZWQgc2VhcmNoVGV4dDpzdHJpbmc7XG5cdHByb3RlY3RlZCBhdXRvU2VsZWN0OmJvb2xlYW47XG5cdHByb3RlY3RlZCBtb3VzZW92ZXI6Ym9vbGVhbjtcblx0cHJvdGVjdGVkIG5vUmVzdWx0c1RleHQ6c3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKGU6SlF1ZXJ5LCBmb3JtYXRJdGVtQ2JrOkZ1bmN0aW9uLCBhdXRvU2VsZWN0OmJvb2xlYW4sIG5vUmVzdWx0c1RleHQ6c3RyaW5nKSB7XG5cdFx0dGhpcy5fJGVsID0gZTtcblx0XHR0aGlzLmZvcm1hdEl0ZW0gPSBmb3JtYXRJdGVtQ2JrO1xuXHRcdHRoaXMuYXV0b1NlbGVjdCA9IGF1dG9TZWxlY3Q7XG5cdFx0dGhpcy5ub1Jlc3VsdHNUZXh0ID0gbm9SZXN1bHRzVGV4dDtcblx0XHRcblx0XHQvLyBpbml0aWFsaXplIGl0IGluIGxhenkgbW9kZSB0byBkZWFsIHdpdGggZ2xpdGNoZXMgbGlrZSBtb2RhbHNcblx0XHQvLyB0aGlzLmluaXQoKTtcblx0fVxuXHRcblx0cHJvdGVjdGVkIGluaXQoKTp2b2lkIHtcblx0XHQvLyBJbml0aWFsaXplIGRyb3Bkb3duXG5cdFx0bGV0IHBvczphbnkgPSAkLmV4dGVuZCh7fSwgdGhpcy5fJGVsLnBvc2l0aW9uKCksIHtcbiAgICAgICAgXHRcdFx0XHRoZWlnaHQ6IHRoaXMuXyRlbFswXS5vZmZzZXRIZWlnaHRcbiAgICBcdFx0XHRcdH0pO1xuXHRcdFxuXHRcdC8vIGNyZWF0ZSBlbGVtZW50XG5cdFx0dGhpcy5fZGQgPSAkKCc8dWwgLz4nKTtcblx0XHQvLyBhZGQgb3VyIGNsYXNzIGFuZCBiYXNpYyBkcm9wZG93bi1tZW51IGNsYXNzXG5cdFx0dGhpcy5fZGQuYWRkQ2xhc3MoJ2Jvb3RzdHJhcC1hdXRvY29tcGxldGUgZHJvcGRvd24tbWVudScpO1xuXG5cdFx0dGhpcy5fZGQuaW5zZXJ0QWZ0ZXIodGhpcy5fJGVsKTtcblx0XHR0aGlzLl9kZC5jc3MoeyB0b3A6IHBvcy50b3AgKyB0aGlzLl8kZWwub3V0ZXJIZWlnaHQoKSwgbGVmdDogcG9zLmxlZnQsIHdpZHRoOiB0aGlzLl8kZWwub3V0ZXJXaWR0aCgpIH0pO1xuXHRcdFxuXHRcdC8vIGNsaWNrIGV2ZW50IG9uIGl0ZW1zXG5cdFx0dGhpcy5fZGQub24oJ2NsaWNrJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NsaWNrZWQnLCBldnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCQoZXZ0LmN1cnJlbnRUYXJnZXQpKTtcblx0XHRcdGxldCBpdGVtOmFueSA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2l0ZW0nKTtcblx0XHRcdHRoaXMuaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5fZGQub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG5cdFx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcblx0XHRcdFx0XHRcdHRoaXMuXyRlbC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlZW50ZXInLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRpZiAodGhpcy5oYXZlUmVzdWx0cykge1xuXHRcdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCd1bCcpLmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0JChldnQuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHR0aGlzLm1vdXNlb3ZlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kZC5vbignbW91c2VsZWF2ZScsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdHRoaXMubW91c2VvdmVyID0gZmFsc2U7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblx0XHRcblx0fVxuXG5cdHByaXZhdGUgY2hlY2tJbml0aWFsaXplZCgpOnZvaWQge1xuXHRcdC8vIExhenkgaW5pdFxuXHRcdGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuXHRcdFx0Ly8gaWYgbm90IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdH1cblx0fVxuXG5cdGdldCBpc01vdXNlT3ZlcigpOmJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLm1vdXNlb3Zlcjtcblx0fVxuXG5cdGdldCBoYXZlUmVzdWx0cygpOmJvb2xlYW4ge1xuXHRcdHJldHVybiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKTtcblx0fVxuXG5cdHB1YmxpYyBmb2N1c05leHRJdGVtKHJldmVyc2VkPzpib29sZWFuKSB7XG5cdFx0aWYgKHRoaXMuaGF2ZVJlc3VsdHMpIHtcblx0XHRcdC8vIGdldCBzZWxlY3RlZFxuXHRcdFx0bGV0IGN1cnJFbGVtOkpRdWVyeSA9IHRoaXMuX2RkLmZpbmQoJ2xpLmFjdGl2ZScpO1xuXHRcdFx0bGV0IG5leHRFbGVtOkpRdWVyeSA9IHJldmVyc2VkID8gY3VyckVsZW0ucHJldigpIDogY3VyckVsZW0ubmV4dCgpO1xuXG5cdFx0XHRpZiAobmV4dEVsZW0ubGVuZ3RoID09IDApIHtcblx0XHRcdFx0Ly8gZmlyc3QgXG5cdFx0XHRcdG5leHRFbGVtID0gcmV2ZXJzZWQgPyB0aGlzLl9kZC5maW5kKCdsaScpLmxhc3QoKSA6IHRoaXMuX2RkLmZpbmQoJ2xpJykuZmlyc3QoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Y3VyckVsZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0bmV4dEVsZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBmb2N1c1ByZXZpb3VzSXRlbSgpIHtcblx0XHR0aGlzLmZvY3VzTmV4dEl0ZW0odHJ1ZSk7XG5cdH1cblxuXHRwdWJsaWMgc2VsZWN0Rm9jdXNJdGVtKCkge1xuXHRcdHRoaXMuX2RkLmZpbmQoJ2xpLmFjdGl2ZScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdH1cblxuXHRnZXQgaXNJdGVtRm9jdXNlZCgpOmJvb2xlYW4ge1xuXHRcdGlmICh0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHVibGljIHNob3coKTp2b2lkIHtcblx0XHRpZiAoIXRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuc2hvdygpO1xuXHRcdFx0dGhpcy5zaG93biA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGlzU2hvd24oKTpib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5zaG93bjtcblx0fVxuXG5cdHB1YmxpYyBoaWRlKCk6dm9pZCB7XG5cdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuaGlkZSgpO1xuXHRcdFx0dGhpcy5zaG93biA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVJdGVtcyhpdGVtczphbnlbXSwgc2VhcmNoVGV4dDpzdHJpbmcpIHtcblx0XHQvLyBjb25zb2xlLmxvZygndXBkYXRlSXRlbXMnLCBpdGVtcyk7XG5cdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xuXHRcdHRoaXMuc2VhcmNoVGV4dCA9IHNlYXJjaFRleHQ7XG5cdFx0dGhpcy5yZWZyZXNoSXRlbUxpc3QoKTtcblx0fVxuXG5cdHByaXZhdGUgc2hvd01hdGNoZWRUZXh0KHRleHQ6c3RyaW5nLCBxcnk6c3RyaW5nKTpzdHJpbmcge1xuXHRcdGxldCBzdGFydEluZGV4Om51bWJlciA9IHRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHFyeS50b0xvd2VyQ2FzZSgpKTtcblx0XHRpZiAoc3RhcnRJbmRleCA+IC0xKSB7XG5cdFx0XHRsZXQgZW5kSW5kZXg6bnVtYmVyID0gc3RhcnRJbmRleCArIHFyeS5sZW5ndGg7XG5cblx0XHRcdHJldHVybiB0ZXh0LnNsaWNlKDAsIHN0YXJ0SW5kZXgpICsgJzxiPicgXG5cdFx0XHRcdCsgdGV4dC5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCkgKyAnPC9iPidcblx0XHRcdFx0KyB0ZXh0LnNsaWNlKGVuZEluZGV4KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRleHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVmcmVzaEl0ZW1MaXN0KCkge1xuXHRcdHRoaXMuY2hlY2tJbml0aWFsaXplZCgpO1xuXHRcdHRoaXMuX2RkLmVtcHR5KCk7XG5cdFx0bGV0IGxpTGlzdDpKUXVlcnlbXSA9IFtdO1xuXHRcdGlmICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdFx0bGV0IGl0ZW1Gb3JtYXR0ZWQ6YW55ID0gdGhpcy5mb3JtYXRJdGVtKGl0ZW0pO1xuXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW1Gb3JtYXR0ZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0aXRlbUZvcm1hdHRlZCA9IHsgdGV4dDogaXRlbUZvcm1hdHRlZCB9XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IGl0ZW1UZXh0OnN0cmluZztcblx0XHRcdFx0bGV0IGl0ZW1IdG1sOmFueTtcblxuXHRcdFx0XHRpdGVtVGV4dCA9IHRoaXMuc2hvd01hdGNoZWRUZXh0KGl0ZW1Gb3JtYXR0ZWQudGV4dCwgdGhpcy5zZWFyY2hUZXh0KTtcblx0XHRcdFx0aWYgKCBpdGVtRm9ybWF0dGVkLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1Gb3JtYXR0ZWQuaHRtbDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1UZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgbGkgPSAkKCc8bGkgPicpO1xuXHRcdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdFx0JCgnPGE+JykuYXR0cignaHJlZicsICcjJykuaHRtbChpdGVtSHRtbClcblx0XHRcdFx0KVxuXHRcdFx0XHQuZGF0YSgnaXRlbScsIGl0ZW0pO1xuXHRcdFx0XHRcblx0XHRcdFx0bGlMaXN0LnB1c2gobGkpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIE5vIHJlc3VsdHNcblx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLmh0bWwodGhpcy5ub1Jlc3VsdHNUZXh0KVxuXHRcdFx0KVxuXHRcdFx0LmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG5cdFx0XHRsaUxpc3QucHVzaChsaSk7XG5cdFx0fVxuXG5cdFx0IFxuXHRcdHRoaXMuX2RkLmFwcGVuZChsaUxpc3QpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGl0ZW1TZWxlY3RlZExhdW5jaEV2ZW50KGl0ZW06YW55KTp2b2lkIHtcblx0XHQvLyBsYXVuY2ggc2VsZWN0ZWQgZXZlbnRcblx0XHQvLyBjb25zb2xlLmxvZygnaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQnLCBpdGVtKTtcblx0XHR0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIGl0ZW0pXG5cdH1cblxufVxuXG5leHBvcnQgY2xhc3MgRHJvcGRvd25WNCB7XG5cdC8vIEZvciBCb290c3RyYXAgNCBuZXcgZHJvcGRvd24gc3ludGF4XG5cdHByb3RlY3RlZCBfJGVsOkpRdWVyeTtcblx0Ly8gZHJvcGRvd24gZWxlbWVudFxuXHRwcm90ZWN0ZWQgX2RkOkpRdWVyeTsgXG5cdHByb3RlY3RlZCBpbml0aWFsaXplZDpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBzaG93bjpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBpdGVtczphbnlbXSA9IFtdO1xuXHRwcm90ZWN0ZWQgZm9ybWF0SXRlbTpGdW5jdGlvbjtcblx0cHJvdGVjdGVkIHNlYXJjaFRleHQ6c3RyaW5nO1xuXHRwcm90ZWN0ZWQgYXV0b1NlbGVjdDpib29sZWFuO1xuXHRwcm90ZWN0ZWQgbW91c2VvdmVyOmJvb2xlYW47XG5cdHByb3RlY3RlZCBub1Jlc3VsdHNUZXh0OnN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbiwgYXV0b1NlbGVjdDpib29sZWFuLCBub1Jlc3VsdHNUZXh0OnN0cmluZykge1xuXHRcdHRoaXMuXyRlbCA9IGU7XG5cdFx0dGhpcy5mb3JtYXRJdGVtID0gZm9ybWF0SXRlbUNiaztcblx0XHR0aGlzLmF1dG9TZWxlY3QgPSBhdXRvU2VsZWN0O1xuXHRcdHRoaXMubm9SZXN1bHRzVGV4dCA9IG5vUmVzdWx0c1RleHQ7XG5cdFx0XG5cdFx0Ly8gaW5pdGlhbGl6ZSBpdCBpbiBsYXp5IG1vZGUgdG8gZGVhbCB3aXRoIGdsaXRjaGVzIGxpa2UgbW9kYWxzXG5cdFx0Ly8gdGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBnZXRFbFBvcygpOmFueSB7XG5cdFx0bGV0IHBvczphbnkgPSAkLmV4dGVuZCh7fSwgdGhpcy5fJGVsLnBvc2l0aW9uKCksIHtcblx0XHRcdGhlaWdodDogdGhpcy5fJGVsWzBdLm9mZnNldEhlaWdodFxuXHRcdH0pO1xuXHRcdHJldHVybiBwb3M7XG5cdH1cblx0cHJvdGVjdGVkIGluaXQoKTp2b2lkIHtcblx0XHQvLyBJbml0aWFsaXplIGRyb3Bkb3duXG5cdFx0bGV0IHBvcyA9IHRoaXMuZ2V0RWxQb3MoKTtcblxuXHRcdC8vIGNyZWF0ZSBlbGVtZW50XG5cdFx0dGhpcy5fZGQgPSAkKCc8ZGl2IC8+Jyk7XG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdHRoaXMuX2RkLmFkZENsYXNzKCdib290c3RyYXAtYXV0b2NvbXBsZXRlIGRyb3Bkb3duLW1lbnUnKTtcblxuXHRcdHRoaXMuX2RkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cdFx0dGhpcy5fZGQuY3NzKHsgdG9wOiBwb3MudG9wICsgdGhpcy5fJGVsLm91dGVySGVpZ2h0KCksIGxlZnQ6IHBvcy5sZWZ0LCB3aWR0aDogdGhpcy5fJGVsLm91dGVyV2lkdGgoKSB9KTtcblx0XHRcblx0XHQvLyBjbGljayBldmVudCBvbiBpdGVtc1xuXHRcdHRoaXMuX2RkLm9uKCdjbGljaycsICcuZHJvcGRvd24taXRlbScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdjbGlja2VkJywgZXZ0LmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZygkKGV2dC5jdXJyZW50VGFyZ2V0KSk7XG5cdFx0XHRsZXQgaXRlbTphbnkgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5kYXRhKCdpdGVtJyk7XG5cdFx0XHR0aGlzLml0ZW1TZWxlY3RlZExhdW5jaEV2ZW50KGl0ZW0pO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuX2RkLm9uKCdrZXl1cCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG5cdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdC8vIEVTQ1xuXHRcdFx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRcdFx0XHR0aGlzLl8kZWwuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWVudGVyJywgJy5kcm9wZG93bi1pdGVtJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaGF2ZVJlc3VsdHMpIHtcblx0XHRcdFx0JChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnZGl2JykuZmluZCgnLmRyb3Bkb3duLWl0ZW0uYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdHRoaXMubW91c2VvdmVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWxlYXZlJywgJy5kcm9wZG93bi1pdGVtJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5tb3VzZW92ZXIgPSBmYWxzZTtcblx0XHR9KTtcblxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFxuXHR9XG5cblx0cHJpdmF0ZSBjaGVja0luaXRpYWxpemVkKCk6dm9pZCB7XG5cdFx0Ly8gTGF6eSBpbml0XG5cdFx0aWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG5cdFx0XHQvLyBpZiBub3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0dGhpcy5pbml0KCk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IGlzTW91c2VPdmVyKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubW91c2VvdmVyO1xuXHR9XG5cblx0Z2V0IGhhdmVSZXN1bHRzKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApO1xuXHR9XG5cblx0cHVibGljIGZvY3VzTmV4dEl0ZW0ocmV2ZXJzZWQ/OmJvb2xlYW4pIHtcblx0XHRpZiAodGhpcy5oYXZlUmVzdWx0cykge1xuXHRcdFx0Ly8gZ2V0IHNlbGVjdGVkXG5cdFx0XHRsZXQgY3VyckVsZW06SlF1ZXJ5ID0gdGhpcy5fZGQuZmluZCgnLmRyb3Bkb3duLWl0ZW0uYWN0aXZlJyk7XG5cdFx0XHRsZXQgbmV4dEVsZW06SlF1ZXJ5ID0gcmV2ZXJzZWQgPyBjdXJyRWxlbS5wcmV2KCkgOiBjdXJyRWxlbS5uZXh0KCk7XG5cblx0XHRcdGlmIChuZXh0RWxlbS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHQvLyBmaXJzdCBcblx0XHRcdFx0bmV4dEVsZW0gPSByZXZlcnNlZCA/IHRoaXMuX2RkLmZpbmQoJy5kcm9wZG93bi1pdGVtJykubGFzdCgpIDogdGhpcy5fZGQuZmluZCgnLmRyb3Bkb3duLWl0ZW0nKS5maXJzdCgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRjdXJyRWxlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRuZXh0RWxlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGZvY3VzUHJldmlvdXNJdGVtKCkge1xuXHRcdHRoaXMuZm9jdXNOZXh0SXRlbSh0cnVlKTtcblx0fVxuXG5cdHB1YmxpYyBzZWxlY3RGb2N1c0l0ZW0oKSB7XG5cdFx0dGhpcy5fZGQuZmluZCgnLmRyb3Bkb3duLWl0ZW0uYWN0aXZlJykudHJpZ2dlcignY2xpY2snKTtcblx0fVxuXG5cdGdldCBpc0l0ZW1Gb2N1c2VkKCk6Ym9vbGVhbiB7XG5cdFx0aWYgKHRoaXMuX2RkLmZpbmQoJy5kcm9wZG93bi1pdGVtLmFjdGl2ZScpLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgc2hvdygpOnZvaWQge1xuXHRcdGlmICghdGhpcy5zaG93bikge1xuXHRcdFx0bGV0IHBvcyA9IHRoaXMuZ2V0RWxQb3MoKTtcblx0XHRcdC8vIHRoaXMuX2RkLmNzcyh7IHRvcDogcG9zLnRvcCArIHRoaXMuXyRlbC5vdXRlckhlaWdodCgpLCBsZWZ0OiBwb3MubGVmdCwgd2lkdGg6IHRoaXMuXyRlbC5vdXRlcldpZHRoKCkgfSk7XG5cdFx0XHR0aGlzLl9kZC5hZGRDbGFzcygnc2hvdycpO1xuXHRcdFx0dGhpcy5zaG93biA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGlzU2hvd24oKTpib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5zaG93bjtcblx0fVxuXG5cdHB1YmxpYyBoaWRlKCk6dm9pZCB7XG5cdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0XHR0aGlzLnNob3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZUl0ZW1zKGl0ZW1zOmFueVtdLCBzZWFyY2hUZXh0OnN0cmluZykge1xuXHRcdC8vIGNvbnNvbGUubG9nKCd1cGRhdGVJdGVtcycsIGl0ZW1zKTtcblx0XHR0aGlzLml0ZW1zID0gaXRlbXM7XG5cdFx0dGhpcy5zZWFyY2hUZXh0ID0gc2VhcmNoVGV4dDtcblx0XHR0aGlzLnJlZnJlc2hJdGVtTGlzdCgpO1xuXHR9XG5cblx0cHJpdmF0ZSBzaG93TWF0Y2hlZFRleHQodGV4dDpzdHJpbmcsIHFyeTpzdHJpbmcpOnN0cmluZyB7XG5cdFx0bGV0IHN0YXJ0SW5kZXg6bnVtYmVyID0gdGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXJ5LnRvTG93ZXJDYXNlKCkpO1xuXHRcdGlmIChzdGFydEluZGV4ID4gLTEpIHtcblx0XHRcdGxldCBlbmRJbmRleDpudW1iZXIgPSBzdGFydEluZGV4ICsgcXJ5Lmxlbmd0aDtcblxuXHRcdFx0cmV0dXJuIHRleHQuc2xpY2UoMCwgc3RhcnRJbmRleCkgKyAnPGI+JyBcblx0XHRcdFx0KyB0ZXh0LnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KSArICc8L2I+J1xuXHRcdFx0XHQrIHRleHQuc2xpY2UoZW5kSW5kZXgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGV4dDtcblx0fVxuXG5cdHByb3RlY3RlZCByZWZyZXNoSXRlbUxpc3QoKSB7XG5cdFx0dGhpcy5jaGVja0luaXRpYWxpemVkKCk7XG5cdFx0dGhpcy5fZGQuZW1wdHkoKTtcblx0XHRsZXQgbGlMaXN0OkpRdWVyeVtdID0gW107XG5cdFx0aWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0XHRsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLmZvcm1hdEl0ZW0oaXRlbSk7XG5cdFx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgaXRlbVRleHQ6c3RyaW5nO1xuXHRcdFx0XHRsZXQgaXRlbUh0bWw6YW55O1xuXG5cdFx0XHRcdGl0ZW1UZXh0ID0gdGhpcy5zaG93TWF0Y2hlZFRleHQoaXRlbUZvcm1hdHRlZC50ZXh0LCB0aGlzLnNlYXJjaFRleHQpO1xuXHRcdFx0XHRpZiAoIGl0ZW1Gb3JtYXR0ZWQuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGl0ZW1IdG1sID0gaXRlbUZvcm1hdHRlZC5odG1sO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGl0ZW1IdG1sID0gaXRlbVRleHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGxldCBsaSA9ICQoJzxhID4nKTtcblx0XHRcdFx0bGkuYXR0cignaHJlZicsICcjJylcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2Ryb3Bkb3duLWl0ZW0nKVxuXHRcdFx0XHRcdC5odG1sKGl0ZW1IdG1sKVxuXHRcdFx0XHRcdC5kYXRhKCdpdGVtJywgaXRlbSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRsaUxpc3QucHVzaChsaSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gTm8gcmVzdWx0c1xuXHRcdFx0bGV0IGxpID0gJCgnPGEgPicpO1xuXHRcdFx0bGkuYXR0cignaHJlZicsICcjJylcblx0XHRcdFx0LmFkZENsYXNzKCdkcm9wZG93bi1pdGVtIGRpc2FibGVkJylcblx0XHRcdFx0Lmh0bWwodGhpcy5ub1Jlc3VsdHNUZXh0KTtcblx0XHRcdFxuXHRcdFx0bGlMaXN0LnB1c2gobGkpO1xuXHRcdH1cblxuXHRcdCBcblx0XHR0aGlzLl9kZC5hcHBlbmQobGlMaXN0KTtcblx0fVxuXG5cdHByb3RlY3RlZCBpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtOmFueSk6dm9pZCB7XG5cdFx0Ly8gbGF1bmNoIHNlbGVjdGVkIGV2ZW50XG5cdFx0Ly8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZExhdW5jaEV2ZW50JywgaXRlbSk7XG5cdFx0dGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCBpdGVtKVxuXHR9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9kcm9wZG93bi50cyJdLCJzb3VyY2VSb290IjoiIn0=