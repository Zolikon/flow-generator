import PropTypes from "prop-types";
import Button from "./Button";
import { useEffect, useState } from "react";

function ResetButton({ onClick, disabled }) {
  const [isResetting, setIsResetting] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (isResetting) {
      setTimeoutId(
        setTimeout(() => {
          setIsResetting(false);
        }, 3000),
      );
    } else {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isResetting]);

  return (
    <>
      {!isResetting && (
        <div key="button" className="flex gap-2">
          <Button
            onClick={() => setIsResetting(true)}
            theme="red"
            disabled={disabled}
          >
            Reset
          </Button>
        </div>
      )}
      {isResetting && (
        <div key="confirm" className="flex gap-2">
          <Button
            onClick={() => {
              setIsResetting(false);
            }}
            theme="yellow"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsResetting(false);
              onClick();
            }}
            theme="red"
          >
            Reset
          </Button>
        </div>
      )}
    </>
  );
}

ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ResetButton;
