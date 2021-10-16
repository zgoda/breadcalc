import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import commonjs from 'rollup-plugin-commonjs-alternate';
import hotcss from 'rollup-plugin-hot-css';
import static_files from 'rollup-plugin-static-files';
import { terser } from 'rollup-plugin-terser';
import prefresh from '@prefresh/nollup';
import { generateSW } from 'rollup-plugin-workbox';
import copy from 'rollup-plugin-copy';

const envStr = JSON.stringify(process.env.NODE_ENV);

let config = {
  input: './src/main.js',
  output: {
    dir: 'build',
    format: 'esm',
    entryFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]',
  },
  plugins: [
    replace({
      values: {
        'process.env.NODE_ENV': envStr,
      },
      preventAssignment: true,
    }),
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
        'process.env.NODE_ENV': envStr,
      },
    }),
    json(),
    process.env.NODE_ENV === 'development' && prefresh(),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    static_files({
      include: ['./public'],
    }),
    terser(),
    copy({
      hook: 'buildStart',
      targets: [{ src: 'assets/manifest.json', dest: 'build/' }],
      flatten: false,
    }),
    copy({
      hook: 'buildStart',
      targets: [{ src: 'assets/icons/**/*', dest: 'build/' }],
      flatten: true,
    }),
    generateSW({
      swDest: 'build/sw.js',
      globDirectory: 'build/',
      globPatterns: ['**/*.{html,json,js,css,woff,woff2}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|woff|woff2)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 20,
            },
          },
        },
      ],
    }),
  ]);
}

export default config;
