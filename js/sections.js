// Рендеринг секций бренда
function renderSections() {
    const sections = [
        "Описание бренда", 
        "Тональность коммуникации", 
        "Логотипы", 
        "Цвета и цветовые стили", 
        "Типографика", 
        "Текстуры, Градиенты, Ключевые персонажи/элементы, Графические элементы и Рекламные материалы"
    ];

    return sections.map(section => `
        <li class="list-group-item section-item">
            <div class="section-header">
                <div class="section-title">
                    <span>${section}</span>
                    <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                </div>
            </div>
            <div class="section-content" style="display: none;">
                <div class="description-block">
                    <div class="description-content"></div>
                    <button class="add-description-btn btn btn-primary">Добавить описание</button>
                </div>
                ${section === "Цвета и цветовые стили" ? renderColorSection() : ""}
                ${section === "Логотипы" ? renderLogoSection() : ""}
            </div>
        </li>
    `).join('');
}

// Рендеринг секции цветов
function renderColorSection() {
    return `
        <div class="color-actions mt-3">
            <button class="add-description-btn btn btn-primary" id="addColor">Добавить цвет</button>
            <button class="add-description-btn btn btn-primary" id="addPairedColors">Добавить парные цвета</button>
            <button class="add-description-btn btn btn-primary" id="addPalette">Добавить палитру</button>
        </div>
        <div id="colorBlocks">
            <div class="color-block" id="mainColorsBlock" style="display: none;">
                <h3>Основные и дополнительные цвета</h3>
                <div class="color-gallery" id="mainColorsGallery">
                    <!-- Карточки цветов будут добавляться здесь -->
                </div>
            </div>
            <div class="color-block" id="pairedColorsBlock" style="display: none;">
                <h3>Парные цвета</h3>
                <div class="paired-colors-gallery" id="pairedColorsGallery">
                    <!-- Карточки парных цветов будут добавляться здесь -->
                </div>
            </div>
            <div class="color-block" id="palettesBlock" style="display: none;">
                <h3>Палитры цветов</h3>
                <div class="palettes-gallery" id="palettesGallery">
                    <!-- Карточки палитр будут добавляться здесь -->
                </div>
            </div>
        </div>
    `;
}

// Рендеринг секции логотипов
function renderLogoSection() {
    return `
        <button class="btn btn-success mt-3 add-logo-btn" data-bs-toggle="modal" data-bs-target="#addLogoModal">Добавить логотип</button>
        <div class="logos-gallery mt-4">
            <!-- Галерея логотипов будет динамически добавляться -->
        </div>
    `;
}

// Настройка кнопок описания
function setupDescriptionButtons(brandItem) {
    const addDescriptionButtons = brandItem.querySelectorAll(".add-description-btn");
    
    if (addDescriptionButtons && addDescriptionButtons.length > 0) {
        addDescriptionButtons.forEach((button) => {
            if (button) {
                button.addEventListener("click", (e) => {
                    const descriptionBlock = e.target.closest(".description-block");
                    if (descriptionBlock) {
                        const descriptionContent = descriptionBlock.querySelector(".description-content");
                        if (descriptionContent) {
                            openEditor(descriptionContent);
                        }
                    }
                });
            }
        });
    }
}

// Модуль для работы с секциями бренда

// Функция инициализации модуля секций
function initSections() {
    console.log('Sections module initialized');
    // Все обработчики для секций инициализируются при рендеринге брендов
}
