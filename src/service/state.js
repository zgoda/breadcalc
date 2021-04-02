import createStore from 'unistore';

const store = createStore({
  flourTotal: 0,
  waterTotal: 0,
  waterPc: 0,
  dryIngredients: [],
  wetIngredients: [],
  adjuncts: [],
  saltTotal: 0,
  saltPc: 0,
});

const actions = {
  setFlourTotal: (_state, value) => {
    return { flourTotal: value };
  },
  setWaterTotal: (_state, value) => {
    return { waterTotal: value };
  },
  setWaterPc: (_state, value) => {
    return { waterPc: value };
  },
  setDryIngredients: (_state, value) => {
    return { dryIngredients: value };
  },
  setWetIngredients: (_state, value) => {
    return { wetIngredients: value };
  },
  setAdjuncts: (_state, value) => {
    return { adjuncts: value };
  },
  setSaltTotal: (_state, value) => {
    return { saltTotal: value };
  },
  setSaltPc: (_state, value) => {
    return { saltPc: value };
  },
};

export { store, actions };
