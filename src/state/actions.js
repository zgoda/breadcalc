import { action } from 'nanostores';
import {
  dryAdjunctsStore,
  dryIngredientsStore,
  flourLeftStore,
  flourTotalStore,
  leavenStore,
  saltLeftStore,
  saltPcStore,
  saltTotalStore,
  waterLeftStore,
  waterPcStore,
  waterTotalStore,
  wetAdjunctsStore,
  wetIngredientsStore,
} from './stores';

export const setFlourTotal = action(
  flourTotalStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const setWaterTotal = action(
  waterTotalStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const setWaterPc = action(
  waterPcStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const dryIngredientsActions = {
  add: action(
    dryIngredientsStore,
    'add',
    (store, /** @type {import('../..').DryItem} */ item) => {
      const newContent = [...store.get(), item];
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() - item.amount);
      return newContent;
    },
  ),
  remove: action(
    dryIngredientsStore,
    'remove',
    (store, /** @type {string} */ itemId) => {
      let toAddBack = 0;
      const newContent = store.get().filter((item) => {
        if (item.id === itemId) {
          toAddBack = item.amount;
        } else {
          return item;
        }
      });
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() + toAddBack);
      return newContent;
    },
  ),
  update: action(
    dryIngredientsStore,
    'update',
    (store, /** @type {import('../..').DryItem} */ item) => {
      let amountChange = 0;
      const newContent = store.get().map((ingredient) => {
        if (ingredient.id === item.id) {
          if (ingredient.amount !== item.amount) {
            amountChange = ingredient.amount - item.amount;
          }
          return item;
        }
        return ingredient;
      });
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() + amountChange);
      return newContent;
    },
  ),
};

export const setWetIngredients = action(
  wetIngredientsStore,
  'set',
  (store, /** @type {Array<import('../..').WetItem>} */ value) => {
    store.set(value);
    return value;
  },
);

export const setDryAdjuncts = action(
  dryAdjunctsStore,
  'set',
  (store, /** @type {Array<import('../..').DryItem>} */ value) => {
    store.set(value);
    return value;
  },
);

export const setWetAdjuncts = action(
  wetAdjunctsStore,
  'set',
  (store, /** @type {Array<import('../..').WetItem>} */ value) => {
    store.set(value);
    return value;
  },
);

export const setSaltTotal = action(
  saltTotalStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const setSaltPc = action(
  saltPcStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const setFlourLeft = action(
  flourLeftStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const setWaterLeft = action(
  waterLeftStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const setSaltLeft = action(
  saltLeftStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return value;
  },
);

export const setLeaven = action(
  leavenStore,
  'set',
  (store, /** @type {import('../..').Leaven} */ value) => {
    store.set(value);
    return value;
  },
);
