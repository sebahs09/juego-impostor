// Sistema de Autenticación y Perfil
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Cargar usuario si existe
        let savedUser = null;
        
        // Intentar cargar de localStorage encriptado primero
        const encryptedUser = localStorage.getItem('currentUser_encrypted');
        if (encryptedUser && window.encryptionSystem) {
            try {
                savedUser = window.encryptionSystem.loadEncrypted('currentUser_encrypted');
            } catch (e) {
                console.error('Error al desencriptar usuario:', e);
            }
        }
        
        // Fallback a localStorage normal
        if (!savedUser) {
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
        // Tabs de Login/Register/Guest
        document.getElementById('login-tab').addEventListener('click', () => this.switchTab('login'));
        document.getElementById('register-tab').addEventListener('click', () => this.switchTab('register'));
        document.getElementById('guest-tab').addEventListener('click', () => this.switchTab('guest'));

        // Forms
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('continue-guest-btn').addEventListener('click', () => this.handleGuest());

        // Profile buttons
        document.getElementById('show-profile-btn').addEventListener('click', () => this.showProfile());
        document.getElementById('back-from-profile').addEventListener('click', () => this.hideProfile());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('save-profile-btn').addEventListener('click', () => this.saveProfile());
        
        // Admin panel button
        document.getElementById('show-admin-panel-btn').addEventListener('click', () => {
            if (window.adminPanel) {
                window.adminPanel.showAdminPanel();
            }
        });

        // Upload photo
        document.getElementById('upload-photo-btn').addEventListener('click', () => {
            document.getElementById('upload-photo').click();
        });
        document.getElementById('upload-photo').addEventListener('change', (e) => this.handlePhotoUpload(e));

        // Emoji categories
        document.querySelectorAll('.emoji-cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchEmojiCategory(e.target.dataset.category, e.target));
        });

        // Color selector
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectColor(e.target.dataset.color));
        });

        // Password toggle buttons
        document.getElementById('toggle-login-password').addEventListener('click', () => {
            this.togglePasswordVisibility('login-password', 'toggle-login-password');
        });
        document.getElementById('toggle-register-password').addEventListener('click', () => {
            this.togglePasswordVisibility('register-password', 'toggle-register-password');
        });
        document.getElementById('toggle-register-password-confirm').addEventListener('click', () => {
            this.togglePasswordVisibility('register-password-confirm', 'toggle-register-password-confirm');
        });
    }

    switchTab(tab) {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const guestTab = document.getElementById('guest-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const guestMessage = document.getElementById('guest-message');

        // Reset all
        loginTab.classList.remove('active');
        registerTab.classList.remove('active');
        guestTab.classList.remove('active');
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        guestMessage.classList.add('hidden');

        if (tab === 'login') {
            loginTab.classList.add('active');
            loginForm.classList.remove('hidden');
        } else if (tab === 'register') {
            registerTab.classList.add('active');
            registerForm.classList.remove('hidden');
        } else if (tab === 'guest') {
            guestTab.classList.add('active');
            guestMessage.classList.remove('hidden');
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
        
        // SIEMPRE guardar en localStorage normal
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // También guardar encriptado si está disponible
        if (window.encryptionSystem) {
            try {
                window.encryptionSystem.saveEncrypted('currentUser_encrypted', user);
            } catch (e) {
                console.error('Error al encriptar:', e);
            }
        }
        
        this.showWelcomeScreen();
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-password-confirm').value;

        console.log('📝 Intentando registrar:', username);

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
        console.log('👥 Usuarios existentes:', users.length);
        console.log('📋 Lista de usuarios:', users.map(u => u.username));
        
        if (users.find(u => u.username === username)) {
            console.log('❌ Usuario ya existe:', username);
            this.showError('El usuario ya existe');
            return;
        }

        // El primer usuario es admin automáticamente
        const isAdmin = users.length === 0;
        console.log('👑 Será admin?', isAdmin, '(total usuarios:', users.length + ')');

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
        
        // SIEMPRE guardar en localStorage normal (backup)
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // También guardar encriptado si está disponible
        if (window.encryptionSystem) {
            try {
                window.encryptionSystem.saveEncrypted('users_encrypted', users);
                window.encryptionSystem.saveEncrypted('currentUser_encrypted', newUser);
            } catch (e) {
                console.error('Error al encriptar:', e);
            }
        }

        // Auto login
        this.currentUser = newUser;
        
        // Mostrar mensaje especial si es el primer usuario (admin)
        if (isAdmin) {
            this.showToast('✅ Bienvenido! Eres el administrador (primer usuario)');
        }
        
        this.showWelcomeScreen();
    }

    handleGuest() {
        // Crear usuario invitado temporal (no se guarda)
        this.currentUser = {
            id: Date.now(),
            username: 'Invitado_' + Math.floor(Math.random() * 1000),
            isGuest: true,
            isAdmin: false,
            avatar: '👤',
            color: '#667eea',
            stats: {
                gamesPlayed: 0,
                winsImpostor: 0,
                winsCrew: 0
            }
        };
        
        this.showWelcomeScreen();
    }

    showError(message) {
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => errorDiv.classList.add('hidden'), 3000);
    }

    getUsers() {
        // Primero intentar localStorage normal (más confiable)
        const usersData = localStorage.getItem('users');
        if (usersData) {
            try {
                return JSON.parse(usersData);
            } catch (e) {
                console.error('Error al parsear usuarios:', e);
            }
        }
        
        // Fallback a encriptado si está disponible
        if (window.encryptionSystem) {
            try {
                const users = window.encryptionSystem.loadEncrypted('users_encrypted');
                if (users) return users;
            } catch (e) {
                console.error('Error al desencriptar usuarios:', e);
            }
        }
        
        return [];
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
            
            // DEBUG: Ver usuario actual
            console.log('👤 Usuario actual:', this.currentUser);
            console.log('🔐 Es admin?', this.currentUser?.isAdmin);
            
            // Mostrar botón de admin si el usuario es admin
            if (this.currentUser && this.currentUser.isAdmin) {
                console.log('✅ Mostrando botón de admin');
                document.getElementById('show-admin-panel-btn').classList.remove('hidden');
            } else {
                console.log('❌ Usuario NO es admin o no existe');
            }
            
            // Ocultar botón de perfil si es invitado
            if (this.currentUser && this.currentUser.isGuest) {
                document.getElementById('show-profile-btn').classList.add('hidden');
            }
        }, 2000);
    }

    showProfile() {
        if (!this.currentUser) return;

        document.getElementById('mode-screen').classList.add('hidden');
        document.getElementById('profile-screen').classList.remove('hidden');

        // Cargar emojis de la primera categoría
        this.loadEmojiCategory('Caras');

        // Cargar datos del perfil
        this.loadProfileData();
    }

    loadEmojiCategory(category) {
        if (!window.EMOJI_CATEGORIES) return;
        
        const grid = document.getElementById('emoji-grid');
        grid.innerHTML = '';
        
        const emojis = window.EMOJI_CATEGORIES[category] || [];
        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'avatar-option';
            btn.type = 'button';
            btn.dataset.avatar = emoji;
            btn.textContent = emoji;
            btn.addEventListener('click', () => this.selectAvatar(emoji));
            grid.appendChild(btn);
        });
    }

    switchEmojiCategory(category, btnElement) {
        document.querySelectorAll('.emoji-cat-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
        this.loadEmojiCategory(category);
    }

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Redimensionar imagen a 120x120
                const canvas = document.createElement('canvas');
                canvas.width = 120;
                canvas.height = 120;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 120, 120);
                
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                this.selectCustomPhoto(base64);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    selectCustomPhoto(base64Image) {
        const avatarDisplay = document.getElementById('profile-avatar-display');
        
        // Limpiar selecciones de emojis
        document.querySelectorAll('.avatar-option').forEach(btn => btn.classList.remove('selected'));
        
        // Guardar imagen como avatar
        avatarDisplay.style.backgroundImage = `url(${base64Image})`;
        avatarDisplay.style.backgroundSize = 'cover';
        avatarDisplay.style.backgroundPosition = 'center';
        avatarDisplay.textContent = '';
        
        // Guardar temporalmente para después hacer save
        this.tempCustomPhoto = base64Image;
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
        
        // Si es foto personalizada
        if (this.currentUser.avatar && this.currentUser.avatar.startsWith('data:image')) {
            avatarDisplay.style.backgroundImage = `url(${this.currentUser.avatar})`;
            avatarDisplay.style.backgroundSize = 'cover';
            avatarDisplay.style.backgroundPosition = 'center';
            avatarDisplay.textContent = '';
        } else {
            // Es un emoji
            avatarDisplay.style.backgroundImage = 'none';
            avatarDisplay.textContent = this.currentUser.avatar;
        }
        
        // Aplicar el color de fondo guardado (solo para emojis)
        if (this.currentUser.color && !this.currentUser.avatar.startsWith('data:image')) {
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

        // Si hay foto personalizada, guardarla
        if (this.tempCustomPhoto) {
            this.currentUser.avatar = this.tempCustomPhoto;
            this.tempCustomPhoto = null;
        } else if (selectedAvatar) {
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
            
            // SIEMPRE guardar en localStorage normal
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // También guardar encriptado si está disponible
            if (window.encryptionSystem) {
                try {
                    window.encryptionSystem.saveEncrypted('users_encrypted', users);
                    window.encryptionSystem.saveEncrypted('currentUser_encrypted', this.currentUser);
                } catch (e) {
                    console.error('Error al encriptar:', e);
                }
            }
        }

        // Mostrar confirmación
        this.showToast('✅ Perfil guardado correctamente');
    }

    logout() {
        const message = this.currentUser && this.currentUser.isGuest 
            ? '¿Salir del modo invitado?' 
            : '¿Seguro que quieres cerrar sesión?';
            
        if (confirm(message)) {
            // Solo borrar de localStorage si no es invitado
            if (!this.currentUser || !this.currentUser.isGuest) {
                if (window.encryptionSystem) {
                    localStorage.removeItem('currentUser_encrypted');
                }
                localStorage.removeItem('currentUser');
            }
            
            this.currentUser = null;
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

    togglePasswordVisibility(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
            button.title = 'Ocultar contraseña';
        } else {
            input.type = 'password';
            button.textContent = '👁️';
            button.title = 'Mostrar contraseña';
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializar sistema de autenticación
const authSystem = new AuthSystem();

// Exponer globalmente para admin panel
window.authSystem = authSystem;

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
