import { useStore } from '@nanostores/preact';

import { HelpButton } from './misc';
import { round, AmountType } from '../utils/numbers';
import { fieldHelp, title, intro, totalAmt, orPct } from './calcstart.json';
import { flourStore, saltStore, waterStore } from '../state/stores';
import { SectionTitle } from './pageinfo';
import { flourActions, saltActions, waterActions } from '../state/actions';

function CalcStart() {
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

  return (
    <section>
      <SectionTitle level={2} title={title} />
      <p>{intro}</p>
      <form>
        <fieldset>
          <legend>Mąka</legend>
          <div class="section-wrapper">
            <div>
              <label>
                {totalAmt} <span class="label-required">*</span>
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
            <div class="column-center center">
              <HelpButton text={fieldHelp.flourTotal} />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Woda</legend>
          <div class="section-wrapper">
            <div class="row">
              <div class="column">
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
              <div class="column">
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
            </div>
            <div class="column-center center">
              <HelpButton text={fieldHelp.water} />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Sól</legend>
          <div class="section-wrapper">
            <div class="row">
              <div class="column">
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
              <div class="column">
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
            </div>
            <div class="column-center center">
              <HelpButton text={fieldHelp.salt} />
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

export { CalcStart };
