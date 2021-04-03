import { useState } from 'preact/hooks';

import { AddItemButton } from './misc';
import flour from './flour.json';

function FlourIngredientItem() {

  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  return (
    <div class="row X--middle">
      <div class="M7">
        <label>
          Nazwa
          <input type="text" value={name} onInput={(e) => setName(e.target.value)} />
        </label>
      </div>
      <div class="M2">
        <label>
          Ilość (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            value={amtWeight}
            onInput={(e) => setAmtWeight(e.target.value)}
          />
        </label>
      </div>
      <div class="M2">
        <label>
          Ilość (%)
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            value={amtPc}
            onInput={(e) => setAmtPc(e.target.value)}
          />
        </label>
      </div>
      <div class="M1">
        <AddItemButton />
      </div>
    </div>
  );
}

function FlourIngredients() {
  return (
    <>
      <h2>Mąka</h2>
      <p>{flour.text}</p>
      <form>
        <fieldset>
          <FlourIngredientItem />
        </fieldset>
      </form>
    </>
  );
}

export { FlourIngredients };
