// Модуль для логирования действий пользователя

// Тип события
const EVENT_TYPES = {
    CLICK: 'click',
    SHOW: 'show',
    HIDE: 'hide',
    LOAD: 'load',
    SAVE: 'save',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Функция для логирования действий
function logAction(elementId, actionType, details = null) {
    const timestamp = new Date().toISOString();
    const logMessage = {
        timestamp,
        elementId,
        actionType,
        details
    };
    
    // Выводим в консоль структурированный лог
    console.log(`[LOG] ${elementId} - ${actionType}`, details ? details : '');
    
    // Также сохраняем в массив логов для возможного экспорта или отправки
    if (!window.appLogs) window.appLogs = [];
    window.appLogs.push(logMessage);
    
    return logMessage;
}

// Функция для получения всех логов
function getLogs() {
    return window.appLogs || [];
}

// Функция для очистки логов
function clearLogs() {
    window.appLogs = [];
    console.log('[LOG] Logs cleared');
}

// Функция для экспорта логов в JSON
function exportLogs() {
    const logs = getLogs();
    const jsonString = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandbook-logs-${new Date().toISOString().replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    console.log('[LOG] Logs exported');
}

// Добавляем обработчик ошибок для логирования
window.addEventListener('error', function(e) {
    logAction('window', EVENT_TYPES.ERROR, {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error ? e.error.stack : null
    });
});

// Экспортируем функции
window.logAction = logAction;
window.getLogs = getLogs;
window.clearLogs = clearLogs;
window.exportLogs = exportLogs;
window.EVENT_TYPES = EVENT_TYPES;
