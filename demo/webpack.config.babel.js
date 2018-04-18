import { resolve as _resolve } from "path";
import { createVariants } from "parallel-webpack";

import decoder from '../dist/main.es';

function capitalizeWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createConfig(options) {
  return {
    resolve: {
      extensions: ['.ts', '.js', '.cs'],
      modules: ['node_modules']
    },
    mode: 'development',
    output: {
        path: _resolve(__dirname, './dist'),
        filename: '[name].' + options.target + '.js',
    },
    entry: './src/ModelOne.cs',
    module: {
      rules: [
        {
          test: /\.cs?$/,
          use: [
            {
              loader: _resolve(__dirname, '../dist/main.es.js'),
              options: {
                name: 'BOB'
              }
            }
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
      },
      minimize: false,
    },
    plugins: [],
  };
}

export default createVariants({
  target: ['umd']
}, createConfig);