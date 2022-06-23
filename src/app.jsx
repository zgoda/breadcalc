import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';

import { flourStore, waterStore } from './state/stores';

import { PageInfo } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { About } from './components/about';
import { DryIngredients } from './components/dryingredients';
import { WetIngredients } from './components/wetingredients';

export function App() {
  const [dryIngredientsVisible, setDryIngredientsVisible] = useState(false);
  const [wetIngredientsVisible, setWetIngredientsVisible] = useState(false);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);

  useEffect(() => {
    setDryIngredientsVisible(flour.total > 0);
    setWetIngredientsVisible(flour.total > 0 && water.total > 0);
  }, [flour.total, water.total]);

  return (
    <>
      <PageInfo title="Kalkulator ciasta chlebowego" />
      <CalcStart />
      {dryIngredientsVisible && <DryIngredients />}
      {wetIngredientsVisible && <WetIngredients />}
      <hr />
      <About />
    </>
  );
}
