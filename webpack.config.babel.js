import { resolve as _resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ButternutWebpackPlugin from "webpack-butternut-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import Jarvis from "webpack-jarvis";
import { createVariants } from "parallel-webpack";

function capitalizeWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createConfig(options) {
  return {
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['node_modules']
    },
    node: {
      fs: 'empty'
    },
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: _resolve(__dirname, './dist'),
        filename: '[name].' + options.target + '.js',
        library: 'devScripter' + options.target === 'umd' ? '' : capitalizeWord(options.target),
        libraryTarget: options.target
    },
    devServer: {
        historyApiFallback: true,
        port: 3000,
        stats: 'minimal',
        inline: true
    },
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          loader: 'awesome-typescript-loader'
        }
      ]
    },
    optimization: {
      splitChunks: {
      },
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: true,
                mangle: true,
            }
        }),
      ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //   filename: 'index.html',
        //   template: './index.html'
        // }),
        // new CopyWebpackPlugin([
        //   {from: 'static'}
        // ]),
        // new ButternutWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
        // new Jarvis({
        //   port: 1337 // optional: set a port
        // })
    ],
  };
}

export default createVariants({
  target: ['umd']
}, createConfig);