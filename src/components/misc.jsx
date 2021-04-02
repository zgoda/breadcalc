import { HelpCircle } from 'preact-feather';
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

export { HelpButton };
