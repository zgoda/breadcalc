import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { SectionTitle } from './pageinfo';
import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import wetingredients from './wetingredients.json';
import {
  dryIngredientsStore,
  flourLeftStore,
  flourTotalStore,
  waterLeftStore,
  waterTotalStore,
  wetIngredientsStore,
} from '../state/stores';
import { wetIngredientsActions } from '../state/actions';

/**
 * @typedef {object} WetIngredientItemProps
 * @property {import('../..').WetItem} item
 * @property {number} flourLeft
 * @property {number} waterLeft
 * @property {number} flourTotal
 *
 * @param {WetIngredientItemProps} props
 * @returns {JSX.Element}
 */
function WetIngredientItem({ item, flourLeft, waterLeft, flourTotal }) {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [waterWeight, setWaterWeight] = useState(0);
  const [waterPc, setWaterPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

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
    wetIngredientsActions.update(item);
  };

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flourTotal * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flourTotal) * 100;
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

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => wetIngredientsActions.remove(item.id);

  return (
    <div class="section-wrapper">
      <div>
        <label>
          {wetingredients.form.fields.name.label} <span class="label-required">*</span>
          <input
            type="text"
            value={name}
            // @ts-ignore
            onInput={(e) => nameChange(e.target.value)}
            required
            readOnly={readOnly}
          />
        </label>
        <label>
          {wetingredients.form.fields.ingByWeight.label}
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={flourLeft}
            value={amtWeight}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
            // @ts-ignore
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
        <label>
          {wetingredients.form.fields.ingByPercent.label}
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            max="100"
            value={amtPc}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
            // @ts-ignore
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
        <label>
          {wetingredients.form.fields.waterByWeight.label}
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={waterLeft}
            value={waterWeight}
            // @ts-ignore
            onBlur={(e) => recalcWater(parseFloat(e.target.value), AmountType.TOTAL)}
            // @ts-ignore
            onInput={(e) => setWaterWeight(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
        <label>
          {wetingredients.form.fields.waterByPercent.label}
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            value={waterPc}
            // @ts-ignore
            onBlur={(e) => recalcWater(parseFloat(e.target.value), AmountType.PERCENT)}
            // @ts-ignore
            onInput={(e) => setWaterPc(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="column-center center">
        {readOnly ? (
          <UnlockButton actionHandler={makeEditable} />
        ) : (
          <LockButton actionHandler={makeReadOnly} />
        )}
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

function WetIngredients() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const flourLeft = useStore(flourLeftStore);
  const flourTotal = useStore(flourTotalStore);
  const waterLeft = useStore(waterLeftStore);
  const waterTotal = useStore(waterTotalStore);
  const dryIngredients = useStore(dryIngredientsStore);
  const wetIngredients = useStore(wetIngredientsStore);

  useEffect(() => {
    setCanAddItem(flourLeft > 0 && flourTotal > 0 && waterLeft > 0 && waterTotal > 0);
    setWarnFull(flourLeft <= 0 && flourTotal > 0 && waterLeft <= 0 && waterTotal > 0);
  }, [flourTotal, flourLeft, waterTotal, waterLeft, dryIngredients, wetIngredients]);

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
      <SectionTitle title={wetingredients.title} level={3} />
      <p>{wetingredients.text}</p>
      {warnFull && <p class="error">{wetingredients.full}</p>}
      <form>
        {wetIngredients.map((item) => (
          <WetIngredientItem
            item={item}
            key={item.id}
            flourLeft={flourLeft}
            flourTotal={flourTotal}
            waterLeft={waterLeft}
          />
        ))}
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </section>
  );
}

export { WetIngredients };
