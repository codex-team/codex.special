/**
 * CodeX.Special makes a website contrast verison.
 *
 * https://ifmo.su/special
 * https://github.com/codex-team/codex.special
 *
 * @author Codex Team — ifmo.su
 *   Vitaly Guryn    https://github.com/talyguryn
 *   Savchenko Petr  https://github.com/neSpecc
 */

/** Script */
module.exports = (function () {

    /**
     * Multilanguage support
     * @private
     */
    const DICT = require('./dictionary');

    /**
     * CSS classes config
     * @private
     */
    const CLASSES = require('./classes');

    /**
     * Texts from dictionary
     * @private
     */
    let texts;

    /**
     * Static nodes
     * @private
     */
    let nodes = {

        toolbar          : null,
        colorSwitchers   : [],
        textSizeSwitcher : null,

    };

    /**
     * Names for states saved in localStorage
     * @private
     */
    let localStorageBadges = {

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
    let initialSettings = {

        blockId  : null,
        lang     : 'ru',
        position : 'top-right',

    };

    /**
     * Public methods and properties
     * @constructor
     */
    let _codexSpecial = function () {};

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
     * Fill initialSettings
     * @private
     */
    function fillSettings_(settings) {

        for (let param in settings) {

            initialSettings[param] = settings[param];

        }

    };

    /**
     * Load requiered stylesheet
     * @private
     */
    function loadStyles_() {

        let stylesBlock = document.createElement('STYLE');

        let styles = require('../css/main.css');

        stylesBlock.innerHTML = styles[0][1];

        document.head.appendChild(stylesBlock);

    };

    /**
     * Interface maker
     * @private
     */
    function makeUI_() {

        /** 0. Init dictionary */
        texts = DICT[initialSettings.lang];

        /** 1. Make Toolbar and Switchers */
        let toolbar          = draw_.toolbar(),
            textSizeSwitcher = draw_.textSizeSwitcher();

        /** 2. Append text size switcher */
        toolbar.appendChild(textSizeSwitcher);

        /** 3. Append color switchers */
        for (let color in CLASSES.colorSwitchers) {

            let circle = draw_.colorSwitcher(color);

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

            let blockHolder = document.getElementById(initialSettings.blockId);

            if (blockHolder) {

                blockHolder.appendChild(nodes.toolbar);

                nodes.toolbar.classList.add(CLASSES.toolbar.state.included);

                return;

            }

            initialSettings.blockId = '';

        }

        document.body.classList.add(CLASSES.body.excludeModificator);
        nodes.toolbar.classList.add(CLASSES.toolbar.state.excluded);

        if (initialSettings.position) {

            switch (initialSettings.position) {

                case 'top-left':
                    nodes.toolbar.classList.add(
                        CLASSES.toolbar.position.top,
                        CLASSES.toolbar.position.left
                    ); break;

                case 'bottom-right':
                    nodes.toolbar.classList.add(
                        CLASSES.toolbar.position.bottom,
                        CLASSES.toolbar.position.right
                    ); break;

                case 'bottom-left':
                    nodes.toolbar.classList.add(
                        CLASSES.toolbar.position.bottom,
                        CLASSES.toolbar.position.left
                    ); break;

                // 'top-right'
                default:
                    nodes.toolbar.classList.add(
                        CLASSES.toolbar.position.top,
                        CLASSES.toolbar.position.right
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

        let color    = window.localStorage.getItem(localStorageBadges.color),
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

        if (this.classList.contains(CLASSES.circle.state.enabled)) {

            return dropColor_();

        }

        dropColor_();

        nodes.colorSwitchers.map(function (switcher, index) {

            switcher.classList.add(CLASSES.circle.state.disabled);

        });

        this.classList.remove(CLASSES.circle.state.disabled);

        this.classList.add(CLASSES.circle.state.enabled);

        window.localStorage.setItem(localStorageBadges.color, this.dataset.style);

        document.body.classList.add(CLASSES.colorSwitchers[this.dataset.style]);

    }

    /**
     * Drop special color scheme
     * @private
     */
    function dropColor_() {

        for (let color in CLASSES.colorSwitchers) {

            document.body.classList.remove(CLASSES.colorSwitchers[color]);

        }

        nodes.colorSwitchers.map(function (switcher, index) {

            switcher.classList.remove(CLASSES.circle.state.disabled, CLASSES.circle.state.enabled);

        });

        window.localStorage.removeItem(localStorageBadges.color);

    }

    /**
     * Set increased text size
     * @private
     */
    function changeTextSize_() {

        if (document.body.classList.contains(CLASSES.textSizeIncreased)) {

            return dropTextSize_();

        }

        dropTextSize_();

        nodes.textSizeSwitcher.innerHTML = '<i class="' + CLASSES.iconButton.elem + '"></i> ' + texts.decreaseSize;

        window.localStorage.setItem(localStorageBadges.textSize, 'big');

        document.body.classList.add(CLASSES.textSizeIncreased);

    }

    /**
     * Drop increased text size
     * @private
     */
    function dropTextSize_() {

        document.body.classList.remove(CLASSES.textSizeIncreased);

        nodes.textSizeSwitcher.innerHTML = '<i class="' + CLASSES.iconButton.elem + '"></i> ' + texts.increaseSize;

        window.localStorage.removeItem(localStorageBadges.textSize);

    }

    /**
     * HTML elements maker
     * @private
     */
    let draw_ = {

        element : function (newElement, newClass) {

            let block = document.createElement(newElement);

            block.classList.add(newClass);

            return block;

        },

        /**
         * Codex special toolbar
         */
        toolbar : function () {

            return draw_.element('DIV', CLASSES.toolbar.elem);

        },

        /**
         * Makes color switcher
         * @param {string} type  - color string identifier
         */
        colorSwitcher : function (type) {

            let colorSwitcher = draw_.element('SPAN', CLASSES.circle.elem);

            colorSwitcher.classList.add(CLASSES.circle.prefix + type);

            return colorSwitcher;

        },

        /**
         * Makes text size toggler
         */
        textSizeSwitcher : function () {

            let textToggler = draw_.element('SPAN', CLASSES.textButton.elem);

            textToggler.innerHTML = '<i class="' + CLASSES.iconButton.elem + '"></i> ' + texts.increaseSize;

            return textToggler;

        }

    };

    /** Prepare stylesheets */
    loadStyles_();

    return new _codexSpecial();

})();
