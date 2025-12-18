// ============================================
// UTILS.JS - Funciones Auxiliares
// ============================================

const Utils = {
    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Formatear tiempo (segundos a MM:SS)
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    },

    // Tiempo transcurrido (hace X minutos)
    timeAgo(timestamp) {
        if (!timestamp) return '';
        const now = Date.now();
        const diff = now - new Date(timestamp).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (mins < 1) return 'Agora';
        if (mins < 60) return `${mins}min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;
        return new Date(timestamp).toLocaleDateString('pt-BR');
    },

    // Obtener semana actual (YYYY-WXX)
    getCurrentWeek() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
    },

    // Obtener mes actual (YYYY-MM)
    getCurrentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    },

    // Obtener fecha actual (YYYY-MM-DD)
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },

    // Mezclar array (Fisher-Yates)
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Hash simple para contraseñas locales
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'h_' + Math.abs(hash).toString(36);
    },

    // Debounce
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    // Selector corto
    $(id) {
        return document.getElementById(id);
    },

    $$(selector) {
        return document.querySelectorAll(selector);
    }
};

// Export global
window.Utils = Utils;
