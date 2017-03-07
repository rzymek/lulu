var webpack = require('webpack');

var config = {
    devtool: "cheap-eval-source-map",
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
    module: {
        loaders: [
            { test: /\.pegjs$/, loader: 'pegjs-loader' },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}
module.exports = config;