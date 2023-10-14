const { shell, ipcRenderer } = require('electron');

/**
 * Atualiza os elementos da interface do usuário com os valores fornecidos.
 * @param {number} totalItensNoMes - O total de itens no mês.
 * @param {number} averageItemsPerDay - A média de itens por dia.
 */
function updateUI(totalItensNoMes, averageItemsPerDay) {
    updateElementText('totalItensNoMes', totalItensNoMes.toString());
    updateElementText('mediaItensPorDia', averageItemsPerDay.toFixed(2));
}

/**
 * Atualiza o texto de um elemento HTML com base no ID do elemento.
 * @param {string} elementId - O ID do elemento HTML a ser atualizado.
 * @param {string} text - O texto a ser atribuído ao elemento.
 */
function updateElementText(elementId, text) {
    document.getElementById(elementId).textContent = text;
}

/**
 * Abre um link externo no navegador padrão.
 * @param {string} url - A URL do link externo.
 */
function abrirLinkExterno(url) {
    shell.openExternal(url);
}

/**
 * Manipula o evento de recarregar a aplicação.
 */
function handleReload() {
    ipcRenderer.send('reload-app');
}

// Adiciona as funções ao objeto global 'window' para torná-las acessíveis a partir do HTML
window.abrirLinkExterno = abrirLinkExterno;
window.handleReload = handleReload;

module.exports = {
    updateUI,
    abrirLinkExterno,
    handleReload,
};
