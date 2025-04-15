// Константы для идентификации событий
const JSON_UTILS_IDS = {
    SAVE_BTN: 'saveJsonBtn',
    LOAD_BTN: 'loadJsonBtn',
    INPUT_FILE: 'jsonFileInput',
    PROCESS_DATA: 'processLoadedData',
    SAVE_DATA: 'saveJsonData'
};

// Инициализация модуля
function initJsonUtils() {
    console.log('JSON utils module initialized');
    
    // Находим кнопки и элементы управления
    const saveJsonBtn = document.getElementById(JSON_UTILS_IDS.SAVE_BTN);
    const loadJsonBtn = document.getElementById(JSON_UTILS_IDS.LOAD_BTN);
    const jsonFileInput = document.getElementById(JSON_UTILS_IDS.INPUT_FILE);
    
    if (!saveJsonBtn || !loadJsonBtn || !jsonFileInput) {
        console.error('Не удалось найти необходимые элементы для работы с JSON');
        return;
    }
    
    // Устанавливаем флаг для отслеживания активной операции
    let isOperationInProgress = false;

    // Добавляем обработчики событий
    saveJsonBtn.addEventListener('click', function(event) {
        // Предотвращаем двойное срабатывание
        event.preventDefault();
        event.stopPropagation();
        
        if (isOperationInProgress) return;
        
        isOperationInProgress = true;
        saveJsonData().finally(() => {
            // Сбрасываем флаг после завершения операции
            setTimeout(() => {
                isOperationInProgress = false;
            }, 500);
        });
    });
    
    loadJsonBtn.addEventListener('click', function(event) {
        // Предотвращаем двойное срабатывание
        event.preventDefault();
        event.stopPropagation();
        
        if (isOperationInProgress) return;
        
        isOperationInProgress = true;
        
        // Сбрасываем значение поля выбора файла для триггера события change даже при выборе того же файла
        jsonFileInput.value = '';
        jsonFileInput.click();
    });
    
    jsonFileInput.addEventListener('change', function(event) {
        if (this.files.length === 0) {
            isOperationInProgress = false;
            return;
        }
        
        const file = this.files[0];
        
        if (!file.name.endsWith('.json')) {
            alert('Выбран некорректный тип файла. Пожалуйста, выберите JSON файл.');
            isOperationInProgress = false;
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                processLoadedData(data)
                    .finally(() => {
                        // Сбрасываем флаг после завершения операции
                        setTimeout(() => {
                            isOperationInProgress = false;
                        }, 500);
                    });
            } catch (error) {
                console.error('Ошибка при чтении файла JSON:', error);
                alert('Ошибка при чтении файла. Пожалуйста, проверьте формат файла.');
                isOperationInProgress = false;
            }
        };
        
        reader.onerror = function() {
            console.error('Ошибка при чтении файла');
            alert('Произошла ошибка при чтении файла.');
            isOperationInProgress = false;
        };
        
        reader.readAsText(file);
    });
}

// Функция для сохранения JSON
async function saveJsonData() {
    try {
        if (!window.brands || !Array.isArray(window.brands) || window.brands.length === 0) {
            alert('Нет данных для сохранения.');
            return false;
        }
        
        // Создаем объект для сохранения
        const dataToSave = {
            brands: window.brands,
            timestamp: Date.now(),
            version: '1.0.0'
        };
        
        // Преобразуем в JSON
        const jsonString = JSON.stringify(dataToSave, null, 2);
        
        // Создаем объект Blob
        const blob = new Blob([jsonString], {type: 'application/json'});
        
        // Создаем временную ссылку и инициируем скачивание
        const now = new Date();
        const fileName = `brandbook-${now.toISOString().slice(0, 10)}.json`;
        
        // Используем современный API File System Access API, если он доступен
        if ('showSaveFilePicker' in window) {
            try {
                const opts = {
                    types: [{
                        description: 'JSON Files',
                        accept: {'application/json': ['.json']}
                    }],
                    suggestedName: fileName
                };
                
                const fileHandle = await window.showSaveFilePicker(opts);
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
                
                console.log('Data saved successfully using File System Access API');
                return true;
            } catch (err) {
                // Если пользователь отменил выбор файла или API недоступен, используем fallback
                console.warn('File System Access API недоступен или операция отменена, используем fallback', err);
            }
        }
        
        // Fallback для старых браузеров
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        
        // Добавляем ссылку в DOM и имитируем клик
        document.body.appendChild(link);
        link.click();
        
        // Удаляем ссылку из DOM и освобождаем объект URL
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            console.log('Data saved successfully using fallback method');
        }, 100);
        
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении JSON:', error);
        alert('Произошла ошибка при сохранении файла.');
        return false;
    }
}

// Обработка данных после загрузки JSON
async function processLoadedData(data) {
    try {
        // Проверяем структуру загруженных данных
        if (!data || !data.brands || !Array.isArray(data.brands)) {
            alert('Некорректный формат загруженного файла. Отсутствуют данные о брендах.');
            return false;
        }
        
        // Проверяем наличие функции renderBrands
        if (typeof window.renderBrands !== 'function') {
            console.error('Функция renderBrands не найдена');
            alert('Ошибка: функция renderBrands не найдена. Проверьте консоль для дополнительных сведений.');
            return false;
        }
        
        // Если текущие данные не пусты, спрашиваем о замене или объединении
        if (window.brands && window.brands.length > 0) {
            const action = confirm(
                'Обнаружены существующие бренды. Выберите действие:\n\n' +
                'OK - Заменить существующие данные\n' +
                'Отмена - Объединить с существующими данными'
            );
            
            if (action) {
                // Пользователь выбрал "Заменить"
                window.brands = data.brands;
            } else {
                // Пользователь выбрал "Объединить"
                // Объединяем данные, избегая дубликатов по ID
                const existingIds = new Set(window.brands.map(brand => brand.id));
                
                data.brands.forEach(newBrand => {
                    if (!existingIds.has(newBrand.id)) {
                        window.brands.push(newBrand);
                        existingIds.add(newBrand.id);
                    } else {
                        // Если ID совпадают, автоматически обновляем существующий бренд
                        const existingBrandIndex = window.brands.findIndex(b => b.id === newBrand.id);
                        window.brands[existingBrandIndex] = newBrand;
                    }
                });
            }
        } else {
            // Если текущих данных нет, просто устанавливаем новые
            window.brands = data.brands;
        }
        
        // Обеспечиваем наличие необходимых секций и описаний
        for (let i = 0; i < window.brands.length; i++) {
            const brand = window.brands[i];
            
            if (!brand.sections) {
                brand.sections = {};
            }
            
            // Проверяем все необходимые секции
            const requiredSections = [
                "brandDescription", 
                "communicationTone", 
                "logos", 
                "colors", 
                "typography", 
                "elements"
            ];
            
            requiredSections.forEach(sectionName => {
                if (!brand.sections[sectionName]) {
                    brand.sections[sectionName] = { description: "" };
                }
                
                // Дополнительные проверки для секций со сложной структурой
                if (sectionName === "logos" && !brand.sections.logos.items) {
                    brand.sections.logos.items = [];
                } 
                else if (sectionName === "colors") {
                    if (!brand.sections.colors.primary) brand.sections.colors.primary = [];
                    if (!brand.sections.colors.paired) brand.sections.colors.paired = [];
                    if (!brand.sections.colors.palettes) brand.sections.colors.palettes = [];
                } 
                else if (sectionName === "typography") {
                    if (!brand.sections.typography.fonts) brand.sections.typography.fonts = [];
                    if (!brand.sections.typography.styleSets) brand.sections.typography.styleSets = [];
                } 
                else if (sectionName === "elements") {
                    if (!brand.sections.elements.items) brand.sections.elements.items = [];
                }
            });
        }
        
        // Рендерим бренды
        window.renderBrands();
        
        // После загрузки данных, нам нужно обновить интерфейс для каждого бренда
        window.brands.forEach(brand => {
            // Проверяем и обновляем шрифты, если они есть
            if (brand.sections && brand.sections.typography && brand.sections.typography.fonts && 
                brand.sections.typography.fonts.length > 0) {
                // Находим DOM-элемент для бренда
                const brandItem = document.querySelector(`.brand-item[data-id="${brand.id}"]`);
                if (brandItem && window.updateFontsList) {
                    window.updateFontsList(brand);
                }
            }
        });
        
        // После рендеринга разворачиваем первый бренд и его секции для отображения всех элементов
        setTimeout(() => {
            const firstBrandItem = document.querySelector('.brand-item');
            if (firstBrandItem) {
                // Разворачиваем бренд
                const toggleBrand = firstBrandItem.querySelector('.toggle-section');
                if (toggleBrand) {
                    toggleBrand.click();
                    
                    // Разворачиваем все секции этого бренда через небольшую задержку
                    setTimeout(() => {
                        const sections = firstBrandItem.querySelectorAll('.section-item .section-header');
                        sections.forEach(section => {
                            section.click();
                        });
                        
                        // Настраиваем обработчики для загруженных элементов
                        if (typeof window.setupLoadedElementsHandlers === 'function') {
                            const brandId = parseInt(firstBrandItem.dataset.id, 10);
                            const brand = window.brands.find(b => b.id === brandId);
                            if (brand) {
                                window.setupLoadedElementsHandlers(firstBrandItem, brand);
                            }
                        }
                    }, 300);
                }
            }
        }, 300);
        
        return true;
    } catch (error) {
        console.error('Ошибка при обработке загруженных данных:', error);
        alert('Произошла ошибка при обработке файла: ' + error.message);
        return false;
    }
}

// Экспортируем функции в глобальный контекст
window.saveJsonData = saveJsonData;
window.processLoadedData = processLoadedData;

// Инициализация модуля при загрузке документа
document.addEventListener('DOMContentLoaded', initJsonUtils);
