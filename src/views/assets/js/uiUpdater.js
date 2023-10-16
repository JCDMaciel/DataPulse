/**
 * Atualiza os elementos da interface do usuário com os valores fornecidos.
 * @param {number} totalItensNoMes - O total de itens no mês.
 * @param {number} averageItemsPerDay - A média de itens por dia.
 * @param {string} userName - O nome do usuário que está sendo analisado.
 * @param {number} totalItensReprovadosNoMes - O total de itens reprovados no mês.
 * @param {number} mediaItensReprovadosNoMes - A média de itens reprovados por dia.
 */
function updateUI(totalItensNoMes, averageItemsPerDay, userName, totalItensReprovadosNoMes, mediaItensReprovadosNoMes) {
    updateElementText('totalItensNoMes', totalItensNoMes.toString());
    updateElementText('mediaItensPorDia', averageItemsPerDay.toFixed(2));
    updateElementText('userName', userName);
    updateElementText('totalItensReprovadosNoMes', totalItensReprovadosNoMes.toString());
    updateElementText('mediaItensReprovadosNoMes', mediaItensReprovadosNoMes.toFixed(2));
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
function abrirLinkExterno() {
    const url = 'https://grupoitss.visualstudio.com/DocNix%20Corporate/_queries/query/?tempQueryId=47c0df63-29c4-4d86-90ee-a5b1f80d5ce2';
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
    abrirLinkExterno, //chamado direto no html
    handleReload, //chamado direto no html
};
