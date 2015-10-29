==========
planner.js
==========

A modular Javascript planner that uses stickers to represent your information... like a traditional planner!

Built with `Wheelie`_!

It's small enough (minified):

* ``dist/css/planner.css``: 5.5 kB
* ``dist/js/planner.js``: 45 kB

.. _Wheelie: https://github.com/palazzem/wheelie

Installation
------------

Install ``Planner.js`` dependency through `bower`_:

.. code-block:: bash

  $ bower install plannerjs --save

Then, add the CSS and the JS in your HTML as follows:

.. code-block:: html

  <head>
    <!-- ... -->
    <link rel="stylesheet" href="bower_components/plannerjs/dist/css/planner.css"/>
  </head>

  <body>
    <!-- ... -->
    <script src="bower_components/plannerjs/dist/js/planner.js"></script>
  </body>

.. _bower: http://bower.io/

Usage
-----

``Planner.js`` offers two different way to initialize your planner.

Using data attributes, you can render the planner using just an HTML node:

.. code-block:: html

  <div data-planner="container"></div>

Otherwise, you can initialize the planner from your Javascript as follows:

.. code-block:: html

  <div id="planner"></div>

.. code-block:: javascript

  (function (document) {
    'use strict';

    // get your HTML element
    var element = document.querySelector('.js-planner');

    // provide options if needed
    var options = {
      plugins: [
        'slider',
        'collision',
        'mobile',
        'interaction',
        'hourline'
      ]
    };

    var planner = new Planner(element, options); // done!

  })(document);

Requirements
------------

This project uses the following dependencies:

* `Handlebars`_ for template rendering (the runtime it's enough)
* `Normalize CSS`_ for CSS normalization
* `ds.js`_ for data structures like ``Set`` and ``HashMap`` (not available in ES5)
* `messengerjs`_ for pub/sub paradigm used in the event system

.. _Handlebars: https://github.com/wycats/handlebars.js/
.. _Normalize CSS: https://github.com/necolas/normalize.css
.. _ds.js: https://github.com/evonove/ds.js
.. _messengerjs: https://github.com/evonove/messenger.js

All dependencies are really small and already included in the minified version.

Browser support
---------------

A detailed compatibility table will be published soon. The following is the current support:

* Internet Explorer 11 (to be verified)
* Google Chrome
* Safari
* Mozilla Firefox

Roadmap
-------

We're working hard to create a really nice component and this is the future we see for this widget:

* use ES6 modules to provide a better code experience :)
* write tests to have a nice code coverage and use cases coverage
* provide the list of available options
* provide the list of public APIs to manipulate the planner programmatically
* extend Internet Explorer support (IE10+)

Feel free to make your proposals!

License
-------

``Planner.js`` is released under the terms of the BSD license. Full details in ``LICENSE`` file.

Changelog
---------

0.0.4 [2015-09-16]
~~~~~~~~~~~~~~~~~~

**Bugfixes**

* ``text-overflow: ellipsis`` works as expected

0.0.3 [2015-03-03]
~~~~~~~~~~~~~~~~~~

**Bugfixes**

* fixed column width to fit best desktop and mobile sizes

0.0.2 [2015-01-21]
~~~~~~~~~~~~~~~~~~

**Bugfixes**

* disabled user selection for iOS devices

0.0.1 [2015-01-19]
~~~~~~~~~~~~~~~~~~

First pre-release!

**Features**

* supports time planning
