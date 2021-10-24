import { action, atom } from 'nanostores';

/** @type {import('nanostores').WritableStore<number>} */
export const flourTotalStore = atom(0);
/** @type {import('nanostores').WritableStore<number>} */
export const waterTotalStore = atom(0);
/** @type {import('nanostores').WritableStore<number>} */
export const waterPcStore = atom(0);
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const dryIngredientsStore = atom([]);
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const wetIngredientsStore = atom([]);
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const dryAdjunctsStore = atom([]);
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const wetAdjunctsStore = atom([]);
/** @type {import('nanostores').WritableStore<number>} */
export const saltTotalStore = atom(0);
/** @type {import('nanostores').WritableStore<number>} */
export const saltPcStore = atom(0);
/** @type {import('nanostores').WritableStore<number>} */
export const flourLeftStore = atom(0);
/** @type {import('nanostores').WritableStore<number>} */
export const waterLeftStore = atom(0);
/** @type {import('nanostores').WritableStore<number>} */
export const saltLeftStore = atom(0);
/** @type {import('nanostores').WritableStore<import('../..').Leaven>} */
export const leavenStore = atom({ flour: [], water: 0, sourdough: 0 });

export const setFlourTotal = action(
  flourTotalStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setWaterTotal = action(
  waterTotalStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setWaterPc = action(
  waterPcStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setDryIngredients = action(
  dryIngredientsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setWetIngredients = action(
  wetIngredientsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setDryAdjuncts = action(
  dryAdjunctsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setWetAdjuncts = action(
  wetAdjunctsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setSaltTotal = action(
  saltTotalStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setSaltPc = action(
  saltPcStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setFlourLeft = action(
  flourLeftStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setWaterLeft = action(
  waterLeftStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setSaltLeft = action(
  saltLeftStore,
  'set',
  (store, /** @type {number} */ value) => {
    store.set(value);
    return store.get();
  },
);

export const setLeaven = action(
  leavenStore,
  'set',
  (store, /** @type {import('../..').Leaven} */ value) => {
    store.set(value);
    return store.get();
  },
);
