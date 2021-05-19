import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import commonjs from 'rollup-plugin-commonjs-alternate';
import hotcss from 'rollup-plugin-hot-css';
import static_files from 'rollup-plugin-static-files';
import { terser } from 'rollup-plugin-terser';
import prefresh from '@prefresh/nollup';
import { generateSW } from 'rollup-plugin-workbox';

let config = {
  input: './src/main.js',
  output: {
    dir: 'build',
    format: 'esm',
    entryFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]'
  },
  plugins: [
    hotcss({
      hot: process.env.NODE_ENV === 'development',
      file: 'styles.css',
      loaders: ['scss'],
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    resolve(),
    commonjs({
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    json(),
    process.env.NODE_ENV === 'development' && prefresh(),
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    static_files({
      include: ['./public']
    }),
    terser(),
    generateSW({
      swDest: 'public/sw.js',
      globDirectory: 'public/',
      globPatterns: [
          '**/*.{html,json,js,css,woff,woff2}',
      ],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg|woff|woff2)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 20,
          },
        },
      }],
    }),
  ]);
}

export default config;
