import { useLang, useTitle, useMeta } from 'hoofd/preact';
import { Provider } from 'unistore/preact';

import { store } from './service/state';
import { PageInfo, SectionTitle } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { DryIngredients } from './components/dryingredients';
import { WetIngredients } from './components/wetingredients';
import { DryAdjuncts } from './components/dryadjuncts';

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
      <DryAdjuncts />
      <SectionTitle title={'Zaczyn'} level={2} />
      <SectionTitle title={'Ciasto właściwe'} level={2} />
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
