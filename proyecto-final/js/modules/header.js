// ============================================
// HEADER.JS - Header UI y Dropdown
// ============================================

const Header = {
    // IDs de elementos (se pueden customizar por página)
    elements: {
        loginBtn: 'header-login-btn',
        userContainer: 'header-user-container',
        userTrigger: 'header-user-trigger',
        userAvatar: 'header-user-avatar',
        userName: 'header-user-name',
        userEmail: 'header-user-email',
        userRole: 'header-user-role',
        userDropdown: 'header-user-dropdown',
        adminLink: 'header-admin-link',
        logoutBtn: 'header-logout-btn',
        loginModal: 'login-modal',
        closeLogin: 'close-login',
        loginForm: 'login-form',
        loginEmail: 'login-email',
        loginPassword: 'login-password'
    },

    // Inicializar header
    init() {
        this.bindEvents();
    },

    // Actualizar UI con usuario
    updateUI(user) {
        const $ = Utils.$;
        const loginBtn = $(this.elements.loginBtn);
        const userContainer = $(this.elements.userContainer);
        const userAvatar = $(this.elements.userAvatar);
        const userName = $(this.elements.userName);
        const userEmail = $(this.elements.userEmail);
        const userRole = $(this.elements.userRole);
        const adminLink = $(this.elements.adminLink);

        if (user) {
            // Usuario logueado
            if (loginBtn) loginBtn.style.display = 'none';
            if (userContainer) userContainer.style.display = 'flex';

            const displayName = Auth.getDisplayName();
            const initial = Auth.getInitial();
            const email = user.email || '';
            const isAdmin = Auth.isAdmin();

            if (userAvatar) userAvatar.textContent = initial;
            if (userName) userName.textContent = displayName;
            if (userEmail) userEmail.textContent = email;
            if (userRole) {
                userRole.textContent = isAdmin ? 'Admin' : 'User';
                userRole.style.background = isAdmin ? 'var(--primary)' : 'var(--gray-500)';
                userRole.style.color = 'white';
                userRole.style.padding = '2px 8px';
                userRole.style.borderRadius = '10px';
                userRole.style.fontSize = '11px';
            }
            // Mostrar enlace de admin si es administrador
            if (adminLink) adminLink.style.display = isAdmin ? 'flex' : 'none';
        } else {
            // Usuario no logueado
            if (loginBtn) loginBtn.style.display = 'flex';
            if (userContainer) userContainer.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
        }
    },

    // Vincular eventos
    bindEvents() {
        const $ = Utils.$;
        const self = this;

        // Dropdown toggle
        const trigger = $(this.elements.userTrigger);
        const dropdown = $(this.elements.userDropdown);
        
        if (trigger && dropdown) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }

        // Login button -> Modal
        const loginBtn = $(this.elements.loginBtn);
        const loginModal = $(this.elements.loginModal);
        const closeLogin = $(this.elements.closeLogin);

        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', () => {
                loginModal.classList.add('active');
            });
        }

        if (closeLogin && loginModal) {
            closeLogin.addEventListener('click', () => {
                loginModal.classList.remove('active');
            });
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    loginModal.classList.remove('active');
                }
            });
        }

        // Login form submit
        const loginForm = $(this.elements.loginForm);
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = $(self.elements.loginEmail)?.value;
                const password = $(self.elements.loginPassword)?.value;
                
                if (!email || !password) return;

                const result = await Auth.login(email, password);
                if (result.success) {
                    loginModal?.classList.remove('active');
                    self.updateUI(result.user);
                    // Callback opcional
                    if (typeof self.onLoginSuccess === 'function') {
                        self.onLoginSuccess(result.user);
                    }
                } else {
                    alert('Erro: ' + result.error);
                }
            });
        }

        // Logout button
        const logoutBtn = $(this.elements.logoutBtn);
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await Auth.logout();
                window.location.reload();
            });
        }
    },

    // Callbacks opcionales (override en cada página)
    onLoginSuccess(user) {},
    onLogoutSuccess() {}
};

// Export global
window.Header = Header;
