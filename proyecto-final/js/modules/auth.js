// ============================================
// AUTH.JS - Autenticación con Supabase
// ============================================

const Auth = {
    currentUser: null,
    userRole: null,
    userEmail: null,

    // Inicializar y verificar sesión
    async init() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                this.currentUser = session.user;
                this.userEmail = session.user.email;
                await this.fetchUserRole(session.user.id, session.user.email);
                this.onAuthChange(session.user);
                return session.user;
            }
        } catch (e) {
            console.error('Auth.init error:', e);
        }
        return null;
    },

    // Buscar rol en tabla app_users
    async fetchUserRole(userId, email) {
        try {
            // Intentar buscar por ID primero
            let { data, error } = await supabase
                .from('app_users')
                .select('role')
                .eq('id', userId)
                .single();
            
            // Si no encuentra por ID, buscar por email
            if (error || !data) {
                console.log('No encontrado por ID, buscando por email...');
                const result = await supabase
                    .from('app_users')
                    .select('role')
                    .eq('email', email)
                    .single();
                data = result.data;
                error = result.error;
            }
            
            if (!error && data) {
                this.userRole = data.role;
                console.log('✅ Rol encontrado en app_users:', this.userRole);
            } else {
                console.log('⚠️ No se encontró rol en app_users, usando fallbacks');
                // Fallback a metadata
                this.userRole = this.currentUser?.user_metadata?.role || 
                                this.currentUser?.app_metadata?.role || 
                                'user';
            }
        } catch (e) {
            console.error('fetchUserRole error:', e);
            this.userRole = 'user';
        }
        
        console.log('🔐 Auth Status:', {
            email: this.userEmail,
            role: this.userRole,
            isAdmin: this.isAdmin()
        });
    },

    // Login con email/password
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            this.currentUser = data.user;
            this.userEmail = data.user.email;
            await this.fetchUserRole(data.user.id, data.user.email);
            this.onAuthChange(data.user);
            return { success: true, user: data.user };
        } catch (e) {
            console.error('Auth.login error:', e);
            return { success: false, error: e.message };
        }
    },

    // Logout
    async logout() {
        try {
            await supabase.auth.signOut();
            this.currentUser = null;
            this.userRole = null;
            this.userEmail = null;
            this.onAuthChange(null);
            return { success: true };
        } catch (e) {
            console.error('Auth.logout error:', e);
            return { success: false, error: e.message };
        }
    },

    // Obtener usuario actual
    getUser() {
        return this.currentUser;
    },

    // Verificar si está autenticado
    isAuthenticated() {
        return !!this.currentUser;
    },

    // Obtener rol del usuario
    getRole() {
        if (!this.currentUser) return 'guest';
        return this.userRole || 'user';
    },

    // Verificar si es admin
    isAdmin() {
        const role = this.getRole();
        return role === 'admin' || role === 'Admin' || role === 'ADMIN';
    },

    // Obtener nombre para mostrar
    getDisplayName() {
        if (!this.currentUser) return 'Usuario';
        return this.currentUser.user_metadata?.display_name ||
               this.currentUser.user_metadata?.name ||
               this.currentUser.email?.split('@')[0] ||
               'Usuario';
    },

    // Obtener inicial
    getInitial() {
        return this.getDisplayName().charAt(0).toUpperCase();
    },

    // Callback cuando cambia la autenticación (override en cada página)
    onAuthChange(user) {
        console.log('Auth changed:', user ? user.email : 'logged out', '| Role:', this.userRole);
    }
};

// Export global
window.Auth = Auth;
