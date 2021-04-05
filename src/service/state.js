import createStore from 'unistore';

const store = createStore({
  flourTotal: 0,
  waterTotal: 0,
  waterPc: 0,
  dryIngredients: [],
  wetIngredients: [],
  dryAdjuncts: [],
  wetAdjuncts: [],
  saltTotal: 0,
  saltPc: 0,
  flourLeft: 0,
  waterLeft: 0,
  saltLeft: 0,
});

const actions = {
  setFlourTotal: (_state, value) => ({ flourTotal: value }),
  setWaterTotal: (_state, value) => ({ waterTotal: value }),
  setWaterPc: (_state, value) => ({ waterPc: value }),
  setDryIngredients: (_state, value) => ({ dryIngredients: value }),
  setWetIngredients: (_state, value) => ({ wetIngredients: value }),
  setDryAdjuncts: (_state, value) => ({ dryAdjuncts: value }),
  setWetAdjuncts: (_state, value) => ({ wetAdjuncts: value }),
  setSaltTotal: (_state, value) => ({ saltTotal: value }),
  setSaltPc: (_state, value) => ({ saltPc: value }),
  setFlourLeft: (_state, value) => ({ flourLeft: value }),
  setWaterLeft: (_state, value) => ({ waterLeft: value }),
  setSaltLeft: (_state, value) => ({ saltLeft: value }),
};

export { store, actions };
