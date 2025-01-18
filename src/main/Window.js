import { app, BrowserWindow } from "electron";

export class Window extends BrowserWindow {
  constructor(options) {
    super({
      width: 900,
      height: 670,
      show: false,
      title: "Flow generator",
      webPreferences: {
        preload: `${__dirname}/../preload/index.js`,
        sandbox: false,
      },
      ...options,
    });
  }
  send(message, data) {
    this.webContents.send(message, data);
  }
}
