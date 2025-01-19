import PropTypes from "prop-types";

function CollapsibleInput({
  title,
  value,
  setValue,
  disabled,
  collapseDisabled = false,
  isCollapsed,
  setIsCollapsed = () => {},
}) {
  return (
    <>
      {!collapseDisabled && isCollapsed ? (
        <div
          key={title + isCollapsed}
          className="flex flex-col items-start h-full w-[50px] bg-teal-400 text-slate-700 hover:bg-teal-600 cursor-pointer rounded-md hover:text-slate-200 py-10 transition-colors duration-300"
          onClick={() => setIsCollapsed(false)}
        >
          {[...title].map((char, index) => (
            <span
              key={char + index}
              className="w-full text-center font-bold text-2xl select-none"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col h-full flex-grow gap-3"
          key={title + isCollapsed}
        >
          <p className="w-full text-center text-4xl font-bold">{title}</p>
          <textarea
            className="flex-grow p-2 border border-gray-300 bg-slate-600 focus-visible:bg-slate-200 font-bold rounded-md resize-none disabled:opacity-50"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </>
  );
}

CollapsibleInput.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
  collapseDisabled: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  setIsCollapsed: PropTypes.func,
};

export default CollapsibleInput;
