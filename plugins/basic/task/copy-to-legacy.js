const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

/**
 * Verifica si un archivo tiene versión en su nombre
 * Patrón: -X.Y.Z. donde X, Y, Z son números
 * @param {string} fileName - Nombre del archivo
 * @returns {boolean} - true si tiene versión, false en caso contrario
 */
function hasVersion(fileName) {
  // Patrón para detectar versión: -X.Y.Z. donde X, Y, Z son números
  const versionPattern = /-\d+\.\d+\.\d+\./;
  return versionPattern.test(fileName);
}

/**
 * Verifica si un archivo .map está asociado a un archivo con versión
 * @param {string} fileName - Nombre del archivo .map
 * @returns {boolean} - true si el archivo base tiene versión
 */
function isMapFileForVersioned(fileName) {
  if (!fileName.endsWith('.map')) {
    return false;
  }
  // Remover la extensión .map para obtener el nombre base
  const baseName = fileName.replace(/\.map$/, '');
  return hasVersion(baseName);
}

/**
 * Verifica si un archivo debe ser copiado a legacy
 * @param {string} fileName - Nombre del archivo
 * @param {string} relativePath - Ruta relativa desde dist
 * @returns {boolean} - true si debe copiarse, false en caso contrario
 */
function shouldCopyFile(fileName, relativePath) {
  // Copiar archivos con versión
  if (hasVersion(fileName)) {
    return true;
  }
  
  // Copiar archivos .map asociados a archivos con versión
  if (isMapFileForVersioned(fileName)) {
    return true;
  }
  
  // Copiar archivos de configuración como api.json
  if (fileName === 'api.json' || (fileName.endsWith('.json') && !fileName.includes('package'))) {
    return true;
  }
  
  // Copiar archivos que están en subdirectorios (como images/, assets/, etc.)
  // Estos no son los archivos compilados principales
  if (relativePath && relativePath !== fileName) {
    return true;
  }
  
  // No copiar archivos sin versión que sean los compilados principales en la raíz
  return false;
}

/**
 * Copia recursivamente archivos con versión de dist a legacy
 * @param {string} srcDir - Directorio origen
 * @param {string} destDir - Directorio destino
 * @param {string} distRoot - Ruta raíz del directorio dist
 */
function copyVersionedFilesRecursive(srcDir, destDir, distRoot) {
  const items = fs.readdirSync(srcDir);
  
  items.forEach((item) => {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      // Si es un directorio, crearlo y copiar recursivamente
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyVersionedFilesRecursive(srcPath, destPath, distRoot);
    } else if (stats.isFile()) {
      // Calcular la ruta relativa desde dist
      const relativePath = path.relative(distRoot, srcPath);
      
      // Si es un archivo, verificar si debe copiarse
      if (shouldCopyFile(item, relativePath)) {
        fsExtra.copySync(srcPath, destPath, { overwrite: true });
      }
    }
  });
}

/**
 * Script para copiar archivos con versión de dist a legacy
 */
function copyVersionedFilesToLegacy() {
  const distPath = path.resolve(__dirname, '..', 'dist');
  const legacyPath = path.resolve(__dirname, '..', 'legacy');
    
  // Crear directorio legacy si no existe
  if (!fs.existsSync(legacyPath)) {
    fs.mkdirSync(legacyPath, { recursive: true });
  }
  
  // Verificar que dist existe
  if (!fs.existsSync(distPath)) {
    console.log('Error:El directorio dist no existe. Ejecuta npm run build primero.');
    process.exit(1);
  }
  
  // Copiar solo archivos con versión
  try {
    copyVersionedFilesRecursive(distPath, legacyPath, distPath);
  } catch (error) {
    console.error('Error al copiar archivos:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  copyVersionedFilesToLegacy();
}

module.exports = copyVersionedFilesToLegacy;
