/**
 * Bundle config
 */

var webpack           = require('webpack');
var StyleLintPlugin   = require('stylelint-webpack-plugin');

var entryFiles = {
    'js' : './src/js/main.js',
    'css' : 'main.css',
};

var outputFiles = {
    'js' : './codex-special.min.js',
};


module.exports = {

    entry: entryFiles['js'],

    output: {
        filename: outputFiles['js'],
        library: 'codexSpecial',
        libraryTarget: 'umd'
    },

    module: {
        loaders: [ {
            test: /\.css$/,
            use: [ {
                loader: 'css-loader',
                options: {
                    minimize: 1,
                    importLoaders: 1
                }
            }, {
                loader: 'postcss-loader'
            } ]
        }, {
            test : /\.js$/,
            use : [ {
                loader: 'babel-loader',
                query: {
                    presets: [ 'es2015' ],
                }
            }, {
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    sourceType: 'module'
                }
            } ]
        } ]
    },

    plugins: [

        /** Check CSS code style */
        new StyleLintPlugin({
            context : './src/css/',
            files : entryFiles['css'],
        }),

        /** Minify CSS and JS */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),

        /** Block build if errors found */
        new webpack.NoEmitOnErrorsPlugin(),

    ],

    devtool: 'source-map',

  /** Auto rebuld */
    watch: true,
    watchOptions: {
        aggragateTimeout: 50
    }
};
