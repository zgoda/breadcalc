import { useState } from 'preact/hooks';

import { HelpButton } from './misc';
import { round } from '../utils/numbers';
import fieldHelp from './fieldhelp.json';

const AmountType = Object.freeze({
  TOTAL: 'total',
  PERCENT: 'percent',
});

function CalcStart() {

  const [flourTotal, setFlourTotal] = useState(0);
  const [waterTotal, setWaterTotal] = useState(0);
  const [waterPc, setWaterPc] = useState(0);
  const [saltTotal, setSaltTotal] = useState(0);
  const [saltPc, setSaltPc] = useState(0);

  const setFlour = ((e) => {
    e.preventDefault();
    const amount = Number.parseFloat(e.target.value);
    setFlourTotal(amount);
    setWaterTotal(amount * waterPc / 100);
    setSaltTotal(amount * saltPc / 100);
  });

  const calcWater = ((value, type) => {
    if (type === AmountType.PERCENT) {
      if (flourTotal !== 0) {
        setWaterTotal(flourTotal * value / 100);
      }
      setWaterPc(value);
    } else if (type === AmountType.TOTAL) {
      if (flourTotal !== 0) {
        setWaterPc(value / flourTotal * 100);
      }
      setWaterTotal(value);
    }
  });

  const calcSalt = ((value, type) => {
    if (type === AmountType.PERCENT) {
      if (flourTotal !== 0) {
        setSaltTotal(flourTotal * value / 100);
      }
      setSaltPc(value);
    } else if (type === AmountType.TOTAL) {
      if (flourTotal !== 0) {
        setSaltPc(value / flourTotal * 100);
      }
      setSaltTotal(value);
    }
  });

  return (
    <>
      <h2>Początek wyliczeń</h2>
      <p>Zawsze zaczyna się od mąki, wody i soli.</p>
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
                onInput={setFlour}
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
              <div class="row X--middle">
                <div class="S4">
                  <input
                    id="input-waterTotal"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={Math.round(waterTotal)}
                    onInput={
                      (e) => calcWater(
                        Number.parseFloat(e.target.value), AmountType.TOTAL
                      )
                    }
                  />
                </div>
                <div class="S4">
                  <label for="input-waterPc">lub w %</label>
                </div>
                <div class="S4">
                <input
                  id="input-waterPc"
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={round(waterPc, 1)}
                  onInput={
                    (e) => calcWater(
                      Number.parseFloat(e.target.value), AmountType.PERCENT
                    )
                  }
                />
                </div>
              </div>
            </div>
            <div class="M3">
              <HelpButton text={fieldHelp.water} />
            </div>
          </div>
          <div class="row X--middle">
            <div class="M3">
              <label for="input-saltTotal">Całkowita ilość soli (g)</label>
            </div>
            <div class="M6">
              <div class="row X--middle">
                <div class="S4">
                  <input
                    id="input-saltTotal"
                    type="number"
                    step="1"
                    inputMode="numeric"
                    value={Math.round(saltTotal)}
                    onInput={
                      (e) => calcSalt(
                        Number.parseFloat(e.target.value), AmountType.TOTAL
                      )
                    }
                  />
                </div>
                <div class="S4">
                  <label for="input-saltPc">lub w %</label>
                </div>
                <div class="S4">
                  <input
                    id="input-saltPc"
                    type="number"
                    step="0.1"
                    inputMode="numeric"
                    value={round(saltPc, 1)}
                    onInput={
                      (e) => calcSalt(
                        Number.parseFloat(e.target.value), AmountType.PERCENT
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div class="M3">
              <HelpButton text={fieldHelp.salt} />
            </div>            
          </div>
        </fieldset>
      </form>
    </>
  );
}

export { CalcStart };
