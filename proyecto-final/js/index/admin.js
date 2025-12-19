// ============================================
// INDEX/ADMIN.JS - Panel Administrativo
// ============================================

const Admin = {
    isOpen: false,
    currentTab: 'cards',

    // Inicializar
    init() {
        this.createPanel();
        this.bindEvents();
        
        // Abrir automáticamente si viene del quiz
        if (localStorage.getItem('openAdminPanel') === 'true') {
            localStorage.removeItem('openAdminPanel');
            setTimeout(() => this.open(), 500);
        }
    },

    // Crear panel
    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'admin-panel';
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div class="admin-overlay"></div>
            <div class="admin-content">
                <div class="admin-header">
                    <h2><i class="fas fa-cog"></i> Painel Administrativo</h2>
                    <button class="admin-close" id="admin-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="admin-tabs">
                    <button class="admin-tab active" data-tab="cards"><i class="fas fa-credit-card"></i> Cartões</button>
                    <button class="admin-tab" data-tab="carousel"><i class="fas fa-images"></i> Carrossel</button>
                    <button class="admin-tab" data-tab="quiz"><i class="fas fa-gamepad"></i> Quiz</button>
                    <button class="admin-tab" data-tab="users"><i class="fas fa-users"></i> Usuários</button>
                    <!-- NUEVA PESTAÑA DE CONFIGURACIÓN -->
                    <button class="admin-tab" data-tab="config"><i class="fas fa-sliders-h"></i> Configuração</button>
                </div>
                <div class="admin-body">
                    <div class="admin-tab-content active" id="tab-cards">
                        ${this.renderCardsTab()}
                    </div>
                    <div class="admin-tab-content" id="tab-carousel">
                        ${this.renderCarouselTab()}
                    </div>
                    <div class="admin-tab-content" id="tab-quiz">
                        ${this.renderQuizTab()}
                    </div>
                    <div class="admin-tab-content" id="tab-users">
                        ${this.renderUsersTab()}
                    </div>
                    <!-- NUEVO CONTENIDO PARA CONFIGURACIÓN -->
                    <div class="admin-tab-content" id="tab-config">
                        ${this.renderConfigTab()}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    },

    // Renderizar tab de Cartões
    renderCardsTab() {
        return `
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-plus"></i> Novo Cartão</h3>
                </div>
                <div class="admin-info-box">
                    <i class="fas fa-info-circle"></i>
                    <span><strong>Ranking Automático:</strong> A posição e o ranking são calculados automaticamente baseados nas Salas VIP. Quanto mais acessos ilimitados e programas VIP, maior o ranking!</span>
                </div>
                <form class="admin-form" id="form-new-card">
                    <div class="admin-form-row">
                        <div class="admin-form-group">
                            <label>Nome do Cartão</label>
                            <input type="text" id="card-nome" required placeholder="Ex: Nubank Ultravioleta">
                        </div>
                        <div class="admin-form-group">
                            <label>Bandeira</label>
                            <select id="card-bandeira">
                                <option value="Mastercard">Mastercard</option>
                                <option value="Visa">Visa</option>
                                <option value="Elo">Elo</option>
                                <option value="Amex">Amex</option>
                            </select>
                        </div>
                        <div class="admin-form-group">
                            <label>País</label>
                            <input type="text" id="card-pais" placeholder="Ex: Brasil">
                        </div>
                    </div>
                    <div class="admin-form-group">
                        <label>URL da Imagem</label>
                        <input type="url" id="card-imagem" placeholder="https://...">
                    </div>
                    <div class="admin-form-group">
                        <label>Métodos (uma linha por item)</label>
                        <textarea id="card-metodos" rows="3" placeholder="2 pontos por dólar&#10;Pontos nunca expiram"></textarea>
                    </div>
                    <div class="admin-form-group">
                        <label><i class="fas fa-star" style="color: gold;"></i> Salas VIP (determina o ranking - uma linha por item)</label>
                        <textarea id="card-salas" rows="4" placeholder="LoungeKey ilimitado com 2 convidados&#10;Priority Pass Select&#10;Dragon Pass com 10 acessos por ano"></textarea>
                        <small class="admin-hint">Dica: Use palavras como "ilimitado", "unlimited", números de acessos (ex: "10 convidados"), nomes de programas (LoungeKey, Priority Pass, Dragon Pass)</small>
                    </div>
                    <div class="admin-form-group">
                        <label>Observações (uma linha por item)</label>
                        <textarea id="card-observacoes" rows="3" placeholder="Sem anuidade&#10;Cartão metal"></textarea>
                    </div>
                    <div class="admin-form-group">
                        <label>Link de Solicitação</label>
                        <input type="url" id="card-link" placeholder="https://...">
                    </div>
                    <button type="submit" class="admin-btn primary">
                        <i class="fas fa-save"></i> Salvar Cartão
                    </button>
                </form>
            </div>
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-list"></i> Cartões Cadastrados</h3>
                    <span class="admin-badge" id="cards-total">0</span>
                </div>
                <div class="admin-list" id="admin-cards-list"></div>
            </div>
        `;
    },

    // Renderizar tab de Carrossel
    renderCarouselTab() {
        return `
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-plus"></i> Novo Slide</h3>
                </div>
                <form class="admin-form" id="form-new-slide">
                    <div class="admin-form-group">
                        <label>Título</label>
                        <input type="text" id="slide-title" required placeholder="Título do slide">
                    </div>
                    <div class="admin-form-group">
                        <label>Texto</label>
                        <textarea id="slide-text" rows="2" placeholder="Descrição do slide"></textarea>
                    </div>
                    <div class="admin-form-group">
                        <label>URL da Imagem de Fundo</label>
                        <input type="url" id="slide-image" placeholder="https://...">
                    </div>
                    <div class="admin-form-group">
                        <label>Link (opcional)</label>
                        <input type="url" id="slide-link" placeholder="https://...">
                    </div>
                    <button type="submit" class="admin-btn primary">
                        <i class="fas fa-save"></i> Adicionar Slide
                    </button>
                </form>
            </div>
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-images"></i> Slides do Carrossel</h3>
                    <span class="admin-badge" id="slides-total">0</span>
                </div>
                <p class="admin-note">
                    <i class="fas fa-info-circle"></i> 
                    O "Hall da Fama" e "Logros Recentes" são gerados automaticamente do Quiz.
                </p>
                <div class="admin-list" id="admin-slides-list"></div>
            </div>
        `;
    },

    // Renderizar tab de Quiz
    renderQuizTab() {
        return `
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-plus"></i> Nova Pergunta</h3>
                </div>
                <form class="admin-form" id="form-new-question">
                    <div class="admin-form-group">
                        <label>Pergunta</label>
                        <textarea id="question-text" rows="2" required placeholder="Digite a pergunta"></textarea>
                    </div>
                    <div class="admin-form-row">
                        <div class="admin-form-group">
                            <label>Opção A</label>
                            <input type="text" id="question-opt-a" required>
                        </div>
                        <div class="admin-form-group">
                            <label>Opção B</label>
                            <input type="text" id="question-opt-b" required>
                        </div>
                    </div>
                    <div class="admin-form-row">
                        <div class="admin-form-group">
                            <label>Opção C</label>
                            <input type="text" id="question-opt-c" required>
                        </div>
                        <div class="admin-form-group">
                            <label>Opção D</label>
                            <input type="text" id="question-opt-d" required>
                        </div>
                    </div>
                    <div class="admin-form-row">
                        <div class="admin-form-group">
                            <label>Resposta Correta</label>
                            <select id="question-correct">
                                <option value="0">A</option>
                                <option value="1">B</option>
                                <option value="2">C</option>
                                <option value="3">D</option>
                            </select>
                        </div>
                        <div class="admin-form-group">
                            <label>Dificuldade</label>
                            <select id="question-diff">
                                <option value="facil">Fácil</option>
                                <option value="media">Médio</option>
                                <option value="dificil">Difícil</option>
                                <option value="avancado">Avançado</option>
                            </select>
                        </div>
                    </div>
                    <div class="admin-form-group">
                        <label class="admin-checkbox">
                            <input type="checkbox" id="question-weekly">
                            <span>Pergunta Semanal Especial (requer 90%+ precisão)</span>
                        </label>
                    </div>
                    <button type="submit" class="admin-btn primary">
                        <i class="fas fa-save"></i> Salvar Pergunta
                    </button>
                </form>
            </div>
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-question-circle"></i> Perguntas Cadastradas</h3>
                    <span class="admin-badge" id="questions-total">0</span>
                </div>
                <div class="admin-list" id="admin-questions-list"></div>
            </div>
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-star"></i> Pergunta Semanal</h3>
                </div>
                <div class="admin-weekly-info">
                    <p><i class="fas fa-info-circle"></i> A pergunta semanal aparece para jogadores com 90%+ de precisão.</p>
                    <p><strong>Semana atual:</strong> ${Utils.getCurrentWeek()}</p>
                </div>
            </div>
        `;
    },

    // Renderizar tab de Usuarios
    renderUsersTab() {
        return `
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-users"></i> Perfis do Quiz</h3>
                    <span class="admin-badge" id="profiles-total">0</span>
                </div>
                <div class="admin-list" id="admin-profiles-list"></div>
            </div>
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-trophy"></i> Ranking Global</h3>
                </div>
                <div class="admin-list" id="admin-ranking-list"></div>
            </div>
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-trash"></i> Limpeza de Dados</h3>
                </div>
                <div class="admin-danger-zone">
                    <button class="admin-btn danger" id="btn-clear-ranking">
                        <i class="fas fa-trophy"></i> Limpar Ranking
                    </button>
                    <button class="admin-btn danger" id="btn-clear-profiles">
                        <i class="fas fa-users"></i> Limpar Perfis
                    </button>
                    <button class="admin-btn danger" id="btn-reset-quiz">
                        <i class="fas fa-redo"></i> Resetar Quiz
                    </button>
                </div>
            </div>
        `;
    },

    // NUEVA FUNCIÓN: Renderizar tab de Configuración
    renderConfigTab() {
        // Cargar configuración guardada o usar valores por defecto
        const savedConfig = localStorage.getItem('quizDifficultyConfig');
        let config;
        if (savedConfig) {
            try {
                config = JSON.parse(savedConfig);
            } catch(e) {
                console.error('Error al cargar configuración:', e);
                config = QuizData.difficulties;
            }
        } else {
            config = QuizData.difficulties;
        }
        
        // Cargar otros parámetros
        const bonusFast = localStorage.getItem('quizBonusFast') || '5';
        const penaltyWrong = localStorage.getItem('quizPenaltyWrong') || '0';
        const streakBonus = localStorage.getItem('quizStreakBonus') || '10';
        
        return `
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-sliders-h"></i> Sistema de Pontos</h3>
                </div>
                <form class="admin-form" id="form-config-points">
                    <div class="admin-form-group">
                        <label>Pontuação Base por Dificuldade</label>
                        <div class="admin-config-grid">
                            ${Object.entries(config).map(([key, diff]) => `
                                <div class="admin-config-item">
                                    <h4 style="color: ${diff.color || '#22c55e'}">${diff.name}</h4>
                                    <div class="admin-form-row">
                                        <div class="admin-form-group">
                                            <label>Pontos</label>
                                            <input type="number" id="config-points-${key}" 
                                                   value="${diff.points}" min="0" max="1000" step="10"
                                                   style="border-color: ${diff.color || '#22c55e'}">
                                        </div>
                                        <div class="admin-form-group">
                                            <label>Tempo (seg)</label>
                                            <input type="number" id="config-time-${key}" 
                                                   value="${diff.time}" min="5" max="60" step="5"
                                                   style="border-color: ${diff.color || '#22c55e'}">
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="admin-form-group">
                        <label>Bônus e Penalidades</label>
                        <div class="admin-form-row">
                            <div class="admin-form-group">
                                <label><i class="fas fa-bolt" style="color: #f59e0b;"></i> Bônus por Resposta Rápida</label>
                                <input type="number" id="config-bonus-fast" value="${bonusFast}" min="0" max="50" step="1">
                                <small>Pontos extras para respostas em menos de 3 segundos</small>
                            </div>
                            <div class="admin-form-group">
                                <label><i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> Penalidade por Erro</label>
                                <input type="number" id="config-penalty-wrong" value="${penaltyWrong}" min="0" max="50" step="1">
                                <small>Pontos perdidos por resposta errada (0 para não penalizar)</small>
                            </div>
                        </div>
                        <div class="admin-form-row">
                            <div class="admin-form-group">
                                <label><i class="fas fa-fire" style="color: #dc2626;"></i> Bônus por Sequência</label>
                                <input type="number" id="config-streak-bonus" value="${streakBonus}" min="0" max="100" step="5">
                                <small>Pontos extras após 5 respostas corretas seguidas</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-form-actions">
                        <button type="submit" class="admin-btn primary">
                            <i class="fas fa-save"></i> Salvar Configuração
                        </button>
                        <button type="button" class="admin-btn secondary" onclick="Admin.resetConfig()">
                            <i class="fas fa-undo"></i> Restaurar Padrão
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="admin-section">
                <div class="admin-section-header">
                    <h3><i class="fas fa-info-circle"></i> Configuração Atual</h3>
                </div>
                <div class="admin-info-box">
                    <div class="config-current">
                        ${Object.entries(config).map(([key, diff]) => `
                            <div class="config-item">
                                <span class="config-label" style="color: ${diff.color}">${diff.name}:</span>
                                <span class="config-value">${diff.points} pts • ${diff.time}s</span>
                            </div>
                        `).join('')}
                        <div class="config-item">
                            <span class="config-label">Bônus Rápido:</span>
                            <span class="config-value">${bonusFast} pts</span>
                        </div>
                        <div class="config-item">
                            <span class="config-label">Penalidade Erro:</span>
                            <span class="config-value">${penaltyWrong} pts</span>
                        </div>
                        <div class="config-item">
                            <span class="config-label">Bônus Sequência:</span>
                            <span class="config-value">${streakBonus} pts</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Abrir panel
    open() {
        if (!Auth.isAdmin()) {
            alert('Acesso negado. Você precisa ser administrador.');
            return;
        }
        const panel = Utils.$('admin-panel');
        if (panel) {
            panel.classList.add('active');
            this.isOpen = true;
            this.refreshCurrentTab();
        }
    },

    // Cerrar panel
    close() {
        const panel = Utils.$('admin-panel');
        if (panel) {
            panel.classList.remove('active');
            this.isOpen = false;
        }
    },

    // Cambiar tab
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Actualizar tabs activos
        Utils.$$('.admin-tab').forEach(t => t.classList.remove('active'));
        Utils.$$('.admin-tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`.admin-tab[data-tab="${tabName}"]`)?.classList.add('active');
        Utils.$(`tab-${tabName}`)?.classList.add('active');
        
        this.refreshCurrentTab();
    },

    // Refrescar tab actual
    refreshCurrentTab() {
        switch (this.currentTab) {
            case 'cards':
                this.renderCardsList();
                break;
            case 'carousel':
                this.renderSlidesList();
                break;
            case 'quiz':
                this.renderQuestionsList();
                break;
            case 'users':
                this.renderUsersList();
                break;
            case 'config':
                // No necesita recargar, ya está renderizado
                break;
        }
    },

    // Renderizar lista de cartões
    renderCardsList() {
        const list = Utils.$('admin-cards-list');
        const total = Utils.$('cards-total');
        if (!list) return;

        const cards = Storage.getCards();
        if (total) total.textContent = cards.length;

        if (cards.length === 0) {
            list.innerHTML = '<p class="admin-empty">Nenhum cartão cadastrado</p>';
            return;
        }

        // Ordenar por ranking para mostrar
        const sortedCards = [...cards].sort((a, b) => (b.ranking || 0) - (a.ranking || 0));

        list.innerHTML = sortedCards.map((card, index) => {
            const rankColor = card.ranking >= 90 ? '#FFD700' : card.ranking >= 75 ? '#C0C0C0' : card.ranking >= 60 ? '#CD7F32' : '#4CAF50';
            return `
                <div class="admin-list-item">
                    <div class="admin-item-pos" style="background: ${rankColor}; color: white;">${index + 1}°</div>
                    <img src="${card.imagem || 'https://placehold.co/60x38/666/white?text=Card'}" alt="${Utils.escapeHtml(card.nome)}" class="admin-item-thumb">
                    <div class="admin-item-info">
                        <strong>${Utils.escapeHtml(card.nome)}</strong>
                        <span>${card.bandeira} • ${card.pais || 'N/A'} • <i class="fas fa-star" style="color: ${rankColor}"></i> Ranking: ${card.ranking || 0}/100</span>
                    </div>
                    <div class="admin-item-actions">
                        <button class="admin-btn-icon" onclick="Admin.editCard(${card.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="admin-btn-icon danger" onclick="Admin.deleteCard(${card.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Renderizar lista de slides
    renderSlidesList() {
        const list = Utils.$('admin-slides-list');
        const total = Utils.$('slides-total');
        if (!list) return;

        const slides = Storage.getCarousel();
        if (total) total.textContent = slides.length;

        if (slides.length === 0) {
            list.innerHTML = '<p class="admin-empty">Nenhum slide personalizado</p>';
            return;
        }

        list.innerHTML = slides.map((slide, i) => `
            <div class="admin-list-item">
                <div class="admin-item-thumb" style="background-image: url('${slide.imageUrl || ''}'); background-size: cover;"></div>
                <div class="admin-item-info">
                    <strong>${Utils.escapeHtml(slide.title || 'Sem título')}</strong>
                    <span>${Utils.escapeHtml(slide.text || '').substring(0, 50)}...</span>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-btn-icon danger" onclick="Admin.deleteSlide(${i})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Renderizar lista de preguntas
    renderQuestionsList() {
        const list = Utils.$('admin-questions-list');
        const total = Utils.$('questions-total');
        if (!list) return;

        const questions = Storage.getQuizQuestions();
        if (total) total.textContent = questions.length;

        if (questions.length === 0) {
            list.innerHTML = '<p class="admin-empty">Nenhuma pergunta cadastrada</p>';
            return;
        }

        const diffColors = { facil: '#22c55e', media: '#f59e0b', dificil: '#ef4444', avancado: '#a855f7' };
        list.innerHTML = questions.map((q, i) => `
            <div class="admin-list-item">
                <div class="admin-item-info" style="flex: 1;">
                    <strong>${Utils.escapeHtml(q.question).substring(0, 60)}...</strong>
                    <span>
                        <span style="color: ${diffColors[q.diff] || '#888'}">${q.diff}</span>
                        ${q.weekly ? '<span class="admin-tag">SEMANAL</span>' : ''}
                    </span>
                </div>
                    <div class="admin-item-actions">
                        <button class="admin-btn-icon danger" onclick="Admin.deleteQuestion(${i})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
    },

    // Renderizar lista de usuarios
    renderUsersList() {
        const profilesList = Utils.$('admin-profiles-list');
        const rankingList = Utils.$('admin-ranking-list');
        const profilesTotal = Utils.$('profiles-total');
        
        // Perfiles
        const profiles = Storage.getQuizProfiles();
        if (profilesTotal) profilesTotal.textContent = profiles.length;

        if (profilesList) {
            if (profiles.length === 0) {
                profilesList.innerHTML = '<p class="admin-empty">Nenhum perfil</p>';
            } else {
                profilesList.innerHTML = profiles.map(p => {
                    const avatar = QuizData.getAvatar(p.avatar);
                    return `
                        <div class="admin-list-item">
                            <div class="admin-item-avatar">${avatar.icon}</div>
                            <div class="admin-item-info">
                                <strong>${Utils.escapeHtml(p.username)}</strong>
                                <span>🎮 ${p.stats?.games || 0} • 🏆 ${p.stats?.score || 0} pts</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Ranking
        const ranking = Storage.getQuizRanking().slice(0, 10);
        if (rankingList) {
            if (ranking.length === 0) {
                rankingList.innerHTML = '<p class="admin-empty">Ranking vazio</p>';
            } else {
                rankingList.innerHTML = ranking.map((r, i) => `
                    <div class="admin-list-item">
                        <div class="admin-item-pos">${i + 1}º</div>
                        <div class="admin-item-info">
                            <strong>${Utils.escapeHtml(r.name)}</strong>
                            <span>${r.score} pts • ${r.correct}/${r.total || 10} acertos</span>
                        </div>
                    </div>
                `).join('');
            }
        }
    },

    // NUEVA FUNCIÓN: Guardar configuración de puntos
    saveConfig(e) {
        e.preventDefault();
        
        const newConfig = {};
        for (const key in QuizData.difficulties) {
            newConfig[key] = {
                ...QuizData.difficulties[key],
                points: parseInt(Utils.$(`config-points-${key}`).value) || 100,
                time: parseInt(Utils.$(`config-time-${key}`).value) || 30
            };
        }
        
        // Guardar en localStorage
        localStorage.setItem('quizDifficultyConfig', JSON.stringify(newConfig));
        
        // Guardar otros parámetros
        localStorage.setItem('quizBonusFast', Utils.$('config-bonus-fast').value);
        localStorage.setItem('quizPenaltyWrong', Utils.$('config-penalty-wrong').value);
        localStorage.setItem('quizStreakBonus', Utils.$('config-streak-bonus').value);
        
        // Actualizar el objeto en memoria
        Object.assign(QuizData.difficulties, newConfig);
        
        // IMPORTANTE: Aplicar la configuración a VIP Journey, Estudo Premium, etc.
        if (typeof QuizData.applyConfigToOtherModes === 'function') {
            QuizData.applyConfigToOtherModes();
        }
        
        // Mostrar mensaje de éxito
        alert('✅ Configuração salva com sucesso!\nAs alterações foram aplicadas a todos os modos (Quiz, VIP Journey, Estudo Premium).');
        
        // Recargar la pestaña para mostrar los valores actualizados
        this.switchTab('config');
    },

    // NUEVA FUNCIÓN: Restaurar configuración por defecto
    resetConfig() {
        if (!confirm('Restaurar configuração padrão?\nTodos os valores serão redefinidos.')) return;
        
        // Eliminar configuración personalizada
        localStorage.removeItem('quizDifficultyConfig');
        localStorage.removeItem('quizBonusFast');
        localStorage.removeItem('quizPenaltyWrong');
        localStorage.removeItem('quizStreakBonus');
        
        // Recargar página para aplicar cambios
        location.reload();
    },

    // Guardar nuevo cartão
    saveCard(e) {
        e.preventDefault();
        const card = {
            id: Date.now(),
            nome: Utils.$('card-nome').value.trim(),
            bandeira: Utils.$('card-bandeira').value,
            pais: Utils.$('card-pais').value.trim(),
            metodos: Utils.$('card-metodos').value.trim(),
            salas_vip: Utils.$('card-salas').value.trim(),
            observacoes: Utils.$('card-observacoes').value.trim(),
            imagem: Utils.$('card-imagem').value.trim(),
            link: Utils.$('card-link').value.trim()
        };

        const cards = Storage.getCards();
        cards.push(card);
        Storage.saveCards(cards);
        
        e.target.reset();
        
        // Recargar datos y recalcular rankings
        Cards.data = cards;
        Cards.calculateRankings(); // Esto recalcula y reordena automáticamente
        
        this.renderCardsList();
        alert('Cartão salvo com sucesso! Ranking calculado automaticamente.');
    },

    // Eliminar cartão
    deleteCard(id) {
        if (!confirm('Tem certeza que deseja excluir este cartão?')) return;
        let cards = Storage.getCards();
        cards = cards.filter(c => c.id !== id);
        Storage.saveCards(cards);
        
        // Recargar y recalcular rankings
        Cards.data = cards;
        Cards.calculateRankings();
        
        this.renderCardsList();
    },

    // Guardar nuevo slide
    saveSlide(e) {
        e.preventDefault();
        const slide = {
            id: Date.now(),
            title: Utils.$('slide-title').value.trim(),
            text: Utils.$('slide-text').value.trim(),
            imageUrl: Utils.$('slide-image').value.trim(),
            link: Utils.$('slide-link').value.trim()
        };

        const slides = Storage.getCarousel();
        slides.push(slide);
        Storage.saveCarousel(slides);
        
        e.target.reset();
        this.renderSlidesList();
        Carousel.render();
        alert('Slide adicionado!');
    },

    // Eliminar slide
    deleteSlide(index) {
        if (!confirm('Tem certeza?')) return;
        const slides = Storage.getCarousel();
        slides.splice(index, 1);
        Storage.saveCarousel(slides);
        this.renderSlidesList();
        Carousel.render();
    },

    // Guardar nueva pregunta
    saveQuestion(e) {
        e.preventDefault();
        const question = {
            id: Date.now(),
            question: Utils.$('question-text').value.trim(),
            options: [
                Utils.$('question-opt-a').value.trim(),
                Utils.$('question-opt-b').value.trim(),
                Utils.$('question-opt-c').value.trim(),
                Utils.$('question-opt-d').value.trim()
            ],
            correct: parseInt(Utils.$('question-correct').value),
            diff: Utils.$('question-diff').value,
            weekly: Utils.$('question-weekly').checked
        };

        const questions = Storage.getQuizQuestions();
        questions.push(question);
        Storage.saveQuizQuestions(questions);
        
        e.target.reset();
        this.renderQuestionsList();
        alert('Pergunta salva!');
    },

    // Eliminar pregunta
    deleteQuestion(index) {
        if (!confirm('Tem certeza?')) return;
        const questions = Storage.getQuizQuestions();
        questions.splice(index, 1);
        Storage.saveQuizQuestions(questions);
        this.renderQuestionsList();
    },

    // Limpiar ranking
    clearRanking() {
        if (!confirm('Limpar todo o ranking?')) return;
        Storage.saveQuizRanking([]);
        this.renderUsersList();
        Carousel.render();
        alert('Ranking limpo!');
    },

    // Limpiar perfiles
    clearProfiles() {
        if (!confirm('Excluir todos os perfis? Esta ação não pode ser desfeita.')) return;
        Storage.saveQuizProfiles([]);
        Storage.clearQuizCurrentProfile();
        this.renderUsersList();
        alert('Perfis excluídos!');
    },

    // Resetear quiz
    resetQuiz() {
        if (!confirm('Resetar completamente o Quiz? Todos os dados serão perdidos.')) return;
        localStorage.removeItem(CONFIG.storage.quizInit);
        localStorage.removeItem(CONFIG.storage.quizProfiles);
        localStorage.removeItem(CONFIG.storage.quizCurrent);
        localStorage.removeItem(CONFIG.storage.quizRanking);
        localStorage.removeItem(CONFIG.storage.quizActivity);
        localStorage.removeItem(CONFIG.storage.quizHighlights);
        localStorage.removeItem(CONFIG.storage.quizQuestions);
        
        // Reinicializar
        QuizInit.initExampleData();
        this.renderUsersList();
        Carousel.render();
        alert('Quiz resetado! Dados de exemplo restaurados.');
    },

    // Vincular eventos
    bindEvents() {
        // Cerrar panel
        Utils.$('admin-close')?.addEventListener('click', () => this.close());
        Utils.$('admin-panel')?.querySelector('.admin-overlay')?.addEventListener('click', () => this.close());

        // Tabs
        Utils.$$('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Formularios
        Utils.$('form-new-card')?.addEventListener('submit', (e) => this.saveCard(e));
        Utils.$('form-new-slide')?.addEventListener('submit', (e) => this.saveSlide(e));
        Utils.$('form-new-question')?.addEventListener('submit', (e) => this.saveQuestion(e));
        Utils.$('form-config-points')?.addEventListener('submit', (e) => this.saveConfig(e));

        // Botones de limpieza
        Utils.$('btn-clear-ranking')?.addEventListener('click', () => this.clearRanking());
        Utils.$('btn-clear-profiles')?.addEventListener('click', () => this.clearProfiles());
        Utils.$('btn-reset-quiz')?.addEventListener('click', () => this.resetQuiz());
    }
};

// Export global
window.Admin = Admin;