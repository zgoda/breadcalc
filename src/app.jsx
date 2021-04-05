import { useLang, useTitle, useMeta } from 'hoofd/preact';
import { Provider } from 'unistore/preact';

import { store } from './service/state';
import { PageInfo, SectionTitle } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { DryIngredients } from './components/dryingredients';
import { WetIngredients } from './components/wetingredients';

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
      <SectionTitle title={'Składniki'} level={2} />
      <DryIngredients />
      <WetIngredients />
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
