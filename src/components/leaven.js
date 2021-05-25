import { connect } from 'unistore/preact';
import { useEffect, useState } from 'preact/hooks';
import { uid } from 'uid';

import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import { actions } from '../service/state';
import leavenText from '../data/leaven.json';

function LeavenFlourWeight({ flourTotal, setLeavenFlourWeight }) {

  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

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
    setAmtPc(amtPc);
    setLeavenFlourWeight(amtWeight);
  });

  return (
    <div class="row X--middle X--around">
      <div class="M3">
        <label>
          Waga mąki w zaczynie (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={flourTotal}
            value={amtWeight}
            onInput={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)
            }
          />
        </label>
      </div>
      <div class="M3">
        <label>
          Jako % całkowitej ilości mąki
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            max="100"
            value={amtPc}
            onInput={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
            }
          />
        </label>
      </div>
    </div>
  );
}

function LeavenFlourItem(
  { item, flourLeft, flourTotal, removeItemHandler, changeItemHandler, listId }
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
    changeItemHandler(amtWeight);
  });

  const makeReadOnly = (() => {
    setReadOnly(true);
  });

  const makeEditable = (() => {
    setReadOnly(false);
  });

  const removeItem = (() => {
    removeItemHandler(uid, amtWeight);
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
            list={listId}
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
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            onBlur={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)
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
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            onBlur={
              (e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
            }
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M1 center">
        {
          readOnly
            ? <UnlockButton actionHandler={makeEditable} />
            : <LockButton actionHandler={makeReadOnly} />
        }
      </div>
      <div class="M1 center">
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

function LeavenFlourItems(
  {
    items, flourItemsListId, flourTotal, flourLeft,
    changeItemHandler, removeItemHandler,
  }
) {
  return (
    <>
      {items.map((item) => (
        <LeavenFlourItem
          key={`leaven-flour-item-${item.uid}`}
          item={item}
          listId={flourItemsListId}
          flourTotal={flourTotal}
          flourLeft={flourLeft}
          changeItemHandler={changeItemHandler}
          removeItemHandler={removeItemHandler}
        />
      ))}
    </>
  );
}

const leavenStateItems = [
  'leaven', 'flourTotal', 'waterTotal', 'flourLeft', 'waterLeft', 'dryIngredients',
];

function LeavenBase(
  {
    leaven, flourTotal, waterTotal, flourLeft, waterLeft, dryIngredients,
    setLeaven, setFlourLeft, setWaterLeft,
  }
) {

  const [canAddItem, setCanAddItem] = useState(true);
  const [leavenFlourTotal, setLeavenFlourTotal] = useState(0);
  const [leavenFlourLeft, setLeavenFlourLeft] = useState(0);
  const [availableFlourItems, setAvailableFlourItems] = useState([]);
  const [leavenFlourItems, setLeavenFlourItems] = useState([]);
  const [leavenWater, setLeavenWater] = useState(0);
  const [leavenSourdough, setLeavenSourdough] = useState(0);

  useEffect(() => {
    setLeavenFlourItems(leaven.flour);
    setLeavenWater(leaven.water);
    setLeavenSourdough(leaven.sourdough);
  }, [leaven]);

  useEffect(() => {
    setCanAddItem(flourTotal > 0 && waterTotal > 0 && dryIngredients.length > 0);
  }, [flourTotal, waterTotal, dryIngredients]);

  useEffect(() => {
    const names = dryIngredients.map((item) => (
      { name: item.get('name'), value: item.get('uid') }
    ));
    setAvailableFlourItems(names);
  }, [dryIngredients]);

  const setLeavenFlourWeight = ((flourWeight) => {
    setLeavenFlourTotal(flourWeight);
    setLeavenFlourLeft(flourWeight);
  });

  const addItemHandler = (() => {
    const items = [...leavenFlourItems, new Map([['uid', uid(16)]])];
    setLeavenFlourItems(items);
  });

  const updateLeaven = (() => {
    const leaven = {
      flour: leavenFlourItems, water: leavenWater, sourdough: leavenSourdough
    };
    setLeaven(leaven);
  });

  const changeItemHandler = ((amtFlour, amtWater) => {
    setLeavenFlourTotal(leavenFlourTotal + amtFlour);
    setLeavenFlourLeft(leavenFlourLeft - amtFlour);
    setFlourLeft(flourLeft - amtFlour);
    setWaterLeft(waterLeft - amtWater);
    updateLeaven();
  });

  const removeItemHandler = ((uid, amtFlour, amtWater) => {
    const items = leavenFlourItems.filter((item) => item.get('uid') !== uid);
    setLeavenFlourItems(items);
    setLeavenFlourLeft(leavenFlourLeft + amtFlour);
    setFlourLeft(flourLeft + amtFlour);
    setWaterLeft(waterLeft + amtWater);
    updateLeaven();
  });

  const flourItemsListId = 'leaven-flour-items';

  const LeavenIngredients = (() => {
    if (canAddItem) {
      return (
        <>
          <LeavenFlourItems
            items={leavenFlourItems}
            flourItemsListId={flourItemsListId}
            flourTotal={leavenFlourTotal}
            flourLeft={leavenFlourLeft}
            changeItemHandler={changeItemHandler}
            removeItemHandler={removeItemHandler}
          />
          <div class="center">
            <AddItemButton actionHandler={addItemHandler} />
          </div>
        </>
      );
    }
    return null;
  });

  return (
    <>
      <p>{leavenText.text}</p>
      <datalist id={flourItemsListId}>
        {availableFlourItems.map((item) => (
          <option value={item.uid} key={item.uid}>{item.name}</option>
        ))}
      </datalist>
      {canAddItem && <LeavenFlourWeight
        flourTotal={flourTotal}
        setLeavenFlourWeight={setLeavenFlourWeight}
      />}
      <LeavenIngredients />
    </>
  );
}

const Leaven = connect(leavenStateItems, actions)(LeavenBase);

export { Leaven };
