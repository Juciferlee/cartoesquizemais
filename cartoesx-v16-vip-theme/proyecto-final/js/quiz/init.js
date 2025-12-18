// ============================================
// QUIZ/INIT.JS - Inicialización del Quiz
// ============================================

const QuizInit = {
    // Inicializar datos de ejemplo si no existen
    initExampleData() {
        if (Storage.isQuizInitialized()) {
            console.log('Quiz already initialized');
            return;
        }

        console.log('Initializing quiz example data...');

        // Guardar perfiles de ejemplo
        Storage.saveQuizProfiles(QuizData.exampleProfiles);

        // Guardar preguntas de ejemplo
        Storage.saveQuizQuestions(QuizData.exampleQuestions);

        // Crear ranking de ejemplo
        const week = Utils.getCurrentWeek();
        const month = Utils.getCurrentMonth();
        
        const ranking = [
            { id: 1, odId: 'ex3', name: 'CreditoExpert', avatar: 'brain_galaxy', score: 200, correct: 10, total: 10, time: 52, accuracy: 100, date: new Date().toISOString(), week, month },
            { id: 2, odId: 'ex1', name: 'CardMaster', avatar: 'crown', score: 180, correct: 9, total: 10, time: 58, accuracy: 90, date: new Date().toISOString(), week, month },
            { id: 3, odId: 'ex2', name: 'QuizNinja', avatar: 'lightning', score: 165, correct: 9, total: 10, time: 45, accuracy: 90, date: new Date().toISOString(), week, month }
        ];
        Storage.saveQuizRanking(ranking);

        // Crear actividad de ejemplo
        const activity = [
            { id: 1, type: 'achievement', username: 'CreditoExpert', avatar: 'brain_galaxy', text: 'desbloqueou Cérebro Galáctico', achievementId: 'cerebro_galactico', timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
            { id: 2, type: 'game', username: 'CardMaster', avatar: 'crown', text: 'fez 180 pts', score: 180, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
            { id: 3, type: 'achievement', username: 'QuizNinja', avatar: 'lightning', text: 'desbloqueou Relâmpago', achievementId: 'relampago', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() }
        ];
        Storage.saveQuizActivity(activity);

        // Crear highlights de ejemplo
        const highlights = [
            { id: 1, username: 'CreditoExpert', avatar: 'brain_galaxy', achievementId: 'cerebro_galactico', achievementName: 'Cérebro Galáctico', achievementIcon: '🧠', achievementRarity: 'legendary', timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
            { id: 2, username: 'CardMaster', avatar: 'crown', achievementId: 'rey_del_mes', achievementName: 'Rei do Mês', achievementIcon: '👑', achievementRarity: 'legendary', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
            { id: 3, username: 'QuizNinja', avatar: 'lightning', achievementId: 'relampago', achievementName: 'Relâmpago', achievementIcon: '⚡', achievementRarity: 'rare', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() }
        ];
        Storage.saveQuizHighlights(highlights);

        // Marcar como inicializado
        Storage.setQuizInitialized();
        console.log('Quiz example data initialized');
    }
};

// Export global
window.QuizInit = QuizInit;
