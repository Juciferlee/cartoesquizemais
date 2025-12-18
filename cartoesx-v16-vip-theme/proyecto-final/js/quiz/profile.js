/**
 * ============================================
 * QUIZ/PROFILE.JS - Gestión de Perfiles
 * ============================================
 */

const QuizProfile = {
    current: null,

    async init() {
        this.loadCurrent();
        return this;
    },

    // Crear nuevo perfil
    create(username, password) {
        const profiles = Storage.getQuizProfiles();
        
        // Verificar si ya existe
        if (profiles.find(p => p.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, error: 'Nome de usuário já existe' };
        }

        const profile = {
            id: Utils.generateId(),
            username: username.trim(),
            hash: Utils.simpleHash(password),
            avatar: 'default_1',
            created: new Date().toISOString(),
            stats: {
                games: 0,
                score: 0,
                correct: 0,
                wrong: 0,
                time: 0,
                best: 0,
                streak: 0
            },
            achievements: [],
            levels: {
                facil: 0,
                media: 0,
                dificil: 0,
                avancado: 0
            },
            streak: {
                current: 0,
                best: 0,
                last: null
            }
        };

        profiles.push(profile);
        Storage.saveQuizProfiles(profiles);
        
        return { success: true, profile };
    },

    // Login
    login(username, password) {
        const profiles = Storage.getQuizProfiles();
        const hash = Utils.simpleHash(password);
        const profile = profiles.find(p => 
            p.username.toLowerCase() === username.toLowerCase() && p.hash === hash
        );

        if (!profile) {
            return { success: false, error: 'Usuário ou senha incorretos' };
        }

        this.current = profile;
        Storage.saveQuizCurrentProfile(profile);
        this.updateStreak(profile);
        
        return { success: true, profile };
    },

    // Logout
    logout() {
        this.current = null;
        Storage.clearQuizCurrentProfile();
    },

    // Cargar perfil guardado
    loadCurrent() {
        const profile = Storage.getQuizCurrentProfile();
        if (profile) {
            this.current = profile;
            return profile;
        }
        return null;
    },

    // Guardar perfil actual
    saveCurrent() {
        if (!this.current) return;
        
        const profiles = Storage.getQuizProfiles();
        const index = profiles.findIndex(p => p.id === this.current.id);
        if (index !== -1) {
            profiles[index] = this.current;
            Storage.saveQuizProfiles(profiles);
        }
        
        Storage.saveQuizCurrentProfile(this.current);
    },

    // Actualizar racha diaria
    updateStreak(profile) {
        const today = Utils.getCurrentDate();
        const lastPlay = profile.streak?.last;

        if (!profile.streak) {
            profile.streak = { current: 0, best: 0, last: null };
        }

        if (!lastPlay) {
            profile.streak.current = 1;
        } else if (lastPlay === today) {
            // Ya jugó hoy
        } else {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (lastPlay === yesterday) {
                profile.streak.current++;
            } else {
                profile.streak.current = 1;
            }
        }

        profile.streak.last = today;
        if (profile.streak.current > profile.streak.best) {
            profile.streak.best = profile.streak.current;
        }

        this.saveCurrent();
    },

    // Actualizar estadísticas
    updateStats(result) {
        if (!this.current) return;

        const p = this.current;
        if (!p.stats) {
            p.stats = { games: 0, score: 0, correct: 0, wrong: 0, time: 0, best: 0, streak: 0 };
        }

        p.stats.games++;
        p.stats.score += result.score || 0;
        p.stats.correct += result.correct || 0;
        p.stats.wrong += result.wrong || 0;
        p.stats.time += result.time || 0;
        
        if ((result.score || 0) > p.stats.best) {
            p.stats.best = result.score;
        }
        if ((result.maxStreak || 0) > p.stats.streak) {
            p.stats.streak = result.maxStreak;
        }

        // Actualizar progreso de nivel
        if (result.difficulty && p.levels) {
            p.levels[result.difficulty] = Math.min((p.levels[result.difficulty] || 0) + 0.1, 1);
        }

        this.saveCurrent();
    },

    // Cambiar avatar
    setAvatar(avatarId) {
        if (!this.current) return false;
        
        const avatar = QuizData?.getAvatar?.(avatarId);
        if (!avatar) return false;

        if (avatar.requires && !this.current.achievements?.includes(avatar.requires)) {
            return false;
        }

        this.current.avatar = avatarId;
        this.saveCurrent();
        return true;
    },

    // Verificar si avatar está desbloqueado
    isAvatarUnlocked(avatarId) {
        const avatar = QuizData?.avatars?.[avatarId];
        if (!avatar) return false;
        if (!avatar.requires) return true;
        return this.current?.achievements?.includes(avatar.requires) || false;
    },

    // Obtener avatares desbloqueados
    getUnlockedAvatars() {
        if (!this.current) return ['default_1', 'default_2', 'default_3', 'default_4'];
        return Object.keys(QuizData?.avatars || {}).filter(id => this.isAvatarUnlocked(id));
    },

    // Obtener datos del avatar actual
    getCurrentAvatarData() {
        if (!this.current) return QuizData?.avatars?.default_1 || { icon: '👤', name: 'Usuario' };
        return QuizData?.getAvatar?.(this.current.avatar) || { icon: '👤', name: 'Usuario' };
    }
};

window.QuizProfile = QuizProfile;
