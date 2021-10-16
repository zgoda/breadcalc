import { createStore, update } from 'nanostores';

/** @type {import('nanostores').WritableStore<number>} */
export const flourTotalStore = createStore(() => flourTotalStore.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const waterTotalStore = createStore(() => waterTotalStore.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const waterPcStore = createStore(() => waterPcStore.set(0));
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const dryIngredientsStore = createStore(() => dryIngredientsStore.set([]));
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const wetIngredientsStore = createStore(() => wetIngredientsStore.set([]));
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const dryAdjunctsStore = createStore(() => dryAdjunctsStore.set([]));
/** @type {import('nanostores').WritableStore<Array<Map<string, string|number>>>} */
export const wetAdjunctsStore = createStore(() => wetAdjunctsStore.set([]));
/** @type {import('nanostores').WritableStore<number>} */
export const saltTotalStore = createStore(() => saltTotalStore.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const saltPcStore = createStore(() => saltPcStore.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const flourLeftStore = createStore(() => flourLeftStore.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const waterLeftStore = createStore(() => waterLeftStore.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const saltLeftStore = createStore(() => saltLeftStore.set(0));
/** @type {import('nanostores').WritableStore<import('../..').Leaven>} */
export const leavenStore = createStore(() =>
  leavenStore.set({ flour: [], water: 0, sourdough: 0 }),
);

/**
 * @param {number} value
 */
export function setFlourTotal(value) {
  update(flourTotalStore, (_current) => value);
}

/**
 * @param {number} value
 */
export function setWaterTotal(value) {
  update(waterTotalStore, (_current) => value);
}

/**
 * @param {number} value
 */
export function setWaterPc(value) {
  update(waterPcStore, (_current) => value);
}

/**
 * @param {Array<Map<string, string | number>>} value
 */
export function setDryIngredients(value) {
  update(dryIngredientsStore, (_current) => value);
}

/**
 * @param {Array<Map<string, string | number>>} value
 */
export function setWetIngredients(value) {
  update(wetIngredientsStore, (_current) => value);
}

/**
 * @param {Array<Map<string, string | number>>} value
 */
export function setDryAdjuncts(value) {
  update(dryAdjunctsStore, (_current) => value);
}

/**
 * @param {Array<Map<string, string | number>>} value
 */
export function setWetAdjuncts(value) {
  update(wetAdjunctsStore, (_current) => value);
}

/**
 * @param {number} value
 */
export function setSaltTotal(value) {
  update(saltTotalStore, (_current) => value);
}

/**
 * @param {number} value
 */
export function setSaltPc(value) {
  update(saltPcStore, (_current) => value);
}

/**
 * @param {number} value
 */
export function setFlourLeft(value) {
  update(flourLeftStore, (_current) => value);
}

/**
 * @param {number} value
 */
export function setWaterLeft(value) {
  update(waterLeftStore, (_current) => value);
}

/**
 * @param {number} value
 */
export function setSaltLeft(value) {
  update(saltLeftStore, (_current) => value);
}

/**
 * @param {import('../..').Leaven} value
 */
export function setLeaven(value) {
  update(leavenStore, (_current) => value);
}
