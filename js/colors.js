// Глобальная переменная для доступа к брендам из других скриптов
window.brands = window.brands || [];

// Настройка кнопок для работы с цветами
function setupColorButtons(brandItem, brand) {
    const addColorButtons = brandItem.querySelectorAll("#addColor");
    const addPairedColorsButtons = brandItem.querySelectorAll("#addPairedColors");
    const addPaletteButtons = brandItem.querySelectorAll("#addPalette");

    const mainColorsBlocks = brandItem.querySelectorAll("#mainColorsBlock");
    const pairedColorsBlocks = brandItem.querySelectorAll("#pairedColorsBlock");
    const palettesBlocks = brandItem.querySelectorAll("#palettesBlock");

    // Настройка кнопок добавления цвета
    setupAddColorButtons(addColorButtons, mainColorsBlocks);
    
    // Настройка кнопок добавления парных цветов
    setupPairedColorsButtons(addPairedColorsButtons, pairedColorsBlocks, brandItem, brand);
    
    // Настройка кнопок добавления палитр
    setupPaletteButtons(addPaletteButtons, palettesBlocks);
}

// Настройка кнопок добавления цвета
function setupAddColorButtons(buttons, blocks) {
    if (buttons && buttons.length > 0) {
        buttons.forEach((button, index) => {
            button.addEventListener("click", function() {
                if (blocks[index]) {
                    blocks[index].style.display = "block";
                }
                const addColorModal = new bootstrap.Modal(document.getElementById('addColorModal'));
                addColorModal.show();
            });
        });
    }
}

// Настройка кнопок добавления парных цветов
function setupPairedColorsButtons(buttons, blocks, brandItem, brand) {
    if (buttons && buttons.length > 0) {
        buttons.forEach((button, index) => {
            button.addEventListener("click", function() {
                if (blocks[index]) {
                    blocks[index].style.display = "block";
                }
                
                // Открытие модального окна для парных цветов
                showPairedColorsModal(brandItem);
            });
        });
    }
}

// Открытие модального окна для парных цветов
function showPairedColorsModal(brandItem) {
    const addPairedColorsModal = document.getElementById("addPairedColorsModal");
    if (!addPairedColorsModal) {
        console.error("Модальное окно 'addPairedColorsModal' не найдено.");
        return;
    }

    // Получаем список цветов из блока "Основные и дополнительные цвета"
    const mainColorsGallery = brandItem.querySelector("#mainColorsGallery");
    const backgroundColorSelect = document.getElementById("backgroundColor");
    const textColorSelect = document.getElementById("textColor");

    if (mainColorsGallery && backgroundColorSelect && textColorSelect) {
        // Очищаем селекты перед заполнением
        backgroundColorSelect.innerHTML = "";
        textColorSelect.innerHTML = "";

        // Заполняем селекты цветами из галереи
        fillColorSelects(mainColorsGallery, backgroundColorSelect, textColorSelect);
    }

    // Открываем модальное окно
    try {
        const modalInstance = new bootstrap.Modal(addPairedColorsModal);
        modalInstance.show();
    } catch (error) {
        console.error("Ошибка при попытке отобразить модальное окно:", error);
    }
}

// Заполнение селектов цветами
function fillColorSelects(colorGallery, bgSelect, textSelect) {
    const colorCards = colorGallery.querySelectorAll(".color-card");
    
    if (colorCards.length > 0) {
        colorCards.forEach((card) => {
            const colorHex = card.querySelector(".color-hex").textContent.trim();
            
            // Создаем опции для обоих селектов
            const bgOption = document.createElement("option");
            bgOption.value = colorHex;
            bgOption.textContent = colorHex;
            
            const textOption = document.createElement("option");
            textOption.value = colorHex;
            textOption.textContent = colorHex;
            
            bgSelect.appendChild(bgOption);
            textSelect.appendChild(textOption);
        });
    } else {
        // Если цветов нет, добавляем предупреждение
        const option = document.createElement("option");
        option.textContent = "Нет доступных цветов";
        option.disabled = true;
        
        bgSelect.appendChild(option.cloneNode(true));
        textSelect.appendChild(option);
    }
}

// Настройка кнопок добавления палитр
function setupPaletteButtons(buttons, blocks) {
    if (buttons && buttons.length > 0) {
        buttons.forEach((button, index) => {
            button.addEventListener("click", function() {
                if (blocks[index]) {
                    blocks[index].style.display = "block";
                }
            });
        });
    }
}

// Инициализация форм для работы с цветами
function initColorForms() {
    initAddColorForm();
    initPairedColorsForm();
}

// Инициализация формы добавления цвета
function initAddColorForm() {
    const addColorForm = document.getElementById("addColorForm");
    
    if (addColorForm) {
        addColorForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const colorHexInput = document.getElementById("colorHex");
            const colorValues = colorHexInput.value.split(",").map(c => c.trim());
            
            const activeBrandId = getActiveBrandId();
            if (!activeBrandId) {
                alert("Ошибка: Сначала добавьте и выберите бренд.");
                return;
            }
            
            addColorsToActiveBrand(colorValues, activeBrandId);
        });
    }
}

// Добавление цветов к активному бренду
function addColorsToActiveBrand(colorValues, brandId) {
    const activeBrand = brands.find(brand => brand.id === brandId);
    if (!activeBrand) {
        console.error("Активный бренд не найден.");
        return;
    }
    
    // Инициализация секции цветов при необходимости
    if (!activeBrand.sections.colors) {
        activeBrand.sections.colors = { primary: [] };
    } else if (!activeBrand.sections.colors.primary) {
        activeBrand.sections.colors.primary = [];
    }
    
    // Находим галерею цветов для активного бренда
    const mainColorsBlock = document.querySelector(`#brandsList .brand-item[data-id="${brandId}"] #mainColorsBlock`);
    const colorGallery = mainColorsBlock ? mainColorsBlock.querySelector("#mainColorsGallery") : null;
    
    if (!colorGallery) {
        console.error("Галерея цветов не найдена для бренда:", brandId);
        return;
    }
    
    // Отображаем блок цветов
    mainColorsBlock.style.display = "block";
    
    // Добавляем каждый цвет в галерею
    colorValues.forEach(colorHex => {
        if (colorHex) {
            const formattedHex = colorHex.startsWith("#") ? colorHex : `#${colorHex}`;
            
            // Создаем карточку цвета
            const colorCard = document.createElement("div");
            colorCard.className = "color-card";
            colorCard.innerHTML = `
                <div class="color-preview" style="background-color: ${formattedHex}"></div>
                <div class="color-info">
                    <span class="color-hex">${formattedHex}</span>
                </div>
                <button class="delete-color-btn">
                    <img src="img_src/x-icon.svg" alt="Удалить" class="delete-icon">
                </button>
            `;
            
            // Добавляем карточку в галерею
            colorGallery.appendChild(colorCard);
            
            // Добавляем цвет в данные бренда
            activeBrand.sections.colors.primary.push({ hex: formattedHex });
            
            // Обработчик удаления цвета
            const deleteButton = colorCard.querySelector(".delete-color-btn");
            deleteButton.addEventListener("click", function() {
                colorCard.remove();
                
                // Удаляем цвет из данных бренда
                const colorIndex = activeBrand.sections.colors.primary.findIndex(color => color.hex === formattedHex);
                if (colorIndex !== -1) {
                    activeBrand.sections.colors.primary.splice(colorIndex, 1);
                }
            });
        }
    });
    
    // Сбрасываем форму
    document.getElementById("addColorForm").reset();
    
    // Закрываем модальное окно
    const addColorModal = bootstrap.Modal.getInstance(document.getElementById("addColorModal"));
    if (addColorModal) {
        addColorModal.hide();
    }
}

// Инициализация формы парных цветов
function initPairedColorsForm() {
    const addPairedColorsForm = document.getElementById("addPairedColorsForm");
    
    if (addPairedColorsForm) {
        // Очищаем все обработчики событий с формы, чтобы избежать дубликатов
        const newForm = addPairedColorsForm.cloneNode(true);
        addPairedColorsForm.parentNode.replaceChild(newForm, addPairedColorsForm);
        
        // Добавляем новый обработчик к клонированной форме
        newForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const backgroundColor = document.getElementById("selectedBackgroundColor").value;
            const textColor = document.getElementById("selectedTextColor").value;
            const allowInversion = document.getElementById("allowInversion").checked;
            
            // Получаем ID активного бренда
            const activeBrandId = getActiveBrandId();
            if (!activeBrandId) {
                alert("Ошибка: Не удалось определить активный бренд.");
                return;
            }
            
            addPairedColorsToActiveBrand(backgroundColor, textColor, allowInversion, activeBrandId);
        });
    }
}

// Добавление парных цветов к активному бренду
function addPairedColorsToActiveBrand(backgroundColor, textColor, allowInversion, brandId) {
    // Находим галерею парных цветов для активного бренда
    const pairedColorsGallery = document.querySelector(`#brandsList [data-id="${brandId}"] #pairedColorsGallery`);
    if (!pairedColorsGallery) {
        console.error("Галерея парных цветов не найдена для бренда:", brandId);
        return;
    }
    
    // Создаем карточку парных цветов
    const pairedColorCard = document.createElement("div");
    pairedColorCard.className = "paired-color-card";
    pairedColorCard.innerHTML = `
        <div class="paired-color-header">
            <div class="paired-color-item">
                <div>Цвет фона</div>
                <div class="paired-color-preview" style="background: ${backgroundColor}"></div>
                <div>${backgroundColor}</div>
            </div>
            <div class="paired-color-item">
                <div>Цвет текста</div>
                <div class="paired-color-preview" style="background: ${textColor}"></div>
                <div>${textColor}</div>
            </div>
        </div>
        <div class="paired-color-sample" style="background-color: ${backgroundColor}; color: ${textColor}">Sample text</div>
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
                    <div class="paired-color-preview" style="background: ${backgroundColor}"></div>
                    <div>${backgroundColor}</div>
                </div>
            </div>
            <div class="paired-color-sample" style="background-color: ${textColor}; color: ${backgroundColor}">Sample text</div>
        </div>
        ` : ''}
        <button class="paired-color-delete">Удалить</button>
    `;
    
    // Добавляем обработчик для удаления карточки
    pairedColorCard.querySelector(".paired-color-delete").addEventListener("click", () => {
        pairedColorCard.remove();
    });
    
    // Добавляем карточку в галерею
    pairedColorsGallery.appendChild(pairedColorCard);
    
    // Сохраняем парный цвет в данных бренда
    const activeBrand = brands.find(brand => brand.id === brandId);
    if (activeBrand) {
        if (!activeBrand.sections.colors) {
            activeBrand.sections.colors = {};
        }
        if (!activeBrand.sections.colors.paired) {
            activeBrand.sections.colors.paired = [];
        }
        activeBrand.sections.colors.paired.push({
            backgroundColor,
            textColor,
            allowInversion
        });
    }
    
    // Закрываем модальное окно
    const addPairedColorsModal = bootstrap.Modal.getInstance(document.getElementById("addPairedColorsModal"));
    if (addPairedColorsModal) {
        addPairedColorsModal.hide();
    }
}

// Инициализация модального окна добавления парных цветов
document.addEventListener('DOMContentLoaded', function() {
    console.log('Colors module initialized');
    
    // Обработчик модального окна добавления парных цветов
    const pairedColorsModal = document.getElementById('addPairedColorsModal');
    if (pairedColorsModal) {
        // Добавляем обработчик события показа модального окна
        pairedColorsModal.addEventListener('show.bs.modal', function(event) {
            console.log('Paired colors modal is opening');
            
            // Найдем активный бренд напрямую
            const activeBrandElement = document.querySelector('.brand-item .brand-sections-content[style*="display: block"]');
            if (!activeBrandElement) {
                console.error('No active brand found');
                return;
            }
            
            const brandItem = activeBrandElement.closest('.brand-item');
            if (!brandItem) {
                console.error('Brand item element not found');
                return;
            }
            
            // Находим галерею основных цветов
            const mainColorsGallery = brandItem.querySelector('#mainColorsGallery');
            if (!mainColorsGallery) {
                console.error('Main colors gallery not found');
                return;
            }
            
            // Находим контейнеры для отображения цветов в модальном окне
            const backgroundColorGrid = document.getElementById('backgroundColorGrid');
            const textColorGrid = document.getElementById('textColorGrid');
            
            if (!backgroundColorGrid || !textColorGrid) {
                console.error('Color grid containers not found', {
                    backgroundColorGrid: !!backgroundColorGrid,
                    textColorGrid: !!textColorGrid
                });
                return;
            }
            
            // Очищаем контейнеры перед заполнением
            backgroundColorGrid.innerHTML = '';
            textColorGrid.innerHTML = '';
            
            // Обнуляем значения скрытых полей
            const selectedBgColorField = document.getElementById('selectedBackgroundColor');
            const selectedTextColorField = document.getElementById('selectedTextColor');
            
            if (selectedBgColorField) selectedBgColorField.value = '';
            if (selectedTextColorField) selectedTextColorField.value = '';
            
            // Собираем доступные цвета из галереи
            const colorCards = mainColorsGallery.querySelectorAll('.color-card');
            console.log(`Found ${colorCards.length} colors in main gallery`);
            
            if (colorCards.length === 0) {
                // Показываем сообщение об отсутствии цветов
                const noColorsMessage = document.createElement('div');
                noColorsMessage.className = 'alert alert-warning';
                noColorsMessage.textContent = 'Нет доступных цветов. Пожалуйста, сначала добавьте основные цвета.';
                
                backgroundColorGrid.appendChild(noColorsMessage.cloneNode(true));
                textColorGrid.appendChild(noColorsMessage);
                return;
            }
            
            // Добавляем карточки цветов в сетки выбора
            colorCards.forEach(colorCard => {
                const colorHexElement = colorCard.querySelector('.color-hex');
                if (!colorHexElement) {
                    console.error('Color hex element not found in color card');
                    return;
                }
                
                const colorPreviewElement = colorCard.querySelector('.color-preview');
                if (!colorPreviewElement) {
                    console.error('Color preview element not found in color card');
                    return;
                }
                
                const colorHex = colorHexElement.textContent.trim();
                const colorPreviewStyle = colorPreviewElement.getAttribute('style');
                
                console.log('Adding color card with hex:', colorHex, 'style:', colorPreviewStyle);
                
                // Создаем карточку для выбора фона
                const bgColorCard = document.createElement('div');
                bgColorCard.className = 'color-option-card';
                bgColorCard.dataset.color = colorHex;
                bgColorCard.innerHTML = `
                    <div class="color-option-preview" style="${colorPreviewStyle}"></div>
                    <div class="color-option-value">${colorHex}</div>
                `;
                
                // Создаем карточку для выбора текста (клонируем карточку фона)
                const textColorCard = bgColorCard.cloneNode(true);
                
                // Добавляем обработчики выбора цвета для фона
                bgColorCard.addEventListener('click', function() {
                    // Снимаем выделение со всех карточек
                    backgroundColorGrid.querySelectorAll('.color-option-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    
                    // Выделяем текущую карточку
                    this.classList.add('selected');
                    
                    // Сохраняем выбранный цвет в скрытом поле
                    if (selectedBgColorField) {
                        selectedBgColorField.value = colorHex;
                        console.log('Selected background color:', colorHex);
                    }
                });
                
                // Добавляем обработчики выбора цвета для текста
                textColorCard.addEventListener('click', function() {
                    // Снимаем выделение со всех карточек
                    textColorGrid.querySelectorAll('.color-option-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    
                    // Выделяем текущую карточку
                    this.classList.add('selected');
                    
                    // Сохраняем выбранный цвет в скрытом поле
                    if (selectedTextColorField) {
                        selectedTextColorField.value = colorHex;
                        console.log('Selected text color:', colorHex);
                    }
                });
                
                // Добавляем карточки в соответствующие контейнеры
                backgroundColorGrid.appendChild(bgColorCard);
                textColorGrid.appendChild(textColorCard);
            });
            
            // Выбираем первые карточки по умолчанию
            const firstBgCard = backgroundColorGrid.querySelector('.color-option-card');
            const firstTextCard = textColorGrid.querySelector('.color-option-card');
            
            if (firstBgCard) {
                firstBgCard.click();
                console.log('First background color card selected by default');
            }
            
            if (firstTextCard) {
                firstTextCard.click();
                console.log('First text color card selected by default');
            }
        });
    }
    
    // Обработчик отправки формы добавления парных цветов
    // ВАЖНО: удаляем существующий обработчик, если он уже был установлен
    const addPairedColorsForm = document.getElementById('addPairedColorsForm');
    if (addPairedColorsForm) {
        // Очищаем все обработчики событий с формы, чтобы избежать дубликатов
        const newForm = addPairedColorsForm.cloneNode(true);
        addPairedColorsForm.parentNode.replaceChild(newForm, addPairedColorsForm);
        
        // Добавляем новый обработчик к клонированной форме
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Paired colors form submitted');
            
            // Получаем выбранные цвета из скрытых полей
            const backgroundColorInput = document.getElementById('selectedBackgroundColor');
            const textColorInput = document.getElementById('selectedTextColor');
            const allowInversionInput = document.getElementById('allowInversion');
            
            if (!backgroundColorInput || !textColorInput) {
                console.error('Hidden color input fields not found');
                alert('Ошибка: Не удалось найти поля для выбора цветов');
                return;
            }
            
            const backgroundColor = backgroundColorInput.value;
            const textColor = textColorInput.value;
            const allowInversion = allowInversionInput ? allowInversionInput.checked : false;
            
            console.log('Selected colors:', {backgroundColor, textColor, allowInversion});
            
            if (!backgroundColor || !textColor) {
                alert('Пожалуйста, выберите цвета для фона и текста.');
                return;
            }
            
            // Получаем активный бренд
            const activeBrandElement = document.querySelector('.brand-item .brand-sections-content[style*="display: block"]');
            if (!activeBrandElement) {
                console.error('No active brand found when submitting form');
                alert('Ошибка: Не удалось определить активный бренд');
                return;
            }
            
            const brandItem = activeBrandElement.closest('.brand-item');
            if (!brandItem) {
                console.error('Brand item element not found when submitting form');
                alert('Ошибка: Не удалось найти элемент бренда');
                return;
            }
            
            const brandId = parseInt(brandItem.dataset.id, 10);
            
            // Находим галерею парных цветов
            const pairedColorsGallery = brandItem.querySelector('#pairedColorsGallery');
            if (!pairedColorsGallery) {
                console.error('Paired colors gallery not found in brand item');
                alert('Ошибка: Не удалось найти галерею парных цветов');
                return;
            }
            
            // Показываем блок с парными цветами, если он скрыт
            const pairedColorsBlock = brandItem.querySelector('#pairedColorsBlock');
            if (pairedColorsBlock) {
                pairedColorsBlock.style.display = 'block';
            }
            
            // Создаем карточку парных цветов
            const pairedColorCard = document.createElement('div');
            pairedColorCard.className = 'paired-color-card';
            pairedColorCard.innerHTML = `
                <div class="paired-color-header">
                    <div class="paired-color-item">
                        <div>Цвет фона</div>
                        <div class="paired-color-preview" style="background: ${backgroundColor}"></div>
                        <div>${backgroundColor}</div>
                    </div>
                    <div class="paired-color-item">
                        <div>Цвет текста</div>
                        <div class="paired-color-preview" style="background: ${textColor}"></div>
                        <div>${textColor}</div>
                    </div>
                </div>
                <div class="paired-color-sample" style="background-color: ${backgroundColor}; color: ${textColor}">Sample text</div>
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
                            <div class="paired-color-preview" style="background: ${backgroundColor}"></div>
                            <div>${backgroundColor}</div>
                        </div>
                    </div>
                    <div class="paired-color-sample" style="background-color: ${textColor}; color: ${backgroundColor}">Sample text</div>
                </div>
                ` : ''}
                <button class="paired-color-delete">Удалить</button>
            `;
            
            // Добавляем обработчик для кнопки удаления
            const deleteButton = pairedColorCard.querySelector('.paired-color-delete');
            if (deleteButton) {
                deleteButton.addEventListener('click', function() {
                    pairedColorCard.remove();
                });
            }
            
            // Добавляем карточку в галерею
            pairedColorsGallery.appendChild(pairedColorCard);
            console.log('Paired color card added to gallery');
            
            // Сохраняем данные в модели бренда
            if (window.brands && window.brands.length > 0) {
                const brand = window.brands.find(b => b.id === brandId);
                
                if (brand) {
                    if (!brand.sections) brand.sections = {};
                    if (!brand.sections.colors) brand.sections.colors = {};
                    if (!brand.sections.colors.paired) brand.sections.colors.paired = [];
                    
                    brand.sections.colors.paired.push({
                        backgroundColor,
                        textColor,
                        allowInversion
                    });
                    console.log('Paired color data saved to brand model');
                }
            }
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPairedColorsModal'));
            if (modal) {
                modal.hide();
                console.log('Paired colors modal closed');
            }
        });
    }
    
    // Настройка кнопок для парных цветов
    setupPairedColorButtons();
    
    // Функция для настройки кнопок парных цветов
    function setupPairedColorButtons() {
        const addPairedColorButtons = document.querySelectorAll('#addPairedColors');
        if (addPairedColorButtons.length > 0) {
            console.log(`Found ${addPairedColorButtons.length} paired color buttons`);
            
            addPairedColorButtons.forEach(button => {
                // Удаляем старые обработчики
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Настраиваем атрибуты для модального окна
                newButton.setAttribute('data-bs-toggle', 'modal');
                newButton.setAttribute('data-bs-target', '#addPairedColorsModal');
                
                // Добавляем обработчик для отображения блока
                newButton.addEventListener('click', function() {
                    const brandItem = this.closest('.brand-item');
                    if (brandItem) {
                        const pairedColorsBlock = brandItem.querySelector('#pairedColorsBlock');
                        if (pairedColorsBlock) {
                            pairedColorsBlock.style.display = 'block';
                        }
                    }
                });
            });
        }
    }
});
