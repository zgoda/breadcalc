import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AmountType } from '../utils/numbers';
import { SectionTitle } from './pageinfo';
import { AddItemButton, RemoveItemButton } from './misc';
import wetadjuncts from './wetadjuncts.json';
import {
  flourStore,
  waterStore,
  wetAdjunctsStore,
  wetIngredientsStore,
} from '../state/stores';
import { wetAdjunctsActions } from '../state/actions';

/**
 * @typedef {object} WetAdjunctItemProps
 * @property {import('../..').WetItem} item
 *
 * @param {WetAdjunctItemProps} props
 * @returns {JSX.Element}
 */
function WetAdjunctItem({ item }) {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [waterWeight, setWaterWeight] = useState(0);
  const [waterPc, setWaterPc] = useState(0);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);

  useEffect(() => {
    setName(item.name);
    setAmtWeight(item.amount);
    setAmtPc(item.percentage);
    setWaterWeight(item.waterAmount);
    setWaterPc(item.waterPercentage);
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    setName(name);
    item.name = name;
    wetAdjunctsActions.update(item);
  };

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flour.total * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flour.total) * 100;
    }
    setAmtWeight(amtWeight);
    item.amount = amtWeight;
    setAmtPc(amtPc);
    item.percentage = amtPc;
    wetAdjunctsActions.update(item);
  };

  const recalcWater = (/** @type {number} */ value, /** @type {string} */ type) => {
    if (amtWeight === 0 || amtWeight == null) {
      return;
    }
    let waterPc, waterWeight;
    if (type === AmountType.PERCENT) {
      waterWeight = (amtWeight * value) / 100;
      waterPc = value;
    } else if (type === AmountType.TOTAL) {
      waterWeight = value;
      waterPc = (value / amtWeight) * 100;
    }
    setWaterWeight(waterWeight);
    item.waterAmount = waterWeight;
    setWaterPc(waterPc);
    item.waterPercentage = waterPc;
    wetAdjunctsActions.update(item);
  };

  const removeItem = () => {
    wetAdjunctsActions.remove(item.id);
  };

  return (
    <div class="section-wrapper">
      <div>
        <label>
          Nazwa <span class="label-required">*</span>
          <input
            type="text"
            value={name}
            // @ts-ignore
            onInput={(e) => nameChange(e.target.value)}
            required
          />
        </label>
        <label>
          Składnik wagowo
          <input
            type="number"
            inputMode="numeric"
            step="1"
            value={amtWeight}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
            // @ts-ignore
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Składnik procentowo
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            value={amtPc}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
            // @ts-ignore
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Woda wagowo
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={water.left}
            value={waterWeight}
            // @ts-ignore
            onBlur={(e) => recalcWater(parseFloat(e.target.value), AmountType.TOTAL)}
            // @ts-ignore
            onInput={(e) => setWaterWeight(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Woda procentowo
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            value={waterPc}
            // @ts-ignore
            onBlur={(e) => recalcWater(parseFloat(e.target.value), AmountType.PERCENT)}
            // @ts-ignore
            onInput={(e) => setWaterPc(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div class="column-center center">
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

function WetAdjuncts() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const water = useStore(waterStore);
  const flour = useStore(flourStore);
  const wetAdjuncts = useStore(wetAdjunctsStore);
  const wetIngredients = useStore(wetIngredientsStore);

  useEffect(() => {
    setCanAddItem(water.left > 0 && water.total > 0);
    setWarnFull(water.left <= 0 && water.total > 0);
  }, [flour, water, wetAdjuncts, wetIngredients]);

  const addItemHandler = () =>
    wetAdjunctsActions.add({
      id: uid(16),
      name: '',
      amount: 0,
      percentage: 0,
      waterAmount: 0,
      waterPercentage: 0,
    });

  return (
    <section>
      <SectionTitle title="Dodatki namaczane" level={3} />
      <p>{wetadjuncts.text}</p>
      {warnFull && <p class="error">{wetadjuncts.full}</p>}
      <form>
        {wetAdjuncts.map((item) => (
          <WetAdjunctItem item={item} key={item.id} />
        ))}
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </section>
  );
}

export { WetAdjuncts };
