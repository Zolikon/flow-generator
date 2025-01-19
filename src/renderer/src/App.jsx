import { useElectron } from "./useElectron";
import Button from "./components/Button";
import { useEffect, useRef, useState } from "react";
import AiStatus from "./AiStatus";
import { useEditor } from "./EditorContext";
import DiagramView from "./DiagramView";
import ResetButton from "./components/ResetButton";
import CollapsibleInput from "./components/CollapsibleInput";

function App() {
  const { eventBus } = useElectron();
  const [editorMode, setEditorMode] = useState("uml");
  const {
    isAiEnabled,
    updateUmlCode,
    updatePrompt,
    reset,
    isGenerationInProgress,
    diagramSvgString,
    umlCode,
    isJavaAvailable,
  } = useEditor();
  const [prompt, setPrompt] = useState("");
  const [currentUmlCode, setCurrentUmlCode] = useState(umlCode || "");
  const imageRef = useRef(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (diagramSvgString) {
      imageRef.current.innerHTML = diagramSvgString;
    }
  }, [diagramSvgString]);

  function generateDiagram() {
    updateUmlCode(currentUmlCode);
    eventBus.send("diagram:generate", `@startuml\n${currentUmlCode}\n@enduml`);
  }

  function generateAiDiagram() {
    updatePrompt(prompt);
    eventBus.send("ai:generate", prompt);
  }

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };
  const closeDialog = () => {
    dialogRef.current.close();
  };

  const resetEditor = () => {
    setCurrentUmlCode("");
    setPrompt("");
    reset();
    if (imageRef.current) {
      imageRef.current.innerHTML = "";
    }
  };

  return (
    <>
      <div className="w-[100%] h-[100%] flex flex-col items-center justify-center gap-2 p-2 bg-gradient-to-br from-blue-600 to-blue-300">
        {!isJavaAvailable && (
          <p className="w-[100vw] text-stone-800 bg-red-500 text-2xl text-center p-2">
            Java is not available, install Java and restart
          </p>
        )}
        <div className="flex gap-2 w-full h-full items-center justify-center">
          {!isAiEnabled && (
            <CollapsibleInput
              title="UML mode"
              value={currentUmlCode}
              setValue={setCurrentUmlCode}
              collapseDisabled
            />
          )}
          {isAiEnabled && (
            <div className="flex w-[90%] h-full gap-3">
              <CollapsibleInput
                title="AI mode"
                value={prompt}
                setValue={setPrompt}
                isCollapsed={editorMode === "uml"}
                setIsCollapsed={() => {
                  setEditorMode("ai");
                }}
              />
              <CollapsibleInput
                title="UML mode"
                value={currentUmlCode}
                setValue={setCurrentUmlCode}
                isCollapsed={editorMode === "ai"}
                setIsCollapsed={() => {
                  setEditorMode("uml");
                }}
              />
            </div>
          )}
          {isJavaAvailable && (
            <div className="flex flex-col items-center gap-2 w-1/3 h-full">
              <div className="h-1/2 w-full flex flex-col items-center justify-center gap-2 overflow-auto">
                <p className="font-extrabold text-2xl">Preview</p>
                {diagramSvgString && (
                  <div
                    className="overflow-auto max-h-[80%] flex-grow w-full flex flex-col items-center justify-center border-2 border-gray-300 rounded-md cursor-zoom-in relative"
                    onClick={() => dialogRef.current.showModal()}
                  >
                    <div ref={imageRef}></div>
                  </div>
                )}
              </div>
              <Button
                onClick={
                  editorMode === "uml" ? generateDiagram : generateAiDiagram
                }
                theme="blue"
                disabled={
                  isGenerationInProgress ||
                  (editorMode === "ai" && !prompt) ||
                  (editorMode === "uml" && !currentUmlCode)
                }
              >
                <p>{editorMode.toUpperCase()}</p>
                <p className="material-symbols-outlined px-2 text-sm">
                  refresh
                </p>
              </Button>
              <ResetButton onClick={resetEditor} />
            </div>
          )}
        </div>
      </div>
      <AiStatus />

      <dialog
        ref={dialogRef}
        className="rounded-xl h-[80%] w-[80%]"
        onClick={handleBackdropClick}
      >
        {diagramSvgString && (
          <DiagramView svg={diagramSvgString} closeDialog={closeDialog} />
        )}
      </dialog>
    </>
  );
}

export default App;
