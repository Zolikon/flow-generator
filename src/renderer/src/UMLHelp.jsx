function UMLHelp() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start gap-2">
      <p className="text-2xl font-extrabold">UML mode</p>
      <p>Generating diagram using plantuml syntax.</p>
      <a
        href="https://plantuml.com/"
        target="_blank"
        rel="noreferrer"
        className="text-xl"
      >
        PlantUML website
      </a>
      <p>Version: v1.2025.0</p>
      <p>Example:</p>
      <textarea
        readOnly
        className="italic p-2 resize-none w-1/3 h-1/3 bg-slate-200 font-bold rounded-md outline-none cursor-default"
        value={`@startuml\na->b:test\n@enduml`}
      ></textarea>
    </div>
  );
}

export default UMLHelp;
