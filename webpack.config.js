var webpack = require('webpack');

var config = {
    entry: {
        index: './src/index'
    },
    output: {
        path: '/build',
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