.. Bootstrap Autocomplete documentation master file, created by
   sphinx-quickstart on Wed Nov 16 18:27:52 2016.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Boostrap Autocomplete Documentation
===================================

Version: |release|

.. admonition:: WARNING
   
   This documentation is **HEAVILY UNDER CONSTRUCTION!**


.. contents::


Features
--------

* **Fast.**
* **Easy.** No complex configuration.
* **Customizable.** You can customize every single step in the suggesting workflow.
* **Batteries included.** It works out of the box.
* **i18n.** Use ``data-*`` attributes to specify the strings to use in case of errors/noresults.
* **Styles.** No custom styles. Uses standard Bootstrap's dropdown.


Getting Started
---------------

Bootstrap Autocomplete works as a plugin. Add it to your page

.. code-block:: html

    <script src="bootstrap-autocomplete.min.js"></script>

Using CDN

    *available on 1.0.0 release*

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


Advanced usage
--------------

Custom configuration
********************


Translating messages
--------------------


Development Environment
=======================



.. .. toctree::
..   :maxdepth: 2
   
..   intro



.. Indices and tables
.. ==================

.. * :ref:`genindex`
.. * :ref:`search`

