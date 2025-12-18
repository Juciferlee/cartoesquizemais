// ============================================
// INDEX/CAROUSEL.JS - Carrusel con Hall da Fama
// ============================================

const Carousel = {
    container: null,
    indicators: null,
    currentSlide: 0,
    autoplayInterval: null,
    autoplayDelay: 6000,

    // Obtener configuración del carrusel
    getConfig() {
        const saved = Storage.get('cartoesx_admin_config');
        return {
            hallOfFameCount: saved?.carousel?.hallOfFameCount || 3,
            highlightsCount: saved?.carousel?.highlightsCount || 3
        };
    },

    // Inicializar
    init() {
        this.container = Utils.$('carousel-container');
        this.indicators = Utils.$('carousel-indicators');
        
        if (!this.container) return;

        this.render();
        this.bindEvents();
        this.startAutoplay();

        // Escuchar eventos del quiz
        window.addEventListener('quiz-achievement-unlock', () => this.render());
        window.updateHallDaFama = () => this.render();
    },

    // Renderizar carrusel
    render() {
        if (!this.container) return;

        const config = this.getConfig();
        const slides = [];

        // 1. Slide Hall da Fama
        const ranking = Storage.getQuizRanking().slice(0, config.hallOfFameCount);
        if (ranking.length > 0) {
            slides.push(this.createHallOfFameSlide(ranking));
        }

        // 2. Slide de Highlights
        const highlights = Storage.getQuizHighlights().slice(0, config.highlightsCount);
        if (highlights.length > 0) {
            slides.push(this.createHighlightsSlide(highlights));
        }

        // 3. Slides del admin
        const adminSlides = Storage.getCarousel();
        adminSlides.forEach(slide => {
            slides.push(this.createAdminSlide(slide));
        });

        // Si no hay slides, mostrar bienvenida
        if (slides.length === 0) {
            slides.push(this.createWelcomeSlide());
        }

        // Renderizar
        this.container.innerHTML = slides.join('');
        this.renderIndicators(slides.length);
        this.goToSlide(0);
    },

    // Crear slide Hall da Fama
    createHallOfFameSlide(topPlayers) {
        const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
        
        const championsHTML = topPlayers.map((player, i) => {
            const posClass = i < 3 ? ['gold', 'silver', 'bronze'][i] : 'regular';
            const crown = i < 3 ? ['👑', '🥈', '🥉'][i] : `${i+1}º`;
            const avatar = QuizData.getAvatar(player.avatar);
            const colors = i < 3 ? [
                ['#fbbf24', '#f59e0b'],
                ['#94a3b8', '#64748b'],
                ['#d97706', '#b45309']
            ][i] : ['#6366f1', '#4f46e5'];

            return `
                <div class="champion-card champion-${posClass}" data-player-id="${player.id || i}" data-player='${JSON.stringify(player).replace(/'/g, "&#39;")}' style="--delay: ${i * 0.1}s; cursor: pointer;" title="Clique para ver perfil">
                    <div class="champion-crown">${crown}</div>
                    <div class="champion-avatar" style="background: linear-gradient(135deg, ${colors[0]}, ${colors[1]})">
                        <span class="champion-initial">${avatar.icon}</span>
                        <div class="champion-ring"></div>
                    </div>
                    <div class="champion-position">${i + 1}º</div>
                    <div class="champion-info">
                        <h3 class="champion-name">${Utils.escapeHtml(player.name)}</h3>
                        <div class="champion-score">${player.score} <span>pts</span></div>
                        <div class="champion-stats">
                            <span><i class="fas fa-check"></i> ${player.correct}/${player.total || 10}</span>
                            <span><i class="fas fa-clock"></i> ${formatTime(player.time)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="carousel-slide carousel-champions">
                <div class="champions-bg">
                    <div class="champions-particles"></div>
                    <div class="champions-spotlight"></div>
                </div>
                <div class="champions-content">
                    <div class="champions-header">
                        <div class="champions-trophy"><i class="fas fa-trophy"></i></div>
                        <h1>HALL DA FAMA</h1>
                        <p>Os melhores jogadores do Quiz Cartões X</p>
                    </div>
                    <div class="champions-podium">${championsHTML}</div>
                    <a href="quiz.html" class="champions-cta">
                        <i class="fas fa-gamepad"></i>
                        <span>Desafie os Campeões</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    },

    // Crear slide de Highlights
    createHighlightsSlide(highlights) {
        const rarityColors = {
            common: { bg: '#22c55e', glow: 'rgba(34,197,94,0.3)' },
            rare: { bg: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
            epic: { bg: '#a855f7', glow: 'rgba(168,85,247,0.3)' },
            legendary: { bg: '#f59e0b', glow: 'rgba(245,158,11,0.3)' }
        };

        const highlightsHTML = highlights.map((h, i) => {
            const rarity = h.achievementRarity || h.achRarity || 'common';
            const icon = h.achievementIcon || h.achIcon || '🏆';
            const name = h.achievementName || h.achName || 'Logro';
            const achId = h.achievementId || h.achId || '';
            const user = h.username || h.user || 'Jogador';
            const avatar = QuizData.getAvatar(h.avatar);
            const colors = rarityColors[rarity] || rarityColors.common;

            return `
                <div class="highlight-card" data-achievement-id="${achId}" data-highlight='${JSON.stringify(h).replace(/'/g, "&#39;")}' style="--delay: ${i * 0.15}s; --rarity-color: ${colors.bg}; --rarity-glow: ${colors.glow}; cursor: pointer;" title="Clique para ver detalhes">
                    <div class="highlight-badge">${rarity.toUpperCase()}</div>
                    <div class="highlight-icon-wrap">
                        <div class="highlight-icon">${icon}</div>
                        <div class="highlight-ring"></div>
                    </div>
                    <div class="highlight-info">
                        <h4>${Utils.escapeHtml(name)}</h4>
                        <div class="highlight-user">
                            <span class="highlight-avatar">${avatar.icon}</span>
                            <span>${Utils.escapeHtml(user)}</span>
                        </div>
                        <span class="highlight-time">${Utils.timeAgo(h.timestamp || h.ts)}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="carousel-slide carousel-highlights">
                <div class="highlights-bg">
                    <div class="highlights-particles"></div>
                </div>
                <div class="highlights-content">
                    <div class="highlights-header">
                        <div class="highlights-star"><i class="fas fa-star"></i></div>
                        <h1>LOGROS RECENTES</h1>
                        <p>Conquistas dos jogadores</p>
                    </div>
                    <div class="highlights-grid">${highlightsHTML}</div>
                    <a href="quiz.html" class="highlights-cta">
                        <i class="fas fa-trophy"></i>
                        <span>Conquiste o Seu!</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    },

    // Crear slide del admin
    createAdminSlide(slide) {
        return `
            <div class="carousel-slide" style="background-image: url('${Utils.escapeHtml(slide.imageUrl || '')}')">
                <div class="carousel-content">
                    <h1>${Utils.escapeHtml(slide.title || '')}</h1>
                    <p>${Utils.escapeHtml(slide.text || '')}</p>
                </div>
            </div>
        `;
    },

    // Crear slide de bienvenida
    createWelcomeSlide() {
        return `
            <div class="carousel-slide" style="background: var(--primary-gradient)">
                <div class="carousel-content">
                    <h1>Bem-vindo ao Cartões X</h1>
                    <p>Compare os melhores cartões de crédito do mercado</p>
                </div>
            </div>
        `;
    },

    // ========== MODALES ==========
    // Modal de perfil de jugador
    showPlayerProfile(player) {
        const existing = document.querySelector('.carousel-modal');
        if (existing) existing.remove();

        const avatar = QuizData.getAvatar(player.avatar);
        const accuracy = player.total > 0 ? Math.round((player.correct / player.total) * 100) : 0;
        const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

        // Buscar perfil completo
        const profiles = Storage.getQuizProfiles();
        const fullProfile = profiles.find(p => p.username === player.name || p.id === player.id);
        const achievements = fullProfile?.achievements || [];
        
        const achievementsHTML = achievements.length > 0 
            ? achievements.slice(0, 6).map(achId => {
                const ach = QuizData.getAchievement(achId);
                return `<span class="profile-modal-badge" title="${ach.name}">${ach.icon}</span>`;
            }).join('')
            : '<span style="opacity: 0.6;">Nenhum logro ainda</span>';

        const modal = document.createElement('div');
        modal.className = 'carousel-modal active';
        modal.innerHTML = `
            <div class="carousel-modal-content profile-modal">
                <button class="carousel-modal-close">&times;</button>
                <div class="profile-modal-header">
                    <div class="profile-modal-avatar" style="background: linear-gradient(135deg, #fbbf24, #f59e0b);">
                        ${avatar.icon}
                    </div>
                    <div class="profile-modal-info">
                        <h2>${Utils.escapeHtml(player.name)}</h2>
                        <span class="profile-modal-subtitle">${avatar.name}</span>
                    </div>
                </div>
                <div class="profile-modal-stats">
                    <div class="profile-modal-stat">
                        <span class="profile-modal-stat-icon">🏆</span>
                        <span class="profile-modal-stat-value">${player.score}</span>
                        <span class="profile-modal-stat-label">Pontos</span>
                    </div>
                    <div class="profile-modal-stat">
                        <span class="profile-modal-stat-icon">✅</span>
                        <span class="profile-modal-stat-value">${player.correct}/${player.total || 10}</span>
                        <span class="profile-modal-stat-label">Acertos</span>
                    </div>
                    <div class="profile-modal-stat">
                        <span class="profile-modal-stat-icon">🎯</span>
                        <span class="profile-modal-stat-value">${accuracy}%</span>
                        <span class="profile-modal-stat-label">Precisão</span>
                    </div>
                    <div class="profile-modal-stat">
                        <span class="profile-modal-stat-icon">⏱️</span>
                        <span class="profile-modal-stat-value">${formatTime(player.time)}</span>
                        <span class="profile-modal-stat-label">Tempo</span>
                    </div>
                </div>
                <div class="profile-modal-section">
                    <h3><i class="fas fa-medal"></i> Logros Conquistados</h3>
                    <div class="profile-modal-achievements">
                        ${achievementsHTML}
                    </div>
                </div>
                <a href="quiz.html" class="profile-modal-cta">
                    <i class="fas fa-gamepad"></i> Desafiar este Jogador
                </a>
            </div>
        `;

        document.body.appendChild(modal);
        this.bindModalEvents(modal);
    },

    // Modal de detalle de logro
    showAchievementDetail(highlight) {
        const existing = document.querySelector('.carousel-modal');
        if (existing) existing.remove();

        const achId = highlight.achievementId || highlight.achId;
        const achievement = QuizData.getAchievement(achId);
        const rarity = highlight.achievementRarity || highlight.achRarity || achievement?.rarity || 'common';
        const icon = highlight.achievementIcon || highlight.achIcon || achievement?.icon || '🏆';
        const name = highlight.achievementName || highlight.achName || achievement?.name || 'Logro';
        const desc = achievement?.description || 'Conquista especial do Quiz Cartões X';
        const user = highlight.username || highlight.user || 'Jogador';
        const avatar = QuizData.getAvatar(highlight.avatar);

        const rarityInfo = {
            common: { label: 'Comum', color: '#22c55e', desc: 'Fácil de conquistar' },
            rare: { label: 'Raro', color: '#3b82f6', desc: 'Requer dedicação' },
            epic: { label: 'Épico', color: '#a855f7', desc: 'Poucos conseguem' },
            legendary: { label: 'Lendário', color: '#f59e0b', desc: 'Extremamente difícil' }
        };
        const rarityData = rarityInfo[rarity] || rarityInfo.common;

        // Como obter o logro
        const howToGet = {
            first_game: 'Complete sua primeira partida no Quiz.',
            perfect_10: 'Acerte todas as 10 perguntas em uma partida.',
            speed_demon: 'Responda uma pergunta em menos de 3 segundos.',
            streak_5: 'Acerte 5 perguntas consecutivas.',
            streak_10: 'Acerte 10 perguntas consecutivas.',
            points_100: 'Acumule 100 pontos no total.',
            points_500: 'Acumule 500 pontos no total.',
            points_1000: 'Acumule 1000 pontos no total.',
            games_10: 'Complete 10 partidas.',
            games_50: 'Complete 50 partidas.',
            daily_3: 'Jogue 3 dias consecutivos.',
            weekly_7: 'Jogue todos os dias da semana.'
        };

        const modal = document.createElement('div');
        modal.className = 'carousel-modal active';
        modal.innerHTML = `
            <div class="carousel-modal-content achievement-modal">
                <button class="carousel-modal-close">&times;</button>
                <div class="achievement-modal-header" style="--rarity-color: ${rarityData.color};">
                    <div class="achievement-modal-icon-wrap">
                        <div class="achievement-modal-icon">${icon}</div>
                        <div class="achievement-modal-glow"></div>
                    </div>
                    <div class="achievement-modal-badge" style="background: ${rarityData.color};">
                        ${rarityData.label}
                    </div>
                </div>
                <div class="achievement-modal-body">
                    <h2>${Utils.escapeHtml(name)}</h2>
                    <p class="achievement-modal-desc">${Utils.escapeHtml(desc)}</p>
                    
                    <div class="achievement-modal-how">
                        <h4><i class="fas fa-lightbulb"></i> Como Conquistar</h4>
                        <p>${howToGet[achId] || 'Continue jogando o Quiz para desbloquear!'}</p>
                    </div>
                    
                    <div class="achievement-modal-rarity">
                        <h4><i class="fas fa-gem"></i> Raridade</h4>
                        <div class="achievement-modal-rarity-bar">
                            <div class="achievement-modal-rarity-fill" style="width: ${rarity === 'legendary' ? '100%' : rarity === 'epic' ? '75%' : rarity === 'rare' ? '50%' : '25%'}; background: ${rarityData.color};"></div>
                        </div>
                        <span style="color: ${rarityData.color}; font-weight: 600;">${rarityData.desc}</span>
                    </div>
                    
                    <div class="achievement-modal-unlocked">
                        <span class="achievement-modal-unlocked-avatar">${avatar.icon}</span>
                        <span>Desbloqueado por <strong>${Utils.escapeHtml(user)}</strong></span>
                        <span class="achievement-modal-unlocked-time">${Utils.timeAgo(highlight.timestamp || highlight.ts)}</span>
                    </div>
                </div>
                <a href="quiz.html" class="achievement-modal-cta">
                    <i class="fas fa-trophy"></i> Conquistar este Logro
                </a>
            </div>
        `;

        document.body.appendChild(modal);
        this.bindModalEvents(modal);
    },

    // Bind eventos del modal
    bindModalEvents(modal) {
        modal.querySelector('.carousel-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handler);
            }
        });
    },

    // Renderizar indicadores
    renderIndicators(count) {
        if (!this.indicators) return;
        this.indicators.innerHTML = Array.from({ length: count }, (_, i) => 
            `<button class="carousel-indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
        ).join('');
    },

    // Ir a slide específico
    goToSlide(index) {
        const slides = this.container?.querySelectorAll('.carousel-slide');
        const indicators = this.indicators?.querySelectorAll('.carousel-indicator');
        if (!slides || slides.length === 0) return;

        this.currentSlide = index;
        if (this.currentSlide >= slides.length) this.currentSlide = 0;
        if (this.currentSlide < 0) this.currentSlide = slides.length - 1;

        slides.forEach((s, i) => s.classList.toggle('active', i === this.currentSlide));
        indicators?.forEach((ind, i) => ind.classList.toggle('active', i === this.currentSlide));
    },

    // Siguiente slide
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },

    // Slide anterior
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },

    // Iniciar autoplay
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    },

    // Detener autoplay
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    },

    // Vincular eventos
    bindEvents() {
        // Botones prev/next
        Utils.$('carousel-prev')?.addEventListener('click', () => {
            this.prevSlide();
            this.startAutoplay();
        });
        Utils.$('carousel-next')?.addEventListener('click', () => {
            this.nextSlide();
            this.startAutoplay();
        });

        // Indicadores
        this.indicators?.addEventListener('click', (e) => {
            const btn = e.target.closest('.carousel-indicator');
            if (btn) {
                this.goToSlide(parseInt(btn.dataset.index));
                this.startAutoplay();
            }
        });

        // Click en champion cards (Hall da Fama)
        this.container?.addEventListener('click', (e) => {
            const championCard = e.target.closest('.champion-card');
            if (championCard) {
                e.preventDefault();
                try {
                    const playerData = JSON.parse(championCard.dataset.player.replace(/&#39;/g, "'"));
                    this.showPlayerProfile(playerData);
                } catch (err) {
                    console.error('Error parsing player data:', err);
                }
            }
            
            const highlightCard = e.target.closest('.highlight-card');
            if (highlightCard) {
                e.preventDefault();
                try {
                    const highlightData = JSON.parse(highlightCard.dataset.highlight.replace(/&#39;/g, "'"));
                    this.showAchievementDetail(highlightData);
                } catch (err) {
                    console.error('Error parsing highlight data:', err);
                }
            }
        });

        // Touch/swipe
        let touchStartX = 0;
        this.container?.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.container?.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
                this.startAutoplay();
            }
        }, { passive: true });
    }
};

// Export global
window.Carousel = Carousel;
