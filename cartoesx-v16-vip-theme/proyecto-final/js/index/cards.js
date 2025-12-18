// ============================================
// INDEX/CARDS.JS - Sistema de Tarjetas
// ============================================

const Cards = {
    data: [],
    filtered: [],

    // Inicializar
    async init() {
        await this.loadCards();
        this.calculateRankings();
        this.render();
        this.bindEvents();
    },

    // Cargar tarjetas desde Supabase o localStorage
    async loadCards() {
        try {
            // Intentar cargar de Supabase
            const { data, error } = await supabase
                .from('cards')
                .select('*');

            if (!error && data && data.length > 0) {
                this.data = data;
            } else {
                // Fallback a localStorage o datos de ejemplo
                this.data = Storage.getCards();
                if (this.data.length === 0) {
                    this.data = this.getExampleCards();
                }
            }
        } catch (e) {
            console.error('Error loading cards:', e);
            this.data = Storage.getCards();
            if (this.data.length === 0) {
                this.data = this.getExampleCards();
            }
        }
    },

    // ============================================
    // CÁLCULO AUTOMÁTICO DE RANKING
    // ============================================
    calculateRankings() {
        // Calcular ranking para cada tarjeta
        this.data.forEach(card => {
            card.ranking = this.calculateCardRanking(card.salas_vip || '');
        });

        // Ordenar por ranking (mayor primero)
        this.data.sort((a, b) => (b.ranking || 0) - (a.ranking || 0));

        // Asignar posición automática (1°, 2°, 3°...)
        this.data.forEach((card, index) => {
            card.posicion = index + 1;
        });

        // Actualizar filtered y guardar
        this.filtered = [...this.data];
        Storage.saveCards(this.data);
    },

    // Algoritmo de cálculo de ranking basado en salas VIP
    calculateCardRanking(salasVipText) {
        if (!salasVipText) return 0;

        const text = salasVipText.toLowerCase();
        let points = 0;

        // === 1. PROGRAMAS DE SALAS VIP (puntos base) ===
        const programs = [
            { pattern: /priority pass/g, points: 20 },
            { pattern: /loungekey|lounge key/g, points: 18 },
            { pattern: /dragon pass/g, points: 15 },
            { pattern: /plaza premium/g, points: 12 },
            { pattern: /mastercard.*lounge|lounge.*mastercard/g, points: 10 },
            { pattern: /visa.*lounge|lounge.*visa/g, points: 10 },
            { pattern: /sala vip/g, points: 8 },
            { pattern: /lounge/g, points: 5 }
        ];

        programs.forEach(prog => {
            const matches = text.match(prog.pattern);
            if (matches) {
                points += prog.points * matches.length;
            }
        });

        // === 2. TIPO DE ACCESO (multiplicadores) ===
        
        // "Ilimitado" = máximo bonus (+30 cada uno)
        const ilimitadoCount = (text.match(/ilimitad[oa]|unlimited|sem limite/g) || []).length;
        points += ilimitadoCount * 30;

        // === 3. CANTIDAD DE ACCESOS/CONVIDADOS ===
        // Buscar patrones como "10 convidados", "4 acessos", "6 visitas"
        const accessPatterns = [
            /(\d+)\s*(?:convidado|convidados|guests?)/g,
            /(\d+)\s*(?:acesso|acessos|access)/g,
            /(\d+)\s*(?:visita|visitas|visits?)/g,
            /(\d+)\s*(?:entrada|entradas)/g,
            /(\d+)\s*(?:vez|vezes|times?)/g,
            /(\d+)\s*(?:por ano|por año|per year|\/ano|\/year)/g
        ];

        accessPatterns.forEach(pattern => {
            let match;
            const regex = new RegExp(pattern.source, 'gi');
            while ((match = regex.exec(text)) !== null) {
                const num = parseInt(match[1]);
                if (num > 0) {
                    // Escala: más accesos = más puntos (pero con diminishing returns)
                    if (num >= 20) points += 25;
                    else if (num >= 10) points += 20;
                    else if (num >= 6) points += 15;
                    else if (num >= 4) points += 10;
                    else if (num >= 2) points += 5;
                    else points += 2;
                }
            }
        });

        // === 4. BONUS ESPECIALES ===
        if (text.includes('select') || text.includes('prestige')) points += 10;
        if (text.includes('vip') && text.includes('internacional')) points += 8;
        if (text.includes('free') || text.includes('grátis') || text.includes('gratis')) points += 5;
        if (text.includes('acompanhante') || text.includes('companion')) points += 5;

        // === 5. NORMALIZAR A ESCALA 0-100 ===
        // Máximo teórico ~150 puntos, normalizamos
        const normalized = Math.min(100, Math.round((points / 150) * 100));
        
        return Math.max(0, normalized);
    },

    // Datos de ejemplo con salas VIP detalladas
    getExampleCards() {
        return [
            {
                id: 1,
                nome: 'Nubank Ultravioleta',
                bandeira: 'Mastercard',
                pais: 'Brasil',
                metodos: '2 pontos por dólar\nPontos nunca expiram\nTransfere para múltiplas companhias',
                salas_vip: 'LoungeKey ilimitado com 2 convidados por visita\nPriority Pass Select com acessos ilimitados',
                observacoes: 'Cashback 1% em todas compras\nSem anuidade para clientes Ultravioleta\nCartão em metal exclusivo',
                imagem: 'https://placehold.co/120x76/7B2D8E/white?text=Nubank',
                link: '#'
            },
            {
                id: 2,
                nome: 'C6 Carbon',
                bandeira: 'Mastercard',
                pais: 'Brasil',
                metodos: '2.5 pontos Átomos por dólar\nTransfere para Smiles, Latam Pass\nPontos não expiram',
                salas_vip: 'LoungeKey ilimitado\nDragon Pass ilimitado\nSala VIP C6 em Congonhas',
                observacoes: 'Tag de pedágio grátis\nSem anuidade\n6 cartões adicionais grátis',
                imagem: 'https://placehold.co/120x76/1A1A1A/white?text=C6',
                link: '#'
            },
            {
                id: 3,
                nome: 'BTG+ Black',
                bandeira: 'Mastercard',
                pais: 'Brasil',
                metodos: '1.5 pontos por dólar\nCashback investido automaticamente\nBônus em categorias',
                salas_vip: 'LoungeKey com 4 acessos por ano\nSala VIP BTG em aeroportos selecionados',
                observacoes: 'Cashback investido automaticamente\nSem anuidade com uso\nSeguro viagem incluso',
                imagem: 'https://placehold.co/120x76/00254D/white?text=BTG',
                link: '#'
            },
            {
                id: 4,
                nome: 'Inter Black',
                bandeira: 'Mastercard',
                pais: 'Brasil',
                metodos: '1% cashback geral\n2% em categorias selecionadas\nCashback sem limite',
                salas_vip: 'Mastercard Black Lounges\n4 acessos por ano\n1 acompanhante por visita',
                observacoes: 'Sem anuidade\nCashback sem limite\nCartão virtual instantâneo',
                imagem: 'https://placehold.co/120x76/FF7A00/white?text=Inter',
                link: '#'
            },
            {
                id: 5,
                nome: 'Caixa Ícone Visa Infinite',
                bandeira: 'Visa',
                pais: 'Brasil',
                metodos: '5 a 6 pontos por dólar\nPontos nunca expiram\n6 pontos em compras internacionais',
                salas_vip: 'LoungeKey ilimitado com 10 convidados por ano\nDragon Pass ilimitado com 10 convidados por ano\nVisa Infinite Lounges ilimitado',
                observacoes: 'Anuidade grátis para gastos acima de R$ 25 mil/mês\nClientes Private sem anuidade\n5 cartões adicionais grátis',
                imagem: 'https://placehold.co/120x76/003366/white?text=Caixa',
                link: '#'
            },
            {
                id: 6,
                nome: 'XP Visa Infinite',
                bandeira: 'Visa',
                pais: 'Brasil',
                metodos: '1% cashback em tudo\nCashback creditado na conta XP\nSem limite de cashback',
                salas_vip: 'Visa Infinite Lounges\n2 acessos por ano',
                observacoes: 'Sem anuidade\nCashback investido\nSaque grátis internacional',
                imagem: 'https://placehold.co/120x76/FFD700/333?text=XP',
                link: '#'
            },
            {
                id: 7,
                nome: 'Itaú Personnalité Black',
                bandeira: 'Mastercard',
                pais: 'Brasil',
                metodos: '3 pontos por dólar\nTransfere para múltiplos programas\nPontos expiram em 3 anos',
                salas_vip: 'LoungeKey com 6 acessos por ano\nSala VIP Personnalité GRU\n2 convidados por visita',
                observacoes: 'Concierge 24h\nSeguro premium\nAtualizações de voo',
                imagem: 'https://placehold.co/120x76/FF6600/white?text=Itau',
                link: '#'
            }
        ];
    },

    // Renderizar tarjetas
    render() {
        const container = Utils.$('cards-grid');
        if (!container) return;

        if (this.filtered.length === 0) {
            container.innerHTML = `
                <div class="cards-empty">
                    <i class="fas fa-credit-card"></i>
                    <h3>Nenhum cartão encontrado</h3>
                    <p>Tente ajustar os filtros</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filtered.map(card => this.renderCard(card)).join('');
        this.updateCount();
    },

    // Renderizar una tarjeta (diseño horizontal)
    renderCard(card) {
        const rankingColor = this.getRankingColor(card.ranking);
        
        return `
            <div class="card-row" data-id="${card.id}">
                <div class="card-row-header">
                    <div class="card-position" style="background: ${rankingColor}; color: white;">
                        ${card.posicion}°
                    </div>
                    <div class="card-thumb">
                        <img src="${card.imagem || 'https://placehold.co/120x76/666/white?text=Card'}" alt="${Utils.escapeHtml(card.nome)}">
                    </div>
                    <div class="card-main-info">
                        <h3 class="card-title">${Utils.escapeHtml(card.nome)}</h3>
                        <div class="card-subtitle">
                            <span class="card-pais"><i class="fas fa-globe"></i> ${Utils.escapeHtml(card.pais || 'N/A')}</span>
                            <span class="card-ranking" style="color: ${rankingColor}">
                                <i class="fas fa-star"></i> Ranking <strong>${card.ranking || 0}/100</strong>
                            </span>
                        </div>
                    </div>
                    <button class="card-btn-details" data-id="${card.id}">
                        <i class="fas fa-info-circle"></i> DETALLES
                    </button>
                </div>
                <div class="card-row-details">
                    <div class="card-detail-col">
                        <h4>MÉTODOS</h4>
                        <div class="card-detail-text">${this.formatMultiline(card.metodos)}</div>
                    </div>
                    <div class="card-detail-col">
                        <h4>SALAS VIP</h4>
                        <div class="card-detail-text">${this.formatMultiline(card.salas_vip)}</div>
                    </div>
                    <div class="card-detail-col card-detail-obs">
                        <div class="card-detail-text">${this.formatMultiline(card.observacoes)}</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Color según ranking
    getRankingColor(ranking) {
        if (ranking >= 90) return '#FFD700'; // Gold
        if (ranking >= 75) return '#C0C0C0'; // Silver
        if (ranking >= 60) return '#CD7F32'; // Bronze
        if (ranking >= 40) return '#4CAF50'; // Green
        if (ranking >= 20) return '#2196F3'; // Blue
        return '#9E9E9E'; // Gray
    },

    // Icono según ranking
    getRankingIcon(ranking) {
        if (ranking >= 90) return '🏆';
        if (ranking >= 75) return '🥈';
        if (ranking >= 60) return '🥉';
        if (ranking >= 40) return '⭐';
        return '';
    },

    // Formatear texto multilinea
    formatMultiline(text) {
        if (!text) return '<span class="text-muted">-</span>';
        return text.split('\n').map(line => `<p>${Utils.escapeHtml(line)}</p>`).join('');
    },

    // Filtrar tarjetas
    filter(filters) {
        this.filtered = this.data.filter(card => {
            // Búsqueda por texto
            if (filters.search) {
                const search = filters.search.toLowerCase();
                if (!card.nome.toLowerCase().includes(search) && 
                    !(card.pais || '').toLowerCase().includes(search)) {
                    return false;
                }
            }
            // Bandeira
            if (filters.bandeira && filters.bandeira !== 'all') {
                if ((card.bandeira || '').toLowerCase() !== filters.bandeira.toLowerCase()) {
                    return false;
                }
            }
            // País
            if (filters.pais && filters.pais !== 'all') {
                if ((card.pais || '').toLowerCase() !== filters.pais.toLowerCase()) {
                    return false;
                }
            }
            return true;
        });

        // Ordenar
        if (filters.sort) {
            switch (filters.sort) {
                case 'ranking':
                    this.filtered.sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
                    break;
                case 'nome':
                    this.filtered.sort((a, b) => a.nome.localeCompare(b.nome));
                    break;
                default: // posicion
                    this.filtered.sort((a, b) => (a.posicion || 99) - (b.posicion || 99));
            }
        }

        this.render();
    },

    // Actualizar contador
    updateCount() {
        const count = Utils.$('cards-count');
        if (count) {
            count.textContent = `${this.filtered.length} cartões`;
        }
    },

    // Mostrar modal de detalles
    showDetails(cardId) {
        const card = this.data.find(c => c.id === cardId);
        if (!card) return;

        // Remover modal anterior si existe
        const existing = document.querySelector('.card-modal');
        if (existing) existing.remove();

        const rankingColor = this.getRankingColor(card.ranking);

        const modal = document.createElement('div');
        modal.className = 'card-modal active';
        modal.innerHTML = `
            <div class="card-modal-content">
                <button class="card-modal-close">&times;</button>
                
                <div class="card-modal-header">
                    <div class="card-modal-ranking" style="background: ${rankingColor}">
                        <span class="ranking-pos">#${card.posicion}</span>
                        <span class="ranking-score">${card.ranking}/100</span>
                    </div>
                    <img src="${card.imagem || 'https://placehold.co/150x95/666/white?text=Card'}" alt="${Utils.escapeHtml(card.nome)}" class="card-modal-img">
                    <div class="card-modal-title-area">
                        <span class="card-modal-badge">${Utils.escapeHtml(card.bandeira || 'Card')}</span>
                        <h2>${Utils.escapeHtml(card.nome)}</h2>
                        <div class="card-modal-country">
                            <i class="fas fa-globe"></i> ${Utils.escapeHtml(card.pais || 'N/A')}
                        </div>
                    </div>
                </div>

                <div class="card-modal-body">
                    <div class="card-modal-section">
                        <h3><i class="fas fa-coins"></i> Métodos</h3>
                        <div class="card-modal-text">${this.formatMultiline(card.metodos)}</div>
                    </div>
                    
                    <div class="card-modal-section highlight">
                        <h3><i class="fas fa-plane"></i> Salas VIP <span class="ranking-badge" style="background: ${rankingColor}">${card.ranking} pts</span></h3>
                        <div class="card-modal-text">${this.formatMultiline(card.salas_vip)}</div>
                    </div>
                    
                    <div class="card-modal-section">
                        <h3><i class="fas fa-star"></i> Observações</h3>
                        <div class="card-modal-text">${this.formatMultiline(card.observacoes)}</div>
                    </div>
                </div>

                ${card.link && card.link !== '#' ? `
                <a href="${card.link}" class="card-modal-cta" target="_blank" rel="noopener">
                    <i class="fas fa-external-link-alt"></i> Solicitar Cartão
                </a>
                ` : ''}
            </div>
        `;

        document.body.appendChild(modal);
        
        // Eventos
        modal.querySelector('.card-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    // Recalcular rankings (llamar después de editar tarjetas)
    recalculate() {
        this.calculateRankings();
        this.render();
    },

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            const detailsBtn = e.target.closest('.card-btn-details');
            if (detailsBtn) {
                const id = parseInt(detailsBtn.dataset.id);
                this.showDetails(id);
            }
        });
    }
};

// Export global
window.Cards = Cards;
