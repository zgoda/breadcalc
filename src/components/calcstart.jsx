import { useState } from 'preact/hooks';

import { HelpButton } from './misc';
import { round } from '../utils/numbers';
import fieldHelp from './fieldhelp.json';

function CalcStart() {

  const [flourTotal, setFlourTotal] = useState(0);
  const [waterTotal, setWaterTotal] = useState(0);
  const [waterPc, setWaterPc] = useState(0);

  const calcWater = ((/** @type {number} */ value, /** @type {string} */ type) => {
    if (type === 'percent') {
      if (flourTotal !== 0) {
        setWaterTotal(flourTotal * value / 100);
      }
      setWaterPc(value);
    } else if (type === 'total') {
      if (flourTotal !== 0) {
        setWaterPc(value / flourTotal * 100);
      }
      setWaterTotal(value);
    }
  });

  return (
    <>
      <h2>Początek wyliczeń</h2>
      <p>Zawsze zaczyna się od mąki i wody.</p>
      <form>
        <fieldset>
          <div class="row X--middle">
            <div class="M3">
              <label for="input-flourTotal">Całkowita ilość mąki (g)</label>
            </div>
            <div class="M6">
              <input
                id="input-flourTotal"
                type="number"
                inputMode="numeric"
                value={flourTotal}
                onInput={(e) => setFlourTotal(e.target.value)}
              />
            </div>
            <div class="M3">
              <HelpButton text={fieldHelp.flourTotal} />
            </div>
          </div>
          <div class="row X--middle">
            <div class="M3">
              <label for="input-waterTotal">Całkowita ilość wody (g, ml)</label>
            </div>
            <div class="M6">
              <div class="row X-middle">
                <div class="S4">
                  <input
                    id="input-waterTotal"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={Math.round(waterTotal)}
                    onInput={(e) => calcWater(e.target.value, 'total')}
                  />
                </div>
                <div class="S4">
                  <label for="input-waterPc">lub nawodnienie w %</label>
                </div>
                <div class="S4">
                <input
                  id="input-waterPc"
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={round(waterPc, 1)}
                  onInput={(e) => calcWater(e.target.value, 'percent')}
                />
                </div>
              </div>
            </div>
            <div class="M3">
              <HelpButton text={fieldHelp.water} />
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export { CalcStart };
