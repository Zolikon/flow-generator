import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { useEditor } from "../EditorContext";

function FileInput() {
  const { file, setFile } = useEditor();
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="flex gap-4 items-center">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file.size > 5000000) {
            setError("File size should be less than 5MB");
            return;
          }
          setFile(file);
        }}
      />
      {file ? (
        <>
          <Button
            className="btn"
            onClick={() => {
              setFile(null);
              fileInputRef.current.value = null;
            }}
          >
            Remove
          </Button>
          <span className="font-bold text-2xl">{file.name}</span>
          <span className="text-xl">
            ~({(file.size / 1024).toFixed(2)} Kbytes)
          </span>
          <span className="text-xl">
            Estimated {(file.size / 4).toFixed()} tokens
          </span>
        </>
      ) : (
        <>
          <Button
            className="btn"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            Attach File
          </Button>
          {error && <span className="text-red-500 text-2xl">{error}</span>}
        </>
      )}
    </div>
  );
}

export default FileInput;
