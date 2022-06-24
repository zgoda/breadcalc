import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { RemoveItemButton, SectionTitle, DoneButton } from './misc';
import { AmountType } from '../utils/numbers';
import { text } from './wetingredients.json';
import {
  labelAmtGms,
  labelAmtPc,
  labelName,
  labelWaterGms,
  labelWaterPc,
} from './forms.json';
import {
  dryIngredientsStore,
  flourStore,
  waterStore,
  wetIngredientsStore,
} from '../state/stores';
import { wetIngredientsActions } from '../state/actions';

/**
 * @returns {JSX.Element}
 */
function ItemsList() {
  const wetItems = useStore(wetIngredientsStore);

  return (
    <table>
      {wetItems.map((item) => (
        <tr key={item.id}>
          <th scope="row">{item.name}</th>
          <td>{item.amount}g</td>
          <td>{item.percentage}%</td>
          <td>{item.waterAmount}g/ml</td>
          <td>{item.waterPercentage}%</td>
          <td>
            {
              <RemoveItemButton
                actionHandler={() => wetIngredientsActions.remove(item.id)}
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
  const [waterWeight, setWaterWeight] = useState(0);
  const [waterPc, setWaterPc] = useState(0);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);

  const clearState = () => {
    setName('');
    setAmtWeight(0);
    setAmtPc(0);
    setWaterWeight(0);
    setWaterPc(0);
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
    setWaterPc(waterPc);
  };

  const handleButtonClick = () => {
    wetIngredientsActions.add({
      id: uid(16),
      name,
      amount: amtWeight,
      percentage: amtPc,
      waterAmount: waterWeight,
      waterPercentage: waterPc,
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
                max={flour.left}
                value={amtWeight}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)
                }
                // @ts-ignore
                onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
              />
            </label>
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
          <div>
            <label>
              {labelWaterGms}
              <input
                type="number"
                inputMode="numeric"
                step="1"
                max={water.left}
                value={waterWeight}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcWater(parseFloat(e.target.value), AmountType.TOTAL)
                }
                // @ts-ignore
                onInput={(e) => setWaterWeight(parseFloat(e.target.value))}
              />
            </label>
            <label>
              {labelWaterPc}
              <input
                type="number"
                inputMode="numeric"
                step="0.1"
                value={waterPc}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcWater(parseFloat(e.target.value), AmountType.PERCENT)
                }
                // @ts-ignore
                onInput={(e) => setWaterPc(parseFloat(e.target.value))}
              />
            </label>
          </div>
        </div>
      </form>
      <DoneButton handler={handleButtonClick} />
    </div>
  );
}

/**
 * @returns {JSX.Element}
 */
export function WetIngredients() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [warnFull, setWarnFull] = useState(false);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);
  const dryIngredients = useStore(dryIngredientsStore);
  const wetIngredients = useStore(wetIngredientsStore);

  useEffect(() => {
    setCanAddItem(
      flour.left > 0 && flour.total > 0 && water.left > 0 && water.total > 0,
    );
    setWarnFull(
      (flour.left <= 0 && flour.total > 0) || (water.left <= 0 && water.total > 0),
    );
  }, [
    flour.left,
    flour.total,
    water.left,
    water.total,
    dryIngredients,
    wetIngredients,
  ]);

  return (
    <section>
      <SectionTitle title={text.title} level={3} />
      {!warnFull && <p>{text.intro}</p>}
      {warnFull && <p class="error">{text.full}</p>}
      <ItemsList />
      {canAddItem && <Form />}
    </section>
  );
}
