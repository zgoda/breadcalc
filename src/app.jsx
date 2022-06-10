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

  useEffect(() => setDryIngredientsVisible(flour.left > 0), [flour.left]);

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
