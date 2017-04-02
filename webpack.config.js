/**
 * Bundle config
 */

var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StyleLintPlugin   = require('stylelint-webpack-plugin');

var entryFiles = {
    'js' : './app/js/main.js',
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

            /** Позволяет использовать CSSnext во вложенных файлах */
            require('postcss-smart-import'),

            /** Позволяет использовать новые возможности CSS: переменные, фукнции и тд */
            require('postcss-cssnext'),

        ];

    },

    plugins: [

        /** Минифицируем CSS и JS */
        new webpack.optimize.UglifyJsPlugin({
            /** Disable warning messages. Cant disable uglify for 3rd party libs such as html-janitor */
            compress: {
                warnings: false
            }
        }),

        /** Block build if errors found */
        new webpack.NoErrorsPlugin(),

        /** Вырезает CSS сборку в отдельный файл */
        new ExtractTextPlugin(outputFiles['css']),

        /** Проверка синтаксиса CSS */
        new StyleLintPlugin({
            context : './app/css/',
            files : entryFiles['css'],
        }),

    ],

    devtool: 'source-map',

    /** Пересборка при изменениях */
    watch: true,
    watchOptions: {

        /** Таймаут перед пересборкой */
        aggragateTimeout: 50
    }
};
