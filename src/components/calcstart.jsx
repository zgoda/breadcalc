import { connect } from 'unistore/preact';

import { actions } from '../service/state';
import { HelpButton } from './misc';
import { round, AmountType } from '../utils/numbers';
import fieldHelp from './fieldhelp.json';

const stateItems = ['flourTotal', 'waterTotal', 'waterPc', 'saltTotal', 'saltPc'];

function CalcStartBase(
  {
    flourTotal, waterTotal, waterPc, saltTotal, saltPc,
    setFlourTotal, setWaterTotal, setWaterPc, setSaltTotal, setSaltPc,
  }
) {

  const inputs = new Map();
  stateItems.forEach((item) => {
    inputs.set(item, `input-${item}`);
  });

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
              <label for={inputs.get('flourTotal')}>
                Całkowita ilość mąki (g) <span class="label-required">*</span>
              </label>
            </div>
            <div class="M6">
              <input
                id={inputs.get('flourTotal')}
                type="number"
                inputMode="numeric"
                value={flourTotal}
                onInput={setFlour}
                required
              />
            </div>
            <div class="M3">
              <HelpButton text={fieldHelp.flourTotal} />
            </div>
          </div>
          <div class="row X--middle">
            <div class="M3">
              <label for={inputs.get('waterTotal')}>Całkowita ilość wody (g, ml)</label>
            </div>
            <div class="M6">
              <div class="row X--middle">
                <div class="S4">
                  <input
                    id={inputs.get('waterTotal')}
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
                  <label for={inputs.get('waterPc')}>lub w %</label>
                </div>
                <div class="S4">
                <input
                  id={inputs.get('waterPc')}
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
              <label for={inputs.get('saltTotal')}>Całkowita ilość soli (g)</label>
            </div>
            <div class="M6">
              <div class="row X--middle">
                <div class="S4">
                  <input
                    id={inputs.get('saltTotal')}
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
                  <label for={inputs.get('saltPc')}>lub w %</label>
                </div>
                <div class="S4">
                  <input
                    id={inputs.get('saltPc')}
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

const CalcStart = connect(stateItems, actions)(CalcStartBase);

export { CalcStart };
