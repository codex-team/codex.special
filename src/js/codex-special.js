module.exports = (function () {

    /**
     * Multilanguage support
     * @private
     */
    var DICT = require('./dictionary');

    /**
     * CSS classes config
     * @private
     */
    var classes = require('./classes');

    /**
     * Texts from dictionary
     * @private
     */
    var texts = null;

    /**
     * Static nodes
     * @private
     */
    var nodes = {

        toolbar          : null,
        colorSwitchers   : [],
        textSizeSwitcher : null,

    };

    /**
     * Required stylesheets URL
     * @private
     */
    var CSS_FILE_PATH = 'codex-special.min.css';
    var JS_FILE_PART_OF_NAME_TO_GET_RELATIVE_PATH = 'codex-special.min.js';

    /**
     * Names for states saved in localStorage
     * @private
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
     * Public methods and properties
     * @constructor
     */
    var _codexSpecial = function () {};

    /**
     * Public initialization method
     * @param {Object} settings are
     *       - blockId - if passed, toolbar will be appended to this block
     *                   otherwise, it will be fixed in window
     */
    _codexSpecial.prototype.init = function (settings) {

        /** 1. Save initial settings to the private property */
        fillSettings_(settings);

        /** 2. Make interface */
        makeUI_();

        /** 3. Add listeners */
        addListeners_();

        /** 4. Check localStorage for settings */
        loadSettings_();

    };


    /**
     * Fills initialSettings
     * @private
     */
    function fillSettings_(settings) {

        for (var param in settings) {

            initialSettings[param] = settings[param];

        }

    }

    /**
     * Gets codex-special path
     * @private
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
     * Loads requiered stylesheet
     * @private
     */
    function loadStyles_() {

        var pathToExtension = getScriptLocation(),
            style = document.createElement('LINK');

        style.setAttribute('type', 'text/css');
        style.setAttribute('rel', 'stylesheet');

        style.href = pathToExtension + CSS_FILE_PATH;

        document.head.appendChild(style);

    };

    /**
     * Interface maker
     * @private
     */
    function makeUI_() {

        /** 0. Init dictionary */
        texts = DICT[initialSettings.lang];

        /** 1. Make Toolbar and Switchers */
        var toolbar          = draw_.toolbar(),
            textSizeSwitcher = draw_.textSizeSwitcher();

        /** 2. Append text size switcher */
        toolbar.appendChild(textSizeSwitcher);

        /** 3. Append color switchers */
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
     * Toolbar positioning method
     * @private
     */
    function appendPanel_() {

        if (initialSettings.blockId) {

            var blockHolder = document.getElementById(initialSettings.blockId);

            if (blockHolder) {

                blockHolder.appendChild(nodes.toolbar);

                nodes.toolbar.classList.add(classes.toolbar.state.included);

                return;

            }

            initialSettings.blockId = '';

        }

        document.body.classList.add(classes.body.excludeModificator);
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
     * Add click listeners to text and circles
     * @private
     */
    function addListeners_() {

        nodes.colorSwitchers.map(function (switcher, index) {

            switcher.addEventListener('click', changeColor_, false);

        });

        nodes.textSizeSwitcher.addEventListener('click', changeTextSize_, false);

    }

    /**
     * Get special setting params from localStorage and enable it
     * @private
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
     * Set special color scheme
     * @private
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
     * Drop special color scheme
     * @private
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
     * Set increased text size
     * @private
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
     * Drop increased text size
     * @private
     */
    function dropTextSize_() {

        document.body.classList.remove(classes.textSizeIncreased);

        nodes.textSizeSwitcher.innerHTML = '<i class="' + classes.iconButton.elem + '"></i> ' + texts.increaseSize;

        window.localStorage.removeItem(localStorageBadges.textSize);

    }

    /**
     * HTML elements maker
     * @private
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

    /** Prepare stylesheets */
    loadStyles_();

    return new _codexSpecial();

})();
