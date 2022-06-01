import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AddItemButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import { SectionTitle } from './pageinfo';
import { text, title } from './dryingredients.json';
import { labelAmtGms, labelAmtPc, labelName } from './forms.json';
import { dryIngredientsStore, flourStore } from '../state/stores';
import { dryIngredientsActions } from '../state/actions';

/**
 * @typedef {object} DryIngredientItemProps
 * @property {import('../..').DryItem} item
 *
 * @param {DryIngredientItemProps} props
 * @returns {JSX.Element}
 */
function DryIngredientItem({ item }) {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  const flourData = useStore(flourStore);

  useEffect(() => {
    setName(item.name);
    setAmtWeight(item.amount);
    setAmtPc(item.percentage);
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    item.name = name;
    dryIngredientsActions.update(item);
  };

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    if (isNaN(value)) {
      return;
    }
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flourData.total * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flourData.total) * 100;
    }
    setAmtWeight(amtWeight);
    item.amount = amtWeight;
    setAmtPc(amtPc);
    item.percentage = amtPc;
    dryIngredientsActions.update(item);
  };

  const removeItem = () => dryIngredientsActions.remove(item.id);

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
              max={flourData.left}
              value={amtWeight}
              // @ts-ignore
              onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
              // @ts-ignore
              onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
            />
          </label>
        </div>
        <div class="column">
          <label>
            {labelAmtPc}
            <input
              type="number"
              inputMode="numeric"
              step="0.1"
              max="100"
              value={amtPc}
              // @ts-ignore
              onInput={(e) => setAmtPc(parseFloat(e.target.value))}
              onBlur={(e) =>
                // @ts-ignore
                recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
              }
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

export function DryIngredients() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const flourData = useStore(flourStore);
  const dryIngredients = useStore(dryIngredientsStore);

  useEffect(() => {
    setCanAddItem(flourData.left > 0 && flourData.total > 0);
    setWarnFull(flourData.left <= 0 && flourData.total > 0);
  }, [flourData, dryIngredients]);

  const addItemHandler = () =>
    dryIngredientsActions.add({ id: uid(16), name: '', amount: 0, percentage: 0 });

  return (
    <section>
      <SectionTitle title={title} level={3} />
      <p>{text.intro}</p>
      {warnFull && <p class="error">{text.full}</p>}
      <form>
        {dryIngredients.map((item) => (
          <DryIngredientItem item={item} key={item.id} />
        ))}
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </section>
  );
}
