/**
 * ============================================
 * QUIZ/ACTIVITY.JS - Feed de Actividad
 * ============================================
 */

const QuizActivity = {
    MAX_ACTIVITY: 50,
    MAX_HIGHLIGHTS: 10,

    init() {
        return this;
    },

    // Agregar actividad
    add(item) {
        try {
            const activity = Storage.getQuizActivity();
            activity.unshift({
                id: Date.now(),
                timestamp: new Date().toISOString(),
                date: new Date().toISOString(),
                ...item
            });
            Storage.saveQuizActivity(activity.slice(0, this.MAX_ACTIVITY));
        } catch (e) {
            console.error('QuizActivity.add error:', e);
        }
    },

    // Obtener actividad reciente
    getRecent(limit = 5) {
        try {
            return Storage.getQuizActivity().slice(0, limit);
        } catch (e) {
            return [];
        }
    },

    // Alias para getRecent
    getFeed(limit = 10) {
        return this.getRecent(limit);
    },

    // Agregar highlight de logro
    addHighlight(profile, achievement, achievementId) {
        try {
            const highlights = Storage.getQuizHighlights();
            highlights.unshift({
                id: Date.now(),
                username: profile.username,
                avatar: profile.avatar,
                odId: profile.id,
                achievementId: achievementId,
                achievementName: achievement.name,
                achievementIcon: achievement.icon,
                achievementRarity: achievement.rarity,
                timestamp: new Date().toISOString()
            });
            Storage.saveQuizHighlights(highlights.slice(0, this.MAX_HIGHLIGHTS));
        } catch (e) {
            console.error('QuizActivity.addHighlight error:', e);
        }
    },

    // Obtener highlights recientes
    getHighlights(limit = 5) {
        try {
            return Storage.getQuizHighlights().slice(0, limit);
        } catch (e) {
            return [];
        }
    },

    // Registrar partida
    logGame(result) {
        const profile = QuizProfile?.current;
        const username = profile?.username || 'Jogador';
        const avatar = profile?.avatar || 'default_1';

        let text = `fez ${result.score || 0} pts`;
        
        // Agregar info de campaña si existe
        if (result.mode === 'campaign' && result.nodeName) {
            text = `conquistou ${result.nodeName} com ${result.score || 0} pts`;
            if (result.stars) {
                text += ` ${'⭐'.repeat(result.stars)}`;
            }
        }

        this.add({
            type: 'game',
            username: username,
            avatar: avatar,
            odId: profile?.id,
            text: text,
            message: text,
            score: result.score || 0,
            mode: result.mode || 'quiz',
            nodeName: result.nodeName,
            stars: result.stars,
            difficulty: result.difficulty
        });
    }
};

window.QuizActivity = QuizActivity;
