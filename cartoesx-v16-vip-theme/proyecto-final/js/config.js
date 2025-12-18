/**
 * ============================================
 * CONFIG.JS - Configuración Global Unificada
 * ============================================
 */

const CONFIG = {
    supabase: {
        url: 'https://wdfirbghsefmqjtvrhrx.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZmlyYmdoc2VmbXFqdHZyaHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTc4OTEsImV4cCI6MjA3OTY3Mzg5MX0.CdbPPqW9GzYjsTwjigadxVLsFBEJxUb1elfTU3vz--Q'
    },
    storage: {
        cards: 'cartoesx_cards',
        carousel: 'cartoesx_carousel',
        quizQuestions: 'cartoesx_quiz_questions',
        quizRanking: 'cartoesx_quiz_ranking',
        quizProfiles: 'cartoesx_quiz_profiles',
        quizCurrent: 'cartoesx_quiz_current_profile',
        quizActivity: 'cartoesx_quiz_activity_feed',
        quizHighlights: 'cartoesx_quiz_highlights',
        quizInit: 'cartoesx_quiz_initialized',
        campaignMaps: 'cartoesx_campaign_maps',
        campaignConfig: 'cartoesx_campaign_config'
    },
    placeholders: {
        card: 'https://placehold.co/160x100/6a1b3a/FFFFFF?text=Card',
        slide: 'https://placehold.co/240x120/6a1b3a/FFFFFF?text=Slide'
    }
};

// Crear el cliente Supabase solo si no existe ya
try {
    if (window.supabase && window.supabase.createClient) {
        // Usar la misma instancia global que ya existe
        window.supabase = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.key);
    }
} catch (e) {
    console.error('Error initializing Supabase:', e);
    window.supabase = null;
}

window.CONFIG = CONFIG;