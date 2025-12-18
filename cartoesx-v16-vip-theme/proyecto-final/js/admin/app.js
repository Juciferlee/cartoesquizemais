// ============================================
// ADMIN/APP.JS - Aplicación Principal
// ============================================

const AdminApp = {
    currentPage: 'dashboard',
    initialized: false,

    // ========== INIT ==========
    async init() {
        console.log('🚀 Iniciando Admin Panel...');

        try {
            // Verificar autenticación
            const user = await Auth.init();
            
            if (!user) {
                this.showDenied('Você precisa fazer login para acessar o painel.');
                return;
            }

            // Verificar si es admin
            if (!Auth.isAdmin()) {
                this.showDenied('Você não tem permissão de administrador.');
                return;
            }

            // Cargar datos
            AdminStore.loadAll();

            // Actualizar UI de usuario
            this.updateUserUI();

            // Mostrar app
            document.getElementById('admin-loading').style.display = 'none';
            document.getElementById('admin-app').style.display = 'flex';

            // Bind eventos
            this.bindEvents();

            // Router inicial
            this.handleRoute();

            // Listener de hash
            window.addEventListener('hashchange', () => this.handleRoute());

            this.initialized = true;
            console.log('✅ Admin Panel listo');

        } catch (error) {
            console.error('Error inicializando admin:', error);
            this.showDenied('Erro ao carregar o painel. Tente novamente.');
        }
    },

    // ========== AUTH ==========
    showDenied(message) {
        document.getElementById('admin-loading').style.display = 'none';
        document.getElementById('denied-message').textContent = message;
        document.getElementById('admin-denied').style.display = 'flex';
    },

    updateUserUI() {
        const avatar = document.getElementById('topbar-avatar');
        const name = document.getElementById('topbar-name');
        const role = document.getElementById('topbar-role');

        if (avatar) avatar.textContent = Auth.getInitial();
        if (name) name.textContent = Auth.getDisplayName();
        if (role) role.textContent = Auth.isAdmin() ? 'Administrador' : 'Usuário';
    },

    async logout() {
        const confirmed = await AdminModal.confirm({
            title: 'Sair',
            message: 'Deseja realmente sair do painel?',
            type: 'info',
            confirmText: 'Sair'
        });

        if (confirmed) {
            await Auth.logout();
            window.location.href = 'index.html';
        }
    },

    // ========== ROUTING ==========
    handleRoute() {
        const hash = window.location.hash || '#dashboard';
        const page = hash.replace('#', '');

        // Mapeo de rutas a páginas
        const routes = {
            'dashboard': 'dashboard',
            'quiz-questions': 'quizQuestions',
            'quiz-users': 'quizUsers',
            'quiz-achievements': 'quizAchievements',
            'quiz-activity': 'quizActivity',
            'quiz-config': 'quizConfig',
            'cards': 'cards',
            'carousel': 'carousel',
            'reset': 'reset',
            // Campaña
            'campaign-map': 'campaignMap',
            'campaign-questions': 'questionBank',
            'campaign-cinematics': 'cinematics',
            'campaign-theme': 'campaignTheme'
        };

        const pageName = routes[page] || 'dashboard';
        this.currentPage = page;

        // Actualizar nav activo
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Actualizar breadcrumb
        this.updateBreadcrumb(page);

        // Renderizar página
        this.render(pageName);
    },

    navigate(page) {
        window.location.hash = page;
    },

    updateBreadcrumb(page) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const titles = {
            'dashboard': 'Dashboard',
            'quiz-questions': 'Perguntas',
            'quiz-users': 'Usuários',
            'quiz-achievements': 'Logros',
            'quiz-activity': 'Atividade',
            'quiz-config': 'Configuração',
            'cards': 'Cartões',
            'carousel': 'Carrossel',
            'reset': 'Reset & Backup',
            // Campaña
            'campaign-map': 'Mapa',
            'campaign-questions': 'Banco de Perguntas',
            'campaign-cinematics': 'Cinemáticas',
            'campaign-theme': 'Personalização'
        };

        const sections = {
            'quiz-questions': 'Quiz',
            'quiz-users': 'Quiz',
            'quiz-achievements': 'Quiz',
            'quiz-activity': 'Quiz',
            'quiz-config': 'Quiz',
            'cards': 'Conteúdo',
            'carousel': 'Conteúdo',
            'reset': 'Sistema',
            // Campaña
            'campaign-map': 'Campanha',
            'campaign-questions': 'Campanha',
            'campaign-cinematics': 'Campanha',
            'campaign-theme': 'Campanha'
        };

        const section = sections[page];
        const title = titles[page] || 'Dashboard';

        breadcrumb.innerHTML = `
            <span>Admin</span>
            <i class="fas fa-chevron-right"></i>
            ${section ? `<span>${section}</span><i class="fas fa-chevron-right"></i>` : ''}
            <span>${title}</span>
        `;
    },

    // ========== RENDER ==========
    render(pageName = null) {
        const content = document.getElementById('admin-content');
        if (!content) return;

        const page = pageName || this.getPageFromRoute();

        // Verificar si la página existe en AdminPages o AdminCampaignPages
        let pageFunction = null;
        if (typeof AdminPages[page] === 'function') {
            pageFunction = AdminPages[page].bind(AdminPages);
        } else if (typeof AdminCampaignPages !== 'undefined' && typeof AdminCampaignPages[page] === 'function') {
            pageFunction = AdminCampaignPages[page].bind(AdminCampaignPages);
        }

        if (!pageFunction) {
            content.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Página não encontrada</h3>
                    <p>A página "${page}" não existe.</p>
                    <a href="#dashboard" class="btn btn-primary" style="margin-top: 16px;">
                        <i class="fas fa-home"></i> Voltar ao Dashboard
                    </a>
                </div>
            `;
            return;
        }

        // Renderizar página
        content.innerHTML = pageFunction();
    },

    getPageFromRoute() {
        const routes = {
            'dashboard': 'dashboard',
            'quiz-questions': 'quizQuestions',
            'quiz-users': 'quizUsers',
            'quiz-achievements': 'quizAchievements',
            'quiz-activity': 'quizActivity',
            'quiz-config': 'quizConfig',
            'cards': 'cards',
            'carousel': 'carousel',
            'reset': 'reset'
        };
        return routes[this.currentPage] || 'dashboard';
    },

    // ========== EVENTS ==========
    bindEvents() {
        // Toggle sidebar
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('open');
        });

        // Nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Cerrar sidebar en mobile
                if (window.innerWidth < 1024) {
                    document.getElementById('sidebar')?.classList.remove('open');
                }
            });
        });

        // Cerrar modal con backdrop
        document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
            AdminModal.close();
        });
    },

    // ========== REFRESH ==========
    refreshData() {
        AdminStore.loadAll();
        this.render();
        AdminToast.success('Dados atualizados!');
    }
};

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    AdminApp.init();
});

// Export
window.AdminApp = AdminApp;
