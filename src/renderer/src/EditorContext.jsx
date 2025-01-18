import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";
import { useSubscribe } from "./useSubsribe";
import { useElectron } from "./useElectron";

const EditorContext = createContext();

const initialState = {
  umlCode: "",
  prompt: "",
  diagramSvgString: "",
  isAiEnabled: false,
  isGenerationInProgress: false,
  isJavaAvailable: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "updateUmlCode":
      return { ...state, umlCode: payload };
    case "updatePrompt":
      return { ...state, prompt: payload };
    case "updateAiEnabled":
      return { ...state, isAiEnabled: payload };
    case "updateGenerationInProgress":
      return { ...state, isGenerationInProgress: payload };
    case "updateDiagramSvgString":
      return { ...state, diagramSvgString: payload };
    case "reset":
      return { ...state, umlCode: "", prompt: "", diagramSvgString: "" };
    case "setJavaAvailability":
      return { ...state, isJavaAvailable: payload };
    default:
      throw new Error();
  }
}

function EditorProvider({ children }) {
  const [currentValue, dispatcher] = useReducer(reducer, initialState);
  const { eventBus } = useElectron();

  useSubscribe("ai:ready", (aiStatus) => {
    dispatcher({ type: "updateAiEnabled", payload: aiStatus });
  });

  useSubscribe("ai:generationCompleted", (uml) => {
    dispatcher({ type: "updateUmlCode", payload: uml });
    eventBus.send("diagram:generate", uml);
  });

  useSubscribe("diagram:generationStarted", () => {
    dispatcher({ type: "updateGenerationInProgress", payload: true });
  });

  useSubscribe("diagram:generationCompleted", (svg) => {
    dispatcher({ type: "updateDiagramSvgString", payload: svg });
    dispatcher({ type: "updateGenerationInProgress", payload: false });
  });

  useSubscribe("diagram:generationFailed", () => {
    dispatcher({ type: "updateGenerationInProgress", payload: false });
  });

  useSubscribe("app:javaAvailable", (isJavaAvailabley) => {
    dispatcher({ type: "setJavaAvailability", payload: isJavaAvailabley });
  });

  const updateUmlCode = function (value) {
    dispatcher({ type: "updateUmlCode", payload: value });
  };

  const updatePrompt = function (value) {
    dispatcher({ type: "updatePrompt", payload: value });
  };

  const reset = function () {
    dispatcher({ type: "reset" });
  };

  return (
    <EditorContext.Provider
      value={{
        ...currentValue,
        updateUmlCode,
        updatePrompt,
        reset,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

EditorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useEditor() {
  return useContext(EditorContext);
}

export { EditorProvider, useEditor };
