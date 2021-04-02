import { useLang, useTitle, useMeta } from 'hoofd/preact';

import { PageInfo } from './components/pageinfo';
import { CalcStart } from './components/calcstart';

function App() {

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

export { App };
