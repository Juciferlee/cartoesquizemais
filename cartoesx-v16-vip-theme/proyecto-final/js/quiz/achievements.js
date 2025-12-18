/**
 * ============================================
 * QUIZ/ACHIEVEMENTS.JS - Sistema de Logros
 * ============================================
 */

const QuizAchievements = {
    session: {
        perfectGames: 0,
        fastGames: 0,
        fastAnswers: 0
    },

    init() {
        this.resetSession();
        return this;
    },

    // Obtener logros desbloqueados del perfil actual
    getUnlocked() {
        const profile = QuizProfile?.current;
        return profile?.achievements || [];
    },

    // Verificar si un logro está desbloqueado
    isUnlocked(achievementId) {
        return this.getUnlocked().includes(achievementId);
    },

    // Desbloquear logro
    unlock(achievementId) {
        const profile = QuizProfile?.current;
        
        if (!profile) {
            // Sin perfil, guardar temporalmente
            try {
                const temp = JSON.parse(localStorage.getItem('cartoesx_temp_achievements') || '[]');
                if (!temp.includes(achievementId)) {
                    temp.push(achievementId);
                    localStorage.setItem('cartoesx_temp_achievements', JSON.stringify(temp));
                    return true;
                }
            } catch (e) {}
            return false;
        }

        // Ya desbloqueado
        if (!profile.achievements) profile.achievements = [];
        if (profile.achievements.includes(achievementId)) return false;

        const achievement = QuizData?.getAchievement?.(achievementId);
        
        // Agregar logro
        profile.achievements.push(achievementId);
        QuizProfile.saveCurrent?.();

        if (achievement) {
            // Registrar en highlights
            QuizActivity?.addHighlight?.(profile, achievement, achievementId);

            // Registrar en actividad
            QuizActivity?.add?.({
                type: 'achievement',
                username: profile.username,
                avatar: profile.avatar,
                odId: profile.id,
                text: `desbloqueou ${achievement.name}`,
                achievementId: achievementId
            });

            // Mostrar animación
            this.showUnlockAnimation(achievement);
        }

        return true;
    },

    // Verificar logros después de un juego
    checkAfterGame(result) {
        const profile = QuizProfile?.current;
        if (!profile) return;

        // Primera partida
        if (profile.stats?.games === 1) {
            this.unlock('primera_partida');
        }

        // Partida perfecta
        if (result.accuracy === 100) {
            this.session.perfectGames++;
            if (this.session.perfectGames >= 3) this.unlock('cerebro_galactico');
            if (this.session.perfectGames >= 5) this.unlock('perfeccionista');
        } else {
            this.session.perfectGames = 0;
        }

        // Racha de aciertos
        if (result.maxStreak >= 15) this.unlock('racha_perfecta');
        if (result.maxStreak >= 25) this.unlock('cirujano');

        // Partida rápida
        if (result.time < 45) {
            this.session.fastGames++;
            if (this.session.fastGames >= 5) this.unlock('velocista_quiz');
        }

        // Veterano
        if (profile.stats?.games >= 100) this.unlock('veterano');

        // Lendário (10 logros)
        if (profile.achievements?.length >= 10) this.unlock('lendario');

        // Racha diaria
        if (profile.streak?.current >= 7) this.unlock('dedicado');

        // Explorador
        const levels = profile.levels || {};
        if (levels.facil > 0 && levels.media > 0 && levels.dificil > 0 && levels.avancado > 0) {
            this.unlock('explorador');
        }

        // Madrugador
        if (new Date().getHours() < 6) this.unlock('madrugador');
    },

    // Verificar respuesta rápida
    checkAfterAnswer(timeToAnswer) {
        if (timeToAnswer < 2) {
            this.session.fastAnswers++;
            if (this.session.fastAnswers >= 10) this.unlock('relampago');
        }
    },

    // Mostrar animación de desbloqueo
    showUnlockAnimation(achievement) {
        // Verificar que no esté ya mostrando
        if (document.querySelector('.achievement-unlock-overlay')) return;

        const rarity = achievement.rarity || 'common';
        const rarityNames = {
            common: 'Comum',
            rare: 'Raro',
            epic: 'Épico',
            legendary: 'Lendário'
        };

        // Vibración de celebración
        if (navigator.vibrate) {
            if (rarity === 'legendary') {
                navigator.vibrate([100, 50, 100, 50, 200]);
            } else {
                navigator.vibrate([50, 30, 100]);
            }
        }

        // Generar confetti
        let confettiHTML = '';
        const colors = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#ec4899'];
        for (let i = 0; i < 40; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const size = 6 + Math.random() * 8;
            const shape = Math.random() > 0.5 ? 'border-radius: 50%;' : 'transform: rotate(45deg);';
            confettiHTML += `<div class="ach-confetti" style="
                left: ${left}%; 
                background: ${color}; 
                animation-delay: ${delay}s;
                width: ${size}px;
                height: ${size}px;
                ${shape}
            "></div>`;
        }

        // Generar sparkles
        let sparklesHTML = '';
        for (let i = 0; i < 6; i++) {
            const left = 15 + Math.random() * 70;
            const top = 15 + Math.random() * 70;
            const delay = Math.random() * 2;
            sparklesHTML += `<div class="ach-sparkle" style="left:${left}%;top:${top}%;animation-delay:${delay}s;"></div>`;
        }

        const overlay = document.createElement('div');
        overlay.className = 'achievement-unlock-overlay';
        overlay.innerHTML = `
            <div class="ach-confetti-container">${confettiHTML}</div>
            ${sparklesHTML}
            
            <div class="achievement-unlock-popup ${rarity}">
                <div class="ach-rays"></div>
                <div class="ach-new-badge">✨ NOVO!</div>
                
                <div class="achievement-unlock-icon">${achievement.icon || '🏆'}</div>
                
                <div class="achievement-unlock-content">
                    <span class="achievement-unlock-label">LOGRO DESBLOQUEADO</span>
                    <h3 class="achievement-unlock-name">${achievement.name || 'Logro'}</h3>
                    <p class="achievement-unlock-desc">${achievement.desc || achievement.description || ''}</p>
                    <span class="achievement-unlock-rarity ${rarity}">${rarityNames[rarity]}</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('show'));

        // Auto-cerrar después de 4 segundos (más tiempo para legendarios)
        const duration = rarity === 'legendary' ? 5000 : 4000;
        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 500);
        }, duration);

        // Click para cerrar
        overlay.onclick = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 500);
        };
    },

    resetSession() {
        this.session = { perfectGames: 0, fastGames: 0, fastAnswers: 0 };
    }
};

window.QuizAchievements = QuizAchievements;
