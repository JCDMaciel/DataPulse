const fs = require('fs');
const path = require('path');

function handleUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        console.log('Arquivo selecionado!' + file.name);
        processUpload(file);
    } else {
        console.log('Nenhum arquivo selecionado!');
    }
}

function processUpload(file) {
    const dadosPath = path.join(__dirname, '..', 'dados');
    const arquivoAntigo = path.join(dadosPath, 'arquivo.csv');

    deleteOldFile(arquivoAntigo);
    moveAndRenameFile(file, dadosPath);

    console.log('Novo arquivo adicionado como arquivo.csv.');
}

function deleteOldFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Arquivo antigo deletado.');
    }
}

function moveAndRenameFile(file, targetPath) {
    const novoArquivo = generateNewFilePath(targetPath);

    createDirectoryIfNotExists(targetPath);

    copyFileAndDeleteOriginal(file.path, novoArquivo);
}

function generateNewFilePath(targetPath) {
    return path.join(targetPath, 'arquivo.csv');
}

function createDirectoryIfNotExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function copyFileAndDeleteOriginal(sourcePath, destinationPath) {
    fs.copyFileSync(sourcePath, destinationPath);
}

function handleReload() {
    ipcRenderer.send('reload-app');
}
