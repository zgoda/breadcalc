import { PageInfo, SectionTitle } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { DryIngredients } from './components/dryingredients';
import { WetIngredients } from './components/wetingredients';
import { DryAdjuncts } from './components/dryadjuncts';
import { WetAdjuncts } from './components/wetadjuncts';
import { Leaven } from './components/leaven';
import { About } from './components/about';

import './style/index.scss';

export function App() {
  return (
    <>
      <div class="container">
        <PageInfo title="Kalkulator ciasta chlebowego" />
        <CalcStart />
        <SectionTitle title={'Składniki'} level={2} />
        <DryIngredients />
        <WetIngredients />
        <DryAdjuncts />
        <WetAdjuncts />
        <Leaven />
        <SectionTitle title={'Ciasto właściwe'} level={2} />
        <hr />
      </div>
      <About />
    </>
  );
}
