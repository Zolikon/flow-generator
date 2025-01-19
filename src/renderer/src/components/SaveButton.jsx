import PropTypes from "prop-types";
import Button from "./Button";

function SaveButton({ title, content, type = "json" }) {
  function isJsonType() {
    return type === "json";
  }

  const handleButtonClick = () => {
    const options = {
      suggestedName: isJsonType() ? "diagram.json" : "diagram.svg",
      types: [
        {
          description: isJsonType() ? title + " diagram" : "Svg image",
          accept: isJsonType()
            ? {
                "application/json": [".json"],
              }
            : {
                "image/svg+xml": [".svg"],
              },
        },
      ],
    };

    window
      .showSaveFilePicker(options)
      .then((fileHandle) => fileHandle.createWritable())
      .then((fileWritable) => {
        const writer = fileWritable.getWriter();
        writer.write(isJsonType() ? JSON.stringify(content, null, 2) : content);
        writer.close();
      })
      .catch(() => {
        //ignore
      });
  };

  return (
    <>
      <Button onClick={handleButtonClick} theme="blue" size="medium">
        <p>{title}</p>
        <span className="material-symbols-outlined px-2">save</span>
      </Button>
    </>
  );
}

SaveButton.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  type: PropTypes.oneOf(["json", "svg"]),
};

export default SaveButton;
