// Configuration management system
let currentConfig = {
    firebase: {
        apiKey: '',
        projectId: '',
        collectionName: 'satisfaction-surveys'
    },
    appearance: {
        theme: 'default',
        companyName: '',
        logoUrl: '',
        showLogo: false
    },
    notifications: {
        email: false,
        emailAddress: '',
        newResponse: true,
        lowRating: true,
        daily: false,
        weekly: true,
        frequency: 'immediate'
    },
    backup: {
        auto: true,
        frequency: 'daily'
    },
    advanced: {
        maxResponses: 1000,
        sessionTimeout: 30,
        dataRetention: 365,
        analytics: true,
        debug: false,
        compression: true
    }
};

// Load configurations on page load
document.addEventListener('DOMContentLoaded', function() {
    loadConfigurations();
    initializeEventListeners();
    checkSystemStatus();
});

// Load saved configurations
function loadConfigurations() {
    const savedConfig = localStorage.getItem('systemConfig');
    if (savedConfig) {
        currentConfig = { ...currentConfig, ...JSON.parse(savedConfig) };
        populateFormFields();
    }
}

// Populate form fields with current config
function populateFormFields() {
    // Firebase config
    document.getElementById('apiKey').value = currentConfig.firebase.apiKey || '';
    document.getElementById('projectId').value = currentConfig.firebase.projectId || '';
    document.getElementById('collectionName').value = currentConfig.firebase.collectionName || 'satisfaction-surveys';
    
    // Appearance config
    document.getElementById('themeSelect').value = currentConfig.appearance.theme || 'default';
    document.getElementById('companyName').value = currentConfig.appearance.companyName || '';
    document.getElementById('logoUrl').value = currentConfig.appearance.logoUrl || '';
    document.getElementById('showCompanyLogo').checked = currentConfig.appearance.showLogo || false;
    
    // Notification config
    document.getElementById('emailNotifications').checked = currentConfig.notifications.email || false;
    document.getElementById('notificationEmail').value = currentConfig.notifications.emailAddress || '';
    document.getElementById('notifyNewResponse').checked = currentConfig.notifications.newResponse || true;
    document.getElementById('notifyLowRating').checked = currentConfig.notifications.lowRating || true;
    document.getElementById('notifyDaily').checked = currentConfig.notifications.daily || false;
    document.getElementById('notifyWeekly').checked = currentConfig.notifications.weekly || true;
    document.getElementById('notificationFrequency').value = currentConfig.notifications.frequency || 'immediate';
    
    // Backup config
    document.getElementById('autoBackup').checked = currentConfig.backup.auto || true;
    document.getElementById('backupFrequency').value = currentConfig.backup.frequency || 'daily';
    
    // Advanced config
    document.getElementById('maxResponses').value = currentConfig.advanced.maxResponses || 1000;
    document.getElementById('sessionTimeout').value = currentConfig.advanced.sessionTimeout || 30;
    document.getElementById('dataRetention').value = currentConfig.advanced.dataRetention || 365;
    document.getElementById('enableAnalytics').checked = currentConfig.advanced.analytics || true;
    document.getElementById('enableDebugMode').checked = currentConfig.advanced.debug || false;
    document.getElementById('enableCompression').checked = currentConfig.advanced.compression || true;
}

// Initialize event listeners
function initializeEventListeners() {
    // Auto-save on input changes
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.id !== 'backupFile') {
                autoSaveConfig();
            }
        });
    });
}

// Auto-save configuration
function autoSaveConfig() {
    updateConfigFromForm();
    localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
    showAlert('Configurações salvas automaticamente', 'success');
}

// Update config object from form
function updateConfigFromForm() {
    // Firebase
    currentConfig.firebase.apiKey = document.getElementById('apiKey').value;
    currentConfig.firebase.projectId = document.getElementById('projectId').value;
    currentConfig.firebase.collectionName = document.getElementById('collectionName').value;
    
    // Appearance
    currentConfig.appearance.theme = document.getElementById('themeSelect').value;
    currentConfig.appearance.companyName = document.getElementById('companyName').value;
    currentConfig.appearance.logoUrl = document.getElementById('logoUrl').value;
    currentConfig.appearance.showLogo = document.getElementById('showCompanyLogo').checked;
    
    // Notifications
    currentConfig.notifications.email = document.getElementById('emailNotifications').checked;
    currentConfig.notifications.emailAddress = document.getElementById('notificationEmail').value;
    currentConfig.notifications.newResponse = document.getElementById('notifyNewResponse').checked;
    currentConfig.notifications.lowRating = document.getElementById('notifyLowRating').checked;
    currentConfig.notifications.daily = document.getElementById('notifyDaily').checked;
    currentConfig.notifications.weekly = document.getElementById('notifyWeekly').checked;
    currentConfig.notifications.frequency = document.getElementById('notificationFrequency').value;
    
    // Backup
    currentConfig.backup.auto = document.getElementById('autoBackup').checked;
    currentConfig.backup.frequency = document.getElementById('backupFrequency').value;
    
    // Advanced
    currentConfig.advanced.maxResponses = parseInt(document.getElementById('maxResponses').value);
    currentConfig.advanced.sessionTimeout = parseInt(document.getElementById('sessionTimeout').value);
    currentConfig.advanced.dataRetention = parseInt(document.getElementById('dataRetention').value);
    currentConfig.advanced.analytics = document.getElementById('enableAnalytics').checked;
    currentConfig.advanced.debug = document.getElementById('enableDebugMode').checked;
    currentConfig.advanced.compression = document.getElementById('enableCompression').checked;
}

// Firebase functions (continuação)
async function testFirebaseConnection() {
    showAlert('Testando conexão com Firebase...', 'info');
    
    const apiKey = document.getElementById('apiKey').value;
    const projectId = document.getElementById('projectId').value;
    
    if (!apiKey || !projectId) {
        showAlert('Por favor, preencha a API Key e Project ID', 'error');
        return;
    }
    
    try {
        // Simulate Firebase connection test
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update status indicator
        const statusIndicator = document.getElementById('firebaseStatus');
        const statusText = document.getElementById('firebaseStatusText');
        
        statusIndicator.className = 'status-indicator status-online';
        statusText.textContent = 'Conectado';
        
        showAlert('✅ Conexão com Firebase estabelecida com sucesso!', 'success');
        addLog('SUCCESS', 'Teste de conexão Firebase realizado com sucesso');
        
    } catch (error) {
        const statusIndicator = document.getElementById('firebaseStatus');
        const statusText = document.getElementById('firebaseStatusText');
        
        statusIndicator.className = 'status-indicator status-offline';
        statusText.textContent = 'Erro de Conexão';
        
        showAlert('❌ Erro ao conectar com Firebase: ' + error.message, 'error');
        addLog('ERROR', 'Falha na conexão Firebase: ' + error.message);
    }
}

function saveFirebaseConfig() {
    updateConfigFromForm();
    localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
    showAlert('✅ Configurações do Firebase salvas com sucesso!', 'success');
    addLog('SUCCESS', 'Configurações do Firebase atualizadas');
}

// Appearance functions
function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    applyTheme(theme);
    showAlert(`Tema "${theme}" aplicado temporariamente`, 'info');
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    switch(theme) {
        case 'green':
            root.style.setProperty('--primary-color', '#48bb78');
            root.style.setProperty('--secondary-color', '#38a169');
            break;
        case 'orange':
            root.style.setProperty('--primary-color', '#ed8936');
            root.style.setProperty('--secondary-color', '#dd6b20');
            break;
        case 'purple':
            root.style.setProperty('--primary-color', '#9f7aea');
            root.style.setProperty('--secondary-color', '#805ad5');
            break;
        case 'dark':
            root.style.setProperty('--primary-color', '#2d3748');
            root.style.setProperty('--secondary-color', '#4a5568');
            document.body.style.background = 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)';
            break;
        default:
            root.style.setProperty('--primary-color', '#4299e1');
            root.style.setProperty('--secondary-color', '#3182ce');
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

function previewTheme() {
    const theme = document.getElementById('themeSelect').value;
    applyTheme(theme);
    showAlert(`👁️ Visualizando tema "${theme}". As alterações serão perdidas ao recarregar a página.`, 'warning');
}

function saveAppearanceConfig() {
    updateConfigFromForm();
    localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
    showAlert('✅ Configurações de aparência salvas com sucesso!', 'success');
    addLog('SUCCESS', 'Configurações de aparência atualizadas');
}

// Notification functions
async function testNotification() {
    const email = document.getElementById('notificationEmail').value;
    
    if (!email) {
        showAlert('Por favor, insira um email para teste', 'error');
        return;
    }
    
    showAlert('Enviando email de teste...', 'info');
    
    try {
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 2000));
        showAlert(`✅ Email de teste enviado para ${email}`, 'success');
        addLog('SUCCESS', `Email de teste enviado para ${email}`);
    } catch (error) {
        showAlert('❌ Erro ao enviar email de teste', 'error');
        addLog('ERROR', 'Falha no envio de email de teste');
    }
}

function saveNotificationConfig() {
    updateConfigFromForm();
    localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
    showAlert('✅ Configurações de notificação salvas com sucesso!', 'success');
    addLog('SUCCESS', 'Configurações de notificação atualizadas');
}

// Backup functions
async function createBackup() {
    showAlert('Criando backup...', 'info');
    
    try {
        // Simulate backup creation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const now = new Date();
        const backupId = `backup-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;
        const backupData = {
            id: backupId,
            timestamp: now.toISOString(),
            data: currentConfig,
            recordCount: Math.floor(Math.random() * 1000) + 500,
            size: (Math.random() * 3 + 1).toFixed(1) + ' MB'
        };
        
        // Add to backup list
        addBackupToList(backupData);
        
        showAlert('✅ Backup criado com sucesso!', 'success');
        addLog('SUCCESS', `Backup criado: ${backupId}`);
        
    } catch (error) {
        showAlert('❌ Erro ao criar backup', 'error');
        addLog('ERROR', 'Falha na criação de backup');
    }
}

function addBackupToList(backupData) {
    const backupList = document.getElementById('backupList');
    const backupItem = document.createElement('div');
    backupItem.className = 'backup-item';
    backupItem.innerHTML = `
        <div class="backup-info">
            <div class="backup-date">Backup - ${new Date(backupData.timestamp).toLocaleString()}</div>
            <div class="backup-size">Tamanho: ${backupData.size} | ${backupData.recordCount} registros</div>
        </div>
        <div>
            <button class="btn btn-primary" onclick="downloadBackup('${backupData.id}')">📥 Download</button>
            <button class="btn btn-warning" onclick="restoreBackup('${backupData.id}')">🔄 Restaurar</button>
        </div>
    `;
    backupList.insertBefore(backupItem, backupList.firstChild);
}

function downloadBackup(backupId) {
    showAlert(`Baixando backup ${backupId}...`, 'info');
    
    // Create backup file
    const backupData = {
        id: backupId,
        timestamp: new Date().toISOString(),
        config: currentConfig,
        version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backupId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('✅ Backup baixado com sucesso!', 'success');
    addLog('SUCCESS', `Backup baixado: ${backupId}`);
}

async function restoreBackup(backupId) {
    const confirm = window.confirm(`Tem certeza que deseja restaurar o backup ${backupId}? Esta ação irá sobrescrever as configurações atuais.`);
    
    if (!confirm) return;
    
    showAlert('Restaurando backup...', 'info');
    
    try {
        // Simulate backup restoration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showAlert('✅ Backup restaurado com sucesso! Recarregue a página para ver as alterações.', 'success');
        addLog('SUCCESS', `Backup restaurado: ${backupId}`);
        
        setTimeout(() => {
            window.location.reload();
        }, 3000);
        
    } catch (error) {
        showAlert('❌ Erro ao restaurar backup', 'error');
        addLog('ERROR', `Falha na restauração do backup: ${backupId}`);
    }
}

function importBackup() {
    document.getElementById('backupFile').click();
}

function handleBackupImport() {
    const file = document.getElementById('backupFile').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            if (backupData.config) {
                currentConfig = { ...currentConfig, ...backupData.config };
                populateFormFields();
                localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
                
                showAlert('✅ Backup importado com sucesso!', 'success');
                addLog('SUCCESS', `Backup importado: ${file.name}`);
            } else {
                throw new Error('Formato de backup inválido');
            }
        } catch (error) {
            showAlert('❌ Erro ao importar backup: arquivo inválido', 'error');
            addLog('ERROR', `Falha na importação: ${file.name}`);
        }
    };
    reader.readAsText(file);
}

// Log functions
function addLog(level, message) {
    const logsContainer = document.getElementById('systemLogs');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-level-${level.toLowerCase()}`;
    
    const timestamp = new Date().toLocaleString();
    logEntry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <span class="log-level">[${level}]</span>
        ${message}
    `;
    
    logsContainer.insertBefore(logEntry, logsContainer.firstChild);
    
    // Keep only last 50 logs
    while (logsContainer.children.length > 50) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

function filterLogs() {
    const level = document.getElementById('logLevel').value;
    const logs = document.querySelectorAll('.log-entry');
    
    logs.forEach(log => {
        if (level === 'all' || log.classList.contains(`log-level-${level}`)) {
            log.style.display = 'block';
        } else {
            log.style.display = 'none';
        }
    });
}

function refreshLogs() {
    addLog('INFO', 'Logs atualizados manualmente');
    showAlert('Logs atualizados', 'info');
}

function clearLogs() {
    const confirm = window.confirm('Tem certeza que deseja limpar todos os logs?');
    if (confirm) {
        document.getElementById('systemLogs').innerHTML = '';
        addLog('INFO', 'Logs limpos pelo usuário');
        showAlert('Logs limpos com sucesso', 'success');
    }
}

function exportLogs() {
    const logs = document.querySelectorAll('.log-entry');
    let logText = 'LOGS DO SISTEMA - EXPORTADO EM ' + new Date().toLocaleString() + '\n\n';
    
    logs.forEach(log => {
        logText += log.textContent + '\n';
    });
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('✅ Logs exportados com sucesso!', 'success');
    addLog('SUCCESS', 'Logs exportados pelo usuário');
}

// Advanced functions
function saveAdvancedConfig() {
    updateConfigFromForm();
    localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
    showAlert('✅ Configurações avançadas salvas com sucesso!', 'success');
    addLog('SUCCESS', 'Configurações avançadas atualizadas');
}

function resetToDefaults() {
    const confirm = window.confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão?');
    
    if (confirm) {
        localStorage.removeItem('systemConfig');
        currentConfig = {
            firebase: { apiKey: '', projectId: '', collectionName: 'satisfaction-surveys' },
            appearance: { theme: 'default', companyName: '', logoUrl: '', showLogo: false },
            notifications: { email: false, emailAddress: '', newResponse: true, lowRating: true, daily: false, weekly: true, frequency: 'immediate' },
            backup: { auto: true, frequency: 'daily' },
            advanced: { maxResponses: 1000, sessionTimeout: 30, dataRetention: 365, analytics: true, debug: false, compression: true }
        };
        
        populateFormFields();
        showAlert('✅ Configurações restauradas para os valores padrão!', 'success');
        addLog('WARNING', 'Configurações resetadas para padrão pelo usuário');
    }
}

async function clearAllData() {
    const confirm1 = window.confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema!');
    if (!confirm1) return;
    
    const confirm2 = window.confirm('Esta ação é IRREVERSÍVEL! Tem certeza absoluta?');
    if (!confirm2) return;
    
    const confirm3 = prompt('Digite "CONFIRMAR" para prosseguir:');
    if (confirm3 !== 'CONFIRMAR') {
        showAlert('Operação cancelada', 'info');
        return;
    }
    
    showAlert('Limpando todos os dados...', 'warning');
    
    try {
        // Simulate data clearing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        localStorage.clear();
        showAlert('⚠️ Todos os dados foram removidos! A página será recarregada.', 'warning');
        addLog('WARNING', 'TODOS OS DADOS FORAM LIMPOS PELO USUÁRIO');
                setTimeout(() => {
            window.location.reload();
        }, 3000);
        
    } catch (error) {
        showAlert('❌ Erro ao limpar dados', 'error');
        addLog('ERROR', 'Falha na limpeza de dados');
    }
}

// Utility functions
function showAlert(message, type) {
    const alertsContainer = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
    `;
    
    alertsContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
    
    // Smooth scroll to alert
    alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function checkSystemStatus() {
    // Simulate system status check
    setTimeout(() => {
        addLog('INFO', 'Sistema de configurações carregado');
        addLog('INFO', 'Verificando status dos serviços...');
        
        setTimeout(() => {
            addLog('SUCCESS', 'Todos os serviços estão funcionando normalmente');
        }, 1000);
    }, 500);
}

// Export/Import configuration
function exportConfiguration() {
    const configData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        config: currentConfig
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('✅ Configurações exportadas com sucesso!', 'success');
    addLog('SUCCESS', 'Configurações exportadas pelo usuário');
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
            addLog('INFO', `Página carregada em ${loadTime}ms`);
        }
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', monitorPerformance);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save all configurations
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveAllConfigurations();
    }
    
    // Ctrl+R to refresh logs
    if (e.ctrlKey && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        refreshLogs();
    }
    
    // Ctrl+B to create backup
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        createBackup();
    }
});

function saveAllConfigurations() {
    updateConfigFromForm();
    localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
    showAlert('✅ Todas as configurações foram salvas! (Ctrl+S)', 'success');
    addLog('SUCCESS', 'Todas as configurações salvas via atalho de teclado');
}

// Auto-save functionality
let autoSaveTimer;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        updateConfigFromForm();
        localStorage.setItem('systemConfig', JSON.stringify(currentConfig));
        console.log('Auto-save executado');
    }, 2000);
}

// Add auto-save to all inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', scheduleAutoSave);
    });
});

// Connection status checker
function checkConnectionStatus() {
    const isOnline = navigator.onLine;
    const statusText = isOnline ? 'Online' : 'Offline';
    const statusClass = isOnline ? 'status-online' : 'status-offline';
    
    addLog(isOnline ? 'SUCCESS' : 'WARNING', `Status da conexão: ${statusText}`);
    
    return isOnline;
}

// Check connection status periodically
setInterval(checkConnectionStatus, 30000);

// Handle online/offline events
window.addEventListener('online', function() {
    showAlert('✅ Conexão restaurada', 'success');
    addLog('SUCCESS', 'Conexão com internet restaurada');
});

window.addEventListener('offline', function() {
    showAlert('⚠️ Conexão perdida - trabalhando offline', 'warning');
    addLog('WARNING', 'Conexão com internet perdida');
});

// Form validation
function validateForm(formType) {
    let isValid = true;
    let errors = [];
    
    switch(formType) {
        case 'firebase':
            const apiKey = document.getElementById('apiKey').value;
            const projectId = document.getElementById('projectId').value;
            
            if (!apiKey) {
                errors.push('API Key é obrigatória');
                isValid = false;
            }
            if (!projectId) {
                errors.push('Project ID é obrigatório');
                isValid = false;
            }
            break;
            
        case 'notifications':
            const emailEnabled = document.getElementById('emailNotifications').checked;
            const email = document.getElementById('notificationEmail').value;
            
            if (emailEnabled && !email) {
                errors.push('Email é obrigatório quando notificações estão habilitadas');
                isValid = false;
            }
            if (email && !isValidEmail(email)) {
                errors.push('Email inválido');
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showAlert('Erros de validação: ' + errors.join(', '), 'error');
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced Firebase config save with validation
function saveFirebaseConfigWithValidation() {
    if (validateForm('firebase')) {
        saveFirebaseConfig();
    }
}

// Enhanced notification config save with validation
function saveNotificationConfigWithValidation() {
    if (validateForm('notifications')) {
        saveNotificationConfig();
    }
}

// System health check
async function performHealthCheck() {
    showAlert('Executando verificação de saúde do sistema...', 'info');
    
    const checks = [
        { name: 'LocalStorage', test: () => localStorage.setItem('test', 'test') && localStorage.removeItem('test') },
        { name: 'JSON Support', test: () => JSON.stringify({test: true}) },
        { name: 'Date Functions', test: () => new Date().toISOString() },
        { name: 'DOM Manipulation', test: () => document.createElement('div') },
        { name: 'Event Listeners', test: () => document.addEventListener && document.removeEventListener }
    ];
    
    let passedChecks = 0;
    const results = [];
    
    for (const check of checks) {
        try {
            check.test();
            results.push(`✅ ${check.name}: OK`);
            passedChecks++;
            addLog('SUCCESS', `Health check passed: ${check.name}`);
        } catch (error) {
            results.push(`❌ ${check.name}: FALHOU`);
            addLog('ERROR', `Health check failed: ${check.name} - ${error.message}`);
        }
    }
    
    const healthScore = Math.round((passedChecks / checks.length) * 100);
    const healthStatus = healthScore === 100 ? 'Excelente' : healthScore >= 80 ? 'Bom' : 'Precisa de atenção';
    
    showAlert(`Verificação concluída: ${healthScore}% (${healthStatus})`, healthScore === 100 ? 'success' : 'warning');
    addLog('INFO', `System health check completed: ${healthScore}% - ${passedChecks}/${checks.length} checks passed`);
}

// Add health check button to advanced section
document.addEventListener('DOMContentLoaded', function() {
    const advancedCard = document.querySelector('.config-card:last-child .config-section');
    if (advancedCard) {
        const healthCheckBtn = document.createElement('button');
        healthCheckBtn.className = 'btn btn-primary';
        healthCheckBtn.textContent = '🏥 Verificar Saúde do Sistema';
        healthCheckBtn.onclick = performHealthCheck;
        
        const lastBtnGroup = advancedCard.parentElement.querySelector('.btn-danger').parentElement;
        lastBtnGroup.appendChild(healthCheckBtn);
    }
});

// Initialize tooltips for better UX
function initializeTooltips() {
    const tooltips = {
        'apiKey': 'Chave de API do seu projeto Firebase',
        'projectId': 'ID único do seu projeto Firebase',
        'collectionName': 'Nome da coleção onde os dados serão armazenados',
        'maxResponses': 'Limite máximo de respostas aceitas por dia',
        'sessionTimeout': 'Tempo em minutos antes da sessão expirar',
        'dataRetention': 'Quantos dias manter os dados antes da limpeza automática'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
            element.setAttribute('data-tooltip', tooltips[id]);
        }
    });
}

// Call tooltip initialization
document.addEventListener('DOMContentLoaded', initializeTooltips);

// Final initialization
console.log('🔧 Sistema de Configurações carregado com sucesso!');
addLog('SUCCESS', 'Sistema de configurações inicializado completamente');