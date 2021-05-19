import { render } from 'preact';
import { App } from './app';

import './style/index.scss';

const root = document.querySelector('#app');
document.body.appendChild(root);
render(<App />, root);
