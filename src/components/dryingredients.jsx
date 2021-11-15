import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AddItemButton, RemoveItemButton, LockButton, UnlockButton } from './misc';
import { AmountType } from '../utils/numbers';
import { SectionTitle } from './pageinfo';
import dryingredients from './dryingredients.json';
import {
  dryIngredientsStore,
  flourLeftStore,
  flourTotalStore,
  setDryIngredients,
  setFlourLeft,
} from '../service/state';

/**
 * @typedef {object} DryIngredientItemProps
 * @property {Map<string, string|number>} item
 * @property {number} flourLeft
 * @property {number} flourTotal
 * @property {(arg0: string, arg1: number) => void} removeItemHandler
 * @property {(arg0: number) => void} changeItemHandler
 *
 * @param {DryIngredientItemProps} props
 * @returns {JSX.Element}
 */
function DryIngredientItem({
  item,
  flourLeft,
  flourTotal,
  removeItemHandler,
  changeItemHandler,
}) {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
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
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    setName(name);
    item.set('name', name);
  };

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    if (isNaN(value)) {
      return;
    }
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
    changeItemHandler(amtWeight);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => {
    removeItemHandler(uid, amtWeight);
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
          Ilość (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={flourLeft}
            value={amtWeight}
            // @ts-ignore
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
            readOnly={readOnly}
          />
        </label>
        <label>
          Ilość (%)
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            max="100"
            value={amtPc}
            // @ts-ignore
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
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

function DryIngredients() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const flourTotal = useStore(flourTotalStore);
  const flourLeft = useStore(flourLeftStore);
  const dryIngredients = useStore(dryIngredientsStore);

  useEffect(() => {
    setCanAddItem(flourLeft > 0 && flourTotal > 0);
    setWarnFull(flourLeft <= 0 && flourTotal > 0);
  }, [flourTotal, flourLeft, dryIngredients]);

  const addItemHandler = () => {
    const items = [...dryIngredients, new Map([['uid', uid(16)]])];
    setDryIngredients(items);
  };

  const removeItemHandler = (
    /** @type {string} */ uid,
    /** @type {number} */ amount,
  ) => {
    const items = dryIngredients.filter(
      (/** @type {Map<string, string|number>} */ item) => item.get('uid') !== uid,
    );
    setDryIngredients(items);
    if (!isNaN(amount)) {
      setFlourLeft(flourLeft + amount);
    }
  };

  const changeItemHandler = (/** @type {number} */ amount) => {
    if (!isNaN(amount)) {
      setFlourLeft(flourLeft - amount);
    }
  };

  return (
    <section>
      <SectionTitle title="Mąka i składniki suche" level={3} />
      <p>{dryingredients.text}</p>
      {warnFull && <p class="error">{dryingredients.full}</p>}
      <form>
        {dryIngredients.map((item) => (
          <DryIngredientItem
            item={item}
            key={item.get('uid')}
            flourLeft={flourLeft}
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

export { DryIngredients };
