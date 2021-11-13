import { useStore } from '@nanostores/preact';

import { HelpButton } from './misc';
import { round, AmountType } from '../utils/numbers';
import fieldHelp from '../data/fieldhelp.json';
import {
  flourTotalStore,
  saltPcStore,
  saltTotalStore,
  setFlourLeft,
  setFlourTotal,
  setSaltLeft,
  setSaltPc,
  setSaltTotal,
  setWaterLeft,
  setWaterPc,
  setWaterTotal,
  waterPcStore,
  waterTotalStore,
} from '../service/state';

function CalcStart() {
  const flourTotal = useStore(flourTotalStore);
  const waterTotal = useStore(waterTotalStore);
  const waterPc = useStore(waterPcStore);
  const saltTotal = useStore(saltTotalStore);
  const saltPc = useStore(saltPcStore);

  const setFlour = (/** @type {{ preventDefault: () => void }} */ e) => {
    e.preventDefault();
    // @ts-ignore
    const amount = parseFloat(e.target.value);
    if (isNaN(amount)) {
      return;
    }
    setFlourTotal(amount);
    setFlourLeft(amount);
    const water = (amount * waterPc) / 100;
    setWaterTotal(water);
    setWaterLeft(water);
    const salt = (amount * saltPc) / 100;
    setSaltTotal(salt);
    setSaltLeft(salt);
  };

  const calcWater = (/** @type {number} */ value, /** @type {string} */ type) => {
    if (isNaN(value)) {
      return;
    }
    let waterPc = 0;
    let waterTotal = 0;
    if (type === AmountType.PERCENT) {
      if (flourTotal !== 0) {
        waterTotal = (flourTotal * value) / 100;
      }
      waterPc = value;
    } else if (type === AmountType.TOTAL) {
      if (flourTotal !== 0) {
        waterPc = (value / flourTotal) * 100;
      }
      waterTotal = value;
    }
    setWaterPc(waterPc);
    setWaterTotal(waterTotal);
    setWaterLeft(waterTotal);
  };

  const calcSalt = (/** @type {number} */ value, /** @type {string} */ type) => {
    if (isNaN(value)) {
      return;
    }
    let saltPc = 0;
    let saltTotal = 0;
    if (type === AmountType.PERCENT) {
      if (flourTotal !== 0) {
        saltTotal = (flourTotal * value) / 100;
      }
      saltPc = value;
    } else if (type === AmountType.TOTAL) {
      if (flourTotal !== 0) {
        saltPc = (value / flourTotal) * 100;
      }
      saltTotal = value;
    }
    setSaltTotal(saltTotal);
    setSaltPc(saltPc);
    setSaltLeft(saltTotal);
  };

  return (
    <section>
      <h2 id="calc">Początek wyliczeń</h2>
      <p>
        <a href="#home">Początek</a>
      </p>
      <p>Zawsze zaczyna się od mąki, wody i soli.</p>
      <form>
        <fieldset>
          <legend>Mąka</legend>
          <div class="section-wrapper">
            <div>
              <label>
                Całkowita ilość mąki (g) <span class="label-required">*</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={flourTotal}
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
            <div>
              <label>
                Całkowita ilość wody (g, ml)
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={Math.round(waterTotal)}
                  onInput={(e) =>
                    // @ts-ignore
                    calcWater(parseFloat(e.target.value), AmountType.TOTAL)
                  }
                />
              </label>
              <label>
                lub w %
                <input
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={round(waterPc, 1)}
                  onInput={(e) =>
                    // @ts-ignore
                    calcWater(parseFloat(e.target.value), AmountType.PERCENT)
                  }
                />
              </label>
            </div>
            <div class="column-center center">
              <HelpButton text={fieldHelp.water} />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Sól</legend>
          <div class="section-wrapper">
            <div>
              <label>
                Całkowita ilość soli (g)
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  value={Math.round(saltTotal)}
                  onInput={(e) =>
                    // @ts-ignore
                    calcSalt(parseFloat(e.target.value), AmountType.TOTAL)
                  }
                />
              </label>
              <label>
                lub w %
                <input
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={round(saltPc, 1)}
                  onInput={(e) =>
                    // @ts-ignore
                    calcSalt(parseFloat(e.target.value), AmountType.PERCENT)
                  }
                />
              </label>
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
