import { app, BrowserWindow } from "electron";

export class Window extends BrowserWindow {
  constructor(options) {
    super({
      width: 1200,
      height: 800,
      show: false,
      webPreferences: {
        preload: `${__dirname}/../preload/index.js`,
        sandbox: false,
        spellcheck: false,
        devTools: process.env.NODE_ENV === "development",
      },
      ...options,
    });
  }
  send(message, data) {
    this.webContents.send(message, data);
  }
}
