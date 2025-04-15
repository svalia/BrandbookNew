// Главный скрипт приложения

// Глобальный массив для хранения данных о брендах
window.brands = window.brands || [];

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    // Инициализируем компоненты приложения
    initApp();
});

// Функция инициализации приложения
function initApp() {
    // Находим основные элементы интерфейса
    window.brandsList = document.getElementById('brandsList');
    const addBrandForm = document.getElementById('addBrandForm');
    const addBrandButton = document.querySelector('[data-bs-target="#addBrandModal"]');
    const saveJsonBtn = document.getElementById('saveJsonBtn');
    const loadJsonBtn = document.getElementById('loadJsonBtn');
    const jsonFileInput = document.getElementById('jsonFileInput');
    
    // Добавляем обработчики для кнопок JSON, если модуль json-utils.js еще не инициализировал их
    if (saveJsonBtn && typeof window.saveToJson === 'function') {
        saveJsonBtn.addEventListener('click', function() {
            window.saveToJson();
        });
    }
    
    if (loadJsonBtn && jsonFileInput && typeof window.loadFromJson === 'function') {
        loadJsonBtn.addEventListener('click', function() {
            jsonFileInput.click();
        });
        
        jsonFileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                window.loadFromJson(e.target.files[0])
                    .then(data => {
                        const success = window.processLoadedData(data);
                        if (success) {
                            alert('Данные успешно загружены');
                        }
                        // Сбрасываем значение для возможности выбора того же файла повторно
                        jsonFileInput.value = '';
                    })
                    .catch(error => {
                        alert(error);
                        jsonFileInput.value = '';
                    });
            }
        });
    }
    
    if (!window.brandsList) {
        console.error('Элемент списка брендов не найден');
        return;
    }
    
    // Настраиваем обработчик формы добавления бренда
    if (addBrandForm) {
        // Удаляем все существующие обработчики
        const newForm = addBrandForm.cloneNode(true);
        addBrandForm.parentNode.replaceChild(newForm, addBrandForm);
        
        // Добавляем новый обработчик
        newForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Форма добавления бренда отправлена');
            
            const brandName = document.getElementById('brandName').value.trim();
            if (!brandName) {
                alert('Пожалуйста, введите название бренда');
                return;
            }
            
            // Создаем новый бренд со всеми необходимыми секциями
            const newBrand = {
                id: Date.now(),
                name: brandName,
                sections: {
                    brandDescription: {
                        description: ''
                    },
                    communicationTone: {
                        description: ''
                    },
                    logos: {
                        description: '',
                        items: []
                    },
                    colors: {
                        description: '',
                        primary: [],
                        paired: [],
                        palettes: []
                    },
                    typography: {
                        description: '',
                        fonts: [],
                        styleSets: []
                    },
                    elements: {
                        description: '',
                        items: []
                    }
                }
            };
            
            console.log('Создан новый бренд:', newBrand);
            
            // Добавляем бренд в массив 
            window.brands.push(newBrand);
            
            // Обновляем интерфейс
            if (typeof window.renderBrands === 'function') {
                console.log('Запускаем рендеринг брендов');
                window.renderBrands();
                
                // Сбрасываем форму
                newForm.reset();
                
                // Закрываем модальное окно
                const modal = bootstrap.Modal.getInstance(document.getElementById('addBrandModal'));
                if (modal) {
                    modal.hide();
                    
                    // Решаем проблему с backdrop
                    setTimeout(() => {
                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) {
                            backdrop.remove();
                        }
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }, 300);
                }
            } else {
                console.error('Функция renderBrands не найдена');
            }
        });
    }
    
    // Настраиваем подсказки в модальном окне логотипа
    const hintToggle = document.getElementById('hintToggle');
    const hintContent = document.getElementById('hintContent');
    
    if (hintToggle && hintContent) {
        hintToggle.addEventListener('click', function() {
            const toggleIcon = hintToggle.querySelector('.toggle-icon');
            hintContent.classList.toggle('show');
            if (toggleIcon) {
                toggleIcon.classList.toggle('collapsed');
            }
        });
    }
    
    // Рендерим бренды при запуске
    if (typeof window.renderBrands === 'function') {
        window.renderBrands();
    } else {
        // Если функция renderBrands еще не доступна, пробуем загрузить её и повторить
        console.warn('Функция renderBrands не найдена, ждем загрузки brands.js');
        setTimeout(() => {
            if (typeof window.renderBrands === 'function') {
                window.renderBrands();
            } else {
                console.error('Функция renderBrands так и не была найдена');
            }
        }, 500);
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
