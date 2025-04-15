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

// Функция для рендеринга списка брендов
function renderBrands() {
    console.log("Начинаем рендеринг брендов:", window.brands);
    
    if (!window.brandsList) {
        window.brandsList = document.getElementById('brandsList');
        if (!window.brandsList) {
            console.error("Элемент brandsList не найден");
            return;
        }
    }
    
    // Сохраняем состояние открытых секций и содержимое описаний перед рендерингом
    const openBrands = [];
    const openSections = {};
    const sectionDescriptions = {};
    
    // Находим все открытые бренды и их секции
    document.querySelectorAll('.brand-item').forEach(brandItem => {
        const brandId = brandItem.dataset.id;
        const brandContent = brandItem.querySelector('.brand-sections-content');
        
        if (brandContent && brandContent.style.display === 'block') {
            openBrands.push(brandId);
            
            // Сохраняем открытые секции этого бренда
            const openSectionsInBrand = [];
            brandItem.querySelectorAll('.section-item').forEach(sectionItem => {
                const sectionType = sectionItem.dataset.section;
                const sectionContent = sectionItem.querySelector('.section-content');
                
                if (sectionContent && sectionContent.style.display === 'block') {
                    openSectionsInBrand.push(sectionType);
                }
                
                // Сохраняем содержимое описаний
                const descriptionContent = sectionItem.querySelector('.description-content');
                if (descriptionContent) {
                    sectionDescriptions[`${brandId}-${sectionType}`] = descriptionContent.innerHTML;
                }
            });
            
            openSections[brandId] = openSectionsInBrand;
        }
    });
    
    console.log("Сохраненные открытые бренды:", openBrands);
    console.log("Сохраненные открытые секции:", openSections);
    
    // Очищаем содержимое контейнера
    window.brandsList.innerHTML = "";
    
    if (!window.brands || !Array.isArray(window.brands) || window.brands.length === 0) {
        console.log("Нет брендов для отображения");
        return;
    }
    
    window.brands.forEach((brand) => {
        // Проверяем и инициализируем секции, если их нет
        if (!brand.sections) brand.sections = {};
        
        // Обязательные секции
        const requiredSections = [
            "brandDescription", 
            "communicationTone", 
            "logos", 
            "colors", 
            "typography", 
            "elements"
        ];
        
        // Проверяем и создаем секции только если их нет
        requiredSections.forEach(section => {
            if (!brand.sections[section]) {
                brand.sections[section] = { description: "" };
            }
            
            // Для секций с подэлементами
            if (section === "logos") {
                if (!brand.sections.logos.items) brand.sections.logos.items = [];
            } else if (section === "colors") {
                if (!brand.sections.colors.primary) brand.sections.colors.primary = [];
                if (!brand.sections.colors.paired) brand.sections.colors.paired = [];
                if (!brand.sections.colors.palettes) brand.sections.colors.palettes = [];
            } else if (section === "typography") {
                if (!brand.sections.typography.fonts) brand.sections.typography.fonts = [];
                if (!brand.sections.typography.styleSets) brand.sections.typography.styleSets = [];
            } else if (section === "elements") {
                if (!brand.sections.elements.items) brand.sections.elements.items = [];
            }
        });
        
        const brandItem = document.createElement("div");
        brandItem.className = "brand-item";
        brandItem.dataset.id = brand.id;
        
        // Создаем секцию бренда
        brandItem.innerHTML = `
            <div class="toggle-section" data-id="${brand.id}">
                <div class="brand-name-container">
                    <span>${brand.name}</span>
                    <img src="img_src/chevron-down-green.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                </div>
                <button type="button" class="btn btn-danger btn-sm delete-brand" data-id="${brand.id}">Удалить</button>
            </div>
            <div class="brand-sections-content">
                <ul class="list-group">
                    ${renderSections(brand)}
                </ul>
            </div>
        `;
        
        window.brandsList.appendChild(brandItem);
        
        // Восстанавливаем состояние раскрытых/свернутых секций
        const isBrandOpen = openBrands.includes(brand.id.toString());
        const brandContent = brandItem.querySelector(".brand-sections-content");
        const toggleIcon = brandItem.querySelector(".toggle-section .section-toggle-icon");
        
        if (isBrandOpen && brandContent && toggleIcon) {
            brandContent.style.display = "block";
            toggleIcon.src = "img_src/chevron-up-green.svg";
            
            // Восстанавливаем открытые секции
            const sectionsToOpen = openSections[brand.id] || [];
            brandItem.querySelectorAll(".section-item").forEach(sectionItem => {
                const sectionType = sectionItem.dataset.section;
                if (sectionsToOpen.includes(sectionType)) {
                    const sectionContent = sectionItem.querySelector(".section-content");
                    const sectionIcon = sectionItem.querySelector(".section-toggle-icon");
                    if (sectionContent) {
                        sectionContent.style.display = "block";
                        if (sectionIcon) {
                            sectionIcon.src = "img_src/chevron-up-gray.svg";
                        }
                    }
                }
                
                // Восстанавливаем описания
                const descKey = `${brand.id}-${sectionType}`;
                const savedDescription = sectionDescriptions[descKey];
                if (savedDescription) {
                    const descriptionContent = sectionItem.querySelector(".description-content");
                    if (descriptionContent) {
                        descriptionContent.innerHTML = savedDescription;
                        
                        // Также обновляем данные в объекте бренда
                        if (brand.sections[sectionType]) {
                            brand.sections[sectionType].description = savedDescription;
                        }
                        
                        // Обновляем текст кнопки
                        const addDescButton = sectionItem.querySelector(".add-description-btn");
                        if (addDescButton) {
                            addDescButton.textContent = savedDescription ? 'Редактировать описание' : 'Добавить описание';
                        }
                    }
                }
            });
        }
        
        // Добавляем обработчики для сворачивания/разворачивания секций бренда
        setupSectionHandlers(brandItem, brand);
    });
    
    console.log("Рендеринг брендов завершен");
}

// Функция для рендеринга секций бренда
function renderSections(brand) {
    if (!brand || !brand.sections) {
        console.warn("Бренд или его секции отсутствуют");
        return "";
    }
    
    // Определяем все возможные секции
    const sections = [
        { id: "brandDescription", name: "Описание бренда" },
        { id: "communicationTone", name: "Тональность коммуникации" },
        { id: "logos", name: "Логотипы" },
        { id: "colors", name: "Цвета и цветовые стили" },
        { id: "typography", name: "Типографика" },
        { id: "elements", name: "Графические элементы" }
    ];
    
    return sections.map(section => {
        // Проверяем наличие секции и описания
        const sectionData = brand.sections[section.id] || { description: "" };
        const description = sectionData.description || "";
        
        // Создаем HTML для секции
        return `
            <li class="list-group-item section-item" data-section="${section.id}">
                <div class="section-header">
                    <div class="section-title">
                        <span>${section.name}</span>
                        <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                    </div>
                </div>
                <div class="section-content" style="display: none;">
                    <div class="description-block">
                        <div class="description-content formatted-description">${description}</div>
                        <button class="add-description-btn btn btn-primary">
                            ${description ? 'Редактировать описание' : 'Добавить описание'}
                        </button>
                    </div>
                    ${section.id === "logos" ? renderLogoSection(brand) : ""}
                    ${section.id === "colors" ? renderColorsSection(brand) : ""}
                    ${section.id === "typography" ? renderTypographySection(brand) : ""}
                    ${section.id === "elements" ? renderElementsSection(brand) : ""}
                </div>
            </li>
        `;
    }).join('');
}

// Функция для рендеринга раздела логотипов
function renderLogoSection(brand) {
    if (!brand || !brand.sections || !brand.sections.logos) {
        return '';
    }

    let logosHTML = `
        <div class="logo-actions mt-3">
            <button class="add-description-btn btn btn-primary" id="addLogoBtn" data-bs-toggle="modal" data-bs-target="#addLogoModal">Добавить логотип</button>
        </div>
        <div class="logos-gallery">`;
    
    // Проверяем наличие массива логотипов и добавляем их в галерею
    if (brand.sections.logos.items && brand.sections.logos.items.length > 0) {
        brand.sections.logos.items.forEach(logo => {
            logosHTML += `
                <div class="logo-card" data-id="${logo.id}">
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
                </div>
            `;
        });
    }
    
    logosHTML += '</div>';
    return logosHTML;
}

// Функция для рендеринга раздела цветов
function renderColorsSection(brand) {
    if (!brand || !brand.sections || !brand.sections.colors) {
        return '';
    }

    let colorsHTML = `
        <div class="color-actions mt-3">
            <button class="add-description-btn btn btn-primary" id="addColor" data-bs-toggle="modal" data-bs-target="#addColorModal">Добавить цвет</button>
            <button class="add-description-btn btn btn-primary" id="addPairedColors" data-bs-toggle="modal" data-bs-target="#addPairedColorsModal">Добавить парные цвета</button>
            <button class="add-description-btn btn btn-primary" id="addPalette" data-bs-toggle="modal" data-bs-target="#addPaletteModal">Добавить палитру</button>
        </div>
        <div id="colorBlocks">`;
    
    // Основные цвета
    colorsHTML += `
        <div class="color-block" id="mainColorsBlock" ${brand.sections.colors.primary && brand.sections.colors.primary.length > 0 ? '' : 'style="display: none;"'}>
            <h3>Основные и дополнительные цвета</h3>
            <div class="color-gallery" id="mainColorsGallery">`;
    
    if (brand.sections.colors.primary && brand.sections.colors.primary.length > 0) {
        brand.sections.colors.primary.forEach(color => {
            colorsHTML += `
                <div class="color-card" data-hex="${color.hex}">
                    <div class="color-preview" style="background-color: ${color.hex}"></div>
                    <div class="color-info">
                        <span class="color-hex">${color.hex}</span>
                    </div>
                    <button class="delete-color-btn">
                        <img src="img_src/x-icon.svg" alt="Удалить">
                    </button>
                </div>
            `;
        });
    }
    
    colorsHTML += `</div></div>`;
    
    // Парные цвета
    colorsHTML += `
        <div class="color-block" id="pairedColorsBlock" ${brand.sections.colors.paired && brand.sections.colors.paired.length > 0 ? '' : 'style="display: none;"'}>
            <h3>Парные цвета</h3>
            <div class="paired-colors-gallery" id="pairedColorsGallery">`;
    
    if (brand.sections.colors.paired && brand.sections.colors.paired.length > 0) {
        brand.sections.colors.paired.forEach(pair => {
            colorsHTML += `
                <div class="paired-color-card">
                    <div class="paired-color-header">
                        <div class="paired-color-item">
                            <div>Цвет фона</div>
                            <div class="paired-color-preview" style="background: ${pair.backgroundColor}"></div>
                            <div>${pair.backgroundColor}</div>
                        </div>
                        <div class="paired-color-item">
                            <div>Цвет текста</div>
                            <div class="paired-color-preview" style="background: ${pair.textColor}"></div>
                            <div>${pair.textColor}</div>
                        </div>
                    </div>
                    <div class="paired-color-sample" style="background-color: ${pair.backgroundColor}; color: ${pair.textColor}">Sample text</div>
                    <div class="paired-color-inversion">${pair.allowInversion ? "✅ инверсия допустима" : "❌ инверсия недопустима"}</div>
                    ${pair.allowInversion ? `
                    <div class="paired-color-inverted">
                        <div class="paired-color-header">
                            <div class="paired-color-item">
                                <div>Цвет фона</div>
                                <div class="paired-color-preview" style="background: ${pair.textColor}"></div>
                                <div>${pair.textColor}</div>
                            </div>
                            <div class="paired-color-item">
                                <div>Цвет текста</div>
                                <div class="paired-color-preview" style="background: ${pair.backgroundColor}"></div>
                                <div>${pair.backgroundColor}</div>
                            </div>
                        </div>
                        <div class="paired-color-sample" style="background-color: ${pair.textColor}; color: ${pair.backgroundColor}">Sample text</div>
                    </div>
                    ` : ''}
                    <button class="paired-color-delete">Удалить</button>
                </div>
            `;
        });
    }
    
    colorsHTML += `</div></div>`;
    
    // Палитры цветов
    colorsHTML += `
        <div class="color-block" id="palettesBlock" ${brand.sections.colors.palettes && brand.sections.colors.palettes.length > 0 ? '' : 'style="display: none;"'}>
            <h3>Палитры цветов</h3>
            <div class="palettes-gallery" id="palettesGallery">`;
    
    if (brand.sections.colors.palettes && brand.sections.colors.palettes.length > 0) {
        brand.sections.colors.palettes.forEach(palette => {
            colorsHTML += `
                <div class="palette-card" data-id="${palette.id}">
                    ${palette.name ? `<div class="palette-name">${palette.name}</div>` : ''}
                    <div class="palette-colors">`;
            
            palette.colors.forEach(color => {
                colorsHTML += `
                    <div class="palette-color-item">
                        <div class="palette-color-circle" style="background-color: ${color}"></div>
                        <div class="palette-color-hex">${color}</div>
                    </div>
                `;
            });
            
            colorsHTML += `
                    </div>
                    <button class="delete-palette-btn">
                        <img src="img_src/x-icon.svg" alt="Удалить" width="12" height="12">
                    </button>
                </div>
            `;
        });
    }
    
    colorsHTML += `</div></div>`;
    
    colorsHTML += '</div>'; // Закрываем colorBlocks
    return colorsHTML;
}

// Функция для рендеринга раздела типографики
function renderTypographySection(brand) {
    if (!brand || !brand.sections || !brand.sections.typography) {
        return '';
    }

    let typographyHTML = `
        <div class="typography-actions1 mt-3">
            <button class="add-description-btn btn btn-primary" id="addFont" data-bs-toggle="modal" data-bs-target="#addFontModal">Добавить шрифт</button>
            <button class="add-description-btn btn btn-primary" id="addStyleSet" data-bs-toggle="modal" data-bs-target="#addStyleSetModal">Добавить набор стилей</button>
        </div>
        <div class="typography-content mt-3">`;
    
    // Шрифты
    const fontsBlockId = `fontsBlock-${brand.id}`;
    typographyHTML += `
        <div class="fonts-block" id="${fontsBlockId}" ${brand.sections.typography.fonts && brand.sections.typography.fonts.length > 0 ? '' : 'style="display: none;"'}>
            <h3>Добавленные шрифты</h3>
            <div class="fonts-list">`;
    
    if (brand.sections.typography.fonts && brand.sections.typography.fonts.length > 0) {
        brand.sections.typography.fonts.forEach(font => {
            typographyHTML += `
                <div class="font-item" data-id="${font.id}">
                    <div class="font-info">
                        <div class="font-name font-type-${font.type.toLowerCase()} ${font.isItalic ? 'font-italic' : ''}">${font.family} ${font.type}</div>
                        ${font.isItalic ? '<div class="font-tag">Italic</div>' : ''}
                    </div>
                    <div class="font-actions">
                        <button class="download-font-btn" title="Скачать шрифт">
                            <img src="img_src/download-icon.svg" alt="Скачать">
                        </button>
                        <button class="delete-font-btn" title="Удалить шрифт" data-id="${font.id}">
                            <img src="img_src/trash-icon.svg" alt="Удалить">
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    typographyHTML += `</div></div>`;
    
    // Наборы стилей
    typographyHTML += `
        <div class="typography-section" id="styleSetsBlock" ${brand.sections.typography.styleSets && brand.sections.typography.styleSets.length > 0 ? '' : 'style="display: none;"'}>
            <h3>Наборы стилей</h3>
            <div class="style-sets-gallery" id="styleSetsGallery">`;
    
    if (brand.sections.typography.styleSets && brand.sections.typography.styleSets.length > 0) {
        brand.sections.typography.styleSets.forEach(styleSet => {
            typographyHTML += `
                <div class="style-set-card" data-id="${styleSet.id}">
                    <h4>${styleSet.name}</h4>
                    <div class="style-set-styles">`;
            
            if (styleSet.styles && styleSet.styles.length > 0) {
                styleSet.styles.forEach(style => {
                    // Найдем шрифт для этого стиля
                    const font = brand.sections.typography.fonts.find(f => f.id === style.fontId);
                    let fontFaceRule = '';
                    
                    if (font) {
                        fontFaceRule = `
                            @font-face {
                                font-family: '${font.family}-${font.id}';
                                src: url('${font.base64}') format('woff');
                                font-weight: ${font.type === 'Bold' ? 'bold' : 'normal'};
                                font-style: ${font.isItalic ? 'italic' : 'normal'};
                            }
                        `;
                    }
                    
                    typographyHTML += `
                        <div class="style-item" data-id="${style.id}">
                            <style>${fontFaceRule}</style>
                            <div class="style-preview" style="
                                font-family: '${font ? font.family + '-' + font.id : 'sans-serif'}';
                                font-size: ${style.fontSize}px;
                                line-height: ${style.lineHeight}px;
                                ${style.isItalic ? 'font-style: italic;' : ''}
                            ">
                                Пример текста
                            </div>
                            <div class="style-info">
                                <span>${font ? font.family + ' ' + font.type : 'Шрифт не найден'}, ${style.fontSize}px/${style.lineHeight}px</span>
                                <button class="delete-style-btn" data-id="${style.id}">Удалить</button>
                            </div>
                        </div>
                    `;
                });
            }
            
            typographyHTML += `
                    </div>
                    <div class="style-set-actions">
                        <button class="add-style-to-set-btn btn btn-sm btn-primary" data-set-id="${styleSet.id}" data-bs-toggle="modal" data-bs-target="#addStyleToSetModal">Добавить стиль</button>
                        <button class="delete-style-set-btn btn btn-sm btn-danger" data-id="${styleSet.id}">Удалить набор</button>
                    </div>
                </div>
            `;
        });
    }
    
    typographyHTML += `</div></div>`;
    
    typographyHTML += '</div>'; // Закрываем typography-content
    return typographyHTML;
}

// Функция для рендеринга раздела графических элементов
function renderElementsSection(brand) {
    console.log(`[brands.js] -> renderElementsSection: Рендеринг секции элементов для бренда ID: ${brand.id}`);
    if (!brand || !brand.sections || !brand.sections.elements) {
        console.warn(`[brands.js] -> renderElementsSection: Нет данных для секции элементов у бренда ID: ${brand.id}`);
        return '';
    }

    let elementsHTML = `
        <div class="elements-actions mt-3">
            <button class="add-description-btn btn btn-primary" id="addElementBtn" data-bs-toggle="modal" data-bs-target="#addElementModal">Добавить элемент</button>
        </div>
        <div class="elements-gallery">`;
    
    if (brand.sections.elements.items && brand.sections.elements.items.length > 0) {
        console.log(`[brands.js] -> renderElementsSection: Найдено ${brand.sections.elements.items.length} элементов.`);
        brand.sections.elements.items.forEach((element, index) => {
            console.log(`[brands.js] -> renderElementsSection: Обработка элемента ${index + 1} (ID: ${element.id})`);
            console.log(`  - Данные элемента:`, JSON.parse(JSON.stringify(element))); // Логируем копию объекта

            // Убедимся, что тип элемента существует и не пустой
            let elementType = (element.type || '').trim(); // Используем 'type', а не 'name'
            let elementTypeClass = '';
            
            if (elementType) {
                elementTypeClass = elementType.replace(/\s+/g, '-'); // Генерируем класс только если тип есть
                console.log(`  - Тип элемента определен: "${elementType}", Класс для CSS: "${elementTypeClass}"`);
            } else {
                console.warn(`  - ВНИМАНИЕ: Тип элемента (element.type) пуст или отсутствует для элемента ID: ${element.id}`);
                elementType = ''; // Устанавливаем в пустую строку, если тип не определен
            }
            
            // Корректно форматируем теги
            let tagsHtml = '';
            if (element.tags && Array.isArray(element.tags) && element.tags.length > 0) {
                tagsHtml = element.tags.map(tag => `<span class="element-tag">${tag}</span>`).join('');
            }
            
            // Формируем HTML для карточки
            const cardHTML = `
                <div class="element-card" data-id="${element.id}">
                    <div class="element-preview">
                        <img src="${element.image}" alt="${element.fileName || 'element preview'}">
                    </div>
                    <div class="element-info">
                        <div class="element-type ${elementTypeClass}">${elementType}</div> 
                        <div class="element-tags">
                            ${tagsHtml}
                        </div>
                        <div class="element-description-link">
                            Подробнее
                            <div class="tooltip-text">${element.description || 'Нет описания'}</div>
                        </div>
                    </div>
                    <button class="delete-element-btn" title="Удалить элемент" data-id="${element.id}">
                        <img src="img_src/trash-icon.svg" alt="Удалить">
                    </button>
                </div>
            `;
            
            // Проверяем, содержит ли сгенерированный HTML блок типа
            if (!cardHTML.includes('<div class="element-type')) {
                 console.error(`  - ОШИБКА: В сгенерированном HTML для карточки ID ${element.id} отсутствует блок <div class="element-type...">`);
            } else if (elementType === '' && cardHTML.includes('<div class="element-type "')) {
                 console.log(`  - INFO: Блок <div class="element-type"> рендерится, но он пуст, так как тип элемента не задан.`);
            } else if (elementType !== '') {
                 console.log(`  - INFO: Блок <div class="element-type ${elementTypeClass}">${elementType}</div> успешно добавлен в HTML.`);
            }

            elementsHTML += cardHTML;
        });
    } else {
         console.log(`[brands.js] -> renderElementsSection: Элементы не найдены (brand.sections.elements.items пуст или отсутствует).`);
    }
    
    elementsHTML += '</div>';
    return elementsHTML;
}

// Функция настройки обработчиков для секций
function setupSectionHandlers(brandItem, brand) {
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
    const deleteButton = brandItem.querySelector('.delete-brand');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            const brandId = parseInt(this.dataset.id);
            window.brands = window.brands.filter(b => b.id !== brandId);
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
    
    // Настройка кнопок добавления описания
    const addDescriptionButtons = brandItem.querySelectorAll(".add-description-btn");
    if (addDescriptionButtons && addDescriptionButtons.length > 0) {
        addDescriptionButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Проверяем, не является ли кнопка одной из кнопок действий с цветами
                if (button.id === 'addColor' || button.id === 'addPairedColors' || button.id === 'addPalette' || 
                    button.id === 'addLogoBtn' || button.id === 'addFont' || button.id === 'addStyleSet' || 
                    button.id === 'addElementBtn') {
                    // Если это кнопка действий, не открываем редактор описания
                    return;
                }

                const descriptionBlock = button.closest(".description-block");
                // Добавляем проверку на существование descriptionBlock
                if (descriptionBlock) {
                    const descriptionContent = descriptionBlock.querySelector(".description-content");
                    
                    if (descriptionContent && window.openEditor) {
                        window.openEditor(descriptionContent, (newContent) => {
                            // Определяем тип секции
                            const sectionItem = button.closest(".section-item");
                            const sectionType = sectionItem ? sectionItem.dataset.section : null;
                            
                            // Сохраняем описание в данные бренда
                            if (sectionType && brand.sections && brand.sections[sectionType]) {
                                console.log(`Сохраняем описание для секции ${sectionType}:`, newContent);
                                brand.sections[sectionType].description = newContent;
                                
                                // Обновляем текст кнопки
                                button.textContent = newContent ? 'Редактировать описание' : 'Добавить описание';
                            }
                        });
                    }
                } else {
                    console.log("Блок описания не найден для кнопки:", button);
                }
            });
        });
    }
    
    // Добавляем обработчики для загруженных элементов
    setupLoadedElementsHandlers(brandItem, brand);
}

// Функция для настройки обработчиков загруженных элементов
function setupLoadedElementsHandlers(brandItem, brand) {
    // Логотипы
    const deleteLogoBtns = brandItem.querySelectorAll('.delete-logo-btn');
    deleteLogoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const logoId = parseInt(this.getAttribute('data-id'), 10);
            const logoIndex = brand.sections.logos.items.findIndex(logo => logo.id === logoId);
            
            if (logoIndex !== -1) {
                brand.sections.logos.items.splice(logoIndex, 1);
                this.closest('.logo-card').remove();
                
                if (brand.sections.logos.items.length === 0) {
                    brandItem.querySelector('.logos-gallery').innerHTML = '';
                }
            }
        });
    });

    // Цвета
    const deleteColorBtns = brandItem.querySelectorAll('.delete-color-btn');
    deleteColorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const colorHex = this.closest('.color-card').getAttribute('data-hex');
            const colorIndex = brand.sections.colors.primary.findIndex(color => color.hex === colorHex);
            
            if (colorIndex !== -1) {
                brand.sections.colors.primary.splice(colorIndex, 1);
                this.closest('.color-card').remove();
                
                if (brand.sections.colors.primary.length === 0) {
                    brandItem.querySelector('#mainColorsBlock').style.display = 'none';
                }
            }
        });
    });

    // Парные цвета
    const deletePairedColorBtns = brandItem.querySelectorAll('.paired-color-delete');
    deletePairedColorBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (brand.sections.colors.paired && brand.sections.colors.paired.length > index) {
                brand.sections.colors.paired.splice(index, 1);
                this.closest('.paired-color-card').remove();
                
                if (brand.sections.colors.paired.length === 0) {
                    brandItem.querySelector('#pairedColorsBlock').style.display = 'none';
                }
            }
        });
    });

    // Палитры
    const deletePaletteBtns = brandItem.querySelectorAll('.delete-palette-btn');
    deletePaletteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const paletteId = parseInt(this.closest('.palette-card').getAttribute('data-id'), 10);
            const paletteIndex = brand.sections.colors.palettes.findIndex(palette => palette.id === paletteId);
            
            if (paletteIndex !== -1) {
                brand.sections.colors.palettes.splice(paletteIndex, 1);
                this.closest('.palette-card').remove();
                
                if (brand.sections.colors.palettes.length === 0) {
                    brandItem.querySelector('#palettesBlock').style.display = 'none';
                }
            }
        });
    });

    // Шрифты
    const deleteFontBtns = brandItem.querySelectorAll('.delete-font-btn');
    deleteFontBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fontId = parseInt(this.getAttribute('data-id'), 10);
            const fontIndex = brand.sections.typography.fonts.findIndex(font => font.id === fontId);
            
            if (fontIndex !== -1) {
                brand.sections.typography.fonts.splice(fontIndex, 1);
                this.closest('.font-item').remove();
                
                if (brand.sections.typography.fonts.length === 0) {
                    const fontsBlockId = `fontsBlock-${brand.id}`;
                    brandItem.querySelector(`#${fontsBlockId}`).style.display = 'none';
                }
            }
        });
    });

    // Наборы стилей и стили в наборах
    const deleteStyleSetBtns = brandItem.querySelectorAll('.delete-style-set-btn');
    deleteStyleSetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const setId = parseInt(this.getAttribute('data-id'), 10);
            const setIndex = brand.sections.typography.styleSets.findIndex(set => set.id === setId);
            
            if (setIndex !== -1) {
                brand.sections.typography.styleSets.splice(setIndex, 1);
                this.closest('.style-set-card').remove();
                
                if (brand.sections.typography.styleSets.length === 0) {
                    brandItem.querySelector('#styleSetsBlock').style.display = 'none';
                }
            }
        });
    });

    const deleteStyleBtns = brandItem.querySelectorAll('.delete-style-btn');
    deleteStyleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const styleId = parseInt(this.getAttribute('data-id'), 10);
            const setId = parseInt(this.closest('.style-set-card').getAttribute('data-id'), 10);
            
            const setIndex = brand.sections.typography.styleSets.findIndex(set => set.id === setId);
            if (setIndex !== -1) {
                const styleIndex = brand.sections.typography.styleSets[setIndex].styles.findIndex(style => style.id === styleId);
                if (styleIndex !== -1) {
                    brand.sections.typography.styleSets[setIndex].styles.splice(styleIndex, 1);
                    this.closest('.style-item').remove();
                }
            }
        });
    });

    // Кнопки добавления стиля в набор
    const addStyleToSetBtns = brandItem.querySelectorAll('.add-style-to-set-btn');
    addStyleToSetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const setId = parseInt(this.getAttribute('data-set-id'), 10);
            // Сохраняем ID набора в глобальную переменную для использования в модальном окне
            window.currentStyleSetId = setId;
        });
    });

    // Графические элементы
    const deleteElementBtns = brandItem.querySelectorAll('.delete-element-btn');
    deleteElementBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const elementId = parseInt(this.getAttribute('data-id'), 10);
            const elementIndex = brand.sections.elements.items.findIndex(element => element.id === elementId);
            
            if (elementIndex !== -1) {
                brand.sections.elements.items.splice(elementIndex, 1);
                this.closest('.element-card').remove();
            }
        });
    });
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

// Экспортируем функцию getCurrentBrand в глобальный контекст
window.getCurrentBrand = function() {
    // Проверяем наличие активного бренда по открытой секции
    const activeSection = document.querySelector('.brand-sections-content[style*="display: block"]');
    if (activeSection) {
        const brandItem = activeSection.closest('.brand-item');
        if (brandItem && brandItem.dataset && brandItem.dataset.id) {
            const brandId = parseInt(brandItem.dataset.id, 10);
            return window.brands.find(brand => brand.id === brandId);
        }
    }
    
    // Если активный класс не найден через открытую секцию, берем первый бренд из списка
    const firstBrandElement = document.querySelector('.brand-item');
    if (firstBrandElement && firstBrandElement.dataset && firstBrandElement.dataset.id) {
        const brandId = parseInt(firstBrandElement.dataset.id, 10);
        return window.brands.find(brand => brand.id === brandId);
    }
    
    // Если все еще не нашли, используем первый бренд из массива данных
    if (window.brands && window.brands.length > 0) {
        return window.brands[0];
    }
    
    return null;
};

// Экспортируем функции для использования в других модулях
window.renderBrands = renderBrands;
window.renderLogoSection = renderLogoSection;
window.renderColorsSection = renderColorsSection;
window.renderTypographySection = renderTypographySection;
window.renderElementsSection = renderElementsSection;
window.setupLoadedElementsHandlers = setupLoadedElementsHandlers;
window.getActiveBrandId = getActiveBrandId;

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initBrands();
});
