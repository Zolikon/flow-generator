import PropTypes from "prop-types";
import { useState } from "react";

function PasswordInput({ value, onChange, placeholder = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between relative">
      <input
        type={isVisible ? "text" : "password"}
        className="border-2 border-stone-400 rounded-md p-2 pr-10"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <div className="flex items-center justify-center absolute right-2 h-full cursor-pointer hover:scale-105 select-none">
        <p
          className="material-symbols-outlined"
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? "visibility" : "visibility_off"}
        </p>
      </div>
    </div>
  );
}

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default PasswordInput;
