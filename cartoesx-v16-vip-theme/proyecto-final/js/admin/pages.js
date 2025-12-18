// ============================================
// ADMIN/PAGES.JS - Páginas del Panel Admin
// ============================================

const AdminPages = {
    // ========== DASHBOARD ==========
    dashboard() {
        const stats = AdminStore.getStats();
        const activity = AdminStore.getActivity(10);

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div>
                        <h1>Dashboard</h1>
                        <p>Visão geral do sistema</p>
                    </div>
                </div>
            </div>

            <!-- Stats Row 1: Quiz -->
            <div class="stats-grid">
                ${StatsCard.render({
                    icon: 'fa-question-circle',
                    iconClass: 'blue',
                    value: stats.questions.total,
                    label: 'Perguntas',
                    sublabel: `${stats.questions.active} ativas`,
                    href: '#quiz-questions'
                })}
                ${StatsCard.render({
                    icon: 'fa-users',
                    iconClass: 'green',
                    value: stats.users.total,
                    label: 'Usuários',
                    sublabel: `${stats.users.active} ativos (7 dias)`,
                    href: '#quiz-users'
                })}
                ${StatsCard.render({
                    icon: 'fa-gamepad',
                    iconClass: 'purple',
                    value: stats.games.total,
                    label: 'Partidas',
                    sublabel: `${stats.games.score.toLocaleString()} pts total`,
                    href: '#quiz-activity'
                })}
                ${StatsCard.render({
                    icon: 'fa-trophy',
                    iconClass: 'orange',
                    value: Object.keys(QuizData.achievements).length,
                    label: 'Logros',
                    sublabel: 'Disponíveis',
                    href: '#quiz-achievements'
                })}
            </div>

            <!-- Stats Row 2: Content -->
            <div class="stats-grid">
                ${StatsCard.render({
                    icon: 'fa-credit-card',
                    iconClass: 'pink',
                    value: stats.cards,
                    label: 'Cartões',
                    href: '#cards'
                })}
                ${StatsCard.render({
                    icon: 'fa-images',
                    iconClass: 'teal',
                    value: stats.carousel,
                    label: 'Slides',
                    href: '#carousel'
                })}
            </div>

            <!-- Shortcuts -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-bolt"></i> Atalhos Rápidos</h2>
                </div>
                <div class="panel-body">
                    <div class="shortcuts-grid">
                        <a href="#quiz-questions" class="shortcut-card" onclick="AdminApp.navigate('quiz-questions'); AdminPages.showQuestionForm(); return false;">
                            <i class="fas fa-plus-circle"></i>
                            <h4>Nova Pergunta</h4>
                            <p>Adicionar ao quiz</p>
                        </a>
                        <a href="#cards" class="shortcut-card" onclick="AdminApp.navigate('cards'); AdminPages.showCardForm(); return false;">
                            <i class="fas fa-credit-card"></i>
                            <h4>Novo Cartão</h4>
                            <p>Cadastrar cartão</p>
                        </a>
                        <a href="#carousel" class="shortcut-card" onclick="AdminApp.navigate('carousel'); AdminPages.showSlideForm(); return false;">
                            <i class="fas fa-image"></i>
                            <h4>Novo Slide</h4>
                            <p>Adicionar slide</p>
                        </a>
                        <a href="quiz.html" target="_blank" class="shortcut-card">
                            <i class="fas fa-gamepad"></i>
                            <h4>Jogar Quiz</h4>
                            <p>Testar o jogo</p>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Questions by Difficulty -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-chart-pie"></i> Perguntas por Dificuldade</h2>
                </div>
                <div class="panel-body">
                    <div class="stats-grid">
                        <div class="stat-card" style="cursor: default;">
                            <div class="stat-icon" style="background: #22c55e;">
                                <i class="fas fa-smile"></i>
                            </div>
                            <div class="stat-info">
                                <h3>${stats.questions.byDiff.facil}</h3>
                                <p>Fácil</p>
                            </div>
                        </div>
                        <div class="stat-card" style="cursor: default;">
                            <div class="stat-icon" style="background: #f59e0b;">
                                <i class="fas fa-meh"></i>
                            </div>
                            <div class="stat-info">
                                <h3>${stats.questions.byDiff.media}</h3>
                                <p>Médio</p>
                            </div>
                        </div>
                        <div class="stat-card" style="cursor: default;">
                            <div class="stat-icon" style="background: #ef4444;">
                                <i class="fas fa-frown"></i>
                            </div>
                            <div class="stat-info">
                                <h3>${stats.questions.byDiff.dificil}</h3>
                                <p>Difícil</p>
                            </div>
                        </div>
                        <div class="stat-card" style="cursor: default;">
                            <div class="stat-icon" style="background: #a855f7;">
                                <i class="fas fa-skull"></i>
                            </div>
                            <div class="stat-info">
                                <h3>${stats.questions.byDiff.avancado}</h3>
                                <p>Avançado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-history"></i> Atividade Recente</h2>
                    <a href="#quiz-activity" class="btn btn-sm btn-secondary">Ver Todas</a>
                </div>
                <div class="panel-body">
                    ${activity.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-clock"></i>
                            <p>Nenhuma atividade registrada ainda.</p>
                        </div>
                    ` : `
                        <div class="activity-list">
                            ${activity.map(a => ActivityItem.render(a)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // ========== QUIZ QUESTIONS ==========
    quizQuestions() {
        const questions = AdminStore.getQuestions(AdminStore.state.filters);

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <div>
                        <h1>Perguntas do Quiz</h1>
                        <p>Gerencie as perguntas e respostas</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="AdminPages.showQuestionForm()">
                        <i class="fas fa-plus"></i> Nova Pergunta
                    </button>
                </div>
            </div>

            <!-- Toolbar -->
            <div class="toolbar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar pergunta..." id="search-questions" 
                           value="${AdminStore.state.filters.search || ''}"
                           oninput="AdminPages.filterQuestions()">
                </div>
                <select class="filter-select" id="filter-difficulty" onchange="AdminPages.filterQuestions()">
                    <option value="all">Todas dificuldades</option>
                    <option value="facil" ${AdminStore.state.filters.difficulty === 'facil' ? 'selected' : ''}>Fácil</option>
                    <option value="media" ${AdminStore.state.filters.difficulty === 'media' ? 'selected' : ''}>Médio</option>
                    <option value="dificil" ${AdminStore.state.filters.difficulty === 'dificil' ? 'selected' : ''}>Difícil</option>
                    <option value="avancado" ${AdminStore.state.filters.difficulty === 'avancado' ? 'selected' : ''}>Avançado</option>
                </select>
                <select class="filter-select" id="filter-status" onchange="AdminPages.filterQuestions()">
                    <option value="all">Todos status</option>
                    <option value="active" ${AdminStore.state.filters.status === 'active' ? 'selected' : ''}>Ativas</option>
                    <option value="inactive" ${AdminStore.state.filters.status === 'inactive' ? 'selected' : ''}>Inativas</option>
                </select>
            </div>

            <!-- Table -->
            <div class="panel">
                <div class="panel-body" style="padding: 0;">
                    ${AdminTable.render({
                        columns: [
                            { key: 'question', label: 'Pergunta', render: (v, item) => `
                                <span style="max-width: 350px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    ${item.image ? '<i class="fas fa-image" style="color: #3b82f6; margin-right: 6px;" title="Tem imagem"></i>' : ''}
                                    ${Utils.escapeHtml(v)}
                                </span>
                            ` },
                            { key: 'diff', label: 'Dificuldade', width: '120px', render: (v) => DiffBadge.render(v) },
                            { key: 'explanation', label: 'Explicação', width: '80px', render: (v) => v ? '<i class="fas fa-check-circle" style="color: #22c55e;" title="Tem explicação"></i>' : '<i class="fas fa-minus" style="color: #94a3b8;"></i>' },
                            { key: 'active', label: 'Status', width: '100px', render: (v) => v !== false ? '<span class="badge badge-success">Ativa</span>' : '<span class="badge badge-danger">Inativa</span>' }
                        ],
                        data: questions,
                        actions: [
                            { icon: 'fa-edit', class: 'edit', title: 'Editar', onclick: 'AdminPages.editQuestion' },
                            { icon: 'fa-trash', class: 'delete', title: 'Excluir', onclick: 'AdminPages.deleteQuestion' }
                        ],
                        emptyMessage: 'Nenhuma pergunta encontrada',
                        emptyIcon: 'fa-question-circle'
                    })}
                </div>
            </div>
        `;
    },

    filterQuestions() {
        AdminStore.state.filters.search = document.getElementById('search-questions')?.value || '';
        AdminStore.state.filters.difficulty = document.getElementById('filter-difficulty')?.value || 'all';
        AdminStore.state.filters.status = document.getElementById('filter-status')?.value || 'all';
        AdminApp.render();
    },

    showQuestionForm(question = null) {
        const isEdit = !!question;
        
        AdminModal.show({
            title: isEdit ? 'Editar Pergunta' : 'Nova Pergunta',
            body: `
                <form id="question-form">
                    <input type="hidden" name="id" value="${question?.id || ''}">
                    
                    ${AdminForm.textarea({
                        name: 'question',
                        label: 'Pergunta',
                        value: question?.question || '',
                        rows: 2,
                        required: true,
                        placeholder: 'Digite a pergunta...'
                    })}
                    
                    ${AdminForm.input({
                        name: 'image',
                        label: 'URL da Imagem (opcional)',
                        value: question?.image || '',
                        type: 'url',
                        placeholder: 'https://exemplo.com/imagem.jpg'
                    })}
                    
                    <div class="form-row">
                        ${AdminForm.input({ name: 'opt_0', label: 'Opção A', value: question?.options?.[0] || '', required: true })}
                        ${AdminForm.input({ name: 'opt_1', label: 'Opção B', value: question?.options?.[1] || '', required: true })}
                    </div>
                    <div class="form-row">
                        ${AdminForm.input({ name: 'opt_2', label: 'Opção C', value: question?.options?.[2] || '', required: true })}
                        ${AdminForm.input({ name: 'opt_3', label: 'Opção D', value: question?.options?.[3] || '', required: true })}
                    </div>
                    
                    <div class="form-row">
                        ${AdminForm.select({
                            name: 'correct',
                            label: 'Resposta Correta',
                            value: String(question?.correct ?? 0),
                            items: [
                                { value: '0', label: 'Opção A' },
                                { value: '1', label: 'Opção B' },
                                { value: '2', label: 'Opção C' },
                                { value: '3', label: 'Opção D' }
                            ],
                            required: true
                        })}
                        ${AdminForm.select({
                            name: 'diff',
                            label: 'Dificuldade',
                            value: question?.diff || 'facil',
                            items: [
                                { value: 'facil', label: '🟢 Fácil' },
                                { value: 'media', label: '🟡 Médio' },
                                { value: 'dificil', label: '🟠 Difícil' },
                                { value: 'avancado', label: '🔴 Avançado' }
                            ],
                            required: true
                        })}
                        <div class="form-group">
                            <label>💰 Pontos</label>
                            <div style="padding: 12px 15px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; border: 1px solid rgba(34, 197, 94, 0.3); color: #22c55e; font-weight: 600;">
                                Definido em Configuração → Pontos por Nível
                            </div>
                            <small style="color: #64748b; margin-top: 5px; display: block;">
                                Os pontos são baseados na dificuldade selecionada
                            </small>
                        </div>
                    </div>
                    
                    ${AdminForm.textarea({
                        name: 'explanation',
                        label: 'Explicação da Resposta (opcional)',
                        value: question?.explanation || '',
                        rows: 3,
                        placeholder: 'Explique por que esta é a resposta correta...'
                    })}
                    
                    ${AdminForm.checkbox({
                        name: 'active',
                        label: 'Pergunta ativa',
                        checked: question?.active !== false
                    })}
                </form>
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminPages.saveQuestion()">
                    <i class="fas fa-save"></i> Salvar
                </button>
            `
        });
    },

    editQuestion(id) {
        const question = AdminStore.state.questions.find(q => q.id === id);
        if (question) this.showQuestionForm(question);
    },

    saveQuestion() {
        const form = document.getElementById('question-form');
        const formData = new FormData(form);
        
        const data = {
            question: formData.get('question'),
            options: [
                formData.get('opt_0'),
                formData.get('opt_1'),
                formData.get('opt_2'),
                formData.get('opt_3')
            ],
            correct: parseInt(formData.get('correct')),
            diff: formData.get('diff'),
            // Points ahora viene de la config según dificultad - no se guarda individualmente
            image: formData.get('image') || '',
            explanation: formData.get('explanation') || '',
            active: form.querySelector('[name="active"]').checked
        };

        const id = formData.get('id');
        if (id) {
            AdminStore.updateQuestion(parseInt(id), data);
            AdminToast.success('Pergunta atualizada!');
        } else {
            AdminStore.addQuestion(data);
            AdminToast.success('Pergunta criada!');
        }

        AdminModal.close();
        AdminApp.render();
    },

    async deleteQuestion(id) {
        const confirmed = await AdminModal.confirm({
            title: 'Excluir Pergunta',
            message: 'Tem certeza que deseja excluir esta pergunta?',
            type: 'danger'
        });

        if (confirmed) {
            AdminStore.deleteQuestion(id);
            AdminToast.success('Pergunta excluída!');
            AdminApp.render();
        }
    },

    // ========== QUIZ USERS ==========
    quizUsers() {
        const users = AdminStore.getUsers(AdminStore.state.filters);

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div>
                        <h1>Usuários do Quiz</h1>
                        <p>Gerencie perfis e estatísticas</p>
                    </div>
                </div>
            </div>

            <!-- Toolbar -->
            <div class="toolbar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar usuário..." id="search-users" 
                           oninput="AdminPages.filterUsers()">
                </div>
            </div>

            <!-- Users Grid -->
            <div class="panel">
                <div class="panel-body">
                    ${users.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>Nenhum usuário encontrado</h3>
                        </div>
                    ` : users.map(user => `
                        <div class="user-card">
                            ${UserAvatar.render(user)}
                            <div class="user-card-info">
                                <h4>${Utils.escapeHtml(user.username || 'Usuário')}</h4>
                                <p>Desde ${new Date(user.created).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div class="user-card-stats">
                                <div class="user-card-stat">
                                    <strong>${user.stats?.score || 0}</strong>
                                    <small>Pontos</small>
                                </div>
                                <div class="user-card-stat">
                                    <strong>${user.stats?.games || 0}</strong>
                                    <small>Partidas</small>
                                </div>
                                <div class="user-card-stat">
                                    <strong>${user.achievements?.length || 0}</strong>
                                    <small>Logros</small>
                                </div>
                            </div>
                            <div class="table-actions">
                                <button class="btn btn-icon view" onclick="AdminPages.viewUser('${user.id}')" title="Ver detalhes">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-icon edit" onclick="AdminPages.editUser('${user.id}')" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-icon delete" onclick="AdminPages.deleteUser('${user.id}')" title="Excluir">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    filterUsers() {
        AdminStore.state.filters.search = document.getElementById('search-users')?.value || '';
        AdminApp.render();
    },

    viewUser(id) {
        const user = AdminStore.getUserById(id);
        if (!user) return;

        const avatar = QuizData.getAvatar(user.avatar || 'default_1');
        const achievements = (user.achievements || []).map(aid => QuizData.getAchievement(aid)).filter(Boolean);

        AdminModal.show({
            title: `Perfil: ${user.username}`,
            body: `
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="width: 80px; height: 80px; margin: 0 auto 12px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                        ${avatar.icon}
                    </div>
                    <h3>${Utils.escapeHtml(user.username)}</h3>
                    <p style="color: #64748b;">Criado em ${new Date(user.created).toLocaleDateString('pt-BR')}</p>
                </div>

                <div class="config-section">
                    <h3><i class="fas fa-chart-bar"></i> Estatísticas</h3>
                    <div class="config-grid">
                        <div class="config-item">
                            <label>Pontuação Total</label>
                            <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${user.stats?.score || 0}</div>
                        </div>
                        <div class="config-item">
                            <label>Partidas Jogadas</label>
                            <div style="font-size: 24px; font-weight: 700;">${user.stats?.games || 0}</div>
                        </div>
                        <div class="config-item">
                            <label>Acertos</label>
                            <div style="font-size: 24px; font-weight: 700; color: #22c55e;">${user.stats?.correct || 0}</div>
                        </div>
                        <div class="config-item">
                            <label>Erros</label>
                            <div style="font-size: 24px; font-weight: 700; color: #ef4444;">${user.stats?.wrong || 0}</div>
                        </div>
                    </div>
                </div>

                <div class="config-section">
                    <h3><i class="fas fa-layer-group"></i> Progresso por Nível</h3>
                    <div class="config-grid">
                        ${['facil', 'media', 'dificil', 'avancado'].map(level => `
                            <div class="config-item">
                                <label>${DiffBadge.render(level)}</label>
                                <div style="margin-top: 8px;">
                                    <div style="background: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden;">
                                        <div style="background: ${QuizData.getDifficulty(level).color}; height: 100%; width: ${(user.levels?.[level] || 0) * 100}%;"></div>
                                    </div>
                                    <small style="color: #64748b;">${Math.round((user.levels?.[level] || 0) * 100)}%</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${achievements.length > 0 ? `
                    <div class="config-section">
                        <h3><i class="fas fa-trophy"></i> Logros (${achievements.length})</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${achievements.map(a => `
                                <span class="badge" style="background: ${a.color}20; color: ${a.color}; padding: 6px 12px;">
                                    ${a.icon} ${a.name}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Fechar</button>
                <button class="btn btn-danger" onclick="AdminPages.resetUserStats('${user.id}')">
                    <i class="fas fa-redo"></i> Resetar Stats
                </button>
            `
        });
    },

    editUser(id) {
        const user = AdminStore.getUserById(id);
        if (!user) return;

        const avatarOptions = Object.entries(QuizData.avatars).map(([key, val]) => ({
            value: key,
            label: `${val.icon} ${val.name}`
        }));

        AdminModal.show({
            title: 'Editar Usuário',
            body: `
                <form id="user-form">
                    <input type="hidden" name="id" value="${user.id}">
                    ${AdminForm.input({
                        name: 'username',
                        label: 'Nome de usuário',
                        value: user.username || '',
                        required: true
                    })}
                    ${AdminForm.select({
                        name: 'avatar',
                        label: 'Avatar',
                        value: user.avatar || 'default_1',
                        items: avatarOptions
                    })}
                </form>
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminPages.saveUser()">
                    <i class="fas fa-save"></i> Salvar
                </button>
            `
        });
    },

    saveUser() {
        const form = document.getElementById('user-form');
        const formData = new FormData(form);
        
        const id = formData.get('id');
        const data = {
            username: formData.get('username'),
            avatar: formData.get('avatar')
        };

        AdminStore.updateUser(id, data);
        AdminToast.success('Usuário atualizado!');
        AdminModal.close();
        AdminApp.render();
    },

    async resetUserStats(id) {
        const confirmed = await AdminModal.confirm({
            title: 'Resetar Estatísticas',
            message: 'Isso irá zerar todos os pontos, logros e progresso deste usuário.',
            type: 'warning'
        });

        if (confirmed) {
            AdminStore.resetUserStats(id);
            AdminToast.success('Estatísticas resetadas!');
            AdminModal.close();
            AdminApp.render();
        }
    },

    async deleteUser(id) {
        const confirmed = await AdminModal.confirm({
            title: 'Excluir Usuário',
            message: 'Tem certeza que deseja excluir este usuário permanentemente?',
            type: 'danger'
        });

        if (confirmed) {
            AdminStore.deleteUser(id);
            AdminToast.success('Usuário excluído!');
            AdminApp.render();
        }
    },

    // ========== QUIZ ACHIEVEMENTS ==========
    quizAchievements() {
        const achievements = AdminStore.getAchievements();
        const customAchievements = AdminStore.getCustomAchievements();
        const allAchievements = [...achievements, ...customAchievements];

        // Stats por rareza
        const rarityStats = {
            common: allAchievements.filter(a => a.rarity === 'common').length,
            rare: allAchievements.filter(a => a.rarity === 'rare').length,
            epic: allAchievements.filter(a => a.rarity === 'epic').length,
            legendary: allAchievements.filter(a => a.rarity === 'legendary').length
        };

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div>
                        <h1>Logros</h1>
                        <p>Gerencie conquistas, rarezas e atribuições</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="AdminPages.showAchievementForm()">
                        <i class="fas fa-plus"></i> Novo Logro
                    </button>
                </div>
            </div>

            <!-- Stats de Rareza -->
            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #22c55e, #16a34a);">
                        <i class="fas fa-circle"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${rarityStats.common}</span>
                        <span class="stat-label">Comum</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${rarityStats.rare}</span>
                        <span class="stat-label">Raro</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #a855f7, #7c3aed);">
                        <i class="fas fa-crown"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${rarityStats.epic}</span>
                        <span class="stat-label">Épico</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${rarityStats.legendary}</span>
                        <span class="stat-label">Lendário</span>
                    </div>
                </div>
            </div>

            <div class="info-box info">
                <i class="fas fa-info-circle"></i>
                <span>Logros do sistema são desbloqueados automaticamente. Logros personalizados podem ser editados e atribuídos manualmente.</span>
            </div>

            <!-- Logros del Sistema -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-cog"></i> Logros do Sistema</h2>
                </div>
                <div class="panel-body" style="padding: 0;">
                    ${AdminTable.render({
                        columns: [
                            { key: 'icon', label: '', width: '50px', render: (v) => `<span style="font-size: 28px;">${v}</span>` },
                            { key: 'name', label: 'Nome', render: (v) => `<strong>${Utils.escapeHtml(v)}</strong>` },
                            { key: 'desc', label: 'Descrição', render: (v) => `<span style="color: #64748b;">${Utils.escapeHtml(v || '-')}</span>` },
                            { key: 'rarity', label: 'Raridade', width: '120px', render: (v, item) => this.renderRarityBadge(v, item.id, 'system') },
                            { key: 'usersUnlocked', label: 'Desbloqueado', width: '100px', render: (v) => `<span class="badge badge-secondary">${v} users</span>` }
                        ],
                        data: achievements,
                        actions: [
                            { icon: 'fa-edit', class: 'edit', title: 'Editar Raridade', onclick: 'AdminPages.editAchievementRarity' },
                            { icon: 'fa-gift', class: 'view', title: 'Atribuir', onclick: 'AdminPages.grantAchievementModal' }
                        ]
                    })}
                </div>
            </div>

            <!-- Logros Personalizados -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-magic"></i> Logros Personalizados</h2>
                </div>
                <div class="panel-body" style="padding: 0;">
                    ${customAchievements.length === 0 ? `
                        <div class="empty-state" style="padding: 40px;">
                            <i class="fas fa-sparkles" style="font-size: 48px; color: #a855f7; margin-bottom: 15px;"></i>
                            <h3>Nenhum logro personalizado</h3>
                            <p>Crie logros únicos para seu quiz!</p>
                            <button class="btn btn-primary" onclick="AdminPages.showAchievementForm()" style="margin-top: 15px;">
                                <i class="fas fa-plus"></i> Criar Primeiro Logro
                            </button>
                        </div>
                    ` : AdminTable.render({
                        columns: [
                            { key: 'icon', label: '', width: '50px', render: (v) => `<span style="font-size: 28px;">${v}</span>` },
                            { key: 'name', label: 'Nome', render: (v) => `<strong>${Utils.escapeHtml(v)}</strong>` },
                            { key: 'description', label: 'Descrição', render: (v) => `<span style="color: #64748b;">${Utils.escapeHtml(v || '-')}</span>` },
                            { key: 'rarity', label: 'Raridade', width: '120px', render: (v) => this.renderRarityBadge(v) },
                            { key: 'trigger', label: 'Gatilho', width: '120px', render: (v) => `<span class="badge badge-info">${this.getTriggerLabel(v)}</span>` }
                        ],
                        data: customAchievements,
                        actions: [
                            { icon: 'fa-edit', class: 'edit', title: 'Editar', onclick: 'AdminPages.editCustomAchievement' },
                            { icon: 'fa-gift', class: 'view', title: 'Atribuir', onclick: 'AdminPages.grantCustomAchievementModal' },
                            { icon: 'fa-trash', class: 'delete', title: 'Excluir', onclick: 'AdminPages.deleteCustomAchievement' }
                        ]
                    })}
                </div>
            </div>
        `;
    },

    renderRarityBadge(rarity, id = null, type = 'custom') {
        const colors = { common: '#22c55e', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
        const names = { common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário' };
        const icons = { common: '●', rare: '◆', epic: '★', legendary: '✦' };
        return `
            <span class="rarity-badge" style="background: ${colors[rarity] || colors.common}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                ${icons[rarity] || '●'} ${names[rarity] || rarity}
            </span>
        `;
    },

    getTriggerLabel(trigger) {
        const labels = {
            manual: 'Manual',
            points: 'Pontos',
            games: 'Partidas',
            streak: 'Sequência',
            accuracy: 'Precisão',
            time: 'Tempo'
        };
        return labels[trigger] || trigger || 'Manual';
    },

    showAchievementForm(achievement = null) {
        const isEdit = !!achievement;
        
        // Lista de emojis sugeridos
        const emojiSuggestions = ['🏆', '⭐', '🎯', '🔥', '💎', '👑', '🎮', '🚀', '💫', '🌟', '⚡', '🎪', '🎭', '🎨', '🎵'];

        AdminModal.show({
            title: isEdit ? 'Editar Logro' : 'Novo Logro Personalizado',
            body: `
                <form id="achievement-form">
                    <input type="hidden" name="id" value="${achievement?.id || ''}">
                    
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--gray-200);">
                        <h4 style="color: var(--text-primary); font-size: 14px; margin-bottom: 15px;"><i class="fas fa-palette"></i> Aparência</h4>
                        <div class="form-row">
                            <div class="form-group" style="flex: 0 0 100px;">
                                <label>Ícone</label>
                                <input type="text" name="icon" id="ach-icon-input" value="${achievement?.icon || '🏆'}" style="font-size: 28px; text-align: center; padding: 8px;" maxlength="4" required>
                            </div>
                            ${AdminForm.input({ name: 'name', label: 'Nome do Logro', value: achievement?.name || '', required: true, placeholder: 'Ex: Mestre dos Cartões' })}
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px;">
                            ${emojiSuggestions.map(e => `<span class="emoji-pick" data-emoji="${e}" style="cursor: pointer; font-size: 18px; padding: 5px 8px; border-radius: 6px; background: var(--gray-100); transition: all 0.2s;">${e}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--gray-200);">
                        <h4 style="color: var(--text-primary); font-size: 14px; margin-bottom: 15px;"><i class="fas fa-info-circle"></i> Informações</h4>
                        ${AdminForm.textarea({ name: 'description', label: 'Descrição', value: achievement?.description || '', rows: 2, placeholder: 'Descreva como conquistar este logro...' })}
                    </div>
                    
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--gray-200);">
                        <h4 style="color: var(--text-primary); font-size: 14px; margin-bottom: 15px;"><i class="fas fa-gem"></i> Raridade</h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                            ${['common', 'rare', 'epic', 'legendary'].map(r => {
                                const info = {
                                    common: { color: '#22c55e', icon: '●', name: 'Comum' },
                                    rare: { color: '#3b82f6', icon: '◆', name: 'Raro' },
                                    epic: { color: '#a855f7', icon: '★', name: 'Épico' },
                                    legendary: { color: '#f59e0b', icon: '✦', name: 'Lendário' }
                                }[r];
                                const checked = (achievement?.rarity || 'common') === r;
                                return `
                                    <label class="rarity-opt" data-rarity="${r}" style="cursor: pointer; padding: 12px 8px; border-radius: 10px; text-align: center; background: ${info.color}15; border: 2px solid ${checked ? info.color : 'transparent'}; transition: all 0.2s;">
                                        <input type="radio" name="rarity" value="${r}" ${checked ? 'checked' : ''} style="display: none;">
                                        <span style="font-size: 20px; display: block;">${info.icon}</span>
                                        <span style="color: ${info.color}; font-weight: 600; font-size: 12px;">${info.name}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="color: var(--text-primary); font-size: 14px; margin-bottom: 15px;"><i class="fas fa-bolt"></i> Gatilho</h4>
                        <div class="form-row">
                            ${AdminForm.select({
                                name: 'trigger',
                                label: 'Tipo',
                                value: achievement?.trigger || 'manual',
                                items: [
                                    { value: 'manual', label: 'Manual' },
                                    { value: 'points', label: 'Pontos' },
                                    { value: 'games', label: 'Partidas' },
                                    { value: 'streak', label: 'Sequência' },
                                    { value: 'accuracy', label: 'Precisão %' }
                                ]
                            })}
                            ${AdminForm.input({ name: 'triggerValue', label: 'Valor', value: achievement?.triggerValue || '', type: 'number', placeholder: 'Ex: 100' })}
                        </div>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminPages.saveAchievement()">
                    <i class="fas fa-save"></i> ${isEdit ? 'Atualizar' : 'Criar'} Logro
                </button>
            `
        });

        // Bind eventos después de crear el modal
        setTimeout(() => {
            // Emoji picker
            document.querySelectorAll('.emoji-pick').forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = document.getElementById('ach-icon-input');
                    if (input) input.value = this.dataset.emoji;
                });
            });
            
            // Rarity selector
            document.querySelectorAll('.rarity-opt').forEach(opt => {
                opt.addEventListener('click', function() {
                    document.querySelectorAll('.rarity-opt').forEach(o => {
                        o.style.borderColor = 'transparent';
                    });
                    const colors = { common: '#22c55e', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
                    this.style.borderColor = colors[this.dataset.rarity];
                });
            });
        }, 50);
    },

    saveAchievement() {
        const form = document.getElementById('achievement-form');
        const formData = new FormData(form);
        
        const data = {
            icon: formData.get('icon') || '🏆',
            name: formData.get('name'),
            description: formData.get('description'),
            rarity: formData.get('rarity') || 'common',
            trigger: formData.get('trigger') || 'manual',
            triggerValue: parseInt(formData.get('triggerValue')) || 0
        };

        if (!data.name) {
            AdminToast.error('Nome é obrigatório!');
            return;
        }

        const id = formData.get('id');
        if (id) {
            AdminStore.updateCustomAchievement(id, data);
            AdminToast.success('Logro atualizado!');
        } else {
            AdminStore.addCustomAchievement(data);
            AdminToast.success('Logro criado!');
        }

        AdminModal.close();
        AdminApp.render();
    },

    editCustomAchievement(id) {
        const achievement = AdminStore.getCustomAchievementById(id);
        if (achievement) this.showAchievementForm(achievement);
    },

    async deleteCustomAchievement(id) {
        const confirmed = await AdminModal.confirm({
            title: 'Excluir Logro',
            message: 'Tem certeza que deseja excluir este logro personalizado?',
            type: 'danger'
        });

        if (confirmed) {
            AdminStore.deleteCustomAchievement(id);
            AdminToast.success('Logro excluído!');
            AdminApp.render();
        }
    },

    editAchievementRarity(achievementId) {
        const achievement = QuizData.getAchievement(achievementId);
        const currentRarity = AdminStore.getAchievementRarity(achievementId) || achievement?.rarity || 'common';
        const colors = { common: '#22c55e', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
        const names = { common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário' };
        const icons = { common: '●', rare: '◆', epic: '★', legendary: '✦' };

        AdminModal.show({
            title: `Editar Raridade: ${achievement?.name || achievementId}`,
            body: `
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 48px;">${achievement?.icon || '🏆'}</span>
                    <h3 style="margin-top: 10px;">${achievement?.name || 'Logro'}</h3>
                    <small style="color: #64748b;">${achievement?.desc || ''}</small>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${['common', 'rare', 'epic', 'legendary'].map(r => `
                        <label class="rarity-edit-opt" data-rarity="${r}" style="cursor: pointer; padding: 15px; border-radius: 12px; text-align: center; background: ${colors[r]}20; border: 2px solid ${currentRarity === r ? colors[r] : 'transparent'}; transition: all 0.2s;">
                            <input type="radio" name="newRarity" value="${r}" ${currentRarity === r ? 'checked' : ''} style="display: none;">
                            <span style="font-size: 24px;">${icons[r]}</span>
                            <div style="color: ${colors[r]}; font-weight: 600; margin-top: 5px;">${names[r]}</div>
                        </label>
                    `).join('')}
                </div>
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminPages.saveAchievementRarity('${achievementId}')">
                    <i class="fas fa-save"></i> Salvar
                </button>
            `
        });

        // Bind eventos
        setTimeout(() => {
            document.querySelectorAll('.rarity-edit-opt').forEach(opt => {
                opt.addEventListener('click', function() {
                    const colors = { common: '#22c55e', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
                    document.querySelectorAll('.rarity-edit-opt').forEach(o => {
                        o.style.borderColor = 'transparent';
                    });
                    this.style.borderColor = colors[this.dataset.rarity];
                });
            });
        }, 50);
    },

    saveAchievementRarity(achievementId) {
        const newRarity = document.querySelector('[name="newRarity"]:checked')?.value;
        if (newRarity) {
            AdminStore.setAchievementRarity(achievementId, newRarity);
            AdminToast.success('Raridade atualizada!');
            AdminModal.close();
            AdminApp.render();
        }
    },

    grantCustomAchievementModal(achievementId) {
        this.grantAchievementModal(achievementId);
    },

    grantAchievementModal(achievementId) {
        const users = AdminStore.getUsers();
        const achievement = QuizData.getAchievement(achievementId) || AdminStore.getCustomAchievementById(achievementId);

        AdminModal.show({
            title: `Atribuir: ${achievement?.name || achievementId}`,
            body: `
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 48px;">${achievement?.icon || '🏆'}</span>
                    <h3 style="margin-top: 10px;">${achievement?.name || 'Logro'}</h3>
                </div>
                <p style="margin-bottom: 16px;">Selecione o usuário que receberá este logro:</p>
                ${AdminForm.select({
                    name: 'userId',
                    label: 'Usuário',
                    items: users.map(u => ({ value: u.id, label: `${QuizData.getAvatar(u.avatar).icon} ${u.username}` }))
                })}
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-success" onclick="AdminPages.grantAchievement('${achievementId}')">
                    <i class="fas fa-gift"></i> Atribuir
                </button>
            `
        });
    },

    grantAchievement(achievementId) {
        const userId = document.querySelector('[name="userId"]')?.value;
        if (!userId) return;

        const success = AdminStore.grantAchievement(userId, achievementId);
        if (success) {
            AdminToast.success('Logro atribuído com sucesso!');
        } else {
            AdminToast.warning('Usuário já possui este logro.');
        }
        AdminModal.close();
        AdminApp.render();
    },

    // ========== QUIZ ACTIVITY ==========
    quizActivity() {
        const activity = AdminStore.getActivity(50);

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-history"></i>
                    </div>
                    <div>
                        <h1>Log de Atividades</h1>
                        <p>Histórico de eventos do quiz</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-danger" onclick="AdminPages.clearActivity()">
                        <i class="fas fa-trash"></i> Limpar Log
                    </button>
                </div>
            </div>

            <div class="panel">
                <div class="panel-body">
                    ${activity.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-clock"></i>
                            <h3>Nenhuma atividade registrada</h3>
                            <p>As atividades aparecerão aqui conforme os usuários jogam.</p>
                        </div>
                    ` : `
                        <div class="activity-list">
                            ${activity.map(a => ActivityItem.render(a)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    async clearActivity() {
        const confirmed = await AdminModal.confirm({
            title: 'Limpar Log',
            message: 'Deseja excluir todo o histórico de atividades?',
            type: 'warning'
        });

        if (confirmed) {
            AdminStore.clearActivity();
            AdminToast.success('Log limpo!');
            AdminApp.render();
        }
    },

    // ========== QUIZ CONFIG ==========
    quizConfig() {
        const config = AdminStore.state.config;

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div>
                        <h1>Configuração do Quiz</h1>
                        <p>Regras, pontos e desbloqueios</p>
                    </div>
                </div>
            </div>

            <form id="config-form">
                <!-- Regras de Desbloqueio -->
                <div class="panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-lock-open"></i> Regras de Desbloqueio Semanal</h2>
                    </div>
                    <div class="panel-body">
                        <div class="info-box info">
                            <i class="fas fa-info-circle"></i>
                            <span>"Completar" = perguntas respondidas (não exige acerto, apenas participação).</span>
                        </div>
                        <div class="config-grid">
                            <div class="config-item">
                                <label>Desbloquear Médio</label>
                                <input type="number" name="unlock_media" value="${config.unlockRules?.media?.requirement || 80}" min="0" max="100">
                                <small style="color: #64748b;">% do Fácil completado</small>
                            </div>
                            <div class="config-item">
                                <label>Desbloquear Difícil</label>
                                <input type="number" name="unlock_dificil" value="${config.unlockRules?.dificil?.requirement || 90}" min="0" max="100">
                                <small style="color: #64748b;">% do Médio completado</small>
                            </div>
                            <div class="config-item">
                                <label>Desbloquear Avançado</label>
                                <input type="number" name="unlock_avancado" value="${config.unlockRules?.avancado?.requirement || 100}" min="0" max="100">
                                <small style="color: #64748b;">% de todos os níveis</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cooldown 12h -->
                <div class="panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-clock"></i> Limite de Pontos (Cooldown 12h)</h2>
                    </div>
                    <div class="panel-body">
                        <div class="info-box warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Cada nível tem cooldown independente. Após acumular pontos em um nível, o usuário deve aguardar 12h para acumular novamente naquele nível.</span>
                        </div>
                        <div class="config-grid">
                            <div class="config-item">
                                <label>Cooldown Habilitado</label>
                                <select name="cooldown_enabled">
                                    <option value="true" ${config.cooldown?.enabled !== false ? 'selected' : ''}>Sim</option>
                                    <option value="false" ${config.cooldown?.enabled === false ? 'selected' : ''}>Não</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>Horas de Cooldown</label>
                                <input type="number" name="cooldown_hours" value="${config.cooldown?.hours || 12}" min="1" max="48">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pontos por Nível -->
                <div class="panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-coins"></i> Pontos por Nível</h2>
                    </div>
                    <div class="panel-body">
                        <div class="info-box info" style="margin-bottom: 20px;">
                            <i class="fas fa-info-circle"></i>
                            <span>Estes valores definem os pontos base de <strong>todas as perguntas</strong> (Quiz + Campanha + Prática) baseado na dificuldade.</span>
                        </div>
                        <div class="config-grid">
                            <div class="config-item">
                                <label>🟢 Fácil</label>
                                <input type="number" name="points_facil" value="${config.points?.facil || 100}" min="1">
                                <small>Floresta Inicial</small>
                            </div>
                            <div class="config-item">
                                <label>🟡 Médio</label>
                                <input type="number" name="points_media" value="${config.points?.media || 150}" min="1">
                                <small>Planícies</small>
                            </div>
                            <div class="config-item">
                                <label>🟠 Difícil</label>
                                <input type="number" name="points_dificil" value="${config.points?.dificil || 200}" min="1">
                                <small>Montanhas</small>
                            </div>
                            <div class="config-item">
                                <label>🔴 Avançado</label>
                                <input type="number" name="points_avancado" value="${config.points?.avancado || 250}" min="1">
                                <small>Eventos Especiais</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tempo -->
                <div class="panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-hourglass-half"></i> Tempo por Nível (segundos)</h2>
                    </div>
                    <div class="panel-body">
                        <div class="config-grid">
                            <div class="config-item">
                                <label>🟢 Fácil</label>
                                <input type="number" name="time_facil" value="${config.time?.facil || 30}" min="5" max="120">
                            </div>
                            <div class="config-item">
                                <label>🟡 Médio</label>
                                <input type="number" name="time_media" value="${config.time?.media || 25}" min="5" max="120">
                            </div>
                            <div class="config-item">
                                <label>🟠 Difícil</label>
                                <input type="number" name="time_dificil" value="${config.time?.dificil || 20}" min="5" max="120">
                            </div>
                            <div class="config-item">
                                <label>🔴 Avançado</label>
                                <input type="number" name="time_avancado" value="${config.time?.avancado || 15}" min="5" max="120">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Otras opciones -->
                <div class="panel">
                    <div class="panel-header">
                        <h2><i class="fas fa-sliders-h"></i> Otras Opciones</h2>
                    </div>
                    <div class="panel-body">
                        <div class="config-grid">
                            <div class="config-item">
                                <label>Preguntas por Partida</label>
                                <input type="number" name="questionsPerGame" value="${config.questionsPerGame || 10}" min="5" max="50">
                            </div>
                            <div class="config-item">
                                <label>Aleatorizar Preguntas</label>
                                <select name="shuffleQuestions">
                                    <option value="true" ${config.shuffleQuestions !== false ? 'selected' : ''}>Sim (Fisher-Yates)</option>
                                    <option value="false" ${config.shuffleQuestions === false ? 'selected' : ''}>Não</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>Aleatorizar Respostas</label>
                                <select name="shuffleAnswers">
                                    <option value="true" ${config.shuffleAnswers !== false ? 'selected' : ''}>Sim (Fisher-Yates)</option>
                                    <option value="false" ${config.shuffleAnswers === false ? 'selected' : ''}>Não</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="AdminPages.resetConfig()">
                        <i class="fas fa-undo"></i> Restaurar Padrões
                    </button>
                    <button type="submit" class="btn btn-primary" onclick="AdminPages.saveConfig(event)">
                        <i class="fas fa-save"></i> Salvar Configurações
                    </button>
                </div>
            </form>
        `;
    },

    saveConfig(e) {
        e.preventDefault();
        const form = document.getElementById('config-form');
        const formData = new FormData(form);

        // Preservar la config del carrusel existente
        const existingCarouselConfig = AdminStore.state.config?.carousel || {
            hallOfFameCount: 3,
            highlightsCount: 3
        };

        const config = {
            unlockRules: {
                media: { requirement: parseInt(formData.get('unlock_media')), type: 'completion' },
                dificil: { requirement: parseInt(formData.get('unlock_dificil')), type: 'completion' },
                avancado: { requirement: parseInt(formData.get('unlock_avancado')), type: 'all_levels' }
            },
            cooldown: {
                enabled: formData.get('cooldown_enabled') === 'true',
                hours: parseInt(formData.get('cooldown_hours')),
                byLevel: true
            },
            points: {
                facil: parseInt(formData.get('points_facil')),
                media: parseInt(formData.get('points_media')),
                dificil: parseInt(formData.get('points_dificil')),
                avancado: parseInt(formData.get('points_avancado'))
            },
            time: {
                facil: parseInt(formData.get('time_facil')),
                media: parseInt(formData.get('time_media')),
                dificil: parseInt(formData.get('time_dificil')),
                avancado: parseInt(formData.get('time_avancado'))
            },
            questionsPerGame: parseInt(formData.get('questionsPerGame')),
            shuffleQuestions: formData.get('shuffleQuestions') === 'true',
            shuffleAnswers: formData.get('shuffleAnswers') === 'true',
            messages: AdminStore.state.config.messages,
            carousel: existingCarouselConfig
        };

        AdminStore.saveConfig(config);
        AdminToast.success('Configurações salvas!');
    },

    resetConfig() {
        Storage.remove('cartoesx_admin_config');
        AdminStore.state.config = AdminStore.getConfig();
        AdminToast.success('Configurações restauradas!');
        AdminApp.render();
    },

    // ========== CARDS ==========
    cards() {
        const cards = AdminStore.getCards(AdminStore.state.filters);

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-credit-card"></i>
                    </div>
                    <div>
                        <h1>Cartões</h1>
                        <p>Gerencie os cartões do site</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="AdminPages.showCardForm()">
                        <i class="fas fa-plus"></i> Novo Cartão
                    </button>
                </div>
            </div>

            <div class="toolbar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar cartão..." id="search-cards" oninput="AdminPages.filterCards()">
                </div>
            </div>

            <div class="panel">
                <div class="panel-body" style="padding: 0;">
                    ${AdminTable.render({
                        columns: [
                            { key: 'imagem', label: '', width: '60px', render: (v) => `<img src="${v || CONFIG.placeholders.card}" style="width: 50px; height: 32px; object-fit: cover; border-radius: 4px;">` },
                            { key: 'nome', label: 'Nome', render: (v) => `<strong>${Utils.escapeHtml(v || '-')}</strong>` },
                            { key: 'bandeira', label: 'Bandeira', width: '100px' },
                            { key: 'pais', label: 'País', width: '100px' },
                            { key: 'ranking', label: 'Ranking', width: '80px', render: (v) => v ? `#${v}` : '-' }
                        ],
                        data: cards,
                        actions: [
                            { icon: 'fa-edit', class: 'edit', title: 'Editar', onclick: 'AdminPages.editCard' },
                            { icon: 'fa-trash', class: 'delete', title: 'Excluir', onclick: 'AdminPages.deleteCard' }
                        ],
                        emptyMessage: 'Nenhum cartão cadastrado',
                        emptyIcon: 'fa-credit-card'
                    })}
                </div>
            </div>
        `;
    },

    filterCards() {
        AdminStore.state.filters.search = document.getElementById('search-cards')?.value || '';
        AdminApp.render();
    },

    showCardForm(card = null) {
        const isEdit = !!card;

        AdminModal.show({
            title: isEdit ? 'Editar Cartão' : 'Novo Cartão',
            body: `
                <form id="card-form">
                    <input type="hidden" name="id" value="${card?.id || ''}">
                    
                    <div class="form-row">
                        ${AdminForm.input({ name: 'nome', label: 'Nome do Cartão', value: card?.nome || '', required: true })}
                        ${AdminForm.select({
                            name: 'bandeira',
                            label: 'Bandeira',
                            value: card?.bandeira || 'Mastercard',
                            items: ['Mastercard', 'Visa', 'Elo', 'Amex']
                        })}
                    </div>
                    
                    <div class="form-row">
                        ${AdminForm.input({ name: 'pais', label: 'País', value: card?.pais || 'Brasil' })}
                        ${AdminForm.input({ name: 'imagem', label: 'URL da Imagem', value: card?.imagem || '', type: 'url' })}
                    </div>
                    
                    ${AdminForm.textarea({ name: 'metodos', label: 'Métodos (um por linha)', value: card?.metodos || '', rows: 3 })}
                    ${AdminForm.textarea({ name: 'salas_vip', label: 'Salas VIP (um por linha)', value: card?.salas_vip || '', rows: 3, hint: 'Determina o ranking automático' })}
                    ${AdminForm.textarea({ name: 'observacoes', label: 'Observações (um por linha)', value: card?.observacoes || '', rows: 3 })}
                    ${AdminForm.input({ name: 'link', label: 'Link de Solicitação', value: card?.link || '', type: 'url' })}
                </form>
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminPages.saveCard()">
                    <i class="fas fa-save"></i> Salvar
                </button>
            `
        });
    },

    editCard(id) {
        const card = AdminStore.state.cards.find(c => c.id === id);
        if (card) this.showCardForm(card);
    },

    saveCard() {
        const form = document.getElementById('card-form');
        const formData = new FormData(form);
        
        const data = {
            nome: formData.get('nome'),
            bandeira: formData.get('bandeira'),
            pais: formData.get('pais'),
            imagem: formData.get('imagem'),
            metodos: formData.get('metodos'),
            salas_vip: formData.get('salas_vip'),
            observacoes: formData.get('observacoes'),
            link: formData.get('link')
        };

        const id = formData.get('id');
        if (id) {
            AdminStore.updateCard(parseInt(id), data);
            AdminToast.success('Cartão atualizado!');
        } else {
            AdminStore.addCard(data);
            AdminToast.success('Cartão criado!');
        }

        AdminModal.close();
        AdminApp.render();
    },

    async deleteCard(id) {
        const confirmed = await AdminModal.confirm({
            title: 'Excluir Cartão',
            message: 'Tem certeza?',
            type: 'danger'
        });

        if (confirmed) {
            AdminStore.deleteCard(id);
            AdminToast.success('Cartão excluído!');
            AdminApp.render();
        }
    },

    // ========== CAROUSEL ==========
    carousel() {
        const slides = AdminStore.getCarousel();
        const config = AdminStore.state.config;
        const hallCount = config?.carousel?.hallOfFameCount || 3;
        const highlightsCount = config?.carousel?.highlightsCount || 3;

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon">
                        <i class="fas fa-images"></i>
                    </div>
                    <div>
                        <h1>Carrossel</h1>
                        <p>Gerencie slides e configurações do carrossel</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="AdminPages.showSlideForm()">
                        <i class="fas fa-plus"></i> Novo Slide
                    </button>
                </div>
            </div>

            <!-- Configuração Hall da Fama e Logros -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-sliders-h"></i> Configuração dos Slides Automáticos</h2>
                </div>
                <div class="panel-body">
                    <div class="info-box info" style="margin-bottom: 20px;">
                        <i class="fas fa-info-circle"></i>
                        <span>Hall da Fama e Logros Recentes são gerados automaticamente. Clique nas cards para ver detalhes.</span>
                    </div>
                    <form id="carousel-config-form" onsubmit="AdminPages.saveCarouselConfig(event)">
                        <div class="config-grid">
                            <div class="config-item">
                                <label><i class="fas fa-trophy" style="color: #fbbf24;"></i> Hall da Fama</label>
                                <input type="number" name="hallOfFameCount" value="${hallCount}" min="3" max="10">
                                <small style="color: #64748b;">Jogadores exibidos (3-10)</small>
                            </div>
                            <div class="config-item">
                                <label><i class="fas fa-star" style="color: #a855f7;"></i> Logros Recentes</label>
                                <input type="number" name="highlightsCount" value="${highlightsCount}" min="3" max="10">
                                <small style="color: #64748b;">Logros exibidos (3-10)</small>
                            </div>
                            <div class="config-item" style="display: flex; align-items: flex-end;">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Salvar Config
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Slides Personalizados -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-image"></i> Slides Personalizados</h2>
                </div>
                <div class="panel-body" style="padding: 0;">
                    ${AdminTable.render({
                        columns: [
                            { key: 'imageUrl', label: '', width: '80px', render: (v) => `<img src="${v || CONFIG.placeholders.slide}" style="width: 70px; height: 40px; object-fit: cover; border-radius: 4px;">` },
                            { key: 'title', label: 'Título', render: (v) => `<strong>${Utils.escapeHtml(v || '-')}</strong>` },
                            { key: 'text', label: 'Texto', render: (v) => `<span style="max-width: 250px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${Utils.escapeHtml(v || '-')}</span>` }
                        ],
                        data: slides,
                        actions: [
                            { icon: 'fa-edit', class: 'edit', title: 'Editar', onclick: 'AdminPages.editSlide' },
                            { icon: 'fa-trash', class: 'delete', title: 'Excluir', onclick: 'AdminPages.deleteSlide' }
                        ],
                        emptyMessage: 'Nenhum slide cadastrado',
                        emptyIcon: 'fa-images'
                    })}
                </div>
            </div>
        `;
    },

    saveCarouselConfig(e) {
        e.preventDefault();
        const form = document.getElementById('carousel-config-form');
        const formData = new FormData(form);
        
        const hallCount = Math.min(10, Math.max(3, parseInt(formData.get('hallOfFameCount')) || 3));
        const highlightsCount = Math.min(10, Math.max(3, parseInt(formData.get('highlightsCount')) || 3));
        
        const config = AdminStore.state.config || AdminStore.getConfig();
        config.carousel = {
            hallOfFameCount: hallCount,
            highlightsCount: highlightsCount
        };
        
        AdminStore.saveConfig(config);
        AdminToast.success('Configuração do carrossel salva!');
        
        // Atualizar carrossel no index se existir
        if (typeof window.updateHallDaFama === 'function') {
            window.updateHallDaFama();
        }
    },

    showSlideForm(slide = null) {
        const isEdit = !!slide;

        AdminModal.show({
            title: isEdit ? 'Editar Slide' : 'Novo Slide',
            body: `
                <form id="slide-form">
                    <input type="hidden" name="id" value="${slide?.id || ''}">
                    ${AdminForm.input({ name: 'title', label: 'Título', value: slide?.title || '', required: true })}
                    ${AdminForm.textarea({ name: 'text', label: 'Texto', value: slide?.text || '', rows: 2 })}
                    ${AdminForm.input({ name: 'imageUrl', label: 'URL da Imagem', value: slide?.imageUrl || '', type: 'url' })}
                    ${AdminForm.input({ name: 'link', label: 'Link (opcional)', value: slide?.link || '', type: 'url' })}
                </form>
            `,
            footer: `
                <button class="btn btn-secondary" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminPages.saveSlide()">
                    <i class="fas fa-save"></i> Salvar
                </button>
            `
        });
    },

    editSlide(id) {
        const slide = AdminStore.state.carousel.find(s => s.id === id);
        if (slide) this.showSlideForm(slide);
    },

    saveSlide() {
        const form = document.getElementById('slide-form');
        const formData = new FormData(form);
        
        const data = {
            title: formData.get('title'),
            text: formData.get('text'),
            imageUrl: formData.get('imageUrl'),
            link: formData.get('link')
        };

        const id = formData.get('id');
        if (id) {
            AdminStore.updateSlide(parseInt(id), data);
            AdminToast.success('Slide atualizado!');
        } else {
            AdminStore.addSlide(data);
            AdminToast.success('Slide criado!');
        }

        AdminModal.close();
        AdminApp.render();
    },

    async deleteSlide(id) {
        const confirmed = await AdminModal.confirm({
            title: 'Excluir Slide',
            message: 'Tem certeza?',
            type: 'danger'
        });

        if (confirmed) {
            AdminStore.deleteSlide(id);
            AdminToast.success('Slide excluído!');
            AdminApp.render();
        }
    },

    // ========== RESET PAGE ==========
    reset() {
        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                        <h1>Reset & Backup</h1>
                        <p>Ações de manutenção do sistema</p>
                    </div>
                </div>
            </div>

            <!-- Backup -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-download"></i> Backup de Dados</h2>
                </div>
                <div class="panel-body">
                    <p style="margin-bottom: 16px;">Exporte todos os dados do sistema para um arquivo JSON.</p>
                    <button class="btn btn-primary" onclick="AdminPages.exportData()">
                        <i class="fas fa-download"></i> Exportar Dados
                    </button>
                </div>
            </div>

            <!-- Import -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-upload"></i> Importar Dados</h2>
                </div>
                <div class="panel-body">
                    <p style="margin-bottom: 16px;">Importe dados de um arquivo JSON exportado anteriormente.</p>
                    <input type="file" id="import-file" accept=".json" style="display: none;" onchange="AdminPages.importData(event)">
                    <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">
                        <i class="fas fa-upload"></i> Selecionar Arquivo
                    </button>
                </div>
            </div>

            <!-- Danger Zone -->
            <div class="danger-zone">
                <h3><i class="fas fa-skull-crossbones"></i> Zona de Perigo</h3>
                <p>Estas ações são irreversíveis. Faça backup antes de executar.</p>
                
                <div class="danger-actions">
                    <button class="btn btn-danger" onclick="AdminPages.resetQuiz()">
                        <i class="fas fa-gamepad"></i> Resetar Quiz
                    </button>
                    <button class="btn btn-danger" onclick="AdminPages.resetAll()">
                        <i class="fas fa-bomb"></i> Resetar TUDO
                    </button>
                </div>
            </div>
        `;
    },

    exportData() {
        const data = AdminStore.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cartoesx-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        AdminToast.success('Backup exportado!');
    },

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                const confirmed = await AdminModal.confirm({
                    title: 'Importar Dados',
                    message: 'Isso irá sobrescrever os dados atuais. Continuar?',
                    type: 'warning'
                });

                if (confirmed) {
                    AdminStore.importData(data);
                    AdminToast.success('Dados importados!');
                    AdminApp.render();
                }
            } catch (err) {
                AdminToast.error('Erro ao importar: arquivo inválido');
            }
        };
        reader.readAsText(file);
    },

    async resetQuiz() {
        const confirmed = await AdminModal.doubleConfirm({
            title: 'Resetar Quiz',
            message: 'Isso irá excluir todos os perfis, ranking e atividades do quiz.',
            confirmWord: 'RESETAR',
            finalMessage: 'Todos os dados do quiz serão perdidos permanentemente!'
        });

        if (confirmed) {
            AdminStore.resetQuizData();
            AdminToast.success('Quiz resetado!');
            AdminApp.render();
        }
    },

    async resetAll() {
        const confirmed = await AdminModal.doubleConfirm({
            title: 'Resetar TUDO',
            message: 'Isso irá excluir TODOS os dados: quiz, cartões, carrossel e configurações.',
            confirmWord: 'EXCLUIR TUDO',
            finalMessage: 'Esta ação é PERMANENTE e não pode ser desfeita!'
        });

        if (confirmed) {
            AdminStore.resetAllData();
            AdminToast.success('Sistema resetado!');
            AdminApp.render();
        }
    }
};

// Export
window.AdminPages = AdminPages;
