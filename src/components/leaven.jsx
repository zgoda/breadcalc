import { useEffect, useState } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import { SectionTitle } from './pageinfo';
import { AmountType } from '../utils/numbers';
import leavenText from './leaven.json';
import {
  dryIngredientsStore,
  flourStore,
  leavenStore,
  waterStore,
} from '../state/stores';
import { flourActions, leavenActions, waterActions } from '../state/actions';

function LeavenFlourWeight() {
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);

  const flour = useStore(flourStore);

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flour.total * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flour.total) * 100;
    }
    setAmtWeight(amtWeight);
    setAmtPc(amtPc);
    leavenActions.setFlourTotal(amtWeight);
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
            max={flour.total}
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
 * @property {(amount: number) => void} changeWaterHandler
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
 * @property {import('../..').DryItem} item
 * @property {number} leavenFlourLeft
 * @property {number} leavenFlourTotal
 * @property {(itemId: string, amount: number) => void} removeItemHandler
 * @property {(amount: number) => void} changeItemHandler
 *
 * @param {LeavenFlourItemProps} props
 * @returns {JSX.Element}
 */
function LeavenFlourItem({
  item,
  leavenFlourTotal,
  leavenFlourLeft,
  removeItemHandler,
  changeItemHandler,
}) {
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    setName(item.name);
    setAmtWeight(item.amount);
    setAmtPc(item.percentage);
  }, [item]);

  const nameChange = (/** @type {string} */ name) => {
    setName(name);
    item.name = name;
  };

  const recalcAmount = (/** @type {number} */ value, /** @type {string} */ type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (leavenFlourTotal * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / leavenFlourTotal) * 100;
    }
    setAmtWeight(amtWeight);
    item.amount = amtWeight;
    setAmtPc(amtPc);
    item.percentage = amtPc;
    changeItemHandler(amtWeight);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => {
    removeItemHandler(item.id, item.amount);
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
          />
        </label>
        <label>
          Ilość (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            max={leavenFlourLeft}
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
 * @property {Array<import('../..').DryItem>} items
 * @property {number} leavenFlourTotal
 * @property {number} leavenFlourLeft
 * @property {(amount: number) => void} changeItemHandler
 * @property {(itemId: string, amount: number) => void} removeItemHandler
 *
 * @param {LeavenFlourItemsProps} props
 * @returns {JSX.Element}
 */
function LeavenFlourItems({
  items,
  leavenFlourTotal,
  leavenFlourLeft,
  changeItemHandler,
  removeItemHandler,
}) {
  return (
    <>
      {items.map((item) => (
        <LeavenFlourItem
          key={`leaven-flour-item-${item.id}`}
          item={item}
          leavenFlourTotal={leavenFlourTotal}
          leavenFlourLeft={leavenFlourLeft}
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
  /**
   * @type {[Array<import('../..').DryItem>, import('preact/hooks').StateUpdater<Array<import('../..').DryItem>>]}
   */
  const [leavenFlourItems, setLeavenFlourItems] = useState([]);
  const [leavenWater, setLeavenWater] = useState(0);
  const [leavenSourdough, setLeavenSourdough] = useState(0);

  const leaven = useStore(leavenStore);
  const flour = useStore(flourStore);
  const water = useStore(waterStore);
  const dryIngredients = useStore(dryIngredientsStore);

  useEffect(() => {
    setLeavenFlourItems(leaven.flourItems);
    setLeavenWater(leaven.water);
    setLeavenSourdough(leaven.sourdough);
  }, [leaven]);

  useEffect(() => {
    const canAddItem = flour.total > 0 && water.total > 0 && dryIngredients.length > 0;
    setCanAddItem(canAddItem);
    setIsFull(canAddItem && leavenFlourLeft === 0);
  }, [flour, water, dryIngredients, leavenFlourLeft]);

  useEffect(() => {
    setCanAddWater(leavenFlourTotal > 0);
  }, [leavenFlourTotal]);

  const addItemHandler = () => {
    const items = [
      ...leavenFlourItems,
      { id: uid(16), name: '', amount: 0, percentage: 0 },
    ];
    setLeavenFlourItems(items);
  };

  const updateLeaven = () => {
    /** @type {import('../..').Leaven} */
    const leaven = {
      flourItems: leavenFlourItems,
      flourTotal: leavenFlourTotal,
      flourLeft: leavenFlourTotal,
      water: leavenWater,
      sourdough: leavenSourdough,
    };
    leavenActions.set(leaven);
  };

  const changeWaterHandler = (/** @type {number} */ amtWater) => {
    setLeavenWater(amtWater);
    waterActions.use(amtWater);
    updateLeaven();
  };

  const changeFlourItemHandler = (/** @type {number} */ amtFlour) => {
    setLeavenFlourTotal(leavenFlourTotal + amtFlour);
    setLeavenFlourLeft(leavenFlourLeft - amtFlour);
    flourActions.use(amtFlour);
    updateLeaven();
  };

  const removeFlourItemHandler = (
    /** @type {string} */ itemId,
    /** @type {number} */ amtFlour,
  ) => {
    const items = leavenFlourItems.filter((item) => item.id !== itemId);
    setLeavenFlourItems(items);
    setLeavenFlourLeft(leavenFlourLeft + amtFlour);
    flourActions.return(amtFlour);
    updateLeaven();
  };

  const LeavenIngredients = () => {
    if (isFull) {
      return null;
    }
    return (
      <>
        <LeavenFlourItems
          items={leavenFlourItems}
          leavenFlourTotal={leavenFlourTotal}
          leavenFlourLeft={leavenFlourLeft}
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
      {canAddItem && <LeavenFlourWeight />}
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
