import PropTypes from "prop-types";
import { useRef } from "react";
import Button from "./Button";
import IconButton from "./IconButton";

function CollapsibleInput({
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
}) {
  const dialogRef = useRef(null);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <>
      {!collapseDisabled && isCollapsed ? (
        <div
          key={title + isCollapsed}
          className="flex flex-col items-start h-full w-[50px] bg-teal-400 text-slate-700 hover:bg-teal-600 cursor-pointer rounded-md hover:text-slate-200 py-10 transition-colors duration-300"
          onClick={() => triggerOpen()}
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
        </div>
      ) : (
        <div
          className="flex flex-col h-full flex-grow gap-3"
          key={title + isCollapsed}
        >
          <p className="w-full text-center text-4xl font-bold">
            {changedSinceGeneration ? title + "*" : title}
          </p>
          <div className="flex-grow flex flex-col relative">
            <textarea
              autoFocus
              className="h-full w-full p-2 bg-slate-200 font-bold rounded-md resize-none disabled:opacity-50 transition-all duration-300"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  triggerCollapse();
                }
              }}
            />
            <div className="absolute right-2 bottom-2 flex gap-2">
              <IconButton
                iconName="content_copy"
                onClick={() => {
                  navigator.clipboard.writeText(value);
                }}
              />
              <IconButton
                iconName="question_mark"
                theme="blue"
                onClick={() => dialogRef.current.showModal()}
              />
            </div>
          </div>
        </div>
      )}
      <dialog
        ref={dialogRef}
        className="w-[50vw] h-[50vh] rounded-md p-4"
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
};

export default CollapsibleInput;
