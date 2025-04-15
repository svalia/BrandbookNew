// Главный скрипт приложения

// Глобальный массив для хранения данных о брендах
window.brands = window.brands || [];

// Глобальные константы
const EVENT_TYPES = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
};

// Обработчик ошибок
function handleError(error, source) {
    console.error(`Ошибка в ${source}:`, error);
    alert(`Произошла ошибка: ${error.message}`);
}

// Обработчик загрузки документа
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    try {
        // Глобальный обработчик ошибок
        window.addEventListener('error', function(event) {
            console.error('Глобальная ошибка:', event.message, 'в', event.filename, 'строка', event.lineno);
        });
        
        // Инициализируем приложение
        initApp();
    } catch (e) {
        handleError(e, 'main.js:DOMContentLoaded');
    }
});

// Функция инициализации приложения
function initApp() {
    console.log('Инициализация приложения');
    
    // Поиск основных элементов
    window.brandsList = document.getElementById('brandsList');
    const addBrandForm = document.getElementById('addBrandForm');
    const saveJsonBtn = document.getElementById('saveJsonBtn');
    const loadJsonBtn = document.getElementById('loadJsonBtn');
    
    // Проверка наличия основных элементов
    if (!window.brandsList) {
        console.error('Элемент brandsList не найден');
    }
    
    // Проверяем наличие необходимых функций
    const requiredFunctions = [
        { name: 'renderBrands', context: window },
        { name: 'initBrands', context: window },
        { name: 'saveJsonData', context: window },
        { name: 'processLoadedData', context: window }
    ];
    
    let missingFunctions = [];
    requiredFunctions.forEach(func => {
        if (typeof func.context[func.name] !== 'function') {
            missingFunctions.push(func.name);
        }
    });
    
    if (missingFunctions.length > 0) {
        console.warn('Не найдены необходимые функции:', missingFunctions);
    }
    
    // Инициализация модулей
    if (typeof window.renderBrands === 'function') {
        // Проверяем, есть ли бренды для отображения
        if (window.brands && window.brands.length > 0) {
            window.renderBrands();
        }
    }
}

// Глобальная функция для очистки модальных окон
window.cleanupModal = function(modalId) {
    setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 300);
};

// Экспортируем в глобальный контекст
window.EVENT_TYPES = EVENT_TYPES;
