import { useLang, useTitle, useMeta } from 'hoofd/preact';
import { Provider } from 'unistore/preact';

import { store } from './service/state';
import { PageInfo } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { FlourIngredients } from './components/flour';

function Application() {

  const appTitle = 'Kalkulator ciasta chlebowego';

  useLang('pl');
  useTitle(appTitle);
  useMeta({ name: 'Author', content: 'Jarek Zgoda' });
  useMeta({ name: 'description', content: appTitle });

  return (
    <div class="container">
      <PageInfo title={appTitle} />
      <CalcStart />
      <FlourIngredients />
    </div>
  );
}

const App = (() => {
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  );
});

export { App };
