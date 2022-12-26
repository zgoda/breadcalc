import { PlusCircle, MinusCircle, Check } from 'preact-feather';
import { useRef } from 'preact/hooks';
import { createElement } from 'preact';

import { doneButtonLabel } from './text.json';

/**
 * @typedef {Object} ActionButtonProps
 * @property {() => void} actionHandler
 * @property {string} actionType
 * @property {string} [text]
 * @property {number} [size]
 *
 * @param {ActionButtonProps} props
 * @returns {JSX.Element}
 */
function ActionButton({ actionHandler, actionType, text, size }) {
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
export function AddItemButton({ actionHandler, size = 32 }) {
  return <ActionButton actionHandler={actionHandler} actionType="add" size={size} />;
}

/**
 * @typedef {Object} RemoveItemButtonProps
 * @property {() => void} actionHandler
 *
 * @param {RemoveItemButtonProps} props
 * @returns {JSX.Element}
 */
export function RemoveItemButton({ actionHandler }) {
  return <ActionButton actionHandler={actionHandler} actionType="remove" />;
}

/**
 * @typedef {Object} SectionTitleProps
 * @property {string} title
 * @property {number} level
 *
 * @param {SectionTitleProps} props
 * @returns {JSX.Element}
 */
export function SectionTitle({ title, level }) {
  return createElement(`h${level}`, {}, title);
}

/**
 * @typedef {Object} DoneButtonProps
 * @property {() => void} handler
 *
 * @param {DoneButtonProps} props
 * @returns {JSX.Element}
 */
export function DoneButton({ handler }) {
  const buttonRef = useRef(null);

  const handleButtonClick = (/** @type {Event} */ e) => {
    e.preventDefault();
    handler();
    buttonRef.current && buttonRef.current.blur();
  };

  return (
    <button type="button" ref={buttonRef} onClick={handleButtonClick} class="autowidth">
      <Check /> {doneButtonLabel}
    </button>
  );
}
