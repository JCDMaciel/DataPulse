function handleReload() {
    ipcRenderer.send('reload-app');
}