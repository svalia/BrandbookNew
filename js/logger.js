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

// Функция для отслеживания состояния массива брендов
function trackBrandsState() {
    const currentState = window.brands ? JSON.parse(JSON.stringify(window.brands)) : [];
    
    if (!window.previousBrandsState) {
        window.previousBrandsState = currentState;
        return { changed: false, added: 0, removed: 0 };
    }
    
    const previousIds = new Set(window.previousBrandsState.map(brand => brand.id));
    const currentIds = new Set(currentState.map(brand => brand.id));
    
    // Находим добавленные ID
    const addedIds = [...currentIds].filter(id => !previousIds.has(id));
    
    // Находим удаленные ID
    const removedIds = [...previousIds].filter(id => !currentIds.has(id));
    
    // Обновляем сохраненное состояние
    window.previousBrandsState = currentState;
    
    return {
        changed: addedIds.length > 0 || removedIds.length > 0,
        added: addedIds.length,
        removed: removedIds.length,
        addedIds,
        removedIds,
        currentCount: currentState.length
    };
}

// Расширяем функцию логирования для отслеживания изменений в массиве брендов
function enhancedLogAction(elementId, actionType, details = null) {
    // Вызываем обычное логирование
    const logMessage = logAction(elementId, actionType, details);
    
    // Проверяем изменения в массиве брендов только для определенных действий
    if (['click', 'submit', 'info', 'change'].includes(actionType)) {
        const changes = trackBrandsState();
        
        if (changes.changed) {
            logAction('brands-state-track', 'info', {
                action: 'Brands array changed',
                added: changes.added,
                removed: changes.removed,
                addedIds: changes.addedIds,
                removedIds: changes.removedIds,
                currentCount: changes.currentCount
            });
        }
    }
    
    return logMessage;
}

// Переопределяем функцию логирования
const originalLogAction = window.logAction;
window.logAction = enhancedLogAction;

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
window.logAction = enhancedLogAction;
window.getLogs = getLogs;
window.clearLogs = clearLogs;
window.exportLogs = exportLogs;
window.EVENT_TYPES = EVENT_TYPES;
