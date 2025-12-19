/**
 * ============================================
 * QUIZ/INIT.JS - Inicialización del Quiz
 * ============================================
 */

const QuizInit = {
    // Inicializar datos de ejemplo
    initExampleData() {
        // Verificar que QuizData esté cargado
        if (typeof QuizData === 'undefined') {
            console.error('QuizData no está definido. Reintentando en 500ms...');
            setTimeout(() => this.initExampleData(), 500);
            return;
        }
        
        console.log('Initializing quiz example data...');
        
        // Verificar si ya fue inicializado
        if (localStorage.getItem(CONFIG.storage.quizInit)) {
            console.log('Quiz ya fue inicializado anteriormente');
            return;
        }
        
        // Guardar preguntas de ejemplo
        Storage.saveQuizQuestions(QuizData.exampleQuestions);
        
        // Guardar perfiles de ejemplo
        Storage.saveQuizProfiles(QuizData.exampleProfiles);
        
        // Marcar como inicializado
        localStorage.setItem(CONFIG.storage.quizInit, 'true');
        
        console.log('✅ Quiz inicializado con datos de ejemplo');
    },
    
    // Verificar e inicializar si es necesario
    checkAndInit() {
        // Esperar a que QuizData esté disponible
        if (typeof QuizData === 'undefined') {
            console.warn('QuizData no disponible, reintentando...');
            setTimeout(() => this.checkAndInit(), 300);
            return;
        }
        
        // Verificar si necesita inicialización
        if (!localStorage.getItem(CONFIG.storage.quizInit)) {
            this.initExampleData();
        } else {
            console.log('Quiz ya inicializado');
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un momento para asegurar que todos los scripts se carguen
    setTimeout(() => {
        QuizInit.checkAndInit();
    }, 500);
});

// También intentar inicializar si el evento DOMContentLoaded ya ocurrió
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        QuizInit.checkAndInit();
    }, 300);
}