import { HelpCircle, PlusCircle, MinusCircle, Lock, Unlock } from 'preact-feather';
import { useState, useRef } from 'preact/hooks';

/**
 * @typedef {object} HelpButtonProps
 * @property {string} text
 *
 * @param {HelpButtonProps} props
 * @returns {JSX.Element}
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

/**
 * @typedef {Object} ActionButtonProps
 * @property {() => void} actionHandler
 * @property {string} actionType
 * @property {string} [text]
 * @property {number} [size]
 * @property {boolean} [small=true]
 *
 * @param {ActionButtonProps} props
 * @returns {JSX.Element}
 */
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
  return <ActionButton actionHandler={actionHandler} actionType="add" size={size} />;
}

function RemoveItemButton({ actionHandler }) {
  return <ActionButton actionHandler={actionHandler} actionType="remove" />;
}

function LockButton({ actionHandler }) {
  return <ActionButton actionHandler={actionHandler} actionType="lock" />;
}

function UnlockButton({ actionHandler }) {
  return <ActionButton actionHandler={actionHandler} actionType="unlock" />;
}

export { HelpButton, AddItemButton, RemoveItemButton, LockButton, UnlockButton };
