// Модуль для работы с типографикой

// Функция инициализации модуля типографики
function initTypography() {
    console.log('Typography module initialized');
    
    // Проверяем наличие модальных окон
    checkModals();
    
    // Настройка модального окна для шрифтов
    setupFontModal();
    
    // Настройка модального окна для наборов стилей
    setupStyleSetModal();
    
    // Настройка модального окна для добавления стиля в набор
    setupAddStyleToSetModal();
}

// Функция проверки наличия модальных окон
function checkModals() {
    console.log("Checking if modals exist...");
    const addStyleSetModal = document.getElementById('addStyleSetModal');
    const addElementModal = document.getElementById('addElementModal');
    
    if (!addStyleSetModal) {
        console.error("Modal #addStyleSetModal not found in the DOM!");
    }
    
    if (!addElementModal) {
        console.error("Modal #addElementModal not found in the DOM!");
    }
}

// Настройка модального окна для шрифтов
function setupFontModal() {
    console.log('Setting up font modal...');
    
    const fontModal = document.getElementById('addFontModal');
    if (!fontModal) {
        console.error('Font modal not found');
        return;
    }
    
    console.log('Font modal found, setting up form...');
    
    const addFontForm = document.getElementById('addFontForm');
    if (!addFontForm) {
        console.error('Font form not found');
        return;
    }
    
    console.log('Font form found, adding submit event listener...');
    
    // Перед добавлением нового обработчика удаляем старый, если он есть
    const newForm = addFontForm.cloneNode(true);
    addFontForm.parentNode.replaceChild(newForm, addFontForm);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fontFileInput = document.getElementById('fontFile');
        const fontFamilyInput = document.getElementById('fontFamily');
        const fontTypeSelect = document.getElementById('fontType');
        const fontItalicCheckbox = document.getElementById('fontItalic');
        
        if (!fontFileInput || !fontFileInput.files[0] || !fontFamilyInput || !fontTypeSelect) {
            console.error('Missing form fields');
            return;
        }
        
        const fontFile = fontFileInput.files[0];
        const fontFamily = fontFamilyInput.value.trim();
        const fontType = fontTypeSelect.value;
        const isItalic = fontItalicCheckbox.checked;
        
        if (!fontFamily) {
            alert('Пожалуйста, введите название семейства шрифтов');
            return;
        }
        
        // Получаем активный бренд
        const brandId = window.getActiveBrandId();
        if (!brandId) {
            alert('Пожалуйста, сначала выберите бренд');
            return;
        }
        
        // Получаем бренд из глобального массива
        const brand = window.brands.find(b => b.id === brandId);
        if (!brand) {
            alert('Выбранный бренд не найден');
            return;
        }
        
        // Инициализируем секции типографики, если их нет
        if (!brand.sections) brand.sections = {};
        if (!brand.sections.typography) brand.sections.typography = {};
        if (!brand.sections.typography.fonts) brand.sections.typography.fonts = [];
        
        // Читаем файл шрифта как base64
        const reader = new FileReader();
        
        reader.onload = function(fileEvent) {
            const base64Data = fileEvent.target.result;
            
            // Создаем объект шрифта
            const fontObject = {
                id: Date.now(),
                family: fontFamily,
                type: fontType,
                isItalic: isItalic,
                fileName: fontFile.name,
                base64: base64Data
            };
            
            // Добавляем шрифт в массив
            brand.sections.typography.fonts.push(fontObject);
            
            // Обновляем интерфейс
            updateFontsList(brand);
            
            // Сбрасываем форму и закрываем модальное окно
            newForm.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addFontModal'));
            if (modal) {
                modal.hide();
            }
        };
        
        reader.readAsDataURL(fontFile);
    });
    
    console.log('Font modal setup completed');
}

// Обновляем список шрифтов в интерфейсе
function updateFontsList(brand) {
    const brandId = brand.id;
    const brandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
    if (!brandItem) return;
    
    const fontsBlockId = `fontsBlock-${brandId}`;
    let fontsBlock = brandItem.querySelector(`#${fontsBlockId}`);
    
    if (!fontsBlock) {
        // Если блок не существует, найдем родительский контейнер и создадим блок
        const typographyContent = brandItem.querySelector('.typography-content');
        if (typographyContent) {
            fontsBlock = document.createElement('div');
            fontsBlock.className = 'fonts-block';
            fontsBlock.id = fontsBlockId;
            fontsBlock.innerHTML = '<h3>Добавленные шрифты</h3><div class="fonts-list"></div>';
            typographyContent.prepend(fontsBlock);
        }
    }
    
    if (!fontsBlock) return;
    
    const fontsList = fontsBlock.querySelector('.fonts-list');
    if (!fontsList) return;
    
    // Отображаем блок шрифтов, если есть шрифты
    if (brand.sections.typography.fonts.length > 0) {
        fontsBlock.style.display = 'block';
    } else {
        fontsBlock.style.display = 'none';
        return;
    }
    
    // Очищаем список и добавляем шрифты
    fontsList.innerHTML = '';
    
    brand.sections.typography.fonts.forEach(font => {
        const fontItem = document.createElement('div');
        fontItem.className = 'font-item';
        fontItem.dataset.id = font.id;
        
        fontItem.innerHTML = `
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
        `;
        
        // Добавляем обработчики для кнопок
        const deleteBtn = fontItem.querySelector('.delete-font-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                const fontId = parseInt(this.dataset.id, 10);
                const fontIndex = brand.sections.typography.fonts.findIndex(f => f.id === fontId);
                
                if (fontIndex !== -1) {
                    brand.sections.typography.fonts.splice(fontIndex, 1);
                    fontItem.remove();
                    
                    // Скрываем блок, если шрифтов больше нет
                    if (brand.sections.typography.fonts.length === 0) {
                        fontsBlock.style.display = 'none';
                    }
                }
            });
        }
        
        const downloadBtn = fontItem.querySelector('.download-font-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                // Создаем временную ссылку для скачивания
                const link = document.createElement('a');
                link.href = font.base64;
                link.download = font.fileName || `${font.family}-${font.type}${font.isItalic ? '-Italic' : ''}.woff`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
        
        fontsList.appendChild(fontItem);
    });
}

// Функция настройки модального окна добавления набора стилей
function setupStyleSetModal() {
    console.log('Setting up style set modal...');
    
    const styleSetModal = document.getElementById('addStyleSetModal');
    if (!styleSetModal) {
        console.error('Style set modal not found, creating one...');
        // Create the modal if it doesn't exist
        createStyleSetModal();
        return;
    }
    
    // Find the save button instead of form
    const saveStyleSetBtn = document.getElementById('saveStyleSetBtn');
    if (!saveStyleSetBtn) {
        console.error('Save button not found');
        return;
    }
    
    // Remove previous event listeners
    const newBtn = saveStyleSetBtn.cloneNode(true);
    if (saveStyleSetBtn.parentNode) {
        saveStyleSetBtn.parentNode.replaceChild(newBtn, saveStyleSetBtn);
    }
    
    newBtn.addEventListener('click', function(e) {
        const styleSetNameInput = document.getElementById('styleSetName');
        if (!styleSetNameInput) {
            console.error('Style set name input not found');
            return;
        }
        
        const styleSetName = styleSetNameInput.value.trim();
        if (!styleSetName) {
            alert('Пожалуйста, введите название набора стилей');
            return;
        }
        
        // Get active brand
        const brandId = window.getActiveBrandId();
        if (!brandId) {
            alert('Пожалуйста, сначала выберите бренд');
            return;
        }
        
        // Get brand from global array
        const brand = window.brands.find(b => b.id === brandId);
        if (!brand) {
            alert('Выбранный бренд не найден');
            return;
        }
        
        // Initialize typography sections if they don't exist
        if (!brand.sections) brand.sections = {};
        if (!brand.sections.typography) brand.sections.typography = {};
        if (!brand.sections.typography.styleSets) brand.sections.typography.styleSets = [];
        
        // Create a new style set
        const newStyleSet = {
            id: Date.now(),
            name: styleSetName,
            styles: []
        };
        
        // Add the style set to the brand
        brand.sections.typography.styleSets.push(newStyleSet);
        
        // Update the interface
        const styleSetBlock = document.querySelector('#styleSetsBlock');
        if (styleSetBlock) {
            styleSetBlock.style.display = 'block';
        }
        
        // Re-render the typography section or just add the new set
        const typographySection = document.querySelector(`.brand-item[data-id="${brandId}"] .section-item[data-section="typography"] .section-content`);
        if (typographySection && window.renderTypographySection) {
            const typographyContent = window.renderTypographySection(brand);
            typographySection.innerHTML = `
                <div class="description-block">
                    <div class="description-content formatted-description">${brand.sections.typography.description || ""}</div>
                    <button class="add-description-btn btn btn-primary">
                        ${brand.sections.typography.description ? 'Редактировать описание' : 'Добавить описание'}
                    </button>
                </div>
                ${typographyContent}
            `;
            
            // Setup handlers for the new elements
            if (window.setupLoadedElementsHandlers) {
                const brandItem = typographySection.closest('.brand-item');
                if (brandItem) {
                    window.setupLoadedElementsHandlers(brandItem, brand);
                }
            }
        }
        
        // Reset form field
        styleSetNameInput.value = '';
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStyleSetModal'));
        if (modal) {
            modal.hide();
        } else {
            console.error('Could not get modal instance');
        }
    });
}

// Function to create style set modal if it doesn't exist
function createStyleSetModal() {
    // Check if it already exists
    if (document.getElementById('addStyleSetModal')) {
        return;
    }
    
    // Create modal HTML
    const modalHtml = `
    <div class="modal fade" id="addStyleSetModal" tabindex="-1" aria-labelledby="addStyleSetModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addStyleSetModalLabel">Добавить набор стилей</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <form id="addStyleForm" onsubmit="return false;">
                        <div class="mb-3">
                            <label for="styleSetName" class="form-label">Название набора стилей шрифтов</label>
                            <input type="text" class="form-control" id="styleSetName" placeholder="Введите название набора" required>
                        </div>
                        <button type="button" id="saveStyleSetBtn" class="btn btn-primary w-100">Сохранить</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Setup the new modal
    setupStyleSetModal();
}

// Функция настройки модального окна добавления стиля в набор
function setupAddStyleToSetModal() {
    console.log('Setting up add style to set modal...');
    const modal = document.getElementById('addStyleToSetModal');
    if (!modal) {
        console.warn('Модальное окно для добавления стиля в набор не найдено');
        return;
    }
    
    console.log('Add style to set modal found, setting up form...');
    const form = document.getElementById('addStyleToSetForm');
    if (!form) {
        console.error('Форма добавления стиля в набор не найдена');
        return;
    }
    
    // Prevent default form submission
    form.setAttribute('onsubmit', 'return false;');
    
    // Find or create submit button
    let submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        // Change to button type
        submitButton.type = 'button';
        
        // Remove previous event listeners
        const newButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newButton, submitButton);
        submitButton = newButton;
    }
    
    // Find all form elements we need to handle
    const styleSetIdInput = document.getElementById('styleSetId');
    const styleFontSizeInput = document.getElementById('styleFontSize');
    const styleLineHeightInput = document.getElementById('styleLineHeight');
    const styleFontIdSelect = document.getElementById('styleFontId');
    const previewStyleText = document.getElementById('previewStyleText');
    
    // Add event listeners to update preview
    function updatePreview() {
        const fontSize = styleFontSizeInput.value || '-';
        const lineHeight = styleLineHeightInput.value || '-';
        
        // Get font details if one is selected
        let fontFamily = '-';
        let fontType = '-';
        let isItalic = false;
        
        const selectedFontId = styleFontIdSelect.value;
        if (selectedFontId) {
            const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
            if (activeBrandId) {
                const activeBrand = window.brands.find(b => b.id === activeBrandId);
                if (activeBrand && activeBrand.sections && activeBrand.sections.typography && activeBrand.sections.typography.fonts) {
                    const selectedFont = activeBrand.sections.typography.fonts.find(f => f.id == selectedFontId);
                    if (selectedFont) {
                        fontFamily = selectedFont.family;
                        fontType = selectedFont.type;
                        isItalic = selectedFont.isItalic;
                        
                        // Update the preview style to match the selected font
                        if (previewStyleText) {
                            previewStyleText.style.fontFamily = `"${fontFamily}", sans-serif`;
                            previewStyleText.style.fontWeight = getFontWeight(fontType);
                            previewStyleText.style.fontStyle = isItalic ? 'italic' : 'normal';
                            previewStyleText.style.fontSize = `${fontSize}px`;
                            previewStyleText.style.lineHeight = `${lineHeight}px`;
                        }
                    }
                }
            }
        }
        
        // Get the style set name
        let styleSetName = "Стиль";
        const styleSetId = styleSetIdInput ? styleSetIdInput.value : null;
        if (styleSetId) {
            const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
            if (activeBrandId) {
                const activeBrand = window.brands.find(b => b.id === activeBrandId);
                if (activeBrand && activeBrand.sections && activeBrand.sections.typography && activeBrand.sections.typography.styleSets) {
                    const styleSet = activeBrand.sections.typography.styleSets.find(s => s.id == styleSetId);
                    if (styleSet) {
                        styleSetName = styleSet.name;
                    }
                }
            }
        }
        
        // Update preview text
        const italicText = isItalic ? ' · Italic' : '';
        if (previewStyleText) {
            previewStyleText.textContent = `${fontSize}/${lineHeight} · ${styleSetName} · ${fontFamily} · ${fontType}${italicText}`;
        }
    }
    
    if (styleFontSizeInput) {
        styleFontSizeInput.addEventListener('input', updatePreview);
    }
    
    if (styleLineHeightInput) {
        styleLineHeightInput.addEventListener('input', updatePreview);
    }
    
    if (styleFontIdSelect) {
        styleFontIdSelect.addEventListener('change', updatePreview);
    }
    
    // Setup form submission
    console.log('Add style to set form found, adding submit event listener...');
    
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const styleSetId = styleSetIdInput ? parseInt(styleSetIdInput.value, 10) : null;
            const fontSize = styleFontSizeInput ? parseInt(styleFontSizeInput.value, 10) : null;
            const lineHeight = styleLineHeightInput ? parseInt(styleLineHeightInput.value, 10) : null;
            const fontId = styleFontIdSelect ? parseInt(styleFontIdSelect.value, 10) : null;
            
            if (!styleSetId) {
                console.error('No style set ID provided');
                alert('Ошибка: ID набора стилей не указан');
                return;
            }
            
            if (!fontSize || !lineHeight || !fontId) {
                console.error('Missing required fields');
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Get font details
            const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
            if (activeBrandId) {
                const activeBrand = window.brands.find(b => b.id === activeBrandId);
                if (activeBrand && activeBrand.sections && activeBrand.sections.typography) {
                    const selectedFont = activeBrand.sections.typography.fonts.find(f => f.id === fontId);
                    if (!selectedFont) {
                        console.error('Selected font not found');
                        alert('Ошибка: Выбранный шрифт не найден');
                        return;
                    }
                    
                    // Create style object
                    const style = {
                        id: Date.now(),
                        fontSize: fontSize,
                        lineHeight: lineHeight,
                        fontId: fontId,
                        fontFamily: selectedFont.family,
                        fontType: selectedFont.type,
                        isItalic: selectedFont.isItalic
                    };
                    
                    // Add style to the style set
                    const styleSetIndex = activeBrand.sections.typography.styleSets.findIndex(set => set.id === styleSetId);
                    if (styleSetIndex !== -1) {
                        if (!activeBrand.sections.typography.styleSets[styleSetIndex].styles) {
                            activeBrand.sections.typography.styleSets[styleSetIndex].styles = [];
                        }
                        activeBrand.sections.typography.styleSets[styleSetIndex].styles.push(style);
                        
                        // Re-render the typography section
                        const typographySection = document.querySelector(`.brand-item[data-id="${activeBrandId}"] .section-item[data-section="typography"] .section-content`);
                        if (typographySection && window.renderTypographySection) {
                            const typographyContent = window.renderTypographySection(activeBrand);
                            typographySection.innerHTML = `
                                <div class="description-block">
                                    <div class="description-content formatted-description">${activeBrand.sections.typography.description || ""}</div>
                                    <button class="add-description-btn btn btn-primary">
                                        ${activeBrand.sections.typography.description ? 'Редактировать описание' : 'Добавить описание'}
                                    </button>
                                </div>
                                ${typographyContent}
                            `;
                            
                            // Setup handlers for the new elements
                            if (window.setupLoadedElementsHandlers) {
                                const brandItem = typographySection.closest('.brand-item');
                                if (brandItem) {
                                    window.setupLoadedElementsHandlers(brandItem, activeBrand);
                                }
                            }
                        }
                    }
                    
                    // Reset form fields
                    if (styleFontSizeInput) styleFontSizeInput.value = '';
                    if (styleLineHeightInput) styleLineHeightInput.value = '';
                    if (styleFontIdSelect) styleFontIdSelect.value = '';
                    if (previewStyleText) {
                        previewStyleText.textContent = '-/- · Стиль · - · - · -';
                        previewStyleText.style = ''; // Reset inline styles
                    }
                    
                    // Close the modal
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                        console.log('Add style to set modal closed');
                    }
                }
            }
        });
    }
    
    console.log('Add style to set modal setup completed');
}

// Helper function to get font weight from font type
function getFontWeight(fontType) {
    switch (fontType) {
        case 'Thin': return '100';
        case 'Light': return '300';
        case 'Regular': return '400';
        case 'Medium': return '500';
        case 'Semibold': return '600';
        case 'Bold': return '700';
        case 'Heavy': return '900';
        default: return '400';
    }
}

// Экспортируем функции для использования в других модулях
window.initTypography = initTypography;
window.updateFontsList = updateFontsList;

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event: initializing typography module');
    initTypography();
});
