import { useLang, useTitle, useMeta } from 'hoofd/preact';
import { Provider } from 'unistore/preact';

import { store } from './service/state';
import { Navigation } from './components/navigation';
import { PageInfo, SectionTitle } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { DryIngredients } from './components/dryingredients';
import { WetIngredients } from './components/wetingredients';
import { DryAdjuncts } from './components/dryadjuncts';
import { WetAdjuncts } from './components/wetadjuncts';
import { Leaven } from './components/leaven';
import { About } from './components/about';

function Application() {

  const appTitle = 'Kalkulator ciasta chlebowego';

  useLang('pl');
  useTitle(appTitle);
  useMeta({ name: 'Author', content: 'Jarek Zgoda' });
  useMeta({ name: 'description', content: appTitle });

  return (
    <div class="container">
      <Navigation />
      <PageInfo title={appTitle} />
      <CalcStart />
      <SectionTitle title={'Składniki'} level={2} />
      <DryIngredients />
      <WetIngredients />
      <DryAdjuncts />
      <WetAdjuncts />
      <SectionTitle title={'Zaczyn'} level={2} />
      <Leaven />
      <SectionTitle title={'Ciasto właściwe'} level={2} />
      <hr />
      <About />
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
