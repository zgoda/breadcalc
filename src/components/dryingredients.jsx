import { useState, useEffect, useRef } from 'preact/hooks';
import { Lock } from 'preact-feather';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AddItemButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import { SectionTitle } from './pageinfo';
import { text, title } from './dryingredients.json';
import { labelAmtGms, labelAmtPc, labelName } from './forms.json';
import { doneButtonLabel } from './text.json';
import { dryIngredientsStore, flourStore } from '../state/stores';
import { dryIngredientsActions } from '../state/actions';

function ItemsList() {
  const dryItems = useStore(dryIngredientsStore);

  const removeItem = (/** @type {string} */ itemId) =>
    dryIngredientsActions.remove(itemId);

  return (
    <table>
      {dryItems.map((item) => (
        <tr>
          <th scope="row">{item.name}</th>
          <td>{item.amount}g</td>
          <td>{item.percentage}%</td>
          <td>{<RemoveItemButton actionHandler={() => removeItem(item.id)} />}</td>
        </tr>
      ))}
    </table>
  );
}

/**
 * @typedef {object} DryIngredientFormProps
 * @property {import('../..').DryItem} [item]
 *
 * @param {DryIngredientFormProps} props
 * @returns {JSX.Element}
 */
function Form({ item }) {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  const buttonRef = useRef(null);

  const flourData = useStore(flourStore);

  useEffect(() => {
    if (item != null) {
      setName(item.name);
      setAmtWeight(item.amount);
      setAmtPc(item.percentage);
    }
  }, [item]);

  const clearState = () => {
    setName('');
    setAmtWeight(0);
    setAmtPc(0);
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
    setAmtPc(amtPc);
  };

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    if (item != null) {
      item.name = name;
      item.amount = amtWeight;
      item.percentage = amtPc;
      dryIngredientsActions.update(item);
    } else {
      dryIngredientsActions.add({
        id: uid(16),
        name,
        amount: amtWeight,
        percentage: amtPc,
      });
    }
    clearState();
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <div>
      <form>
        <div class="grid">
          <div>
            <label>
              {labelName} <span class="label-required">*</span>
              <input
                type="text"
                value={name}
                // @ts-ignore
                onInput={(e) => setName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
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
                onBlur={(e) =>
                  // @ts-ignore
                  recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)
                }
              />
            </label>
          </div>
          <div>
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
      </form>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleButtonClick}
        class="autowidth"
      >
        <Lock /> {doneButtonLabel}
      </button>
    </div>
  );
}

export function DryIngredients() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const flourData = useStore(flourStore);

  useEffect(() => {
    setCanAddItem(flourData.left > 0 && flourData.total > 0);
    setWarnFull(flourData.left <= 0 && flourData.total > 0);
  }, [flourData.left, flourData.total]);

  return (
    <section>
      <SectionTitle title={title} level={3} />
      <p>{text.intro}</p>
      {warnFull && <p class="error">{text.full}</p>}
      <ItemsList />
      {canAddItem && <Form />}
    </section>
  );
}
