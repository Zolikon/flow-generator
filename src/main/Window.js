import { app, BrowserWindow } from "electron";

export class Window extends BrowserWindow {
  constructor(options) {
    super({
      width: 900,
      height: 670,
      show: false,
      webPreferences: {
        preload: `${__dirname}/../preload/index.js`,
        sandbox: false,
        spellcheck: false,
      },
      ...options,
    });
  }
  send(message, data) {
    this.webContents.send(message, data);
  }
}
