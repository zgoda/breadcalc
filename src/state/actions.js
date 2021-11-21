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
    store.set({ total: amount, left: amount });
    const waterPc = waterStore.get().percentage;
    if (waterPc > 0) {
      const waterTotal = (amount * waterPc) / 100;
      waterStore.setKey('total', waterTotal);
      waterStore.setKey('left', waterTotal);
    }
    const saltPc = saltStore.get().percentage;
    if (saltPc > 0) {
      const saltTotal = (amount * saltPc) / 100;
      saltStore.setKey('total', saltTotal);
      saltStore.setKey('left', saltTotal);
    }
    return store.get();
  }),
  use: action(flourStore, 'use', (store, /** @type {number} */ amount) => {
    const prevContent = store.get();
    store.setKey('left', prevContent.left - amount);
    return store.get();
  }),
  setUsed: action(flourStore, 'setUsed', (store, /** @type {number} */ amount) => {
    const prevContent = store.get();
    store.setKey('left', prevContent.total - amount);
    return store.get();
  }),
  return: action(flourStore, 'return', (store, /** @type {number} */ amount) => {
    const prevContent = store.get();
    store.setKey('left', prevContent.left + amount);
    return store.get();
  }),
};

export const waterActions = {
  setAmount: action(waterStore, 'setAmount', (store, /** @type {number} */ value) => {
    const flourTotal = flourStore.get().total;
    store.set({ total: value, left: value, percentage: (value / flourTotal) * 100 });
    return store.get();
  }),
  setPercent: action(waterStore, 'setPercent', (store, /** @type {number} */ value) => {
    const flourTotal = flourStore.get().total;
    const total = (flourTotal * value) / 100;
    store.set({ percentage: value, total, left: total });
    return store.get();
  }),
  use: action(waterStore, 'use', (store, /** @type {number} */ value) => {
    const prevLeft = store.get().left;
    store.setKey('left', prevLeft - value);
    return store.get();
  }),
  setUsed: action(waterStore, 'setUsed', (store, /** @type {number} */ amount) => {
    const prevContent = store.get();
    store.setKey('left', prevContent.total - amount);
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
    store.set({ total: value, left: value, percentage: (value / flourTotal) * 100 });
    return store.get();
  }),
  setPercent: action(saltStore, 'setPercent', (store, /** @type {number} */ value) => {
    const flourTotal = flourStore.get().total;
    const total = (flourTotal * value) / 100;
    store.set({ percentage: value, total, left: total });
    return store.get();
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
      let usedFlour = 0;
      wetIngredientsStore.get().forEach((ing) => (usedFlour += ing.amount));
      const newContent = store.get().map((ingredient) => {
        if (ingredient.id === item.id) {
          usedFlour += item.amount;
          return item;
        }
        usedFlour += ingredient.amount;
        return ingredient;
      });
      store.set(newContent);
      flourActions.setUsed(usedFlour);
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
      let usedFlour = 0;
      let usedWater = 0;
      dryIngredientsStore.get().forEach((ing) => (usedFlour += ing.amount));
      wetAdjunctsStore.get().forEach((adj) => (usedWater += adj.waterAmount));
      const newContent = store.get().map((ingredient) => {
        if (item.id === ingredient.id) {
          usedFlour += item.amount;
          usedWater += item.waterAmount;
          return item;
        }
        usedFlour += ingredient.amount;
        usedWater += ingredient.waterAmount;
        return ingredient;
      });
      store.set(newContent);
      flourActions.setUsed(usedFlour);
      waterActions.setUsed(usedWater);
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
          extraWater = ingredient.waterAmount - item.waterAmount;
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

export const leavenActions = {
  set: action(
    leavenStore,
    'set',
    (store, /** @type {import('../..').Leaven} */ value) => {
      store.set(value);
      return value;
    },
  ),
  setFlourTotal: action(
    leavenStore,
    'setFlour',
    (store, /** @type {number} */ amount) => {
      store.setKey('flourTotal', amount);
      store.setKey('flourLeft', amount);
      return store.get();
    },
  ),
  addFlourItem: action(
    leavenStore,
    'addFlourItem',
    (store, /** @type {import('../..').DryItem} */ item) => {
      const prevContent = store.get();
      const newItems = [...prevContent.flourItems, item];
      store.setKey('flourItems', newItems);
      store.setKey('flourLeft', prevContent.flourLeft - item.amount);
      return store.get();
    },
  ),
  removeFlourItem: action(
    leavenStore,
    'removeFlourItem',
    (store, /** @type {string} */ itemId) => {
      const prevContent = store.get();
      let extraFlour = 0;
      const newItems = prevContent.flourItems.map((item) => {
        if (item.id === itemId) {
          extraFlour = item.amount;
        } else {
          return item;
        }
      });
      store.setKey('flourItems', newItems);
      store.setKey('flourLeft', prevContent.flourLeft + extraFlour);
      return store.get();
    },
  ),
};
