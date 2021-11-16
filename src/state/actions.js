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
      let extraFlour = 0;
      const newContent = store.get().filter((item) => {
        if (item.id === itemId) {
          extraFlour = item.amount;
        } else {
          return item;
        }
      });
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() + extraFlour);
      return newContent;
    },
  ),
  update: action(
    dryIngredientsStore,
    'update',
    (store, /** @type {import('../..').DryItem} */ item) => {
      let extraFlour = 0;
      const newContent = store.get().map((ingredient) => {
        if (ingredient.id === item.id) {
          if (ingredient.amount !== item.amount) {
            extraFlour = ingredient.amount - item.amount;
          }
          return item;
        }
        return ingredient;
      });
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() + extraFlour);
      return newContent;
    },
  ),
};

export const wetIngredientsActions = {
  add: action(
    wetIngredientsStore,
    'add',
    (store, /** @type {import('../..').WetItem} */ item) => {
      const newContent = [...store.get(), item];
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() - item.amount);
      setWaterLeft(waterLeftStore.get() - item.waterAmount);
      return newContent;
    },
  ),
  remove: action(
    wetIngredientsStore,
    'remove',
    (store, /** @type {string} */ itemId) => {
      let extraWater = 0;
      let extraFlour = 0;
      const newContent = store.get().filter((item) => {
        if (item.id === itemId) {
          extraFlour = item.amount;
          extraWater = item.waterAmount;
        } else {
          return item;
        }
      });
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() + extraFlour);
      setWaterLeft(waterLeftStore.get() + extraWater);
      return newContent;
    },
  ),
  update: action(
    wetIngredientsStore,
    'update',
    (store, /** @type {import('../..').WetItem} */ item) => {
      let extraFlour = 0;
      let extraWater = 0;
      const newContent = store.get().map((ingredient) => {
        if (item.id === ingredient.id) {
          if (item.amount !== ingredient.amount) {
            extraFlour = ingredient.amount - item.amount;
          }
          if (item.waterAmount !== ingredient.waterAmount) {
            extraWater = ingredient.waterAmount - item.waterAmount;
          }
          return item;
        }
        return ingredient;
      });
      store.set(newContent);
      setFlourLeft(flourLeftStore.get() + extraFlour);
      setWaterLeft(waterLeftStore.get() + extraWater);
      return newContent;
    },
  ),
};

export const setDryAdjuncts = action(
  dryAdjunctsStore,
  'set',
  (store, /** @type {Array<import('../..').DryItem>} */ value) => {
    store.set(value);
    return value;
  },
);

export const wetAdjunctsActions = {
  add: action(
    wetAdjunctsStore,
    'add',
    (store, /** @type {import('../..').WetItem} */ item) => {
      const newContent = [...store.get(), item];
      store.set(newContent);
      setWaterLeft(waterLeftStore.get() - item.waterAmount);
      return newContent;
    },
  ),
  remove: action(wetAdjunctsStore, 'remove', (store, /** @type {string} */ itemId) => {
    let extraWater = 0;
    const newContent = store.get().filter((item) => {
      if (item.id === itemId) {
        extraWater = item.waterAmount;
      } else {
        return item;
      }
    });
    store.set(newContent);
    setWaterLeft(waterLeftStore.get() + extraWater);
    return newContent;
  }),
  update: action(
    wetAdjunctsStore,
    'update',
    (store, /** @type {import('../..').WetItem} */ item) => {
      let extraWater = 0;
      const newContent = store.get().map((ingredient) => {
        if (item.id === ingredient.id) {
          if (item.waterAmount !== ingredient.waterAmount) {
            extraWater = ingredient.waterAmount - item.waterAmount;
          }
          return item;
        }
        return ingredient;
      });
      store.set(newContent);
      setWaterLeft(waterLeftStore.get() + extraWater);
      return newContent;
    },
  ),
};

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
