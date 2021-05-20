import { render } from 'preact';
import { App } from './app';

import './style/index.scss';

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}

const root = document.querySelector('#app');
document.body.appendChild(root);
render(<App />, root);
