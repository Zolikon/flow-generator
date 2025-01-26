import PropTypes from "prop-types";
import Button from "./Button";
import { useRef } from "react";

function LoadButton({ loader }) {
  const inputRef = useRef(null);
  return (
    <>
      <Button
        onClick={() => {
          inputRef.current.value = "";
          inputRef.current.click();
        }}
        theme="blue"
        size="medium"
      >
        <p>Load</p>
        <span className="material-symbols-outlined px-2">cloud_download</span>
      </Button>
      <input
        type="file"
        accept=".flow"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result;
            loader(text);
          };
          reader.readAsText(file);
        }}
      />
    </>
  );
}

LoadButton.propTypes = {
  loader: PropTypes.func.isRequired,
};

export default LoadButton;
