/* eslint-disable react/no-danger */
import { connect } from 'unistore/preact';
import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import snarkdown from 'snarkdown';

import { actions } from '../service/state';
import { SectionTitle } from './pageinfo';
import { AddItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import wetingredients from './wetingredients.json';

function WetIngredientItem(
  { 
    item, flourLeft, waterLeft, flourTotal, waterTotal,
    removeItemHandler, setFlourLeft, setWaterLeft,
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
    setFlourLeft(flourLeft - amtWeight);
  });

  const recalcWater = ((value, type) => {
    let waterPc, waterWeight;
    if (type === AmountType.PERCENT) {
      waterWeight = waterTotal * value / 100;
      waterPc = value;
    } else if (type === AmountType.TOTAL) {
      waterWeight = value;
      waterPc = value / waterTotal * 100;
    }
    setWaterWeight(waterWeight);
    item.set('waterWeight', waterWeight);
    setWaterPc(waterPc);
    item.set('waterPc', waterPc);
    setWaterLeft(waterLeft - waterWeight);
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
              (e) => recalcAmount(Number.parseFloat(e.target.value), AmountType.TOTAL)
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
              (e) => recalcAmount(Number.parseFloat(e.target.value), AmountType.PERCENT)
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
              (e) => recalcWater(Number.parseFloat(e.target.value), AmountType.TOTAL)
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
            max="100"
            value={waterPc}
            onInput={
              (e) => recalcWater(Number.parseFloat(e.target.value), AmountType.PERCENT)
            }
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M2">
        Akcje
      </div>
    </div>
  );
}

const wetIngredientsStateItems = ['flourTotal', 'waterTotal', 'wetIngredients'];

function WetIngredientsBase(
  { flourTotal, waterTotal, wetIngredients, setWetIngredients }
) {

  const [flourLeft, setFlourLeft] = useState(0);
  const [waterLeft, setWaterLeft] = useState(0);
  const [canAddItem, setCanAddItem] = useState(true);

  useEffect(() => {
    let usedFlour = 0;
    let usedWater = 0;
    wetIngredients.forEach((item) => {
      let curUsedFlour = item.get('amtWeight');
      if (curUsedFlour == null) {
        curUsedFlour = 0;
      }
      usedFlour = usedFlour + curUsedFlour;
      let curUsedWater = item.get('waterWeight');
      if (curUsedWater == null) {
        curUsedWater = 0;
      }
      usedWater = usedWater + curUsedWater;
    });
    const flourLeft =
      wetIngredients.length ? flourTotal - usedFlour : flourTotal;
    setFlourLeft(flourLeft);
    const waterLeft = wetingredients.length ? waterTotal - usedWater : waterTotal;
    setWaterLeft(waterLeft);
  }, [flourTotal, waterTotal, wetIngredients]);

  useEffect(() => {
    setCanAddItem(flourLeft > 0 && flourTotal > 0 && waterLeft > 0 && waterTotal > 0);
  }, [flourTotal, flourLeft, waterTotal, waterLeft]);

  const addItemHandler = (() => {
    const items = [...wetIngredients, new Map([['uid', uid(16)]])];
    setWetIngredients(items);
  });

  const removeItemHandler = ((uid) => {
    const items = wetIngredients.filter((item) => item.get('uid') !== uid);
    setWetIngredients(items);
  });

  return (
    <>
      <SectionTitle title={'Mąka i składniki namaczane'} level={3} />
      <p dangerouslySetInnerHTML={{ __html: snarkdown(wetingredients.text) }} />
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
              waterTotal={waterTotal}
              removeItemHandler={removeItemHandler}
              setFlourLeft={setFlourLeft}
              setWaterLeft={setWaterLeft}
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
