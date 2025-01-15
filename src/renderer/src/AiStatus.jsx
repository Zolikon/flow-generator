import { useRef, useState } from "react";
import { useEditor } from "./EditorContext";
import { useElectron } from "./useElectron";
import Button from "./components/Button";
import PasswordInput from "./components/PasswordInput";

function AiStatus() {
  const { isAiEnabled } = useEditor();
  const [initialApiKey, setInitialApiKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const dialogRef = useRef(null);

  const { eventBus } = useElectron();

  function openDialog() {
    eventBus.query("query:getAiApiKey", (key) => {
      setApiKey(key);
      setInitialApiKey(key);
      dialogRef.current.showModal();
    });
  }

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  function saveApiKey() {
    eventBus.send("ai:setAiApiKey", apiKey);
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
        <img src="/ai.svg" alt="AI" />
      </span>
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="w-1/3 h-1/3 rounded-lg m-auto p-2"
      >
        <div className="h-full w-full flex flex-col items-center justify-between">
          <p className="font-extrabold text-2xl">
            {initialApiKey ? "Update API Key" : "Configure API Key"}
          </p>
          <PasswordInput
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key"
          />
          <div className="flex gap-2">
            <Button onClick={saveApiKey} disabled={!apiKey}>
              Save
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
