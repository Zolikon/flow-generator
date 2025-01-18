import { useElectron } from "./useElectron";
import Button from "./components/Button";
import { useEffect, useRef, useState } from "react";
import AiStatus from "./AiStatus";
import { useEditor } from "./EditorContext";
import DiagramView from "./DiagramView";
import ResetButton from "./components/ResetButton";

function App() {
  const { eventBus } = useElectron();
  const {
    isAiEnabled,
    updateUmlCode,
    updatePrompt,
    reset,
    isGenerationInProgress,
    diagramSvgString,
  } = useEditor();
  const [prompt, setPrompt] = useState("");
  const [currentUmlCode, setCurrentUmlCode] = useState("");
  const imageRef = useRef(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (diagramSvgString) {
      imageRef.current.innerHTML = diagramSvgString;
    }
  }, [diagramSvgString]);

  function generateDiagram() {
    updatePrompt(prompt);
    updateUmlCode(currentUmlCode);
    eventBus.send("diagram:generate", `@startuml\n${currentUmlCode}\n@enduml`);
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
        <div className="flex gap-2 w-full flex-grow items-center justify-center">
          {isAiEnabled && (
            <div className="flex flex-col gap-2 w-1/3 h-full">
              <code className="font-extrabold  text-2xl h-8">
                Generate by AI
              </code>
              <textarea
                disabled={isGenerationInProgress}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-grow p-2 border border-gray-300 bg-slate-600 focus-visible:bg-slate-200 font-bold rounded-md resize-none disabled:opacity-50"
                placeholder="Describe your diagram"
              />
              <code className="font-extrabold text-2xl  h-8"></code>
            </div>
          )}
          <div className="flex flex-col gap-2 w-1/3 h-full">
            <code className="font-extrabold  text-2xl  h-8">@startuml</code>
            <textarea
              disabled={isGenerationInProgress}
              value={currentUmlCode}
              onChange={(e) => setCurrentUmlCode(e.target.value)}
              className="flex-grow p-2 border border-gray-300 bg-slate-600 focus-visible:bg-slate-200 font-bold rounded-md resize-none disabled:opacity-50"
              placeholder="UML code"
            />
            <code className="font-extrabold text-2xl  h-8">@enduml</code>
          </div>
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
              onClick={generateDiagram}
              theme="blue"
              disabled={isGenerationInProgress}
            >
              <p>Generate</p>
              <p className="material-symbols-outlined">check</p>
            </Button>
            <ResetButton onClick={resetEditor} />
          </div>
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
