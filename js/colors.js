// Модуль для работы с цветами

// Глобальная переменная для доступа к брендам из других скриптов
window.brands = window.brands || [];

// Функция инициализации модуля цветов
function initColors() {
    console.log('Colors module initialized');
    
    // Инициализация модального окна для парных цветов
    initPairedColorsModal();
    
    // Инициализация модального окна для палитры
    initPaletteModal();
    
    // Инициализация модального окна для обычных цветов
    initColorModal();
    
    // Настройка кнопок для цветовых функций
    setupColorActionButtons();
}

// Инициализация модального окна для обычных цветов
function initColorModal() {
    setupColorFormHandler();
}

// Обработчик для формы добавления цвета
function setupColorFormHandler() {
    const addColorForm = document.getElementById('addColorForm');
    
    if (addColorForm) {
        // Клонируем для удаления старых обработчиков
        const newForm = addColorForm.cloneNode(true);
        addColorForm.parentNode.replaceChild(newForm, addColorForm);
        
        newForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const colorHexInput = document.getElementById('colorHex');
            const colorValues = colorHexInput.value.split(',').map(c => c.trim());
            
            // Получаем ID активного бренда
            const brandId = window.getActiveBrandId();
            if (!brandId) {
                alert('Пожалуйста, сначала выберите или создайте бренд');
                return;
            }
            
            // Находим бренд в массиве (без перезаписи массива)
            const brandIndex = window.brands.findIndex(b => b.id === brandId);
            if (brandIndex === -1) {
                alert('Выбранный бренд не найден');
                return;
            }
            
            // Получаем ссылку на бренд
            const brand = window.brands[brandIndex];
            
            // Убедимся, что у бренда есть секция colors и массив primary
            if (!brand.sections) brand.sections = {};
            if (!brand.sections.colors) brand.sections.colors = { description: '', primary: [] };
            if (!brand.sections.colors.primary) brand.sections.colors.primary = [];
            
            // Добавляем каждый цвет в массив
            colorValues.forEach(colorValue => {
                if (colorValue) {
                    // Добавляем # к цвету, если его нет
                    const formattedHex = colorValue.startsWith('#') ? colorValue : `#${colorValue}`;
                    
                    // Проверяем, есть ли такой цвет уже
                    const colorExists = brand.sections.colors.primary.some(c => c.hex === formattedHex);
                    
                    if (!colorExists) {
                        // Добавляем цвет в массив
                        brand.sections.colors.primary.push({ hex: formattedHex });
                    }
                }
            });
            
            console.log(`Добавлены цвета для бренда ${brand.name}:`, colorValues);
            
            // Обновляем отображение в интерфейсе
            const activeBrandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
            if (activeBrandItem) {
                updateColorsInBrandItem(activeBrandItem, brand);
            } else {
                // Если не нашли элемент бренда, обновляем весь список
                window.renderBrands();
            }
            
            // Сбрасываем форму
            newForm.reset();
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('addColorModal'));
            if (modal) {
                modal.hide();
                
                // Cleanup backdrop
                setTimeout(() => {
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, 300);
            }
        });
    }
}

// Функция для обновления цветов в DOM без полного перерендеринга
function updateColorsInBrandItem(brandItem, brand) {
    // Обновляем основные цвета
    const mainColorsBlock = brandItem.querySelector('#mainColorsBlock');
    const colorGallery = mainColorsBlock?.querySelector('#mainColorsGallery');
    
    if (mainColorsBlock && colorGallery && brand.sections.colors.primary?.length > 0) {
        // Показываем блок, если есть цвета
        mainColorsBlock.style.display = 'block';
        
        // Очищаем галерею
        colorGallery.innerHTML = '';
        
        // Рендерим каждый цвет
        brand.sections.colors.primary.forEach(color => {
            const colorCard = document.createElement('div');
            colorCard.className = 'color-card';
            colorCard.dataset.hex = color.hex;
            
            colorCard.innerHTML = `
                <div class="color-preview" style="background-color: ${color.hex}"></div>
                <div class="color-info">
                    <span class="color-hex">${color.hex}</span>
                </div>
                <button class="delete-color-btn">
                    <img src="img_src/x-icon.svg" alt="Удалить">
                </button>
            `;
            
            colorGallery.appendChild(colorCard);
            
            // Добавляем обработчик для кнопки удаления
            const deleteButton = colorCard.querySelector('.delete-color-btn');
            deleteButton.addEventListener('click', function() {
                const colorHex = colorCard.dataset.hex;
                
                // Находим индекс цвета для удаления
                const colorIndex = brand.sections.colors.primary.findIndex(c => c.hex === colorHex);
                if (colorIndex !== -1) {
                    // Удаляем цвет из массива
                    brand.sections.colors.primary.splice(colorIndex, 1);
                    
                    // Удаляем карточку из DOM
                    colorCard.remove();
                    
                    // Если больше нет цветов, скрываем блок
                    if (brand.sections.colors.primary.length === 0) {
                        mainColorsBlock.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Аналогично обновляем парные цвета и палитры...
    updatePairedColorsInBrandItem(brandItem, brand);
    updatePalettesInBrandItem(brandItem, brand);
}

// Функции для обновления парных цветов и палитр...
function updatePairedColorsInBrandItem(brandItem, brand) {
    // Аналогичная логика для обновления парных цветов...
    // ...код обновления парных цветов...
}

function updatePalettesInBrandItem(brandItem, brand) {
    // Аналогичная логика для обновления палитр...
    // ...код обновления палитр...
}

// Инициализация модального окна парных цветов
function initPairedColorsModal() {
    const modal = document.getElementById('addPairedColorsModal');
    if (!modal) {
        console.error('Модальное окно парных цветов не найдено');
        return;
    }
    
    modal.addEventListener('show.bs.modal', function(event) {
        console.log('Открытие модального окна парных цветов');
        
        // Получаем активный бренд
        const activeBrandElement = document.querySelector('.brand-item .brand-sections-content[style*="display: block"]');
        if (!activeBrandElement) {
            console.error('Активный бренд не найден');
            return;
        }
        
        const brandItem = activeBrandElement.closest('.brand-item');
        if (!brandItem) {
            console.error('Элемент бренда не найден');
            return;
        }
        
        // Получаем галерею основных цветов
        const mainColorsGallery = brandItem.querySelector('#mainColorsGallery');
        if (!mainColorsGallery) {
            console.error('Галерея основных цветов не найдена');
            return;
        }
        
        // Находим контейнеры для отображения карточек цветов
        const backgroundColorGrid = document.getElementById('backgroundColorGrid');
        const textColorGrid = document.getElementById('textColorGrid');
        if (!backgroundColorGrid || !textColorGrid) {
            console.error('Контейнеры для сеток цветов не найдены');
            return;
        }
        
        // Очищаем сетки цветов
        backgroundColorGrid.innerHTML = '';
        textColorGrid.innerHTML = '';
        
        // Сбрасываем скрытые поля
        const bgColorField = document.getElementById('selectedBackgroundColor');
        const textColorField = document.getElementById('selectedTextColor');
        if (bgColorField) bgColorField.value = '';
        if (textColorField) textColorField.value = '';
        
        // Получаем все карточки цветов из галереи основных цветов
        const colorCards = mainColorsGallery.querySelectorAll('.color-card');
        console.log(`Найдено ${colorCards.length} цветов в галерее`);
        
        // Если нет цветов, показываем предупреждение
        if (colorCards.length === 0) {
            const noColorsMsg = document.createElement('div');
            noColorsMsg.className = 'alert alert-warning';
            noColorsMsg.textContent = 'Нет доступных цветов. Пожалуйста, сначала добавьте основные цвета.';
            
            backgroundColorGrid.appendChild(noColorsMsg.cloneNode(true));
            textColorGrid.appendChild(noColorsMsg.cloneNode(true));
            return;
        }
        
        // Создаем карточки для выбора цветов
        colorCards.forEach(card => {
            const colorHexEl = card.querySelector('.color-hex');
            const colorPreviewEl = card.querySelector('.color-preview');
            
            if (!colorHexEl || !colorPreviewEl) {
                console.error('Неправильная структура карточки цвета');
                return;
            }
            
            const colorHex = colorHexEl.textContent.trim();
            const colorPreviewStyle = colorPreviewEl.getAttribute('style');
            
            // Создаем карточку для фона
            const bgCard = createColorOptionCard(colorHex, colorPreviewStyle);
            bgCard.addEventListener('click', function() {
                // Снимаем выделение со всех карточек
                backgroundColorGrid.querySelectorAll('.color-option-card').forEach(c => c.classList.remove('selected'));
                // Добавляем выделение текущей
                this.classList.add('selected');
                // Сохраняем значение
                if (bgColorField) bgColorField.value = colorHex;
            });
            
            // Создаем карточку для текста
            const textCard = createColorOptionCard(colorHex, colorPreviewStyle);
            textCard.addEventListener('click', function() {
                // Снимаем выделение со всех карточек
                textColorGrid.querySelectorAll('.color-option-card').forEach(c => c.classList.remove('selected'));
                // Добавляем выделение текущей
                this.classList.add('selected');
                // Сохраняем значение
                if (textColorField) textColorField.value = colorHex;
            });
            
            // Добавляем карточки в сетки
            backgroundColorGrid.appendChild(bgCard);
            textColorGrid.appendChild(textCard);
        });
        
        // Выбираем первые карточки по умолчанию
        const firstBgCard = backgroundColorGrid.querySelector('.color-option-card');
        const firstTextCard = textColorGrid.querySelector('.color-option-card');
        
        if (firstBgCard) firstBgCard.click();
        if (firstTextCard) firstTextCard.click();
    });
    
    // Обработчик формы добавления парных цветов
    const pairedColorsForm = document.getElementById('addPairedColorsForm');
    if (pairedColorsForm) {
        pairedColorsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные из формы
            const bgColor = document.getElementById('selectedBackgroundColor').value;
            const textColor = document.getElementById('selectedTextColor').value;
            const allowInversion = document.getElementById('allowInversion').checked;
            
            if (!bgColor || !textColor) {
                alert('Пожалуйста, выберите цвета для фона и текста');
                return;
            }
            
            // Получаем активный бренд
            const activeBrandElement = document.querySelector('.brand-item .brand-sections-content[style*="display: block"]');
            const brandItem = activeBrandElement ? activeBrandElement.closest('.brand-item') : null;
            
            if (!brandItem) {
                alert('Ошибка: не удалось определить активный бренд');
                return;
            }
            
            // Находим галерею парных цветов
            const pairedColorsGallery = brandItem.querySelector('#pairedColorsGallery');
            const pairedColorsBlock = brandItem.querySelector('#pairedColorsBlock');
            
            if (!pairedColorsGallery || !pairedColorsBlock) {
                alert('Ошибка: не найдена галерея парных цветов');
                return;
            }
            
            // Отображаем блок парных цветов
            pairedColorsBlock.style.display = 'block';
            
            // Создаем и добавляем карточку
            const card = createPairedColorCard(bgColor, textColor, allowInversion);
            pairedColorsGallery.appendChild(card);
            
            // Сохраняем в модели данных
            const brandId = parseInt(brandItem.dataset.id, 10);
            savePairedColor(brandId, bgColor, textColor, allowInversion);
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPairedColorsModal'));
            if (modal) modal.hide();
        });
    }
}

// Функция создания карточки цвета для сетки выбора
function createColorOptionCard(colorHex, previewStyle) {
    const card = document.createElement('div');
    card.className = 'color-option-card';
    card.dataset.color = colorHex;
    
    // Исправим создание превью цвета - напрямую устанавливаем background-color
    card.innerHTML = `
        <div class="color-option-preview" style="background-color: ${colorHex}"></div>
        <div class="color-option-value">${colorHex}</div>
    `;
    
    return card;
}

// Функция создания карточки парного цвета
function createPairedColorCard(bgColor, textColor, allowInversion) {
    const card = document.createElement('div');
    card.className = 'paired-color-card';
    
    card.innerHTML = `
        <div class="paired-color-header">
            <div class="paired-color-item">
                <div>Цвет фона</div>
                <div class="paired-color-preview" style="background: ${bgColor}"></div>
                <div>${bgColor}</div>
            </div>
            <div class="paired-color-item">
                <div>Цвет текста</div>
                <div class="paired-color-preview" style="background: ${textColor}"></div>
                <div>${textColor}</div>
            </div>
        </div>
        <div class="paired-color-sample" style="background-color: ${bgColor}; color: ${textColor}">Sample text</div>
        <div class="paired-color-inversion">${allowInversion ? "✅ инверсия допустима" : "❌ инверсия недопустима"}</div>
        ${allowInversion ? `
        <div class="paired-color-inverted">
            <div class="paired-color-header">
                <div class="paired-color-item">
                    <div>Цвет фона</div>
                    <div class="paired-color-preview" style="background: ${textColor}"></div>
                    <div>${textColor}</div>
                </div>
                <div class="paired-color-item">
                    <div>Цвет текста</div>
                    <div class="paired-color-preview" style="background: ${bgColor}"></div>
                    <div>${bgColor}</div>
                </div>
            </div>
            <div class="paired-color-sample" style="background-color: ${textColor}; color: ${bgColor}">Sample text</div>
        </div>
        ` : ''}
        <button class="paired-color-delete">Удалить</button>
    `;
    
    const deleteBtn = card.querySelector('.paired-color-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            card.remove();
        });
    }
    
    return card;
}

// Сохранение данных о парных цветах
function savePairedColor(brandId, bgColor, textColor, allowInversion) {
    const brand = window.brands.find(b => b.id === brandId);
    if (brand) {
        if (!brand.sections.colors) brand.sections.colors = {};
        if (!brand.sections.colors.paired) brand.sections.colors.paired = [];
        
        brand.sections.colors.paired.push({
            backgroundColor: bgColor,
            textColor: textColor,
            allowInversion: allowInversion
        });
    }
}

// Инициализация модального окна для палитры
function initPaletteModal() {
    const modal = document.getElementById('addPaletteModal');
    if (!modal) {
        console.error('Модальное окно палитры не найдено');
        return;
    }
    
    // Поле для ввода цветов палитры
    const paletteColorsInput = document.getElementById('paletteColors');
    if (paletteColorsInput) {
        paletteColorsInput.addEventListener('input', updatePalettePreview);
    }
    
    // Обработчик открытия модального окна
    modal.addEventListener('show.bs.modal', function() {
        // Сбрасываем форму
        const form = document.getElementById('addPaletteForm');
        const previewContainer = document.getElementById('palettePreview');
        
        if (form) form.reset();
        if (previewContainer) {
            previewContainer.innerHTML = '<div class="alert alert-info">Введите HEX-коды для предпросмотра</div>';
        }
    });
    
    // Обработчик формы палитры
    const paletteForm = document.getElementById('addPaletteForm');
    if (paletteForm) {
        paletteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const colorsInput = document.getElementById('paletteColors');
            const nameInput = document.getElementById('paletteName');
            
            if (!colorsInput) {
                console.error('Поле ввода цветов не найдено');
                return;
            }
            
            // Получаем данные из формы
            const colorsText = colorsInput.value.trim();
            const paletteName = nameInput ? nameInput.value.trim() : '';
            
            // Разбираем строку с цветами
            const colors = colorsText.split(',')
                .map(color => color.trim())
                .filter(color => color !== '')
                .map(color => color.startsWith('#') ? color : `#${color}`)
                .filter(color => isValidHexColor(color));
            
            if (colors.length === 0) {
                alert('Пожалуйста, введите хотя бы один корректный HEX-код');
                return;
            }
            
            // Получаем активный бренд
            const activeBrandId = getActiveBrandId();
            if (!activeBrandId) {
                alert('Ошибка: не удалось определить активный бренд');
                return;
            }
            
            const brandItem = document.querySelector(`.brand-item[data-id="${activeBrandId}"]`);
            if (!brandItem) {
                alert('Ошибка: не найден элемент бренда');
                return;
            }
            
            // Находим галерею палитр
            const palettesBlock = brandItem.querySelector('#palettesBlock');
            const palettesGallery = brandItem.querySelector('#palettesGallery');
            
            if (!palettesBlock || !palettesGallery) {
                alert('Ошибка: не найден блок для палитр');
                return;
            }
            
            // Отображаем блок палитр
            palettesBlock.style.display = 'block';
            
            // Добавляем палитру
            const paletteId = Date.now();
            const paletteCard = createPaletteCard(paletteId, paletteName, colors);
            palettesGallery.appendChild(paletteCard);
            
            // Сохраняем в данных
            savePalette(activeBrandId, paletteId, paletteName, colors);
            
            // Сбрасываем форму и закрываем окно
            paletteForm.reset();
            
            const previewContainer = document.getElementById('palettePreview');
            if (previewContainer) {
                previewContainer.innerHTML = '<div class="alert alert-info">Введите HEX-коды для предпросмотра</div>';
            }
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPaletteModal'));
            if (modal) modal.hide();
        });
    }
}

// Обновление предпросмотра палитры при вводе
function updatePalettePreview() {
    const colorsInput = document.getElementById('paletteColors');
    const previewContainer = document.getElementById('palettePreview');
    
    if (!colorsInput || !previewContainer) return;
    
    const colorsText = colorsInput.value.trim();
    if (!colorsText) {
        previewContainer.innerHTML = '<div class="alert alert-info">Введите HEX-коды для предпросмотра</div>';
        return;
    }
    
    // Разбираем и проверяем цвета
    const colors = colorsText.split(',')
        .map(color => color.trim())
        .filter(color => color !== '')
        .map(color => color.startsWith('#') ? color : `#${color}`);
    
    if (colors.length === 0) {
        previewContainer.innerHTML = '<div class="alert alert-info">Введите корректные HEX-коды через запятую</div>';
        return;
    }
    
    // Создаем HTML для предпросмотра
    let previewHTML = '<div class="palette-colors-preview">';
    let hasInvalid = false;
    
    colors.forEach(color => {
        const isValid = isValidHexColor(color);
        if (!isValid) hasInvalid = true;
        
        previewHTML += `
            <div class="palette-color-item ${!isValid ? 'invalid' : ''}">
                <div class="palette-color-circle" style="background-color: ${isValid ? color : '#DDD'}"></div>
                <div class="palette-color-hex">${color} ${!isValid ? '<span class="text-danger">⚠️</span>' : ''}</div>
            </div>
        `;
    });
    
    previewHTML += '</div>';
    
    if (hasInvalid) {
        previewHTML += '<div class="alert alert-warning mt-2">Один или несколько цветов имеют неверный формат</div>';
    }
    
    previewContainer.innerHTML = previewHTML;
}

// Проверка валидности HEX-кода
function isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Создание карточки палитры
function createPaletteCard(id, name, colors) {
    const card = document.createElement('div');
    card.className = 'palette-card';
    card.dataset.id = id;
    
    let cardHTML = '';
    
    if (name) {
        cardHTML += `<div class="palette-name">${name}</div>`;
    }
    
    cardHTML += '<div class="palette-colors">';
    colors.forEach(color => {
        cardHTML += `
            <div class="palette-color-item">
                <div class="palette-color-circle" style="background-color: ${color}"></div>
                <div class="palette-color-hex">${color}</div>
            </div>
        `;
    });
    cardHTML += '</div>';
    
    cardHTML += `
        <button class="delete-palette-btn">
            <img src="img_src/x-icon.svg" alt="Удалить" width="12" height="12">
        </button>
    `;
    
    card.innerHTML = cardHTML;
    
    // Добавляем обработчик удаления
    const deleteBtn = card.querySelector('.delete-palette-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            // Удаляем карточку из DOM
            card.remove();
            
            // Удаляем из данных бренда
            const brandItem = card.closest('.brand-item');
            if (brandItem) {
                const brandId = parseInt(brandItem.dataset.id, 10);
                deletePalette(brandId, id);
            }
        });
    }
    
    return card;
}

// Сохранение палитры в данных бренда
function savePalette(brandId, paletteId, name, colors) {
    const brand = window.brands.find(b => b.id === brandId);
    if (brand) {
        if (!brand.sections.colors) brand.sections.colors = {};
        if (!brand.sections.colors.palettes) brand.sections.colors.palettes = [];
        
        brand.sections.colors.palettes.push({
            id: paletteId,
            name: name,
            colors: colors
        });
    }
}

// Удаление палитры из данных бренда
function deletePalette(brandId, paletteId) {
    const brand = window.brands.find(b => b.id === brandId);
    if (brand && brand.sections.colors && brand.sections.colors.palettes) {
        brand.sections.colors.palettes = brand.sections.colors.palettes.filter(p => p.id !== paletteId);
    }
}

// Добавление основных цветов
function addColorsToActiveBrand(colorValues, brandId) {
    const brand = window.brands.find(b => b.id === brandId);
    if (!brand) {
        console.error('Бренд не найден');
        return;
    }
    
    // Инициализируем структуру данных, если её нет
    if (!brand.sections.colors) brand.sections.colors = {};
    if (!brand.sections.colors.primary) brand.sections.colors.primary = [];
    
    // Находим элементы DOM
    const brandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
    if (!brandItem) {
        console.error('Элемент бренда не найден в DOM');
        return;
    }
    
    const mainColorsBlock = brandItem.querySelector('#mainColorsBlock');
    const colorGallery = mainColorsBlock ? mainColorsBlock.querySelector('#mainColorsGallery') : null;
    
    if (!mainColorsBlock || !colorGallery) {
        console.error('Блок цветов или галерея не найдены');
        return;
    }
    
    // Отображаем блок основных цветов
    mainColorsBlock.style.display = 'block';
    
    // Добавляем каждый цвет
    colorValues.forEach(colorHex => {
        if (colorHex) {
            const formattedHex = colorHex.startsWith('#') ? colorHex : `#${colorHex}`;
            
            // Создаем карточку цвета
            const colorCard = document.createElement('div');
            colorCard.className = 'color-card';
            colorCard.innerHTML = `
                <div class="color-preview" style="background-color: ${formattedHex}"></div>
                <div class="color-info">
                    <span class="color-hex">${formattedHex}</span>
                </div>
                <button class="delete-color-btn">
                    <img src="img_src/x-icon.svg" alt="Удалить">
                </button>
            `;
            
            // Добавляем обработчик удаления
            const deleteBtn = colorCard.querySelector('.delete-color-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    colorCard.remove();
                    
                    // Удаляем из данных бренда
                    const colorIndex = brand.sections.colors.primary.findIndex(c => c.hex === formattedHex);
                    if (colorIndex !== -1) {
                        brand.sections.colors.primary.splice(colorIndex, 1);
                    }
                });
            }
            
            // Добавляем карточку в галерею
            colorGallery.appendChild(colorCard);
            
            // Сохраняем в данных
            brand.sections.colors.primary.push({ hex: formattedHex });
        }
    });
}

// Настройка кнопок управления цветами
function setupColorActionButtons() {
    // Функция обновления обработчиков кнопок будет вызываться при изменениях в DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                setupActionButtons();
            }
        });
    });
    
    // Запускаем наблюдателя
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Также настраиваем кнопки сразу
    setupActionButtons();
}

function setupActionButtons() {
    // Настройка кнопок добавления цветов
    const addColorButtons = document.querySelectorAll('#addColor');
    addColorButtons.forEach(button => {
        // Чтобы избежать дублирования обработчиков, проверяем наличие атрибута
        if (!button.hasAttribute('data-handler-attached')) {
            button.setAttribute('data-handler-attached', 'true');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#addColorModal');
            
            button.addEventListener('click', function(event) {
                // Предотвращаем всплытие события, чтобы не сработал обработчик редактирования описания
                event.stopPropagation();
                
                const brandItem = this.closest('.brand-item');
                if (brandItem) {
                    const mainColorsBlock = brandItem.querySelector('#mainColorsBlock');
                    if (mainColorsBlock) {
                        mainColorsBlock.style.display = 'block';
                    }
                }
            });
        }
    });

    // Настройка кнопок для парных цветов
    const addPairedColorsButtons = document.querySelectorAll('#addPairedColors');
    addPairedColorsButtons.forEach(button => {
        // Чтобы избежать дублирования обработчиков, проверяем наличие атрибута
        if (!button.hasAttribute('data-handler-attached')) {
            button.setAttribute('data-handler-attached', 'true');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#addPairedColorsModal');
            
            button.addEventListener('click', function(event) {
                // Предотвращаем всплытие события
                event.stopPropagation();
                
                const brandItem = this.closest('.brand-item');
                if (brandItem) {
                    const pairedColorsBlock = brandItem.querySelector('#pairedColorsBlock');
                    if (pairedColorsBlock) {
                        pairedColorsBlock.style.display = 'block';
                    }
                }
            });
        }
    });
    
    // Настройка кнопок для палитр
    const addPaletteButtons = document.querySelectorAll('#addPalette');
    addPaletteButtons.forEach(button => {
        if (!button.hasAttribute('data-handler-attached')) {
            button.setAttribute('data-handler-attached', 'true');
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#addPaletteModal');
            
            button.addEventListener('click', function(event) {
                // Предотвращаем всплытие события
                event.stopPropagation();
                
                const brandItem = this.closest('.brand-item');
                if (brandItem) {
                    const palettesBlock = brandItem.querySelector('#palettesBlock');
                    if (palettesBlock) {
                        palettesBlock.style.display = 'block';
                    }
                }
            });
        }
    });
}

// Инициализация обработчиков при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем модуль цветов
    initColors();
    
    // Настраиваем обработчики форм и кнопок
    setupColorFormHandler();
    setupColorActionButtons();
});
