import { useState, useEffect } from 'preact/hooks';
import { connect } from 'unistore/preact';
import { uid } from 'uid';

import { actions } from '../service/state';
import { AddItemButton, SaveItemButton, RemoveItemButton } from './misc';
import dryingredients from './dryingredients.json';

function DryIngredientItem({ item, flourLeft }) {

  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  useEffect(() => {
    if (item.has('name')) {
      setName(item.get('name'));
    }
    if (item.has('amtWeight')) {
      setAmtWeight(item.get('amtWeight'));
    }
    if (item.has('amtPc')) {
      setAmtPc(item.get('amtPc'));
    }
  }, [item]);

  return (
    <div class="row X--middle">
      <div class="M6">
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
            max={flourLeft}
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
            max="100"
            value={amtPc}
            onInput={(e) => setAmtPc(e.target.value)}
          />
        </label>
      </div>
      <div class="M1">
        <SaveItemButton />
        <RemoveItemButton />
      </div>
    </div>
  );
}

const stateItems = ['flourTotal', 'dryIngredients'];

function DryIngredientsBase({ flourTotal, dryIngredients, setDryIngredients }) {

  const reducer = (accumulator, currentItem) => accumulator + currentItem.amtWeight;
  const flourLeft =
    dryIngredients.length ? flourTotal - dryIngredients.reduce(reducer) : flourTotal;

  const addItemHandler = (() => {
    const items = [...dryIngredients, new Map([['uid', uid(16)]])];
    setDryIngredients(items);
  });

  return (
    <>
      <h2>Mąka</h2>
      <p>{dryingredients.text}</p>
      <form>
        <fieldset>
          {dryIngredients.map((item) => (
            <DryIngredientItem
              item={item}
              key={item.get('uid')}
              flourLeft={flourLeft}
            />
          ))}
        </fieldset>
      </form>
      <div class="add-item-button">
        {flourTotal > 0 && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </>
  );
}

const DryIngredients = connect(stateItems, actions)(DryIngredientsBase);

export { DryIngredients };
