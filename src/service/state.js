import createStore from 'unistore';

const store = createStore({
  flourTotal: 0,
  waterTotal: 0,
  waterPc: 0,
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
};

export { store, actions };
