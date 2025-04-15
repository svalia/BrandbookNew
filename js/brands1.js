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
    const sections = [scription", name: "Описание бренда" },
        { id: "brandDescription", name: "Описание бренда" },икации" },
        { id: "communicationTone", name: "Тональность коммуникации" },
        { id: "logos", name: "Логотипы" },товые стили" },
        { id: "colors", name: "Цвета и цветовые стили" },
        { id: "typography", name: "Типографика" },нты" }
        { id: "elements", name: "Графические элементы" }
    ];
    return sections.map(section => {
    return sections.map(section => {и описания
        // Проверяем наличие секции и описанияtion.id] || { description: "" };
        const sectionData = brand.sections[section.id] || { description: "" };
        const description = sectionData.description || "";
        // Создаем HTML для секции
        // Создаем HTML для секции
        return `class="list-group-item section-item" data-section="${section.id}">
            <li class="list-group-item section-item" data-section="${section.id}">
                <div class="section-header">e">
                    <div class="section-title">span>
                        <span>${section.name}</span>wn-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                    </div>
                </div>lass="section-content" style="display: none;">
                <div class="section-content" style="display: none;">
                    <div class="description-block">tent formatted-description">${description}</div>
                        <div class="description-content formatted-description">${description}</div>
                        <button class="add-description-btn btn btn-primary">вить описание'}
                            ${description ? 'Редактировать описание' : 'Добавить описание'}
                        </button>
                    </div>ion.id === "logos" ? renderLogoSection(brand) : ""}
                    ${section.id === "logos" ? renderLogoSection() : ""}d) : ""}
                    ${section.id === "colors" ? renderColorsSection(brand) : ""}d) : ""}
                    ${section.id === "typography" ? renderTypographySection() : ""}}
                    ${section.id === "elements" ? renderElementsSection() : ""}
                </div>
            </li>
        `;n('');
    }).join('');
}
// Функция для рендеринга раздела логотипов
// Функция для создания раздела цветов
function renderColorsSection(brand) {!brand.sections.logos) {
    return `rn '';
        <div class="color-actions mt-3">
            <button class="add-description-btn btn btn-primary" id="addColor">Добавить цвет</button>
            <button class="add-description-btn btn btn-primary" id="addPairedColors">Добавить парные цвета</button>
            <button class="add-description-btn btn btn-primary" id="addPalette">Добавить палитру</button>
        </div>utton class="add-description-btn btn btn-primary" id="addLogoBtn" data-bs-toggle="modal" data-bs-target="#addLogoModal">Добавить логотип</button>
        <div id="colorBlocks">
            <div class="color-block" id="mainColorsBlock" style="display: none;">
                <h3>Основные и дополнительные цвета</h3>
                <div class="color-gallery" id="mainColorsGallery">ю
                    <!-- Карточки цветов будут добавляться здесь -->gth > 0) {
                </div>.logos.items.forEach(logo => {
            </div>TML += `
            <div class="color-block" id="pairedColorsBlock" style="display: none;">
                <h3>Парные цвета</h3>preview">
                <div class="paired-colors-gallery" id="pairedColorsGallery">="max-width: 100%; max-height: 120px;">
                    <!-- Карточки парных цветов будут добавляться здесь -->
                </div>pan class="logo-filename">${logo.fileName}</span>
            </div>  <div class="logo-details">
            <div class="color-block" id="palettesBlock" style="display: none;">
                <h3>Палитры цветов</h3>strong> ${logo.properties.language}<br>
                <div class="palettes-gallery" id="palettesGallery">e}<br>
                    <!-- Карточки палитр будут добавляться здесь -->es.orientation}
                </div>div>
            </div>  <div class="logo-calculated-values">
        </div>          <small><strong>Размеры:</strong> ${logo.properties.width || 0}×${logo.properties.height || 0}px</small><br>
    `;                  <small><strong>Половина ширины иконки:</strong> ${logo.properties.calculatedIconWidth?.toFixed(3) || '0.000'}%</small><br>
}                       <small><strong>Охранное поле:</strong> ${logo.properties.calculatedSafeZone?.toFixed(3) || '0.000'}%</small>
                    </div>
// Функция настройки обработчиков для секцийgo-btn" data-id="${logo.id}">
function setupSectionHandlers(brandItem, brand) {con.svg" alt="Delete" class="delete-icon">
    // Обработчик сворачивания/разворачивания бренда
    const toggleSection = brandItem.querySelector('.toggle-section');
    const brandContent = brandItem.querySelector('.brand-sections-content');
    const toggleIcon = toggleSection.querySelector('.section-toggle-icon');
    }
    if (toggleSection && brandContent && toggleIcon) {
        toggleSection.addEventListener('click', function(e) {
            // Игнорируем клик по кнопке удаления
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }я рендеринга раздела цветов
            derColorsSection(brand) {
            const isVisible = brandContent.style.display === 'block';
            brandContent.style.display = isVisible ? 'none' : 'block';
            toggleIcon.src = isVisible ? 'img_src/chevron-down-green.svg' : 'img_src/chevron-up-green.svg';
        });
    }et colorsHTML = `
        <div class="color-actions mt-3">
    // Обработчик удаления брендаscription-btn btn btn-primary" id="addColor" data-bs-toggle="modal" data-bs-target="#addColorModal">Добавить цвет</button>
    const deleteButton = brandItem.querySelector('.btn-danger');id="addPairedColors" data-bs-toggle="modal" data-bs-target="#addPairedColorsModal">Добавить парные цвета</button>
    if (deleteButton) {ss="add-description-btn btn btn-primary" id="addPalette" data-bs-toggle="modal" data-bs-target="#addPaletteModal">Добавить палитру</button>
        deleteButton.addEventListener('click', function() {
            window.brands = window.brands.filter((brand) => brand.id !== brand.id);
            renderBrands();
        });вные цвета
    }olorsHTML += `
        <div class="color-block" id="mainColorsBlock" ${brand.sections.colors.primary && brand.sections.colors.primary.length > 0 ? '' : 'style="display: none;"'}>
    // Добавляем обработчики для дочерних секций/h3>
    const sectionItems = brandItem.querySelectorAll('.section-item');
    sectionItems.forEach(item => {
        const sectionHeader = item.querySelector('.section-header');ry.length > 0) {
        const sectionContent = item.querySelector('.section-content');
        const sectionIcon = sectionHeader ? sectionHeader.querySelector('.section-toggle-icon') : null;
                <div class="color-card" data-hex="${color.hex}">
        if (sectionHeader && sectionContent) { style="background-color: ${color.hex}"></div>
            sectionHeader.addEventListener('click', () => {
                const isVisible = sectionContent.style.display === 'block';
                sectionContent.style.display = isVisible ? 'none' : 'block';
                    <button class="delete-color-btn">
                if (sectionIcon) {img_src/x-icon.svg" alt="Удалить">
                    sectionIcon.src = isVisible ? 
                        'img_src/chevron-down-gray.svg' : 
                        'img_src/chevron-up-gray.svg';
                }
            });
        }
    });orsHTML += `</div></div>`;
    
    // Настройка кнопок добавления описания
    const addDescriptionButtons = brandItem.querySelectorAll(".add-description-btn");
    if (addDescriptionButtons && addDescriptionButtons.length > 0) {ions.colors.paired && brand.sections.colors.paired.length > 0 ? '' : 'style="display: none;"'}>
        addDescriptionButtons.forEach(button => {
            button.addEventListener("click", () => {airedColorsGallery">`;
                // Проверяем, не является ли кнопка одной из кнопок действий с цветами
                if (button.id === 'addColor' || button.id === 'addPairedColors' || button.id === 'addPalette') {
                    // Если это кнопка действий с цветами, не открываем редактор описания
                    return;
                }div class="paired-color-card">
                    <div class="paired-color-header">
                const descriptionBlock = button.closest(".description-block");
                // Добавляем проверку на существование descriptionBlock
                if (descriptionBlock) {"paired-color-preview" style="background: ${pair.backgroundColor}"></div>
                    const descriptionContent = descriptionBlock.querySelector(".description-content");
                        </div>
                    if (descriptionContent && window.openEditor) {
                        window.openEditor(descriptionContent, (newContent) => {
                            // Определяем тип секции-preview" style="background: ${pair.textColor}"></div>
                            const sectionItem = button.closest(".section-item");
                            const sectionType = sectionItem ? sectionItem.dataset.section : null;
                            
                            // Сохраняем описание в данные брендаround-color: ${pair.backgroundColor}; color: ${pair.textColor}">Sample text</div>
                            if (sectionType && brand.sections && brand.sections[sectionType]) {устима" : "❌ инверсия недопустима"}</div>
                                console.log(`Сохраняем описание для секции ${sectionType}:`, newContent);
                                brand.sections[sectionType].description = newContent;
                                ss="paired-color-header">
                                // Обновляем текст кнопки">
                                button.textContent = newContent ? 'Редактировать описание' : 'Добавить описание';
                            }   <div class="paired-color-preview" style="background: ${pair.textColor}"></div>
                        });     <div>${pair.textColor}</div>
                    }       </div>
                } else {    <div class="paired-color-item">
                    console.log("Блок описания не найден для кнопки:", button);
                }               <div class="paired-color-preview" style="background: ${pair.backgroundColor}"></div>
            });                 <div>${pair.backgroundColor}</div>
        });                 </div>
    }                   </div>
                       <div class="paired-color-sample" style="background-color: ${pair.textColor}; color: ${pair.backgroundColor}">Sample text</div>
    // Добавляем обработчики для загруженных элементов                    </div>
    setupLoadedElementsHandlers(brandItem, brand);
}ss="paired-color-delete">Удалить</button>
    </div>
// Функция для настройки обработчиков загруженных элементов
function setupLoadedElementsHandlers(brandItem, brand) {
    // Логотипы
    const deleteLogoBtns = brandItem.querySelectorAll('.delete-logo-btn');
    deleteLogoBtns.forEach(btn => { += `</div></div>`;
        btn.addEventListener('click', function() {
            const logoId = parseInt(this.getAttribute('data-id'), 10);
            const logoIndex = brand.sections.logos.items.findIndex(logo => logo.id === logoId);
            ns.colors.palettes && brand.sections.colors.palettes.length > 0 ? '' : 'style="display: none;"'}>
            if (logoIndex !== -1) {
                brand.sections.logos.items.splice(logoIndex, 1);="palettes-gallery" id="palettesGallery">`;
                this.closest('.logo-card').remove();
                ) {
                if (brand.sections.logos.items.length === 0) {s.forEach(palette => {
                    brandItem.querySelector('.logos-gallery').innerHTML = '';
                }
            }palette.name ? `<div class="palette-name">${palette.name}</div>` : ''}
        });  <div class="palette-colors">`;
    });
r => {
    // Цвета
    const deleteColorBtns = brandItem.querySelectorAll('.delete-color-btn');
    deleteColorBtns.forEach(btn => {  <div class="palette-color-circle" style="background-color: ${color}"></div>
        btn.addEventListener('click', function() {      <div class="palette-color-hex">${color}</div>
            const colorHex = this.closest('.color-card').getAttribute('data-hex');      </div>
            const colorIndex = brand.sections.colors.primary.findIndex(color => color.hex === colorHex);          `;
                       });
            if (colorIndex !== -1) {            
                brand.sections.colors.primary.splice(colorIndex, 1);
                this.closest('.color-card').remove();
                        <button class="delete-palette-btn">
                if (brand.sections.colors.primary.length === 0) {
                    brandItem.querySelector('#mainColorsBlock').style.display = 'none';
                }
            }
        });  });
    });   }
    
    // Парные цвета
    const deletePairedColorBtns = brandItem.querySelectorAll('.paired-color-delete');
    deletePairedColorBtns.forEach((btn, index) => {ML += '</div>'; // Закрываем colorBlocks
        btn.addEventListener('click', function() {
            if (brand.sections.colors.paired && brand.sections.colors.paired.length > index) {
                brand.sections.colors.paired.splice(index, 1);
                this.closest('.paired-color-card').remove();
                ographySection(brand) {
                if (brand.sections.colors.paired.length === 0) { || !brand.sections || !brand.sections.typography) {
                    brandItem.querySelector('#pairedColorsBlock').style.display = 'none';  return '';
                }   }
            }
        });
    });ns mt-3">
<button class="add-description-btn btn btn-primary" id="addFont" data-bs-toggle="modal" data-bs-target="#addFontModal">Добавить шрифт</button>
    // Палитрыn btn btn-primary" id="addStyleSet" data-bs-toggle="modal" data-bs-target="#addStyleSetModal">Добавить набор стилей</button>
    const deletePaletteBtns = brandItem.querySelectorAll('.delete-palette-btn');
    deletePaletteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const paletteId = parseInt(this.closest('.palette-card').getAttribute('data-id'), 10);
            const paletteIndex = brand.sections.colors.palettes.findIndex(palette => palette.id === paletteId);
            section" id="fontsBlock" ${brand.sections.typography.fonts && brand.sections.typography.fonts.length > 0 ? '' : 'style="display: none;"'}>
            if (paletteIndex !== -1) {
                brand.sections.colors.palettes.splice(paletteIndex, 1);
                this.closest('.palette-card').remove();
                ions.typography.fonts && brand.sections.typography.fonts.length > 0) {
                if (brand.sections.colors.palettes.length === 0) {
                    brandItem.querySelector('#palettesBlock').style.display = 'none';
                }
            }
        });  <h4>${font.family} ${font.type}${font.isItalic ? ' Italic' : ''}</h4>
    });      <style>
              @font-face {
    // Шрифты                          font-family: '${font.family}-${font.id}';
    const deleteFontBtns = brandItem.querySelectorAll('.delete-font-btn');                               src: url('${font.base64}') format('woff');
    deleteFontBtns.forEach(btn => {                                font-weight: ${font.type === 'Bold' ? 'bold' : 'normal'};
        btn.addEventListener('click', function() {le: ${font.isItalic ? 'italic' : 'normal'};
            const fontId = parseInt(this.getAttribute('data-id'), 10);
            const fontIndex = brand.sections.typography.fonts.findIndex(font => font.id === fontId);
            mily: '${font.family}-${font.id}'">
            if (fontIndex !== -1) {   Съешь ещё этих мягких французских булок, да выпей чаю.<br>
                brand.sections.typography.fonts.splice(fontIndex, 1);<br>
                this.closest('.font-card').remove();
                7890!@#$%^&*()_+
                if (brand.sections.typography.fonts.length === 0) {
                    brandItem.querySelector('#fontsBlock').style.display = 'none';           <div class="font-filename">${font.fileName || 'Без имени файла'}</div>
                }        </div>
            }
        });="img_src/trash-icon.svg" alt="Delete" class="delete-icon">
    });
   </div>
    // Наборы стилей и стили в наборах `;
    const deleteStyleSetBtns = brandItem.querySelectorAll('.delete-style-set-btn');   });
    deleteStyleSetBtns.forEach(btn => {}
        btn.addEventListener('click', function() {
            const setId = parseInt(this.getAttribute('data-id'), 10);   typographyHTML += `</div></div>`;
            const setIndex = brand.sections.typography.styleSets.findIndex(set => set.id === setId);    
            
            if (setIndex !== -1) {
                brand.sections.typography.styleSets.splice(setIndex, 1);section" id="styleSetsBlock" ${brand.sections.typography.styleSets && brand.sections.typography.styleSets.length > 0 ? '' : 'style="display: none;"'}>
                this.closest('.style-set-card').remove();
                style-sets-gallery" id="styleSetsGallery">`;
                if (brand.sections.typography.styleSets.length === 0) {
                    brandItem.querySelector('#styleSetsBlock').style.display = 'none';hy.styleSets.length > 0) {
                }aphy.styleSets.forEach(styleSet => {
            }
        });   <div class="style-set-card" data-id="${styleSet.id}">
    });        <h4>${styleSet.name}</h4>

    const deleteStyleBtns = brandItem.querySelectorAll('.delete-style-btn'); 
    deleteStyleBtns.forEach(btn => {       if (styleSet.styles && styleSet.styles.length > 0) {
        btn.addEventListener('click', function() {            styleSet.styles.forEach(style => {
            const styleId = parseInt(this.getAttribute('data-id'), 10);шрифт для этого стиля
            const setId = parseInt(this.closest('.style-set-card').getAttribute('data-id'), 10);(f => f.id === style.fontId);
            ontFaceRule = '';
            const setIndex = brand.sections.typography.styleSets.findIndex(set => set.id === setId);
            if (setIndex !== -1) {
                const styleIndex = brand.sections.typography.styleSets[setIndex].styles.findIndex(style => style.id === styleId);ceRule = `
                if (styleIndex !== -1) {
                    brand.sections.typography.styleSets[setIndex].styles.splice(styleIndex, 1);                   font-family: '${font.family}-${font.id}';
                    this.closest('.style-item').remove();                    src: url('${font.base64}') format('woff');
                }
            }                     font-style: ${font.isItalic ? 'italic' : 'normal'};
        });                       }
    });                       `;
                    }
    // Кнопки добавления стиля в набор
    const addStyleToSetBtns = brandItem.querySelectorAll('.add-style-to-set-btn');yHTML += `
    addStyleToSetBtns.forEach(btn => {
        btn.addEventListener('click', function() {style>${fontFaceRule}</style>
            const setId = parseInt(this.getAttribute('data-set-id'), 10);
            // Сохраняем ID набора в глобальную переменную для использования в модальном окне'-' + font.id : 'sans-serif'}';
            window.currentStyleSetId = setId;tSize}px;
        });                       line-height: ${style.lineHeight}px;
    });                           ${style.isItalic ? 'font-style: italic;' : ''}
                        ">
    // Графические элементы
    const deleteElementBtns = brandItem.querySelectorAll('.delete-element-btn');
    deleteElementBtns.forEach(btn => {
        btn.addEventListener('click', function() {.family + ' ' + font.type : 'Шрифт не найден'}, ${style.fontSize}px/${style.lineHeight}px</span>
            const elementId = parseInt(this.getAttribute('data-id'), 10);                           <button class="delete-style-btn" data-id="${style.id}">Удалить</button>
            const elementIndex = brand.sections.elements.items.findIndex(element => element.id === elementId);                        </div>
            
            if (elementIndex !== -1) {
                brand.sections.elements.items.splice(elementIndex, 1);
                this.closest('.element-card').remove();       }
            }        
        });graphyHTML += `
    });                   </div>
                        <div class="style-set-actions">
    // Настраиваем кнопки действий с цветами и другие модальные окна <button class="add-style-to-set-btn btn btn-sm btn-primary" data-set-id="${styleSet.id}" data-bs-toggle="modal" data-bs-target="#addStyleToSetModal">Добавить стиль</button>
    setupActionButtons();et-btn btn btn-sm btn-danger" data-id="${styleSet.id}">Удалить набор</button>
}

// Функция для рендеринга секции цветов            `;




























































































































































window.setupLoadedElementsHandlers = setupLoadedElementsHandlers;window.getActiveBrandId = getActiveBrandId;window.renderTypographySection = renderTypographySection;window.renderElementsSection = renderElementsSection;// Экспортируем функции}    return null;        }        return window.brands[0].id;    if (window.brands && window.brands.length > 0) {    // Если все еще не нашли, используем первый бренд из массива данных        }        return parseInt(firstBrand.dataset.id, 10);    if (firstBrand && firstBrand.dataset && firstBrand.dataset.id) {    const firstBrand = document.querySelector('.brand-item');    // Если активный бренд не найден через открытую секцию, берем первый бренд        }        }            return parseInt(brandItem.dataset.id, 10);        if (brandItem && brandItem.dataset && brandItem.dataset.id) {        const brandItem = activeBrandElement.closest('.brand-item');    if (activeBrandElement) {    const activeBrandElement = document.querySelector('.brand-item .brand-sections-content[style*="display: block"]');function getActiveBrandId() {// Функция для получения ID активного бренда}    }        });            // Открытие модального окна для добавления стиля будет происходить через data-bs-toggle                        }                stylesBlock.style.display = 'block';            if (stylesBlock) {            const stylesBlock = brandItem.querySelector('#stylesBlock');        addStyleButton.addEventListener('click', function() {    if (addStyleButton) {    const addStyleButton = brandItem.querySelector('.add-style-btn');    // Кнопка добавления стиля        }        });            // Открытие модального окна для добавления шрифта будет происходить через data-bs-toggle                        }                fontsBlock.style.display = 'block';            if (fontsBlock) {            const fontsBlock = brandItem.querySelector('#fontsBlock');        addFontButton.addEventListener('click', function() {    if (addFontButton) {    const addFontButton = brandItem.querySelector('.add-font-btn');    // Кнопка добавления шрифтаfunction setupTypographyButtons(brandItem) {// Функция для настройки кнопок типографики}    // Кнопки для парных цветов и палитр настраиваются в модуле colors.js        }        });            }                addColorModal.show();            if (addColorModal) {            const addColorModal = new bootstrap.Modal(document.getElementById('addColorModal'));                        }                mainColorsBlock.style.display = 'block';            if (mainColorsBlock) {            const mainColorsBlock = brandItem.querySelector('#mainColorsBlock');        addColorButton.addEventListener('click', function() {    if (addColorButton) {    const addColorButton = brandItem.querySelector('#addColor');    // Кнопка добавления основного цветаfunction setupColorButtons(brandItem) {// Настройка кнопок для работы с цветами}    `;        </div>            </div>                </div>                    <!-- Стили типографики будут добавляться здесь -->                <div class="styles-gallery" id="stylesGallery">                <h3>Стили типографики</h3>            <div class="styles-block" id="stylesBlock" style="display: none;">            </div>                </div>                    <!-- Шрифты будут добавляться здесь -->                <div class="fonts-gallery" id="fontsGallery">                <h3>Шрифты</h3>            <div class="fonts-block" id="fontsBlock" style="display: none;">        <div class="typography-content mt-3">        </div>            <button class="btn btn-primary add-style-btn" data-bs-toggle="modal" data-bs-target="#addStyleModal">Добавить набор стилей</button>            <button class="btn btn-primary add-font-btn" data-bs-toggle="modal" data-bs-target="#addFontModal">Добавить шрифт</button>        <div class="typography-actions mt-3">    return `function renderTypographySection() {// Функция для рендеринга секции типографики}    `;        </div>            </div>                <!-- Здесь будут отображаться добавленные элементы -->            <div class="element-gallery mt-3">            <button class="btn btn-primary add-element-btn">Добавить</button>        <div class="mt-3">    return `function renderElementsSection() {// Функция для рендеринга секции элементов}    `;        </div>            <!-- Галерея логотипов будет динамически добавляться -->        <div class="logos-gallery mt-4">        <button class="btn btn-success mt-3 add-logo-btn" data-bs-toggle="modal" data-bs-target="#addLogoModal">Добавить логотип</button>    return `function renderLogoSection() {// Функция для рендеринга секции логотипов}    `;        </div>            </div>                </div>                    <!-- Карточки палитр будут добавляться здесь -->                <div class="palettes-gallery" id="palettesGallery">                <h3>Палитры цветов</h3>            <div class="color-block" id="palettesBlock" style="display: none;">            </div>                </div>                    <!-- Карточки парных цветов будут добавляться здесь -->                <div class="paired-colors-gallery" id="pairedColorsGallery">                <h3>Парные цвета</h3>            <div class="color-block" id="pairedColorsBlock" style="display: none;">            </div>                </div>                    <!-- Карточки цветов будут добавляться здесь -->                <div class="color-gallery" id="mainColorsGallery">                <h3>Основные и дополнительные цвета</h3>            <div class="color-block" id="mainColorsBlock" style="display: none;">        <div id="colorBlocks">        </div>            <button class="add-description-btn btn btn-primary" id="addPalette">Добавить палитру</button>            <button class="add-description-btn btn btn-primary" id="addPairedColors">Добавить парные цвета</button>            <button class="add-description-btn btn btn-primary" id="addColor">Добавить цвет</button>        <div class="color-actions mt-3">    return `function renderColorSection() {        });
    }
    
    typographyHTML += `</div></div>`;
    
    typographyHTML += '</div>'; // Закрываем typographyContent
    return typographyHTML;
}

// Функция для рендеринга раздела графических элементов
function renderElementsSection(brand) {
    if (!brand || !brand.sections || !brand.sections.elements) {
        return '';
    }

    let elementsHTML = `
        <div class="elements-actions mt-3">
            <button class="add-description-btn btn btn-primary" id="addElementBtn" data-bs-toggle="modal" data-bs-target="#addElementModal">Добавить элемент</button>
        </div>
        <div class="elements-gallery">`;
    
    if (brand.sections.elements.items && brand.sections.elements.items.length > 0) {
        brand.sections.elements.items.forEach(element => {
            elementsHTML += `
                <div class="element-card" data-id="${element.id}">
                    <div class="element-preview">
                        <img src="${element.image}" alt="Element ${element.id}" style="max-width: 100%; max-height: 200px;">
                    </div>
                    <div class="element-info">
                        <h4>${element.name}</h4>
                        <div class="element-description">${element.description || ''}</div>
                    </div>
                    <button class="delete-element-btn" data-id="${element.id}">
                        <img src="img_src/trash-icon.svg" alt="Delete" class="delete-icon">
                    </button>
                </div>
            `;
        });
    }
    
    elementsHTML += '</div>';
    return elementsHTML;
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
window.renderLogoSection = renderLogoSection;
window.renderColorsSection = renderColorsSection;
window.renderTypographySection = renderTypographySection;
window.renderElementsSection = renderElementsSection;
window.getActiveBrandId = getActiveBrandId;
