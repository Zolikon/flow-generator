const getStream = require("get-stream");
const execa = require("execa");
import jar from "../../resources/plantuml.jar?asset";

const findComments = (text) => text.match(/<!--(.*?)-->/gms);

const plantuml = async (uml) => {
  const plantumlJar = jar;
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

  const promise = getStream(subprocess.stdout).then((svg) =>
    (findComments(svg) || []).reduce(
      (file, comment) => file.replace(comment, ""),
      svg,
    ),
  );

  return promise;
};

export default plantuml;
