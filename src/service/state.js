import { action, atom, map, mapTemplate } from 'nanostores';

/** @type {import('nanostores').WritableStore<number>} */
export const flourTotalStore = atom(0);

/** @type {import('nanostores').WritableStore<number>} */
export const waterTotalStore = atom(0);

/** @type {import('nanostores').WritableStore<number>} */
export const waterPcStore = atom(0);

/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const dryIngredientsStore = atom([]);

export const DryIngredient = mapTemplate(
  (
    /** @type {import('nanostores').MapStore<import('../..').DryIngredient>} */ newIngredient,
    id,
  ) => {
    newIngredient.setKey('id', id);
    newIngredient.setKey('name', '');
    newIngredient.setKey('amount', 0);
    newIngredient.setKey('percentage', 0);
  },
);

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

/** @type {import('nanostores').MapStore<import('../..').Leaven>} */
export const leavenStore = map({ flour: [], water: 0, sourdough: 0 });

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

export const setDryIngredients = action(
  dryIngredientsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
    store.set(value);
    return value;
  },
);

export const setWetIngredients = action(
  wetIngredientsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
    store.set(value);
    return value;
  },
);

export const setDryAdjuncts = action(
  dryAdjunctsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
    store.set(value);
    return value;
  },
);

export const setWetAdjuncts = action(
  wetAdjunctsStore,
  'set',
  (store, /** @type {Array<Map<string, string | number>>} */ value) => {
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
