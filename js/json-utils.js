// Модуль для работы с сохранением и загрузкой JSON

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

// Функция для сохранения данных в JSON
function saveToJson() {
    // Проверяем, есть ли данные для сохранения
    if (!window.brands || window.brands.length === 0) {
        alert('Нет данных для сохранения. Добавьте хотя бы один бренд.');
        return;
    }
    
    try {
        // Формируем объект для сохранения
        const dataToSave = {
            brands: window.brands
        };
        
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
        
        console.log(`JSON файл "${filename}" успешно сохранен`);
    } catch (error) {
        console.error('Ошибка при сохранении JSON:', error);
        alert('Ошибка при сохранении данных. Пожалуйста, попробуйте снова.');
    }
}

// Функция для загрузки данных из JSON
function loadFromJson(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('Файл не выбран');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                resolve(jsonData);
            } catch (error) {
                console.error('Ошибка при парсинге JSON:', error);
                reject('Ошибка при чтении файла. Проверьте формат JSON.');
            }
        };
        
        reader.onerror = function() {
            console.error('Ошибка чтения файла');
            reject('Ошибка при чтении файла.');
        };
        
        reader.readAsText(file);
    });
}

// Функция для обработки загруженных данных
function processLoadedData(data) {
    // Проверяем структуру загруженных данных
    if (!data || !data.brands || !Array.isArray(data.brands)) {
        alert('Некорректный формат загруженного файла. Отсутствуют данные о брендах.');
        return false;
    }
    
    try {
        // Если текущие данные не пусты, спрашиваем о замене
        if (window.brands && window.brands.length > 0) {
            const confirm = window.confirm('Загруженные данные заменят текущие. Продолжить?');
            if (!confirm) {
                return false;
            }
        }
        
        // Обновляем глобальные данные
        window.brands = data.brands;
        
        // Перерендериваем интерфейс
        if (typeof window.renderBrands === 'function') {
            window.renderBrands();
        } else {
            console.error('Функция renderBrands не найдена');
            alert('Ошибка при обновлении интерфейса. Пожалуйста, обновите страницу.');
            return false;
        }
        
        console.log('Данные успешно загружены:', data.brands.length, 'брендов');
        return true;
    } catch (error) {
        console.error('Ошибка при обработке загруженных данных:', error);
        alert('Ошибка при обработке загруженных данных.');
        return false;
    }
}

// Инициализация обработчиков событий для кнопок
function initJsonUtils() {
    console.log('JSON utils module initialized');
    
    const saveButton = document.getElementById('saveJsonBtn');
    const loadButton = document.getElementById('loadJsonBtn');
    const fileInput = document.getElementById('jsonFileInput');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveToJson();
        });
    } else {
        console.error('Кнопка сохранения JSON не найдена');
    }
    
    if (loadButton && fileInput) {
        loadButton.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                loadFromJson(e.target.files[0])
                    .then(data => {
                        const success = processLoadedData(data);
                        if (success) {
                            alert('Данные успешно загружены');
                        }
                        // Сбрасываем значение для возможности выбора того же файла повторно
                        fileInput.value = '';
                    })
                    .catch(error => {
                        alert(error);
                        fileInput.value = '';
                    });
            }
        });
    } else {
        console.error('Кнопка загрузки JSON или элемент выбора файла не найдены');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initJsonUtils);

// Экспорт функций
window.saveToJson = saveToJson;
window.loadFromJson = loadFromJson;
window.processLoadedData = processLoadedData;
