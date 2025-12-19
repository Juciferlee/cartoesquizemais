/**
 * Cinematic System - Historia y transiciones
 * Maneja escenas con imágenes y texto
 */

const Cinematic = {
    // Estado actual
    state: {
        isPlaying: false,
        currentScene: null,
        currentFrame: 0,
        seenCinematics: []
    },

    // Cinemáticas por defecto
    defaultCinematics: {
        'intro': {
            id: 'intro',
            name: 'Início da Jornada',
            trigger: 'first_play',
            frames: [
                {
                    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop',
                    text: 'Bem-vindo ao Reino do Conhecimento...',
                    subtext: 'Uma terra onde apenas os mais sábios prosperam.',
                    duration: 4000
                },
                {
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
                    text: 'Você foi escolhido para uma missão especial.',
                    subtext: 'Atravesse as terras e prove seu conhecimento.',
                    duration: 4000
                },
                {
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=500&fit=crop',
                    text: 'Cada batalha testará sua sabedoria.',
                    subtext: 'Responda corretamente para avançar!',
                    duration: 4000
                }
            ]
        },
        'zone_1': {
            id: 'zone_1',
            name: 'Entrando nas Planícies',
            trigger: 'enter_zone_1',
            frames: [
                {
                    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=500&fit=crop',
                    text: 'Você conquistou a Floresta Inicial!',
                    subtext: 'As Planícies do Conhecimento te aguardam.',
                    duration: 3500
                },
                {
                    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=500&fit=crop',
                    text: 'Os desafios serão mais difíceis aqui.',
                    subtext: 'Prepare-se para perguntas de nível médio!',
                    duration: 3500
                }
            ]
        },
        'zone_2': {
            id: 'zone_2',
            name: 'Ascendendo às Montanhas',
            trigger: 'enter_zone_2',
            frames: [
                {
                    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
                    text: 'As Montanhas da Sabedoria...',
                    subtext: 'Poucos chegam até aqui.',
                    duration: 3500
                },
                {
                    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=500&fit=crop',
                    text: 'O ar é rarefeito, mas sua mente está afiada.',
                    subtext: 'Desafios avançados te esperam!',
                    duration: 3500
                }
            ]
        },
        'death': {
            id: 'death',
            name: 'Derrota Temporária',
            trigger: 'lose_all_lives',
            frames: [
                {
                    image: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=800&h=500&fit=crop',
                    text: 'Suas forças se esgotaram...',
                    subtext: 'Você precisa descansar.',
                    duration: 3500
                },
                {
                    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=500&fit=crop',
                    text: 'Retorne em 8 horas.',
                    subtext: 'Use esse tempo para estudar!',
                    duration: 3500
                }
            ]
        },
        'return': {
            id: 'return',
            name: 'Retorno do Herói',
            trigger: 'return_from_cooldown',
            frames: [
                {
                    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=500&fit=crop',
                    text: 'Você retornou mais forte!',
                    subtext: 'Suas vidas foram restauradas.',
                    duration: 3000
                },
                {
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
                    text: 'A jornada continua...',
                    subtext: 'Conquiste o Reino do Conhecimento!',
                    duration: 3000
                }
            ]
        },
        'victory': {
            id: 'victory',
            name: 'Vitória Final',
            trigger: 'complete_campaign',
            frames: [
                {
                    image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=800&h=500&fit=crop',
                    text: 'PARABÉNS!',
                    subtext: 'Você conquistou o Reino do Conhecimento!',
                    duration: 4000
                },
                {
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop',
                    text: 'Você é um verdadeiro Mestre!',
                    subtext: 'Sua sabedoria é lendária.',
                    duration: 4000
                }
            ]
        },
        'walk_complete': {
            id: 'walk_complete',
            name: 'Caminhada Completa',
            trigger: 'complete_walk',
            frames: [
                {
                    image: 'https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=800&h=500&fit=crop',
                    text: 'Território Conquistado!',
                    subtext: 'Continue avançando pelo reino.',
                    duration: 2500
                }
            ]
        }
    },

    // Inicializar
    init() {
        this.loadSeenCinematics();
        return this;
    },

    // Cargar cinemáticas vistas
    loadSeenCinematics() {
        this.state.seenCinematics = Storage.get('cartoesx_seen_cinematics') || [];
    },

    // Guardar cinemáticas vistas
    saveSeenCinematic(id) {
        if (!this.state.seenCinematics.includes(id)) {
            this.state.seenCinematics.push(id);
            Storage.set('cartoesx_seen_cinematics', this.state.seenCinematics);
        }
    },

    // Obtener todas las cinemáticas (default + custom)
    getAllCinematics() {
        const custom = Storage.get('cartoesx_custom_cinematics') || {};
        return { ...this.defaultCinematics, ...custom };
    },

    // Obtener cinemática por ID
    getCinematic(id) {
        const all = this.getAllCinematics();
        return all[id] || null;
    },

    // Obtener cinemática por trigger
    getCinematicByTrigger(trigger) {
        const all = this.getAllCinematics();
        return Object.values(all).find(c => c.trigger === trigger);
    },

    // Verificar si debe mostrar cinemática
    shouldShowCinematic(id, force = false) {
        if (force) return true;
        return !this.state.seenCinematics.includes(id);
    },

    // Reproducir cinemática
    play(cinematicId, options = {}) {
        return new Promise((resolve) => {
            const cinematic = this.getCinematic(cinematicId);
            if (!cinematic) {
                resolve({ played: false, reason: 'not_found' });
                return;
            }

            if (!options.force && !this.shouldShowCinematic(cinematicId)) {
                resolve({ played: false, reason: 'already_seen' });
                return;
            }

            this.state.isPlaying = true;
            this.state.currentScene = cinematic;
            this.state.currentFrame = 0;

            this.renderCinematic(cinematic, options.onComplete || (() => {}), resolve);
        });
    },

    // Renderizar cinemática en pantalla
    renderCinematic(cinematic, onComplete, resolve) {
        // Crear contenedor
        const container = document.createElement('div');
        container.className = 'cinematic-overlay';
        container.id = 'cinematic-container';
        
        container.innerHTML = `
            <div class="cinematic-content">
                <div class="cinematic-image-container">
                    <img class="cinematic-image" id="cinematic-img" src="" alt="">
                    <div class="cinematic-image-overlay"></div>
                </div>
                <div class="cinematic-text-container">
                    <h2 class="cinematic-title" id="cinematic-title"></h2>
                    <p class="cinematic-subtitle" id="cinematic-subtitle"></p>
                </div>
                <div class="cinematic-progress">
                    <div class="cinematic-progress-bar" id="cinematic-progress"></div>
                </div>
                <button class="cinematic-skip" id="cinematic-skip">
                    <i class="fas fa-forward"></i> Pular
                </button>
                <div class="cinematic-dots" id="cinematic-dots"></div>
            </div>
        `;

        document.body.appendChild(container);

        // Agregar dots indicadores
        const dotsContainer = document.getElementById('cinematic-dots');
        cinematic.frames.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = `cinematic-dot ${i === 0 ? 'active' : ''}`;
            dotsContainer.appendChild(dot);
        });

        // Evento skip
        let skipped = false;
        document.getElementById('cinematic-skip').addEventListener('click', () => {
            skipped = true;
            this.endCinematic(cinematic.id, container, onComplete, resolve);
        });

        // Click para avanzar
        container.addEventListener('click', (e) => {
            if (e.target.id !== 'cinematic-skip' && !e.target.closest('.cinematic-skip')) {
                this.nextFrame(cinematic, container, onComplete, resolve);
            }
        });

        // Mostrar primer frame
        this.showFrame(cinematic, 0, container, onComplete, resolve);
    },

    // Mostrar frame específico
    showFrame(cinematic, frameIndex, container, onComplete, resolve) {
        if (frameIndex >= cinematic.frames.length) {
            this.endCinematic(cinematic.id, container, onComplete, resolve);
            return;
        }

        const frame = cinematic.frames[frameIndex];
        this.state.currentFrame = frameIndex;

        const img = document.getElementById('cinematic-img');
        const title = document.getElementById('cinematic-title');
        const subtitle = document.getElementById('cinematic-subtitle');
        const progress = document.getElementById('cinematic-progress');
        const dots = document.querySelectorAll('.cinematic-dot');

        // Animar salida
        img.style.opacity = '0';
        title.style.opacity = '0';
        subtitle.style.opacity = '0';

        setTimeout(() => {
            // Cambiar contenido
            img.src = frame.image;
            title.textContent = frame.text;
            subtitle.textContent = frame.subtext || '';

            // Actualizar dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === frameIndex);
            });

            // Animar entrada
            img.style.opacity = '1';
            setTimeout(() => {
                title.style.opacity = '1';
                setTimeout(() => {
                    subtitle.style.opacity = '1';
                }, 200);
            }, 300);

            // Barra de progreso
            progress.style.transition = 'none';
            progress.style.width = '0%';
            setTimeout(() => {
                progress.style.transition = `width ${frame.duration}ms linear`;
                progress.style.width = '100%';
            }, 50);

            // Auto avanzar
            this.autoAdvanceTimeout = setTimeout(() => {
                this.nextFrame(cinematic, container, onComplete, resolve);
            }, frame.duration);

        }, 300);
    },

    // Siguiente frame
    nextFrame(cinematic, container, onComplete, resolve) {
        clearTimeout(this.autoAdvanceTimeout);
        this.showFrame(cinematic, this.state.currentFrame + 1, container, onComplete, resolve);
    },

    // Finalizar cinemática
    endCinematic(cinematicId, container, onComplete, resolve) {
        clearTimeout(this.autoAdvanceTimeout);
        this.saveSeenCinematic(cinematicId);
        
        container.classList.add('fade-out');
        setTimeout(() => {
            container.remove();
            this.state.isPlaying = false;
            this.state.currentScene = null;
            this.state.currentFrame = 0;
            
            onComplete();
            resolve({ played: true, cinematicId });
        }, 500);
    },

    // Disparar cinemática por evento
    async trigger(event, data = {}) {
        const cinematic = this.getCinematicByTrigger(event);
        if (cinematic) {
            return await this.play(cinematic.id, data);
        }
        return { played: false, reason: 'no_cinematic_for_trigger' };
    },

    // Resetear cinemáticas vistas
    resetSeen() {
        this.state.seenCinematics = [];
        Storage.set('cartoesx_seen_cinematics', []);
    }
};

// Export global
window.Cinematic = Cinematic;
