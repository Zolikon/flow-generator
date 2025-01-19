import { shell } from "electron";
import { Window } from "./Window";
import { is } from "@electron-toolkit/utils";
import { join } from "path";
import { execSync } from "child_process";

export function createWindow() {
  const mainWindow = new Window();

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
  return mainWindow;
}

export function resolveResourcePath(fileName) {
  if (process.env.NODE_ENV === "development") {
    return join(process.cwd(), "resources", fileName);
  } else {
    return join(
      process.resourcesPath,
      "app.asar.unpacked",
      "resources",
      fileName,
    );
  }
}

export function isJavaInstalled() {
  try {
    execSync("java -version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}
