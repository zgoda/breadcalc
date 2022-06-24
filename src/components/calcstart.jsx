import { useRef, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { Edit } from 'preact-feather';

import { round, AmountType } from '../utils/numbers';
import { fieldHelp, title, intro, totalAmt, orPct } from './calcstart.json';
import { flourStore, saltStore, waterStore } from '../state/stores';
import { SectionTitle, DoneButton } from './misc';
import { flourActions, saltActions, waterActions } from '../state/actions';
import { flour, water, salt, editButtonLabel } from './text.json';

/**
 * @typedef {Object} MiscInfoPanelProps
 * @property {(value: boolean) => void} lockStateSwitch
 *
 * @param {MiscInfoPanelProps} props
 * @returns {JSX.Element}
 */
function Info({ lockStateSwitch }) {
  const buttonRef = useRef(null);

  const flourData = useStore(flourStore);
  const waterData = useStore(waterStore);
  const saltData = useStore(saltStore);

  const handleButtonClick = (/** @type {Event} */ e) => {
    e.preventDefault();
    lockStateSwitch && lockStateSwitch(false);
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th scope="row">{flour}</th>
            <td>100%</td>
            <td>{flourData.total}</td>
          </tr>
          <tr>
            <th scope="row">{water}</th>
            <td>{waterData.percentage}%</td>
            <td>{waterData.total}</td>
          </tr>
          <tr>
            <th scope="row">{salt}</th>
            <td>{saltData.percentage}%</td>
            <td>{saltData.total}</td>
          </tr>
        </tbody>
      </table>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleButtonClick}
        class="autowidth"
      >
        <Edit /> {editButtonLabel}
      </button>
    </div>
  );
}

/**
 * @typedef {Object} MiscFormProps
 * @property {(value: boolean) => void} lockStateSwitch
 *
 * @param {MiscFormProps} props
 * @returns {JSX.Element}
 */
function Form({ lockStateSwitch }) {
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

  const handleButtonClick = () => {
    lockStateSwitch && lockStateSwitch(true);
  };

  return (
    <div>
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
      </form>
      <DoneButton handler={handleButtonClick} />
    </div>
  );
}

/**
 * @returns {JSX.Element}
 */
export function CalcStart() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <section>
      <SectionTitle level={2} title={title} />
      <p>{intro}</p>
      {isLocked && <Info lockStateSwitch={setIsLocked} />}
      {!isLocked && <Form lockStateSwitch={setIsLocked} />}
    </section>
  );
}
