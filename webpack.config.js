const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackConfig = {
    entry: {
        free: './src/free.js',
        'free.umd': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: chunkData => {
            return `${chunkData.chunk.name}.js`
        },
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }]
            },
            {
                test: /\.styl$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }, { loader: 'stylus-loader' }]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg|ttf|eot|svg|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000
                }
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({
            title: 'free-dev',
            template: 'index.html',
            hash: true,
            chunks: ['free'],
            // filename: './dist/index.html',
            minify: {
                removeComments: true, // 去除注释
                collapseWhitespace: true //是否去除空格
            }
        }),
        new webpack.DefinePlugin({
            BUILD_TIME: JSON.stringify(Date.now())
        })
    ]
}

module.exports = () => {
    return webpackConfig
}
