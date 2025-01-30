function AIHelp() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
      <p className="text-2xl font-extrabold">AI mode</p>
      <p>
        Generating diagram using OpenAI. Input should be describing a diagram
        type, supported by plantuml
      </p>
      <p>Example:</p>
      <textarea
        readOnly
        className="italic p-2 resize-none w-1/3 h-1/3 bg-slate-200 font-bold rounded-md outline-none cursor-default"
        value={`class digram of a car`}
      ></textarea>
      <span>
        It is possible to reference the digram defined in UML Mode by using the{" "}
        <code className=" italic">{`\${diagram}`}</code> syntax
      </span>
      <p>Example:</p>
      <textarea
        readOnly
        className="italic p-2 resize-none w-1/3 h-1/3 bg-slate-200 font-bold rounded-md outline-none cursor-default"
        value={`In the diagram \${diagram} update title with 'Car Diagram'`}
      ></textarea>
      <span>
        It is also possible to attach a file{" "}
        <code className=" italic">{`\${file}`}</code> syntax
      </span>
      <span>
        If file is attached but not referenced in prompt using{" "}
        <code className=" italic">{`\${file}`}</code>, it will be added to the
        end of the prompt
      </span>
      <p>Example:</p>
      <textarea
        readOnly
        className="italic p-2 resize-none w-1/3 h-1/3 bg-slate-200 font-bold rounded-md outline-none cursor-default"
        value={`Given the following terraform state\n\${file}\ngive me a diagram showing the current status of our infrastructure
each node should contain ARNs `}
      ></textarea>
    </div>
  );
}

export default AIHelp;
