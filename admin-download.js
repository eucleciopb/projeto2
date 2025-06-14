// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoEFGxMUgb-MUbWpNzRbUEpEQDXes4wcc",
    authDomain: "programa-de-pontos-nh.firebaseapp.com",
    projectId: "programa-de-pontos-nh",
    storageBucket: "programa-de-pontos-nh.firebasestorage.app",
    messagingSenderId: "136030554657",
    appId: "1:136030554657:web:9bc5561eddc658ab087160"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let allData = [];
let filteredData = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Set default dates
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    document.getElementById('dateFrom').value = lastMonth.toISOString().split('T')[0];
    document.getElementById('dateTo').value = today.toISOString().split('T')[0];
});

// Load data from Firebase
async function loadData() {
    showLoading(true);
    showMessage('Carregando dados do Firebase...', 'info');
    
    try {
        const snapshot = await db.collection('satisfaction-surveys').orderBy('timestamp', 'desc').get();
        
        allData = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            allData.push({
                id: doc.id,
                ...data,
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date(data.createdAt || Date.now())
            });
        });
        
        applyFilters();
        updateStats();
        showMessage(`✅ ${allData.length} registros carregados com sucesso!`, 'success');
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showMessage('❌ Erro ao carregar dados: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Apply filters
function applyFilters() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    
    filteredData = allData.filter(item => {
        // Date filter
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            if (item.timestamp < fromDate) return false;
        }
        
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (item.timestamp > toDate) return false;
        }
        
        // Rating filter
        if (ratingFilter && item.rating != ratingFilter) {
            return false;
        }
        
        return true;
    });
    
    displayData();
}

// Display data in table (continuação)
function displayData() {
    const tableBody = document.getElementById('tableBody');
    const recordCount = document.getElementById('recordCount');
    
    tableBody.innerHTML = '';
    recordCount.textContent = `${filteredData.length} registros`;
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(item.timestamp)}</td>
            <td>${getStarRating(item.rating)}</td>
            <td>${item.name || 'Não informado'}</td>
            <td>${item.email || 'Não informado'}</td>
            <td>${truncateText(item.comments || 'Sem comentários', 50)}</td>
            <td>${getBrowserName(item.userAgent)}</td>
        `;
        tableBody.appendChild(row);
    });
    
    document.getElementById('dataTable').style.display = 'table';
}

// Update statistics
function updateStats() {
    const totalResponses = allData.length;
    const avgRating = totalResponses > 0 ? 
        (allData.reduce((sum, item) => sum + (item.rating || 0), 0) / totalResponses).toFixed(1) : 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayResponses = allData.filter(item => item.timestamp >= today).length;
    
    const lastUpdate = allData.length > 0 ? 
        formatDate(Math.max(...allData.map(item => item.timestamp))) : 'Nunca';
    
    document.getElementById('totalResponses').textContent = totalResponses;
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('todayResponses').textContent = todayResponses;
    document.getElementById('lastUpdate').textContent = lastUpdate;
}

// Download Excel
function downloadExcel() {
    if (filteredData.length === 0) {
        showMessage('❌ Não há dados para download!', 'error');
        return;
    }
    
    showMessage('📥 Preparando arquivo Excel...', 'info');
    
    try {
        const excelData = filteredData.map(item => ({
            'Data/Hora': formatDate(item.timestamp),
            'Avaliação': item.rating || 0,
            'Avaliação (Estrelas)': '⭐'.repeat(item.rating || 0),
            'Nome': item.name || 'Não informado',
            'Email': item.email || 'Não informado',
            'Comentários': item.comments || 'Sem comentários',
            'Navegador': getBrowserName(item.userAgent),
            'URL': item.url || 'Não informado',
            'User Agent': item.userAgent || 'Não informado'
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        
        // Configurar largura das colunas
        worksheet['!cols'] = [
            { width: 20 }, // Data/Hora
            { width: 10 }, // Avaliação
            { width: 15 }, // Estrelas
            { width: 20 }, // Nome
            { width: 25 }, // Email
            { width: 40 }, // Comentários
            { width: 15 }, // Navegador
            { width: 30 }, // URL
            { width: 50 }  // User Agent
        ];
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pesquisa de Satisfação');
        
        const fileName = `pesquisa_satisfacao_${formatDateForFile(new Date())}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        showMessage(`✅ Arquivo Excel baixado: ${fileName}`, 'success');
        
    } catch (error) {
        console.error('Erro ao gerar Excel:', error);
        showMessage('❌ Erro ao gerar arquivo Excel: ' + error.message, 'error');
    }
}

// Download CSV
function downloadCSV() {
    if (filteredData.length === 0) {
        showMessage('❌ Não há dados para download!', 'error');
        return;
    }
    
    showMessage('📄 Preparando arquivo CSV...', 'info');
    
    try {
        const csvData = filteredData.map(item => ({
            'Data/Hora': formatDate(item.timestamp),
            'Avaliação': item.rating || 0,
            'Nome': item.name || 'Não informado',
            'Email': item.email || 'Não informado',
            'Comentários': (item.comments || 'Sem comentários').replace(/"/g, '""'),
            'Navegador': getBrowserName(item.userAgent),
            'URL': item.url || 'Não informado'
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const fileName = `pesquisa_satisfacao_${formatDateForFile(new Date())}.csv`;
        
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        
        showMessage(`✅ Arquivo CSV baixado: ${fileName}`, 'success');
        
    } catch (error) {
        console.error('Erro ao gerar CSV:', error);
        showMessage('❌ Erro ao gerar arquivo CSV: ' + error.message, 'error');
    }
}

// Utility functions
function formatDate(date) {
    if (!date) return 'Data inválida';
    return new Date(date).toLocaleString('pt-BR');
}

function formatDateForFile(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
}

function getStarRating(rating) {
    if (!rating) return '⭐ (0)';
    return '⭐'.repeat(rating) + ` (${rating})`;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getBrowserName(userAgent) {
    if (!userAgent) return 'Desconhecido';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Outro';
}

function showMessage(message, type) {
    const messagesDiv = document.getElementById('messages');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
    alertDiv.textContent = message;
    
    messagesDiv.innerHTML = '';
    messagesDiv.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
    document.getElementById('dataTable').style.display = show ? 'none' : 'table';
}

// Event listeners for filters
document.getElementById('dateFrom').addEventListener('change', applyFilters);
document.getElementById('dateTo').addEventListener('change', applyFilters);
document.getElementById('ratingFilter').addEventListener('change', applyFilters);
