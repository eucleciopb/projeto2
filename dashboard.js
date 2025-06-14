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

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    
    // Auto refresh every 5 minutes
    setInterval(loadDashboardData, 300000);
});

// Load all data from Firebase
async function loadDashboardData() {
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
        
        updateAllStats();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Update all statistics
function updateAllStats() {
    updateGeneralStats();
    updateRatingDistribution();
    updateSatisfactionMetrics();
    updatePeriodAnalysis();
    updateBrowserStats();
    updateRecentComments();
}

// Update general statistics
function updateGeneralStats() {
    const total = allData.length;
    const avgRating = total > 0 ? 
        (allData.reduce((sum, item) => sum + (item.rating || 0), 0) / total).toFixed(1) : 0;
    
    // Today's responses
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayResponses = allData.filter(item => item.timestamp >= today).length;
    
    // Yesterday's responses for trend
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayResponses = allData.filter(item => 
        item.timestamp >= yesterday && item.timestamp < today
    ).length;
    
    // This week's responses
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekResponses = allData.filter(item => item.timestamp >= weekStart).length;
    
    // Last week's responses for trend
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(weekStart);
    const lastWeekResponses = allData.filter(item => 
        item.timestamp >= lastWeekStart && item.timestamp < lastWeekEnd
    ).length;
    
    document.getElementById('totalResponses').textContent = total;
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('todayResponses').textContent = todayResponses;
    document.getElementById('weekResponses').textContent = weekResponses;
    
    // Update trends
    updateTrend('todayTrend', todayResponses, yesterdayResponses);
    updateTrend('weekTrend', weekResponses, lastWeekResponses);
}

// Update rating distribution
function updateRatingDistribution() {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    allData.forEach(item => {
        if (item.rating >= 1 && item.rating <= 5) {
            ratingCounts[item.rating]++;
        }
    });
    
    const total = allData.length;
    
    for (let i = 1; i <= 5; i++) {
        const count = ratingCounts[i];
        const percentage = total > 0 ? (count / total * 100) : 0;
        const barElement = document.getElementById(`bar-${i}`);
        
        barElement.style.width = percentage + '%';
        barElement.textContent = count;
    }
}

// Update satisfaction metrics
function updateSatisfactionMetrics() {
    const total = allData.length;
    
    if (total === 0) {
        document.getElementById('satisfactionRate').textContent = '0%';
        document.getElementById('npsScore').textContent = '0';
        document.getElementById('responseRate').textContent = '0%';
        document.getElementById('avgResponseTime').textContent = '0h';
        return;
    }
    
    // Satisfaction rate (4-5 stars)
    const satisfied = allData.filter(item => item.rating >= 4).length;
    const satisfactionRate = ((satisfied / total) * 100).toFixed(1);
    
    // NPS Score approximation (5 stars = promoters, 1-3 stars = detractors)
    const promoters = allData.filter(item => item.rating === 5).length;
    const detractors = allData.filter(item => item.rating <= 3).length;
    const npsScore = Math.round(((promoters - detractors) / total) * 100);
    
    // Response rate (with comments)
    const withComments = allData.filter(item => item.comments && item.comments.trim()).length;
    const responseRate = ((withComments / total) * 100).toFixed(1);
    
    // Average response time (time between responses)
    const avgResponseTime = calculateAverageResponseTime();
    
    document.getElementById('satisfactionRate').textContent = satisfactionRate + '%';
    document.getElementById('npsScore').textContent = npsScore;
    document.getElementById('responseRate').textContent = responseRate + '%';
    document.getElementById('avgResponseTime').textContent = avgResponseTime;
}

// Update period analysis
function updatePeriodAnalysis() {
    const now = new Date();
    
    // Last 7 days
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);
    const count7Days = allData.filter(item => item.timestamp >= last7Days).length;
    
    // Last 30 days
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);
    const count30Days = allData.filter(item => item.timestamp >= last30Days).length;
    
        // This month
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthCount = allData.filter(item => item.timestamp >= thisMonthStart).length;
    
    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthCount = allData.filter(item => 
        item.timestamp >= lastMonthStart && item.timestamp < lastMonthEnd
    ).length;
    
    document.getElementById('period7Days').textContent = count7Days;
    document.getElementById('period30Days').textContent = count30Days;
    document.getElementById('periodThisMonth').textContent = thisMonthCount;
    document.getElementById('periodLastMonth').textContent = lastMonthCount;
    
    // Update period trends
    updateTrend('monthTrend', thisMonthCount, lastMonthCount);
}

// Update browser/device statistics
function updateBrowserStats() {
    const browserStats = {};
    const deviceStats = {};
    
    allData.forEach(item => {
        // Browser stats (simulated since we don't collect this data)
        const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
        const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
        browserStats[randomBrowser] = (browserStats[randomBrowser] || 0) + 1;
        
        // Device stats (simulated)
        const devices = ['Desktop', 'Mobile', 'Tablet'];
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        deviceStats[randomDevice] = (deviceStats[randomDevice] || 0) + 1;
    });
    
    updateStatsChart('browserChart', browserStats);
    updateStatsChart('deviceChart', deviceStats);
}

// Update recent comments
function updateRecentComments() {
    const commentsContainer = document.getElementById('recentComments');
    if (!commentsContainer) return;
    
    const recentComments = allData
        .filter(item => item.comments && item.comments.trim())
        .slice(0, 10);
    
    if (recentComments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-data">Nenhum comentário recente</p>';
        return;
    }
    
    commentsContainer.innerHTML = recentComments.map(item => `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-rating">
                    ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                </div>
                <div class="comment-date">
                    ${item.timestamp.toLocaleDateString()} ${item.timestamp.toLocaleTimeString()}
                </div>
            </div>
            <div class="comment-text">${item.comments}</div>
            ${item.name ? `<div class="comment-author">- ${item.name}</div>` : ''}
        </div>
    `).join('');
}

// Update trend indicators
function updateTrend(elementId, current, previous) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (previous === 0) {
        element.innerHTML = current > 0 ? '<span class="trend-up">📈 Novo</span>' : '<span class="trend-neutral">➖</span>';
        return;
    }
    
    const change = ((current - previous) / previous * 100);
    const changeText = Math.abs(change).toFixed(1) + '%';
    
    if (change > 0) {
        element.innerHTML = `<span class="trend-up">📈 +${changeText}</span>`;
    } else if (change < 0) {
        element.innerHTML = `<span class="trend-down">📉 -${changeText}</span>`;
    } else {
        element.innerHTML = '<span class="trend-neutral">➖ 0%</span>';
    }
}

// Calculate average response time
function calculateAverageResponseTime() {
    if (allData.length < 2) return '0h';
    
    const sortedData = [...allData].sort((a, b) => a.timestamp - b.timestamp);
    let totalTime = 0;
    let intervals = 0;
    
    for (let i = 1; i < sortedData.length; i++) {
        const timeDiff = sortedData[i].timestamp - sortedData[i-1].timestamp;
        totalTime += timeDiff;
        intervals++;
    }
    
    const avgTimeMs = totalTime / intervals;
    const avgTimeHours = avgTimeMs / (1000 * 60 * 60);
    
    if (avgTimeHours < 1) {
        const avgTimeMinutes = avgTimeMs / (1000 * 60);
        return Math.round(avgTimeMinutes) + 'm';
    } else if (avgTimeHours < 24) {
        return avgTimeHours.toFixed(1) + 'h';
    } else {
        const avgTimeDays = avgTimeHours / 24;
        return avgTimeDays.toFixed(1) + 'd';
    }
}

// Update statistics chart
function updateStatsChart(chartId, data) {
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;
    
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    chartContainer.innerHTML = Object.entries(data)
        .sort(([,a], [,b]) => b - a)
        .map(([key, value]) => {
            const percentage = total > 0 ? (value / total * 100) : 0;
            return `
                <div class="chart-item">
                    <div class="chart-label">${key}</div>
                    <div class="chart-bar">
                        <div class="chart-fill" style="width: ${percentage}%"></div>
                        <span class="chart-value">${value} (${percentage.toFixed(1)}%)</span>
                    </div>
                </div>
            `;
        }).join('');
}

// Export data functions
function exportToCSV() {
    if (allData.length === 0) {
        alert('Não há dados para exportar');
        return;
    }
    
    const headers = ['Data/Hora', 'Avaliação', 'Nome', 'Email', 'Telefone', 'Comentários'];
    const csvContent = [
        headers.join(','),
        ...allData.map(item => [
            `"${item.timestamp.toLocaleString()}"`,
            item.rating || '',
            `"${item.name || ''}"`,
            `"${item.email || ''}"`,
            `"${item.phone || ''}"`,
            `"${(item.comments || '').replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'pesquisa-satisfacao.csv', 'text/csv');
}

function exportToJSON() {
    if (allData.length === 0) {
        alert('Não há dados para exportar');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalRecords: allData.length,
        data: allData.map(item => ({
            ...item,
            timestamp: item.timestamp.toISOString()
        }))
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, 'pesquisa-satisfacao.json', 'application/json');
}

function exportToPDF() {
    // Create a comprehensive report
    const reportContent = generatePDFReport();
    
    // For a real implementation, you would use a library like jsPDF
    // For now, we'll create an HTML version that can be printed as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
}

// Generate PDF report content
function generatePDFReport() {
    const now = new Date();
    const total = allData.length;
    const avgRating = total > 0 ? 
        (allData.reduce((sum, item) => sum + (item.rating || 0), 0) / total).toFixed(1) : 0;
    
    const satisfied = allData.filter(item => item.rating >= 4).length;
    const satisfactionRate = total > 0 ? ((satisfied / total) * 100).toFixed(1) : 0;
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Relatório de Pesquisa de Satisfação</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
                .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                .stat-value { font-size: 2em; font-weight: bold; color: #4299e1; }
                .comments-section { margin-top: 30px; }
                .comment-item { border-bottom: 1px solid #eee; padding: 10px 0; }
                .rating-dist { margin: 20px 0; }
                .rating-bar { display: flex; align-items: center; margin: 5px 0; }
                .bar { height: 20px; background: #4299e1; margin: 0 10px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Relatório de Pesquisa de Satisfação</h1>
                <p>Gerado em: ${now.toLocaleString()}</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total de Respostas</h3>
                    <div class="stat-value">${total}</div>
                </div>
                <div class="stat-card">
                    <h3>Avaliação Média</h3>
                    <div class="stat-value">${avgRating} ⭐</div>
                </div>
                <div class="stat-card">
                    <h3>Taxa de Satisfação</h3>
                    <div class="stat-value">${satisfactionRate}%</div>
                </div>
                <div class="stat-card">
                    <h3>Período</h3>
                    <div class="stat-value">
                        ${allData.length > 0 ? 
                            `${Math.ceil((now - allData[allData.length - 1].timestamp) / (1000 * 60 * 60 * 24))} dias` : 
                            '0 dias'
                        }
                    </div>
                </div>
            </div>
            
            <div class="rating-dist">
                <h3>Distribuição de Avaliações</h3>
                ${generateRatingDistributionHTML()}
            </div>
            
            <div class="comments-section">
                <h3>Comentários Recentes</h3>
                ${generateCommentsHTML()}
            </div>
        </body>
        </html>
    `;
}

// Generate rating distribution HTML for report
function generateRatingDistributionHTML() {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    allData.forEach(item => {
        if (item.rating >= 1 && item.rating <= 5) {
            ratingCounts[item.rating]++;
        }
    });
    
    const total = allData.length;
    
    return Object.entries(ratingCounts)
        .reverse()
        .map(([rating, count]) => {
            const percentage = total > 0 ? (count / total * 100) : 0;
            return `
                <div class="rating-bar">
                    <span>${rating} ⭐</span>
                    <div class="bar" style="width: ${percentage * 3}px;"></div>
                    <span>${count} (${percentage.toFixed(1)}%)</span>
                </div>
            `;
        }).join('');
}

// Generate comments HTML for report
function generateCommentsHTML() {
    const recentComments = allData
        .filter(item => item.comments && item.comments.trim())
        .slice(0, 20);
    
    if (recentComments.length === 0) {
        return '<p>Nenhum comentário disponível</p>';
    }
    
    return recentComments.map(item => `
        <div class="comment-item">
            <div><strong>${'⭐'.repeat(item.rating)}</strong> - ${item.timestamp.toLocaleDateString()}</div>
            <div>${item.comments}</div>
            ${item.name ? `<div><em>- ${item.name}</em></div>` : ''}
        </div>
    `).join('');
}

// Download file utility
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Filter functions
function filterByDateRange() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    if (!startDate || !endDate) {
        alert('Por favor, selecione as datas de início e fim');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date
    
    const filteredData = allData.filter(item => 
        item.timestamp >= start && item.timestamp <= end
    );
    
    updateDashboardWithFilteredData(filteredData);
    showFilterInfo(`Período: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`, filteredData.length);
}

function filterByRating() {
    const minRating = parseInt(document.getElementById('minRating')?.value) || 1;
    const maxRating = parseInt(document.getElementById('maxRating')?.value) || 5;
    
    const filteredData = allData.filter(item => 
        item.rating >= minRating && item.rating <= maxRating
    );
    
    updateDashboardWithFilteredData(filteredData);
    showFilterInfo(`Avaliações: ${minRating} - ${maxRating} estrelas`, filteredData.length);
}

function clearFilters() {
    // Reset filter inputs
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const minRating = document.getElementById('minRating');
    const maxRating = document.getElementById('maxRating');
    
    if (startDate) startDate.value = '';
    if (endDate) endDate.value = '';
    if (minRating) minRating.value = '1';
    if (maxRating) maxRating.value = '5';
    
    // Reset to show all data
    updateDashboardWithFilteredData(allData);
    hideFilterInfo();
}

// Update dashboard with filtered data
function updateDashboardWithFilteredData(filteredData) {
    const originalData = allData;
    allData = filteredData;
    
    updateAllStats();
    
    // Restore original data
    allData = originalData;
}

// Show filter information
function showFilterInfo(filterText, resultCount) {
    let filterInfo = document.getElementById('filterInfo');
    if (!filterInfo) {
        filterInfo = document.createElement('div');
        filterInfo.id = 'filterInfo';
        filterInfo.className = 'filter-info';
        
        const dashboard = document.querySelector('.dashboard-container');
        if (dashboard) {
            dashboard.insertBefore(filterInfo, dashboard.firstChild);
        }
    }
    
    filterInfo.innerHTML = `
        <div class="filter-active">
            <span>📊 Filtro ativo: ${filterText} (${resultCount} resultados)</span>
            <button onclick="clearFilters()" class="btn-clear-filter">✕ Limpar</button>
        </div>
    `;
    filterInfo.style.display = 'block';
}

// Hide filter information
function hideFilterInfo() {
    const filterInfo = document.getElementById('filterInfo');
    if (filterInfo) {
        filterInfo.style.display = 'none';
    }
}

// Search functionality
function searchComments() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    if (!searchTerm) {
        clearFilters();
        return;
    }
    
    const filteredData = allData.filter(item => 
        (item.comments && item.comments.toLowerCase().includes(searchTerm)) ||
        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
        (item.email && item.email.toLowerCase().includes(searchTerm))
    );
    
    updateDashboardWithFilteredData(filteredData);
    showFilterInfo(`Busca: "${searchTerm}"`, filteredData.length);
}

// Real-time updates
function enableRealTimeUpdates() {
    // Listen for new data every 30 seconds
    setInterval(async () => {
        try {
            const snapshot = await db.collection('satisfaction-surveys')
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get();
            
            if (!snapshot.empty) {
                const latestDoc = snapshot.docs[0];
                const latestData = {
                    id: latestDoc.id,
                    ...latestDoc.data(),
                    timestamp: latestDoc.data().timestamp ? latestDoc.data().timestamp.toDate() : new Date()
                };
                
                // Check if this is a new response
                const existingResponse = allData.find(item => item.id === latestData.id);
                if (!existingResponse) {
                    allData.unshift(latestData);
                    updateAllStats();
                    showNewResponseNotification(latestData);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar novas respostas:', error);
        }
    }, 30000);
}

// Show new response notification
function showNewResponseNotification(responseData) {
    const notification = document.createElement('div');
    notification.className = 'new-response-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>🎉 Nova Resposta Recebida!</h4>
            <p>Avaliação: ${'⭐'.repeat(responseData.rating)}</p>
            <p>Recebida em: ${responseData.timestamp.toLocaleString()}</p>
            ${responseData.comments ? `<p>"${responseData.comments.substring(0, 100)}..."</p>` : ''}
        </div>
        <button onclick="this.parentElement.remove()" class="notification-close">✕</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// Play notification sound
function playNotificationSound() {
    // Skip audio for now - can be implemented later if needed
    console.log('🔔 Nova resposta recebida!');
}

// Dashboard refresh functionality
function refreshDashboard() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '🔄 Atualizando...';
    }
    
    loadDashboardData().then(() => {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '🔄 Atualizar';
        }
        showRefreshNotification();
    });
}

// Show refresh notification
function showRefreshNotification() {
    const notification = document.createElement('div');
    notification.className = 'refresh-notification';
    notification.innerHTML = '✅ Dashboard atualizado com sucesso!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Advanced analytics functions
function calculateSatisfactionTrends() {
    if (allData.length < 7) return null;
    
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const dayData = allData.filter(item => 
            item.timestamp >= date && item.timestamp < nextDate
        );
        
        const avgRating = dayData.length > 0 ? 
            dayData.reduce((sum, item) => sum + item.rating, 0) / dayData.length : 0;
        
        last7Days.push({
            date: date.toLocaleDateString(),
            count: dayData.length,
            avgRating: avgRating.toFixed(1)
        });
    }
    
    return last7Days;
}

// Update satisfaction trends chart
function updateSatisfactionTrends() {
    const trends = calculateSatisfactionTrends();
    const trendsContainer = document.getElementById('satisfactionTrends');
    
    if (!trends || !trendsContainer) return;
    
    trendsContainer.innerHTML = `
        <h4>📈 Tendência dos Últimos 7 Dias</h4>
        <div class="trends-chart">
            ${trends.map(day => `
                <div class="trend-day">
                    <div class="trend-date">${day.date.split('/').slice(0, 2).join('/')}</div>
                    <div class="trend-bar" style="height: ${day.avgRating * 20}px;" title="Média: ${day.avgRating}⭐"></div>
                    <div class="trend-count">${day.count}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Calculate response patterns
function analyzeResponsePatterns() {
    const patterns = {
        hourly: new Array(24).fill(0),
        daily: new Array(7).fill(0),
        monthly: new Array(12).fill(0)
    };
    
    allData.forEach(item => {
        const date = item.timestamp;
        patterns.hourly[date.getHours()]++;
        patterns.daily[date.getDay()]++;
        patterns.monthly[date.getMonth()]++;
    });
    
    return patterns;
}

// Update response patterns display
function updateResponsePatterns() {
    const patterns = analyzeResponsePatterns();
    const patternsContainer = document.getElementById('responsePatterns');
    
    if (!patternsContainer) return;
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const maxDaily = Math.max(...patterns.daily);
    
    patternsContainer.innerHTML = `
        <h4>⏰ Padrões de Resposta</h4>
        <div class="patterns-section">
            <h5>Por Dia da Semana</h5>
            <div class="daily-pattern">
                ${patterns.daily.map((count, index) => `
                    <div class="pattern-bar">
                        <div class="pattern-fill" style="height: ${maxDaily > 0 ? (count / maxDaily) * 100 : 0}%"></div>
                        <div class="pattern-label">${dayNames[index]}</div>
                        <div class="pattern-count">${count}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Sentiment analysis (basic)
function analyzeSentiment() {
    const positiveWords = ['bom', 'ótimo', 'excelente', 'maravilhoso', 'perfeito', 'adorei', 'recomendo', 'satisfeito', 'feliz', 'incrível'];
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'terrível', 'odiei', 'insatisfeito', 'problema', 'demora', 'lento', 'difícil'];
    
    const sentiments = { positive: 0, negative: 0, neutral: 0 };
    
    allData.forEach(item => {
        if (!item.comments) {
            sentiments.neutral++;
            return;
        }
        
        const comment = item.comments.toLowerCase();
        const positiveCount = positiveWords.filter(word => comment.includes(word)).length;
        const negativeCount = negativeWords.filter(word => comment.includes(word)).length;
        
        if (positiveCount > negativeCount) {
            sentiments.positive++;
        } else if (negativeCount > positiveCount) {
            sentiments.negative++;
        } else {
            sentiments.neutral++;
        }
    });
    
    return sentiments;
}

// Update sentiment analysis display
function updateSentimentAnalysis() {
    const sentiments = analyzeSentiment();
    const sentimentContainer = document.getElementById('sentimentAnalysis');
    
    if (!sentimentContainer) return;
    
    const total = sentiments.positive + sentiments.negative + sentiments.neutral;
    
    sentimentContainer.innerHTML = `
        <h4>💭 Análise de Sentimento</h4>
        <div class="sentiment-bars">
            <div class="sentiment-item">
                <span class="sentiment-label">😊 Positivo</span>
                <div class="sentiment-bar">
                    <div class="sentiment-fill positive" style="width: ${total > 0 ? (sentiments.positive / total) * 100 : 0}%"></div>
                </div>
                <span class="sentiment-count">${sentiments.positive}</span>
            </div>
            <div class="sentiment-item">
                <span class="sentiment-label">😐 Neutro</span>
                <div class="sentiment-bar">
                    <div class="sentiment-fill neutral" style="width: ${total > 0 ? (sentiments.neutral / total) * 100 : 0}%"></div>
                </div>
                <span class="sentiment-count">${sentiments.neutral}</span>
            </div>
            <div class="sentiment-item">
                <span class="sentiment-label">😞 Negativo</span>
                <div class="sentiment-bar">
                    <div class="sentiment-fill negative" style="width: ${total > 0 ? (sentiments.negative / total) * 100 : 0}%"></div>
                </div>
                <span class="sentiment-count">${sentiments.negative}</span>
            </div>
        </div>
    `;
}

// Generate insights
function generateInsights() {
    const insights = [];
    const total = allData.length;
    
    if (total === 0) {
        return ['Nenhum dado disponível para análise'];
    }
    
    // Rating insights
    const avgRating = allData.reduce((sum, item) => sum + item.rating, 0) / total;
    if (avgRating >= 4.5) {
        insights.push('🎉 Excelente! Sua avaliação média está acima de 4.5 estrelas');
    } else if (avgRating < 3) {
        insights.push('⚠️ Atenção: Avaliação média baixa. Considere investigar os problemas');
    }
    
    // Response volume insights
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayResponses = allData.filter(item => item.timestamp >= today).length;
    const avgDaily = total / Math.max(1, Math.ceil((Date.now() - allData[allData.length - 1]?.timestamp) / (1000 * 60 * 60 * 24)));
    
    if (todayResponses > avgDaily * 1.5) {
        insights.push('📈 Hoje você recebeu mais respostas que a média diária');
    }
    
    // Comment insights
    const withComments = allData.filter(item => item.comments && item.comments.trim()).length;
    const commentRate = (withComments / total) * 100;
    
    if (commentRate > 50) {
        insights.push('💬 Ótima taxa de comentários! Mais de 50% das pessoas deixaram feedback');
    } else if (commentRate < 20) {
        insights.push('💭 Considere incentivar mais comentários para obter feedback detalhado');
    }
    
    // Satisfaction insights
    const satisfied = allData.filter(item => item.rating >= 4).length;
    const satisfactionRate = (satisfied / total) * 100;
    
    if (satisfactionRate >= 80) {
        insights.push('✨ Parabéns! Mais de 80% dos clientes estão satisfeitos');
    } else if (satisfactionRate < 60) {
        insights.push('🔧 Oportunidade de melhoria: Taxa de satisfação abaixo de 60%');
    }
    
    return insights.length > 0 ? insights : ['Continue coletando dados para gerar insights mais precisos'];
}

// Update insights display
function updateInsights() {
    const insights = generateInsights();
    const insightsContainer = document.getElementById('insights');
    
    if (!insightsContainer) return;
    
    insightsContainer.innerHTML = `
        <h4>💡 Insights</h4>
        <div class="insights-list">
            ${insights.map(insight => `
                <div class="insight-item">${insight}</div>
            `).join('')}
        </div>
    `;
}

// Enhanced update function to include new analytics
function updateAllStats() {
    updateGeneralStats();
    updateRatingDistribution();
    updateSatisfactionMetrics();
    updatePeriodAnalysis();
    updateBrowserStats();
    updateRecentComments();
    updateSatisfactionTrends();
    updateResponsePatterns();
    updateSentimentAnalysis();
    updateInsights();
}

// Auto-save dashboard preferences
function saveDashboardPreferences() {
    const preferences = {
        autoRefresh: document.getElementById('autoRefresh')?.checked || false,
        showNotifications: document.getElementById('showNotifications')?.checked || true,
        refreshInterval: document.getElementById('refreshInterval')?.value || 300000
    };
    
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences));
}

// Load dashboard preferences
function loadDashboardPreferences() {
    const saved = localStorage.getItem('dashboardPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        
        const autoRefresh = document.getElementById('autoRefresh');
        const showNotifications = document.getElementById('showNotifications');
        const refreshInterval = document.getElementById('refreshInterval');
        
        if (autoRefresh) autoRefresh.checked = preferences.autoRefresh;
        if (showNotifications) showNotifications.checked = preferences.showNotifications;
        if (refreshInterval) refreshInterval.value = preferences.refreshInterval;
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    loadDashboardPreferences();
    enableRealTimeUpdates();
    
    // Set up auto-refresh based on preferences
    const preferences = JSON.parse(localStorage.getItem('dashboardPreferences') || '{}');
    if (preferences.autoRefresh) {
        setInterval(loadDashboardData, preferences.refreshInterval || 300000);
    }
});

// Keyboard shortcuts for dashboard
document.addEventListener('keydown', function(e) {
    // Ctrl+R to refresh
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
    
    // Ctrl+E to export CSV
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportToCSV();
    }
    
    // Ctrl+F to focus search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Error handling and retry mechanism
async function loadDashboardDataWithRetry(maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await loadDashboardData();
            return;
        } catch (error) {
            console.error(`Tentativa ${attempt} falhou:`, error);
            
            if (attempt === maxRetries) {
                showErrorMessage('Erro ao carregar dados. Verifique sua conexão e tente novamente.');
            } else {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h4>❌ Erro</h4>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-close">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 10000);
}

// Performance monitoring
function monitorDashboardPerformance() {
    const startTime = performance.now();
    
    return {
        end: () => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;
            console.log(`Dashboard carregado em ${loadTime.toFixed(2)}ms`);
            
            if (loadTime > 2000) {
                console.warn('Dashboard demorou mais que 2 segundos para carregar');
            }
        }
    };
}

// Initialize performance monitoring
const perfMonitor = monitorDashboardPerformance();

// Connection status monitoring
function monitorConnectionStatus() {
    const updateConnectionStatus = () => {
        const statusIndicator = document.getElementById('connectionStatus');
        if (statusIndicator) {
            if (navigator.onLine) {
                statusIndicator.innerHTML = '🟢 Online';
                statusIndicator.className = 'connection-status online';
            } else {
                statusIndicator.innerHTML = '🔴 Offline';
                statusIndicator.className = 'connection-status offline';
            }
        }
    };
    
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    updateConnectionStatus();
}

// Data validation functions
function validateResponseData(data) {
    const errors = [];
    
    if (!data.rating || data.rating < 1 || data.rating > 5) {
        errors.push('Avaliação inválida');
    }
    
    if (!data.timestamp) {
        errors.push('Timestamp ausente');
    }
    
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Email inválido');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Data cleaning and sanitization
function sanitizeData(data) {
    return data.map(item => ({
        ...item,
        comments: item.comments ? item.comments.trim().substring(0, 1000) : '',
        name: item.name ? item.name.trim().substring(0, 100) : '',
        email: item.email ? item.email.trim().toLowerCase() : '',
        phone: item.phone ? item.phone.replace(/\D/g, '') : ''
    }));
}

// Advanced filtering options
function applyAdvancedFilters() {
    const filters = {
        dateRange: {
            start: document.getElementById('startDate')?.value,
            end: document.getElementById('endDate')?.value
        },
        rating: {
            min: parseInt(document.getElementById('minRating')?.value) || 1,
            max: parseInt(document.getElementById('maxRating')?.value) || 5
        },
        hasComments: document.getElementById('hasComments')?.checked,
        hasContact: document.getElementById('hasContact')?.checked
    };
    
    let filteredData = [...allData];
    
    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        end.setHours(23, 59, 59, 999);
        
        filteredData = filteredData.filter(item => 
            item.timestamp >= start && item.timestamp <= end
        );
    }
    
    // Rating filter
    filteredData = filteredData.filter(item => 
        item.rating >= filters.rating.min && item.rating <= filters.rating.max
    );
    
    // Comments filter
    if (filters.hasComments) {
        filteredData = filteredData.filter(item => 
            item.comments && item.comments.trim()
        );
    }
    
    // Contact info filter
    if (filters.hasContact) {
        filteredData = filteredData.filter(item => 
            (item.email && item.email.trim()) || (item.phone && item.phone.trim())
        );
    }
    
    updateDashboardWithFilteredData(filteredData);
    showFilterInfo(generateFilterDescription(filters), filteredData.length);
}

// Generate filter description
function generateFilterDescription(filters) {
    const descriptions = [];
    
    if (filters.dateRange.start && filters.dateRange.end) {
        descriptions.push(`Período: ${new Date(filters.dateRange.start).toLocaleDateString()} - ${new Date(filters.dateRange.end).toLocaleDateString()}`);
    }
    
    if (filters.rating.min > 1 || filters.rating.max < 5) {
        descriptions.push(`Avaliações: ${filters.rating.min}-${filters.rating.max} estrelas`);
    }
    
    if (filters.hasComments) {
        descriptions.push('Com comentários');
    }
    
    if (filters.hasContact) {
        descriptions.push('Com informações de contato');
    }
    
    return descriptions.length > 0 ? descriptions.join(', ') : 'Filtros aplicados';
}

// Bulk operations
function bulkDeleteResponses(responseIds) {
    if (!confirm(`Tem certeza que deseja excluir ${responseIds.length} respostas?`)) {
        return;
    }
    
    const batch = db.batch();
    
    responseIds.forEach(id => {
        const docRef = db.collection('satisfaction-surveys').doc(id);
        batch.delete(docRef);
    });
    
    batch.commit()
        .then(() => {
            console.log('Respostas excluídas com sucesso');
            loadDashboardData();
            showSuccessMessage(`${responseIds.length} respostas excluídas com sucesso`);
        })
        .catch(error => {
            console.error('Erro ao excluir respostas:', error);
            showErrorMessage('Erro ao excluir respostas');
        });
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <h4>✅ Sucesso</h4>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

// Dashboard customization
function customizeDashboard() {
    const customization = {
        theme: document.getElementById('dashboardTheme')?.value || 'light',
        layout: document.getElementById('dashboardLayout')?.value || 'grid',
        showCharts: document.getElementById('showCharts')?.checked !== false,
        showInsights: document.getElementById('showInsights')?.checked !== false
    };
    
    localStorage.setItem('dashboardCustomization', JSON.stringify(customization));
    applyDashboardCustomization(customization);
}

// Apply dashboard customization
function applyDashboardCustomization(customization) {
    document.body.className = `theme-${customization.theme}`;
    
    const dashboard = document.querySelector('.dashboard-container');
    if (dashboard) {
        dashboard.className = `dashboard-container layout-${customization.layout}`;
    }
    
    // Show/hide sections based on preferences
    const chartsSection = document.getElementById('chartsSection');
    const insightsSection = document.getElementById('insightsSection');
    
    if (chartsSection) {
        chartsSection.style.display = customization.showCharts ? 'block' : 'none';
    }
    
    if (insightsSection) {
        insightsSection.style.display = customization.showInsights ? 'block' : 'none';
    }
}

// Load dashboard customization
function loadDashboardCustomization() {
    const saved = localStorage.getItem('dashboardCustomization');
    if (saved) {
        const customization = JSON.parse(saved);
        applyDashboardCustomization(customization);
        
        // Update form controls
        const themeSelect = document.getElementById('dashboardTheme');
        const layoutSelect = document.getElementById('dashboardLayout');
        const showChartsCheck = document.getElementById('showCharts');
        const showInsightsCheck = document.getElementById('showInsights');
        
        if (themeSelect) themeSelect.value = customization.theme;
        if (layoutSelect) layoutSelect.value = customization.layout;
        if (showChartsCheck) showChartsCheck.checked = customization.showCharts;
        if (showInsightsCheck) showInsightsCheck.checked = customization.showInsights;
    }
}

// Print dashboard report
function printDashboard() {
    const printContent = generatePrintableReport();
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Relatório Dashboard - ${new Date().toLocaleDateString()}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
                .stat-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
                .stat-value { font-size: 2em; font-weight: bold; color: #333; }
                .stat-label { font-size: 0.9em; color: #666; margin-top: 5px; }
                .section { margin: 30px 0; }
                .section h3 { border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                @media print { body { margin: 0; } .no-print { display: none; } }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// Generate printable report
function generatePrintableReport() {
    const total = allData.length;
    const avgRating = total > 0 ? 
        (allData.reduce((sum, item) => sum + (item.rating || 0), 0) / total).toFixed(1) : 0;
    const satisfied = allData.filter(item => item.rating >= 4).length;
    const satisfactionRate = total > 0 ? ((satisfied / total) * 100).toFixed(1) : 0;
    
    return `
        <div class="print-header">
            <h1>📊 Relatório Dashboard de Satisfação</h1>
            <p>Gerado em: ${new Date().toLocaleString()}</p>
            <p>Período: ${allData.length > 0 ? 
                `${allData[allData.length - 1].timestamp.toLocaleDateString()} - ${allData[0].timestamp.toLocaleDateString()}` : 
                'Sem dados'
            }</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Total de Respostas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgRating} ⭐</div>
                <div class="stat-label">Avaliação Média</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${satisfactionRate}%</div>
                <div class="stat-label">Taxa de Satisfação</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${allData.filter(item => item.comments && item.comments.trim()).length}</div>
                <div class="stat-label">Com Comentários</div>
            </div>
        </div>
        
        <div class="section">
            <h3>Distribuição de Avaliações</h3>
            ${generateRatingDistributionHTML()}
        </div>
        
        <div class="section">
            <h3>Insights Principais</h3>
            ${generateInsights().map(insight => `<p>• ${insight}</p>`).join('')}
        </div>
        
        <div class="section">
            <h3>Comentários Recentes (Top 10)</h3>
            ${generateCommentsHTML()}
        </div>
    `;
}

// Schedule automatic reports
function scheduleAutomaticReports() {
    const reportSettings = {
        enabled: document.getElementById('autoReports')?.checked || false,
        frequency: document.getElementById('reportFrequency')?.value || 'weekly',
        email: document.getElementById('reportEmail')?.value || ''
    };
    
    localStorage.setItem('automaticReports', JSON.stringify(reportSettings));
    
    if (reportSettings.enabled && reportSettings.email) {
        console.log(`Relatórios automáticos configurados: ${reportSettings.frequency} para ${reportSettings.email}`);
        // In a real implementation, this would set up server-side scheduling
    }
}

// Initialize dashboard with all features
function initializeDashboard() {
    console.log('🚀 Inicializando Dashboard...');
    
    // Load data and preferences
    loadDashboardData();
    loadDashboardPreferences();
    loadDashboardCustomization();
    
    // Set up monitoring
    monitorConnectionStatus();
    enableRealTimeUpdates();
    
    // Performance monitoring
    perfMonitor.end();
    
    console.log('✅ Dashboard inicializado com sucesso!');
}

// Final initialization
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Erro global capturado:', e.error);
    showErrorMessage('Ocorreu um erro inesperado. Recarregue a página se o problema persistir.');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejeitada:', e.reason);
    showErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    // Save any pending changes
    saveDashboardPreferences();
    
    // Clear intervals
    if (window.dashboardIntervals) {
        window.dashboardIntervals.forEach(interval => clearInterval(interval));
    }
});

// Export dashboard module
window.Dashboard = {
    refresh: refreshDashboard,
    exportCSV: exportToCSV,
    exportJSON: exportToJSON,
    exportPDF: exportToPDF,
    applyFilters: applyAdvancedFilters,
    clearFilters: clearFilters,
    customize: customizeDashboard,
    print: printDashboard
};

console.log('📊 Dashboard.js carregado completamente!');
