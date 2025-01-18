import PropTypes from "prop-types";
import Button from "./Button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

function ResetButton({ onClick }) {
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
    <AnimatePresence mode="popLayout">
      {!isResetting && (
        <motion.div
          key="button"
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button onClick={() => setIsResetting(true)} theme="red">
            Reset
          </Button>
        </motion.div>
      )}
      {isResetting && (
        <motion.div
          key="confirm"
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
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
            Confirm
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ResetButton;
