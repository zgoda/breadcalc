/* eslint-disable react/no-danger */
import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { SectionTitle } from './pageinfo';
import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import wetingredients from '../data/wetingredients.json';
import {
  dryIngredientsStore,
  flourLeftStore,
  flourTotalStore,
  setFlourLeft,
  setWaterLeft,
  setWetIngredients,
  waterLeftStore,
  waterTotalStore,
  wetIngredientsStore,
} from '../service/state';

/**
 * @typedef {object} WetIngredientItemProps
 * @property {Map<string, string|number>} item
 * @property {number} flourLeft
 * @property {number} waterLeft
 * @property {number} flourTotal
 * @property {(arg0: string, arg1: number, arg2: number) => void} removeItemHandler
 * @property {(arg0: number, arg1: number) => void} changeItemHandler
 *
 * @param {WetIngredientItemProps} param0
 * @returns {JSX.Element}
 */
function WetIngredientItem({
  item,
  flourLeft,
  waterLeft,
  flourTotal,
  removeItemHandler,
  changeItemHandler,
}) {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [waterWeight, setWaterWeight] = useState(0);
  const [waterPc, setWaterPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    setUid(item.get('uid').toString());
    if (item.has('name')) {
      setName(item.get('name').toString());
    }
    if (item.has('amtWeight')) {
      setAmtWeight(Number(item.get('amtWeight')));
    }
    if (item.has('amtPc')) {
      setAmtPc(Number(item.get('amtPc')));
    }
    if (item.has('waterWeight')) {
      setWaterWeight(Number(item.get('waterWeight')));
    }
    if (item.has('waterPc')) {
      setWaterPc(Number(item.get('waterPc')));
    }
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    setName(name);
    item.set('name', name);
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
    item.set('amtWeight', amtWeight);
    setAmtPc(amtPc);
    item.set('amtPc', amtPc);
    changeItemHandler(amtWeight, waterWeight);
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
    item.set('waterWeight', waterWeight);
    setWaterPc(waterPc);
    item.set('waterPc', waterPc);
    changeItemHandler(amtWeight, waterWeight);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => {
    removeItemHandler(uid, amtWeight, waterWeight);
  };

  return (
    <div class="row X--middle">
      <div class="M6">
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
      </div>
      <div class="M2">
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
      </div>
      <div class="M2">
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
      <div class="M1 center">
        {readOnly ? (
          <UnlockButton actionHandler={makeEditable} />
        ) : (
          <LockButton actionHandler={makeReadOnly} />
        )}
      </div>
      <div class="M1 center">
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

  const addItemHandler = () => {
    const items = [...wetIngredients, new Map([['uid', uid(16)]])];
    setWetIngredients(items);
  };

  const removeItemHandler = (
    /** @type {string} */ uid,
    /** @type {number} */ amtFlour,
    /** @type {number} */ amtWater,
  ) => {
    const items = wetIngredients.filter((item) => item.get('uid') !== uid);
    setWetIngredients(items);
    setFlourLeft(flourLeft + amtFlour);
    setWaterLeft(waterLeft + amtWater);
  };

  const changeItemHandler = (
    /** @type {number} */ amtFlour,
    /** @type {number} */ amtWater,
  ) => {
    setFlourLeft(flourLeft - amtFlour);
    setWaterLeft(waterLeft - amtWater);
  };

  return (
    <>
      <SectionTitle title={wetingredients.title} level={3} />
      <p dangerouslySetInnerHTML={{ __html: wetingredients.text }} />
      {warnFull && <p class="error">{wetingredients.full}</p>}
      <form>
        <fieldset>
          {wetIngredients.map((item) => (
            <WetIngredientItem
              item={item}
              key={item.get('uid')}
              flourLeft={flourLeft}
              flourTotal={flourTotal}
              waterLeft={waterLeft}
              removeItemHandler={removeItemHandler}
              changeItemHandler={changeItemHandler}
            />
          ))}
        </fieldset>
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </>
  );
}

export { WetIngredients };
