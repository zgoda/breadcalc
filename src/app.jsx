import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';

import { flourStore } from './state/stores';

import { PageInfo } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { About } from './components/about';
import { DryIngredients } from './components/dryingredients';

export function App() {
  const [dryIngredientsVisible, setDryIngredientsVisible] = useState(false);

  const flour = useStore(flourStore);

  useEffect(() => setDryIngredientsVisible(flour.total > 0), [flour.total]);

  return (
    <>
      <PageInfo title="Kalkulator ciasta chlebowego" />
      <CalcStart />
      {dryIngredientsVisible && <DryIngredients />}
      <hr />
      <About />
    </>
  );
}
