// ============================================
// INDEX/FILTERS.JS - Filtros de Búsqueda
// ============================================

const Filters = {
    currentFilters: {
        search: '',
        bandeira: 'all',
        pais: 'all',
        sort: 'posicion'
    },

    // Inicializar
    init() {
        this.bindEvents();
    },

    // Vincular eventos
    bindEvents() {
        // Búsqueda
        const searchInput = Utils.$('filter-search');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.currentFilters.search = e.target.value;
                this.apply();
            }, 300));
        }

        // Bandeira
        const bandeiraSelect = Utils.$('filter-bandeira');
        if (bandeiraSelect) {
            bandeiraSelect.addEventListener('change', (e) => {
                this.currentFilters.bandeira = e.target.value;
                this.apply();
            });
        }

        // País
        const paisSelect = Utils.$('filter-pais');
        if (paisSelect) {
            paisSelect.addEventListener('change', (e) => {
                this.currentFilters.pais = e.target.value;
                this.apply();
            });
        }

        // Ordenar
        const sortSelect = Utils.$('filter-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.apply();
            });
        }

        // Botón limpiar
        const clearBtn = Utils.$('filter-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.reset());
        }
    },

    // Aplicar filtros
    apply() {
        Cards.filter(this.currentFilters);
    },

    // Resetear filtros
    reset() {
        this.currentFilters = {
            search: '',
            bandeira: 'all',
            pais: 'all',
            sort: 'posicion'
        };

        // Resetear inputs
        const searchInput = Utils.$('filter-search');
        if (searchInput) searchInput.value = '';

        const bandeiraSelect = Utils.$('filter-bandeira');
        if (bandeiraSelect) bandeiraSelect.value = 'all';

        const paisSelect = Utils.$('filter-pais');
        if (paisSelect) paisSelect.value = 'all';

        const sortSelect = Utils.$('filter-sort');
        if (sortSelect) sortSelect.value = 'posicion';

        this.apply();
    }
};

// Export global
window.Filters = Filters;
