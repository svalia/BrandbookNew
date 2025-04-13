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
                    <img src="img_src/trash-icon.svg" alt="Удалить" class="delete-icon">
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
        addPairedColorsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const backgroundColor = document.getElementById("backgroundColor").value;
            const textColor = document.getElementById("textColor").value;
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
