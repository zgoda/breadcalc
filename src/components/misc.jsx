import {
  HelpCircle, PlusCircle, CheckCircle, Edit3, MinusCircle, Check, Lock, Unlock,
} from 'preact-feather';
import { useState, useRef } from 'preact/hooks';

function HelpButton({ text }) {

  const [helpVisible, setHelpVisible] = useState(false);

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    setHelpVisible(!helpVisible);
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <>
      <button
        class="button button-clear"
        type="button"
        ref={buttonRef}
        onClick={handleButtonClick}
      >
        <HelpCircle />
      </button>
      {helpVisible && <div class="field-help">{text}</div>}
    </>
  );
}

function AddItemButton({ actionHandler, size = 32 }) {

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <button
      class="button button-clear"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <PlusCircle size={size} />
    </button>
  );
}

function SaveItemButton({ actionHandler }) {

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <button
      class="button button-clear"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <CheckCircle />
    </button>
  );
}

function EditItemButton({ actionHandler }) {

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <button
      class="button button-clear"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <Edit3 />
    </button>
  );
}

function RemoveItemButton({ actionHandler }) {

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <button
      class="button button-clear"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <MinusCircle />
    </button>
  );
}

function DoneButton({ actionHandler }) {

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <button
      class="button"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <Check />
      gotowe
    </button>
  );
}

function LockButton({ actionHandler }) {

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <button
      class="button button-clear"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <Lock />
    </button>
  );  
}

function UnlockButton({ actionHandler }) {

  const buttonRef = useRef(null);

  const handleButtonClick = ((e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  });

  return (
    <button
      class="button button-clear"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <Unlock />
    </button>
  );  
}

export {
  HelpButton, AddItemButton, SaveItemButton, EditItemButton, RemoveItemButton,
  DoneButton, LockButton, UnlockButton,
};
