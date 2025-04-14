// Глобальная переменная для хранения брендов
window.brands = [];

// Функция инициализации модуля брендов
function initBrands() {
    console.log('Brands module initialized');
    
    // Инициализация формы добавления бренда
    const addBrandForm = document.getElementById('addBrandForm');
    const brandsList = document.getElementById('brandsList');
    const addBrandButton = document.querySelector('[data-bs-target="#addBrandModal"]');
    
    if (addBrandButton) {
        // Обновляем кнопку "Добавить бренд"
        addBrandButton.classList.add("btn-add-brand");
        addBrandButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Добавить бренд
        `;
    }
    
    // Инициализация подсказки для логотипов
    const hintToggle = document.getElementById("hintToggle");
    if (hintToggle) {
        const hintContent = document.getElementById("hintContent");
        const toggleIcon = hintToggle.querySelector(".toggle-icon");
        
        hintToggle.addEventListener("click", () => {
            hintContent.classList.toggle("show");
            toggleIcon.classList.toggle("collapsed");
        });
    }
    
    // Проверяем наличие формы добавления бренда
    if (addBrandForm) {
        addBrandForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const brandNameInput = document.getElementById('brandName');
            if (!brandNameInput) {
                console.error('Поле имени бренда не найдено');
                return;
            }
            
            const brandName = brandNameInput.value.trim();
            if (!brandName) {
                console.warn('Название бренда не может быть пустым');
                return;
            }
            
            console.log(`Добавляем бренд: ${brandName}`);
            
            // Создаем новый бренд
            const newBrand = {
                id: Date.now(),
                name: brandName,
                sections: {} // Пустые секции для будущей реализации
            };
            
            // Добавляем бренд в глобальный массив
            window.brands.push(newBrand);
            console.log('Текущий список брендов:', window.brands);
            
            // Рендерим список брендов
            renderBrands();
            
            // Сбрасываем форму
            addBrandForm.reset();
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('addBrandModal'));
            if (modal) {
                modal.hide();
                
                // Добавляем задержку перед переносом фокуса
                setTimeout(() => {
                    if (addBrandButton) {
                        addBrandButton.focus();
                    }
                }, 300);
            }
        });
    } else {
        console.error('Форма добавления бренда не найдена');
    }
}

// Функция для отображения списка брендов
function renderBrands() {
    const brandsList = document.getElementById('brandsList');
    if (!brandsList) {
        console.error('Контейнер брендов не найден');
        return;
    }
    
    console.log('Обновляем список брендов');
    brandsList.innerHTML = '';
    
    if (!window.brands || window.brands.length === 0) {
        console.log('Список брендов пуст');
        return;
    }
    
    window.brands.forEach((brand) => {
        console.log(`Добавляем бренд в список: ${brand.name}`);
        
        const brandItem = document.createElement('div');
        brandItem.className = 'brand-item';
        brandItem.dataset.id = brand.id;
        brandItem.innerHTML = `
            <div class="toggle-section" data-id="${brand.id}">
                <div class="brand-name-container h3">
                    <span>${brand.name}</span>
                    <img src="img_src/chevron-down-green.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                </div>
                <button class="btn btn-danger btn-sm" data-id="${brand.id}">Удалить</button>
            </div>
            <div class="brand-sections-content">
                <ul class="list-group">
                    ${renderSections()}
                </ul>
            </div>
        `;
        brandsList.appendChild(brandItem);
        
        // Настраиваем обработчики событий для бренда
        setupBrandEvents(brandItem, brand.id);
    });
}

// Функция для рендеринга секций бренда
function renderSections() {
    const sections = [
        "Описание бренда", 
        "Тональность коммуникации", 
        "Логотипы", 
        "Цвета и цветовые стили", 
        "Типографика", 
        "Графические элементы"
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
                ${section === "Графические элементы" ? renderElementsSection() : ""}
                ${section === "Типографика" ? renderTypographySection() : ""}
            </div>
        </li>
    `).join('');
}

// Функция для рендеринга секции цветов
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

// Функция для рендеринга секции логотипов
function renderLogoSection() {
    return `
        <button class="btn btn-success mt-3 add-logo-btn" data-bs-toggle="modal" data-bs-target="#addLogoModal">Добавить логотип</button>
        <div class="logos-gallery mt-4">
            <!-- Галерея логотипов будет динамически добавляться -->
        </div>
    `;
}

// Функция для рендеринга секции элементов
function renderElementsSection() {
    return `
        <div class="mt-3">
            <button class="btn btn-primary add-element-btn">Добавить</button>
            <div class="element-gallery mt-3">
                <!-- Здесь будут отображаться добавленные элементы -->
            </div>
        </div>
    `;
}

// Функция для рендеринга секции типографики
function renderTypographySection() {
    return `
        <div class="typography-actions mt-3">
            <button class="btn btn-primary add-font-btn" data-bs-toggle="modal" data-bs-target="#addFontModal">Добавить шрифт</button>
            <button class="btn btn-primary add-style-btn" data-bs-toggle="modal" data-bs-target="#addStyleModal">Добавить набор стилей</button>
        </div>
        <div class="typography-content mt-3">
            <div class="fonts-block" id="fontsBlock" style="display: none;">
                <h3>Шрифты</h3>
                <div class="fonts-gallery" id="fontsGallery">
                    <!-- Шрифты будут добавляться здесь -->
                </div>
            </div>
            <div class="styles-block" id="stylesBlock" style="display: none;">
                <h3>Стили типографики</h3>
                <div class="styles-gallery" id="stylesGallery">
                    <!-- Стили типографики будут добавляться здесь -->
                </div>
            </div>
        </div>
    `;
}

// Настройка обработчиков событий для бренда
function setupBrandEvents(brandItem, brandId) {
    // Обработчик сворачивания/разворачивания бренда
    const toggleSection = brandItem.querySelector('.toggle-section');
    const brandContent = brandItem.querySelector('.brand-sections-content');
    const toggleIcon = toggleSection.querySelector('.section-toggle-icon');
    
    if (toggleSection && brandContent && toggleIcon) {
        toggleSection.addEventListener('click', function(e) {
            // Игнорируем клик по кнопке удаления
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const isVisible = brandContent.style.display === 'block';
            brandContent.style.display = isVisible ? 'none' : 'block';
            toggleIcon.src = isVisible ? 'img_src/chevron-down-green.svg' : 'img_src/chevron-up-green.svg';
        });
    }
    
    // Обработчик удаления бренда
    const deleteButton = brandItem.querySelector('.btn-danger');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            window.brands = window.brands.filter((brand) => brand.id !== brandId);
            renderBrands();
        });
    }
    
    // Добавляем обработчики для дочерних секций
    const sectionItems = brandItem.querySelectorAll('.section-item');
    sectionItems.forEach(item => {
        const sectionHeader = item.querySelector('.section-header');
        const sectionContent = item.querySelector('.section-content');
        const sectionIcon = sectionHeader ? sectionHeader.querySelector('.section-toggle-icon') : null;
        
        if (sectionHeader && sectionContent) {
            sectionHeader.addEventListener('click', () => {
                const isVisible = sectionContent.style.display === 'block';
                sectionContent.style.display = isVisible ? 'none' : 'block';
                
                if (sectionIcon) {
                    sectionIcon.src = isVisible ? 
                        'img_src/chevron-down-gray.svg' : 
                        'img_src/chevron-up-gray.svg';
                }
            });
        }
    });
    
    // Добавляем обработчик для кнопки "Добавить описание"
    const addDescriptionButtons = brandItem.querySelectorAll('.add-description-btn');
    if (addDescriptionButtons && addDescriptionButtons.length > 0) {
        addDescriptionButtons.forEach((button) => {
            if (button && !button.id) { // Только для кнопок без ID (не цветовые кнопки)
                button.addEventListener('click', (e) => {
                    const descriptionBlock = e.target.closest('.description-block');
                    if (descriptionBlock) {
                        const descriptionContent = descriptionBlock.querySelector('.description-content');
                        if (descriptionContent && typeof openEditor === 'function') {
                            openEditor(descriptionContent);
                        } else {
                            console.warn('Не удалось найти элемент description-content или функцию openEditor');
                        }
                    }
                });
            }
        });
    }
    
    // Настраиваем кнопки управления цветами
    setupColorButtons(brandItem);

    // Настраиваем кнопку добавления элементов
    const addElementButton = brandItem.querySelector('.add-element-btn');
    if (addElementButton) {
        addElementButton.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('addGraphicElementModal'));
            if (modal) {
                modal.show();
            }
        });
    }
    
    // Настраиваем кнопки для типографики
    setupTypographyButtons(brandItem);
}

// Настройка кнопок для работы с цветами
function setupColorButtons(brandItem) {
    // Кнопка добавления основного цвета
    const addColorButton = brandItem.querySelector('#addColor');
    if (addColorButton) {
        addColorButton.addEventListener('click', function() {
            const mainColorsBlock = brandItem.querySelector('#mainColorsBlock');
            if (mainColorsBlock) {
                mainColorsBlock.style.display = 'block';
            }
            
            const addColorModal = new bootstrap.Modal(document.getElementById('addColorModal'));
            if (addColorModal) {
                addColorModal.show();
            }
        });
    }
    
    // Кнопки для парных цветов и палитр настраиваются в модуле colors.js
}

// Функция для настройки кнопок типографики
function setupTypographyButtons(brandItem) {
    // Кнопка добавления шрифта
    const addFontButton = brandItem.querySelector('.add-font-btn');
    if (addFontButton) {
        addFontButton.addEventListener('click', function() {
            const fontsBlock = brandItem.querySelector('#fontsBlock');
            if (fontsBlock) {
                fontsBlock.style.display = 'block';
            }
            
            // Открытие модального окна для добавления шрифта будет происходить через data-bs-toggle
        });
    }
    
    // Кнопка добавления стиля
    const addStyleButton = brandItem.querySelector('.add-style-btn');
    if (addStyleButton) {
        addStyleButton.addEventListener('click', function() {
            const stylesBlock = brandItem.querySelector('#stylesBlock');
            if (stylesBlock) {
                stylesBlock.style.display = 'block';
            }
            
            // Открытие модального окна для добавления стиля будет происходить через data-bs-toggle
        });
    }
}

// Функция для получения ID активного бренда
function getActiveBrandId() {
    const activeBrandElement = document.querySelector('.brand-item .brand-sections-content[style*="display: block"]');
    if (activeBrandElement) {
        const brandItem = activeBrandElement.closest('.brand-item');
        if (brandItem && brandItem.dataset && brandItem.dataset.id) {
            return parseInt(brandItem.dataset.id, 10);
        }
    }
    
    // Если активный бренд не найден через открытую секцию, берем первый бренд
    const firstBrand = document.querySelector('.brand-item');
    if (firstBrand && firstBrand.dataset && firstBrand.dataset.id) {
        return parseInt(firstBrand.dataset.id, 10);
    }
    
    // Если все еще не нашли, используем первый бренд из массива данных
    if (window.brands && window.brands.length > 0) {
        return window.brands[0].id;
    }
    
    return null;
}

// Экспортируем функции
window.renderElementsSection = renderElementsSection;
window.renderTypographySection = renderTypographySection;
window.getActiveBrandId = getActiveBrandId;
