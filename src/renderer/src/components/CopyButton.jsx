import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function CopyButton({ textToCopy, onClick }) {
  const [iconName, setIconName] = useState("content_copy");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timeout;
    if (isCopied) {
      setIconName("done");
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      setIconName("content_copy");
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isCopied]);

  function triggerCopy() {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => setIsCopied(true));
    } else {
      onClick();
      setIsCopied(true);
    }
  }

  function isDisabled() {
    return isCopied || (!textToCopy && !onClick);
  }

  return (
    <button
      className={`group p-2 flex items-center justify-center rounded-full aspect-square w-12 select-none bg-green-500 disabled:bg-gray-500 text-stone-100 transition-colors duration-300`}
      onClick={triggerCopy}
      disabled={isDisabled()}
    >
      <i
        className={`material-symbols-outlined ${!isDisabled() && "group-hover:scale-125"} transition-all duration-300`}
      >
        {iconName}
      </i>
    </button>
  );
}

CopyButton.propTypes = {
  textToCopy: PropTypes.string,
  onClick: PropTypes.func,
};

export default CopyButton;
