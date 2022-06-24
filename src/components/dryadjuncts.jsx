import { useState, useEffect, useRef } from 'preact/hooks';
import { Lock } from 'preact-feather';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { RemoveItemButton, SectionTitle } from './misc';
import { AmountType } from '../utils/numbers';
import { text } from './dryadjuncts.json';
import { doneButtonLabel } from './text.json';
import { labelAmtGms, labelAmtPc, labelName } from './forms.json';
import { dryAdjunctsStore, flourStore } from '../state/stores';
import { dryAdjunctsActions } from '../state/actions';

/**
 * @returns {JSX.Element}
 */
function ItemsList() {
  const dryItems = useStore(dryAdjunctsStore);

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
                actionHandler={() => dryAdjunctsActions.remove(item.id)}
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

  const flour = useStore(flourStore);

  const buttonRef = useRef(null);

  const clearState = () => {
    setName('');
    setAmtWeight(0);
    setAmtPc(0);
  };

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flour.total * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flour.total) * 100;
    }
    setAmtWeight(amtWeight);
    setAmtPc(amtPc);
  };

  const handleButtonClick = (/** @type {Event} */ e) => {
    e.preventDefault();
    dryAdjunctsActions.add({
      id: uid(16),
      name,
      amount: amtWeight,
      percentage: amtPc,
    });
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
                value={amtWeight}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)
                }
                // @ts-ignore
                onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
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
                onBlur={(e) =>
                  // @ts-ignore
                  recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
                }
                // @ts-ignore
                onInput={(e) => setAmtPc(parseFloat(e.target.value))}
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

export function DryAdjuncts() {
  const [canAddItem, setCanAddItem] = useState(true);

  const flour = useStore(flourStore);

  useEffect(() => {
    setCanAddItem(flour.total > 0);
  }, [flour]);

  return (
    <section>
      <SectionTitle title="Dodatki suche" level={3} />
      {canAddItem && <p>{text}</p>}
      <ItemsList />
      {canAddItem && <Form />}
    </section>
  );
}
