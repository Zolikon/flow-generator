import { HashLoader } from "react-spinners";
import { useEditor } from "./EditorContext";

function GenerationStatus() {
  const {
    isGenerationTypeAi,
    isAiGenerationInProgress,
    isDiagramGenerationInProgress,
  } = useEditor();
  return (
    <div className="h-full w-1/2 flex flex-col items-center justify-center gap-2 select-none text-sm">
      <p className="text-center text-xl font-bold h-[50px]">
        Magic is happening...
      </p>
      {isGenerationTypeAi && (
        <div className="flex items-center justify-between w-full">
          <p className=" whitespace-nowrap">AI</p>
          {isAiGenerationInProgress ? (
            <HashLoader size={25} />
          ) : (
            <span>✅</span>
          )}
        </div>
      )}
      {isDiagramGenerationInProgress && !isAiGenerationInProgress && (
        <div className="flex items-center justify-between w-full h-[50px]">
          <p className=" whitespace-nowrap">Diagram</p>
          <HashLoader size={25} />
        </div>
      )}
    </div>
  );
}

export default GenerationStatus;
