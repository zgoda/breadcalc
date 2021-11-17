import { action } from 'nanostores';
import {
  dryAdjunctsStore,
  dryIngredientsStore,
  flourStore,
  leavenStore,
  saltStore,
  waterStore,
  wetAdjunctsStore,
  wetIngredientsStore,
} from './stores';

export const flourActions = {
  set: action(flourStore, 'set', (store, /** @type {number} */ amount) => {
    const newContent = {
      total: amount,
      left: amount,
    };
    store.set(newContent);
    return newContent;
  }),
  use: action(flourStore, 'use', (store, /** @type {number} */ amount) => {
    const prevContent = store.get();
    store.setKey('left', prevContent.left - amount);
    return store.get();
  }),
  return: action(flourStore, 'return', (store, /** @type {number} */ value) => {
    const prevContent = store.get();
    store.setKey('left', prevContent.left + value);
    return store.get();
  }),
};

export const waterActions = {
  setAmount: action(waterStore, 'setAmount', (store, /** @type {number} */ value) => {
    const flourTotal = flourStore.get().total;
    const newContent = {
      total: value,
      left: value,
      percentage: (value / flourTotal) * 100,
    };
    store.set(newContent);
    return newContent;
  }),
  setPercent: action(waterStore, 'setPercent', (store, /** @type {number} */ value) => {
    const flourTotal = flourStore.get().total;
    const total = (flourTotal * value) / 100;
    const newContent = {
      percentage: value,
      total,
      left: total,
    };
    store.set(newContent);
    return newContent;
  }),
  use: action(waterStore, 'use', (store, /** @type {number} */ value) => {
    const prevLeft = store.get().left;
    store.setKey('left', prevLeft - value);
    return store.get();
  }),
  return: action(waterStore, 'return', (store, /** @type {number} */ value) => {
    const prevLeft = store.get().left;
    store.setKey('left', prevLeft + value);
    return store.get();
  }),
};

export const saltActions = {
  setAmount: action(saltStore, 'setAmount', (store, /** @type {number} */ value) => {
    const flourTotal = flourStore.get().total;
    const newContent = {
      total: value,
      left: value,
      percentage: (value / flourTotal) * 100,
    };
    store.set(newContent);
    return newContent;
  }),
  setPercent: action(saltStore, 'setPercent', (store, /** @type {number} */ value) => {
    const flourTotal = flourStore.get().total;
    const total = (flourTotal * value) / 100;
    const newContent = {
      percentage: value,
      total,
      left: total,
    };
    store.set(newContent);
    return newContent;
  }),
  use: action(saltStore, 'use', (store, /** @type {number} */ value) => {
    const prevLeft = store.get().left;
    store.setKey('left', prevLeft - value);
    return store.get();
  }),
  return: action(saltStore, 'return', (store, /** @type {number} */ value) => {
    const prevLeft = store.get().left;
    store.setKey('left', prevLeft + value);
    return store.get();
  }),
};

export const dryIngredientsActions = {
  add: action(
    dryIngredientsStore,
    'add',
    (store, /** @type {import('../..').DryItem} */ item) => {
      const newContent = [...store.get(), item];
      store.set(newContent);
      flourActions.use(item.amount);
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
      flourActions.return(extraFlour);
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
      flourActions.return(extraFlour);
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
      flourActions.use(item.amount);
      waterActions.use(item.waterAmount);
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
      flourActions.return(extraFlour);
      waterActions.return(extraWater);
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
      flourActions.return(extraFlour);
      waterActions.return(extraWater);
      return newContent;
    },
  ),
};

export const dryAdjunctsActions = {
  add: action(
    dryAdjunctsStore,
    'add',
    (store, /** @type {import('../..').DryItem} */ item) => {
      const newContent = [...store.get(), item];
      store.set(newContent);
      return newContent;
    },
  ),
  remove: action(dryAdjunctsStore, 'remove', (store, /** @type {string} */ itemId) => {
    const newContent = store.get().filter((adjunct) => {
      if (adjunct.id !== itemId) {
        return adjunct;
      }
    });
    store.set(newContent);
    return newContent;
  }),
  update: action(
    dryAdjunctsStore,
    'update',
    (store, /** @type {import('../..').DryItem} */ item) => {
      const newContent = store.get().map((ingredient) => {
        if (item.id === ingredient.id) {
          return item;
        }
        return ingredient;
      });
      store.set(newContent);
      return newContent;
    },
  ),
};

export const wetAdjunctsActions = {
  add: action(
    wetAdjunctsStore,
    'add',
    (store, /** @type {import('../..').WetItem} */ item) => {
      const newContent = [...store.get(), item];
      store.set(newContent);
      waterActions.use(item.waterAmount);
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
    waterActions.return(extraWater);
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
      waterActions.return(extraWater);
      return newContent;
    },
  ),
};

export const setLeaven = action(
  leavenStore,
  'set',
  (store, /** @type {import('../..').Leaven} */ value) => {
    store.set(value);
    return value;
  },
);
