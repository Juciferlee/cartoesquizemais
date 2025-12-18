// ============================================
// ADMIN/COMPONENTS.JS - Componentes UI
// ============================================

// ========== TOAST NOTIFICATIONS ==========
const AdminToast = {
    show(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
};

// ========== MODAL ==========
const AdminModal = {
    show(options = {}) {
        const modal = document.getElementById('admin-modal');
        const titleEl = document.getElementById('modal-title');
        const bodyEl = document.getElementById('modal-body');
        const footerEl = document.getElementById('modal-footer');

        titleEl.textContent = options.title || 'Modal';
        bodyEl.innerHTML = options.body || '';
        
        if (options.footer) {
            footerEl.innerHTML = options.footer;
            footerEl.style.display = 'flex';
        } else {
            footerEl.style.display = 'none';
        }

        modal.classList.add('active');

        // Cerrar con backdrop
        modal.querySelector('.modal-backdrop').onclick = () => {
            if (options.closeOnBackdrop !== false) this.close();
        };

        // Cerrar con ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        return modal;
    },

    close() {
        const modal = document.getElementById('admin-modal');
        modal.classList.remove('active');
    },

    confirm(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Confirmar',
                message = 'Tem certeza?',
                confirmText = 'Confirmar',
                cancelText = 'Cancelar',
                type = 'danger'
            } = options;

            const icons = {
                danger: 'fa-exclamation-triangle',
                warning: 'fa-exclamation-circle',
                info: 'fa-question-circle',
                success: 'fa-check-circle'
            };

            const colors = {
                danger: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6',
                success: '#22c55e'
            };

            this.show({
                title,
                body: `
                    <div style="text-align: center; padding: 20px 0;">
                        <i class="fas ${icons[type]}" style="font-size: 48px; color: ${colors[type]}; margin-bottom: 16px; display: block;"></i>
                        <p style="font-size: 16px; color: #334155;">${message}</p>
                    </div>
                `,
                footer: `
                    <button class="btn btn-secondary" onclick="AdminModal.close(); AdminModal._resolve(false);">${cancelText}</button>
                    <button class="btn btn-${type}" onclick="AdminModal.close(); AdminModal._resolve(true);">${confirmText}</button>
                `,
                closeOnBackdrop: false
            });

            this._resolve = resolve;
        });
    },

    // Doble confirmación para acciones peligrosas
    async doubleConfirm(options = {}) {
        const {
            title = 'Confirmar Ação',
            message = 'Esta ação não pode ser desfeita.',
            confirmWord = 'CONFIRMAR',
            finalMessage = 'Tem certeza absoluta?'
        } = options;

        // Primera confirmación
        const first = await this.confirm({
            title,
            message,
            type: 'danger'
        });

        if (!first) return false;

        // Segunda confirmación con palabra
        return new Promise((resolve) => {
            this.show({
                title: '⚠️ Última Confirmação',
                body: `
                    <div style="padding: 10px 0;">
                        <div class="info-box danger" style="margin-bottom: 20px;">
                            <i class="fas fa-skull-crossbones"></i>
                            <span>${finalMessage}</span>
                        </div>
                        <div class="form-group">
                            <label>Digite <strong style="color: #ef4444;">${confirmWord}</strong> para confirmar:</label>
                            <input type="text" id="confirm-word-input" class="form-control" placeholder="Digite aqui..." autocomplete="off">
                        </div>
                    </div>
                `,
                footer: `
                    <button class="btn btn-secondary" onclick="AdminModal.close(); AdminModal._resolve2(false);">Cancelar</button>
                    <button class="btn btn-danger" id="final-confirm-btn" disabled onclick="AdminModal.close(); AdminModal._resolve2(true);">
                        <i class="fas fa-trash"></i> Confirmar Exclusão
                    </button>
                `,
                closeOnBackdrop: false
            });

            this._resolve2 = resolve;

            // Habilitar botón solo si escribe la palabra correcta
            setTimeout(() => {
                const input = document.getElementById('confirm-word-input');
                const btn = document.getElementById('final-confirm-btn');
                if (input && btn) {
                    input.focus();
                    input.addEventListener('input', () => {
                        btn.disabled = input.value !== confirmWord;
                    });
                }
            }, 100);
        });
    }
};

// ========== TABLE COMPONENT ==========
const AdminTable = {
    render(options = {}) {
        const {
            columns = [],
            data = [],
            actions = [],
            emptyMessage = 'Nenhum registro encontrado',
            emptyIcon = 'fa-inbox'
        } = options;

        if (data.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas ${emptyIcon}"></i>
                    <h3>${emptyMessage}</h3>
                </div>
            `;
        }

        const headers = columns.map(col => `
            <th style="${col.width ? `width: ${col.width};` : ''}">${col.label}</th>
        `).join('');

        const rows = data.map(item => {
            const cells = columns.map(col => {
                let value = item[col.key];
                
                // Renderizador personalizado
                if (col.render) {
                    value = col.render(value, item);
                } else if (col.type === 'badge') {
                    value = `<span class="badge badge-${col.badgeClass || 'info'}">${value}</span>`;
                } else if (col.type === 'date') {
                    value = value ? new Date(value).toLocaleDateString('pt-BR') : '-';
                } else if (col.type === 'boolean') {
                    value = value ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>';
                }

                return `<td>${value ?? '-'}</td>`;
            }).join('');

            // Acciones
            let actionBtns = '';
            if (actions.length > 0) {
                actionBtns = `<td><div class="table-actions">
                    ${actions.map(action => {
                        const show = action.show ? action.show(item) : true;
                        if (!show) return '';
                        return `
                            <button class="btn btn-icon ${action.class || ''}" 
                                    onclick="${action.onclick}(${typeof item.id === 'string' ? `'${item.id}'` : item.id})"
                                    title="${action.title || ''}">
                                <i class="fas ${action.icon}"></i>
                            </button>
                        `;
                    }).join('')}
                </div></td>`;
            }

            return `<tr>${cells}${actionBtns}</tr>`;
        }).join('');

        return `
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>${headers}${actions.length > 0 ? '<th style="width: 120px;">Ações</th>' : ''}</tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }
};

// ========== PAGINATION ==========
const AdminPagination = {
    render(options = {}) {
        const { page = 1, total = 0, perPage = 10, onPageChange = () => {} } = options;
        const totalPages = Math.ceil(total / perPage);

        if (totalPages <= 1) return '';

        let buttons = [];
        
        // Anterior
        buttons.push(`
            <button ${page === 1 ? 'disabled' : ''} onclick="${onPageChange}(${page - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `);

        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                buttons.push(`
                    <button class="${i === page ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>
                `);
            } else if (i === page - 2 || i === page + 2) {
                buttons.push('<button disabled>...</button>');
            }
        }

        // Siguiente
        buttons.push(`
            <button ${page === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${page + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `);

        return `<div class="pagination">${buttons.join('')}</div>`;
    }
};

// ========== FORM BUILDER ==========
const AdminForm = {
    input(options = {}) {
        const { name, label, value = '', type = 'text', placeholder = '', required = false, hint = '' } = options;
        return `
            <div class="form-group">
                <label>${label} ${required ? '<span class="required">*</span>' : ''}</label>
                <input type="${type}" name="${name}" class="form-control" value="${Utils.escapeHtml(value)}" placeholder="${placeholder}" ${required ? 'required' : ''}>
                ${hint ? `<span class="form-hint">${hint}</span>` : ''}
            </div>
        `;
    },

    textarea(options = {}) {
        const { name, label, value = '', rows = 3, placeholder = '', required = false, hint = '' } = options;
        return `
            <div class="form-group">
                <label>${label} ${required ? '<span class="required">*</span>' : ''}</label>
                <textarea name="${name}" class="form-control" rows="${rows}" placeholder="${placeholder}" ${required ? 'required' : ''}>${Utils.escapeHtml(value)}</textarea>
                ${hint ? `<span class="form-hint">${hint}</span>` : ''}
            </div>
        `;
    },

    select(options = {}) {
        const { name, label, value = '', items = [], required = false } = options;
        const optionsHtml = items.map(item => {
            const val = typeof item === 'object' ? item.value : item;
            const text = typeof item === 'object' ? item.label : item;
            return `<option value="${val}" ${val === value ? 'selected' : ''}>${text}</option>`;
        }).join('');
        
        return `
            <div class="form-group">
                <label>${label} ${required ? '<span class="required">*</span>' : ''}</label>
                <select name="${name}" class="form-control" ${required ? 'required' : ''}>
                    ${optionsHtml}
                </select>
            </div>
        `;
    },

    checkbox(options = {}) {
        const { name, label, checked = false } = options;
        return `
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" name="${name}" ${checked ? 'checked' : ''} style="width: 18px; height: 18px;">
                    <span>${label}</span>
                </label>
            </div>
        `;
    }
};

// ========== DIFFICULTY BADGE ==========
const DiffBadge = {
    render(diff) {
        const names = {
            facil: 'Fácil',
            media: 'Médio',
            dificil: 'Difícil',
            avancado: 'Avançado'
        };
        return `<span class="diff-badge ${diff}">${names[diff] || diff}</span>`;
    }
};

// ========== USER AVATAR ==========
const UserAvatar = {
    render(user, size = 50) {
        const avatar = QuizData.getAvatar(user.avatar || 'default_1');
        return `
            <div class="user-card-avatar" style="width: ${size}px; height: ${size}px; font-size: ${size * 0.5}px;">
                ${avatar.icon}
            </div>
        `;
    }
};

// ========== STATS CARD ==========
const StatsCard = {
    render(options = {}) {
        const { icon, iconClass = 'blue', value, label, sublabel = '', href = '#' } = options;
        return `
            <a href="${href}" class="stat-card">
                <div class="stat-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="stat-info">
                    <h3>${value}</h3>
                    <p>${label}</p>
                    ${sublabel ? `<small>${sublabel}</small>` : ''}
                </div>
            </a>
        `;
    }
};

// ========== ACTIVITY ITEM ==========
const ActivityItem = {
    render(activity) {
        const types = {
            game: { icon: 'fa-gamepad', class: 'game', label: 'Partida' },
            achievement: { icon: 'fa-trophy', class: 'achievement', label: 'Logro' },
            unlock: { icon: 'fa-lock-open', class: 'unlock', label: 'Desbloqueio' },
            limit: { icon: 'fa-clock', class: 'limit', label: 'Limite' }
        };

        const type = types[activity.type] || types.game;
        const time = new Date(activity.timestamp).toLocaleString('pt-BR');

        let description = '';
        if (activity.type === 'game') {
            description = `<strong>${activity.data?.username || 'Usuário'}</strong> completou uma partida com ${activity.data?.score || 0} pts`;
        } else if (activity.type === 'achievement') {
            description = `<strong>${activity.data?.username || 'Usuário'}</strong> desbloqueou "${activity.data?.achievementName || 'Logro'}"`;
        } else if (activity.type === 'unlock') {
            description = `<strong>${activity.data?.username || 'Usuário'}</strong> desbloqueou o nível ${activity.data?.level || ''}`;
        } else if (activity.type === 'limit') {
            description = `<strong>${activity.data?.username || 'Usuário'}</strong> atingiu limite de pontos no nível ${activity.data?.level || ''}`;
        }

        return `
            <div class="activity-item">
                <div class="activity-icon ${type.class}">
                    <i class="fas ${type.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${description}</p>
                </div>
                <span class="activity-time">${time}</span>
            </div>
        `;
    }
};

// Export all
window.AdminToast = AdminToast;
window.AdminModal = AdminModal;
window.AdminTable = AdminTable;
window.AdminPagination = AdminPagination;
window.AdminForm = AdminForm;
window.DiffBadge = DiffBadge;
window.UserAvatar = UserAvatar;
window.StatsCard = StatsCard;
window.ActivityItem = ActivityItem;
