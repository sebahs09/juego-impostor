// Sistema de Autenticación y Perfil
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Cargar usuario si existe
        let savedUser = null;
        if (window.encryptionSystem) {
            savedUser = window.encryptionSystem.loadEncrypted('currentUser_encrypted');
        } else {
            const userData = localStorage.getItem('currentUser');
            savedUser = userData ? JSON.parse(userData) : null;
        }
        
        if (savedUser) {
            this.currentUser = savedUser;
            this.showWelcomeScreen();
        } else {
            this.showAuthScreen();
        }

        // Event Listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tabs de Login/Register
        document.getElementById('login-tab').addEventListener('click', () => this.switchTab('login'));
        document.getElementById('register-tab').addEventListener('click', () => this.switchTab('register'));

        // Forms
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));

        // Profile buttons
        document.getElementById('show-profile-btn').addEventListener('click', () => this.showProfile());
        document.getElementById('back-from-profile').addEventListener('click', () => this.hideProfile());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('save-profile-btn').addEventListener('click', () => this.saveProfile());

        // Avatar selector
        document.querySelectorAll('.avatar-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAvatar(e.target.dataset.avatar));
        });

        // Color selector
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectColor(e.target.dataset.color));
        });
    }

    switchTab(tab) {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Obtener usuarios registrados
        const users = this.getUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            this.showError('Usuario no encontrado');
            return;
        }

        if (user.password !== password) {
            this.showError('Contraseña incorrecta');
            return;
        }

        // Login exitoso
        this.currentUser = user;
        if (window.encryptionSystem) {
            window.encryptionSystem.saveEncrypted('currentUser_encrypted', user);
        } else {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.showWelcomeScreen();
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-password-confirm').value;
        const adminCode = document.getElementById('register-admin-code').value;

        // Validaciones
        if (password !== confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Verificar si el usuario ya existe
        const users = this.getUsers();
        if (users.find(u => u.username === username)) {
            this.showError('El usuario ya existe');
            return;
        }

        // Verificar código admin
        const isAdmin = adminCode === 'ADMIN2025';

        // Crear nuevo usuario
        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            avatar: '😀',
            color: '#667eea',
            isAdmin: isAdmin,
            stats: {
                gamesPlayed: 0,
                winsImpostor: 0,
                winsCrew: 0
            },
            createdAt: new Date().toISOString()
        };

        // Guardar usuario
        users.push(newUser);
        if (window.encryptionSystem) {
            window.encryptionSystem.saveEncrypted('users_encrypted', users);
            window.encryptionSystem.saveEncrypted('currentUser_encrypted', newUser);
        } else {
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
        }

        // Auto login
        this.currentUser = newUser;
        
        // Mostrar mensaje especial si es admin
        if (isAdmin) {
            this.showToast('✅ Cuenta ADMIN creada correctamente');
        }
        
        this.showWelcomeScreen();
    }

    showError(message) {
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => errorDiv.classList.add('hidden'), 3000);
    }

    getUsers() {
        // Usar sistema de encriptación si está disponible
        if (window.encryptionSystem) {
            const users = window.encryptionSystem.loadEncrypted('users_encrypted');
            return users || [];
        }
        // Fallback a localStorage normal (compatibilidad)
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    showAuthScreen() {
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('mode-screen').classList.add('hidden');
    }

    showWelcomeScreen() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('welcome-screen').classList.remove('hidden');
        
        // Auto-avanzar después de 2 segundos
        setTimeout(() => {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('mode-screen').classList.remove('hidden');
        }, 2000);
    }

    showProfile() {
        if (!this.currentUser) return;

        document.getElementById('mode-screen').classList.add('hidden');
        document.getElementById('profile-screen').classList.remove('hidden');

        // Cargar datos del perfil
        this.loadProfileData();
    }

    hideProfile() {
        document.getElementById('profile-screen').classList.add('hidden');
        document.getElementById('mode-screen').classList.remove('hidden');
    }

    loadProfileData() {
        // Cargar datos actualizados del usuario
        const users = this.getUsers();
        const updatedUser = users.find(u => u.id === this.currentUser.id);
        if (updatedUser) {
            this.currentUser = updatedUser;
        }

        // Header
        const avatarDisplay = document.getElementById('profile-avatar-display');
        avatarDisplay.textContent = this.currentUser.avatar;
        
        // Aplicar el color de fondo guardado
        if (this.currentUser.color) {
            avatarDisplay.style.background = `linear-gradient(135deg, ${this.currentUser.color} 0%, ${this.adjustColorBrightness(this.currentUser.color, -30)} 100%)`;
        }
        
        // Mostrar badge de admin si corresponde
        const usernameDisplay = this.currentUser.username;
        const adminBadge = this.currentUser.isAdmin ? ' <span style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 3px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700;">ADMIN</span>' : '';
        document.getElementById('profile-username-display').innerHTML = usernameDisplay + adminBadge;
        
        document.getElementById('profile-email-display').textContent = this.currentUser.email || '';

        // Stats
        const stats = this.currentUser.stats;
        document.getElementById('stat-games').textContent = stats.gamesPlayed;
        document.getElementById('stat-wins-impostor').textContent = stats.winsImpostor;
        document.getElementById('stat-wins-crew').textContent = stats.winsCrew;
        
        const totalWins = stats.winsImpostor + stats.winsCrew;
        const winrate = stats.gamesPlayed > 0 ? Math.round((totalWins / stats.gamesPlayed) * 100) : 0;
        document.getElementById('stat-winrate').textContent = winrate + '%';

        // Seleccionar avatar actual
        document.querySelectorAll('.avatar-option').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.avatar === this.currentUser.avatar);
        });

        // Seleccionar color actual
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.color === this.currentUser.color);
        });
    }

    selectAvatar(avatar) {
        document.querySelectorAll('.avatar-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        // Actualizar emoji del avatar
        const avatarDisplay = document.getElementById('profile-avatar-display');
        avatarDisplay.textContent = avatar;
        
        // Mantener el color de fondo si hay uno seleccionado
        const selectedColor = document.querySelector('.color-option.selected');
        if (selectedColor && selectedColor.dataset.color) {
            const color = selectedColor.dataset.color;
            avatarDisplay.style.background = `linear-gradient(135deg, ${color} 0%, ${this.adjustColorBrightness(color, -30)} 100%)`;
        }
    }

    selectColor(color) {
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        // Actualizar el fondo del avatar en tiempo real
        const avatarDisplay = document.getElementById('profile-avatar-display');
        if (avatarDisplay && color) {
            avatarDisplay.style.background = `linear-gradient(135deg, ${color} 0%, ${this.adjustColorBrightness(color, -30)} 100%)`;
        }
    }
    
    // Función auxiliar para oscurecer/aclarar un color
    adjustColorBrightness(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    saveProfile() {
        // Obtener valores seleccionados
        const selectedAvatar = document.querySelector('.avatar-option.selected');
        const selectedColor = document.querySelector('.color-option.selected');

        if (selectedAvatar) {
            this.currentUser.avatar = selectedAvatar.dataset.avatar;
        }
        if (selectedColor) {
            this.currentUser.color = selectedColor.dataset.color;
        }

        // Actualizar en localStorage
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            if (window.encryptionSystem) {
                window.encryptionSystem.saveEncrypted('users_encrypted', users);
                window.encryptionSystem.saveEncrypted('currentUser_encrypted', this.currentUser);
            } else {
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        }

        // Mostrar confirmación
        this.showToast('✅ Perfil guardado correctamente');
    }

    logout() {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            this.currentUser = null;
            if (window.encryptionSystem) {
                localStorage.removeItem('currentUser_encrypted');
            }
            localStorage.removeItem('currentUser');
            location.reload();
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Métodos para actualizar estadísticas (llamar desde el juego)
    updateStats(result) {
        if (!this.currentUser) return;

        this.currentUser.stats.gamesPlayed++;
        
        if (result === 'impostor-win') {
            this.currentUser.stats.winsImpostor++;
        } else if (result === 'crew-win') {
            this.currentUser.stats.winsCrew++;
        }

        // Guardar
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializar sistema de autenticación
const authSystem = new AuthSystem();

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
