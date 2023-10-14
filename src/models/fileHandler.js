const fs = require('fs').promises;
const fsOriginal = require('fs');
const path = require('path');

async function createDirectory(directoryPath) {
    const fs = require('fs').promises;
    await fs.mkdir(directoryPath, { recursive: true });
}

async function deleteExistingFile(filePath) {
    const fs = require('fs').promises;
    await fs.unlink(filePath).catch(() => {});
}

async function copyFile(sourcePath, destinationPath) {
    const fs = require('fs').promises;
    const fsOriginal = require('fs');
    const readStream = fsOriginal.createReadStream(sourcePath);
    const writeStream = fsOriginal.createWriteStream(destinationPath);

    await new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

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
    createDirectory,
    deleteExistingFile,
    copyFile,
    uploadCsvFile,
};
