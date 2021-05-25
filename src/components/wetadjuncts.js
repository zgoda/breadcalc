import { connect } from 'unistore/preact';
import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';

import { AmountType } from '../utils/numbers';
import { actions } from '../service/state';
import { SectionTitle } from './pageinfo';
import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import wetadjuncts from './wetadjuncts.json';

function WetAdjunctItem(
  { item, waterLeft, flourTotal, removeItemHandler, changeItemHandler }
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
    changeItemHandler(waterWeight);
  });

  const makeReadOnly = (() => {
    setReadOnly(true);
  });

  const makeEditable = (() => {
    setReadOnly(false);
  });

  const removeItem = (() => {
    removeItemHandler(uid);
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
            value={amtWeight}
            onBlur={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)
            }
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
        <label>
          Składnik procentowo
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            value={amtPc}
            onBlur={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
            }
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
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
            onBlur={
              (e) => recalcWater(parseFloat(e.target.value), AmountType.TOTAL)
            }
            onInput={(e) => setWaterWeight(parseFloat(e.target.value))}
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
            onBlur={
              (e) => recalcWater(parseFloat(e.target.value), AmountType.PERCENT)
            }
            onInput={(e) => setWaterPc(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M1 center">
        {
          readOnly
            ? <UnlockButton actionHandler={makeEditable} />
            : <LockButton actionHandler={makeReadOnly} />
        }
      </div>
      <div class="M1 center">
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );

}

const wetAdjunctsStateItems = [
  'flourTotal', 'waterTotal', 'waterLeft', 'wetAdjuncts', 'wetIngredients',
];

function WetAdjunctsBase(
  {
    flourTotal, waterTotal, waterLeft, wetAdjuncts, wetIngredients,
    setWetAdjuncts, setWaterLeft,
  }
) {

  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  useEffect(() => {
    setCanAddItem(waterLeft > 0 && waterTotal > 0);
    setWarnFull(waterLeft <= 0 && waterTotal > 0);
  }, [flourTotal, waterTotal, waterLeft, wetAdjuncts, wetIngredients]);

  const addItemHandler = (() => {
    const items = [...wetAdjuncts, new Map([['uid', uid(16)]])];
    setWetAdjuncts(items);
  });

  const removeItemHandler = ((uid) => {
    const items = wetAdjuncts.filter((item) => item.get('uid') !== uid);
    setWetAdjuncts(items);
  });

  const changeItemHandler = ((amtWater) => {
    setWaterLeft(waterLeft + amtWater);
  });

  return (
    <>
      <SectionTitle title={'Dodatki namaczane'} level={3} />
      <p>{wetadjuncts.text}</p>
      {warnFull && <p class="error">{wetadjuncts.full}</p>}
      <form>
        <fieldset>
          {wetAdjuncts.map((item) => (
            <WetAdjunctItem
              item={item}
              key={item.get('uid')}
              waterLeft={waterLeft}
              flourTotal={flourTotal}
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

const WetAdjuncts = connect(wetAdjunctsStateItems, actions)(WetAdjunctsBase);

export { WetAdjuncts };
