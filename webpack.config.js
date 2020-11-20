const path = require('path');
const argv = require('yargs').argv;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;
const distPath = path.join(__dirname, '/public');

const config_js_css = {
    entry: {
        auction: './src/javascripts/auction.js',
        auctionSettings: './src/javascripts/auctionSettings.js',
        index: './src/javascripts/index.js',
        admin: './src/javascripts/admin.js',
        participant: './src/javascripts/participant.js',
        picture: './src/javascripts/picture.js',
        pictures: './src/javascripts/pictures.js',
        participants: './src/javascripts/participants.js'
    },
    output: {
        filename: 'javascripts/[name].js',
        path: distPath
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader'
            }]
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.(jpg|jpeg|gif|png)$/,
            exclude: /node_modules/,
            loader:'url-loader?limit=1024&name=img/[name].[ext]'
        }]
    },

    optimization: isProduction ? {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        inline: false,
                        drop_console: true
                    },
                },
            }),
        ],
    } : {},
    devServer: {
        contentBase: distPath,
        port: 9000,
        compress: true,
        open: true
    }
};

module.exports = config_js_css;