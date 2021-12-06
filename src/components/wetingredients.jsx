import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { SectionTitle } from './pageinfo';
import { AddItemButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import { text } from './wetingredients.json';
import {
  labelAmtGms,
  labelAmtPc,
  labelName,
  labelWaterGms,
  labelWaterPc,
} from './forms.json';
import {
  dryIngredientsStore,
  flourStore,
  waterStore,
  wetIngredientsStore,
} from '../state/stores';
import { wetIngredientsActions } from '../state/actions';

/**
 * @typedef {object} WetIngredientItemProps
 * @property {import('../..').WetItem} item
 *
 * @param {WetIngredientItemProps} props
 * @returns {JSX.Element}
 */
function WetIngredientItem({ item }) {
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
    item.name = name;
    wetIngredientsActions.update(item);
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
    wetIngredientsActions.update(item);
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
    wetIngredientsActions.update(item);
  };

  const removeItem = () => wetIngredientsActions.remove(item.id);

  return (
    <div class="section-wrapper">
      <div class="row">
        <div class="column">
          <label>
            {labelName} <span class="label-required">*</span>
            <input
              type="text"
              value={name}
              // @ts-ignore
              onInput={(e) => setName(e.target.value)}
              // @ts-ignore
              onBlur={(e) => nameChange(e.target.value)}
              required
            />
          </label>
        </div>
        <div class="column">
          <label>
            {labelAmtGms}
            <input
              type="number"
              inputMode="numeric"
              step="1"
              max={flour.left}
              value={amtWeight}
              // @ts-ignore
              onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
              // @ts-ignore
              onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            />
          </label>
          <label>
            {labelAmtPc}
            <input
              type="number"
              inputMode="numeric"
              step="0.1"
              max="100"
              value={amtPc}
              onBlur={(e) =>
                // @ts-ignore
                recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
              }
              // @ts-ignore
              onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            />
          </label>
        </div>
        <div class="column">
          <label>
            {labelWaterGms}
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
            {labelWaterPc}
            <input
              type="number"
              inputMode="numeric"
              step="0.1"
              value={waterPc}
              onBlur={(e) =>
                // @ts-ignore
                recalcWater(parseFloat(e.target.value), AmountType.PERCENT)
              }
              // @ts-ignore
              onInput={(e) => setWaterPc(parseFloat(e.target.value))}
            />
          </label>
        </div>
      </div>
      <div class="column-center center">
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

function WetIngredients() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);
  const dryIngredients = useStore(dryIngredientsStore);
  const wetIngredients = useStore(wetIngredientsStore);

  useEffect(() => {
    setCanAddItem(
      flour.left > 0 && flour.total > 0 && water.left > 0 && water.total > 0,
    );
    setWarnFull(
      (flour.left <= 0 && flour.total > 0) || (water.left <= 0 && water.total > 0),
    );
  }, [flour, water, dryIngredients, wetIngredients]);

  const addItemHandler = () =>
    wetIngredientsActions.add({
      id: uid(16),
      name: '',
      amount: 0,
      percentage: 0,
      waterAmount: 0,
      waterPercentage: 0,
    });

  return (
    <section>
      <SectionTitle title={text.title} level={3} />
      <p>{text.intro}</p>
      {warnFull && <p class="error">{text.full}</p>}
      <form>
        {wetIngredients.map((item) => (
          <WetIngredientItem item={item} key={item.id} />
        ))}
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </section>
  );
}

export { WetIngredients };
