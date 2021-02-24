const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development', // development,production
    // target: 'web',
    entry: path.join(__dirname, 'src/animation-demo.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_moudules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMaps: true,
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                {
                                    pragma: 'createElement'
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        host: '0.0.0.0',
        port: 9000
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/animation.html')
        })
    ]
};
