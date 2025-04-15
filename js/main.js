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
    
    // Проверяем наличие необходимых модулей
    ensureModalsExist();
    
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
    if (typeof window.initTypography === 'function') {
        window.initTypography();
    }
    
    if (typeof window.initElements === 'function') {
        window.initElements();
    }
    
    if (typeof window.renderBrands === 'function') {
        // Проверяем, есть ли бренды для отображения
        if (window.brands && window.brands.length > 0) {
            window.renderBrands();
        }
    }
}

// Функция для проверки наличия и создания модальных окон при необходимости
function ensureModalsExist() {
    // Проверяем наличие модальных окон и создаем их, если они отсутствуют
    const requiredModals = [
        {
            id: 'addStyleSetModal',
            title: 'Добавить набор стилей',
            formId: 'addStyleForm',
            formContent: `
                <div class="mb-3">
                    <label for="styleSetName" class="form-label">Название набора стилей шрифтов</label>
                    <input type="text" class="form-control" id="styleSetName" placeholder="Введите название набора" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Сохранить</button>
            `
        },
        {
            id: 'addElementModal',
            title: 'Добавить графический элемент',
            formId: 'addGraphicElementForm',
            formContent: `
                <div class="mb-3">
                    <label for="elementType" class="form-label">Тип элемента</label>
                    <input type="text" class="form-control" id="elementType" required placeholder="Например: Иконка, Иллюстрация, Текстура...">
                </div>
                
                <div class="mb-3">
                    <label for="elementFile" class="form-label">Выберите файл</label>
                    <input type="file" class="form-control" id="elementFile" accept=".png,.svg,.jpg,.jpeg" required>
                    <small class="text-muted">Допустимые форматы: SVG, PNG, JPG</small>
                </div>
                
                <div class="mb-3">
                    <label for="elementTags" class="form-label">Теги</label>
                    <input type="text" class="form-control" id="elementTags" placeholder="Введите теги через запятую" required>
                    <small class="text-muted">Теги помогут организовать элементы.</small>
                </div>
                
                <div class="mb-3">
                    <label for="elementDescription" class="form-label">Описание элемента</label>
                    <textarea class="form-control" id="elementDescription" rows="3" maxlength="500" placeholder="Где и как используется (до 500 символов)"></textarea>
                    <small class="text-muted"><span id="descriptionChars">0</span>/500 символов</small>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Предпросмотр</label>
                    <div id="elementPreview" class="element-preview border rounded p-3 text-center">
                        <p class="text-muted mb-0">Изображение будет показано здесь после выбора файла</p>
                    </div>
                </div>
                
                
            `
        }
    ];
    
    requiredModals.forEach(modal => {
        if (!document.getElementById(modal.id)) {
            console.log(`Creating missing modal: ${modal.id}`);
            
            // Create modal HTML
            const modalHtml = `
            <div class="modal fade" id="${modal.id}" tabindex="-1" aria-labelledby="${modal.id}Label" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${modal.id}Label">${modal.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                        </div>
                        <div class="modal-body">
                            <form id="${modal.formId}">
                                ${modal.formContent}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            // Append modal to body
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
    });
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
window.ensureModalsExist = ensureModalsExist;
