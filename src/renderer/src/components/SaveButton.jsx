import PropTypes from "prop-types";
import Button from "./Button";

function SaveButton({ title, content, type = "flow" }) {
  function isFlowType() {
    return type === "flow";
  }

  const handleButtonClick = () => {
    const options = {
      suggestedName: isFlowType() ? "diagram.flow" : "diagram.svg",
      types: [
        {
          description: isFlowType() ? title + " diagram" : "Svg image",
          accept: isFlowType()
            ? {
                "application/json": [".flow"],
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
        if (isFlowType()) {
          content.uml = content.uml ? content.uml.split("\n") : [];
          content.prompt = content.prompt ? content.prompt.split("\n") : [];
        }
        writer.write(isFlowType() ? JSON.stringify(content, null, 2) : content);
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
  type: PropTypes.oneOf(["flow", "svg"]),
};

export default SaveButton;
