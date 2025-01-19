import PropTypes from "prop-types";
import { resolveTheme } from "./themeUtil";

function resolveSize(size) {
  switch (size) {
    case "small":
      return "w-32";
    case "medium":
      return "w-48";
    case "large":
      return "w-64";
    default:
      return "w-64";
  }
}

function Button({
  children,
  onClick,
  theme = "green",
  size = "small",
  disabled = false,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${resolveTheme(theme)}  ${resolveSize(size)} text-white font-bold py-2 px-4 rounded group select-none transition-all duration-200`}
    >
      <div className="flex justify-center items-center w-full h-full group-hover:scale-110 group-disabled:group-hover:scale-100 group-disabled:cursor-default tranistion-all duration-300">
        {children}
      </div>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(["blue", "green", "red", "yellow"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
};

export default Button;
