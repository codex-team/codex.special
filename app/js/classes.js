/**
 * Classnames for elements and states
 */

module.exports = {

    colorSwitchers : {
        blue     : 'special-blue',
        green    : 'special-green',
        white    : 'special-white',
    },

    textSizeIncreased : 'special-big',

    toolbar : {

        elem : 'codex-special__toolbar',

        state : {
            included : 'codex-special__toolbar--included',
            excluded : 'codex-special__toolbar--excluded',
        },

        position : {
            top    : 'codex-special__toolbar--position-top',
            bottom : 'codex-special__toolbar--position-bottom',
            left   : 'codex-special__toolbar--position-left',
            right  : 'codex-special__toolbar--position-right',
        },

    },

    iconButton : {

        elem : 'codex-special__toolbar-icon',

    },

    textButton : {

        elem : 'codex-special__toolbar-text',

    },

    circle : {

        elem : 'codex-special__circle',

        prefix : 'codex-special__circle--',

        state : {
            enabled  : 'codex-special__circle--enabled',
            disabled : 'codex-special__circle--disabled',
        },

    },

    body : {

        excludeModificator : 'codex-special--excluded',

    },

};
