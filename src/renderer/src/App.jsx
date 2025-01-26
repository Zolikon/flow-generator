import Button from "./components/Button";
import { useEffect, useRef, useState } from "react";
import AiStatus from "./AiStatus";
import { useEditor } from "./EditorContext";
import DiagramView from "./DiagramView";
import ResetButton from "./components/ResetButton";
import CollapsibleInput from "./components/CollapsibleInput";
import { useSubscribe } from "./useSubsribe";
import GenerationStatus from "./GenerationStatus";
import UMLHelp from "./UMLHelp";
import AIHelp from "./AIHelp";
import SaveButton from "./components/SaveButton";
import LoadButton from "./components/LoadButton";

function App() {
  const [editorMode, setEditorMode] = useState("uml");
  const {
    isAiEnabled,
    reset,
    isGenerationInProgress,
    diagramSvgString,
    isJavaAvailable,
    generateUsingAi,
    generateUsingUml,
  } = useEditor();
  const [prompt, setPrompt] = useState("");
  const [promptForPreviousGeneration, setPromptForPreviousGeneration] =
    useState(prompt);
  const [currentUmlCode, setCurrentUmlCode] = useState("");
  const [umlForPreviousGeneration, setUmlForPreviousGeneration] =
    useState(currentUmlCode);
  const imageRef = useRef(null);

  const dialogRef = useRef(null);

  useSubscribe("ai:generationCompleted", (diagram) => {
    setCurrentUmlCode(diagram);
  });

  useSubscribe("diagram:generationCompleted", () => {
    setPromptForPreviousGeneration(prompt);
    setUmlForPreviousGeneration(currentUmlCode);
  });

  useEffect(() => {
    if (diagramSvgString) {
      imageRef.current.innerHTML = diagramSvgString;
    }
  }, [diagramSvgString]);

  function generateDiagram() {
    generateUsingUml(currentUmlCode);
  }

  function updatePrompt(value) {
    setPrompt(value);
  }

  function updateUml(value) {
    setCurrentUmlCode(value);
  }

  function generateAiDiagram() {
    generateUsingAi(prompt, currentUmlCode);
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
    setPromptForPreviousGeneration("");
    setUmlForPreviousGeneration("");
    setPrompt("");
    reset();
    if (imageRef.current) {
      imageRef.current.innerHTML = "";
    }
  };

  const loadFromFlowFile = (input) => {
    resetEditor();
    const json = JSON.parse(input);
    setCurrentUmlCode(json.uml ? json.uml.join("\n") : "");
    setPrompt(json.prompt ? json.prompt.join("\n") : "");
    setPromptForPreviousGeneration("");
    setUmlForPreviousGeneration("");
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
              key="uml_no_ai"
              title="UML mode"
              value={currentUmlCode}
              setValue={updateUml}
              collapseDisabled
              help={<UMLHelp />}
              executeOnCtrlEnter={generateDiagram}
            />
          )}
          {isAiEnabled && (
            <div className="flex w-[90%] h-full gap-3">
              <CollapsibleInput
                key="ai"
                title="AI mode"
                value={prompt}
                setValue={updatePrompt}
                disabled={isGenerationInProgress}
                changedSinceGeneration={prompt !== promptForPreviousGeneration}
                isCollapsed={editorMode === "uml"}
                triggerOpen={() => {
                  setEditorMode("ai");
                }}
                triggerCollapse={() => {
                  setEditorMode("uml");
                }}
                help={<AIHelp />}
                executeOnCtrlEnter={generateAiDiagram}
              >
                <span className="h-[90%] w-10 m-2 flex items-center justify-center hover:bg-slate-400 rounded-md cursor-pointer">
                  UML
                </span>
              </CollapsibleInput>
              <CollapsibleInput
                key="uml_with_ai"
                title="UML mode"
                value={currentUmlCode}
                setValue={updateUml}
                disabled={isGenerationInProgress}
                changedSinceGeneration={
                  currentUmlCode !== umlForPreviousGeneration
                }
                isCollapsed={editorMode === "ai"}
                triggerOpen={() => {
                  setEditorMode("uml");
                }}
                triggerCollapse={() => {
                  setEditorMode("ai");
                }}
                help={<UMLHelp />}
                executeOnCtrlEnter={generateDiagram}
              />
            </div>
          )}
          {isJavaAvailable && (
            <div className="flex flex-col items-center gap-2 w-1/3 h-full">
              <div className="h-1/2 w-full flex flex-col items-center justify-center gap-2 overflow-auto">
                {isGenerationInProgress ? (
                  <GenerationStatus />
                ) : (
                  <>
                    <p className="font-extrabold text-2xl">
                      {diagramSvgString ? "Preview" : "No generated diagram"}
                    </p>
                    {diagramSvgString && (
                      <div
                        className="overflow-auto max-h-[80%] flex-grow w-full flex flex-col items-center justify-center border-2 border-gray-300 rounded-md cursor-zoom-in relative"
                        onClick={() => dialogRef.current.showModal()}
                      >
                        <div
                          className="h-full p-2 select-none"
                          ref={imageRef}
                        ></div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <LoadButton loader={loadFromFlowFile} />
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

              <ResetButton
                onClick={resetEditor}
                disabled={
                  isGenerationInProgress ||
                  (!currentUmlCode && !prompt && !diagramSvgString)
                }
              />
              {diagramSvgString && (
                <div className="flex flex-col gap-2 m-auto items-center justify-center border-2 border-gray-300 rounded-md p-2 bg-slate-300">
                  <SaveButton title="UML" content={{ uml: currentUmlCode }} />
                  <SaveButton
                    title="Prompt + UML"
                    content={{ uml: currentUmlCode, prompt }}
                  />
                  <SaveButton
                    title="SVG"
                    content={diagramSvgString}
                    type="svg"
                  />
                </div>
              )}
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
