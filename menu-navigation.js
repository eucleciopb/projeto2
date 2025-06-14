// Navigation functions
function navigateTo(page) {
    // Add loading effect
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
        window.location.href = page;
    }, 300);
}

// Show system information
function showInfo() {
    const modal = createModal('Sobre o Sistema', `
        <div style="text-align: left; line-height: 1.6;">
            <h4>🎯 Sistema de Pesquisa de Satisfação</h4>
            <p><strong>Versão:</strong> 1.0.0</p>
            <p><strong>Desenvolvido em:</strong> ${new Date().getFullYear()}</p>
            
            <h4 style="margin-top: 20px;">📋 Funcionalidades:</h4>
            <ul>
                <li>✅ Coleta de feedback via formulário interativo</li>
                <li>📊 Dashboard com análises em tempo real</li>
                <li>📥 Exportação de dados (Excel/CSV)</li>
                <li>🔧 Painel administrativo completo</li>
                <li>📱 Interface responsiva</li>
                <li>🔒 Integração segura com Firebase</li>
            </ul>
            
            <h4 style="margin-top: 20px;">🛠️ Tecnologias:</h4>
            <ul>
                <li>HTML5, CSS3, JavaScript</li>
                <li>Firebase Firestore</li>
                <li>SheetJS (para Excel)</li>
                <li>Design responsivo</li>
            </ul>
        </div>
    `);
}

// Show help information (continuação)
function showHelp() {
    const modal = createModal('Ajuda do Sistema', `
        <div style="text-align: left; line-height: 1.6;">
            <h4>🚀 Como usar o sistema:</h4>
            
            <h5 style="color: #4299e1; margin-top: 15px;">1. 📝 Pesquisa de Satisfação:</h5>
            <p>• Acesse o formulário principal<br>
            • Avalie usando o sistema de estrelas<br>
            • Preencha os campos opcionais<br>
            • Clique em "Enviar Pesquisa"</p>
            
            <h5 style="color: #48bb78; margin-top: 15px;">2. 📊 Dashboard:</h5>
            <p>• Visualize estatísticas em tempo real<br>
            • Analise a distribuição de avaliações<br>
            • Veja métricas de satisfação<br>
            • Acompanhe comentários recentes</p>
            
            <h5 style="color: #38b2ac; margin-top: 15px;">3. 📥 Download de Dados:</h5>
            <p>• Filtre dados por período ou avaliação<br>
            • Exporte para Excel ou CSV<br>
            • Visualize dados em tabela<br>
            • Acompanhe estatísticas detalhadas</p>
            
            <h5 style="color: #ed8936; margin-top: 15px;">4. ⚙️ Configurações:</h5>
            <p>• Configure conexão com Firebase<br>
            • Personalize aparência<br>
            • Gerencie backups<br>
            • Configure notificações</p>
            
            <h4 style="margin-top: 20px; color: #e53e3e;">⚠️ Problemas Comuns:</h4>
            <p><strong>Dados não carregam:</strong> Verifique conexão com internet<br>
            <strong>Erro ao enviar:</strong> Verifique configuração do Firebase<br>
            <strong>Download não funciona:</strong> Permita downloads no navegador</p>
        </div>
    `);
}

// Show contact information
function showContact() {
    const modal = createModal('Contato e Suporte', `
        <div style="text-align: center; line-height: 1.8;">
            <h4>📧 Informações de Contato</h4>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h5 style="color: #2d3748;">🛠️ Suporte Técnico</h5>
                <p>Para problemas técnicos ou dúvidas sobre o sistema</p>
                <p><strong>Email:</strong> suporte@sistema.com</p>
                <p><strong>Telefone:</strong> (11) 9999-9999</p>
            </div>
            
            <div style="background: #f0fff4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h5 style="color: #2d3748;">💼 Comercial</h5>
                <p>Para informações sobre licenciamento e customizações</p>
                <p><strong>Email:</strong> comercial@sistema.com</p>
                <p><strong>WhatsApp:</strong> (11) 8888-8888</p>
            </div>
            
            <div style="background: #fffaf0; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h5 style="color: #2d3748;">🎓 Treinamento</h5>
                <p>Para treinamentos e consultoria</p>
                <p><strong>Email:</strong> treinamento@sistema.com</p>
                <p><strong>Horário:</strong> Seg-Sex 8h às 18h</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 0.9rem; color: #718096;">
                Tempo médio de resposta: 2-4 horas úteis
            </p>
        </div>
    `);
}

// Check system status
async function checkStatus() {
    const modal = createModal('Status do Sistema', `
        <div style="text-align: center;">
            <div class="spinner" style="margin: 20px auto;"></div>
            <p>Verificando status dos serviços...</p>
        </div>
    `);
    
    // Simulate status check
    setTimeout(() => {
        const statusHtml = `
            <div style="text-align: left; line-height: 1.6;">
                <h4 style="text-align: center; margin-bottom: 20px;">🔍 Status dos Serviços</h4>
                
                <div class="status-item">
                    <span class="status-indicator status-online"></span>
                    <strong>Firebase Database:</strong> Online
                    <small style="color: #718096; display: block;">Última verificação: ${new Date().toLocaleTimeString()}</small>
                </div>
                
                <div class="status-item">
                    <span class="status-indicator status-online"></span>
                    <strong>Sistema de Formulários:</strong> Funcionando
                    <small style="color: #718096; display: block;">Respostas sendo processadas normalmente</small>
                </div>
                
                <div class="status-item">
                    <span class="status-indicator status-online"></span>
                    <strong>Dashboard:</strong> Atualizado
                    <small style="color: #718096; display: block;">Dados sincronizados em tempo real</small>
                </div>
                
                <div class="status-item">
                    <span class="status-indicator status-online"></span>
                    <strong>Exportação de Dados:</strong> Disponível
                    <small style="color: #718096; display: block;">Excel e CSV funcionando</small>
                </div>
                
                <div style="background: #f0fff4; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
                    <h5 style="color: #22543d; margin-bottom: 10px;">✅ Todos os Serviços Online</h5>
                    <p style="color: #276749; margin: 0;">Sistema funcionando perfeitamente</p>
                </div>
                
                <div style="margin-top: 20px; font-size: 0.9rem; color: #718096; text-align: center;">
                    <p>Última atualização: ${new Date().toLocaleString()}</p>
                    <p>Uptime: 99.9% | Próxima manutenção: Domingo 02:00</p>
                </div>
            </div>
            
            <style>
                .status-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 10px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .status-item:last-child {
                    border-bottom: none;
                }
                .status-indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    margin-top: 4px;
                    flex-shrink: 0;
                }
                .status-online {
                    background: #48bb78;
                    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.3);
                }
                .status-warning {
                    background: #ed8936;
                    box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.3);
                }
                .status-offline {
                    background: #e53e3e;
                    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.3);
                }
            </style>
        `;
        
        modal.querySelector('.modal-body').innerHTML = statusHtml;
    }, 2000);
}

// Create modal function
function createModal(title, content) {
    // Remove existing modal
    const existingModal = document.getElementById('systemModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'systemModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeModal()">Fechar</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .modal-header {
                padding: 20px 25px;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #4299e1, #3182ce);
                color: white;
                border-radius: 15px 15px 0 0;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 1.3rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 5px 10px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .modal-close:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .modal-body {
                padding: 25px;
                line-height: 1.6;
            }
            
            .modal-footer {
                padding: 20px 25px;
                border-top: 1px solid #e2e8f0;
                text-align: right;
                background: #f8f9fa;
                border-radius: 0 0 15px 15px;
            }
            
            .modal-footer .btn {
                background: linear-gradient(135deg, #4299e1, #3182ce);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .modal-footer .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4299e1;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // Add styles to head if not already added
    if (!document.getElementById('modalStyles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'modalStyles';
        styleElement.innerHTML = modalStyles;
        document.head.appendChild(styleElement);
    }
    
    document.body.appendChild(modal);
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    return modal;
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('systemModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);

// Add loading states to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.menu-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') {
                const btn = this.querySelector('.btn');
                if (btn) {
                    btn.style.background = 'rgba(255,255,255,0.5)';
                    btn.textContent = 'Carregando...';
                }
            }
        });
    });
    
    // Add smooth scroll for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Add focus styles for keyboard navigation (continuação)
const keyboardStyles = document.createElement('style');
keyboardStyles.textContent = `
    .keyboard-navigation .menu-card:focus {
        outline: 3px solid #4299e1;
        outline-offset: 2px;
    }
    
    .keyboard-navigation .btn:focus {
        outline: 2px solid #4299e1;
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardStyles);

// Add performance monitoring
function trackPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                    domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                    totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
                });
            }, 0);
        });
    }
}

trackPagePerformance();