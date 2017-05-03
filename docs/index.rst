.. Bootstrap Autocomplete documentation master file, created by
   sphinx-quickstart on Wed Nov 16 18:27:52 2016.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Boostrap Autocomplete Documentation
===================================

Version: |release|

.. contents::


Features
--------

* **Fast.**
* **Easy.** No complex configuration. HTML attributes supported.
* **Modals supported.** No problems in modals.
* **Customizable.** You can customize every single step in the suggesting workflow.
* **Batteries included.** It works out of the box.
* **i18n.** Use ``data-*`` attributes to specify the strings to use in case of errors/noresults.
* **Styles.** No custom styles. Uses standard Bootstrap's dropdown.


Getting Started
---------------

Bootstrap Autocomplete works as a plugin. Add it to your page

.. code-block:: html

    <script src="bootstrap-autocomplete.min.js"></script>

Using CDN (thanks to GitCDN)

.. code-block:: html
    :caption: Latest version

    <script src="https://gitcdn.link/repo/xcash/bootstrap-autocomplete/master/dist/latest/bootstrap-autocomplete.min.js"></script>

.. code-block:: html
    :caption: STABLE version

    <script src="https://gitcdn.link/repo/xcash/bootstrap-autocomplete/master/dist/latest/bootstrap-autocomplete.min.js"></script>

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


Advanced usage
--------------

Custom configuration
********************

There are a number of configuration options to deal with common use cases.

.. function:: $(...).autoComplete({parameters})

    Enhance the form fields identified by the selector

    :param function formatResult: (item) called for each ``item`` to provide formatting for the dropdown list and in the field.
                                    It must return an object ``{ id: myitemid, text: myfancytext, html?: myfancyhtmltext }`` 
    :param str resolver: Resolver type. ``custom`` to implement your resolver using *events*
    :param resolverSettings: Object to specify parameters for the default resolver.
    :param resolverSettings.url: Url used by default resolver to lookup query
    :param events: Object to configure event callbacks to customize the lookup
    :param function events.search: (qry, callback) called to perform a lookup. Then calls ``callback(results)`` with results list


Set custom value
****************

To set an initial or change the value of the field.

.. code-block:: javascript

    $('.myAutoSelect').autoComplete('set', { value: myValue, text: myText });


Demo and Examples
-----------------

You can view Demo and Examples `here <https://gitcdn.link/repo/xcash/bootstrap-autocomplete/master/dist/latest/index.html>`_.


Translating messages
--------------------

To customize "no results" message use the following markup.

.. code-block:: html
    :emphasize-lines: 3,3

    <select class="form-control emptyAutoSelect" name="empty_select" 
        data-url="testdata/test-empty.json"
        data-noresults-text="Nothing to see here."
        autocomplete="off"></select>


Development Environment
=======================

To setup an environment to develop Bootstrap-Autocomplete you need only Docker and Docker Compose.

The source is in the TypeScript language in the `src` directory.

To start the environment::

    $ docker-compose up


.. .. toctree::
..   :maxdepth: 2
   
..   intro



.. Indices and tables
.. ==================

.. * :ref:`genindex`
.. * :ref:`search`

