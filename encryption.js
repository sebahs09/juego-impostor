// Sistema de Encriptación para Datos de Usuario
class EncryptionSystem {
    constructor() {
        // CLAVE SECRETA - CAMBIAR ESTO POR TU PROPIA CLAVE
        // Esta clave debe ser conocida solo por el administrador
        this.secretKey = 'MI_CLAVE_SECRETA_SUPER_SEGURA_2025';
    }

    // Encriptar texto usando AES simple (simulado con Base64 + XOR)
    encrypt(text) {
        if (!text) return '';
        
        try {
            const jsonString = typeof text === 'string' ? text : JSON.stringify(text);
            let encrypted = '';
            
            for (let i = 0; i < jsonString.length; i++) {
                const charCode = jsonString.charCodeAt(i);
                const keyChar = this.secretKey.charCodeAt(i % this.secretKey.length);
                const encryptedChar = String.fromCharCode(charCode ^ keyChar);
                encrypted += encryptedChar;
            }
            
            // Convertir a Base64 para almacenamiento seguro
            return btoa(encrypted);
        } catch (e) {
            console.error('Error al encriptar:', e);
            return '';
        }
    }

    // Desencriptar texto
    decrypt(encryptedText) {
        if (!encryptedText) return null;
        
        try {
            // Decodificar de Base64
            const decoded = atob(encryptedText);
            let decrypted = '';
            
            for (let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i);
                const keyChar = this.secretKey.charCodeAt(i % this.secretKey.length);
                const decryptedChar = String.fromCharCode(charCode ^ keyChar);
                decrypted += decryptedChar;
            }
            
            return JSON.parse(decrypted);
        } catch (e) {
            console.error('Error al desencriptar (clave incorrecta?):', e);
            return null;
        }
    }

    // Guardar datos encriptados en localStorage
    saveEncrypted(key, data) {
        const encrypted = this.encrypt(data);
        localStorage.setItem(key, encrypted);
    }

    // Leer datos encriptados de localStorage
    loadEncrypted(key) {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return this.decrypt(encrypted);
    }

    // Verificar si la clave secreta es correcta
    verifyKey(testKey) {
        return testKey === this.secretKey;
    }

    // Cambiar la clave secreta (PELIGROSO - solo usar si sabes lo que haces)
    changeSecretKey(oldKey, newKey) {
        if (oldKey !== this.secretKey) {
            throw new Error('Clave anterior incorrecta');
        }

        // Re-encriptar todos los datos con la nueva clave
        const users = this.loadEncrypted('users_encrypted');
        const currentUser = this.loadEncrypted('currentUser_encrypted');
        
        this.secretKey = newKey;
        
        if (users) this.saveEncrypted('users_encrypted', users);
        if (currentUser) this.saveEncrypted('currentUser_encrypted', currentUser);
        
        return true;
    }

    // Migrar datos existentes no encriptados a encriptados
    migrateOldData() {
        try {
            // Migrar usuarios
            const oldUsers = localStorage.getItem('users');
            if (oldUsers && !localStorage.getItem('users_encrypted')) {
                const usersData = JSON.parse(oldUsers);
                this.saveEncrypted('users_encrypted', usersData);
                // Opcional: eliminar datos viejos
                // localStorage.removeItem('users');
                console.log('✅ Usuarios migrados a formato encriptado');
            }

            // Migrar usuario actual
            const oldCurrentUser = localStorage.getItem('currentUser');
            if (oldCurrentUser && !localStorage.getItem('currentUser_encrypted')) {
                const currentUserData = JSON.parse(oldCurrentUser);
                this.saveEncrypted('currentUser_encrypted', currentUserData);
                // Opcional: eliminar datos viejos
                // localStorage.removeItem('currentUser');
                console.log('✅ Usuario actual migrado a formato encriptado');
            }
        } catch (e) {
            console.error('Error en migración:', e);
        }
    }

    // Exportar datos encriptados para backup
    exportEncryptedBackup() {
        const users = localStorage.getItem('users_encrypted');
        const analytics = localStorage.getItem('siteAnalytics');
        
        const backup = {
            exportDate: new Date().toISOString(),
            encrypted: true,
            data: {
                users_encrypted: users,
                analytics: analytics
            }
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-encrypted-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Importar backup encriptado
    importEncryptedBackup(jsonData) {
        try {
            const backup = JSON.parse(jsonData);
            
            if (backup.encrypted && backup.data) {
                if (backup.data.users_encrypted) {
                    localStorage.setItem('users_encrypted', backup.data.users_encrypted);
                }
                if (backup.data.analytics) {
                    localStorage.setItem('siteAnalytics', backup.data.analytics);
                }
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error al importar backup:', e);
            return false;
        }
    }
}

// Inicializar sistema de encriptación
const encryptionSystem = new EncryptionSystem();

// Migrar datos existentes automáticamente al cargar
encryptionSystem.migrateOldData();

// Exponer globalmente
window.encryptionSystem = encryptionSystem;

console.log('🔐 Sistema de encriptación inicializado');
