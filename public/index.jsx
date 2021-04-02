import hydrate from 'preact-iso/hydrate';
import { useLang, useTitle, useMeta } from 'hoofd/preact';

import { PageInfo } from './components/pageinfo.jsx';
import { CalcStart } from './components/calcstart.jsx';

import './style.scss';

export function App() {

  const appTitle = 'Kalkulator ciasta chlebowego';

  useLang('pl');
  useTitle(appTitle);
  useMeta({ name: 'Author', content: 'Jarek Zgoda' });
  useMeta({ name: 'description', content: appTitle });

  return (
    <div class="container">
      <PageInfo title={appTitle} />
      <CalcStart />
    </div>
  );
}

hydrate(<App />);

/**
 * @param {import("preact").JSX.IntrinsicAttributes} data
 */
export async function prerender(data) {
  const { default: prerender } = await import('preact-iso/prerender');
  return await prerender(<App {...data} />);
}
