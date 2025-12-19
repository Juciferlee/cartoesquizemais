/**
 * ============================================
 * QUIZ/RANKING.JS - Sistema de Rankings
 * ============================================
 */

const QuizRanking = {
    MAX_ENTRIES: 100,

    init() {
        return this;
    },

    // Agregar entrada al ranking
    add(result) {
        try {
            const profile = QuizProfile?.current;
            const ranking = Storage.getQuizRanking();
            
            ranking.push({
                id: Date.now(),
                odId: profile?.id || 'guest',
                name: profile?.username || 'Jogador',
                avatar: profile?.avatar || 'default_1',
                score: result.score || 0,
                correct: result.correct || 0,
                total: result.total || 0,
                time: result.time || 0,
                accuracy: result.accuracy || 0,
                mode: result.mode || 'quiz',
                nodeId: result.nodeId,
                nodeName: result.nodeName,
                stars: result.stars,
                date: new Date().toISOString(),
                week: Utils.getCurrentWeek(),
                month: Utils.getCurrentMonth()
            });

            // Ordenar y limitar
            ranking.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return (a.time || 999) - (b.time || 999);
            });

            Storage.saveQuizRanking(ranking.slice(0, this.MAX_ENTRIES));

            // Verificar logros de ranking
            if (profile) {
                this.checkAchievements(profile);
            }
        } catch (e) {
            console.error('QuizRanking.add error:', e);
        }
    },

    // Obtener ranking global - UN SOLO REGISTRO POR USUARIO (el mejor)
    getGlobal(limit = 15) {
        const ranking = Storage.getQuizRanking();
        
        // Agrupar por usuario, quedarse con el mejor puntaje
        const best = {};
        ranking.forEach(entry => {
            const key = entry.odId || entry.name || 'guest';
            if (!best[key] || entry.score > best[key].score) {
                best[key] = entry;
            }
        });

        return Object.values(best)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },

    // Obtener ranking semanal
    getWeekly(limit = 15) {
        const currentWeek = Utils.getCurrentWeek();
        const ranking = Storage.getQuizRanking();
        
        // Filtrar por semana y agrupar por usuario
        const weeklyEntries = ranking.filter(r => r.week === currentWeek);
        const best = {};
        weeklyEntries.forEach(entry => {
            const key = entry.odId || entry.name || 'guest';
            if (!best[key] || entry.score > best[key].score) {
                best[key] = entry;
            }
        });

        return Object.values(best)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },

    // Obtener ranking mensual
    getMonthly(limit = 15) {
        const currentMonth = Utils.getCurrentMonth();
        const ranking = Storage.getQuizRanking();
        
        const monthlyEntries = ranking.filter(r => r.month === currentMonth);
        const best = {};
        monthlyEntries.forEach(entry => {
            const key = entry.odId || entry.name || 'guest';
            if (!best[key] || entry.score > best[key].score) {
                best[key] = entry;
            }
        });

        return Object.values(best)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    },

    // Obtener top 3 para Hall da Fama
    getTop3() {
        return this.getGlobal(3);
    },

    // Verificar logros de ranking
    checkAchievements(profile) {
        if (typeof QuizAchievements === 'undefined') return;

        // Campeón semanal
        const weekly = this.getWeekly();
        if (weekly.length > 0 && weekly[0].odId === profile.id) {
            const totalWeekly = Storage.getQuizRanking()
                .filter(r => r.odId === profile.id && r.week === Utils.getCurrentWeek())
                .reduce((sum, r) => sum + r.score, 0);
            if (totalWeekly >= 500) {
                QuizAchievements.unlock('jugador_semanal');
            }
        }

        // Rey del mes
        const monthly = this.getMonthly();
        if (monthly.length > 0) {
            const totalMonthly = Storage.getQuizRanking()
                .filter(r => r.odId === profile.id && r.month === Utils.getCurrentMonth())
                .reduce((sum, r) => sum + r.score, 0);
            if (totalMonthly >= 2000) {
                QuizAchievements.unlock('rey_del_mes');
            }
        }
    },

    // Obtener posición del perfil actual
    getCurrentPosition() {
        const profile = QuizProfile?.current;
        if (!profile) return -1;

        const global = this.getGlobal(100);
        const index = global.findIndex(r => r.odId === profile.id);
        return index === -1 ? -1 : index + 1;
    }
};

window.QuizRanking = QuizRanking;
