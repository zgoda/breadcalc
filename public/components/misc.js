import {
  HelpCircle,
  PlusCircle,
  CheckCircle,
  Edit3,
  MinusCircle,
  Lock,
  Unlock,
} from 'preact-feather';
import { useState, useRef } from 'preact/hooks';

/**
 * @typedef {object} HelpButtonProps
 * @property {string} text
 *
 * @param {HelpButtonProps} props
 * @returns
 */
function HelpButton({ text }) {
  const [helpVisible, setHelpVisible] = useState(false);

  const buttonRef = useRef(null);

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    setHelpVisible(!helpVisible);
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <>
      <button
        class="button button-clear button-icon-small"
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

function ActionButton({ actionHandler, actionType, text, size, small = true }) {
  const buttonRef = useRef(null);

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

  const ActionTypeIcon = () => {
    const typeIcons = new Map([
      ['add', PlusCircle],
      ['save', CheckCircle],
      ['edit', Edit3],
      ['remove', MinusCircle],
      ['lock', Lock],
      ['unlock', Unlock],
    ]);
    const TypeIcon = typeIcons.get(actionType);
    if (TypeIcon != null) {
      if (size != null) {
        return <TypeIcon size={size} />;
      }
      return <TypeIcon />;
    }
    return null;
  };

  const buttonClasses = ['button'];
  if (small || (size != null && size < 32)) {
    buttonClasses.push('button-icon-small');
  }
  if (text == null) {
    buttonClasses.push('button-clear');
  }
  const buttonClassesStr = buttonClasses.join(' ');

  return (
    <button
      class={buttonClassesStr}
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <ActionTypeIcon />
      {text && `${text}`}
    </button>
  );
}

function AddItemButton({ actionHandler, size = 32 }) {
  const buttonRef = useRef(null);

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

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

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <button
      class="button button-clear button-icon-small"
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

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <button
      class="button button-clear button-icon-small"
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

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <button
      class="button button-clear button-icon-small"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <MinusCircle />
    </button>
  );
}

function LockButton({ actionHandler }) {
  const buttonRef = useRef(null);

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <button
      class="button button-clear button-icon-small"
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

  const handleButtonClick = (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();
    actionHandler && actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <button
      class="button button-clear button-icon-small"
      type="button"
      ref={buttonRef}
      onClick={handleButtonClick}
    >
      <Unlock />
    </button>
  );
}

export {
  HelpButton,
  AddItemButton,
  SaveItemButton,
  EditItemButton,
  RemoveItemButton,
  LockButton,
  UnlockButton,
  ActionButton,
};
