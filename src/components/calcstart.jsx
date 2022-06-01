import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { Lock, Unlock } from 'preact-feather';

import { round, AmountType } from '../utils/numbers';
import {
  fieldHelp,
  title,
  intro,
  totalAmt,
  orPct,
  collapsedTitle,
} from './calcstart.json';
import { flourStore, saltStore, waterStore } from '../state/stores';
import { SectionTitle } from './pageinfo';
import { flourActions, saltActions, waterActions } from '../state/actions';
import { flour, water, salt, editButtonLabel, doneButtonLabel } from './text.json';

export function CalcStart() {
  const [isLocked, setIsLocked] = useState(false);

  const flourData = useStore(flourStore);
  const waterData = useStore(waterStore);
  const saltData = useStore(saltStore);

  const setFlour = (/** @type {{ target: { value: string; }; }} */ e) => {
    const amount = parseFloat(e.target.value);
    if (isNaN(amount)) {
      return;
    }
    flourActions.set(amount);
  };

  const setWater = (/** @type {number} */ value, /** @type {string} */ type) => {
    if (isNaN(value)) {
      return;
    }
    if (type === AmountType.PERCENT) {
      waterActions.setPercent(value);
    } else if (type === AmountType.TOTAL) {
      waterActions.setAmount(value);
    }
  };

  const calcSalt = (/** @type {number} */ value, /** @type {string} */ type) => {
    if (isNaN(value)) {
      return;
    }
    if (type === AmountType.PERCENT) {
      saltActions.setPercent(value);
    } else if (type === AmountType.TOTAL) {
      saltActions.setAmount(value);
    }
  };

  const toggleLock = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    setIsLocked(!isLocked);
  };

  if (isLocked) {
    return (
      <section>
        <SectionTitle level={2} title={collapsedTitle} />
        <table>
          <tbody>
            <tr>
              <th scope="row">{flour}</th>
              <td>{flourData.total} g</td>
              <td>100%</td>
            </tr>
            <tr>
              <th scope="row">{water}</th>
              <td>{Math.round(waterData.total)} g</td>
              <td>{waterData.percentage}%</td>
            </tr>
            <tr>
              <th scope="row">{salt}</th>
              <td>{Math.round(saltData.total)} g</td>
              <td>{saltData.percentage}%</td>
            </tr>
          </tbody>
        </table>
        <p>
          <button class="autowidth" onClick={toggleLock}>
            <span class="icon">
              <Unlock />
            </span>{' '}
            {editButtonLabel}
          </button>
        </p>
      </section>
    );
  }

  return (
    <section>
      <SectionTitle level={2} title={title} />
      <p>{intro}</p>
      <form>
        <fieldset>
          <legend>{flour}</legend>
          <div class="grid">
            <div>
              <label>
                {totalAmt}
                <input
                  type="number"
                  inputMode="numeric"
                  value={flourData.total}
                  // @ts-ignore
                  onInput={setFlour}
                  required
                />
              </label>
            </div>
            <div>&nbsp;</div>
            <div>
              <small>{fieldHelp.flourTotal}</small>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>{water}</legend>
          <div class="grid">
            <div>
              <label>
                {totalAmt}
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={Math.round(waterData.total)}
                  onInput={(e) =>
                    // @ts-ignore
                    setWater(parseFloat(e.target.value), AmountType.TOTAL)
                  }
                />
              </label>
            </div>
            <div>
              <label>
                {orPct}
                <input
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={round(waterData.percentage, 1)}
                  onInput={(e) =>
                    // @ts-ignore
                    setWater(parseFloat(e.target.value), AmountType.PERCENT)
                  }
                />
              </label>
            </div>
            <div>
              <small>{fieldHelp.water}</small>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>{salt}</legend>
          <div class="grid">
            <div>
              <label>
                {totalAmt}
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={Math.round(saltData.total)}
                  onInput={(e) =>
                    // @ts-ignore
                    calcSalt(parseFloat(e.target.value), AmountType.TOTAL)
                  }
                />
              </label>
            </div>
            <div>
              <label>
                {orPct}
                <input
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={round(saltData.percentage, 1)}
                  onInput={(e) =>
                    // @ts-ignore
                    calcSalt(parseFloat(e.target.value), AmountType.PERCENT)
                  }
                />
              </label>
            </div>
            <div>
              <small>{fieldHelp.salt}</small>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <p>
            <button class="autowidth" onClick={toggleLock}>
              <span class="icon">
                <Lock />
              </span>{' '}
              {doneButtonLabel}
            </button>
          </p>
        </fieldset>
      </form>
    </section>
  );
}
