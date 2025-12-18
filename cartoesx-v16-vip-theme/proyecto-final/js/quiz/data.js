/**
 * ============================================
 * QUIZ/DATA.JS - Catálogos y Datos
 * ============================================
 */

const QuizData = {
    // Avatares - Temática VIP/Aeropuerto
    avatars: {
        default_1: { name: 'Passageiro', icon: '👤', locked: false },
        default_2: { name: 'Viajante', icon: '🧳', locked: false },
        default_3: { name: 'Turista', icon: '🌴', locked: false },
        default_4: { name: 'Executivo', icon: '💼', locked: false },
        brain_galaxy: { name: 'Elite', icon: '🌟', requires: 'cerebro_galactico' },
        lightning: { name: 'Priority', icon: '⚡', requires: 'relampago' },
        fire: { name: 'Frequent', icon: '🔥', requires: 'racha_perfecta' },
        target: { name: 'Concierge', icon: '🎯', requires: 'cirujano' },
        crown: { name: 'Black Card', icon: '💳', requires: 'rey_del_mes' },
        trophy: { name: 'Platinum', icon: '🏆', requires: 'jugador_semanal' },
        rocket: { name: 'Fast Track', icon: '✈️', requires: 'velocista_quiz' },
        diamond: { name: 'Diamond', icon: '💎', requires: 'perfeccionista' },
        ninja: { name: 'Stealth', icon: '🥷', requires: 'ninja_silencioso' },
        robot: { name: 'AI Assist', icon: '🤖', requires: 'maquina' },
        alien: { name: 'First Class', icon: '🛋️', requires: 'extraterrestre' },
        wizard: { name: 'Sommelier', icon: '🍷', requires: 'sabio' },
        dragon: { name: 'Chairman', icon: '👑', requires: 'lendario' }
    },

    // Logros - TEMÁTICA VIP/AEROPUERTO
    achievements: {
        // === QUIZ GENERAL ===
        primera_partida: { 
            name: 'Boarding Pass', 
            desc: 'Complete seu primeiro desafio', 
            icon: '🎫', 
            rarity: 'common',
            color: '#22c55e'
        },
        racha_perfecta: { 
            name: 'Frequent Flyer', 
            desc: 'Acerte 15 perguntas seguidas', 
            icon: '🔥', 
            rarity: 'rare',
            color: '#3b82f6'
        },
        cerebro_galactico: { 
            name: 'Elite Member', 
            desc: '100% de acertos em 3 desafios seguidos', 
            icon: '🧠', 
            rarity: 'legendary',
            color: '#f59e0b'
        },
        relampago: { 
            name: 'Priority Boarding', 
            desc: 'Responda 10 perguntas em menos de 2 segundos', 
            icon: '⚡', 
            rarity: 'rare',
            color: '#3b82f6'
        },
        cirujano: { 
            name: 'Concierge Expert', 
            desc: 'Acerte 25 perguntas seguidas', 
            icon: '🎯', 
            rarity: 'epic',
            color: '#a855f7'
        },
        velocista_quiz: { 
            name: 'Fast Track', 
            desc: 'Complete 5 desafios em menos de 45 segundos cada', 
            icon: '🚀', 
            rarity: 'epic',
            color: '#a855f7'
        },
        jugador_semanal: { 
            name: 'Platinum Status', 
            desc: 'Seja o #1 do ranking semanal com 500+ pts', 
            icon: '🏆', 
            rarity: 'legendary',
            color: '#f59e0b'
        },
        rey_del_mes: { 
            name: 'Black Card Member', 
            desc: 'Acumule 2000+ milhas no mês', 
            icon: '💳', 
            rarity: 'legendary',
            color: '#f59e0b'
        },
        perfeccionista: { 
            name: 'Diamond Class', 
            desc: '100% de acertos em 5 desafios', 
            icon: '💎', 
            rarity: 'epic',
            color: '#a855f7'
        },
        explorador: { 
            name: 'Globe Trotter', 
            desc: 'Complete desafios em todas as dificuldades', 
            icon: '🌍', 
            rarity: 'common',
            color: '#22c55e'
        },
        dedicado: { 
            name: 'Loyalty Program', 
            desc: 'Acesse 7 dias seguidos', 
            icon: '📅', 
            rarity: 'rare',
            color: '#3b82f6'
        },
        veterano: { 
            name: 'Million Miler', 
            desc: 'Complete 100 desafios', 
            icon: '🎖️', 
            rarity: 'epic',
            color: '#a855f7'
        },
        lendario: { 
            name: 'Chairman Circle', 
            desc: 'Desbloqueie 10 benefícios', 
            icon: '👑', 
            rarity: 'legendary',
            color: '#f59e0b'
        },
        madrugador: { 
            name: 'Red-Eye Flight', 
            desc: 'Acesse antes das 6h da manhã', 
            icon: '🌅', 
            rarity: 'rare',
            color: '#3b82f6'
        },

        // === CAMPAÑA - VIP JOURNEY ===
        primeiro_passo: { 
            name: 'Check-in Complete', 
            desc: 'Complete seu primeiro desafio na VIP Journey', 
            icon: '✈️', 
            rarity: 'common',
            color: '#22c55e'
        },
        iniciante: { 
            name: 'Passageiro', 
            desc: 'Iniciou sua jornada VIP', 
            icon: '🛫', 
            rarity: 'common',
            color: '#6366f1'
        },
        conquistador: { 
            name: 'Lounge Access', 
            desc: 'Desbloqueie uma área VIP completa', 
            icon: '🥂', 
            rarity: 'rare',
            color: '#3b82f6'
        },
        mestre_reino: { 
            name: 'First Class Only', 
            desc: 'Desbloqueie todas as áreas VIP', 
            icon: '💎', 
            rarity: 'legendary',
            color: '#f59e0b'
        },
        estrelado: { 
            name: 'Five Star Service', 
            desc: 'Obtenha 3 estrelas em 10 desafios', 
            icon: '⭐', 
            rarity: 'epic',
            color: '#a855f7'
        },
        sem_piedade: { 
            name: 'Impecável', 
            desc: '5 desafios seguidos sem erros', 
            icon: '✨', 
            rarity: 'epic',
            color: '#a855f7'
        },
        sobrevivente: { 
            name: 'Last Call', 
            desc: 'Complete um desafio com apenas 1 tentativa', 
            icon: '🛬', 
            rarity: 'rare',
            color: '#3b82f6'
        },
        velocista_campanha: { 
            name: 'Velocista da Campanha', 
            desc: 'Complete uma batalha em menos de 20 segundos', 
            icon: '💨', 
            rarity: 'rare',
            color: '#3b82f6'
        },
        estrategista: { 
            name: 'Estrategista', 
            desc: 'Use todos os tipos de power-ups', 
            icon: '🧠', 
            rarity: 'common',
            color: '#22c55e'
        },
        imparavel: { 
            name: 'Imparável', 
            desc: 'Racha de 20 acertos na campanha', 
            icon: '🔥', 
            rarity: 'epic',
            color: '#a855f7'
        },
        colecionador: { 
            name: 'Colecionador', 
            desc: 'Acumule 50 estrelas na campanha', 
            icon: '🌟', 
            rarity: 'legendary',
            color: '#f59e0b'
        },
        perfeito: { 
            name: 'Perfeito', 
            desc: 'Complete uma batalha sem erros', 
            icon: '✨', 
            rarity: 'common',
            color: '#22c55e'
        },
        resposta_rapida: { 
            name: 'Resposta Rápida', 
            desc: 'Responda em menos de 3 segundos', 
            icon: '⚡', 
            rarity: 'rare',
            color: '#3b82f6'
        },
        streak_5: { 
            name: 'Esquentando', 
            desc: 'Racha de 5 acertos', 
            icon: '🔥', 
            rarity: 'common',
            color: '#f59e0b'
        },
        streak_10: { 
            name: 'Sequência Épica', 
            desc: 'Racha de 10 acertos', 
            icon: '💥', 
            rarity: 'rare',
            color: '#ef4444'
        },

        // === PRÁCTICA ===
        pratica_facil: { 
            name: 'Prática Fácil', 
            desc: 'Desbloqueou Prática Fácil na Campanha', 
            icon: '📗', 
            rarity: 'common',
            color: '#22c55e'
        },
        pratica_media: { 
            name: 'Prática Média', 
            desc: 'Desbloqueou Prática Média na Campanha', 
            icon: '📙', 
            rarity: 'common',
            color: '#f59e0b'
        },
        pratica_dificil: { 
            name: 'Prática Difícil', 
            desc: 'Desbloqueou Prática Difícil na Campanha', 
            icon: '📕', 
            rarity: 'rare',
            color: '#ef4444'
        }
    },

    // Dificultades
    difficulties: {
        facil: { name: 'Fácil', color: '#22c55e', points: 100, time: 30 },
        media: { name: 'Médio', color: '#f59e0b', points: 150, time: 25 },
        dificil: { name: 'Difícil', color: '#ef4444', points: 200, time: 20 },
        avancado: { name: 'Avançado', color: '#a855f7', points: 250, time: 15 }
    },

    // Preguntas de ejemplo
    exampleQuestions: [
        { id: 1, question: 'Qual cartão oferece mais cashback em compras online?', options: ['Nubank', 'Inter', 'C6 Bank', 'PicPay'], correct: 1, diff: 'facil', points: 100, active: true },
        { id: 2, question: 'Qual a taxa média de juros do rotativo no Brasil?', options: ['50% ao ano', '150% ao ano', '300% ao ano', '450% ao ano'], correct: 2, diff: 'media', points: 150, active: true },
        { id: 3, question: 'O que significa CVV em um cartão?', options: ['Código de Verificação Virtual', 'Card Verification Value', 'Código Válido Visa', 'Central de Validação'], correct: 1, diff: 'facil', points: 100, active: true },
        { id: 4, question: 'Qual programa de milhas pertence ao Itaú?', options: ['Livelo', 'Smiles', 'TudoAzul', 'Latam Pass'], correct: 0, diff: 'media', points: 150, active: true },
        { id: 5, question: 'Quantos dígitos tem um cartão de crédito padrão?', options: ['14', '15', '16', '18'], correct: 2, diff: 'facil', points: 100, active: true },
        { id: 6, question: 'Qual bandeira é mais aceita mundialmente?', options: ['Visa', 'Mastercard', 'Elo', 'Amex'], correct: 0, diff: 'facil', points: 100, active: true },
        { id: 7, question: 'O que é anuidade de cartão?', options: ['Taxa mensal', 'Taxa anual de manutenção', 'Taxa por compra', 'Taxa de saque'], correct: 1, diff: 'facil', points: 100, active: true },
        { id: 8, question: 'Qual o limite máximo do Pix por transação?', options: ['R$ 1.000', 'R$ 5.000', 'Sem limite', 'Definido pelo banco'], correct: 3, diff: 'media', points: 150, active: true },
        { id: 9, question: 'O que é score de crédito?', options: ['Pontuação de compras', 'Pontuação de risco', 'Pontuação de milhas', 'Pontuação de cashback'], correct: 1, diff: 'facil', points: 100, active: true },
        { id: 10, question: 'Qual instituição regula cartões no Brasil?', options: ['Banco Central', 'CVM', 'Receita Federal', 'ANBIMA'], correct: 0, diff: 'dificil', points: 200, active: true }
    ],

    // Perfiles de ejemplo
    exampleProfiles: [
        {
            id: 'ex1',
            username: 'CardMaster',
            hash: 'h_example',
            avatar: 'crown',
            created: new Date(Date.now() - 30 * 86400000).toISOString(),
            stats: { games: 87, score: 4250, correct: 312, wrong: 45, time: 5600, best: 180, streak: 28 },
            achievements: ['primera_partida', 'racha_perfecta', 'rey_del_mes'],
            levels: { facil: 1, media: 1, dificil: 0.9, avancado: 0.6 },
            streak: { current: 12, best: 18, last: null }
        },
        {
            id: 'ex2',
            username: 'QuizNinja',
            hash: 'h_example',
            avatar: 'lightning',
            created: new Date(Date.now() - 20 * 86400000).toISOString(),
            stats: { games: 52, score: 2890, correct: 198, wrong: 62, time: 3200, best: 165, streak: 18 },
            achievements: ['primera_partida', 'relampago'],
            levels: { facil: 1, media: 0.85, dificil: 0.5, avancado: 0.2 },
            streak: { current: 8, best: 11, last: null }
        }
    ],

    // Helpers
    getAvatar(id) {
        return this.avatars[id] || this.avatars.default_1;
    },

    getAchievement(id) {
        return this.achievements[id] || null;
    },

    getDifficulty(id) {
        return this.difficulties[id] || this.difficulties.facil;
    }
};

window.QuizData = QuizData;
