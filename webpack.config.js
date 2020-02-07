const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    // entry is where, say, your app starts - it can be called main.ts, index.ts, app.ts, whatever
    entry: ['webpack/hot/poll?100', './src/index.ts'],
    // This forces webpack not to compile TypeScript for one time, but to stay running, watch for file changes in project directory and re-compile if needed
    watch: true,
    // Is needed to have in compiled output imports Node.JS can understand. Quick search gives you more info
    target: 'node',
    devtool: 'cheap-source-map',
    // Prevents warnings from TypeScript compiler
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            "@server": path.resolve(__dirname, 'src/Server'),
            "@shared": path.resolve(__dirname, 'src/shared/'),
            "@utils": path.resolve(__dirname, 'src/utils/'),
        }
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // Use NoErrorsPlugin for webpack 1.x
        // new webpack.NoEmitOnErrorsPlugin()
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'server.js',
    },
    devServer: {
        port: 9000
    }
};