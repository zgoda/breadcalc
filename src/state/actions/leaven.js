import { action } from 'nanostores';
import { leavenStore } from '../stores';

export const setLeaven = action(
  leavenStore,
  'setLeaven',
  (store, /** @type {import('../../..').Leaven} */ value) => {
    store.set(value);
    return value;
  },
);

export const setFlourTotal = action(
  leavenStore,
  'setFlour',
  (store, /** @type {number} */ amount) => {
    store.setKey('flourTotal', amount);
    store.setKey('flourLeft', amount);
    return store.get();
  },
);

export const setWaterTotal = action(
  leavenStore,
  'setWater',
  (store, /** @type {number} */ amount) => {
    store.setKey('water', amount);
    return store.get();
  },
);

export const addFlourItem = action(
  leavenStore,
  'addFlourItem',
  (store, /** @type {import('../../..').DryItem} */ item) => {
    const prevContent = store.get();
    const newItems = [...prevContent.flourItems, item];
    store.setKey('flourItems', newItems);
    store.setKey('flourLeft', prevContent.flourLeft - item.amount);
    return store.get();
  },
);

export const removeFlourItem = action(
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
);
