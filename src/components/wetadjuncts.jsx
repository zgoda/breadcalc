import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AmountType } from '../utils/numbers';
import { SectionTitle } from './pageinfo';
import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import wetadjuncts from './wetadjuncts.json';
import {
  flourTotalStore,
  setWaterLeft,
  setWetAdjuncts,
  waterLeftStore,
  waterTotalStore,
  wetAdjunctsStore,
  wetIngredientsStore,
} from '../service/state';

/**
 * @typedef {object} WetAdjunctItemProps
 * @property {Map<string, string|number>} item
 * @property {number} waterLeft
 * @property {number} flourTotal
 * @property {(arg0: string) => void} removeItemHandler
 * @property {(arg0: number) => void} changeItemHandler
 *
 * @param {WetAdjunctItemProps} props
 * @returns {JSX.Element}
 */
function WetAdjunctItem({
  item,
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
    changeItemHandler(waterWeight);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => {
    removeItemHandler(uid);
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
            readOnly={readOnly}
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
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
            // @ts-ignore
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
        <label>
          Woda wagowo
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

function WetAdjuncts() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const waterTotal = useStore(waterTotalStore);
  const waterLeft = useStore(waterLeftStore);
  const flourTotal = useStore(flourTotalStore);
  const wetAdjuncts = useStore(wetAdjunctsStore);
  const wetIngredients = useStore(wetIngredientsStore);

  useEffect(() => {
    setCanAddItem(waterLeft > 0 && waterTotal > 0);
    setWarnFull(waterLeft <= 0 && waterTotal > 0);
  }, [flourTotal, waterTotal, waterLeft, wetAdjuncts, wetIngredients]);

  const addItemHandler = () => {
    const items = [...wetAdjuncts, new Map([['uid', uid(16)]])];
    setWetAdjuncts(items);
  };

  const removeItemHandler = (/** @type {string} */ uid) => {
    const items = wetAdjuncts.filter(
      (/** @type {Map<string, string|number>} */ item) => item.get('uid') !== uid,
    );
    setWetAdjuncts(items);
  };

  const changeItemHandler = (/** @type {number} */ amtWater) => {
    setWaterLeft(waterLeft + amtWater);
  };

  return (
    <section>
      <SectionTitle title="Dodatki namaczane" level={3} />
      <p>{wetadjuncts.text}</p>
      {warnFull && <p class="error">{wetadjuncts.full}</p>}
      <form>
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
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </section>
  );
}

export { WetAdjuncts };
