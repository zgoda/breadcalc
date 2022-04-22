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

export function CalcStart() {
  const [isLocked, setIsLocked] = useState(false);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);
  const salt = useStore(saltStore);

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

  const lockForm = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    setIsLocked(true);
  };

  const unlockForm = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    setIsLocked(false);
  };

  if (isLocked) {
    return (
      <section>
        <SectionTitle level={2} title={collapsedTitle} />
        <table>
          <tbody>
            <tr>
              <th scope="row">Mąka</th>
              <td>{flour.total} g</td>
              <td>100%</td>
            </tr>
            <tr>
              <th scope="row">Woda</th>
              <td>{water.total} g</td>
              <td>{water.percentage}%</td>
            </tr>
            <tr>
              <th scope="row">Sól</th>
              <td>{salt.total} g</td>
              <td>{salt.percentage}%</td>
            </tr>
          </tbody>
        </table>
        <p>
          <button class="autowidth" onClick={unlockForm}>
            <span class="icon">
              <Unlock />
            </span>{' '}
            Edytuj
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
          <legend>Mąka</legend>
          <div class="grid">
            <div>
              <label>
                {totalAmt}
                <input
                  type="number"
                  inputMode="numeric"
                  value={flour.total}
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
          <legend>Woda</legend>
          <div class="grid">
            <div>
              <label>
                {totalAmt}
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={Math.round(water.total)}
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
                  value={round(water.percentage, 1)}
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
          <legend>Sól</legend>
          <div class="grid">
            <div>
              <label>
                {totalAmt}
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={Math.round(salt.total)}
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
                  value={round(salt.percentage, 1)}
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
            <button class="autowidth" onClick={lockForm}>
              <span class="icon">
                <Lock />
              </span>{' '}
              Gotowe
            </button>
          </p>
        </fieldset>
      </form>
    </section>
  );
}
