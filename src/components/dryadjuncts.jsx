import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { SectionTitle } from './pageinfo';
import { AddItemButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import { text } from './dryadjuncts.json';
import { dryAdjunctsStore, flourStore } from '../state/stores';
import { dryAdjunctsActions } from '../state/actions';

/**
 * @typedef {object} DryAdjunctItemProps
 * @property {import('../..').DryItem} item
 *
 * @param {DryAdjunctItemProps} props
 * @returns {JSX.Element}
 */
function DryAdjunctItem({ item }) {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  const flour = useStore(flourStore);

  useEffect(() => {
    setName(item.name);
    setAmtWeight(item.amount);
    setAmtPc(item.percentage);
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    item.name = name;
    dryAdjunctsActions.update(item);
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
    item.amount = amtWeight;
    setAmtPc(amtPc);
    item.percentage = amtPc;
  };

  const removeItem = () => dryAdjunctsActions.remove(item.id);

  return (
    <div class="section-wrapper">
      <div class="row">
        <div class="column">
          <label>
            Nazwa <span class="label-required">*</span>
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
            Ilość (g)
            <input
              type="number"
              inputMode="numeric"
              step="1"
              value={amtWeight}
              // @ts-ignore
              onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
              // @ts-ignore
              onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
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
      <div class="column-center center">
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

function DryAdjuncts() {
  const [canAddItem, setCanAddItem] = useState(true);

  const flour = useStore(flourStore);
  const dryAdjuncts = useStore(dryAdjunctsStore);

  useEffect(() => {
    setCanAddItem(flour.total > 0);
  }, [flour]);

  const addItemHandler = () =>
    dryAdjunctsActions.add({ id: uid(16), name: '', amount: 0, percentage: 0 });

  return (
    <section>
      <SectionTitle title="Dodatki suche" level={3} />
      <p>{text}</p>
      <form>
        {dryAdjuncts.map((item) => (
          <DryAdjunctItem item={item} key={item.id} />
        ))}
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </section>
  );
}

export { DryAdjuncts };
