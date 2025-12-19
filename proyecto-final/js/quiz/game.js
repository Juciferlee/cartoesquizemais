// ============================================
// QUIZ/GAME.JS - Lógica del Juego
// ============================================

const QuizGame = {
    // Estado del juego
    state: {
        active: false,
        questions: [],
        currentIndex: 0,
        score: 0,
        correct: 0,
        wrong: 0,
        streak: 0,
        maxStreak: 0,
        difficulty: 'facil',
        timerEnabled: true,
        timeLeft: 30,
        timer: null,
        startTime: null,
        answerStartTime: null,
        cooldownBlocked: false,
        profileId: null
    },

    // Iniciar juego
    start(options = {}) {
        const difficulty = options.difficulty || 'facil';
        const timerEnabled = options.timer !== false;
        const config = typeof QuizRules !== 'undefined' ? QuizRules.getConfig() : null;
        const questionCount = config?.questionsPerGame || options.count || 10;
        const profileId = options.profileId || Storage.getQuizCurrentProfile()?.id;

        // Verificar cooldown si QuizRules existe
        if (typeof QuizRules !== 'undefined' && profileId) {
            const cooldownCheck = QuizRules.isLevelInCooldown(difficulty, profileId);
            if (cooldownCheck.inCooldown) {
                return { 
                    success: false, 
                    error: cooldownCheck.message,
                    cooldown: true,
                    remaining: cooldownCheck.remaining
                };
            }

            // Verificar desbloqueo
            const unlockCheck = QuizRules.isLevelUnlocked(difficulty, profileId);
            if (!unlockCheck.unlocked) {
                return {
                    success: false,
                    error: unlockCheck.message,
                    locked: true
                };
            }
        }

        // Obtener preguntas
        let questions = Storage.getQuizQuestions();
        if (questions.length === 0) {
            questions = QuizData.exampleQuestions;
        }

        // Filtrar por dificultad
        if (difficulty !== 'all') {
            questions = questions.filter(q => q.diff === difficulty && q.active !== false);
        }

        // Usar Fisher-Yates para mezclar preguntas
        if (typeof QuizRules !== 'undefined') {
            questions = QuizRules.shuffleQuestions(questions);
        } else {
            questions = Utils.shuffle(questions);
        }
        
        questions = questions.slice(0, questionCount);

        // Mezclar respuestas de cada pregunta con Fisher-Yates
        if (typeof QuizRules !== 'undefined') {
            questions = questions.map(q => QuizRules.shuffleQuestionWithAnswers(q));
        }

        if (questions.length === 0) {
            return { success: false, error: 'Nenhuma pergunta disponível' };
        }

        // Obtener tiempo del nivel desde config
        const timeLimit = typeof QuizRules !== 'undefined' 
            ? QuizRules.getTimeForLevel(difficulty)
            : QuizData.getDifficulty(difficulty).time;

        // Resetear estado
        this.state = {
            active: true,
            questions: questions,
            currentIndex: 0,
            score: 0,
            correct: 0,
            wrong: 0,
            streak: 0,
            maxStreak: 0,
            difficulty: difficulty,
            timerEnabled: timerEnabled,
            timeLeft: timeLimit,
            timer: null,
            startTime: Date.now(),
            answerStartTime: Date.now(),
            cooldownBlocked: false,
            profileId: profileId
        };

        // Resetear sesión de achievements
        QuizAchievements.resetSession();

        return { success: true, question: this.getCurrentQuestion() };
    },

    // Obtener pregunta actual
    getCurrentQuestion() {
        if (!this.state.active) return null;
        const q = this.state.questions[this.state.currentIndex];
        if (!q) return null;

        // Usar puntos y tiempo de config si disponible
        const points = typeof QuizRules !== 'undefined' 
            ? QuizRules.getPointsForLevel(q.diff)
            : QuizData.getDifficulty(q.diff).points;
            
        const timeLimit = typeof QuizRules !== 'undefined'
            ? QuizRules.getTimeForLevel(q.diff)
            : QuizData.getDifficulty(q.diff).time;

        return {
            index: this.state.currentIndex + 1,
            total: this.state.questions.length,
            question: q.question,
            options: q.options,
            difficulty: q.diff,
            points: points,
            timeLimit: timeLimit
        };
    },

    // Responder pregunta
    answer(optionIndex) {
        if (!this.state.active) return null;

        const q = this.state.questions[this.state.currentIndex];
        const isCorrect = optionIndex === q.correct;
        const timeToAnswer = (Date.now() - this.state.answerStartTime) / 1000;
        
        // Usar puntos de config si disponible
        const points = typeof QuizRules !== 'undefined'
            ? QuizRules.getPointsForLevel(q.diff)
            : QuizData.getDifficulty(q.diff).points;
            
        const timeLimit = typeof QuizRules !== 'undefined'
            ? QuizRules.getTimeForLevel(q.diff)
            : QuizData.getDifficulty(q.diff).time;

        // Detener timer
        this.stopTimer();

        if (isCorrect) {
            this.state.correct++;
            this.state.streak++;
            if (this.state.streak > this.state.maxStreak) {
                this.state.maxStreak = this.state.streak;
            }
            // Bonus por velocidad
            const timeBonus = Math.max(0, Math.floor((this.state.timeLeft / timeLimit) * 5));
            this.state.score += points + timeBonus;

            // Verificar logro de respuesta rápida
            QuizAchievements.checkAfterAnswer(timeToAnswer);
        } else {
            this.state.wrong++;
            this.state.streak = 0;
        }

        return {
            correct: isCorrect,
            correctIndex: q.correct,
            pointsEarned: isCorrect ? points : 0,
            currentScore: this.state.score,
            streak: this.state.streak
        };
    },

    // Siguiente pregunta
    next() {
        if (!this.state.active) return null;

        this.state.currentIndex++;
        this.state.answerStartTime = Date.now();

        if (this.state.currentIndex >= this.state.questions.length) {
            return this.finish();
        }

        return { 
            finished: false, 
            question: this.getCurrentQuestion() 
        };
    },

    // Finalizar juego
    finish() {
        this.state.active = false;
        this.stopTimer();

        const totalTime = Math.floor((Date.now() - this.state.startTime) / 1000);
        const accuracy = Math.round((this.state.correct / this.state.questions.length) * 100);

        const result = {
            score: this.state.score,
            correct: this.state.correct,
            wrong: this.state.wrong,
            total: this.state.questions.length,
            time: totalTime,
            accuracy: accuracy,
            maxStreak: this.state.maxStreak,
            difficulty: this.state.difficulty
        };

        // Actualizar estadísticas del perfil
        QuizProfile.updateStats(result);

        // Agregar al ranking si tiene timer
        if (this.state.timerEnabled) {
            QuizRanking.add(result);
        }

        // Registrar actividad
        QuizActivity.logGame(result);

        // Verificar logros
        QuizAchievements.checkAfterGame(result);

        // === NUEVAS REGLAS DE NEGOCIO ===
        if (typeof QuizRules !== 'undefined' && this.state.profileId) {
            // Registrar preguntas respondidas para desbloqueo semanal
            QuizRules.registerAnsweredQuestions(
                this.state.profileId, 
                this.state.difficulty, 
                this.state.questions.length
            );

            // Activar cooldown del nivel (12h)
            QuizRules.registerLevelPlay(this.state.difficulty, this.state.profileId);

            // Log de actividad con el perfil
            const profile = Storage.getQuizCurrentProfile();
            QuizRules.logActivity('game', {
                userId: this.state.profileId,
                username: profile?.username || 'Jogador',
                level: this.state.difficulty,
                score: result.score,
                correct: result.correct,
                total: result.total
            });
        }

        return { finished: true, result };
    },

    // Iniciar timer
    startTimer(onTick, onTimeUp) {
        if (!this.state.timerEnabled) return;

        const q = this.state.questions[this.state.currentIndex];
        this.state.timeLeft = QuizData.getDifficulty(q.diff).time;

        this.stopTimer();
        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            if (onTick) onTick(this.state.timeLeft);

            if (this.state.timeLeft <= 0) {
                this.stopTimer();
                if (onTimeUp) onTimeUp();
            }
        }, 1000);
    },

    // Detener timer
    stopTimer() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
            this.state.timer = null;
        }
    },

    // Obtener tiempo restante
    getTimeLeft() {
        return this.state.timeLeft;
    },

    // Verificar si el juego está activo
    isActive() {
        return this.state.active;
    },

    // Obtener estado actual
    getState() {
        return { ...this.state };
    }
};

// Export global
window.QuizGame = QuizGame;
