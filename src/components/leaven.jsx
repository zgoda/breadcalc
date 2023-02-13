import { useEffect, useState } from 'preact/hooks';
import { uid } from 'uid';
import { useStore } from '@nanostores/preact';

import { AddItemButton, RemoveItemButton, SectionTitle, DoneButton } from './misc';
import { AmountType } from '../utils/numbers';
import { text, flourWeight, flourPc, waterWeight, waterPc } from './leaven.json';
import { labelAmtGms, labelAmtPc, labelName } from './forms.json';
import {
  dryIngredientsStore,
  flourStore,
  leavenStore,
  waterStore,
} from '../state/stores';
import { flourActions } from '../state/actions';
import { setFlourTotal, setWaterTotal } from '../state/actions/leaven';

function LeavenBaseItems() {
  const [amtFlourWeight, setAmtFlourWeight] = useState(0);
  const [amtFlourPc, setAmtFlourPc] = useState(0);
  const [amtWaterWeight, setAmtWaterWeight] = useState(0);
  const [amtWaterPc, setAmtWaterPc] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const flour = useStore(flourStore);
  const water = useStore(waterStore);
  const leaven = useStore(leavenStore);

  useEffect(() => {
    setIsVisible(flour.total > 0 && water.total > 0 && water.left > 0);
  }, [flour.total, water.total, water.left]);

  const recalcFlourAmount = (
    /** @type {number} */ value,
    /** @type {string} */ type,
  ) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flour.total * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flour.total) * 100;
    }
    setAmtFlourWeight(amtWeight);
    setAmtFlourPc(amtPc);
  };

  const recalcWaterAmount = (
    /** @type {number} */ value,
    /** @type {string} */ type,
  ) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtPc = value;
      amtWeight = (leaven.flourTotal * value) / 100;
    } else if (type === AmountType.TOTAL) {
      amtPc = (value / leaven.flourTotal) * 100;
      amtWeight = value;
    }
    setAmtWaterPc(amtPc);
    setAmtWaterWeight(amtWeight);
  };

  const handleDone = () => {
    setFlourTotal(amtFlourWeight);
    setWaterTotal(amtWaterWeight);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div>
      <form>
        <div class="grid">
          <div>
            <label>
              {flourWeight}
              <input
                type="number"
                inputMode="numeric"
                step="1"
                max={flour.total}
                value={amtFlourWeight}
                // @ts-ignore
                onInput={(e) => setAmtFlourWeight(parseFloat(e.target.value))}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcFlourAmount(parseFloat(e.target.value), AmountType.TOTAL)
                }
              />
            </label>
          </div>
          <div>
            <label>
              {flourPc}
              <input
                type="number"
                inputMode="numeric"
                step="0.1"
                max="100"
                value={amtFlourPc}
                // @ts-ignore
                onInput={(e) => setAmtFlourPc(parseFloat(e.target.value))}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcFlourAmount(parseFloat(e.target.value), AmountType.PERCENT)
                }
              />
            </label>
          </div>
        </div>
        <div class="grid">
          <div>
            <label>
              {waterWeight}
              <input
                type="number"
                inputMode="numeric"
                step="1"
                value={amtWaterWeight}
                // @ts-ignore
                onInput={(e) => setAmtWaterWeight(parseFloat(e.target.value))}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcWaterAmount(parseFloat(e.target.value), AmountType.TOTAL)
                }
              />
            </label>
          </div>
          <div>
            <label>
              {waterPc}
              <input
                type="number"
                inputMode="numeric"
                step="0.1"
                value={amtWaterPc}
                // @ts-ignore
                onInput={(e) => setAmtWaterPc(parseFloat(e.target.value))}
                onBlur={(e) =>
                  // @ts-ignore
                  recalcWaterAmount(parseFloat(e.target.value), AmountType.PERCENT)
                }
              />
            </label>
          </div>
        </div>
        <DoneButton handler={handleDone} />
      </form>
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

  const removeItem = () => {
    removeItemHandler(item.id, item.amount);
  };

  return (
    <div>
      <div class="grid">
        <div>
          <label>
            {labelName} <span class="label-required">*</span>
            <input
              type="text"
              value={name}
              // @ts-ignore
              onInput={(e) => nameChange(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            {labelAmtGms}
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
            />
          </label>
        </div>
        <div>
          <label>
            {labelAmtPc}
            <input
              type="number"
              inputMode="numeric"
              step="0.1"
              max="100"
              value={amtPc}
              // @ts-ignore
              onInput={(e) => setAmtPc(parseFloat(e.target.value))}
              onBlur={(e) =>
                // @ts-ignore
                recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)
              }
            />
          </label>
        </div>
        <div>
          <RemoveItemButton actionHandler={removeItem} />
        </div>
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

export function Leaven() {
  const [canAddItem, setCanAddItem] = useState(true);
  const [isFull, setIsFull] = useState(false);
  const [leavenFlourTotal, setLeavenFlourTotal] = useState(0);
  const [leavenFlourLeft, setLeavenFlourLeft] = useState(0);
  /**
   * @type {[Array<import('../..').DryItem>, import('preact/hooks').StateUpdater<Array<import('../..').DryItem>>]}
   */
  const [leavenFlourItems, setLeavenFlourItems] = useState([]);

  const leaven = useStore(leavenStore);
  const flour = useStore(flourStore);
  const water = useStore(waterStore);
  const dryIngredients = useStore(dryIngredientsStore);

  useEffect(() => {
    setLeavenFlourItems(leaven.flourItems);
  }, [leaven.flourItems, leaven.water, leaven.sourdough]);

  useEffect(() => {
    const canAddItem = flour.total > 0 && water.total > 0 && dryIngredients.length > 0;
    setCanAddItem(canAddItem);
    setIsFull(
      canAddItem &&
        leaven.flourTotal > 0 &&
        leaven.flourLeft === 0 &&
        leaven.flourItems.length > 0,
    );
  }, [
    flour.total,
    water.total,
    dryIngredients,
    leaven.flourTotal,
    leaven.flourLeft,
    leaven.flourItems,
  ]);

  const addItemHandler = () => {
    const items = [
      ...leavenFlourItems,
      { id: uid(16), name: '', amount: 0, percentage: 0 },
    ];
    setLeavenFlourItems(items);
  };

  const changeFlourHandler = (/** @type {number} */ amtFlour) => {
    setLeavenFlourTotal(leavenFlourTotal + amtFlour);
    setLeavenFlourLeft(leavenFlourLeft - amtFlour);
    flourActions.use(amtFlour);
  };

  const removeFlourItemHandler = (
    /** @type {string} */ itemId,
    /** @type {number} */ amtFlour,
  ) => {
    const items = leavenFlourItems.filter((item) => item.id !== itemId);
    setLeavenFlourItems(items);
    setLeavenFlourLeft(leavenFlourLeft + amtFlour);
    flourActions.return(amtFlour);
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
          changeItemHandler={changeFlourHandler}
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
      <SectionTitle title={text.title} level={2} />
      {!isFull && <p>{text.intro}</p>}
      <LeavenBaseItems />
      {canAddItem && <LeavenIngredients />}
      {isFull && <p class="error">{text.full}</p>}
    </section>
  );
}
