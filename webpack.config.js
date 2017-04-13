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