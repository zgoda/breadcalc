import hydrate from 'preact-iso/hydrate';
import { useLang, useTitle, useMeta } from 'hoofd/preact';

import pageinfo from './components/pageinfo.json';
import './style.scss';

export function App() {

  const appTitle = 'Kalkulator ciasta chlebowego';

  useLang('pl');
  useTitle(appTitle);
  useMeta({ name: 'Author', content: 'Jarek Zgoda' });
  useMeta({ name: 'description', content: appTitle });

  return (
    <div class="container">
      <h1>{appTitle}</h1>
      {pageinfo.text.map((line) => {
        return (
          <p>{line}</p>
        );
      })}
    </div>
  );
}

hydrate(<App />);

export async function prerender(data) {
  const { default: prerender } = await import('preact-iso/prerender');
  return await prerender(<App {...data} />);
}
