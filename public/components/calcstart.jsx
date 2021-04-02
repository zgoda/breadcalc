import { HelpCircle } from 'preact-feather';
import { useState } from 'preact/hooks';

import fieldHelp from './fieldhelp.json';

function CalcStart() {

  const [flourTotal, setFlourTotal] = useState(0);

  return (
    <>
      <h2>Początek wyliczeń</h2>
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
                // @ts-ignore
                onInput={(e) => setFlourTotal(e.target.value)}
              />
            </div>
            <div class="M3">
              <button
                class="button button-clear"
                type="button"
                aria-label={fieldHelp.flourTotal}
                data-microtip-position="bottom"
                data-microtip-size="medium"
                role="tooltip"
              >
                <HelpCircle />
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export { CalcStart };
