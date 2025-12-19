// ============================================
// QUIZ/UI.JS - Interfaz de Usuario del Quiz
// ============================================

const QuizUI = {
    // Mostrar pantalla
    showScreen(screenId) {
        Utils.$$('.quiz-screen').forEach(s => s.classList.remove('active'));
        Utils.$(screenId)?.classList.add('active');
    },

    // Verificar perfil y mostrar pantalla correcta
    checkAndShowScreen() {
        const profile = QuizProfile.loadCurrent();
        if (profile) {
            this.showRankingScreen();
        } else {
            this.showScreen('screen-login');
        }
    },

    // === PANTALLA: Login de Perfil ===
    showLoginScreen() {
        this.showScreen('screen-login');
    },

    // === PANTALLA: Registro de Perfil ===
    showRegisterScreen() {
        this.showScreen('screen-register');
    },

    // === PANTALLA: Ranking ===
    showRankingScreen() {
        this.showScreen('screen-ranking');
        this.renderRanking('global');
        this.renderProfileWidget();
        this.renderActivityWidget();
        this.renderHighlightsWidget();
    },

    // Renderizar lista de ranking
    renderRanking(filter = 'global') {
        const list = Utils.$('ranking-list');
        if (!list) return;

        let data;
        switch (filter) {
            case 'weekly': data = QuizRanking.getWeekly(); break;
            case 'monthly': data = QuizRanking.getMonthly(); break;
            default: data = QuizRanking.getGlobal();
        }

        if (data.length === 0) {
            list.innerHTML = `
                <div class="quiz-ranking-empty">
                    <i class="fas fa-trophy"></i>
                    <p>Nenhum jogador ainda</p>
                    <span>Seja o primeiro!</span>
                </div>
            `;
            return;
        }

        list.innerHTML = data.map((r, i) => {
            const avatar = QuizData.getAvatar(r.avatar);
            const topClass = i < 3 ? `top-${i + 1}` : '';
            return `
                <div class="quiz-ranking-item ${topClass}">
                    <div class="quiz-ranking-pos">${i + 1}</div>
                    <div class="quiz-ranking-avatar">${avatar.icon}</div>
                    <div class="quiz-ranking-info">
                        <div class="quiz-ranking-name">${Utils.escapeHtml(r.name)}</div>
                        <div class="quiz-ranking-stats">
                            <span><i class="fas fa-check"></i> ${r.correct}/${r.total || 10}</span>
                            <span><i class="fas fa-clock"></i> ${Utils.formatTime(r.time)}</span>
                        </div>
                    </div>
                    <div class="quiz-ranking-score">${r.score} <span>pts</span></div>
                </div>
            `;
        }).join('');
    },

    // Renderizar widget de perfil
    renderProfileWidget() {
        const container = Utils.$('profile-widget');
        if (!container) return;

        const profile = QuizProfile.current;
        if (!profile) {
            container.innerHTML = '';
            return;
        }

        const avatar = QuizData.getAvatar(profile.avatar);
        const accuracy = profile.stats?.games > 0 
            ? Math.round((profile.stats.correct / (profile.stats.correct + profile.stats.wrong)) * 100) 
            : 0;

        container.innerHTML = `
            <div class="quiz-profile-header">
                <div class="quiz-profile-avatar quiz-profile-avatar-clickable" id="avatar-open-profile" title="Ver perfil completo">
                    ${avatar.icon}
                </div>
                <div class="quiz-profile-info" id="info-open-profile" style="cursor: pointer;" title="Ver perfil completo">
                    <h3>${Utils.escapeHtml(profile.username)}</h3>
                    <div class="quiz-profile-stats">
                        <span>🔥 ${profile.streak?.current || 0} dias</span>
                        <span>🏆 ${profile.stats?.games || 0}</span>
                        <span>🎯 ${accuracy}%</span>
                    </div>
                </div>
            </div>
            <div class="quiz-session-btns">
                <button class="quiz-session-btn switch" id="btn-switch-account">
                    <i class="fas fa-exchange-alt"></i> Trocar
                </button>
                <button class="quiz-session-btn logout" id="btn-logout-quiz">
                    <i class="fas fa-door-open"></i> Sair
                </button>
            </div>
        `;

        // Eventos - Avatar y nombre abren perfil
        Utils.$('avatar-open-profile')?.addEventListener('click', () => this.showProfileScreen());
        Utils.$('info-open-profile')?.addEventListener('click', () => this.showProfileScreen());
        Utils.$('btn-switch-account')?.addEventListener('click', () => {
            QuizProfile.logout();
            this.showScreen('screen-login');
        });
        Utils.$('btn-logout-quiz')?.addEventListener('click', () => {
            QuizProfile.logout();
            this.showScreen('screen-login');
        });
    },

    // Renderizar widget de actividad
    renderActivityWidget() {
        const container = Utils.$('activity-widget');
        if (!container) return;

        const activity = QuizActivity.getRecent(3);
        
        let itemsHtml = '';
        if (activity.length === 0) {
            itemsHtml = '<div class="quiz-widget-empty">Clique para ver todos</div>';
        } else {
            itemsHtml = activity.map(a => {
                const avatar = QuizData.getAvatar(a.avatar);
                return `
                    <div class="quiz-activity-item">
                        <span class="quiz-activity-avatar">${avatar.icon}</span>
                        <div class="quiz-activity-text">
                            <strong>${Utils.escapeHtml(a.username)}</strong> ${Utils.escapeHtml(a.text)}
                        </div>
                        <span class="quiz-activity-time">${Utils.timeAgo(a.timestamp)}</span>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = `
            <div class="quiz-widget-title">
                <i class="fas fa-bolt"></i> Atividade Recente
                <i class="fas fa-expand-alt"></i>
            </div>
            ${itemsHtml}
        `;
    },

    // Renderizar widget de highlights
    renderHighlightsWidget() {
        const container = Utils.$('highlights-widget');
        if (!container) return;

        const highlights = QuizActivity.getHighlights(3);
        
        let itemsHtml = '';
        if (highlights.length === 0) {
            itemsHtml = '<div class="quiz-widget-empty">Clique para ver todos</div>';
        } else {
            itemsHtml = highlights.map(h => {
                const rarity = h.achievementRarity || h.achRarity || 'common';
                const icon = h.achievementIcon || h.achIcon || '🏆';
                const name = h.achievementName || h.achName || 'Logro';
                const user = h.username || h.user || 'Jogador';
                const avatar = QuizData.getAvatar(h.avatar);
                
                return `
                    <div class="quiz-highlight-item ${rarity}">
                        <span class="quiz-highlight-icon">${icon}</span>
                        <div class="quiz-highlight-info">
                            <div class="quiz-highlight-name">${Utils.escapeHtml(name)}</div>
                            <div class="quiz-highlight-user">${avatar.icon} ${Utils.escapeHtml(user)}</div>
                        </div>
                        <span class="quiz-highlight-rarity">${rarity}</span>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = `
            <div class="quiz-widget-title">
                <i class="fas fa-star"></i> Logros Recentes
                <i class="fas fa-expand-alt"></i>
            </div>
            ${itemsHtml}
        `;
    },

    // === PANTALLA: Perfil Completo ===
    showProfileScreen() {
        this.showScreen('screen-profile');
        this.renderFullProfile();
    },

    renderFullProfile() {
        const container = Utils.$('profile-full-content');
        if (!container) return;

        const profile = QuizProfile.current;
        if (!profile) return;

        const avatar = QuizData.getAvatar(profile.avatar);
        const accuracy = profile.stats?.games > 0 
            ? Math.round((profile.stats.correct / (profile.stats.correct + profile.stats.wrong)) * 100) 
            : 0;

        // Renderizar avatares
        const avatarsHtml = Object.entries(QuizData.avatars).map(([id, av]) => {
            const isUnlocked = QuizProfile.isAvatarUnlocked(id);
            const isSelected = profile.avatar === id;
            return `
                <div class="profile-avatar-item ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}" 
                     data-avatar="${id}" 
                     ${isUnlocked ? 'onclick="QuizUI.selectAvatar(\'' + id + '\')"' : ''}>
                    <span class="profile-avatar-icon">${av.icon}</span>
                    ${!isUnlocked ? '<i class="fas fa-lock profile-avatar-lock"></i>' : ''}
                    ${isSelected ? '<i class="fas fa-check profile-avatar-check"></i>' : ''}
                </div>
            `;
        }).join('');

        // Renderizar logros
        const achievementsHtml = Object.entries(QuizData.achievements).map(([id, ach]) => {
            const isUnlocked = profile.achievements.includes(id);
            return `
                <div class="profile-achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${ach.rarity}">
                    <div class="profile-achievement-icon">${ach.icon}</div>
                    <div class="profile-achievement-info">
                        <h4>${Utils.escapeHtml(ach.name)}</h4>
                        <p>${Utils.escapeHtml(ach.desc)}</p>
                        <span class="profile-achievement-rarity">${ach.rarity.toUpperCase()}</span>
                    </div>
                    ${!isUnlocked ? '<i class="fas fa-lock profile-achievement-lock"></i>' : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="profile-header-full">
                <div class="profile-avatar-large">${avatar.icon}</div>
                <h2>${Utils.escapeHtml(profile.username)}</h2>
                <p class="profile-streak">🔥 ${profile.streak?.current || 0} dias</p>
            </div>
            
            <div class="profile-stats-grid">
                <div class="profile-stat-card">
                    <span class="profile-stat-icon">🎮</span>
                    <span class="profile-stat-value">${profile.stats?.games || 0}</span>
                    <span class="profile-stat-label">Partidas</span>
                </div>
                <div class="profile-stat-card">
                    <span class="profile-stat-icon">🏆</span>
                    <span class="profile-stat-value">${profile.stats?.best || 0}</span>
                    <span class="profile-stat-label">Recorde</span>
                </div>
                <div class="profile-stat-card">
                    <span class="profile-stat-icon">🎯</span>
                    <span class="profile-stat-value">${accuracy}%</span>
                    <span class="profile-stat-label">Precisão</span>
                </div>
                <div class="profile-stat-card">
                    <span class="profile-stat-icon">🔥</span>
                    <span class="profile-stat-value">${profile.stats?.streak || 0}</span>
                    <span class="profile-stat-label">Melhor Racha</span>
                </div>
            </div>

            <div class="profile-section">
                <h3>Avatares</h3>
                <div class="profile-avatars-grid">
                    ${avatarsHtml}
                </div>
            </div>

            <div class="profile-section">
                <h3>Logros <span class="profile-count">${profile.achievements.length}/${Object.keys(QuizData.achievements).length}</span></h3>
                <div class="profile-achievements-grid">
                    ${achievementsHtml}
                </div>
            </div>
        `;
    },

    // Seleccionar avatar
    selectAvatar(avatarId) {
        if (QuizProfile.setAvatar(avatarId)) {
            this.renderFullProfile();
            this.renderProfileWidget();
        }
    },

    // === PANTALLA: Setup del Juego ===
    showSetupScreen() {
        this.showScreen('screen-setup');
        this.renderSetupScreen();
    },

    renderSetupScreen() {
        const container = Utils.$('setup-content');
        if (!container) return;

        const profile = QuizProfile.current;
        const accuracy = profile?.stats?.games > 0 
            ? Math.round((profile.stats.correct / (profile.stats.correct + profile.stats.wrong)) * 100) 
            : 0;
        
        // Obtener configuración de tiempo y puntos
        const config = typeof QuizRules !== 'undefined' ? QuizRules.getConfig() : null;
        const points = config?.points || { facil: 10, media: 15, dificil: 20, avancado: 25 };
        const time = config?.time || { facil: 30, media: 25, dificil: 20, avancado: 15 };
        
        // Verificar si tiene acceso a pregunta semanal (90%+ precisión)
        const hasWeeklyAccess = accuracy >= 90 && (profile?.stats?.games || 0) >= 5;

        container.innerHTML = `
            <div class="setup-header">
                <div class="setup-icon"><i class="fas fa-gamepad"></i></div>
                <h2>Escolha a Dificuldade</h2>
                <p>Selecione o nível de desafio</p>
            </div>
            
            <div class="setup-difficulties">
                <button class="setup-diff-btn" data-diff="facil">
                    <span class="setup-diff-dot" style="background: var(--success);"></span>
                    <div class="setup-diff-info">
                        <strong>Fácil</strong>
                        <span>${points.facil} pts por pergunta • ${time.facil}s</span>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </button>
                <button class="setup-diff-btn" data-diff="media">
                    <span class="setup-diff-dot" style="background: var(--warning);"></span>
                    <div class="setup-diff-info">
                        <strong>Médio</strong>
                        <span>${points.media} pts por pergunta • ${time.media}s</span>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </button>
                <button class="setup-diff-btn" data-diff="dificil">
                    <span class="setup-diff-dot" style="background: var(--error);"></span>
                    <div class="setup-diff-info">
                        <strong>Difícil</strong>
                        <span>${points.dificil} pts por pergunta • ${time.dificil}s</span>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </button>
                <button class="setup-diff-btn" data-diff="avancado">
                    <span class="setup-diff-dot" style="background: var(--rarity-epic);"></span>
                    <div class="setup-diff-info">
                        <strong>Avançado</strong>
                        <span>${points.avancado} pts por pergunta • ${time.avancado}s</span>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>

            ${hasWeeklyAccess ? `
                <div class="setup-weekly-section">
                    <div class="setup-weekly-badge">
                        <i class="fas fa-star"></i> DESBLOQUEADO
                    </div>
                    <h3>🌟 Desafio Semanal</h3>
                    <p>Sua precisão de ${accuracy}% liberou o desafio especial!</p>
                    <button class="setup-weekly-btn" id="btn-weekly-challenge">
                        <i class="fas fa-crown"></i> Jogar Desafio Semanal
                        <span>50 pts por pergunta</span>
                    </button>
                </div>
            ` : `
                <div class="setup-weekly-locked">
                    <div class="setup-weekly-lock"><i class="fas fa-lock"></i></div>
                    <h4>Desafio Semanal</h4>
                    <p>Alcance 90%+ de precisão em 5+ partidas para desbloquear</p>
                    <div class="setup-weekly-progress">
                        <div class="setup-weekly-bar" style="width: ${Math.min(accuracy, 90) / 90 * 100}%"></div>
                    </div>
                    <span class="setup-weekly-percent">${accuracy}% / 90%</span>
                </div>
            `}

            <button class="quiz-btn quiz-btn-secondary" id="btn-cancel-setup" style="margin-top: 20px;">
                <i class="fas fa-arrow-left"></i> Voltar
            </button>
        `;

        // Eventos de dificultad
        container.querySelectorAll('[data-diff]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.startGame(btn.dataset.diff);
            });
        });

        // Evento cancelar
        container.querySelector('#btn-cancel-setup')?.addEventListener('click', () => {
            this.showRankingScreen();
        });

        // Evento desafio semanal
        container.querySelector('#btn-weekly-challenge')?.addEventListener('click', () => {
            window.startGame('weekly');
        });
    },

    // === PANTALLA: Juego ===
    showGameScreen() {
        this.showScreen('screen-game');
    },

    // === PANTALLA: Resultados ===
    showResultsScreen(result) {
        this.showScreen('screen-results');
        this.renderResults(result);
    },

    renderResults(result) {
        const container = Utils.$('results-content');
        if (!container) return;

        const emoji = result.accuracy >= 90 ? '🏆' : result.accuracy >= 70 ? '👏' : result.accuracy >= 50 ? '👍' : '💪';
        
        container.innerHTML = `
            <div class="results-emoji">${emoji}</div>
            <div class="results-score">${result.score} <span>pts</span></div>
            <div class="results-stats">
                <div class="results-stat">
                    <i class="fas fa-check" style="color: var(--success);"></i>
                    <span>${result.correct}/${result.total}</span>
                    <label>Acertos</label>
                </div>
                <div class="results-stat">
                    <i class="fas fa-clock"></i>
                    <span>${Utils.formatTime(result.time)}</span>
                    <label>Tempo</label>
                </div>
                <div class="results-stat">
                    <i class="fas fa-fire" style="color: var(--warning);"></i>
                    <span>${result.maxStreak}</span>
                    <label>Racha</label>
                </div>
                <div class="results-stat">
                    <i class="fas fa-bullseye" style="color: var(--rarity-epic);"></i>
                    <span>${result.accuracy}%</span>
                    <label>Precisão</label>
                </div>
            </div>
        `;
    }
};

// Export global
window.QuizUI = QuizUI;
