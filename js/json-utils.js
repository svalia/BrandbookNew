// Модуль для работы с сохранением и загрузкой JSON

// Идентификаторы элементов для логирования
const JSON_UTILS_IDS = {
    SAVE_JSON: 'json-saveJson',
    LOAD_JSON: 'json-loadJson',
    PROCESS_DATA: 'json-processData',
    ENSURE_SECTIONS: 'json-ensureSections',
    SAVE_BUTTON: 'json-saveButton',
    LOAD_BUTTON: 'json-loadButton',
    FILE_INPUT: 'json-fileInput'
};

// Функция для генерации имени файла для сохранения
function generateJsonFilename() {
    // Получаем список брендов
    const brands = window.brands || [];
    
    // Формируем часть имени из брендов
    let brandsPart = 'brandbook';
    if (brands.length > 0) {
        brandsPart = brands.map(brand => brand.name.replace(/\s+/g, '_')).join('-');
    }
    
    // Получаем текущую дату и время
    const now = new Date();
    const datePart = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0')
    ].join('');
    
    // Формируем имя файла
    return `${brandsPart}-${datePart}`;
}

// Функция для обеспечения наличия секций и описаний
function ensureSectionsAndDescriptions() {
    if (window.logAction) {
        window.logAction(JSON_UTILS_IDS.ENSURE_SECTIONS, window.EVENT_TYPES?.INFO || 'info', 'Ensuring sections and descriptions');
    }
    
    // Проверяем, есть ли данные для сохранения
    if (!window.brands || window.brands.length === 0) {
        return;
    }
    
    // Проходим по каждому бренду
    window.brands.forEach(brand => {
        // Проверяем, есть ли у бренда секции
        if (!brand.sections) {
            brand.sections = {};
        }
        
        // Секции, которые должны быть у каждого бренда
        const requiredSections = [
            "brandDescription", 
            "communicationTone", 
            "logos", 
            "colors", 
            "typography", 
            "elements"
        ];
        
        // Проверяем и создаем каждую секцию
        requiredSections.forEach(sectionName => {
            // Создаем секцию, если она отсутствует
            if (!brand.sections[sectionName]) {
                brand.sections[sectionName] = { 
                    description: "" 
                };
            }
            
            // Добавляем поле description, если его нет
            if (!brand.sections[sectionName].hasOwnProperty('description')) {
                brand.sections[sectionName].description = "";
            }
            
            // Собираем описания секций с DOM
            const brandItem = document.querySelector(`.brand-item[data-id="${brand.id}"]`);
            if (brandItem) {
                const sectionItem = brandItem.querySelector(`.section-item[data-section="${sectionName}"]`);
                if (sectionItem) {
                    const descriptionContent = sectionItem.querySelector('.description-content');
                    if (descriptionContent) {
                        brand.sections[sectionName].description = descriptionContent.innerHTML;
                    }
                }
            }
            
            // Инициализируем необходимые коллекции
            switch (sectionName) {
                case "logos":
                    if (!brand.sections.logos.items) brand.sections.logos.items = [];
                    break;
                case "colors":
                    if (!brand.sections.colors.primary) brand.sections.colors.primary = [];
                    if (!brand.sections.colors.paired) brand.sections.colors.paired = [];
                    if (!brand.sections.colors.palettes) brand.sections.colors.palettes = [];
                    break;
                case "typography":
                    if (!brand.sections.typography.fonts) brand.sections.typography.fonts = [];
                    if (!brand.sections.typography.styleSets) brand.sections.typography.styleSets = [];
                    break;
                case "elements":
                    if (!brand.sections.elements.items) brand.sections.elements.items = [];
                    break;
            }
        });
    });
}

// Функция для сохранения данных в JSON
function saveToJson() {
    if (window.logAction) {
        window.logAction(JSON_UTILS_IDS.SAVE_JSON, window.EVENT_TYPES?.INFO || 'info', 'Starting JSON save process');
    }
    
    // Проверяем, есть ли данные для сохранения
    if (!window.brands || window.brands.length === 0) {
        alert('Нет данных для сохранения. Добавьте хотя бы один бренд.');
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.SAVE_JSON, window.EVENT_TYPES?.WARNING || 'warning', 'No brands to save');
        }
        return;
    }
    
    try {
        // Собираем описания из DOM перед сохранением
        ensureSectionsAndDescriptions();
        
        // Формируем объект для сохранения
        const dataToSave = {
            brands: window.brands
        };
        
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.SAVE_JSON, window.EVENT_TYPES?.INFO || 'info', {
                action: 'Data prepared for save',
                brandCount: window.brands.length
            });
        }
        
        // Преобразуем в строку JSON
        const jsonString = JSON.stringify(dataToSave, null, 2);
        
        // Создаем Blob для сохранения
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Генерируем имя файла
        const filename = generateJsonFilename() + '.json';
        
        // Создаем ссылку для скачивания
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;
        
        // Добавляем ссылку в документ и кликаем по ней
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Удаляем ссылку
        document.body.removeChild(downloadLink);
        
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.SAVE_JSON, window.EVENT_TYPES?.INFO || 'info', {
                action: 'JSON file saved',
                filename: filename,
                size: (blob.size / 1024).toFixed(2) + ' KB'
            });
        }
        
        alert(`Данные успешно сохранены в файл "${filename}"`);
    } catch (error) {
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.SAVE_JSON, window.EVENT_TYPES?.ERROR || 'error', {
                action: 'Error saving JSON',
                error: error.message,
                stack: error.stack
            });
        }
        console.error('Ошибка при сохранении JSON:', error);
        alert('Ошибка при сохранении данных. Пожалуйста, попробуйте снова.');
    }
}

// Функция для загрузки данных из JSON
function loadFromJson(file) {
    if (window.logAction) {
        window.logAction(JSON_UTILS_IDS.LOAD_JSON, window.EVENT_TYPES?.INFO || 'info', {
            action: 'Loading JSON',
            filename: file?.name,
            size: file ? (file.size / 1024).toFixed(2) + ' KB' : 'unknown'
        });
    }
    
    return new Promise((resolve, reject) => {
        if (!file) {
            if (window.logAction) {
                window.logAction(JSON_UTILS_IDS.LOAD_JSON, window.EVENT_TYPES?.WARNING || 'warning', 'No file selected');
            }
            reject('Файл не выбран');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                if (window.logAction) {
                    window.logAction(JSON_UTILS_IDS.LOAD_JSON, window.EVENT_TYPES?.INFO || 'info', {
                        action: 'JSON parsed successfully',
                        brandCount: jsonData?.brands?.length || 0
                    });
                }
                resolve(jsonData);
            } catch (error) {
                if (window.logAction) {
                    window.logAction(JSON_UTILS_IDS.LOAD_JSON, window.EVENT_TYPES?.ERROR || 'error', {
                        action: 'Error parsing JSON',
                        error: error.message
                    });
                }
                console.error('Ошибка при парсинге JSON:', error);
                reject('Ошибка при чтении файла. Проверьте формат JSON.');
            }
        };
        
        reader.onerror = function() {
            if (window.logAction) {
                window.logAction(JSON_UTILS_IDS.LOAD_JSON, window.EVENT_TYPES?.ERROR || 'error', 'File reading error');
            }
            console.error('Ошибка чтения файла');
            reject('Ошибка при чтении файла.');
        };
        
        reader.readAsText(file);
    });
}

// Функция для обработки загруженных данных
function processLoadedData(data) {
    if (window.logAction) {
        window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.INFO || 'info', 'Processing loaded data');
    }
    
    // Проверяем структуру загруженных данных
    if (!data || !data.brands || !Array.isArray(data.brands)) {
        alert('Некорректный формат загруженного файла. Отсутствуют данные о брендах.');
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.WARNING || 'warning', 'Invalid data format');
        }
        return false;
    }
    
    try {
        // Если текущие данные не пусты, спрашиваем о замене
        if (window.brands && window.brands.length > 0) {
            if (window.logAction) {
                window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.INFO || 'info', 'Existing brands found, asking for confirmation');
            }
            const confirm = window.confirm('Загруженные данные заменят текущие. Продолжить?');
            if (!confirm) {
                if (window.logAction) {
                    window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.INFO || 'info', 'User cancelled data replacement');
                }
                return false;
            }
        }
        
        // Обеспечиваем наличие необходимых секций и описаний
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.INFO || 'info', 'Validating and fixing loaded data structure');
        }
        
        data.brands.forEach(brand => {
            if (!brand.sections) brand.sections = {};
            
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
                
                if (!brand.sections[sectionName].hasOwnProperty('description')) {
                    brand.sections[sectionName].description = "";
                }
                
                switch (sectionName) {
                    case "logos":
                        if (!brand.sections.logos.items) brand.sections.logos.items = [];
                        break;
                    case "colors":
                        if (!brand.sections.colors.primary) brand.sections.colors.primary = [];
                        if (!brand.sections.colors.paired) brand.sections.colors.paired = [];
                        if (!brand.sections.colors.palettes) brand.sections.colors.palettes = [];
                        break;
                    case "typography":
                        if (!brand.sections.typography.fonts) brand.sections.typography.fonts = [];
                        if (!brand.sections.typography.styleSets) brand.sections.typography.styleSets = [];
                        break;
                    case "elements":
                        if (!brand.sections.elements.items) brand.sections.elements.items = [];
                        break;
                }
            });
        });
        
        // Обновляем глобальные данные
        window.brands = data.brands;
        
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.INFO || 'info', {
                action: 'Data processed successfully',
                brandCount: data.brands.length
            });
        }
        
        // Перерендериваем интерфейс
        if (typeof window.renderBrands === 'function') {
            if (window.logAction) {
                window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.INFO || 'info', 'Rendering updated brands');
            }
            window.renderBrands();
            
            // После рендеринга разворачиваем первый бренд
            setTimeout(() => {
                const firstBrandItem = document.querySelector('.brand-item');
                if (firstBrandItem) {
                    const toggleSection = firstBrandItem.querySelector('.toggle-section');
                    if (toggleSection) {
                        if (window.logAction) {
                            window.logAction('first-brand-toggle', window.EVENT_TYPES?.CLICK || 'click', 'Auto-expanding first brand');
                        }
                        toggleSection.click();
                    }
                }
            }, 100);
        } else {
            if (window.logAction) {
                window.logAction('renderBrands', window.EVENT_TYPES?.ERROR || 'error', 'Function not found');
            }
            console.error('Функция renderBrands не найдена');
            alert('Ошибка при обновлении интерфейса. Пожалуйста, обновите страницу.');
            return false;
        }
        
        return true;
    } catch (error) {
        if (window.logAction) {
            window.logAction(JSON_UTILS_IDS.PROCESS_DATA, window.EVENT_TYPES?.ERROR || 'error', {
                action: 'Error processing data',
                error: error.message,
                stack: error.stack
            });
        }
        console.error('Ошибка при обработке загруженных данных:', error);
        alert('Ошибка при обработке загруженных данных.');
        return false;
    }
}

// Инициализация обработчиков событий для кнопок
function initJsonUtils() {
    const saveButton = document.getElementById('saveJsonBtn');
    const loadButton = document.getElementById('loadJsonBtn');
    const fileInput = document.getElementById('jsonFileInput');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            if (window.logAction) {
                window.logAction('saveJsonBtn', window.EVENT_TYPES?.CLICK || 'click', 'Save button clicked');
            }
            saveToJson();
        });
    } else {
        console.warn('Кнопка сохранения JSON не найдена');
    }
    
    if (loadButton && fileInput) {
        loadButton.addEventListener('click', function() {
            if (window.logAction) {
                window.logAction('loadJsonBtn', window.EVENT_TYPES?.CLICK || 'click', 'Load button clicked');
            }
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                if (window.logAction) {
                    window.logAction('jsonFileInput', window.EVENT_TYPES?.CHANGE || 'change', {
                        action: 'File selected',
                        filename: e.target.files[0].name
                    });
                }
                
                loadFromJson(e.target.files[0])
                    .then(data => {
                        const success = processLoadedData(data);
                        if (success) {
                            if (window.logAction) {
                                window.logAction(JSON_UTILS_IDS.LOAD_JSON, window.EVENT_TYPES?.INFO || 'info', 'Data loaded successfully');
                            }
                            alert('Данные успешно загружены');
                        }
                        // Сбрасываем значение для возможности выбора того же файла повторно
                        fileInput.value = '';
                    })
                    .catch(error => {
                        if (window.logAction) {
                            window.logAction(JSON_UTILS_IDS.LOAD_JSON, window.EVENT_TYPES?.ERROR || 'error', {
                                action: 'Error loading file',
                                error: error
                            });
                        }
                        alert(error);
                        fileInput.value = '';
                    });
            }
        });
    } else {
        console.warn('Кнопка загрузки JSON или элемент выбора файла не найдены');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initJsonUtils);

// Экспорт функций
window.saveToJson = saveToJson;
window.loadFromJson = loadFromJson;
window.processLoadedData = processLoadedData;
window.ensureSectionsAndDescriptions = ensureSectionsAndDescriptions;
