import { createStore, update } from 'nanostores';

/** @type {import('nanostores').WritableStore<number>} */
export const flourTotal = createStore(() => flourTotal.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const waterTotal = createStore(() => waterTotal.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const waterPc = createStore(() => waterPc.set(0));
export const dryIngredients = createStore(() => dryIngredients.set([]));
export const wetIngredients = createStore(() => wetIngredients.set([]));
export const dryAdjuncts = createStore(() => dryAdjuncts.set([]));
export const wetAdjuncts = createStore(() => wetAdjuncts.set([]));
/** @type {import('nanostores').WritableStore<number>} */
export const saltTotal = createStore(() => saltTotal.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const saltPc = createStore(() => saltPc.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const flourLeft = createStore(() => flourLeft.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const waterLeft = createStore(() => waterLeft.set(0));
/** @type {import('nanostores').WritableStore<number>} */
export const saltLeft = createStore(() => saltLeft.set(0));
export const leaven = createStore(() =>
  leaven.set({ flour: [], water: 0, sourdough: 0 }),
);

export function setFlourTotal(value) {
  update(flourTotal, value);
}

export function setWaterTotal(value) {
  update(waterTotal, value);
}

export function setWaterPc(value) {
  update(waterPc, value);
}

export function setDryIngredients(value) {
  update(dryIngredients, value);
}

export function setWetIngredients(value) {
  update(wetIngredients, value);
}

export function setDryAdjuncts(value) {
  update(dryAdjuncts, value);
}

export function setWetAdjuncts(value) {
  update(wetAdjuncts, value);
}

export function setSaltTotal(value) {
  update(saltTotal, value);
}

export function setSaltPc(value) {
  update(saltPc, value);
}

export function setFlourLeft(value) {
  update(flourLeft, value);
}

export function setWaterLeft(value) {
  update(waterLeft, value);
}

export function setSaltLeft(value) {
  update(saltLeft, value);
}

export function setLeaven(value) {
  update(leaven, value);
}
