import { useEffect, useRef, useState } from "react";
import { useEditor } from "./EditorContext";
import { useElectron } from "./useElectron";
import Button from "./components/Button";
import PasswordInput from "./components/PasswordInput";

function AiStatus() {
  const { isAiEnabled } = useEditor();
  const [initialApiKey, setInitialApiKey] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [testedApiKey, setTestedApiKey] = useState("");
  const [aiCheckInProgress, setAiCheckInProgress] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const dialogRef = useRef(null);

  const { eventBus } = useElectron();

  useEffect(() => {
    if (apiKey === testedApiKey) {
      setIsWorking(true);
    } else {
      setIsWorking(false);
    }
  }, [apiKey, testedApiKey]);

  function openDialog() {
    eventBus.query("query:getAiApiKey", (key) => {
      setApiKey(key);
      setTestedApiKey(key);
      setInitialApiKey(key);
      dialogRef.current.showModal();
    });
  }

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  function startAiTest() {
    setIsWorking(false);
    setAiCheckInProgress(true);
    eventBus.query(
      "query:isAiWorking",
      (isWorking) => {
        console.log("isWorking", isWorking);
        setIsWorking(isWorking);
        setAiCheckInProgress(false);
        if (isWorking) {
          setTestedApiKey(apiKey);
        }
      },
      { key: apiKey },
    );
  }

  function saveApiKey() {
    eventBus.send("ai:setAiApiKey", apiKey);
    setApiKey("");
    dialogRef.current.close();
  }

  function deleteApiKey() {
    eventBus.send("ai:setAiApiKey", "");
    setApiKey("");
    dialogRef.current.close();
  }

  function closeDialog() {
    setApiKey("");
    dialogRef.current.close();
  }

  return (
    <>
      <span
        className={`fixed flex items-center justify-center bottom-4 right-4 select-none rounded-full size-16 border-2 border-stone-400 cursor-pointer hover:scale-110 transition-all duration-500 ${isAiEnabled ? "bg-green-500" : "bg-red-500"}`}
        onClick={openDialog}
      >
        <img src="ai.svg" alt="AI" />
      </span>
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="w-[50vw] lg:w-[33vw] h-[50vh] rounded-lg m-auto p-2"
      >
        <div className="h-full w-full flex flex-col items-center justify-between">
          <p className="font-extrabold text-2xl">
            {initialApiKey ? "Update API Key" : "Configure API Key"}
          </p>
          <p>Add an OpenAi api key to enable AI features</p>
          <div className="flex flex-col items-center gap-2">
            <PasswordInput
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
            />
            <div className="flex items-center gap-2">
              <p>Key status</p>
              <span className="material-symbols-outlined ">
                {isWorking ? "check" : "cancel"}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-col lg:flex-row">
            {isWorking ? (
              <Button onClick={saveApiKey} disabled={!apiKey}>
                Save
              </Button>
            ) : (
              <Button
                disabled={!apiKey || aiCheckInProgress}
                onClick={startAiTest}
              >
                {aiCheckInProgress ? "Testing..." : "Test"}
              </Button>
            )}
            <Button onClick={deleteApiKey} disabled={!apiKey} theme="yellow">
              <span className="material-symbols-outlined">delete</span>
            </Button>
            <Button onClick={closeDialog} theme="red">
              Cancel
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default AiStatus;
