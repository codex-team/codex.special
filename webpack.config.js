/**
 * Bundle config
 */

var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StyleLintPlugin   = require('stylelint-webpack-plugin');

var entryFiles = {
    'js' : './src/js/main.js',
    'css' : 'main.css',
};

var outputFiles = {
    'js' : './codex-special.min.js',
    'css' : './codex-special.min.css',
};


module.exports = {

    entry: entryFiles['js'],

    output: {
        filename: outputFiles['js'],
        library: 'codexSpecial'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css-loader?uglify=1&importLoaders=1!postcss-loader'),
            },
            {
                test : /\.js$/,
                loader: 'eslint-loader',
            }
        ]
    },

    /**
     * PostCSS configuration
     */
    postcss: function () {

        return [

            /** Allows using CSSnet for included files */
            require('postcss-smart-import'),

            /** Allows using future capabilities: variables, functions */
            require('postcss-cssnext'),

        ];

    },

    plugins: [

        /** Minify CSS and JS */
        new webpack.optimize.UglifyJsPlugin({
            /** Disable warning messages. Cant disable uglify for 3rd party libs such as html-janitor */
            compress: {
                warnings: false
            }
        }),

        /** Block build if errors found */
        new webpack.NoErrorsPlugin(),

        /** Put CSS into external bundle */
        new ExtractTextPlugin(outputFiles['css']),

        /** Check CSS code style */
        new StyleLintPlugin({
            context : './src/css/',
            files : entryFiles['css'],
        }),

    ],

    devtool: 'source-map',

    /** Auto rebuld */
    watch: true,
    watchOptions: {

        /** Timeout before build */
        aggragateTimeout: 50
    }
};
