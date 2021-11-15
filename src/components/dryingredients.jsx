import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AddItemButton, RemoveItemButton, LockButton, UnlockButton } from './misc';
import { AmountType } from '../utils/numbers';
import { SectionTitle } from './pageinfo';
import dryingredients from './dryingredients.json';
import {
  addDryIngredient,
  dryIngredientsStore,
  flourLeftStore,
  flourTotalStore,
  removeDryIngredient,
  updateDryIngredient,
} from '../service/state';

/**
 * @typedef {object} DryIngredientItemProps
 * @property {import('../..').DryItem} item
 * @property {number} flourLeft
 * @property {number} flourTotal
 *
 * @param {DryIngredientItemProps} props
 * @returns {JSX.Element}
 */
function DryIngredientItem({ item, flourLeft, flourTotal }) {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    setName(item.name);
    setAmtWeight(item.amount);
    setAmtPc(item.percentage);
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    setName(name);
    item.name = name;
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
    item.amount = amtWeight;
    setAmtPc(amtPc);
    item.percentage = amtPc;
    updateDryIngredient(item);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => removeDryIngredient(item.id);

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

  const addItemHandler = () =>
    addDryIngredient({ id: uid(16), name: '', amount: 0, percentage: 0 });

  return (
    <section>
      <SectionTitle title="Mąka i składniki suche" level={3} />
      <p>{dryingredients.text}</p>
      {warnFull && <p class="error">{dryingredients.full}</p>}
      <form>
        {dryIngredients.map((item) => (
          <DryIngredientItem
            item={item}
            key={item.id}
            flourLeft={flourLeft}
            flourTotal={flourTotal}
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
