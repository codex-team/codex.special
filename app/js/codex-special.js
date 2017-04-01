module.exports = (function () {

    /**
    * @private Multilanguage support
    */
    var DICT = require('./dictionary');

    /**
    * @private CSS classes config
    */
    var classes = require('./classes');

    /**
    * @private Texts from dictionary
    */
    var texts = null;

    /**
    * @private Static nodes
    */
    var nodes = {

        toolbar          : null,
        colorSwitchers   : [],
        textSizeSwitcher : null,

    };

    /**
    * @private Required stylesheets URL
    */
    var CSS_FILE_PATH = 'codex-special.min.css';
    var JS_FILE_PART_OF_NAME_TO_GET_RELATIVE_PATH = 'codex-special.min.js';

    /**
    * @private Path to codex-special. Generated automatically
    */
    var pathToExtension;

    /**
     * @private Names for states saved in localStorage
     */
    var localStorageBadges = {

        textSise : 'codex-special__text-size',
        color    : 'codex-special__color',

    };

    /**
    * Settings for codexSpecial block
    *
    * blockId — at the end of which block you want to place codexSpecial
    * scriptLocation — path to codexSpecial styles file
    * lang — language for the codexSpecial from DICT_
    */
    var initialSettings = {

        blockId  : null,
        lang     : 'ru',
        position : 'top-right',

    };

    /**
    * @constructor
    * Public methods and properties
    */
    var _codexSpecial = function () {};

    /**
    * Public initialization method
    * @param {Object} settings are
    *       - blockId - if passed, toolbar will be appended to this block
    *                   otherwise, it will be fixed in window
    */
    _codexSpecial.prototype.init = function (settings) {

        /**
        * 1. Save initial settings to the private property
        */
        fillSettings_(settings);

        /**
        * 2. Prepare stylesheets
        */
        loadStyles_();

        /**
        * 3. Make interface
        */
        makeUI_();

        /**
        * 4. Add listeners
        */
        addListeners_();

        /**
        * 5. Check localStorage for settings
        */
        loadSettings_();

    };


    /**
    * @private
    * Fills initialSettings
    */
    function fillSettings_(settings) {

        for (var param in settings) {

            initialSettings[param] = settings[param];

        }

        pathToExtension = getScriptLocation();

    }

    /**
    * @private
    * Gets codex-special path
    */
    function getScriptLocation() {

        var scriptsList = document.getElementsByTagName('script'),
            scriptSrc,
            scriptDir,
            lastSlashPosition;

        for (var i = 0; i < scriptsList.length; i++) {

            scriptSrc = scriptsList[i].src;

            if (scriptSrc.indexOf(JS_FILE_PART_OF_NAME_TO_GET_RELATIVE_PATH) != -1) {

                lastSlashPosition = scriptSrc.lastIndexOf('/');

                scriptDir = scriptSrc.substr(0, lastSlashPosition + 1);

                return scriptDir;

            }

        }

    }

    /**
    * @private Loads requeired stylesheet
    */
    function loadStyles_() {

        var style = document.createElement('link');

        style.setAttribute('type', 'text/css');
        style.setAttribute('rel', 'stylesheet');

        style.href = pathToExtension + CSS_FILE_PATH;

        document.head.appendChild( style );

    }

    /**
    * @private Interface maker
    */
    function makeUI_() {

        /**
        * 0. Init dictionary
        */
        texts = DICT[initialSettings.lang];

        /**
        * 1. Make Toolbar and Switchers
        */

        var toolbar = draw_.toolbar();
        var textSizeSwitcher = draw_.textSizeSwitcher();

        /**
        * 2. Append text size switcher
        */
        toolbar.appendChild(textSizeSwitcher);

        /**
        * 3. Append color switchers
        */
        for (var color in classes.colorSwitchers) {

            var circle = draw_.colorSwitcher(color);

            circle.dataset.style = color;

            toolbar.appendChild(circle);

            nodes.colorSwitchers.push(circle);

        }

        nodes.toolbar = toolbar;
        nodes.textSizeSwitcher = textSizeSwitcher;

        appendPanel_();

    }

    /**
    * @private Toolbar positioning method
    */
    function appendPanel_() {

        if (initialSettings.blockId) {

            document.getElementById(initialSettings.blockId).appendChild(nodes.toolbar);

            nodes.toolbar.classList.add(classes.toolbar.state.included);

            return;

        }

        nodes.toolbar.classList.add(classes.toolbar.state.excluded);

        if (initialSettings.position) {

            switch (initialSettings.position) {

                case 'top-left':
                    nodes.toolbar.classList.add(
                        classes.toolbar.position.top,
                        classes.toolbar.position.left
                    ); break;

                case 'bottom-right':
                    nodes.toolbar.classList.add(
                        classes.toolbar.position.bottom,
                        classes.toolbar.position.right
                    ); break;

                case 'bottom-left':
                    nodes.toolbar.classList.add(
                        classes.toolbar.position.bottom,
                        classes.toolbar.position.left
                    ); break;

                // 'top-right'
                default:
                    nodes.toolbar.classList.add(
                        classes.toolbar.position.top,
                        classes.toolbar.position.right
                    ); break;

            }

        }

        document.body.appendChild(nodes.toolbar);

    }

    /**
    * @private Add click listeners to text and circles
    */
    function addListeners_() {

        nodes.colorSwitchers.map(function (switcher, index) {

            switcher.addEventListener('click', changeColor_, false);

        });

        nodes.textSizeSwitcher.addEventListener('click', changeTextSize_, false);

    }

    /**
    * @private Get special setting params from localStorage and enable it
    */
    function loadSettings_() {

        var color    = window.localStorage.getItem(localStorageBadges.color),
            textSize = window.localStorage.getItem(localStorageBadges.textSize),
            textSizeSwitcher;

        if (color) {

            nodes.colorSwitchers.map(function (switcher, index) {

                if (switcher.dataset.style == color) {

                    changeColor_.call(switcher);

                }

            });

        }

        if (textSize) {

            textSizeSwitcher = nodes.textSizeSwitcher;

            changeTextSize_.call(textSizeSwitcher);

        }

    }

    /**
    * @private Set special color scheme
    */
    function changeColor_() {

        if (this.classList.contains(classes.circle.state.enabled)) {

            return dropColor_();

        }

        dropColor_();

        nodes.colorSwitchers.map(function (switcher, index) {

            switcher.classList.add(classes.circle.state.disabled);

        });

        this.classList.remove(classes.circle.state.disabled);

        this.classList.add(classes.circle.state.enabled);

        window.localStorage.setItem(localStorageBadges.color, this.dataset.style);

        document.body.classList.add(classes.colorSwitchers[this.dataset.style]);

    }

    /**
    * @private Drop special color scheme
    */
    function dropColor_() {

        for (var color in classes.colorSwitchers) {

            document.body.classList.remove(classes.colorSwitchers[color]);

        }

        nodes.colorSwitchers.map(function (switcher, index) {

            switcher.classList.remove(classes.circle.state.disabled, classes.circle.state.enabled);

        });

        window.localStorage.removeItem(localStorageBadges.color);

    }

    /**
    * @private Set increased text size
    */
    function changeTextSize_() {

        if (document.body.classList.contains(classes.textSizeIncreased)) {

            return dropTextSize_();

        }

        dropTextSize_();

        nodes.textSizeSwitcher.innerHTML = '<i class="' + classes.iconButton.elem + '"></i> ' + texts.decreaseSize;

        window.localStorage.setItem(localStorageBadges.textSize, 'big');

        document.body.classList.add(classes.textSizeIncreased);

    }

    /**
    * @private Drop increased text size
    */
    function dropTextSize_() {

        document.body.classList.remove(classes.textSizeIncreased);

        nodes.textSizeSwitcher.innerHTML = '<i class="' + classes.iconButton.elem + '"></i> ' + texts.increaseSize;

        window.localStorage.removeItem(localStorageBadges.textSize);

    }

    /**
    * @private HTML elements maker
    */
    var draw_ = {

        element : function (newElement, newClass) {

            var block = document.createElement(newElement);

            block.classList.add(newClass);

            return block;

        },

        /**
        * Codex special toolbar
        */
        toolbar : function () {

            return draw_.element('DIV', classes.toolbar.elem);

        },

        /**
        * Makes color switcher
        * @param {string} type  - color string identifier
        */
        colorSwitcher : function (type) {

            var colorSwitcher = draw_.element('SPAN', classes.circle.elem);

            colorSwitcher.classList.add(classes.circle.prefix + type);

            return colorSwitcher;

        },

        /**
        * Makes text size toggler
        */
        textSizeSwitcher : function () {

            var textToggler = draw_.element('SPAN', classes.textButton.elem);

            textToggler.innerHTML = '<i class="' + classes.iconButton.elem + '"></i> ' + texts.increaseSize;

            return textToggler;

        }

    };

    return new _codexSpecial();

})();
