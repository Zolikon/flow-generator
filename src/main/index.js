import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { optimizer } from "@electron-toolkit/utils";
import { createWindow, isJavaInstalled } from "./utils";
import plantuml from "./platinum_local";
import Store from "electron-store";
import { callChatGPT, setupOpenAI, testAiConnection } from "./ai_client";

let mainWindow;
const store = new Store();
let aiApiKey = store.get("aiApiKey", "");
if (aiApiKey) {
  setupOpenAI(aiApiKey);
}

app.whenReady().then(() => {
  mainWindow = createWindow();
  mainWindow.on("ready-to-show", () => {
    mainWindow.setTitle("Flow generator " + app.getVersion());
    if (process.env.NODE_ENV !== "development") {
      Menu.setApplicationMenu(null);
    }
    mainWindow.send("app:javaAvailable", isJavaInstalled());
    mainWindow.send("ai:ready", !!aiApiKey);
  });

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on("query:getAiApiKey", () => {
    mainWindow.send("query:getAiApiKey", aiApiKey);
  });

  ipcMain.on("query:isAiWorking", (event, { key }) => {
    testAiConnection(key)
      .then((result) => {
        mainWindow.send("query:isAiWorking", result);
      })
      .catch(() => {
        mainWindow.send("query:isAiWorking", false);
      });
  });

  ipcMain.on("ai:setAiApiKey", (_, key) => {
    aiApiKey = key;
    store.set("aiApiKey", key);
    if (key) {
      setupOpenAI(key);
    }
    mainWindow.send("ai:ready", !!key);
  });

  ipcMain.on("ai:generate", (event, message) => {
    mainWindow.send("diagram:generationStarted");
    message = message.prompt.replaceAll(
      "${diagram}",
      `\n\`\`\`plantml\n${message.uml}\n\`\`\`\n`,
    );

    callChatGPT(message)
      .then((result) => mainWindow.send("ai:generationCompleted", result))
      .catch((err) => {
        console.error("error", err);
        mainWindow.send("ai:generationFailed", "error");
      });
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
