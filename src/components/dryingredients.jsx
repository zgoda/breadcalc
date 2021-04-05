import { useState, useEffect } from 'preact/hooks';
import { connect } from 'unistore/preact';
import { uid } from 'uid';

import { actions } from '../service/state';
import {
  AddItemButton, RemoveItemButton, LockButton, UnlockButton,
} from './misc';
import { AmountType } from '../utils/numbers';
import { SectionTitle } from './pageinfo';
import dryingredients from './dryingredients.json';

function DryIngredientItem(
  { item, flourLeft, flourTotal, removeItemHandler, setFlourLeft }
) {

  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    setUid(item.get('uid'));
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

  const nameChange = ((name) => {
    setName(name);
    item.set('name', name);
  });

  const recalcAmount = ((value, type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = flourTotal * value / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = value / flourTotal * 100;
    }
    setAmtWeight(amtWeight);
    item.set('amtWeight', amtWeight);
    setAmtPc(amtPc);
    item.set('amtPc', amtPc);
    setFlourLeft(flourLeft - amtWeight);
  });

  const makeReadOnly = (() => {
    setReadOnly(true);
  });

  const makeEditable = (() => {
    setReadOnly(false);
  });

  const removeItem = (() => {
    removeItemHandler(uid);
  });

  return (
    <div class="row X--middle">
      <div class="M6">
        <label>
          Nazwa <span class="label-required">*</span>
          <input
            type="text"
            value={name}
            onInput={(e) => nameChange(e.target.value)}
            required
            readOnly={readOnly}
          />
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
            onInput={
              (e) => recalcAmount(Number.parseFloat(e.target.value), AmountType.TOTAL)
            }
            readOnly={readOnly}
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
            onInput={
              (e) => recalcAmount(Number.parseFloat(e.target.value), AmountType.PERCENT)
            }
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M2">
        {
          readOnly 
            ? <UnlockButton actionHandler={makeEditable} />
            : <LockButton actionHandler={makeReadOnly} />
        }
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

const dryIngredientsStateItems = ['flourTotal', 'dryIngredients'];

function DryIngredientsBase({ flourTotal, dryIngredients, setDryIngredients }) {

  const [flourLeft, setFlourLeft] = useState(0);

  useEffect(() => {
    let used = 0;
    dryIngredients.forEach((item) => {
      let curUsed = item.get('amtWeight');
      if (curUsed == null) {
        curUsed = 0;
      }
      used = used + curUsed;
    });
    const flourLeft =
      dryIngredients.length ? flourTotal - used : flourTotal;
    setFlourLeft(flourLeft);
  }, [flourTotal, dryIngredients]);

  const canAddItem = flourLeft > 0 && flourTotal > 0;

  const addItemHandler = (() => {
    const items = [...dryIngredients, new Map([['uid', uid(16)]])];
    setDryIngredients(items);
  });

  const removeItemHandler = ((uid) => {
    const items = dryIngredients.filter((item) => item.get('uid') !== uid);
    setDryIngredients(items);
  });

  return (
    <>
      <SectionTitle title={'Mąka i składniki suche'} level={3} />
      <p>{dryingredients.text}</p>
      <form>
        <fieldset>
          {dryIngredients.map((item) => (
            <DryIngredientItem
              item={item}
              key={item.get('uid')}
              flourLeft={flourLeft}
              flourTotal={flourTotal}
              removeItemHandler={removeItemHandler}
              setFlourLeft={setFlourLeft}
            />
          ))}
        </fieldset>
      </form>
      <div class="add-item-button">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </>
  );
}

const DryIngredients = connect(dryIngredientsStateItems, actions)(DryIngredientsBase);

export { DryIngredients };
