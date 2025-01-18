import { app, BrowserWindow, ipcMain } from "electron";
import { optimizer } from "@electron-toolkit/utils";
import { createWindow } from "./utils";
import plantuml from "./platinum_local";
import Store from "electron-store";

let mainWindow;
const store = new Store();
let aiApiKey = store.get("aiApiKey", "");

app.whenReady().then(() => {
  mainWindow = createWindow();

  mainWindow.on("ready-to-show", () => {
    mainWindow.send("ai:ready", !!aiApiKey);
  });

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on("query:getAiApiKey", () => {
    mainWindow.send("query:getAiApiKey", aiApiKey);
  });

  ipcMain.on("ai:setAiApiKey", (_, key) => {
    aiApiKey = key;
    store.set("aiApiKey", key);
    mainWindow.send("ai:ready", !!key);
  });

  ipcMain.on("diagram:generate", (event, message) => {
    mainWindow.send("diagram:generationStarted");
    plantuml(message)
      .then((result) => {
        mainWindow.send("diagram:generationCompleted", result);
      })
      .catch((err) => {
        console.error("error", err);
        mainWindow.send("diagram:generationFailed", "error");
      });
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
