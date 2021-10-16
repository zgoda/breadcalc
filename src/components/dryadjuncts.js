import { connect } from 'unistore/preact';
import { useState, useEffect } from 'preact/hooks';
import { uid } from 'uid';

import { actions } from '../service/state';
import { SectionTitle } from './pageinfo';
import { AddItemButton, LockButton, UnlockButton, RemoveItemButton } from './misc';
import { AmountType } from '../utils/numbers';
import dryadjuncts from '../data/dryadjuncts.json';

function DryAdjunctItem({ item, flourTotal, removeItemHandler }) {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [amtWeight, setAmtWeight] = useState(0);
  const [amtPc, setAmtPc] = useState(0);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    setUid(item.get('uid'));
    if (item.has('name')) {
      setName(item.get('name'));
    }
    if (item.has('amtWeight')) {
      setAmtWeight(item.get('amtWeight'));
    }
    if (item.has('amtPc')) {
      setAmtPc(item.get('amtPc'));
    }
  }, [item]);

  const nameChange = (name) => {
    setName(name);
    item.set('name', name);
  };

  const recalcAmount = (value, type) => {
    let amtPc, amtWeight;
    if (type === AmountType.PERCENT) {
      amtWeight = (flourTotal * value) / 100;
      amtPc = value;
    } else if (type === AmountType.TOTAL) {
      amtWeight = value;
      amtPc = (value / flourTotal) * 100;
    }
    setAmtWeight(amtWeight);
    item.set('amtWeight', amtWeight);
    setAmtPc(amtPc);
    item.set('amtPc', amtPc);
  };

  const makeReadOnly = () => {
    setReadOnly(true);
  };

  const makeEditable = () => {
    setReadOnly(false);
  };

  const removeItem = () => {
    removeItemHandler(uid, amtWeight);
  };

  return (
    <div class="row X--middle">
      <div class="M6">
        <label>
          Nazwa <span class="label-required">*</span>
          <input
            type="text"
            value={name}
            onInput={(e) => nameChange(e.target.value)}
            required
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M2">
        <label>
          Ilość (g)
          <input
            type="number"
            inputMode="numeric"
            step="1"
            value={amtWeight}
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.TOTAL)}
            onInput={(e) => setAmtWeight(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M2">
        <label>
          Ilość (%)
          <input
            type="number"
            inputMode="numeric"
            step="0.1"
            max="100"
            value={amtPc}
            onBlur={(e) => recalcAmount(parseFloat(e.target.value), AmountType.PERCENT)}
            onInput={(e) => setAmtPc(parseFloat(e.target.value))}
            readOnly={readOnly}
          />
        </label>
      </div>
      <div class="M1 center">
        {readOnly ? (
          <UnlockButton actionHandler={makeEditable} />
        ) : (
          <LockButton actionHandler={makeReadOnly} />
        )}
      </div>
      <div class="M1 center">
        <RemoveItemButton actionHandler={removeItem} />
      </div>
    </div>
  );
}

const dryAdjunctsStateItems = ['flourTotal', 'dryAdjuncts'];

function DryAdjunctsBase({ flourTotal, dryAdjuncts, setDryAdjuncts }) {
  const [canAddItem, setCanAddItem] = useState(true);

  useEffect(() => {
    setCanAddItem(flourTotal > 0);
  }, [flourTotal]);

  const addItemHandler = () => {
    const items = [...dryAdjuncts, new Map([['uid', uid(16)]])];
    setDryAdjuncts(items);
  };

  const removeItemHandler = (uid) => {
    const items = dryAdjuncts.filter((item) => item.get('uid') !== uid);
    setDryAdjuncts(items);
  };

  return (
    <>
      <SectionTitle title={'Dodatki suche'} level={3} />
      <p>{dryadjuncts.text}</p>
      <form>
        <fieldset>
          {dryAdjuncts.map((item) => (
            <DryAdjunctItem
              item={item}
              key={item.get('uid')}
              flourTotal={flourTotal}
              removeItemHandler={removeItemHandler}
            />
          ))}
        </fieldset>
      </form>
      <div class="center">
        {canAddItem && <AddItemButton actionHandler={addItemHandler} />}
      </div>
    </>
  );
}

const DryAdjuncts = connect(dryAdjunctsStateItems, actions)(DryAdjunctsBase);

export { DryAdjuncts };
