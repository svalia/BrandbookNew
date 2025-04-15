// Модуль для работы с логотипами

// Функция инициализации модуля логотипов
function initLogos() {
    console.log('Logos module initialized');
    
    // Инициализация формы добавления логотипа
    const logoForm = document.getElementById('addLogoForm');
    if (!logoForm) {
        console.error('Logo form not found');
        return;
    }
    
    // Обработчик для показа/скрытия поля пользовательского цвета
    const logoColorSelect = document.getElementById('logoColor');
    const customColorField = document.getElementById('customColorField');
    
    if (logoColorSelect && customColorField) {
        logoColorSelect.addEventListener('change', function() {
            customColorField.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }
    
    // Обработчики для расчета значений
    const logoWidthInput = document.getElementById('logoWidth');
    const logoHeightInput = document.getElementById('logoHeight');
    const iconWidthInput = document.getElementById('iconWidthPx');
    const letterBHeightInput = document.getElementById('letterBHeight');
    const calculatedIconWidth = document.getElementById('calculatedIconWidth');
    const calculatedSafeZone = document.getElementById('calculatedSafeZone');
    
    // Добавляем обработчики ввода
    [logoWidthInput, logoHeightInput, iconWidthInput, letterBHeightInput].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateLogoValues);
        }
    });
    
    // Обработчик отправки формы
    logoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация
        const requiredFields = ['logoFile', 'logoColor', 'logoLanguage', 'logoType', 
                              'logoOrientation', 'logoWidth', 'logoHeight', 
                              'iconWidthPx', 'letterBHeight'];
        
        let isValid = true;
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field || !field.value) {
                isValid = false;
                if (field) field.classList.add('is-invalid');
            } else if (field) {
                field.classList.remove('is-invalid');
            }
        });
        
        // Проверка пользовательского цвета
        if (logoColorSelect.value === 'custom') {
            const customColorInput = document.getElementById('customColor');
            if (!customColorInput || !customColorInput.value) {
                isValid = false;
                if (customColorInput) customColorInput.classList.add('is-invalid');
            } else if (customColorInput) {
                customColorInput.classList.remove('is-invalid');
            }
        }
        
        if (!isValid) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Обработка файла
        const logoFileInput = document.getElementById('logoFile');
        if (logoFileInput.files.length === 0) {
            alert('Пожалуйста, выберите файл логотипа');
            return;
        }
        
        const file = logoFileInput.files[0];
        const validTypes = ['image/png', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Пожалуйста, выберите файл формата PNG или SVG');
            return;
        }
        
        // Чтение файла
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoData = {
                file: e.target.result,
                name: generateLogoName(),
                color: logoColorSelect.value === 'custom' ? 
                    document.getElementById('customColor').value : 
                    logoColorSelect.value,
                language: document.getElementById('logoLanguage').value,
                type: document.getElementById('logoType').value,
                orientation: document.getElementById('logoOrientation').value,
                dimensions: {
                    width: parseFloat(logoWidthInput.value),
                    height: parseFloat(logoHeightInput.value),
                    iconWidth: parseFloat(iconWidthInput.value),
                    letterBHeight: parseFloat(letterBHeightInput.value),
                    iconWidthPercent: parseFloat(calculatedIconWidth.textContent),
                    safeZonePercent: parseFloat(calculatedSafeZone.textContent)
                }
            };
            
            // Добавляем логотип
            addLogoToActiveBrand(logoData);
            
            // Сбрасываем форму и закрываем модальное окно
            logoForm.reset();
            customColorField.style.display = 'none';
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addLogoModal'));
            if (modal) modal.hide();
        };
        
        reader.readAsDataURL(file);
    });
}

// Функция для расчета значений логотипа
function calculateLogoValues() {
    const logoWidth = parseFloat(document.getElementById('logoWidth').value) || 0;
    const logoHeight = parseFloat(document.getElementById('logoHeight').value) || 0;
    const iconWidth = parseFloat(document.getElementById('iconWidthPx').value) || 0;
    const letterBHeight = parseFloat(document.getElementById('letterBHeight').value) || 0;
    
    const calculatedIconWidth = document.getElementById('calculatedIconWidth');
    const calculatedSafeZone = document.getElementById('calculatedSafeZone');
    
    // Половина ширины иконки (%)
    let iconWidthPercent = 0;
    if (logoWidth > 0 && iconWidth > 0) {
        iconWidthPercent = (iconWidth / logoWidth) * 50;
    }
    
    // Охранное поле (%)
    let safeZonePercent = 0;
    if (logoHeight > 0 && letterBHeight > 0) {
        safeZonePercent = (letterBHeight / logoHeight) * 100;
    }
    
    // Обновляем значения
    calculatedIconWidth.textContent = iconWidthPercent.toFixed(3) + '%';
    calculatedSafeZone.textContent = safeZonePercent.toFixed(3) + '%';
}

// Функция для генерации названия логотипа
function generateLogoName() {
    const colorSelect = document.getElementById('logoColor');
    const languageSelect = document.getElementById('logoLanguage');
    const typeSelect = document.getElementById('logoType');
    const orientationSelect = document.getElementById('logoOrientation');
    
    const colorMap = {
        white: 'Белый',
        black: 'Чёрный',
        green: 'Зелёный',
        graphite: 'Графитовый',
        multicolor: 'Цветной',
        custom: document.getElementById('customColor').value || 'Пользовательский'
    };
    
    const languageMap = {
        rus: 'RU',
        eng: 'EN',
        multi: 'Универс.'
    };
    
    const typeMap = {
        main: 'Основной',
        simple: 'Упрощ.',
        sign: 'Знак'
    };
    
    const orientationMap = {
        horizontal: 'Гориз.',
        vertical: 'Верт.',
        square: 'Квадр.'
    };
    
    const color = colorMap[colorSelect.value] || '';
    const language = languageMap[languageSelect.value] || '';
    const type = typeMap[typeSelect.value] || '';
    const orientation = orientationMap[orientationSelect.value] || '';
    
    return `${color} ${language} ${type} ${orientation}`.trim();
}

// Функция для преобразования русских символов в латиницу (транслитерация)
function transliterate(word) {
    const a = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '',
        'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', ' ': '_'
    };
    
    return word.split('').map(char => a[char] || char).join('');
}

// Функция для формирования стандартизированного имени файла логотипа
function generateLogoFileName(brandName, logoData) {
    // Транслитерация названия бренда и замена пробелов на подчеркивания
    const transliteratedBrand = transliterate(brandName);
    
    // Преобразование свойств логотипа в английские термины для имени файла
    const languageMap = {
        'rus': 'ru',
        'eng': 'en',
        'multi': 'multi'
    };
    
    const typeMap = {
        'main': 'main',
        'simple': 'simple',
        'sign': 'sign'
    };
    
    const orientationMap = {
        'horizontal': 'horiz',
        'vertical': 'vert',
        'square': 'square'
    };
    
    const colorMap = {
        'white': 'white',
        'black': 'black',
        'green': 'green',
        'graphite': 'graphite',
        'multicolor': 'multi',
        'custom': logoData.color
    };
    
    // Формируем стандартизированное имя файла
    const language = languageMap[logoData.language] || logoData.language;
    const type = typeMap[logoData.type] || logoData.type;
    const orientation = orientationMap[logoData.orientation] || logoData.orientation;
    const color = colorMap[logoData.color] || logoData.color;
    
    // Создаем имя файла в формате BrandName_language_type_orientation_color
    return `${transliteratedBrand}_${language}_${type}_${orientation}_${color}`;
}

// Функция для преобразования свойств логотипа для отображения на карточке
function getLogoPropertyLabels(logoData) {
    const colorLabels = {
        white: 'White',
        black: 'Black',
        green: 'Green',
        graphite: 'Graphite',
        multicolor: 'Multicolor',
        custom: logoData.color
    };
    
    const languageLabels = {
        rus: 'Russian',
        eng: 'English',
        multi: 'Universal'
    };
    
    const typeLabels = {
        main: 'Main',
        simple: 'Simplified',
        sign: 'Sign only'
    };
    
    const orientationLabels = {
        horizontal: 'Horizontal',
        vertical: 'Vertical',
        square: 'Square'
    };
    
    return {
        color: colorLabels[logoData.color] || logoData.color,
        language: languageLabels[logoData.language] || logoData.language,
        type: typeLabels[logoData.type] || logoData.type,
        orientation: orientationLabels[logoData.orientation] || logoData.orientation
    };
}

// Функция для добавления логотипа в активный бренд
function addLogoToActiveBrand(logoData) {
    // Находим активный бренд
    const activeBrandId = getActiveBrandId();
    if (!activeBrandId) {
        alert('Ошибка: не удалось определить активный бренд');
        return;
    }
    
    const brand = window.brands.find(b => b.id === activeBrandId);
    if (!brand) {
        alert('Ошибка: не найден активный бренд');
        return;
    }
    
    const brandItem = document.querySelector(`.brand-item[data-id="${activeBrandId}"]`);
    if (!brandItem) {
        alert('Ошибка: не найден элемент бренда в DOM');
        return;
    }
    
    // Находим секцию логотипов
    const logosSection = brandItem.querySelector('.section-content:has(.logos-gallery)')
                      || brandItem.querySelector('.section-content .logos-gallery')?.closest('.section-content');
                      
    if (!logosSection) {
        alert('Ошибка: не найдена секция логотипов');
        return;
    }
    
    // Находим галерею логотипов
    let logosGallery = logosSection.querySelector('.logos-gallery');
    if (!logosGallery) {
        logosGallery = document.createElement('div');
        logosGallery.className = 'logos-gallery mt-4';
        logosSection.appendChild(logosGallery);
    }
    
    // Генерируем имя файла для логотипа
    const logoFileName = generateLogoFileName(brand.name, logoData);
    
    // Создаем карточку логотипа
    const logoCard = document.createElement('div');
    logoCard.className = 'logo-card';
    logoCard.innerHTML = `
        <img class="logo-preview" src="${logoData.file}" alt="${logoFileName}">
        <div class="logo-details">
            <strong class="logo-filename">${logoFileName}</strong>
            <div class="logo-calculated-values mt-2">
                <small>Половина ширины иконки: ${logoData.dimensions.iconWidthPercent.toFixed(3)}%</small><br>
                <small>Охранное поле: ${logoData.dimensions.safeZonePercent.toFixed(3)}%</small>
            </div>
        </div>
        <button class="delete-logo-btn">
            <img src="img_src/x-icon.svg" alt="Удалить" class="delete-icon">
        </button>
    `;
    
    // Добавляем обработчик удаления
    const deleteBtn = logoCard.querySelector('.delete-logo-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            logoCard.remove();
            
            // Удаляем из данных бренда
            if (brand && brand.sections && brand.sections.logos) {
                const logoIndex = brand.sections.logos.findIndex(l => l.file === logoData.file);
                if (logoIndex !== -1) {
                    brand.sections.logos.splice(logoIndex, 1);
                }
            }
        });
    }
    
    // Добавляем карточку в галерею
    logosGallery.appendChild(logoCard);
    
    // Сохраняем в данных бренда
    if (!brand.sections.logos) {
        brand.sections.logos = { items: [] };
    }
    
    brand.sections.logos.items.push({
        id: Date.now(),
        name: logoFileName,
        file: logoData.file,
        properties: {
            color: logoData.color,
            language: logoData.language,
            type: logoData.type,
            orientation: logoData.orientation,
            dimensions: logoData.dimensions
        }
    });
    
    // Показываем секцию логотипов
    logosSection.style.display = 'block';
}

// Обработчик для формы добавления логотипа
function setupLogoFormHandler() {
    const addLogoForm = document.getElementById('addLogoForm');
    
    if (addLogoForm) {
        // Клонируем для удаления старых обработчиков
        const newForm = addLogoForm.cloneNode(true);
        addLogoForm.parentNode.replaceChild(newForm, addLogoForm);
        
        // Обработчик для отображения/скрытия поля пользовательского цвета
        const logoColorSelect = newForm.querySelector('#logoColor');
        const customColorField = newForm.querySelector('#customColorField');
        
        if (logoColorSelect && customColorField) {
            logoColorSelect.addEventListener('change', function() {
                customColorField.style.display = this.value === 'custom' ? 'block' : 'none';
            });
        }
        
        // Обработчики для расчета охранного поля и ширины иконки
        const logoWidthInput = newForm.querySelector('#logoWidth');
        const logoHeightInput = newForm.querySelector('#logoHeight');
        const iconWidthInput = newForm.querySelector('#iconWidthPx');
        const letterBHeightInput = newForm.querySelector('#letterBHeight');
        const calculatedIconWidth = newForm.querySelector('#calculatedIconWidth');
        const calculatedSafeZone = newForm.querySelector('#calculatedSafeZone');
        
        function calculateValues() {
            const logoWidth = parseFloat(logoWidthInput.value) || 0;
            const logoHeight = parseFloat(logoHeightInput.value) || 0;
            const iconWidth = parseFloat(iconWidthInput.value) || 0;
            const letterBHeight = parseFloat(letterBHeightInput.value) || 0;
            
            // Расчет половины ширины иконки в процентах
            let iconWidthPercent = 0;
            if (logoWidth > 0 && iconWidth > 0) {
                iconWidthPercent = (iconWidth / logoWidth) * 50; // Половина в процентах
            }
            
            // Расчет охранного поля в процентах
            let safeZone = 0;
            if (logoHeight > 0 && letterBHeight > 0) {
                safeZone = (letterBHeight / logoHeight) * 100;
            }
            
            // Обновляем отображение
            calculatedIconWidth.textContent = iconWidthPercent.toFixed(3);
            calculatedSafeZone.textContent = safeZone.toFixed(3);
        }
        
        // Добавляем слушатели событий для всех полей
        [logoWidthInput, logoHeightInput, iconWidthInput, letterBHeightInput].forEach(input => {
            if (input) {
                input.addEventListener('input', calculateValues);
            }
        });
        
        // Обработчик отправки формы
        newForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Получаем активный бренд
            const brandId = getActiveBrandId(); // Используем вспомогательную функцию
            if (!brandId) {
                alert('Пожалуйста, сначала выберите или создайте бренд');
                return;
            }
            
            // Находим бренд в существующем массиве
            const brandIndex = window.brands.findIndex(b => b.id === brandId);
            if (brandIndex === -1) {
                alert('Выбранный бренд не найден');
                return;
            }
            
            // Получаем ссылку на бренд
            const brand = window.brands[brandIndex];
            
            // Убедимся, что у бренда есть секция logos и массив items
            if (!brand.sections) brand.sections = {};
            if (!brand.sections.logos) brand.sections.logos = { description: '', items: [] };
            if (!brand.sections.logos.items) brand.sections.logos.items = [];
            
            // Получаем все значения из формы
            const logoColor = document.getElementById('logoColor').value;
            const customColor = document.getElementById('customColor').value;
            const logoLanguage = document.getElementById('logoLanguage').value;
            const logoType = document.getElementById('logoType').value;
            const logoOrientation = document.getElementById('logoOrientation').value;
            const logoWidth = parseFloat(logoWidthInput.value) || 0;
            const logoHeight = parseFloat(logoHeightInput.value) || 0;
            const iconWidth = parseFloat(iconWidthInput.value) || 0;
            const letterBHeight = parseFloat(letterBHeightInput.value) || 0;
            
            // Читаем файл как base64
            const logoFile = document.getElementById('logoFile').files[0];
            if (!logoFile) {
                alert('Пожалуйста, выберите файл логотипа');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const logoImage = e.target.result;
                
                // Рассчитываем значения
                const iconWidthPercent = logoWidth > 0 ? (iconWidth / logoWidth * 50).toFixed(3) : "0";
                const safeZone = logoHeight > 0 ? (letterBHeight / logoHeight * 100).toFixed(3) : "0";
                
                // Создаем объект логотипа
                const newLogo = {
                    id: Date.now(),
                    fileName: logoFile.name,
                    image: logoImage,
                    properties: {
                        color: logoColor === 'custom' ? customColor : logoColor,
                        language: logoLanguage,
                        type: logoType,
                        orientation: logoOrientation,
                        width: logoWidth,
                        height: logoHeight,
                        iconWidth: iconWidth,
                        letterBHeight: letterBHeight,
                        calculatedIconWidth: parseFloat(iconWidthPercent),
                        calculatedSafeZone: parseFloat(safeZone)
                    }
                };
                
                // Добавляем логотип в массив бренда
                brand.sections.logos.items.push(newLogo);
                
                console.log(`Добавлен логотип для бренда ${brand.name}:`, newLogo);
                
                // Обновляем отображение в интерфейсе
                const activeBrandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
                if (activeBrandItem) {
                    updateLogosInBrandItem(activeBrandItem, brand);
                } else {
                    // Если не нашли элемент бренда, обновляем весь список
                    window.renderBrands();
                }
                
                // Сбрасываем форму
                newForm.reset();
                
                // Скрываем поле пользовательского цвета
                customColorField.style.display = 'none';
                
                // Закрываем модальное окно
                const modal = bootstrap.Modal.getInstance(document.getElementById('addLogoModal'));
                if (modal) {
                    modal.hide();
                    
                    // Очистка backdrop
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
            };
            
            reader.readAsDataURL(logoFile);
        });
    }
}

// Функция для обновления логотипов в DOM без полного перерендеринга
function updateLogosInBrandItem(brandItem, brand) {
    const logosGallery = brandItem.querySelector('.logos-gallery');
    if (!logosGallery) return;
    
    // Очищаем галерею
    logosGallery.innerHTML = '';
    
    // Если у бренда нет логотипов, выходим
    if (!brand.sections?.logos?.items?.length) return;
    
    // Добавляем логотипы из бренда
    brand.sections.logos.items.forEach(logo => {
        const logoCard = document.createElement('div');
        logoCard.className = 'logo-card';
        logoCard.dataset.id = logo.id;
        
        logoCard.innerHTML = `
            <div class="logo-preview">
                <img src="${logo.image}" alt="Logo ${logo.id}" style="max-width: 100%; max-height: 120px;">
            </div>
            <span class="logo-filename">${logo.fileName}</span>
            <div class="logo-details">
                <strong>Цвет:</strong> ${logo.properties.color}<br>
                <strong>Язык:</strong> ${logo.properties.language}<br>
                <strong>Тип:</strong> ${logo.properties.type}<br>
                <strong>Ориентация:</strong> ${logo.properties.orientation}
            </div>
            <div class="logo-calculated-values">
                <small><strong>Размеры:</strong> ${logo.properties.width || 0}×${logo.properties.height || 0}px</small><br>
                <small><strong>Половина ширины иконки:</strong> ${logo.properties.calculatedIconWidth?.toFixed(3) || '0.000'}%</small><br>
                <small><strong>Охранное поле:</strong> ${logo.properties.calculatedSafeZone?.toFixed(3) || '0.000'}%</small>
            </div>
            <button class="delete-logo-btn" data-id="${logo.id}">
                <img src="img_src/trash-icon.svg" alt="Delete" class="delete-icon">
            </button>
        `;
        
        logosGallery.appendChild(logoCard);
        
        // Добавляем обработчик для кнопки удаления
        const deleteButton = logoCard.querySelector('.delete-logo-btn');
        deleteButton.addEventListener('click', function() {
            const logoId = parseInt(this.dataset.id);
            
            // Находим индекс логотипа для удаления
            const logoIndex = brand.sections.logos.items.findIndex(l => l.id === logoId);
            if (logoIndex !== -1) {
                // Удаляем логотип из массива
                brand.sections.logos.items.splice(logoIndex, 1);
                
                // Обновляем отображение
                updateLogosInBrandItem(brandItem, brand);
            }
        });
    });
}

// Получение ID активного бренда
function getActiveBrandId() {
    const activeBrandElement = document.querySelector('.brand-item .brand-sections-content[style*="display: block"]');
    if (activeBrandElement) {
        const brandItem = activeBrandElement.closest('.brand-item');
        return parseInt(brandItem.dataset.id, 10);
    }
    
    // Если нет активного бренда, берем первый
    const firstBrand = document.querySelector('.brand-item');
    if (firstBrand) {
        return parseInt(firstBrand.dataset.id, 10);
    }
    
    // Если все еще нет, берем первый из массива данных
    if (window.brands && window.brands.length > 0) {
        return window.brands[0].id;
    }
    
    return null;
}

// Инициализация обработчиков при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setupLogoFormHandler();
});
