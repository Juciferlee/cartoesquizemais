/**
 * ============================================
 * STORAGE.JS - Manejo de LocalStorage
 * ============================================
 */

const Storage = {
    // === GENÉRICOS ===
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    // === CARDS ===
    getCards() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.cards || 'cartoesx_cards', []);
    },

    saveCards(cards) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.cards || 'cartoesx_cards', cards);
    },

    // === CAROUSEL ===
    getCarousel() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.carousel || 'cartoesx_carousel', []);
    },

    saveCarousel(slides) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.carousel || 'cartoesx_carousel', slides);
    },

    // === QUIZ: Questions ===
    getQuizQuestions() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.quizQuestions || 'cartoesx_quiz_questions', []);
    },

    saveQuizQuestions(questions) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.quizQuestions || 'cartoesx_quiz_questions', questions);
    },

    // === QUIZ: Ranking ===
    getQuizRanking() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.quizRanking || 'cartoesx_quiz_ranking', []);
    },

    saveQuizRanking(ranking) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.quizRanking || 'cartoesx_quiz_ranking', ranking);
    },

    // === QUIZ: Profiles ===
    getQuizProfiles() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.quizProfiles || 'cartoesx_quiz_profiles', []);
    },

    saveQuizProfiles(profiles) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.quizProfiles || 'cartoesx_quiz_profiles', profiles);
    },

    // === QUIZ: Current Profile ===
    getQuizCurrentProfile() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.quizCurrent || 'cartoesx_quiz_current_profile', null);
    },

    saveQuizCurrentProfile(profile) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.quizCurrent || 'cartoesx_quiz_current_profile', profile);
    },

    clearQuizCurrentProfile() {
        const config = window.CONFIG || {};
        this.remove(config.storage?.quizCurrent || 'cartoesx_quiz_current_profile');
    },

    // === QUIZ: Activity ===
    getQuizActivity() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.quizActivity || 'cartoesx_quiz_activity_feed', []);
    },

    saveQuizActivity(activity) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.quizActivity || 'cartoesx_quiz_activity_feed', activity);
    },

    // === QUIZ: Highlights ===
    getQuizHighlights() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.quizHighlights || 'cartoesx_quiz_highlights', []);
    },

    saveQuizHighlights(highlights) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.quizHighlights || 'cartoesx_quiz_highlights', highlights);
    },

    // === QUIZ: Init Flag ===
    isQuizInitialized() {
        const config = window.CONFIG || {};
        return localStorage.getItem(config.storage?.quizInit || 'cartoesx_quiz_initialized') === 'true';
    },

    setQuizInitialized() {
        const config = window.CONFIG || {};
        localStorage.setItem(config.storage?.quizInit || 'cartoesx_quiz_initialized', 'true');
    },

    // === CAMPAIGN: Estado por Usuario ===
    getCampaignState(userId = null) {
        // Si no se pasa userId, obtener del perfil actual
        if (!userId) {
            const profile = this.getQuizCurrentProfile();
            userId = profile?.id || 'guest';
        }
        
        const key = `cartoesx_campaign_state_${userId}`;
        return this.get(key, null);
    },

    saveCampaignState(state, userId = null) {
        if (!userId) {
            const profile = this.getQuizCurrentProfile();
            userId = profile?.id || 'guest';
        }
        
        const key = `cartoesx_campaign_state_${userId}`;
        return this.set(key, state);
    },

    // === CAMPAIGN: Verificar Práctica Desbloqueada ===
    getPracticeStatus(userId = null) {
        const state = this.getCampaignState(userId);
        return state?.unlockedPractice || { facil: false, media: false, dificil: false };
    },

    isPracticeUnlocked(difficulty, userId = null) {
        const status = this.getPracticeStatus(userId);
        return status[difficulty] === true;
    },

    // === CAMPAIGN: Maps ===
    getCampaignMaps() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.campaignMaps || 'cartoesx_campaign_maps', []);
    },

    saveCampaignMaps(maps) {
        const config = window.CONFIG || {};
        return this.set(config.storage?.campaignMaps || 'cartoesx_campaign_maps', maps);
    },

    // === CAMPAIGN: Config ===
    getCampaignConfig() {
        const config = window.CONFIG || {};
        return this.get(config.storage?.campaignConfig || 'cartoesx_campaign_config', {});
    },

    saveCampaignConfig(config) {
        const configObj = window.CONFIG || {};
        return this.set(configObj.storage?.campaignConfig || 'cartoesx_campaign_config', config);
    }
};

window.Storage = Storage;