// Firebase Realtime Database Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getDatabase, ref, set, get, push, remove, onValue, off } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4TmdQmh07Xn-xLpTGS_NKXWgTWan4Ulk",
  authDomain: "impostor-14769.firebaseapp.com",
  databaseURL: "https://impostor-14769-default-rtdb.firebaseio.com",
  projectId: "impostor-14769",
  storageBucket: "impostor-14769.firebasestorage.app",
  messagingSenderId: "972582618245",
  appId: "1:972582618245:web:adf2a6228687a3a14d95ec",
  measurementId: "G-R1DQ05C87M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Firebase Realtime Database Manager
class FirebaseRealtimeManager {
    constructor() {
        this.db = database;
        this.isOnline = navigator.onLine;
        this.listeners = new Map();
        this.setupConnectionListener();
    }

    setupConnectionListener() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🟢 Conexión a Firebase Realtime Database restaurada');
            this.updateFirebaseStatus('🟢', 'Conectado a Realtime Database', 'online');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('🔴 Sin conexión - usando localStorage');
            this.updateFirebaseStatus('🔴', 'Sin conexión - modo offline', 'offline');
        });

        // Estado inicial
        this.updateFirebaseStatus(
            this.isOnline ? '🟢' : '🔴', 
            this.isOnline ? 'Conectado a Realtime Database' : 'Sin conexión - modo offline',
            this.isOnline ? 'online' : 'offline'
        );
    }

    updateFirebaseStatus(indicator, text, className) {
        const indicatorEl = document.getElementById('firebase-indicator');
        const textEl = document.getElementById('firebase-status-text');
        
        if (indicatorEl && textEl) {
            indicatorEl.textContent = indicator;
            indicatorEl.className = `status-indicator ${className}`;
            textEl.textContent = text;
        }
    }

    // ========== USUARIOS ==========
    
    async saveUser(user) {
        try {
            if (!this.isOnline) {
                // Guardar offline en localStorage
                this.saveUserOffline(user);
                return { success: true, offline: true };
            }

            // Verificar si el usuario ya existe
            const existingUser = await this.getUserByUsername(user.username);
            if (existingUser && existingUser.id !== user.id) {
                throw new Error('El usuario ya existe');
            }

            // Guardar en Firebase Realtime Database
            const userRef = ref(this.db, `users/${user.id}`);
            await set(userRef, {
                ...user,
                syncedAt: new Date().toISOString()
            });

            // También guardar en localStorage como backup
            this.saveUserOffline(user);

            console.log('✅ Usuario guardado en Firebase Realtime DB:', user.id);
            return { success: true, firebaseId: user.id };

        } catch (error) {
            console.error('❌ Error guardando usuario:', error);
            // Fallback a localStorage
            this.saveUserOffline(user);
            return { success: false, error: error.message, offline: true };
        }
    }

    async updateUser(user) {
        try {
            if (!this.isOnline) {
                this.saveUserOffline(user);
                return { success: true, offline: true };
            }

            // Actualizar en Firebase Realtime Database
            const userRef = ref(this.db, `users/${user.id}`);
            await set(userRef, {
                ...user,
                syncedAt: new Date().toISOString()
            });

            console.log('✅ Usuario actualizado en Firebase Realtime DB');

            // También actualizar en localStorage
            this.saveUserOffline(user);
            return { success: true };

        } catch (error) {
            console.error('❌ Error actualizando usuario:', error);
            this.saveUserOffline(user);
            return { success: false, error: error.message, offline: true };
        }
    }

    async getAllUsers() {
        try {
            if (!this.isOnline) {
                return this.getUsersOffline();
            }

            const usersRef = ref(this.db, 'users');
            const snapshot = await get(usersRef);
            
            if (snapshot.exists()) {
                const firebaseUsers = Object.values(snapshot.val());
                
                // Combinar con usuarios offline si los hay
                const offlineUsers = this.getUsersOffline();
                const combinedUsers = this.mergeUsers(firebaseUsers, offlineUsers);

                // Guardar en localStorage para cache
                localStorage.setItem('users', JSON.stringify(combinedUsers));

                console.log(`✅ ${firebaseUsers.length} usuarios cargados desde Firebase Realtime DB`);
                return combinedUsers;
            } else {
                console.log('📭 No hay usuarios en Firebase Realtime DB');
                return this.getUsersOffline();
            }

        } catch (error) {
            console.error('❌ Error cargando usuarios desde Firebase:', error);
            // Fallback a localStorage
            return this.getUsersOffline();
        }
    }

    async getUserByUsername(username) {
        try {
            if (!this.isOnline) {
                const users = this.getUsersOffline();
                return users.find(u => u.username === username);
            }

            const usersRef = ref(this.db, 'users');
            const snapshot = await get(usersRef);
            
            if (snapshot.exists()) {
                const users = Object.values(snapshot.val());
                return users.find(u => u.username === username);
            }
            return null;

        } catch (error) {
            console.error('❌ Error buscando usuario:', error);
            const users = this.getUsersOffline();
            return users.find(u => u.username === username);
        }
    }

    // ========== TIEMPO REAL ==========

    listenToUsers(callback) {
        if (!this.isOnline) {
            // Ejecutar callback con datos offline
            const users = this.getUsersOffline();
            callback(users);
            return;
        }

        const usersRef = ref(this.db, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const users = Object.values(snapshot.val());
                callback(users);
                console.log('🔄 Usuarios actualizados en tiempo real');
            } else {
                callback([]);
            }
        });

        // Guardar listener para poder desuscribirse después
        this.listeners.set('users', unsubscribe);
    }

    stopListening(path) {
        if (this.listeners.has(path)) {
            const unsubscribe = this.listeners.get(path);
            const pathRef = ref(this.db, path);
            off(pathRef, 'value', unsubscribe);
            this.listeners.delete(path);
            console.log(`🔇 Dejando de escuchar: ${path}`);
        }
    }

    // ========== SALAS DE JUEGO EN TIEMPO REAL ==========

    async createGameRoom(roomCode, hostUser) {
        try {
            const roomRef = ref(this.db, `rooms/${roomCode}`);
            await set(roomRef, {
                host: hostUser.username,
                players: {
                    [hostUser.id]: {
                        id: hostUser.id,
                        name: hostUser.username,
                        avatar: hostUser.avatar,
                        isHost: true,
                        connected: true,
                        joinedAt: new Date().toISOString()
                    }
                },
                gameState: 'waiting',
                createdAt: new Date().toISOString()
            });

            console.log('✅ Sala creada en Firebase:', roomCode);
            return { success: true };
        } catch (error) {
            console.error('❌ Error creando sala:', error);
            return { success: false, error: error.message };
        }
    }

    async joinGameRoom(roomCode, user) {
        try {
            const playerRef = ref(this.db, `rooms/${roomCode}/players/${user.id}`);
            await set(playerRef, {
                id: user.id,
                name: user.username,
                avatar: user.avatar,
                isHost: false,
                connected: true,
                joinedAt: new Date().toISOString()
            });

            console.log('✅ Unido a sala:', roomCode);
            return { success: true };
        } catch (error) {
            console.error('❌ Error uniéndose a sala:', error);
            return { success: false, error: error.message };
        }
    }

    listenToRoom(roomCode, callback) {
        const roomRef = ref(this.db, `rooms/${roomCode}`);
        const unsubscribe = onValue(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            } else {
                callback(null);
            }
        });

        this.listeners.set(`room_${roomCode}`, unsubscribe);
    }

    // ========== MÉTODOS OFFLINE ==========

    saveUserOffline(user) {
        const users = this.getUsersOffline();
        const existingIndex = users.findIndex(u => u.id === user.id);
        
        if (existingIndex !== -1) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('users_pending_sync', JSON.stringify(users.filter(u => !u.syncedAt)));
    }

    getUsersOffline() {
        const usersData = localStorage.getItem('users');
        return usersData ? JSON.parse(usersData) : [];
    }

    // ========== SINCRONIZACIÓN ==========

    async syncOfflineData() {
        try {
            const pendingUsers = JSON.parse(localStorage.getItem('users_pending_sync') || '[]');
            
            for (const user of pendingUsers) {
                await this.saveUser(user);
            }

            if (pendingUsers.length > 0) {
                console.log(`✅ ${pendingUsers.length} usuarios sincronizados con Firebase`);
                localStorage.removeItem('users_pending_sync');
            }

        } catch (error) {
            console.error('❌ Error sincronizando datos:', error);
        }
    }

    // ========== UTILIDADES ==========

    mergeUsers(firebaseUsers, offlineUsers) {
        const merged = [...firebaseUsers];
        
        offlineUsers.forEach(offlineUser => {
            const existsInFirebase = firebaseUsers.find(fbUser => fbUser.id === offlineUser.id);
            if (!existsInFirebase) {
                merged.push(offlineUser);
            }
        });
        
        return merged;
    }

    // ========== ESTADÍSTICAS ==========

    async getStats() {
        try {
            const users = await this.getAllUsers();
            return {
                totalUsers: users.length,
                totalGames: users.reduce((sum, u) => sum + (u.stats?.gamesPlayed || 0), 0),
                totalImpostorWins: users.reduce((sum, u) => sum + (u.stats?.winsImpostor || 0), 0),
                totalCrewWins: users.reduce((sum, u) => sum + (u.stats?.winsCrew || 0), 0),
                onlineUsers: users.filter(u => u.syncedAt).length,
                offlineUsers: users.filter(u => !u.syncedAt).length
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return null;
        }
    }

    // ========== LEER DATOS EXISTENTES ==========

    async readExistingData() {
        try {
            console.log('📖 Leyendo datos existentes de Firebase...');
            
            // Leer todos los datos
            const rootRef = ref(this.db, '/');
            const snapshot = await get(rootRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('📊 Datos encontrados en Firebase:', data);
                return data;
            } else {
                console.log('📭 No hay datos en Firebase Realtime Database');
                return null;
            }
        } catch (error) {
            console.error('❌ Error leyendo datos:', error);
            return null;
        }
    }
}

// Inicializar Firebase Realtime Manager
const firebaseRealtimeManager = new FirebaseRealtimeManager();

// Exponer globalmente
window.firebaseRealtimeManager = firebaseRealtimeManager;
window.firebaseManager = firebaseRealtimeManager; // Alias para compatibilidad

console.log('🔥 Firebase Realtime Database inicializado correctamente');
console.log('📊 Analytics activado');
console.log('⚡ Base de datos en tiempo real lista');

// Leer datos existentes al inicializar
firebaseRealtimeManager.readExistingData().then(data => {
    if (data) {
        console.log('🎯 Datos existentes cargados:', Object.keys(data));
    }
});
