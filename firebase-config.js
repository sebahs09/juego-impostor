// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4TmdQmh07Xn-xLpTGS_NKXWgTWan4Ulk",
  authDomain: "impostor-14769.firebaseapp.com",
  projectId: "impostor-14769",
  storageBucket: "impostor-14769.firebasestorage.app",
  messagingSenderId: "972582618245",
  appId: "1:972582618245:web:adf2a6228687a3a14d95ec",
  measurementId: "G-R1DQ05C87M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Firebase Database Manager
class FirebaseManager {
    constructor() {
        this.db = db;
        this.isOnline = navigator.onLine;
        this.setupConnectionListener();
    }

    setupConnectionListener() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🟢 Conexión a Firebase restaurada');
            this.updateFirebaseStatus('🟢', 'Conectado a Firebase', 'online');
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
            this.isOnline ? 'Conectado a Firebase' : 'Sin conexión - modo offline',
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

            // Guardar en Firebase
            const docRef = await addDoc(collection(this.db, 'users'), {
                ...user,
                syncedAt: new Date().toISOString()
            });

            // También guardar en localStorage como backup
            this.saveUserOffline(user);

            console.log('✅ Usuario guardado en Firebase:', docRef.id);
            return { success: true, firebaseId: docRef.id };

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

            // Buscar el documento del usuario
            const userDoc = await this.findUserDocument(user.id);
            if (userDoc) {
                await updateDoc(doc(this.db, 'users', userDoc.firebaseId), {
                    ...user,
                    syncedAt: new Date().toISOString()
                });
                console.log('✅ Usuario actualizado en Firebase');
            }

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

            const querySnapshot = await getDocs(collection(this.db, 'users'));
            const firebaseUsers = [];
            
            querySnapshot.forEach((doc) => {
                firebaseUsers.push({
                    firebaseId: doc.id,
                    ...doc.data()
                });
            });

            // Combinar con usuarios offline si los hay
            const offlineUsers = this.getUsersOffline();
            const combinedUsers = this.mergeUsers(firebaseUsers, offlineUsers);

            // Guardar en localStorage para cache
            localStorage.setItem('users', JSON.stringify(combinedUsers));

            console.log(`✅ ${firebaseUsers.length} usuarios cargados desde Firebase`);
            return combinedUsers;

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

            const q = query(collection(this.db, 'users'), where('username', '==', username));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    firebaseId: doc.id,
                    ...doc.data()
                };
            }
            return null;

        } catch (error) {
            console.error('❌ Error buscando usuario:', error);
            const users = this.getUsersOffline();
            return users.find(u => u.username === username);
        }
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

    async findUserDocument(userId) {
        const q = query(collection(this.db, 'users'), where('id', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            return {
                firebaseId: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data()
            };
        }
        return null;
    }

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
}

// Inicializar Firebase Manager
const firebaseManager = new FirebaseManager();

// Exponer globalmente
window.firebaseManager = firebaseManager;

console.log('🔥 Firebase inicializado correctamente');
console.log('📊 Analytics activado');
console.log('💾 Base de datos Firestore lista');
