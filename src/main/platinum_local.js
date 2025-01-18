const getStream = require("get-stream");
const execa = require("execa");
const { join } = require("path");
// import jar from "../../resources/plantuml.jar?asset";

const findComments = (text) => text.match(/<!--(.*?)-->/gms);

const jarPath = () => {
  if (process.env.NODE_ENV === "development") {
    return join(process.cwd(), "resources", "plantuml.jar");
  } else {
    return join(
      process.resourcesPath,
      "app.asar.unpacked",
      "resources",
      "plantuml.jar",
    );
  }
};

const plantuml = async (uml) => {
  const plantumlJar = jarPath();
  const subprocess = execa("java", [
    "-jar",
    "-Djava.awt.headless=true",
    '--add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax="ALL-UNNAMED"',
    plantumlJar,
    "-tsvg",
    "-pipe",
  ]);

  process.nextTick(() => {
    subprocess.stdin.write(uml);
    subprocess.stdin.end();
  });

  const promise = getStream(subprocess.stderr).then(() =>
    getStream(subprocess.stdout).then((svg) =>
      (findComments(svg) || []).reduce(
        (file, comment) => file.replace(comment, ""),
        svg,
      ),
    ),
  );

  return promise;
};

export default plantuml;
