import { HelpCircle, PlusCircle, MinusCircle } from 'preact-feather';
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
    actionHandler();
    buttonRef.current && buttonRef.current.blur();
  };

  const ActionTypeIcon = () => {
    const typeIcons = new Map([
      ['add', PlusCircle],
      ['remove', MinusCircle],
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

  return (
    <button class="autowidth" type="button" ref={buttonRef} onClick={handleButtonClick}>
      <ActionTypeIcon />
      {text && `${text}`}
    </button>
  );
}

/**
 * @typedef {Object} AddItemButtonProps
 * @property {() => void} actionHandler
 * @property {number} [size=32]
 *
 * @param {AddItemButtonProps} props
 * @returns {JSX.Element}
 */
function AddItemButton({ actionHandler, size = 32 }) {
  return <ActionButton actionHandler={actionHandler} actionType="add" size={size} />;
}

/**
 * @typedef {Object} RemoveItemButtonProps
 * @property {() => void} actionHandler
 *
 * @param {RemoveItemButtonProps} props
 * @returns {JSX.Element}
 */
function RemoveItemButton({ actionHandler }) {
  return <ActionButton actionHandler={actionHandler} actionType="remove" />;
}

export { HelpButton, AddItemButton, RemoveItemButton };
