import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { RemoveItemButton, SectionTitle, DoneButton } from './misc';
import { AmountType } from '../utils/numbers';
import { text, title } from './dryingredients.json';
import { labelAmtGms, labelAmtPc, labelName } from './forms.json';
import { dryIngredientsStore, flourStore } from '../state/stores';
import { dryIngredientsActions } from '../state/actions';

/**
 * @returns {JSX.Element}
 */
function ItemsList() {
  const dryItems = useStore(dryIngredientsStore);

  return (
    <table>
      {dryItems.map((item) => (
        <tr key={item.id}>
          <th scope="row">{item.name}</th>
          <td>{item.amount}g</td>
          <td>{item.percentage}%</td>
          <td>
            {
              <RemoveItemButton
                actionHandler={() => dryIngredientsActions.remove(item.id)}
              />
            }
          </td>
        </tr>
      ))}
    </table>
  );
}

/**
 * @returns {JSX.Element}
 */
function Form() {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  const flourData = useStore(flourStore);

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

  const handleButtonClick = () => {
    dryIngredientsActions.add({
      id: uid(16),
      name,
      amount: amtWeight,
      percentage: amtPc,
    });
    clearState();
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
      <DoneButton handler={handleButtonClick} />
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
      {!warnFull && <p>{text.intro}</p>}
      {warnFull && <p class="error">{text.full}</p>}
      <ItemsList />
      {canAddItem && <Form />}
    </section>
  );
}
