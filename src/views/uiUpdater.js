
function updateUI(totalItensNoMes, averageItemsPerDay) {
    document.getElementById('totalItensNoMes').textContent = totalItensNoMes.toString();
    document.getElementById('mediaItensPorDia').textContent = averageItemsPerDay.toFixed(2);
}

function abrirLinkExterno() {
    const url = 'https://grupoitss.visualstudio.com/DocNix%20Corporate/_queries/query/?tempQueryId=f76e0957-bfbb-4f82-aeb2-bfee85b4d37b';
    shell.openExternal(url);
}

function handleReload() {
    ipcRenderer.send('reload-app');
}

window.abrirLinkExterno = abrirLinkExterno;
window.handleReload = handleReload;

module.exports = {
    updateUI,
};
