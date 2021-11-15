import { atom, map } from 'nanostores';

/** @type {import('nanostores').WritableAtom<number>} */
export const flourTotalStore = atom(0);

/** @type {import('nanostores').WritableAtom<number>} */
export const waterTotalStore = atom(0);

/** @type {import('nanostores').WritableAtom<number>} */
export const waterPcStore = atom(0);

/** @type {import('nanostores').WritableAtom<Array<import('../..').DryItem>>} */
export const dryIngredientsStore = atom([]);

/** @type {import('nanostores').WritableAtom<Array<import('../..').WetItem>>} */
export const wetIngredientsStore = atom([]);

/** @type {import('nanostores').WritableAtom<Array<import('../..').DryItem>>} */
export const dryAdjunctsStore = atom([]);

/** @type {import('nanostores').WritableAtom<Array<import('../..').WetItem>>} */
export const wetAdjunctsStore = atom([]);

/** @type {import('nanostores').WritableAtom<number>} */
export const saltTotalStore = atom(0);

/** @type {import('nanostores').WritableAtom<number>} */
export const saltPcStore = atom(0);

/** @type {import('nanostores').WritableAtom<number>} */
export const flourLeftStore = atom(0);

/** @type {import('nanostores').WritableAtom<number>} */
export const waterLeftStore = atom(0);

/** @type {import('nanostores').WritableAtom<number>} */
export const saltLeftStore = atom(0);

/** @type {import('nanostores').MapStore<import('../..').Leaven>} */
export const leavenStore = map({ flour: [], water: 0, sourdough: 0 });
