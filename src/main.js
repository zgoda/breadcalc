import { render } from 'preact';
import { App } from './app';

import './style/index.scss';

const root = document.querySelector('#app');
document.body.appendChild(root);
render(<App />, root);

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-esm.js');
  });
}
