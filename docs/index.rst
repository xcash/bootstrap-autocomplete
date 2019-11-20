.. Bootstrap Autocomplete documentation master file, created by
   sphinx-quickstart on Wed Nov 16 18:27:52 2016.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. default-domain:: js

Boostrap Autocomplete Documentation
===================================

Version: |release|

Features
--------

* **Fast.**
* **Easy.** No complex configuration. HTML attributes supported.
* **Modals supported.** No problems in modals.
* **Customizable.** You can customize every single step in the suggesting workflow.
* **Batteries included.** It works out of the box for Bootstrap v3 and v4.
* **i18n.** Use ``data-*`` attributes to specify the strings to use in case of errors/noresults.
* **Styles.** No custom styles. Uses standard Bootstrap's dropdown.


Getting Started
---------------

Bootstrap Autocomplete works as a plugin. Add it to your page

.. code-block:: html

    <script src="bootstrap-autocomplete.min.js"></script>

Using CDN (thanks to JSDelivr)

.. code-block:: html
    :caption: STABLE version |release|

    <script src="https://cdn.jsdelivr.net/gh/xcash/bootstrap-autocomplete@v2.3.0/dist/latest/bootstrap-autocomplete.min.js"></script>

.. code-block:: html
    :caption: Latest version (this is the development branch)

    <script src="https://cdn.jsdelivr.net/gh/xcash/bootstrap-autocomplete@master/dist/latest/bootstrap-autocomplete.min.js"></script>

That's it! Go on to enhance your text fields! :)

Basic usage
-----------

Text Autocomplete
*****************

Autocomplete is not enabled by default. You must activate it on the fields you want to enhance.
Of course you can also use a wide selector to enable it on specific classes or tags.

Suppose you have a field as follows

.. code-block:: html

    <input class="form-control basicAutoComplete" type="text" autocomplete="off">

Here the class ``basicAutoComplete`` is used to identify all the fields on which to activate a basic autocomplete.
Then in Javascript we activate it:

.. code-block:: javascript

    $('.basicAutoComplete').autoComplete({
        resolverSettings: {
            url: 'testdata/test-list.json'
        }
    });

In this example we specified the ``url`` to use. Autocomplete will automatically make an Ajax GET request to that URL
using an argument named ``q`` with the text typed by the user. Rate limits are enforced and minimun field length is 2.

Even simpler you can pass the URL directly in the markup

.. code-block:: html

    <input class="form-control basicAutoComplete" type="text" 
            data-url="myurl"
            autocomplete="off">

and enhance it just with

.. code-block:: javascript

    $('.basicAutoComplete').autoComplete();


Response Format
***************

We know how to start an autocomplete lookup but what about the results?

The *default* configuration expects a simple list in JSON format. Like

.. code-block:: json 

    [
        "Google Cloud Platform",
        "Amazon AWS",
        "Docker",
        "Digital Ocean"
    ]


Select Autocomplete
*******************

One of the main features of Bootstrap Autocomplete is to enhance ``<select>`` fields as easy as ``<input>`` text fields.
Selects are useful to **restrict choices** to a set of possibilities.

Enhancing a select is no different than text fields.

.. code-block:: html

    <select class="form-control basicAutoSelect" name="simple_select" 
        placeholder="type to search..." 
        data-url="testdata/test-select-simple.json" autocomplete="off"></select>

.. code-block:: javascript

    $('.basicAutoSelect').autoComplete();

Nice! :)

Response Format for Select
**************************

In this case we need two values in the response: an ``id`` and a ``text``.

.. code-block:: json

    [
        { "value": 1, "text": "Google Cloud Platform" },
        { "value": 2, "text": "Amazon AWS" },
        { "value": 3, "text": "Docker" },
        { "value": 4, "text": "Digital Ocean" }
    ]


Events
******

Bootstrap Autocomplete triggers usual events.

``change`` - Value changed

And custom.

``autocomplete.select`` - (evt, item) The element ``item`` is the item selected by the user and currently selected in the field.

``autocomplete.freevalue`` - (evt, value) The text field contains `value` as the custom value (i.e. not selected from the choices dropdown).

Reference
---------

Activating Autocomplete
***********************

.. function:: $(...).autoComplete([options])

    Enhance the form fields identified by the selector

    :param options: Configuration options of type ConfigOptions.


Configuration options
*********************

.. attribute:: .formatResult

    .. function:: callback(item)

        :param object item: The item selected or rendered in the dropdown.
        :returns: An object ``{ id: myItemId, text: myfancyText, html?: myfancierHtml }``.

.. attribute:: .minLength

    Default: ``3``. Minimum character length to start lookup.

.. attribute:: .autoSelect

    Default: ``true``. Automatically selects selected item on `blur event` (i.e. using TAB to switch to next field).

.. attribute:: .resolver

    Default: ``ajax``. Resolver type. ``custom`` to implement your resolver using *events*.

.. attribute:: .noResultsText

    Default: ``No results``. Text to show when no results found.

.. attribute:: .resolverSettings

    Object to specify parameters used by default resolver.

    .. attribute:: .url

        Url used by default resolver to perform lookup query.

    .. attribute:: .requestThrottling

        Default: ``500``. Time to wait in ms before starting a remote request.

.. attribute:: .events

    Object to specify custom event callbacks.

    .. attribute:: .search

        .. function:: func(qry, callback, origJQElement)

            Function called to perform a lookup.

            :param string qry: Query string.
            :param callback: Callback function to process results.
                                Called passing the **list** of results ``callback(results)``.
            :param JQuery origJQElement: Original jQuery element.

    .. attribute:: .searchPost

        .. function:: func(resultsFromServer, origJQElement)

            Function called to manipulate server response.
            Bootstrap Autocomplete needs a list of items. Use this function to convert any server response in
            a list of items without reimplementing the default AJAX server lookup.

            :param resultsFromServer: Result received from server. Using the default resolver this is an object.
            :param JQuery origJQElement: Original jQuery element.
            :returns: List of items.
    
    `Following events are available to fine tune every lookup aspect. Rarely used in common scenarios`

    .. attribute:: .typed

        .. function:: func(newValue, origJQElement)

            Field value changed. Use this function to change the searched value (like prefixing it with some string, 
            filter some characters, ...). Or to stop lookup for certain values.

            :param string newValue: New value.
            :param JQuery origJQElement: Original jQuery element.
            :returns: (Un)modified value or ``false`` to stop the execution.
    

    .. attribute:: .searchPre

        .. function:: func(newValue, origJQElement)

            Before starting the search. Like in the ``typed`` event, this function can change the search value. The difference is
            this event is called `after` minLength checks.

            :param string newValue: New value.
            :param JQuery origJQElement: Original jQuery element.
            :returns: (Un)modified value or ``false`` to stop the execution.

    As a reference the lookup workflow calls events in the following order::
    
        typed -> searchPre -> search -> searchPost

Advanced usage
--------------

Set custom value
****************

To set an initial or change the value of the field.

.. code-block:: javascript

    $('.myAutoSelect').autoComplete('set', { value: myValue, text: myText });

Customize results using default AJAX resolver
*********************************************

Using the ``searchPost`` event you can manipulate the result set making it compatible with autocomplete default.
This is useful to bypass the customization of the entire search AJAX call.

.. code-block:: javascript

    $('.myAutoSelect').autoComplete({
        events: {
            searchPost: function (resultFromServer) {
                return resultFromServer.results;
            }
        }
    });



Demo and Examples
-----------------

You can view Demo and Examples `here <https://raw.githack.com/xcash/bootstrap-autocomplete/master/dist/latest/index4.html>`_.


Translating messages
--------------------

To customize "no results" message use the following markup.

.. code-block:: html
    :emphasize-lines: 3,3

    <select class="form-control emptyAutoSelect" name="empty_select" 
        data-url="testdata/test-empty.json"
        data-noresults-text="Nothing to see here."
        autocomplete="off"></select>

Issues, Support and New Features requests
=========================================

Feel free to post a new issue `here <https://github.com/xcash/bootstrap-autocomplete/issues>`_

Development Environment
=======================

To setup an environment to develop Bootstrap-Autocomplete you need only Docker and Docker Compose.

The source is in the TypeScript language in the ``src`` directory while the documentation is
generated using Sphinx and resides in the ``docs`` directory.

Create the development containers:

    docker-compose build --pull

Install dependencies (first time and to update):

    docker-compose run --rm tools yarn install

To start the environment::

    $ docker-compose up

Two servers starts up:

* `Demo page <http://localhost:9000>`_
* `Documentation <http://localhost:9999>`_

