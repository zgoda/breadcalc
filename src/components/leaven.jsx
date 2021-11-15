import { useEffect, useState } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import { SectionTitle } from './pageinfo';
import { AmountType } from '../utils/numbers';
import leavenText from './leaven.json';
import {
  dryIngredientsStore,
  flourLeftStore,
  flourTotalStore,
  leavenStore,
  waterLeftStore,
  waterTotalStore,
} from '../state/stores';
import { setFlourLeft, setLeaven, setWaterLeft } from '../state/actions';

/**
 * @typedef {object} LeavenFlourWeightProps
 * @property {number} flourTotal
 * @property {(arg0: number) => void} setLeavenFlourWeight
 *
 * @param {LeavenFlourWeightProps} props
 * @returns {JSX.Element}
 */
function LeavenFlourWeight({ flourTotal, setLeavenFlourWeight }) {
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flourTotal * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flourTotal) * 100;
    }
    setAmtWeight(amtWeight);
    setAmtPc(amtPc);
    setLeavenFlourWeight(amtWeight);
  };

  return (
    <div class="section-wrapper">
      <div>
        <label>
          Waga mąki w zaczynie (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={flourTotal}
            value={amtWeight}
            // @ts-ignore
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
          />
        </label>
        <label>
          Jako % całkowitej ilości mąki
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            max="100"
            value={amtPc}
            // @ts-ignore
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
          />
        </label>
      </div>
    </div>
  );
}

/**
 * @typedef {object} LeavenWaterWeightProps
 * @property {number} leavenFlourTotal
 * @property {(arg0: number) => void} changeWaterHandler
 *
 * @param {LeavenWaterWeightProps} props
 * @returns {JSX.Element}
 */
function LeavenWaterWeight({ leavenFlourTotal, changeWaterHandler }) {
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtPc = value;
      amtWeight = (leavenFlourTotal * value) / 100;
    } else if (type === AmountType.TOTAL) {
      amtPc = (value / leavenFlourTotal) * 100;
      amtWeight = value;
    }
    setAmtPc(amtPc);
    setAmtWeight(amtWeight);
    changeWaterHandler(amtWeight);
  };

  return (
    <div class="section-wrapper">
      <div>
        <label>
          Waga wody w zaczynie (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            value={amtWeight}
            // @ts-ignore
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
          />
        </label>
        <label>
          Jako % ilości mąki w zaczynie
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            value={amtPc}
            // @ts-ignore
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
          />
        </label>
      </div>
    </div>
  );
}

/**
 * @typedef {object} LeavenFlourItemProps
 * @property {Map<string, string|number>} item
 * @property {number} flourLeft
 * @property {number} flourTotal
 * @property {(arg0: string, arg1: number) => void} removeItemHandler
 * @property {(arg0: number) => void} changeItemHandler
 * @property {string} listId
 *
 * @param {LeavenFlourItemProps} props
 * @returns {JSX.Element}
 */
function LeavenFlourItem({
  item,
  flourLeft,
  flourTotal,
  removeItemHandler,
  changeItemHandler,
  listId,
}) {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    setUid(item.get('uid').toString());
    if (item.has('name')) {
      setName(item.get('name').toString());
    }
    if (item.has('amtWeight')) {
      setAmtWeight(Number(item.get('amtWeight')));
    }
    if (item.has('amtPc')) {
      setAmtPc(Number(item.get('amtPc')));
    }
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    setName(name);
    item.set('name', name);
  };

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flourTotal * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flourTotal) * 100;
    }
    setAmtWeight(amtWeight);
    item.set('amtWeight', amtWeight);
    setAmtPc(amtPc);
    item.set('amtPc', amtPc);
    changeItemHandler(amtWeight);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => {
    removeItemHandler(uid, amtWeight);
  };

  return (
    <div class="section-wrapper">
      <div>
        <label>
          Nazwa <span class="label-required">*</span>
          <input
            type="text"
            value={name}
            // @ts-ignore
            onInput={(e) => nameChange(e.target.value)}
            required
            readOnly={readOnly}
            list={listId}
          />
        </label>
        <label>
          Ilość (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={flourLeft}
            value={amtWeight}
            // @ts-ignore
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
            readOnly={readOnly}
          />
        </label>
        <label>
          Ilość (%)
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            max="100"
            value={amtPc}
            // @ts-ignore
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            // @ts-ignore
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="column-center center">
        {readOnly ? (
          <UnlockButton actionHandler={makeEditable} />
        ) : (
          <LockButton actionHandler={makeReadOnly} />
        )}
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

/**
 * @typedef {object} LeavenFlourItemsProps
 * @property {Array<Map<string, string|number>>} items
 * @property {string} flourItemsListId
 * @property {number} flourTotal
 * @property {number} flourLeft
 * @property {(arg0: number) => void} changeItemHandler
 * @property {(arg0: string, arg1: number) => void} removeItemHandler
 *
 * @param {LeavenFlourItemsProps} props
 * @returns {JSX.Element}
 */
function LeavenFlourItems({
  items,
  flourItemsListId,
  flourTotal,
  flourLeft,
  changeItemHandler,
  removeItemHandler,
}) {
  return (
    <>
      {items.map((item) => (
        <LeavenFlourItem
          key={`leaven-flour-item-${item.get('uid')}`}
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

function Leaven() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [canAddWater, setCanAddWater] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [leavenFlourTotal, setLeavenFlourTotal] = useState(0);
  const [leavenFlourLeft, setLeavenFlourLeft] = useState(0);
  const [availableFlourItems, setAvailableFlourItems] = useState([]);
  const [leavenFlourItems, setLeavenFlourItems] = useState([]);
  const [leavenWater, setLeavenWater] = useState(0);
  const [leavenSourdough, setLeavenSourdough] = useState(0);

  const leaven = useStore(leavenStore);
  const flourTotal = useStore(flourTotalStore);
  const waterTotal = useStore(waterTotalStore);
  const flourLeft = useStore(flourLeftStore);
  const waterLeft = useStore(waterLeftStore);
  const dryIngredients = useStore(dryIngredientsStore);

  useEffect(() => {
    setLeavenFlourItems(leaven.flour);
    setLeavenWater(leaven.water);
    setLeavenSourdough(leaven.sourdough);
  }, [leaven]);

  useEffect(() => {
    const canAddItem = flourTotal > 0 && waterTotal > 0 && dryIngredients.length > 0;
    setCanAddItem(canAddItem);
    setIsFull(canAddItem && leavenFlourLeft === 0);
  }, [flourTotal, waterTotal, dryIngredients, leavenFlourLeft]);

  useEffect(() => {
    setCanAddWater(leavenFlourTotal > 0);
  }, [leavenFlourTotal]);

  useEffect(() => {
    const names = dryIngredients.map((item) => ({
      name: item.get('name'),
      value: item.get('uid'),
    }));
    setAvailableFlourItems(names);
  }, [dryIngredients]);

  const setLeavenFlourWeight = (/** @type {number} */ flourWeight) => {
    setLeavenFlourTotal(flourWeight);
    setLeavenFlourLeft(flourWeight);
  };

  const addItemHandler = () => {
    const items = [...leavenFlourItems, new Map([['uid', uid(16)]])];
    setLeavenFlourItems(items);
  };

  const updateLeaven = () => {
    const leaven = {
      flour: leavenFlourItems,
      water: leavenWater,
      sourdough: leavenSourdough,
    };
    setLeaven(leaven);
  };

  const changeWaterHandler = (/** @type {number} */ amtWater) => {
    setLeavenWater(amtWater);
    setWaterLeft(waterLeft - amtWater);
    updateLeaven();
  };

  const changeFlourItemHandler = (/** @type {number} */ amtFlour) => {
    setLeavenFlourTotal(leavenFlourTotal + amtFlour);
    setLeavenFlourLeft(leavenFlourLeft - amtFlour);
    setFlourLeft(flourLeft - amtFlour);
    updateLeaven();
  };

  const removeFlourItemHandler = (
    /** @type {string} */ uid,
    /** @type {number} */ amtFlour,
  ) => {
    const items = leavenFlourItems.filter((item) => item.get('uid') !== uid);
    setLeavenFlourItems(items);
    setLeavenFlourLeft(leavenFlourLeft + amtFlour);
    setFlourLeft(flourLeft + amtFlour);
    updateLeaven();
  };

  const flourItemsListId = 'leaven-flour-items';

  const LeavenIngredients = () => {
    if (isFull) {
      return null;
    }
    return (
      <>
        <LeavenFlourItems
          items={leavenFlourItems}
          flourItemsListId={flourItemsListId}
          flourTotal={leavenFlourTotal}
          flourLeft={leavenFlourLeft}
          changeItemHandler={changeFlourItemHandler}
          removeItemHandler={removeFlourItemHandler}
        />
        <div class="center">
          <AddItemButton actionHandler={addItemHandler} />
        </div>
      </>
    );
  };

  return (
    <section>
      <SectionTitle title="Zaczyn" level={2} />
      <p>{leavenText.text}</p>
      <datalist id={flourItemsListId}>
        {availableFlourItems.map((item) => (
          <option value={item.uid} key={item.uid}>
            {item.name}
          </option>
        ))}
      </datalist>
      {canAddItem && (
        <LeavenFlourWeight
          flourTotal={flourTotal}
          setLeavenFlourWeight={setLeavenFlourWeight}
        />
      )}
      {canAddWater && (
        <LeavenWaterWeight
          changeWaterHandler={changeWaterHandler}
          leavenFlourTotal={leavenFlourTotal}
        />
      )}
      <LeavenIngredients />
      {isFull && <p class="error">{leavenText.full}</p>}
    </section>
  );
}

export { Leaven };
