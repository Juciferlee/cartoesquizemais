// ============================================
// ADMIN/STORE.JS - Estado Central y Servicios
// ============================================

const AdminStore = {
    // Estado central
    state: {
        questions: [],
        users: [],
        cards: [],
        carousel: [],
        activity: [],
        config: null,
        filters: {
            search: '',
            difficulty: 'all',
            status: 'all'
        },
        pagination: {
            page: 1,
            perPage: 10,
            total: 0
        }
    },

    // ========== LOAD ALL DATA ==========
    loadAll() {
        this.state.questions = Storage.getQuizQuestions();
        this.state.users = Storage.getQuizProfiles();
        this.state.cards = Storage.getCards();
        this.state.carousel = Storage.getCarousel();
        this.state.activity = Storage.getQuizActivity();
        this.state.config = this.getConfig();
        
        // Si no hay preguntas, usar ejemplos
        if (this.state.questions.length === 0) {
            this.state.questions = QuizData.exampleQuestions.map((q, i) => ({
                ...q,
                id: q.id || Date.now() + i,
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));
            Storage.saveQuizQuestions(this.state.questions);
        }

        // Si no hay usuarios, usar ejemplos
        if (this.state.users.length === 0) {
            this.state.users = QuizData.exampleProfiles;
            Storage.saveQuizProfiles(this.state.users);
        }

        this.updateBadges();
    },

    // ========== BADGES UPDATE ==========
    updateBadges() {
        const badges = {
            'badge-questions': this.state.questions.length,
            'badge-users': this.state.users.length,
            'badge-cards': this.state.cards.length,
            'badge-carousel': this.state.carousel.length
        };

        Object.entries(badges).forEach(([id, count]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = count;
        });
    },

    // ========== CONFIG ==========
    getConfig() {
        const saved = Storage.get('cartoesx_admin_config');
        return saved || {
            // Reglas de desbloqueo
            unlockRules: {
                media: { requirement: 80, type: 'completion' },
                dificil: { requirement: 90, type: 'completion' },
                avancado: { requirement: 100, type: 'all_levels' }
            },
            // Cooldown por nivel (12 horas)
            cooldown: {
                enabled: true,
                hours: 12,
                byLevel: true
            },
            // Puntos por nivel
            points: {
                facil: 10,
                media: 15,
                dificil: 20,
                avancado: 25
            },
            // Tiempo por nivel
            time: {
                facil: 30,
                media: 25,
                dificil: 20,
                avancado: 15
            },
            // Mensajes
            messages: {
                cooldownLimit: 'Você atingiu o limite de pontos para este nível. Volte em {hours}h {minutes}m.',
                levelUnlocked: 'Parabéns! Você desbloqueou o nível {level}!',
                weeklyReset: 'Novo ciclo semanal iniciado!'
            },
            // Preguntas por partida
            questionsPerGame: 10,
            // Aleatorización
            shuffleQuestions: true,
            shuffleAnswers: true,
            // Carrusel
            carousel: {
                hallOfFameCount: 3,
                highlightsCount: 3
            }
        };
    },

    saveConfig(config) {
        this.state.config = config;
        Storage.set('cartoesx_admin_config', config);
    },

    // ========== QUESTIONS CRUD ==========
    getQuestions(filters = {}) {
        let questions = [...this.state.questions];

        // Filtrar por búsqueda
        if (filters.search) {
            const search = filters.search.toLowerCase();
            questions = questions.filter(q => 
                q.question.toLowerCase().includes(search) ||
                q.options?.some(o => o.toLowerCase().includes(search))
            );
        }

        // Filtrar por dificultad
        if (filters.difficulty && filters.difficulty !== 'all') {
            questions = questions.filter(q => q.diff === filters.difficulty);
        }

        // Filtrar por estado
        if (filters.status === 'active') {
            questions = questions.filter(q => q.active !== false);
        } else if (filters.status === 'inactive') {
            questions = questions.filter(q => q.active === false);
        }

        return questions;
    },

    addQuestion(question) {
        const newQuestion = {
            ...question,
            id: Date.now(),
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.state.questions.push(newQuestion);
        Storage.saveQuizQuestions(this.state.questions);
        this.updateBadges();
        return newQuestion;
    },

    updateQuestion(id, data) {
        const index = this.state.questions.findIndex(q => q.id === id);
        if (index === -1) return null;
        
        this.state.questions[index] = {
            ...this.state.questions[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        Storage.saveQuizQuestions(this.state.questions);
        return this.state.questions[index];
    },

    deleteQuestion(id) {
        this.state.questions = this.state.questions.filter(q => q.id !== id);
        Storage.saveQuizQuestions(this.state.questions);
        this.updateBadges();
    },

    // ========== USERS ==========
    getUsers(filters = {}) {
        let users = [...this.state.users];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            users = users.filter(u => 
                u.username?.toLowerCase().includes(search)
            );
        }

        // Ordenar por puntos
        users.sort((a, b) => (b.stats?.score || 0) - (a.stats?.score || 0));

        return users;
    },

    getUserById(id) {
        return this.state.users.find(u => u.id === id);
    },

    updateUser(id, data) {
        const index = this.state.users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        this.state.users[index] = {
            ...this.state.users[index],
            ...data
        };
        Storage.saveQuizProfiles(this.state.users);
        return this.state.users[index];
    },

    resetUserStats(id) {
        const user = this.getUserById(id);
        if (!user) return null;

        user.stats = { games: 0, score: 0, correct: 0, wrong: 0, time: 0, best: 0, streak: 0 };
        user.achievements = [];
        user.levels = { facil: 0, media: 0, dificil: 0, avancado: 0 };
        user.streak = { current: 0, best: 0, last: null };
        user.cooldowns = {};

        Storage.saveQuizProfiles(this.state.users);
        return user;
    },

    deleteUser(id) {
        this.state.users = this.state.users.filter(u => u.id !== id);
        Storage.saveQuizProfiles(this.state.users);
        
        // Limpiar del ranking también
        const ranking = Storage.getQuizRanking().filter(r => r.odName !== id);
        Storage.saveQuizRanking(ranking);
        
        this.updateBadges();
    },

    // ========== CARDS CRUD ==========
    getCards(filters = {}) {
        let cards = [...this.state.cards];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            cards = cards.filter(c => 
                c.nome?.toLowerCase().includes(search) ||
                c.bandeira?.toLowerCase().includes(search)
            );
        }

        return cards;
    },

    addCard(card) {
        const newCard = {
            ...card,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        this.state.cards.push(newCard);
        Storage.saveCards(this.state.cards);
        this.updateBadges();
        return newCard;
    },

    updateCard(id, data) {
        const index = this.state.cards.findIndex(c => c.id === id);
        if (index === -1) return null;
        
        this.state.cards[index] = {
            ...this.state.cards[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        Storage.saveCards(this.state.cards);
        return this.state.cards[index];
    },

    deleteCard(id) {
        this.state.cards = this.state.cards.filter(c => c.id !== id);
        Storage.saveCards(this.state.cards);
        this.updateBadges();
    },

    // ========== CAROUSEL CRUD ==========
    getCarousel() {
        return [...this.state.carousel];
    },

    addSlide(slide) {
        const newSlide = {
            ...slide,
            id: Date.now()
        };
        this.state.carousel.push(newSlide);
        Storage.saveCarousel(this.state.carousel);
        this.updateBadges();
        return newSlide;
    },

    updateSlide(id, data) {
        const index = this.state.carousel.findIndex(s => s.id === id);
        if (index === -1) return null;
        
        this.state.carousel[index] = {
            ...this.state.carousel[index],
            ...data
        };
        Storage.saveCarousel(this.state.carousel);
        return this.state.carousel[index];
    },

    deleteSlide(id) {
        this.state.carousel = this.state.carousel.filter(s => s.id !== id);
        Storage.saveCarousel(this.state.carousel);
        this.updateBadges();
    },

    reorderSlides(fromIndex, toIndex) {
        const [moved] = this.state.carousel.splice(fromIndex, 1);
        this.state.carousel.splice(toIndex, 0, moved);
        Storage.saveCarousel(this.state.carousel);
    },

    // ========== ACTIVITY LOG ==========
    getActivity(limit = 50) {
        return this.state.activity.slice(0, limit);
    },

    logActivity(type, data) {
        const entry = {
            id: Date.now(),
            type,
            data,
            timestamp: new Date().toISOString()
        };
        this.state.activity.unshift(entry);
        
        // Mantener solo últimas 200 entradas
        if (this.state.activity.length > 200) {
            this.state.activity = this.state.activity.slice(0, 200);
        }
        
        Storage.saveQuizActivity(this.state.activity);
        return entry;
    },

    clearActivity() {
        this.state.activity = [];
        Storage.saveQuizActivity([]);
    },

    // ========== ACHIEVEMENTS ==========
    getAchievements() {
        const rarityOverrides = Storage.get('cartoesx_achievement_rarities') || {};
        return Object.entries(QuizData.achievements).map(([id, data]) => ({
            id,
            ...data,
            rarity: rarityOverrides[id] || data.rarity,
            usersUnlocked: this.state.users.filter(u => u.achievements?.includes(id)).length
        }));
    },

    getAchievementRarity(achievementId) {
        const rarityOverrides = Storage.get('cartoesx_achievement_rarities') || {};
        return rarityOverrides[achievementId] || QuizData.achievements[achievementId]?.rarity;
    },

    setAchievementRarity(achievementId, rarity) {
        const rarityOverrides = Storage.get('cartoesx_achievement_rarities') || {};
        rarityOverrides[achievementId] = rarity;
        Storage.set('cartoesx_achievement_rarities', rarityOverrides);
    },

    // Custom Achievements
    getCustomAchievements() {
        return Storage.get('cartoesx_custom_achievements') || [];
    },

    getCustomAchievementById(id) {
        const achievements = this.getCustomAchievements();
        return achievements.find(a => a.id === id);
    },

    addCustomAchievement(data) {
        const achievements = this.getCustomAchievements();
        const newAchievement = {
            id: 'custom_' + Date.now(),
            ...data,
            createdAt: new Date().toISOString()
        };
        achievements.push(newAchievement);
        Storage.set('cartoesx_custom_achievements', achievements);
        return newAchievement;
    },

    updateCustomAchievement(id, data) {
        const achievements = this.getCustomAchievements();
        const index = achievements.findIndex(a => a.id === id);
        if (index !== -1) {
            achievements[index] = { ...achievements[index], ...data, updatedAt: new Date().toISOString() };
            Storage.set('cartoesx_custom_achievements', achievements);
            return true;
        }
        return false;
    },

    deleteCustomAchievement(id) {
        const achievements = this.getCustomAchievements();
        const filtered = achievements.filter(a => a.id !== id);
        Storage.set('cartoesx_custom_achievements', filtered);
    },

    grantAchievement(userId, achievementId) {
        const user = this.getUserById(userId);
        if (!user) return false;

        if (!user.achievements) user.achievements = [];
        if (user.achievements.includes(achievementId)) return false;

        user.achievements.push(achievementId);
        Storage.saveQuizProfiles(this.state.users);

        // Buscar nombre del logro (sistema o custom)
        const systemAch = QuizData.achievements[achievementId];
        const customAch = this.getCustomAchievementById(achievementId);
        const achievementName = systemAch?.name || customAch?.name || achievementId;

        this.logActivity('achievement', {
            userId,
            username: user.username,
            achievementId,
            achievementName
        });

        return true;
    },

    revokeAchievement(userId, achievementId) {
        const user = this.getUserById(userId);
        if (!user || !user.achievements) return false;

        user.achievements = user.achievements.filter(a => a !== achievementId);
        Storage.saveQuizProfiles(this.state.users);
        return true;
    },

    // ========== STATS ==========
    getStats() {
        const questions = this.state.questions;
        const users = this.state.users;
        const activity = this.state.activity;

        const questionsByDiff = {
            facil: questions.filter(q => q.diff === 'facil').length,
            media: questions.filter(q => q.diff === 'media').length,
            dificil: questions.filter(q => q.diff === 'dificil').length,
            avancado: questions.filter(q => q.diff === 'avancado').length
        };

        const totalGames = users.reduce((sum, u) => sum + (u.stats?.games || 0), 0);
        const totalScore = users.reduce((sum, u) => sum + (u.stats?.score || 0), 0);
        const activeUsers = users.filter(u => {
            const lastGame = activity.find(a => a.type === 'game' && a.data?.userId === u.id);
            if (!lastGame) return false;
            const daysDiff = (Date.now() - new Date(lastGame.timestamp).getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        }).length;

        return {
            questions: {
                total: questions.length,
                active: questions.filter(q => q.active !== false).length,
                byDiff: questionsByDiff
            },
            users: {
                total: users.length,
                active: activeUsers
            },
            games: {
                total: totalGames,
                score: totalScore
            },
            cards: this.state.cards.length,
            carousel: this.state.carousel.length
        };
    },

    // ========== RESET FUNCTIONS ==========
    resetQuizData() {
        Storage.saveQuizProfiles([]);
        Storage.saveQuizRanking([]);
        Storage.saveQuizActivity([]);
        Storage.set('cartoesx_quiz_highlights', []);
        Storage.remove(CONFIG.storage.quizCurrent);
        
        this.state.users = [];
        this.state.activity = [];
        this.updateBadges();
    },

    resetAllData() {
        // Reset quiz
        this.resetQuizData();
        
        // Reset questions
        Storage.saveQuizQuestions([]);
        this.state.questions = [];
        
        // Reset cards
        Storage.saveCards([]);
        this.state.cards = [];
        
        // Reset carousel
        Storage.saveCarousel([]);
        this.state.carousel = [];
        
        // Reset config
        Storage.remove('cartoesx_admin_config');
        this.state.config = this.getConfig();
        
        // Reset init flag
        Storage.remove(CONFIG.storage.quizInit);
        
        this.updateBadges();
    },

    exportData() {
        return {
            questions: this.state.questions,
            users: this.state.users,
            cards: this.state.cards,
            carousel: this.state.carousel,
            config: this.state.config,
            activity: this.state.activity,
            exportedAt: new Date().toISOString()
        };
    },

    importData(data) {
        if (data.questions) {
            this.state.questions = data.questions;
            Storage.saveQuizQuestions(data.questions);
        }
        if (data.users) {
            this.state.users = data.users;
            Storage.saveQuizProfiles(data.users);
        }
        if (data.cards) {
            this.state.cards = data.cards;
            Storage.saveCards(data.cards);
        }
        if (data.carousel) {
            this.state.carousel = data.carousel;
            Storage.saveCarousel(data.carousel);
        }
        if (data.config) {
            this.saveConfig(data.config);
        }
        this.updateBadges();
    }
};

// Export
window.AdminStore = AdminStore;
