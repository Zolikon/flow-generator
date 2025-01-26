export function useElectron() {
  function query(event, onResponse, params = {}) {
    window.electron.ipcRenderer.once(event, (_, response) => {
      onResponse(response);
    });
    window.electron.ipcRenderer.send(event, params);
  }

  return {
    electron: window.electron,
    eventBus: {
      ...window.electron.ipcRenderer,
      query,
    },
  };
}
