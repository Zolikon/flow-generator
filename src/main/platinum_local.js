import { resolveResourcePath } from "./utils";

const getStream = require("get-stream");
const execa = require("execa");

const findComments = (text) => text.match(/<!--(.*?)-->/gms);

const plantuml = async (uml) => {
  const subprocess = execa("java", [
    "-jar",
    "-Djava.awt.headless=true",
    resolveResourcePath("plantuml.jar"),
    "-tsvg",
    "-pipe",
  ]);

  process.nextTick(() => {
    subprocess.stdin.write(uml);
    subprocess.stdin.end();
  });

  const promise = getStream(subprocess.stderr).then((err) => {
    if (err) {
      console.error("error", err);
    }
    return getStream(subprocess.stdout).then((svg) =>
      (findComments(svg) || []).reduce(
        (file, comment) => file.replace(comment, ""),
        svg,
      ),
    );
  });

  return promise;
};

export default plantuml;
