import { atom, map } from 'nanostores';

/** @type {import('nanostores').WritableAtom<Array<import('../..').DryItem>>} */
export const dryIngredientsStore = atom([]);

/** @type {import('nanostores').WritableAtom<Array<import('../..').WetItem>>} */
export const wetIngredientsStore = atom([]);

/** @type {import('nanostores').WritableAtom<Array<import('../..').DryItem>>} */
export const dryAdjunctsStore = atom([]);

/** @type {import('nanostores').WritableAtom<Array<import('../..').WetItem>>} */
export const wetAdjunctsStore = atom([]);

/** @type {import('nanostores').MapStore<import('../..').Leaven>} */
export const leavenStore = map({
  flourItems: [],
  flourTotal: 0,
  flourLeft: 0,
  water: 0,
  sourdough: 0,
});

/** @type {import('nanostores').MapStore<import('../..').WaterData>} */
export const waterStore = map({ total: 0, percentage: 0, left: 0 });

/** @type {import('nanostores').MapStore<import('../..').FlourData>} */
export const flourStore = map({ total: 0, left: 0 });

/** @type {import('nanostores').MapStore<import('../..').SaltData>} */
export const saltStore = map({ total: 0, percentage: 0, left: 0 });
