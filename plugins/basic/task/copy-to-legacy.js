const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

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
    console.log('❌ El directorio dist no existe. Ejecuta npm run build primero.');
    process.exit(1);
  }
  
  // Copiar todo el directorio dist a legacy
  try {
    fsExtra.copySync(distPath, legacyPath, { overwrite: true });
  } catch (error) {
    console.error('❌ Error al copiar archivos:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  copyVersionedFilesToLegacy();
}

module.exports = copyVersionedFilesToLegacy;
