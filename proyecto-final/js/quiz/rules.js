// ============================================
// QUIZ/RULES.JS - Reglas de Negocio del Quiz
// ============================================

const QuizRules = {
    // ========== CONFIGURACIÓN ==========
    getConfig() {
        const saved = Storage.get('cartoesx_admin_config');
        return saved || {
            unlockRules: {
                media: { requirement: 80, type: 'completion' },
                dificil: { requirement: 90, type: 'completion' },
                avancado: { requirement: 100, type: 'all_levels' }
            },
            cooldown: {
                enabled: true,
                hours: 12,
                byLevel: true
            },
            points: {
                facil: 10,
                media: 15,
                dificil: 20,
                avancado: 25
            },
            time: {
                facil: 30,
                media: 25,
                dificil: 20,
                avancado: 15
            },
            questionsPerGame: 10,
            shuffleQuestions: true,
            shuffleAnswers: true
        };
    },

    // ========== FISHER-YATES SHUFFLE ==========
    // Algoritmo Fisher-Yates para aleatorización perfecta
    shuffleArray(array, seed = null) {
        const arr = [...array];
        
        // Generador de números pseudo-aleatorios con semilla (para debug)
        const random = seed !== null 
            ? this.seededRandom(seed) 
            : () => Math.random();

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Generador con semilla para reproducibilidad (debug)
    seededRandom(seed) {
        let s = seed;
        return function() {
            s = Math.sin(s) * 10000;
            return s - Math.floor(s);
        };
    },

    // Mezclar pregunta con sus respuestas
    shuffleQuestionWithAnswers(question, seed = null) {
        const config = this.getConfig();
        
        if (!config.shuffleAnswers) {
            return question;
        }

        // Crear array de respuestas con índice original
        const answers = question.options.map((text, index) => ({
            text,
            originalIndex: index,
            isCorrect: index === question.correct
        }));

        // Mezclar con Fisher-Yates
        const shuffled = this.shuffleArray(answers, seed);

        // Encontrar nuevo índice de la respuesta correcta
        const newCorrectIndex = shuffled.findIndex(a => a.isCorrect);

        return {
            ...question,
            options: shuffled.map(a => a.text),
            correct: newCorrectIndex,
            _originalCorrect: question.correct // Para debug
        };
    },

    // Mezclar array de preguntas
    shuffleQuestions(questions, seed = null) {
        const config = this.getConfig();
        
        if (!config.shuffleQuestions) {
            return questions;
        }

        return this.shuffleArray(questions, seed);
    },

    // ========== COOLDOWN 12H POR NIVEL ==========
    COOLDOWN_KEY: 'cartoesx_quiz_cooldowns',

    getCooldowns() {
        return Storage.get(this.COOLDOWN_KEY, {});
    },

    saveCooldowns(cooldowns) {
        Storage.set(this.COOLDOWN_KEY, cooldowns);
    },

    // Verificar si el nivel está en cooldown
    isLevelInCooldown(level, profileId) {
        const config = this.getConfig();
        if (!config.cooldown.enabled) return { inCooldown: false };

        const cooldowns = this.getCooldowns();
        const key = `${profileId}_${level}`;
        const lastPlay = cooldowns[key];

        if (!lastPlay) return { inCooldown: false };

        const cooldownMs = config.cooldown.hours * 60 * 60 * 1000;
        const elapsed = Date.now() - lastPlay;
        const remaining = cooldownMs - elapsed;

        if (remaining > 0) {
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            
            return {
                inCooldown: true,
                remaining,
                hours,
                minutes,
                message: config.messages?.cooldownLimit?.replace('{hours}', hours).replace('{minutes}', minutes) 
                    || `Você atingiu o limite de pontos para este nível. Volte em ${hours}h ${minutes}m.`
            };
        }

        return { inCooldown: false };
    },

    // Registrar que se jugó un nivel (activar cooldown)
    registerLevelPlay(level, profileId) {
        const config = this.getConfig();
        if (!config.cooldown.enabled) return;

        const cooldowns = this.getCooldowns();
        const key = `${profileId}_${level}`;
        cooldowns[key] = Date.now();
        this.saveCooldowns(cooldowns);

        // Registrar en activity log
        this.logActivity('limit', {
            userId: profileId,
            level,
            timestamp: new Date().toISOString()
        });
    },

    // Limpiar cooldown de un nivel
    clearLevelCooldown(level, profileId) {
        const cooldowns = this.getCooldowns();
        const key = `${profileId}_${level}`;
        delete cooldowns[key];
        this.saveCooldowns(cooldowns);
    },

    // Limpiar todos los cooldowns de un perfil
    clearAllCooldowns(profileId) {
        const cooldowns = this.getCooldowns();
        ['facil', 'media', 'dificil', 'avancado'].forEach(level => {
            delete cooldowns[`${profileId}_${level}`];
        });
        this.saveCooldowns(cooldowns);
    },

    // ========== DESBLOQUEO SEMANAL ==========
    WEEKLY_KEY: 'cartoesx_quiz_weekly',

    getWeeklyProgress() {
        const saved = Storage.get(this.WEEKLY_KEY);
        const currentWeek = this.getCurrentWeekNumber();
        
        // Si es una nueva semana, resetear progreso
        if (!saved || saved.week !== currentWeek) {
            const fresh = {
                week: currentWeek,
                profiles: {}
            };
            this.saveWeeklyProgress(fresh);
            return fresh;
        }
        
        return saved;
    },

    saveWeeklyProgress(data) {
        Storage.set(this.WEEKLY_KEY, data);
    },

    getCurrentWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.floor(diff / oneWeek);
    },

    // Obtener progreso semanal de un perfil
    getProfileWeeklyProgress(profileId) {
        const weekly = this.getWeeklyProgress();
        return weekly.profiles[profileId] || {
            facil: { answered: 0, total: 0 },
            media: { answered: 0, total: 0 },
            dificil: { answered: 0, total: 0 },
            avancado: { answered: 0, total: 0 }
        };
    },

    // Registrar preguntas respondidas
    registerAnsweredQuestions(profileId, level, count) {
        const weekly = this.getWeeklyProgress();
        
        if (!weekly.profiles[profileId]) {
            weekly.profiles[profileId] = {
                facil: { answered: 0, total: 0 },
                media: { answered: 0, total: 0 },
                dificil: { answered: 0, total: 0 },
                avancado: { answered: 0, total: 0 }
            };
        }

        // Contar total de preguntas disponibles por nivel
        const questions = Storage.getQuizQuestions();
        const totalByLevel = {
            facil: questions.filter(q => q.diff === 'facil').length,
            media: questions.filter(q => q.diff === 'media').length,
            dificil: questions.filter(q => q.diff === 'dificil').length,
            avancado: questions.filter(q => q.diff === 'avancado').length
        };

        weekly.profiles[profileId][level].answered += count;
        weekly.profiles[profileId][level].total = totalByLevel[level] || 10;

        this.saveWeeklyProgress(weekly);
    },

    // Calcular porcentaje de completado
    getCompletionPercentage(profileId, level) {
        const progress = this.getProfileWeeklyProgress(profileId);
        const levelProgress = progress[level];
        
        if (!levelProgress || levelProgress.total === 0) return 0;
        
        return Math.min(100, Math.round((levelProgress.answered / levelProgress.total) * 100));
    },

    // Verificar si un nivel está desbloqueado
    isLevelUnlocked(level, profileId) {
        const config = this.getConfig();
        
        // Fácil siempre desbloqueado
        if (level === 'facil') return { unlocked: true };

        const rules = config.unlockRules;

        if (level === 'media') {
            const facilPct = this.getCompletionPercentage(profileId, 'facil');
            const required = rules.media.requirement;
            return {
                unlocked: facilPct >= required,
                current: facilPct,
                required,
                message: `Complete ${required}% do Fácil (atual: ${facilPct}%)`
            };
        }

        if (level === 'dificil') {
            const mediaPct = this.getCompletionPercentage(profileId, 'media');
            const required = rules.dificil.requirement;
            return {
                unlocked: mediaPct >= required,
                current: mediaPct,
                required,
                message: `Complete ${required}% do Médio (atual: ${mediaPct}%)`
            };
        }

        if (level === 'avancado') {
            const facilPct = this.getCompletionPercentage(profileId, 'facil');
            const mediaPct = this.getCompletionPercentage(profileId, 'media');
            const dificilPct = this.getCompletionPercentage(profileId, 'dificil');
            const required = rules.avancado.requirement;
            const allComplete = facilPct >= required && mediaPct >= required && dificilPct >= required;
            
            return {
                unlocked: allComplete,
                current: Math.min(facilPct, mediaPct, dificilPct),
                required,
                message: `Complete ${required}% de todos os níveis`
            };
        }

        return { unlocked: false };
    },

    // ========== ACTIVITY LOG ==========
    logActivity(type, data) {
        const activity = Storage.getQuizActivity() || [];
        
        activity.unshift({
            id: Date.now(),
            type,
            data,
            timestamp: new Date().toISOString()
        });

        // Mantener solo últimas 200
        if (activity.length > 200) {
            activity.splice(200);
        }

        Storage.saveQuizActivity(activity);
    },

    // ========== VALIDACIONES ==========
    // Validación anti-ofensivo para nombres
    validateUsername(username) {
        if (!username || username.trim().length < 2) {
            return { valid: false, error: 'Nome muito curto (mínimo 2 caracteres)' };
        }

        if (username.length > 20) {
            return { valid: false, error: 'Nome muito longo (máximo 20 caracteres)' };
        }

        // Lista básica de palabras prohibidas
        const forbidden = [
            'admin', 'moderador', 'mod', 'staff', 'suporte',
            'puta', 'puto', 'merda', 'caralho', 'foda', 'fdp',
            'idiota', 'burro', 'otario', 'viado', 'gay'
        ];

        const lower = username.toLowerCase().replace(/[0-9@#$%&*]/g, '');
        
        for (const word of forbidden) {
            if (lower.includes(word)) {
                return { valid: false, error: 'Nome contém termo não permitido' };
            }
        }

        // Solo permitir letras, números, espacios y algunos caracteres
        if (!/^[a-zA-Z0-9áéíóúãõâêîôûàèìòùçÁÉÍÓÚÃÕÂÊÎÔÛÀÈÌÒÙÇ\s._-]+$/.test(username)) {
            return { valid: false, error: 'Nome contém caracteres inválidos' };
        }

        return { valid: true };
    },

    // ========== PUNTOS POR NIVEL ==========
    getPointsForLevel(level) {
        const config = this.getConfig();
        return config.points[level] || 10;
    },

    getTimeForLevel(level) {
        const config = this.getConfig();
        return config.time[level] || 30;
    },

    // ========== RESET FUNCIONES ==========
    resetWeeklyProgress(profileId = null) {
        if (profileId) {
            const weekly = this.getWeeklyProgress();
            delete weekly.profiles[profileId];
            this.saveWeeklyProgress(weekly);
        } else {
            Storage.remove(this.WEEKLY_KEY);
        }
    },

    resetAllRules() {
        Storage.remove(this.COOLDOWN_KEY);
        Storage.remove(this.WEEKLY_KEY);
        Storage.remove('cartoesx_admin_config');
    }
};

// Export global
window.QuizRules = QuizRules;
