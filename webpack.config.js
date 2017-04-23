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
        process.env.NODE_ENV === "production" && new UglifyJSPlugin({
            compress: {
                sequences: true,  // join consecutive statemets with the “comma operator”
                properties: true,  // optimize property access: a["foo"] → a.foo
                dead_code: true,  // discard unreachable code
                drop_debugger: true,  // discard “debugger” statements
                unsafe: true, // some unsafe optimizations (see below)
                conditionals: true,  // optimize if-s and conditional expressions
                comparisons: true,  // optimize comparisons
                evaluate: true,  // evaluate constant expressions
                booleans: true,  // optimize boolean expressions
                loops: true,  // optimize loops
                /* unused: true breaks firebase auth */
                unused: false,  // drop unused variables/functions
                hoist_funs: true,  // hoist function declarations
                hoist_vars: true, // hoist variable declarations
                if_return: true,  // optimize if-s followed by return/continue
                join_vars: true,  // join var declarations
                cascade: true,  // try to cascade `right` into `left` in sequences
                side_effects: true,  // drop side-effect-free statements
                warnings: false,  // warn about potentially dangerous optimizations/code
                global_defs: {}
            },
            mangle: true,
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ].filter(e => typeof e === "function"),
    module: {
        loaders: [
            { test: /\.pegjs$/, loader: 'pegjs-loader' },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}
module.exports = config;