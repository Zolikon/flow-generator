export function useElectron() {
  function query(event, onResponse) {
    window.electron.ipcRenderer.once(event, (_, response) => {
      onResponse(response);
    });
    window.electron.ipcRenderer.send(event);
  }

  return {
    electron: window.electron,
    eventBus: { ...window.electron.ipcRenderer, query },
  };
}
