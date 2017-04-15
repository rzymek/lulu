const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    devtool: "source-map",
    entry: {
        index: './src/index'
    },
    output: {
        path: __dirname + '/build/',
        publicPath: '/build/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new UglifyJSPlugin({
            compress: {
                sequences: false,  // join consecutive statemets with the “comma operator”
                properties: false,  // optimize property access: a["foo"] → a.foo
                dead_code: false,  // discard unreachable code
                drop_debugger: false,  // discard “debugger” statements
                unsafe: false, // some unsafe optimizations (see below)
                conditionals: false,  // optimize if-s and conditional expressions
                comparisons: false,  // optimize comparisons
                evaluate: false,  // evaluate constant expressions
                booleans: false,  // optimize boolean expressions
                loops: false,  // optimize loops
                unused: true,  // drop unused variables/functions
                hoist_funs: false,  // hoist function declarations
                hoist_vars: false, // hoist variable declarations
                if_return: false,  // optimize if-s followed by return/continue
                join_vars: false,  // join var declarations
                cascade: false,  // try to cascade `right` into `left` in sequences
                side_effects: false,  // drop side-effect-free statements
                warnings: false,  // warn about potentially dangerous optimizations/code
                global_defs: {}
            },
            mangle: false,
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    module: {
        loaders: [
            { test: /\.pegjs$/, loader: 'pegjs-loader' },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}
module.exports = config;