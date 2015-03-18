==========
planner.js
==========

A modular Javascript planner that uses stickers to represent your information... like a traditional planner!

It's light enough:

``dist/css/planner.css``: 15.08 kB → 6.4 kB (gzip)
``dist/js/planner.js``: 98.17 kB → 42.91 kB → 11.89 kB (gzip)

Installation
------------

Install ``Planner.js`` dependency throuhg `bower`_:

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

Using data-attribute styles, you can generate the planner adding a node in your HTML:

.. code-block:: html

  <div data-planner="container"></div>

Otherwise, you can initialize it from your Javascript as follow:

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

* change the build system
* use ES6 modules to provide a better code experience :)
* write tests to have a nice code coverage and use cases coverage
* provide a timeline plugin that can transform the planner in a real time planner
* provide the list of available options
* provide the list of public APIs to manipulate the planner programmatically
* extend Internet Explorer support (IE9+)

Feel free to make your proposals!

License
-------

planner.js is released under the terms of the BSD license. Full details in ``LICENSE`` file.

Changelog
---------

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
