/* eslint-disable react/no-danger */
import { connect } from 'unistore/preact';
import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';

import { actions } from '../service/state';
import { SectionTitle } from './pageinfo';
import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import wetingredients from './wetingredients.json';

function WetIngredientItem(
  {
    item, flourLeft, waterLeft, flourTotal,
    removeItemHandler, changeItemHandler,
  }
) {

  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [waterWeight, setWaterWeight] = useState(0);
  const [waterPc, setWaterPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    setUid(item.get('uid'));
    if (item.has('name')) {
      setName(item.get('name'));
    }
    if (item.has('amtWeight')) {
      setAmtWeight(item.get('amtWeight'));
    }
    if (item.has('amtPc')) {
      setAmtPc(item.get('amtPc'));
    }
    if (item.has('waterWeight')) {
      setWaterWeight(item.get('waterWeight'));
    }
    if (item.has('waterPc')) {
      setWaterPc(item.get('waterPc'));
    }
  }, [item]);

  const nameChange = ((name) => {
    setName(name);
    item.set('name', name);
  });

  const recalcAmount = ((value, type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = flourTotal * value / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = value / flourTotal * 100;
    }
    setAmtWeight(amtWeight);
    item.set('amtWeight', amtWeight);
    setAmtPc(amtPc);
    item.set('amtPc', amtPc);
    changeItemHandler(amtWeight, waterWeight);
  });

  const recalcWater = ((value, type) => {
    if (amtWeight === 0 || amtWeight == null) {
      return;
    }
    let waterPc, waterWeight;
    if (type === AmountType.PERCENT) {
      waterWeight = amtWeight * value / 100;
      waterPc = value;
    } else if (type === AmountType.TOTAL) {
      waterWeight = value;
      waterPc = value / amtWeight * 100;
    }
    setWaterWeight(waterWeight);
    item.set('waterWeight', waterWeight);
    setWaterPc(waterPc);
    item.set('waterPc', waterPc);
    changeItemHandler(amtWeight, waterWeight);
  });

  const makeReadOnly = (() => {
    setReadOnly(true);
  });

  const makeEditable = (() => {
    setReadOnly(false);
  });

  const removeItem = (() => {
    removeItemHandler(uid, amtWeight, waterWeight);
  });

  return (
    <div class="row X--middle">
      <div class="M6">
        <label>
          Nazwa <span class="label-required">*</span>
          <input
            type="text"
            value={name}
            onInput={(e) => nameChange(e.target.value)}
            required
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M2">
        <label>
          Składnik wagowo
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={flourLeft}
            value={amtWeight}
            onInput={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)
            }
            readOnly={readOnly}
          />
        </label>
        <label>
          Składnik procentowo
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            max="100"
            value={amtPc}
            onInput={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
            }
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M2">
        <label>
          Woda wagowo
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={waterLeft}
            value={waterWeight}
            onInput={
              (e) => recalcWater(parseFloat(e.target.value), AmountType.TOTAL)
            }
            readOnly={readOnly}
          />
        </label>
        <label>
          Woda procentowo
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            value={waterPc}
            onInput={
              (e) => recalcWater(parseFloat(e.target.value), AmountType.PERCENT)
            }
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M2">
        {
          readOnly
            ? <UnlockButton actionHandler={makeEditable} />
            : <LockButton actionHandler={makeReadOnly} />
        }
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

const wetIngredientsStateItems = [
  'flourTotal', 'waterTotal', 'flourLeft', 'waterLeft',
  'wetIngredients', 'dryIngredients',
];

function WetIngredientsBase(
  {
    flourTotal, waterTotal, flourLeft, waterLeft, wetIngredients, dryIngredients,
    setWetIngredients, setFlourLeft, setWaterLeft,
  }
) {

  const [canAddItem, setCanAddItem] = useState(true);

  useEffect(() => {
    setCanAddItem(
      (flourLeft > 0 && flourTotal > 0) && (waterLeft > 0 && waterTotal > 0)
    );
  }, [flourTotal, flourLeft, waterTotal, waterLeft, dryIngredients, wetIngredients]);

  const addItemHandler = (() => {
    const items = [...wetIngredients, new Map([['uid', uid(16)]])];
    setWetIngredients(items);
  });

  const removeItemHandler = ((uid, amtFlour, amtWater) => {
    const items = wetIngredients.filter((item) => item.get('uid') !== uid);
    setWetIngredients(items);
    setFlourLeft(flourLeft + amtFlour);
    setWaterLeft(waterLeft + amtWater);
  });

  const changeItemHandler = ((amtFlour, amtWater) => {
    setFlourLeft(flourLeft - amtFlour);
    setWaterLeft(waterLeft - amtWater);
  });

  return (
    <>
      <SectionTitle title={'Mąka i składniki namaczane'} level={3} />
      <p dangerouslySetInnerHTML={{ __html: wetingredients.text }} />
      {!canAddItem && <p class="error">{wetingredients.full}</p>}
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
      <div class="add-item-button">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </>
  );
}

const WetIngredients = connect(wetIngredientsStateItems, actions)(WetIngredientsBase);

export { WetIngredients };
