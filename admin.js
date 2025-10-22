// Sistema de Panel de Administración
class AdminPanel {
    constructor() {
        this.adminPassword = 'admin123'; // Cambiar esto en producción
        this.isAdminLoggedIn = false;
        this.currentSort = 'date';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close admin panel
        document.getElementById('close-admin-btn').addEventListener('click', () => {
            this.closeAdminPanel();
        });

        // Search and sort
        document.getElementById('admin-search-input').addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });

        document.getElementById('admin-sort-select').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.loadUsers();
        });

        // Danger zone buttons
        document.getElementById('clear-all-stats-btn').addEventListener('click', () => {
            this.clearAllStats();
        });

        document.getElementById('clear-analytics-btn').addEventListener('click', () => {
            this.clearAnalytics();
        });

        document.getElementById('delete-all-users-btn').addEventListener('click', () => {
            this.deleteAllUsers();
        });

        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('export-analytics-btn').addEventListener('click', () => {
            this.exportAnalytics();
        });

        document.getElementById('export-encrypted-backup-btn').addEventListener('click', () => {
            this.exportEncryptedBackup();
        });

        // Ver datos de usuarios
        document.getElementById('show-users-data-btn').addEventListener('click', () => {
            this.toggleUsersData();
        });

        document.getElementById('copy-users-data-btn').addEventListener('click', () => {
            this.copyUsersData();
        });
    }

    showAdminPanel() {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Mostrar panel de admin
        document.getElementById('admin-panel-screen').classList.remove('hidden');

        // Cargar datos
        this.loadAdminData();
    }

    closeAdminPanel() {
        document.getElementById('admin-panel-screen').classList.add('hidden');
        document.getElementById('mode-screen').classList.remove('hidden');
        this.isAdminLoggedIn = false;
    }

    loadAdminData() {
        this.loadStats();
        this.loadUsers();
    }

    loadStats() {
        const users = this.getUsers();
        
        // Visitas totales
        const totalVisits = window.analyticsSystem ? window.analyticsSystem.getTotalVisits() : 0;
        document.getElementById('admin-total-visits').textContent = totalVisits;
        
        // Total usuarios
        document.getElementById('admin-total-users').textContent = users.length;

        // Total partidas
        const totalGames = users.reduce((sum, u) => sum + (u.stats?.gamesPlayed || 0), 0);
        document.getElementById('admin-total-games').textContent = totalGames;

        // Victorias impostor
        const impostorWins = users.reduce((sum, u) => sum + (u.stats?.winsImpostor || 0), 0);
        document.getElementById('admin-impostor-wins').textContent = impostorWins;

        // Victorias crew
        const crewWins = users.reduce((sum, u) => sum + (u.stats?.winsCrew || 0), 0);
        document.getElementById('admin-crew-wins').textContent = crewWins;
    }

    loadUsers() {
        let users = this.getUsers();
        
        // Ordenar usuarios
        users = this.sortUsers(users, this.currentSort);

        // Renderizar tabla
        this.renderUsersTable(users);
    }

    sortUsers(users, sortBy) {
        switch(sortBy) {
            case 'date':
                return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'games':
                return users.sort((a, b) => (b.stats?.gamesPlayed || 0) - (a.stats?.gamesPlayed || 0));
            case 'wins':
                return users.sort((a, b) => {
                    const winsA = (a.stats?.winsImpostor || 0) + (a.stats?.winsCrew || 0);
                    const winsB = (b.stats?.winsImpostor || 0) + (b.stats?.winsCrew || 0);
                    return winsB - winsA;
                });
            case 'name':
                return users.sort((a, b) => a.username.localeCompare(b.username));
            default:
                return users;
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('admin-users-tbody');
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No hay usuarios registrados</td></tr>';
            return;
        }

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.dataset.userId = user.id;

            const stats = user.stats || { gamesPlayed: 0, winsImpostor: 0, winsCrew: 0 };
            const totalWins = stats.winsImpostor + stats.winsCrew;
            const winrate = stats.gamesPlayed > 0 ? Math.round((totalWins / stats.gamesPlayed) * 100) : 0;
            const createdDate = new Date(user.createdAt).toLocaleDateString('es-ES');
            const adminBadge = user.isAdmin ? '<span style="background: #f093fb; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; margin-left: 5px;">ADMIN</span>' : '';

            const adminToggle = user.isAdmin 
                ? `<button class="admin-toggle-btn admin" onclick="adminPanel.toggleAdmin(${user.id})">✅ Admin</button>`
                : `<button class="admin-toggle-btn" onclick="adminPanel.toggleAdmin(${user.id})">❌ Usuario</button>`;

            tr.innerHTML = `
                <td class="user-avatar">${user.avatar || '😀'}</td>
                <td><strong>${user.username}</strong>${adminBadge}</td>
                <td>${user.email || '-'}</td>
                <td>${stats.gamesPlayed}</td>
                <td>${stats.winsImpostor}</td>
                <td>${stats.winsCrew}</td>
                <td>${winrate}%</td>
                <td>${createdDate}</td>
                <td>${adminToggle}</td>
                <td>
                    <button class="delete-user-btn" onclick="adminPanel.deleteUser(${user.id})">
                        🗑️ Eliminar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    toggleAdmin(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;
        
        // Toggle admin status
        user.isAdmin = !user.isAdmin;
        
        // Guardar cambios
        if (window.encryptionSystem) {
            window.encryptionSystem.saveEncrypted('users_encrypted', users);
        } else {
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Actualizar currentUser si es el mismo
        const currentUser = window.authSystem ? window.authSystem.currentUser : null;
        if (currentUser && currentUser.id === userId) {
            currentUser.isAdmin = user.isAdmin;
            if (window.encryptionSystem) {
                window.encryptionSystem.saveEncrypted('currentUser_encrypted', currentUser);
            } else {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
        
        this.loadAdminData();
        this.showToast(user.isAdmin ? '✅ Usuario promovido a Admin' : '❌ Admin degradado a Usuario');
    }

    filterUsers(searchTerm) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => {
            return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
        });
        this.renderUsersTable(filteredUsers);
    }

    deleteUser(userId) {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) {
            return;
        }

        const users = this.getUsers();
        const filteredUsers = users.filter(u => u.id !== userId);
        if (window.encryptionSystem) {
            window.encryptionSystem.saveEncrypted('users_encrypted', filteredUsers);
        } else {
            localStorage.setItem('users', JSON.stringify(filteredUsers));
        }

        // Verificar si el usuario actual fue eliminado
        let currentUser = null;
        if (window.encryptionSystem) {
            currentUser = window.encryptionSystem.loadEncrypted('currentUser_encrypted');
        } else {
            currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        }
        if (currentUser && currentUser.id === userId) {
            localStorage.removeItem('currentUser');
        }

        this.loadAdminData();
        this.showToast('✅ Usuario eliminado correctamente');
    }

    clearAllStats() {
        if (!confirm('⚠️ ¿Estás seguro? Esto limpiará todas las estadísticas pero mantendrá las cuentas.')) {
            return;
        }

        const users = this.getUsers();
        users.forEach(user => {
            user.stats = {
                gamesPlayed: 0,
                winsImpostor: 0,
                winsCrew: 0
            };
        });

        if (window.encryptionSystem) {
            window.encryptionSystem.saveEncrypted('users_encrypted', users);
        } else {
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Actualizar usuario actual
        let currentUser = null;
        if (window.encryptionSystem) {
            currentUser = window.encryptionSystem.loadEncrypted('currentUser_encrypted');
        } else {
            currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        }
        if (currentUser) {
            const updatedUser = users.find(u => u.id === currentUser.id);
            if (updatedUser) {
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
        }

        this.loadAdminData();
        this.showToast('✅ Todas las estadísticas han sido limpiadas');
    }

    deleteAllUsers() {
        if (!confirm('💣 ¿ESTÁS COMPLETAMENTE SEGURO? Esto eliminará TODAS las cuentas y NO se puede deshacer.')) {
            return;
        }

        if (!confirm('🚨 ÚLTIMA ADVERTENCIA: ¿Realmente quieres eliminar TODO?')) {
            return;
        }

        localStorage.removeItem('users');
        localStorage.removeItem('currentUser');

        this.showToast('💣 Todos los usuarios han sido eliminados');

        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    exportData() {
        const users = this.getUsers();
        const data = {
            exportDate: new Date().toISOString(),
            totalUsers: users.length,
            users: users
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `impostor-users-${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showToast('📥 Datos de usuarios exportados correctamente');
    }

    clearAnalytics() {
        if (window.analyticsSystem && window.analyticsSystem.clearAnalytics()) {
            this.loadStats();
            this.showToast('📊 Estadísticas de visitas limpiadas');
        }
    }

    exportAnalytics() {
        if (window.analyticsSystem) {
            window.analyticsSystem.exportAnalytics();
            this.showToast('📊 Estadísticas de visitas exportadas');
        }
    }

    exportEncryptedBackup() {
        if (window.encryptionSystem) {
            window.encryptionSystem.exportEncryptedBackup();
            this.showToast('🔐 Backup encriptado exportado - Solo accesible con tu clave secreta');
        } else {
            this.showToast('⚠️ Sistema de encriptación no disponible');
        }
    }

    toggleUsersData() {
        const display = document.getElementById('users-data-display');
        const jsonPre = document.getElementById('users-json');
        const showBtn = document.getElementById('show-users-data-btn');
        const copyBtn = document.getElementById('copy-users-data-btn');

        if (display.classList.contains('hidden')) {
            // Mostrar datos
            const users = this.getUsers();
            const formattedData = JSON.stringify(users, null, 2);
            jsonPre.textContent = formattedData;
            
            display.classList.remove('hidden');
            copyBtn.classList.remove('hidden');
            showBtn.textContent = '🙈 Ocultar Datos';
            
            this.showToast('👁️ Mostrando todos los usuarios - ¡Solo tú puedes ver esto!');
        } else {
            // Ocultar datos
            display.classList.add('hidden');
            copyBtn.classList.add('hidden');
            showBtn.textContent = '👁️ Mostrar Datos de Usuarios';
            jsonPre.textContent = '';
        }
    }

    copyUsersData() {
        const jsonPre = document.getElementById('users-json');
        const text = jsonPre.textContent;

        navigator.clipboard.writeText(text).then(() => {
            this.showToast('📋 Datos copiados al portapapeles');
        }).catch(() => {
            // Fallback para navegadores viejos
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('📋 Datos copiados al portapapeles');
        });
    }

    getUsers() {
        // Usar sistema de encriptación si está disponible
        if (window.encryptionSystem) {
            const users = window.encryptionSystem.loadEncrypted('users_encrypted');
            return users || [];
        }
        // Fallback a localStorage normal
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Inicializar admin panel
const adminPanel = new AdminPanel();

// Agregar animación CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
