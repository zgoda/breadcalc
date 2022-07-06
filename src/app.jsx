import { useState, useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';

import { flourStore, waterStore } from './state/stores';

import { PageInfo } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { About } from './components/about';
import { DryIngredients } from './components/dryingredients';
import { WetIngredients } from './components/wetingredients';
import { DryAdjuncts } from './components/dryadjuncts';
import { WetAdjuncts } from './components/wetadjuncts';
import { Leaven } from './components/leaven';

export function App() {
  const [dryIngredientsVisible, setDryIngredientsVisible] = useState(false);
  const [wetIngredientsVisible, setWetIngredientsVisible] = useState(false);
  const [dryAdjunctsVisible, setDryAdjunctsVisible] = useState(false);
  const [wetAdjunctsVisible, setWetAdjunctsVisible] = useState(false);
  const [leavenVisible, setLeavenVisible] = useState(false);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);

  useEffect(() => {
    const dryVisible = flour.total > 0;
    setDryIngredientsVisible(dryVisible);
    setWetIngredientsVisible(dryVisible && water.total > 0);
    setDryAdjunctsVisible(dryVisible);
    setWetAdjunctsVisible(water.total > 0);
    setLeavenVisible(dryVisible && water.total > 0);
  }, [flour.total, water.total]);

  return (
    <>
      <PageInfo title="Kalkulator ciasta chlebowego" />
      <CalcStart />
      {leavenVisible && <Leaven />}
      {dryIngredientsVisible && <DryIngredients />}
      {wetIngredientsVisible && <WetIngredients />}
      {dryAdjunctsVisible && <DryAdjuncts />}
      {wetAdjunctsVisible && <WetAdjuncts />}
      <hr />
      <About />
    </>
  );
}
