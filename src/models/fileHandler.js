const fsPromises = require('fs').promises;
const fsOriginal = require('fs');
const path = require('path');

/**
 * Cria um diretório, incluindo diretórios pai, se necessário.
 * @param {string} directoryPath - O caminho do diretório a ser criado.
 * @returns {Promise<void>} - Uma Promise que resolve quando o diretório é criado.
 */
async function createDirectory(directoryPath) {
    await fsPromises.mkdir(directoryPath, { recursive: true });
}

/**
 * Deleta um arquivo, ignorando erros se o arquivo não existir.
 * @param {string} filePath - O caminho do arquivo a ser deletado.
 * @returns {Promise<void>} - Uma Promise que resolve quando o arquivo é deletado.
 */
async function deleteExistingFile(filePath) {
    await fsPromises.unlink(filePath).catch(() => {});
}

/**
 * Copia um arquivo de origem para um destino.
 * @param {string} sourcePath - O caminho do arquivo de origem.
 * @param {string} destinationPath - O caminho do arquivo de destino.
 * @returns {Promise<void>} - Uma Promise que resolve quando a cópia é concluída.
 */
async function copyFile(sourcePath, destinationPath) {
    const readStream = fsOriginal.createReadStream(sourcePath);
    const writeStream = fsOriginal.createWriteStream(destinationPath);

    await new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

/**
 * Faz upload de um arquivo CSV para o diretório 'dados'.
 * @param {Object} file - O objeto de arquivo a ser carregado.
 * @returns {Promise<void>} - Uma Promise que resolve após o upload do arquivo.
 */
async function uploadCsvFile(file) {
    const uploadDir = path.join(__dirname, '..', '..', 'dados');
    const uploadPath = path.join(uploadDir, 'arquivo.csv');

    try {
        await createDirectory(uploadDir);
        await deleteExistingFile(uploadPath);
        await copyFile(file.path, uploadPath);
        handleReload();
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    uploadCsvFile,
};
