import { useEditor } from "./EditorContext";

function GenerationStatus() {
  const {
    isGenerationTypeAi,
    isAiGenerationInProgress,
    isDiagramGenerationInProgress,
  } = useEditor();
  return (
    <div className="h-full w-1/2 flex flex-col items-center justify-center gap-2 select-none">
      <p className="text-center text-xl font-bold">Magic is happening...</p>
      {isGenerationTypeAi && (
        <div className="flex items-center justify-between w-full">
          <p>AI trying to understand us</p>
          {isAiGenerationInProgress ? <Spinner /> : <span>✅</span>}
        </div>
      )}
      {isDiagramGenerationInProgress && (
        <div className="flex items-center justify-between w-full">
          <p>Picturing the code</p>
          <Spinner />
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="h-[70%] w-[3px] bg-black animate-spin m-2" />;
}

export default GenerationStatus;
