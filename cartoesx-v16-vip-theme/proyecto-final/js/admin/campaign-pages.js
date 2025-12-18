/**
 * Admin Campaign Pages v13
 * Editor Visual - Temática Aeropuerto VIP
 */

const AdminCampaignPages = {
    editingMap: null,
    draggingNode: null,
    
    // Tipos de nodo - Temática Aeropuerto/VIP
    nodeTypes: {
        start: { icon: '🎫', label: 'Check-in', effect: 'pulse-green', cssClass: 'node-start' },
        battle: { icon: '🛡️', label: 'Desafio', effect: 'none', cssClass: 'node-battle' },
        boss: { icon: '✈️', label: 'Embarque', effect: 'fire-glow', cssClass: 'node-boss' },
        checkpoint: { icon: '🎩', label: 'VIP Entry', effect: 'heal-pulse', cssClass: 'node-checkpoint' },
        treasure: { icon: '🛍️', label: 'Duty Free', effect: 'sparkle', cssClass: 'node-treasure' },
        mystery: { icon: '💆', label: 'Spa', effect: 'mystery-fog', cssClass: 'node-mystery' },
        final: { icon: '💳', label: 'Black Card', effect: 'rainbow-glow', cssClass: 'node-final' }
    },

    // Efectos de zona - Temática VIP
    zoneEffects: {
        facil: { particles: 'tickets', overlay: 'terminal-light', sound: 'airport' },
        media: { particles: 'champagne', overlay: 'lounge-glow', sound: 'jazz' },
        dificil: { particles: 'diamonds', overlay: 'first-class', sound: 'elegant' },
        avancado: { particles: 'gold-cards', overlay: 'black-card', sound: 'exclusive' }
    },

    // ========== PÁGINA PRINCIPAL ==========
    campaignMap() {
        this.loadEditingMap();
        const map = this.editingMap;

        return `
            <style>
                ${this.getEditorStyles()}
            </style>

            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-map"></i>
                    </div>
                    <div>
                        <h1>Mapa da Campanha</h1>
                        <p>Editor visual completo com drag & drop</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-outline" onclick="AdminCampaignPages.resetToDefault()">
                        <i class="fas fa-undo"></i> Resetar
                    </button>
                    <button class="btn btn-success" onclick="window.open('campaign.html', '_blank')">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn btn-primary" onclick="AdminCampaignPages.saveMap()">
                        <i class="fas fa-save"></i> Salvar Mapa
                    </button>
                </div>
            </div>

            <!-- Config do Mapa -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-cog"></i> Configuração do Mapa</h2>
                </div>
                <div class="panel-body">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nome do Reino</label>
                            <input type="text" class="form-control" id="mapName" value="${Utils.escapeHtml(map.name || 'Reino do Conhecimento')}" onchange="AdminCampaignPages.updateMapPreview()">
                        </div>
                        <div class="form-group">
                            <label>URL da Imagem de Fundo</label>
                            <input type="text" class="form-control" id="mapBg" value="${map.background || ''}" placeholder="https://..." onchange="AdminCampaignPages.updateMapPreview()">
                        </div>
                    </div>
                    <div id="mapPreview" class="map-preview" style="background-image: url('${map.background}');">
                        <div class="map-preview-overlay"></div>
                        <div class="map-preview-title">${Utils.escapeHtml(map.name)}</div>
                    </div>
                </div>
            </div>

            <!-- Zonas -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-layer-group"></i> Zonas (${map.zones.length})</h2>
                    <button class="btn btn-sm btn-primary" onclick="AdminCampaignPages.addZone()">
                        <i class="fas fa-plus"></i> Nova Zona
                    </button>
                </div>
                <div class="panel-body">
                    <div id="zonesContainer" class="zones-grid">
                        ${map.zones.map((zone, i) => this.renderZoneCard(zone, i)).join('')}
                    </div>
                </div>
            </div>

            <!-- Editor Visual -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-edit"></i> Editor Visual de Nós</h2>
                    <div style="display:flex;gap:10px;">
                        <button class="btn btn-sm" onclick="AdminCampaignPages.zoomIn()"><i class="fas fa-search-plus"></i></button>
                        <button class="btn btn-sm" onclick="AdminCampaignPages.zoomOut()"><i class="fas fa-search-minus"></i></button>
                        <button class="btn btn-sm" onclick="AdminCampaignPages.resetZoom()"><i class="fas fa-expand"></i></button>
                    </div>
                </div>
                <div class="panel-body">
                    <div id="visualEditorContainer" class="visual-editor-container">
                        <div id="visualEditor" class="visual-editor" style="background-image: url('${map.background}');">
                            <div class="visual-editor-overlay"></div>
                            <svg id="editorRoutes" class="editor-routes">
                                ${this.renderRoutes(map)}
                            </svg>
                            <div id="editorNodes" class="editor-nodes">
                                ${this.renderNodes(map)}
                            </div>
                            <!-- Efectos de partículas -->
                            <div id="editorParticles" class="editor-particles"></div>
                        </div>
                    </div>
                    <div class="editor-toolbar">
                        <span class="editor-hint"><i class="fas fa-mouse-pointer"></i> Arrastra nodos para mover</span>
                        <span class="editor-hint"><i class="fas fa-hand-pointer"></i> Click para editar</span>
                        <span class="editor-hint"><i class="fas fa-link"></i> Shift+Click para conectar</span>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== ESTILOS DEL EDITOR ==========
    getEditorStyles() {
        return `
            .map-preview {
                margin-top: 15px; height: 200px; border-radius: 12px; 
                overflow: hidden; background-size: cover; background-position: center;
                position: relative;
            }
            .map-preview-overlay {
                position: absolute; inset: 0;
                background: linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.3));
            }
            .map-preview-title {
                position: absolute; bottom: 15px; left: 15px; color: white;
                font-weight: 700; font-size: 18px; text-shadow: 0 2px 5px rgba(0,0,0,0.5);
            }
            
            .zones-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 20px;
            }
            
            .zone-card {
                background: var(--card-bg); border-radius: 12px; overflow: hidden;
                border: 1px solid var(--border-color); transition: all 0.3s;
            }
            .zone-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
            
            .zone-card-header {
                padding: 15px; display: flex; align-items: center; gap: 12px;
                border-bottom: 1px solid var(--border-color);
            }
            .zone-icon {
                width: 50px; height: 50px; border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                font-size: 24px; color: white;
            }
            .zone-info h4 { margin: 0; font-size: 16px; }
            .zone-info span { font-size: 12px; opacity: 0.7; }
            .zone-actions { margin-left: auto; display: flex; gap: 5px; }
            
            .zone-card-body { padding: 15px; }
            .zone-nodes { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
            .zone-node {
                padding: 6px 12px; border-radius: 20px; font-size: 13px;
                display: flex; align-items: center; gap: 6px;
                background: rgba(0,0,0,0.05); cursor: pointer;
                transition: all 0.2s;
            }
            .zone-node:hover { transform: scale(1.05); }
            
            .zone-effect-preview {
                padding: 10px; border-radius: 8px; margin-top: 10px;
                background: rgba(0,0,0,0.03); font-size: 12px;
                display: flex; align-items: center; gap: 8px;
            }
            
            .visual-editor-container {
                position: relative; overflow: hidden; border-radius: 12px;
                height: 550px; background: #1a1a2e;
            }
            .visual-editor {
                position: relative; width: 100%; height: 100%;
                background-size: cover; background-position: center;
                transform-origin: center; transition: transform 0.3s;
            }
            .visual-editor-overlay {
                position: absolute; inset: 0;
                background: rgba(0,0,0,0.35);
                pointer-events: none;
            }
            .editor-routes {
                position: absolute; inset: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 1;
            }
            .editor-nodes { position: absolute; inset: 0; z-index: 2; }
            .editor-particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
            
            .editor-node {
                position: absolute; transform: translate(-50%, -50%);
                width: 60px; height: 60px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-size: 24px; cursor: grab; border: 3px solid white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                transition: transform 0.15s, box-shadow 0.15s;
                user-select: none;
            }
            .editor-node:hover {
                transform: translate(-50%, -50%) scale(1.15);
                box-shadow: 0 6px 30px rgba(0,0,0,0.6);
                z-index: 100;
            }
            .editor-node.dragging {
                cursor: grabbing;
                transform: translate(-50%, -50%) scale(1.2);
                box-shadow: 0 10px 40px rgba(0,0,0,0.7);
                z-index: 1000;
            }
            .editor-node-label {
                position: absolute; bottom: -25px; left: 50%;
                transform: translateX(-50%); white-space: nowrap;
                font-size: 11px; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.8);
                background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 10px;
            }
            
            /* Efectos de nodos */
            .node-boss { animation: boss-pulse 2s infinite; }
            .node-start { animation: start-glow 1.5s infinite; }
            .node-final { animation: rainbow-rotate 3s linear infinite; }
            .node-treasure { animation: sparkle-effect 1s infinite; }
            .node-mystery { animation: mystery-float 2s ease-in-out infinite; }
            .node-checkpoint { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
            
            @keyframes boss-pulse {
                0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 4px 20px rgba(0,0,0,0.5); }
                50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.8), 0 4px 20px rgba(0,0,0,0.5); }
            }
            @keyframes start-glow {
                0%, 100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.4), 0 4px 20px rgba(0,0,0,0.5); }
                50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.7), 0 4px 20px rgba(0,0,0,0.5); }
            }
            @keyframes rainbow-rotate {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            @keyframes sparkle-effect {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.3); }
            }
            @keyframes mystery-float {
                0%, 100% { transform: translate(-50%, -50%) translateY(0); }
                50% { transform: translate(-50%, -50%) translateY(-5px); }
            }
            
            .editor-toolbar {
                display: flex; gap: 20px; padding: 15px;
                background: rgba(0,0,0,0.03); border-radius: 0 0 12px 12px;
                justify-content: center;
            }
            .editor-hint {
                font-size: 12px; color: var(--text-muted);
                display: flex; align-items: center; gap: 6px;
            }
            
            /* Efectos de rasgadura para boss */
            .boss-slash {
                position: absolute; pointer-events: none;
                width: 150px; height: 60px;
                background: linear-gradient(90deg, transparent, rgba(255,0,0,0.3), transparent);
                transform: rotate(-15deg);
                animation: slash-appear 0.5s ease-out forwards;
            }
            @keyframes slash-appear {
                0% { opacity: 0; transform: rotate(-15deg) scaleX(0); }
                50% { opacity: 1; }
                100% { opacity: 0; transform: rotate(-15deg) scaleX(1); }
            }
        `;
    },

    // ========== RENDER ZONA ==========
    renderZoneCard(zone, index) {
        const effect = this.zoneEffects[zone.difficulty] || {};
        const diffNames = { facil: 'Fácil', media: 'Médio', dificil: 'Difícil', avancado: 'Avançado' };
        
        return `
            <div class="zone-card" data-zone-index="${index}">
                <div class="zone-card-header">
                    <div class="zone-icon" style="background: ${zone.color};">
                        ${zone.icon || '🗺️'}
                    </div>
                    <div class="zone-info">
                        <h4>${Utils.escapeHtml(zone.name)}</h4>
                        <span>${diffNames[zone.difficulty] || zone.difficulty} • ${zone.nodes.length} nós</span>
                    </div>
                    <div class="zone-actions">
                        <button class="btn btn-icon btn-sm" onclick="AdminCampaignPages.editZone(${index})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-sm btn-danger" onclick="AdminCampaignPages.deleteZone(${index})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="zone-card-body">
                    <div class="zone-nodes">
                        ${zone.nodes.map((n, ni) => `
                            <div class="zone-node" style="border-left: 3px solid ${zone.color};" 
                                 onclick="AdminCampaignPages.editNode(${index}, ${ni})">
                                <span>${n.icon}</span>
                                <span>${Utils.escapeHtml(n.name)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-sm" style="background: ${zone.color}15; color: ${zone.color}; border: 1px dashed ${zone.color}; width: 100%;" 
                            onclick="AdminCampaignPages.addNode(${index})">
                        <i class="fas fa-plus"></i> Adicionar Nó
                    </button>
                    <div class="zone-effect-preview">
                        <i class="fas fa-magic" style="color: ${zone.color};"></i>
                        <span>Efeito: ${effect.particles || 'nenhum'} | Overlay: ${effect.overlay || 'nenhum'}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // ========== RENDER RUTAS ==========
    renderRoutes(map) {
        let svg = '';
        const allNodes = [];
        map.zones.forEach(z => z.nodes.forEach(n => allNodes.push({ ...n, color: z.color })));

        map.zones.forEach(zone => {
            (zone.routes || []).forEach(route => {
                const from = allNodes.find(n => n.id === route[0]);
                const to = allNodes.find(n => n.id === route[1]);
                if (from && to) {
                    svg += `
                        <line x1="${from.x}%" y1="${from.y}%" x2="${to.x}%" y2="${to.y}%" 
                              stroke="${zone.color}" stroke-width="4" stroke-dasharray="10,5" 
                              stroke-linecap="round" opacity="0.8">
                            <animate attributeName="stroke-dashoffset" from="0" to="30" dur="1s" repeatCount="indefinite"/>
                        </line>
                    `;
                }
            });
        });
        return svg;
    },

    // ========== RENDER NODOS ==========
    renderNodes(map) {
        let html = '';
        map.zones.forEach((zone, zi) => {
            zone.nodes.forEach((node, ni) => {
                const nodeType = this.nodeTypes[node.type] || this.nodeTypes.battle;
                html += `
                    <div class="editor-node ${nodeType.cssClass}" 
                         data-zone="${zi}" data-node="${ni}" data-id="${node.id}"
                         style="left: ${node.x}%; top: ${node.y}%; background: ${zone.color};"
                         onmousedown="AdminCampaignPages.startDrag(event, ${zi}, ${ni})"
                         ondblclick="AdminCampaignPages.editNode(${zi}, ${ni})"
                         title="${node.name} - ${nodeType.label}">
                        ${node.icon}
                        <span class="editor-node-label">${Utils.escapeHtml(node.name)}</span>
                    </div>
                `;
            });
        });
        return html;
    },

    // ========== DRAG & DROP ==========
    startDrag(event, zoneIndex, nodeIndex) {
        if (event.button !== 0) return; // Solo click izquierdo
        event.preventDefault();
        
        const nodeEl = event.target.closest('.editor-node');
        if (!nodeEl) return;
        
        nodeEl.classList.add('dragging');
        
        this.draggingNode = {
            element: nodeEl,
            zoneIndex,
            nodeIndex,
            startX: event.clientX,
            startY: event.clientY
        };
        
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.endDrag);
    },

    onDrag: function(event) {
        const self = AdminCampaignPages;
        if (!self.draggingNode) return;
        
        const editor = document.getElementById('visualEditor');
        const rect = editor.getBoundingClientRect();
        
        // Calcular nueva posición en porcentaje
        let x = ((event.clientX - rect.left) / rect.width) * 100;
        let y = ((event.clientY - rect.top) / rect.height) * 100;
        
        // Limitar a los bordes
        x = Math.max(2, Math.min(98, x));
        y = Math.max(2, Math.min(98, y));
        
        // Actualizar posición visual
        self.draggingNode.element.style.left = x + '%';
        self.draggingNode.element.style.top = y + '%';
        
        // Actualizar datos
        const zone = self.editingMap.zones[self.draggingNode.zoneIndex];
        const node = zone.nodes[self.draggingNode.nodeIndex];
        node.x = Math.round(x);
        node.y = Math.round(y);
        
        // Actualizar rutas SVG en tiempo real
        document.getElementById('editorRoutes').innerHTML = self.renderRoutes(self.editingMap);
    },

    endDrag: function(event) {
        const self = AdminCampaignPages;
        if (!self.draggingNode) return;
        
        self.draggingNode.element.classList.remove('dragging');
        self.draggingNode = null;
        
        document.removeEventListener('mousemove', self.onDrag);
        document.removeEventListener('mouseup', self.endDrag);
        
        // Guardar automáticamente
        self.saveMap(true); // silent save
        AdminToast.success('Posição atualizada!');
    },

    // ========== ZOOM ==========
    editorZoom: 1,
    
    zoomIn() {
        this.editorZoom = Math.min(2, this.editorZoom + 0.2);
        document.getElementById('visualEditor').style.transform = `scale(${this.editorZoom})`;
    },
    
    zoomOut() {
        this.editorZoom = Math.max(0.5, this.editorZoom - 0.2);
        document.getElementById('visualEditor').style.transform = `scale(${this.editorZoom})`;
    },
    
    resetZoom() {
        this.editorZoom = 1;
        document.getElementById('visualEditor').style.transform = 'scale(1)';
    },

    // ========== ZONAS CRUD ==========
    addZone() {
        const effectOptions = Object.entries(this.zoneEffects).map(([key, val]) => 
            `<option value="${key}">${key.charAt(0).toUpperCase() + key.slice(1)} (${val.particles})</option>`
        ).join('');

        AdminModal.show({
            title: '✨ Nova Zona',
            body: `
                <form id="zoneForm">
                    <div class="form-group">
                        <label>Nome da Zona</label>
                        <input type="text" class="form-control" name="name" required placeholder="Ex: Floresta Encantada">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Cor</label>
                            <input type="color" class="form-control" name="color" value="#22c55e" style="height: 50px; cursor: pointer;">
                        </div>
                        <div class="form-group">
                            <label>Ícone (emoji)</label>
                            <input type="text" class="form-control" name="icon" placeholder="🌲" maxlength="2" style="font-size: 24px; text-align: center;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Dificuldade & Efeitos</label>
                        <select class="form-control" name="difficulty">
                            ${effectOptions}
                        </select>
                        <small style="color: var(--text-muted); margin-top: 5px; display: block;">
                            A dificuldade define os efeitos visuais e partículas da zona
                        </small>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-outline" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminCampaignPages.saveNewZone()">
                    <i class="fas fa-plus"></i> Criar Zona
                </button>
            `
        });
    },

    saveNewZone() {
        const form = document.getElementById('zoneForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const data = new FormData(form);
        const maxId = Math.max(...this.editingMap.zones.map(z => z.id), -1);
        
        this.editingMap.zones.push({
            id: maxId + 1,
            name: data.get('name') || 'Nova Zona',
            color: data.get('color') || '#22c55e',
            icon: data.get('icon') || '🗺️',
            difficulty: data.get('difficulty') || 'facil',
            nodes: [],
            routes: []
        });

        AdminModal.close();
        this.saveMap();
        AdminApp.render();
        AdminToast.success('Zona criada com sucesso!');
    },

    editZone(index) {
        const zone = this.editingMap.zones[index];
        if (!zone) return;

        const effectOptions = Object.entries(this.zoneEffects).map(([key, val]) => 
            `<option value="${key}" ${zone.difficulty === key ? 'selected' : ''}>${key.charAt(0).toUpperCase() + key.slice(1)} (${val.particles})</option>`
        ).join('');

        AdminModal.show({
            title: `✏️ Editar: ${zone.name}`,
            body: `
                <form id="zoneForm">
                    <div class="form-group">
                        <label>Nome da Zona</label>
                        <input type="text" class="form-control" name="name" value="${Utils.escapeHtml(zone.name)}" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Cor</label>
                            <input type="color" class="form-control" name="color" value="${zone.color}" style="height: 50px; cursor: pointer;">
                        </div>
                        <div class="form-group">
                            <label>Ícone</label>
                            <input type="text" class="form-control" name="icon" value="${zone.icon || ''}" maxlength="2" style="font-size: 24px; text-align: center;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Dificuldade & Efeitos</label>
                        <select class="form-control" name="difficulty">
                            ${effectOptions}
                        </select>
                    </div>
                    <div class="info-box warning" style="margin-top: 15px;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Esta zona tem ${zone.nodes.length} nós e ${zone.routes?.length || 0} conexões</span>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-outline" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminCampaignPages.saveZoneEdit(${index})">
                    <i class="fas fa-save"></i> Salvar
                </button>
            `
        });
    },

    saveZoneEdit(index) {
        const form = document.getElementById('zoneForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const data = new FormData(form);
        
        this.editingMap.zones[index].name = data.get('name');
        this.editingMap.zones[index].color = data.get('color');
        this.editingMap.zones[index].icon = data.get('icon');
        this.editingMap.zones[index].difficulty = data.get('difficulty');

        AdminModal.close();
        this.saveMap();
        AdminApp.render();
        AdminToast.success('Zona atualizada!');
    },

    deleteZone(index) {
        const zone = this.editingMap.zones[index];
        
        AdminModal.confirm({
            title: 'Excluir Zona',
            message: `Excluir "${zone.name}" e todos os seus ${zone.nodes.length} nós?`,
            type: 'danger',
            confirmText: 'Excluir'
        }).then(confirmed => {
            if (confirmed) {
                this.editingMap.zones.splice(index, 1);
                this.saveMap();
                AdminApp.render();
                AdminToast.success('Zona excluída!');
            }
        });
    },

    // ========== NODOS CRUD ==========
    addNode(zoneIndex) {
        const zone = this.editingMap.zones[zoneIndex];
        if (!zone) return;

        const typeOptions = Object.entries(this.nodeTypes).map(([key, val]) => 
            `<option value="${key}">${val.icon} ${val.label}</option>`
        ).join('');

        // Calcular posición inicial
        const lastNode = zone.nodes[zone.nodes.length - 1];
        const defaultX = lastNode ? Math.min(lastNode.x + 15, 90) : 20;
        const defaultY = lastNode ? lastNode.y : 50;

        AdminModal.show({
            title: `➕ Novo Nó em ${zone.name}`,
            body: `
                <form id="nodeForm">
                    <div class="form-group">
                        <label>Nome do Nó</label>
                        <input type="text" class="form-control" name="name" required placeholder="Ex: Torre do Mago">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo</label>
                            <select class="form-control" name="type" onchange="AdminCampaignPages.updateNodeIcon(this.value)">
                                ${typeOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ícone</label>
                            <input type="text" class="form-control" name="icon" id="nodeIcon" value="⚔️" maxlength="2" style="font-size: 24px; text-align: center;">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Posição X (%)</label>
                            <input type="number" class="form-control" name="x" value="${defaultX}" min="0" max="100">
                        </div>
                        <div class="form-group">
                            <label>Posição Y (%)</label>
                            <input type="number" class="form-control" name="y" value="${defaultY}" min="0" max="100">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Conectar com nó anterior</label>
                        <select class="form-control" name="connectTo">
                            <option value="">Não conectar</option>
                            ${zone.nodes.map(n => `<option value="${n.id}">${n.icon} ${n.name}</option>`).join('')}
                        </select>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-outline" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminCampaignPages.saveNewNode(${zoneIndex})">
                    <i class="fas fa-plus"></i> Criar Nó
                </button>
            `
        });
    },

    updateNodeIcon(type) {
        const nodeType = this.nodeTypes[type];
        if (nodeType) {
            document.getElementById('nodeIcon').value = nodeType.icon;
        }
    },

    saveNewNode(zoneIndex) {
        const form = document.getElementById('nodeForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const data = new FormData(form);
        const zone = this.editingMap.zones[zoneIndex];
        
        // Calcular próximo ID global
        let maxId = 0;
        this.editingMap.zones.forEach(z => {
            z.nodes.forEach(n => { if (n.id > maxId) maxId = n.id; });
        });
        
        const newNode = {
            id: maxId + 1,
            name: data.get('name'),
            icon: data.get('icon') || '⚔️',
            type: data.get('type') || 'battle',
            x: parseInt(data.get('x')) || 50,
            y: parseInt(data.get('y')) || 50
        };
        
        zone.nodes.push(newNode);
        
        // Crear conexión si se seleccionó
        const connectTo = data.get('connectTo');
        if (connectTo) {
            if (!zone.routes) zone.routes = [];
            zone.routes.push([parseInt(connectTo), newNode.id]);
        }

        AdminModal.close();
        this.saveMap();
        AdminApp.render();
        AdminToast.success('Nó criado!');
    },

    editNode(zoneIndex, nodeIndex) {
        const zone = this.editingMap.zones[zoneIndex];
        const node = zone.nodes[nodeIndex];
        if (!node) return;

        const typeOptions = Object.entries(this.nodeTypes).map(([key, val]) => 
            `<option value="${key}" ${node.type === key ? 'selected' : ''}>${val.icon} ${val.label}</option>`
        ).join('');

        // Encontrar conexiones existentes
        const connections = (zone.routes || []).filter(r => r[0] === node.id || r[1] === node.id);

        AdminModal.show({
            title: `✏️ Editar: ${node.name}`,
            body: `
                <form id="nodeForm">
                    <div class="form-group">
                        <label>Nome do Nó</label>
                        <input type="text" class="form-control" name="name" value="${Utils.escapeHtml(node.name)}" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tipo</label>
                            <select class="form-control" name="type" onchange="AdminCampaignPages.updateNodeIcon(this.value)">
                                ${typeOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ícone</label>
                            <input type="text" class="form-control" name="icon" id="nodeIcon" value="${node.icon}" maxlength="2" style="font-size: 24px; text-align: center;">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Posição X (%)</label>
                            <input type="number" class="form-control" name="x" value="${node.x}" min="0" max="100">
                        </div>
                        <div class="form-group">
                            <label>Posição Y (%)</label>
                            <input type="number" class="form-control" name="y" value="${node.y}" min="0" max="100">
                        </div>
                    </div>
                    <div class="info-box info">
                        <i class="fas fa-link"></i>
                        <span>Conexões: ${connections.length} rutas</span>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-danger" onclick="AdminCampaignPages.deleteNode(${zoneIndex}, ${nodeIndex})" style="margin-right: auto;">
                    <i class="fas fa-trash"></i> Excluir
                </button>
                <button class="btn btn-outline" onclick="AdminModal.close()">Cancelar</button>
                <button class="btn btn-primary" onclick="AdminCampaignPages.saveNodeEdit(${zoneIndex}, ${nodeIndex})">
                    <i class="fas fa-save"></i> Salvar
                </button>
            `
        });
    },

    saveNodeEdit(zoneIndex, nodeIndex) {
        const form = document.getElementById('nodeForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const data = new FormData(form);
        const node = this.editingMap.zones[zoneIndex].nodes[nodeIndex];
        
        node.name = data.get('name');
        node.icon = data.get('icon') || '⚔️';
        node.type = data.get('type') || 'battle';
        node.x = parseInt(data.get('x')) || node.x;
        node.y = parseInt(data.get('y')) || node.y;

        AdminModal.close();
        this.saveMap();
        AdminApp.render();
        AdminToast.success('Nó atualizado!');
    },

    deleteNode(zoneIndex, nodeIndex) {
        const zone = this.editingMap.zones[zoneIndex];
        const node = zone.nodes[nodeIndex];
        
        AdminModal.confirm({
            title: 'Excluir Nó',
            message: `Excluir "${node.name}" e suas conexões?`,
            type: 'danger'
        }).then(confirmed => {
            if (confirmed) {
                // Remover conexiones que involucran este nodo
                zone.routes = (zone.routes || []).filter(r => r[0] !== node.id && r[1] !== node.id);
                
                // Remover nodo
                zone.nodes.splice(nodeIndex, 1);
                
                AdminModal.close();
                this.saveMap();
                AdminApp.render();
                AdminToast.success('Nó excluído!');
            }
        });
    },

    // ========== STORAGE ==========
    loadEditingMap() {
        try {
            const saved = localStorage.getItem('cartoesx_campaign_maps');
            if (saved) {
                const maps = JSON.parse(saved);
                if (maps && maps.length > 0) {
                    this.editingMap = JSON.parse(JSON.stringify(maps[0]));
                    return;
                }
            }
        } catch (e) {
            console.error('Error loading map:', e);
        }
        this.editingMap = this.getDefaultMap();
    },

    saveMap(silent = false) {
        // Actualizar nombre y fondo
        const nameEl = document.getElementById('mapName');
        const bgEl = document.getElementById('mapBg');
        if (nameEl) this.editingMap.name = nameEl.value;
        if (bgEl) this.editingMap.background = bgEl.value;

        localStorage.setItem('cartoesx_campaign_maps', JSON.stringify([this.editingMap]));
        
        if (!silent) {
            AdminToast.success('Mapa salvo com sucesso!');
        }
    },

    resetToDefault() {
        AdminModal.confirm({
            title: 'Resetar Mapa',
            message: 'Isso vai restaurar o mapa padrão. Continuar?',
            type: 'warning'
        }).then(confirmed => {
            if (confirmed) {
                this.editingMap = this.getDefaultMap();
                this.saveMap();
                AdminApp.render();
                AdminToast.success('Mapa resetado!');
            }
        });
    },

    updateMapPreview() {
        const name = document.getElementById('mapName')?.value || '';
        const bg = document.getElementById('mapBg')?.value || '';
        
        const preview = document.getElementById('mapPreview');
        if (preview) {
            preview.style.backgroundImage = `url('${bg}')`;
            preview.querySelector('.map-preview-title').textContent = name;
        }

        const editor = document.getElementById('visualEditor');
        if (editor) {
            editor.style.backgroundImage = `url('${bg}')`;
        }
    },

    getDefaultMap() {
        return {
            name: 'Aeroporto Premium',
            background: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=800&fit=crop',
            zones: [
                {
                    id: 0, name: 'Terminal Básico', color: '#22c55e', difficulty: 'facil', icon: '🛫',
                    nodes: [
                        { id: 0, x: 8, y: 75, name: 'Check-in', icon: '🎫', type: 'start' },
                        { id: 1, x: 22, y: 58, name: 'Segurança', icon: '🛡️', type: 'battle' },
                        { id: 2, x: 38, y: 70, name: 'Duty Free', icon: '🛍️', type: 'treasure' },
                        { id: 3, x: 52, y: 52, name: 'Portão de Embarque', icon: '✈️', type: 'boss' }
                    ],
                    routes: [[0,1], [1,2], [2,3]]
                },
                {
                    id: 1, name: 'Lounge VIP', color: '#f59e0b', difficulty: 'media', icon: '🥂',
                    nodes: [
                        { id: 4, x: 60, y: 38, name: 'Recepção VIP', icon: '🎩', type: 'checkpoint' },
                        { id: 5, x: 72, y: 28, name: 'Bar Premium', icon: '🍾', type: 'battle' },
                        { id: 6, x: 82, y: 42, name: 'Spa & Descanso', icon: '💆', type: 'mystery' },
                        { id: 7, x: 88, y: 55, name: 'Concierge', icon: '👔', type: 'boss' }
                    ],
                    routes: [[3,4], [4,5], [5,6], [6,7]]
                },
                {
                    id: 2, name: 'First Class', color: '#a855f7', difficulty: 'dificil', icon: '💎',
                    nodes: [
                        { id: 8, x: 78, y: 68, name: 'Suite Privada', icon: '🛋️', type: 'battle' },
                        { id: 9, x: 85, y: 80, name: 'Chef Particular', icon: '👨‍🍳', type: 'treasure' },
                        { id: 10, x: 92, y: 88, name: 'Black Card', icon: '💳', type: 'final' }
                    ],
                    routes: [[7,8], [8,9], [9,10]]
                }
            ]
        };
    },

    // ========== CONFIGURACIÓN DE CAMPAÑA ==========
    campaignConfig() {
        // Leer config actual del quiz
        let quizConfig = {};
        try {
            const saved = localStorage.getItem('cartoesx_admin_config');
            if (saved) quizConfig = JSON.parse(saved);
        } catch (e) {}

        // Leer config de campaña
        let config = {};
        try {
            const saved = localStorage.getItem('cartoesx_campaign_config');
            if (saved) config = JSON.parse(saved);
        } catch (e) {}

        // Mostrar puntos del quiz
        const quizPoints = quizConfig.points || { facil: 100, media: 150, dificil: 200, avancado: 250 };
        const quizTime = quizConfig.time || { facil: 30, media: 25, dificil: 20, avancado: 15 };

        return `
            <div class="page-header">
                <div class="page-title">
                    <div class="page-title-icon" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                        <i class="fas fa-sliders-h"></i>
                    </div>
                    <div>
                        <h1>Configuração da Campanha</h1>
                        <p>Ajuste parâmetros de batalhas e progressão</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="AdminCampaignPages.saveConfig()">
                        <i class="fas fa-save"></i> Salvar
                    </button>
                </div>
            </div>

            <!-- Info de Pontos (do Quiz) -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-coins"></i> Pontos por Dificuldade (do Quiz Config)</h2>
                </div>
                <div class="panel-body">
                    <div class="info-box info">
                        <i class="fas fa-info-circle"></i>
                        <span>Os pontos são definidos na <strong>Configuração do Quiz</strong> e se aplicam tanto ao Quiz quanto à Campanha</span>
                    </div>
                    <div class="form-row" style="margin-top: 15px;">
                        <div class="form-group">
                            <label style="color: #22c55e;">🌲 Fácil</label>
                            <input type="text" class="form-control" value="${quizPoints.facil} pts • ${quizTime.facil}s" disabled>
                        </div>
                        <div class="form-group">
                            <label style="color: #f59e0b;">🏜️ Médio</label>
                            <input type="text" class="form-control" value="${quizPoints.media} pts • ${quizTime.media}s" disabled>
                        </div>
                        <div class="form-group">
                            <label style="color: #ef4444;">⛰️ Difícil</label>
                            <input type="text" class="form-control" value="${quizPoints.dificil} pts • ${quizTime.dificil}s" disabled>
                        </div>
                        <div class="form-group">
                            <label style="color: #a855f7;">🔥 Avançado</label>
                            <input type="text" class="form-control" value="${quizPoints.avancado} pts • ${quizTime.avancado}s" disabled>
                        </div>
                    </div>
                    <a href="#quiz-config" class="btn btn-sm btn-outline" style="margin-top: 10px;">
                        <i class="fas fa-external-link-alt"></i> Ir para Configuração do Quiz
                    </a>
                </div>
            </div>

            <!-- Config específica de Campaña -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-gamepad"></i> Parâmetros da Campanha</h2>
                </div>
                <div class="panel-body">
                    <form id="campaignConfigForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Perguntas por Batalha</label>
                                <input type="number" class="form-control" name="questionsPerBattle" 
                                       value="${config.questionsPerBattle || 3}" min="1" max="10">
                                <small>Quantidade de perguntas em cada batalha</small>
                            </div>
                            <div class="form-group">
                                <label>Vidas Máximas</label>
                                <input type="number" class="form-control" name="maxLives" 
                                       value="${config.maxLives || 2}" min="1" max="10">
                                <small>Vidas iniciais do jogador</small>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Cooldown (horas)</label>
                                <input type="number" class="form-control" name="cooldownHours" 
                                       value="${config.cooldownHours || 8}" min="1" max="24">
                                <small>Tempo de espera ao perder todas as vidas</small>
                            </div>
                            <div class="form-group">
                                <label>Bônus Perfeito</label>
                                <input type="number" class="form-control" name="perfectBonus" 
                                       value="${config.perfectBonus || 150}" min="0">
                                <small>Pontos extras por 0 erros</small>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Bônus por Racha</label>
                                <input type="number" class="form-control" name="streakBonus" 
                                       value="${config.streakBonus || 25}" min="0">
                                <small>Pontos extras por acerto consecutivo</small>
                            </div>
                            <div class="form-group">
                                <label>Bônus por Tempo</label>
                                <input type="number" class="form-control" name="timeBonus" 
                                       value="${config.timeBonus || 5}" min="0">
                                <small>Pontos por segundo restante</small>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Multiplicadores de Zona -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-times"></i> Multiplicadores por Zona</h2>
                </div>
                <div class="panel-body">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Zona 1 (Fácil)</label>
                            <input type="number" class="form-control" name="mult0" 
                                   value="${(config.zoneMultipliers || [1, 1.5, 2, 3])[0]}" step="0.1" min="0.5" max="5">
                        </div>
                        <div class="form-group">
                            <label>Zona 2 (Média)</label>
                            <input type="number" class="form-control" name="mult1" 
                                   value="${(config.zoneMultipliers || [1, 1.5, 2, 3])[1]}" step="0.1" min="0.5" max="5">
                        </div>
                        <div class="form-group">
                            <label>Zona 3 (Difícil)</label>
                            <input type="number" class="form-control" name="mult2" 
                                   value="${(config.zoneMultipliers || [1, 1.5, 2, 3])[2]}" step="0.1" min="0.5" max="5">
                        </div>
                        <div class="form-group">
                            <label>Zona 4+ (Avançada)</label>
                            <input type="number" class="form-control" name="mult3" 
                                   value="${(config.zoneMultipliers || [1, 1.5, 2, 3])[3]}" step="0.1" min="0.5" max="5">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reset Progress -->
            <div class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-exclamation-triangle" style="color: var(--error);"></i> Zona de Perigo</h2>
                </div>
                <div class="panel-body">
                    <button class="btn btn-danger" onclick="AdminCampaignPages.resetAllProgress()">
                        <i class="fas fa-skull"></i> Resetar Progresso de TODOS os Usuários
                    </button>
                    <small style="display: block; margin-top: 10px; color: var(--text-muted);">
                        Isso vai apagar todo o progresso da campanha de todos os usuários. Não pode ser desfeito.
                    </small>
                </div>
            </div>
        `;
    },

    saveConfig() {
        const form = document.getElementById('campaignConfigForm');
        const data = new FormData(form);

        const config = {
            questionsPerBattle: parseInt(data.get('questionsPerBattle')) || 3,
            maxLives: parseInt(data.get('maxLives')) || 2,
            cooldownHours: parseInt(data.get('cooldownHours')) || 8,
            perfectBonus: parseInt(data.get('perfectBonus')) || 150,
            streakBonus: parseInt(data.get('streakBonus')) || 25,
            timeBonus: parseInt(data.get('timeBonus')) || 5,
            zoneMultipliers: [
                parseFloat(document.querySelector('[name="mult0"]').value) || 1,
                parseFloat(document.querySelector('[name="mult1"]').value) || 1.5,
                parseFloat(document.querySelector('[name="mult2"]').value) || 2,
                parseFloat(document.querySelector('[name="mult3"]').value) || 3
            ]
        };

        localStorage.setItem('cartoesx_campaign_config', JSON.stringify(config));
        AdminToast.success('Configuração salva!');
    },

    resetAllProgress() {
        AdminModal.doubleConfirm({
            title: 'Resetar Todo o Progresso',
            message: 'Isso vai apagar o progresso de TODOS os usuários na campanha.',
            confirmWord: 'RESETAR',
            finalMessage: 'Esta ação NÃO pode ser desfeita!'
        }).then(confirmed => {
            if (confirmed) {
                // Remover todas las keys de estado de campaña
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('cartoesx_campaign_state_')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));

                // También limpiar ranking de campaña
                const ranking = JSON.parse(localStorage.getItem('cartoesx_quiz_ranking') || '[]');
                const filtered = ranking.filter(r => r.mode !== 'campaign');
                localStorage.setItem('cartoesx_quiz_ranking', JSON.stringify(filtered));

                AdminToast.success(`Progresso resetado! ${keysToRemove.length} registros removidos.`);
            }
        });
    }
};

window.AdminCampaignPages = AdminCampaignPages;
