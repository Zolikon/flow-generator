import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Button from "./Button";
import IconButton from "./IconButton";
import { motion } from "motion/react";
import CopyButton from "./CopyButton";

function CollapsibleInput({
  children,
  title,
  value,
  setValue,
  disabled,
  collapseDisabled = false,
  changedSinceGeneration,
  isCollapsed,
  help,
  triggerOpen = () => {},
  triggerCollapse = () => {},
  executeOnCtrlEnter = () => {},
}) {
  const dialogRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current && !disabled) {
      textAreaRef.current.focus();
    }
  }, [textAreaRef, disabled]);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      triggerCollapse();
    }
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      executeOnCtrlEnter();
    }
  };

  return (
    <>
      {!collapseDisabled && isCollapsed ? (
        <motion.div
          key={title + isCollapsed}
          className="flex flex-col items-start h-full w-[50px] bg-teal-400 text-slate-700 hover:bg-teal-600 cursor-pointer rounded-md hover:text-slate-200 py-10 transition-colors duration-300"
          onClick={() => triggerOpen()}
          initial={{ flexGrow: 1 }}
          animate={{ width: 50, flexGrow: 0 }}
        >
          {(changedSinceGeneration ? [...title, "*"] : [...title]).map(
            (char, index) => (
              <span
                key={char + index}
                className="w-full text-center font-bold text-2xl select-none"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ),
          )}
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col h-full flex-grow gap-3 bg-teal-400 p-2 rounded-md"
          key={title + isCollapsed}
          initial={{ width: 50, flexGrow: 0 }}
          animate={{ flexGrow: 1 }}
          exit={{ width: 50, flexGrow: 0 }}
        >
          <motion.p
            className="w-full text-center text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {changedSinceGeneration ? title + "*" : title}
          </motion.p>
          <div className="flex-grow flex flex-col relative">
            <textarea
              ref={textAreaRef}
              placeholder="Generate CTRL+Enter"
              autoFocus
              className="h-full w-full p-2 bg-slate-200 font-bold rounded-md resize-none disabled:opacity-50 transition-all duration-300"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              onKeyDown={onKeyDown}
            />
            <motion.div
              className="absolute right-5 bottom-2 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CopyButton textToCopy={value} />
              <IconButton
                iconName="question_mark"
                theme="blue"
                onClick={() => dialogRef.current.showModal()}
              />
            </motion.div>
          </div>
          {children}
        </motion.div>
      )}
      <dialog
        ref={dialogRef}
        className="w-[80vw] h-[80vh] rounded-md p-4"
        onClick={handleBackdropClick}
      >
        <div className="flex flex-col h-full w-full gap-4 items-center justify-start">
          {help}
          <Button theme="blue" onClick={() => dialogRef.current.close()}>
            Close
          </Button>
        </div>
      </dialog>
    </>
  );
}

CollapsibleInput.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
  collapseDisabled: PropTypes.bool,
  changedSinceGeneration: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  help: PropTypes.node.isRequired,
  triggerOpen: PropTypes.func,
  triggerCollapse: PropTypes.func,
  executeOnCtrlEnter: PropTypes.func,
};

export default CollapsibleInput;
