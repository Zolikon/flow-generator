import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";
import { useSubscribe } from "./useSubsribe";
import { useElectron } from "./useElectron";

const EditorContext = createContext();

const initialState = {
  diagramSvgString: "",
  isAiEnabled: false,
  file: null,
  isGenerationTypeAi: false,
  isAiGenerationInProgress: false,
  isDiagramGenerationInProgress: false,
  isJavaAvailable: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "updateAiEnabled":
      return { ...state, isAiEnabled: payload };
    case "updateDiagramGenerationInProgress":
      return { ...state, isDiagramGenerationInProgress: payload };
    case "updateAiGenerationInProgress":
      return { ...state, isAiGenerationInProgress: payload };
    case "updateIsGenerationTypeAi":
      return { ...state, isGenerationTypeAi: payload };
    case "updateDiagramSvgString":
      return { ...state, diagramSvgString: payload };
    case "reset":
      return {
        ...state,
        isGenerationTypeAi: false,
        isAiGenerationInProgress: false,
        isDiagramGenerationInProgress: false,
        diagramSvgString: "",
        file: null,
      };
    case "setJavaAvailability":
      return { ...state, isJavaAvailable: payload };
    case "setFile":
      return { ...state, file: payload };
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
    dispatcher({ type: "updateAiGenerationInProgress", payload: false });
    generateUsingUml(uml);
  });

  useSubscribe("diagram:generationStarted", () => {
    dispatcher({ type: "updateDiagramGenerationInProgress", payload: true });
  });

  useSubscribe("diagram:generationCompleted", (svg) => {
    dispatcher({ type: "updateDiagramSvgString", payload: svg });
    dispatcher({ type: "updateDiagramGenerationInProgress", payload: false });
    dispatcher({ type: "updateIsGenerationTypeAi", payload: false });
  });

  useSubscribe("diagram:generationFailed", () => {
    dispatcher({ type: "updateDiagramGenerationInProgress", payload: false });
  });

  useSubscribe("app:javaAvailable", (isJavaAvailabley) => {
    dispatcher({ type: "setJavaAvailability", payload: isJavaAvailabley });
  });

  const reset = function () {
    eventBus.send("reset");
    dispatcher({ type: "reset" });
  };

  const generateUsingUml = function (uml) {
    dispatcher({ type: "updateDiagramGenerationInProgress", payload: true });
    eventBus.send("diagram:generate", uml);
  };

  const generateUsingAi = function (prompt, uml) {
    dispatcher({ type: "updateAiGenerationInProgress", payload: true });
    dispatcher({ type: "updateIsGenerationTypeAi", payload: true });
    eventBus.send("ai:generate", {
      prompt,
      uml,
      attachment: currentValue.file?.path,
    });
  };

  const setFile = function (file) {
    dispatcher({ type: "setFile", payload: file });
  };

  return (
    <EditorContext.Provider
      value={{
        ...currentValue,
        isGenerationInProgress:
          currentValue.isAiGenerationInProgress ||
          currentValue.isDiagramGenerationInProgress,
        generateUsingAi,
        generateUsingUml,
        reset,
        setFile,
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
