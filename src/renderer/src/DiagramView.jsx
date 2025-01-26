import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import IconButton from "./components/IconButton";
import Button from "./components/Button";
import { copySvgToClipboard } from "./imageUtils";

function DiagramView({ svg, closeDialog }) {
  const imageRef = useRef(null);
  useEffect(() => {
    if (svg) {
      imageRef.current.innerHTML = svg;
    }
  }, [svg]);

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-2 p-2 rounded-xl h-full w-full bg-slate-400 relative">
        <p className="font-extrabold text-3xl">Diagram</p>
        <div className="overflow-auto w-full flex-grow flex flex-col items-center justify-center border-2 border-gray-300 rounded-md">
          <div className="h-full p-2 select-none" ref={imageRef}></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={closeDialog} theme="green">
            Close
          </Button>
          <IconButton
            onClick={() => copySvgToClipboard(svg)}
            iconName={"content_copy"}
            theme="green"
          />
        </div>
        <span
          className="absolute right-2 material-symbols-outlined text-2xl flex items-center justify-center cursor-pointer"
          onClick={closeDialog}
        >
          close
        </span>
      </div>
    </>
  );
}

DiagramView.propTypes = {
  svg: PropTypes.string.isRequired,
  closeDialog: PropTypes.func.isRequired,
};

export default DiagramView;
