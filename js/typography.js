// Модуль для работы с типографикой

// Инициализация модуля
function initTypography() {
    console.log('Typography module initialized');
    
    // Настройка модального окна добавления шрифта
    setupFontModal();
    
    // Настройка модального окна добавления стиля
    setupStyleModal();
    
    // Настройка модального окна добавления стиля в набор
    setupAddStyleToSetModal();
}

// Функция настройки модального окна добавления шрифта
function setupFontModal() {
    console.log('Setting up font modal...');
    const modal = document.getElementById('addFontModal');
    if (!modal) {
        console.error('Модальное окно для добавления шрифта не найдено');
        return;
    }
    
    console.log('Font modal found, setting up form...');
    const form = document.getElementById('addFontForm');
    if (!form) {
        console.error('Форма добавления шрифта не найдена');
        return;
    }
    
    // Remove any existing submit event listeners to prevent duplicates
    const clonedForm = form.cloneNode(true);
    form.parentNode.replaceChild(clonedForm, form);
    
    console.log('Font form found, adding submit event listener...');
    // Add flag to track form submission in progress
    let isSubmitting = false;
    
    clonedForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (isSubmitting) {
            console.log('Submission already in progress, ignoring duplicate submit event');
            return;
        }
        
        isSubmitting = true;
        console.log('Form submitted, processing font data...');
        
        const fileInput = document.getElementById('fontFile');
        const fontFamily = document.getElementById('fontFamily').value.trim();
        const fontType = document.getElementById('fontType').value;
        const isItalic = document.getElementById('fontItalic').checked;
        
        console.log('Font data collected:', { fontFamily, fontType, isItalic, fileSelected: !!fileInput.files.length });
        
        if (!fileInput.files || !fileInput.files[0]) {
            console.error('No file selected');
            alert('Пожалуйста, выберите файл шрифта');
            isSubmitting = false;
            return;
        }
        
        if (!fontFamily) {
            console.error('No font family name provided');
            alert('Пожалуйста, введите название семейства шрифтов');
            isSubmitting = false;
            return;
        }
        
        const file = fileInput.files[0];
        console.log('Reading file:', file.name);
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Преобразуем в base64
            const base64Font = e.target.result;
            console.log('File converted to base64, creating font object...');
            
            // Создаем объект шрифта
            const font = {
                id: Date.now(),
                family: fontFamily,
                type: fontType,
                isItalic: isItalic,
                base64: base64Font,
                fileName: file.name
            };
            
            console.log('Font object created:', { id: font.id, family: font.family, type: font.type, isItalic: font.isItalic, fileName: font.fileName });
            
            // Добавляем шрифт в текущий бренд
            addFontToBrand(font);
            
            // Reset submission flag
            isSubmitting = false;
            
            // Сбрасываем форму
            clonedForm.reset();
            
            // Закрываем модальное окно
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
                console.log('Modal closed');
            }
        };
        
        reader.onerror = function(error) {
            console.error('Error reading file:', error);
            alert('Произошла ошибка при чтении файла шрифта');
            isSubmitting = false;
        };
        
        try {
            reader.readAsDataURL(file);
            console.log('Started reading file as Data URL');
        } catch (error) {
            console.error('Exception when reading file:', error);
            alert('Произошла ошибка при обработке файла шрифта');
            isSubmitting = false;
        }
    });
    
    console.log('Font modal setup completed');
}

// Функция настройки модального окна добавления стиля
function setupStyleModal() {
    console.log('Setting up style set modal...');
    const modal = document.getElementById('addStyleModal');
    if (!modal) {
        console.warn('Модальное окно для добавления набора стилей не найдено');
        return;
    }
    
    console.log('Style set modal found, setting up form...');
    const form = document.getElementById('addStyleForm');
    if (!form) {
        console.error('Форма добавления набора стилей не найдена');
        return;
    }
    
    // Remove any existing event listeners
    const clonedForm = form.cloneNode(true);
    form.parentNode.replaceChild(clonedForm, form);
    
    console.log('Style set form found, adding submit event listener...');
    let isSubmitting = false;
    
    clonedForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (isSubmitting) {
            console.log('Submission already in progress, ignoring duplicate submit event');
            return;
        }
        
        isSubmitting = true;
        console.log('Style set form submitted, processing data...');
        
        const styleSetNameInput = document.getElementById('styleSetName');
        const styleSetName = styleSetNameInput.value.trim();
        
        if (!styleSetName) {
            console.error('No style set name provided');
            alert('Пожалуйста, введите название набора стилей');
            isSubmitting = false;
            return;
        }
        
        // Создаем объект набора стилей
        const styleSet = {
            id: Date.now(),
            name: styleSetName,
            styles: [] // Массив стилей в наборе
        };
        
        console.log('Style set created:', { id: styleSet.id, name: styleSet.name });
        
        // Добавляем набор стилей в текущий бренд
        addStyleSetToBrand(styleSet);
        
        // Reset submission flag
        isSubmitting = false;
        
        // Сбрасываем форму
        clonedForm.reset();
        
        // Закрываем модальное окно
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
            console.log('Style set modal closed');
        }
    });
    
    console.log('Style set modal setup completed');
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
    
    // Remove any existing event listeners
    const clonedForm = form.cloneNode(true);
    form.parentNode.replaceChild(clonedForm, form);
    
    // Find all form elements we need to handle
    const styleSetIdInput = clonedForm.querySelector('#styleSetId');
    const styleFontSizeInput = clonedForm.querySelector('#styleFontSize');
    const styleLineHeightInput = clonedForm.querySelector('#styleLineHeight');
    const styleFontIdSelect = clonedForm.querySelector('#styleFontId');
    const previewStyleText = clonedForm.querySelector('#previewStyleText');
    
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
                        previewStyleText.style.fontFamily = `"${fontFamily}", sans-serif`;
                        previewStyleText.style.fontWeight = getFontWeight(fontType);
                        previewStyleText.style.fontStyle = isItalic ? 'italic' : 'normal';
                        previewStyleText.style.fontSize = `${fontSize}px`;
                        previewStyleText.style.lineHeight = `${lineHeight}px`;
                    }
                }
            }
        }
        
        // Get the style set name
        let styleSetName = "Стиль";
        const styleSetId = styleSetIdInput.value;
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
        previewStyleText.textContent = `${fontSize}/${lineHeight} · ${styleSetName} · ${fontFamily} · ${fontType}${italicText}`;
    }
    
    styleFontSizeInput.addEventListener('input', updatePreview);
    styleLineHeightInput.addEventListener('input', updatePreview);
    styleFontIdSelect.addEventListener('change', updatePreview);
    
    // Setup form submission
    console.log('Add style to set form found, adding submit event listener...');
    let isSubmitting = false;
    
    clonedForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (isSubmitting) {
            console.log('Submission already in progress, ignoring duplicate submit event');
            return;
        }
        
        isSubmitting = true;
        console.log('Add style to set form submitted');
        
        const styleSetId = parseInt(styleSetIdInput.value, 10);
        const fontSize = parseInt(styleFontSizeInput.value, 10);
        const lineHeight = parseInt(styleLineHeightInput.value, 10);
        const fontId = parseInt(styleFontIdSelect.value, 10);
        
        if (!styleSetId) {
            console.error('No style set ID provided');
            alert('Ошибка: ID набора стилей не указан');
            isSubmitting = false;
            return;
        }
        
        if (!fontSize || !lineHeight || !fontId) {
            console.error('Missing required fields');
            alert('Пожалуйста, заполните все обязательные поля');
            isSubmitting = false;
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
                    isSubmitting = false;
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
                addStyleToStyleSet(styleSetId, style);
                
                // Reset form
                clonedForm.reset();
                previewStyleText.textContent = '-/- · Стиль · - · - · -';
                previewStyleText.style = ''; // Reset inline styles
                
                // Close modal
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                    console.log('Add style to set modal closed');
                }
            }
        }
        
        isSubmitting = false;
    });
    
    console.log('Add style to set modal setup completed');
}

// Function to update font select options when the modal opens
function populateFontSelect(styleSetId) {
    console.log('Populating font select for style set ID:', styleSetId);
    const styleFontIdSelect = document.getElementById('styleFontId');
    if (!styleFontIdSelect) {
        console.error('Font select element not found');
        return;
    }
    
    // Clear current options except the first placeholder
    while (styleFontIdSelect.options.length > 1) {
        styleFontIdSelect.remove(1);
    }
    
    // Get fonts from the active brand
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (activeBrandId) {
        const activeBrand = window.brands.find(b => b.id === activeBrandId);
        if (activeBrand && activeBrand.sections && activeBrand.sections.typography && activeBrand.sections.typography.fonts) {
            console.log('Found fonts for brand:', activeBrand.sections.typography.fonts.length);
            
            // Add options for each font
            activeBrand.sections.typography.fonts.forEach(font => {
                const option = document.createElement('option');
                option.value = font.id;
                option.textContent = `${font.family} ${font.type}${font.isItalic ? ' Italic' : ''}`;
                styleFontIdSelect.appendChild(option);
            });
        } else {
            console.warn('No fonts found for brand');
            
            // Add a disabled option to indicate no fonts
            const option = document.createElement('option');
            option.disabled = true;
            option.textContent = 'Нет доступных шрифтов';
            styleFontIdSelect.appendChild(option);
        }
    }
}

// Function to add a style to a style set
function addStyleToStyleSet(styleSetId, style) {
    console.log('Adding style to style set. Style Set ID:', styleSetId, 'Style:', style);
    
    // Get active brand
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (!activeBrandId) {
        console.error('No active brand found');
        return;
    }
    
    // Find the brand
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand) {
        console.error('Brand not found in data');
        return;
    }
    
    // Make sure the typography section and style sets exist
    if (!activeBrand.sections) activeBrand.sections = {};
    if (!activeBrand.sections.typography) activeBrand.sections.typography = {};
    if (!activeBrand.sections.typography.styleSets) activeBrand.sections.typography.styleSets = [];
    
    // Find the style set
    const styleSetIndex = activeBrand.sections.typography.styleSets.findIndex(s => s.id === styleSetId);
    if (styleSetIndex === -1) {
        console.error('Style set not found');
        return;
    }
    
    // Initialize styles array if it doesn't exist
    if (!activeBrand.sections.typography.styleSets[styleSetIndex].styles) {
        activeBrand.sections.typography.styleSets[styleSetIndex].styles = [];
    }
    
    // Add the style
    activeBrand.sections.typography.styleSets[styleSetIndex].styles.push(style);
    console.log('Style added to style set. Current styles:', activeBrand.sections.typography.styleSets[styleSetIndex].styles);
    
    // Update the UI
    updateStyleSetInDOM(activeBrandId, styleSetId);
}

// Function to delete a style from a style set
function deleteStyleFromStyleSet(styleSetId, styleId) {
    console.log('Deleting style from style set. Style Set ID:', styleSetId, 'Style ID:', styleId);
    
    // Get active brand
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (!activeBrandId) {
        console.error('No active brand found');
        return;
    }
    
    // Find the brand
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand || !activeBrand.sections || !activeBrand.sections.typography || !activeBrand.sections.typography.styleSets) {
        console.error('Style sets not found for brand');
        return;
    }
    
    // Find the style set
    const styleSet = activeBrand.sections.typography.styleSets.find(s => s.id === styleSetId);
    if (!styleSet || !styleSet.styles) {
        console.error('Style set not found or has no styles');
        return;
    }
    
    // Remove the style
    const initialLength = styleSet.styles.length;
    styleSet.styles = styleSet.styles.filter(s => s.id !== styleId);
    console.log(`Style deleted. Styles before: ${initialLength}, after: ${styleSet.styles.length}`);
    
    // Update the UI
    updateStyleSetInDOM(activeBrandId, styleSetId);
}

// Function to update a style set in the DOM
function updateStyleSetInDOM(brandId, styleSetId) {
    console.log('Updating style set in DOM. Brand ID:', brandId, 'Style Set ID:', styleSetId);
    
    // Find the brand
    const brand = window.brands.find(b => b.id === brandId);
    if (!brand || !brand.sections || !brand.sections.typography || !brand.sections.typography.styleSets) {
        console.error('Style sets not found for brand');
        return;
    }
    
    // Find the style set
    const styleSet = brand.sections.typography.styleSets.find(s => s.id === styleSetId);
    if (!styleSet) {
        console.error('Style set not found');
        return;
    }
    
    // Find the style set card in the DOM
    const brandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
    if (!brandItem) {
        console.error('Brand item not found in DOM');
        return;
    }
    
    const styleSetCard = brandItem.querySelector(`.style-set-card[data-id="${styleSetId}"]`);
    if (!styleSetCard) {
        console.error('Style set card not found in DOM');
        return;
    }
    
    // Find the style set content
    const styleSetContent = styleSetCard.querySelector('.style-set-content');
    if (!styleSetContent) {
        console.error('Style set content not found');
        return;
    }
    
    // Clear the content
    styleSetContent.innerHTML = '';
    
    // Check if there are any styles
    if (!styleSet.styles || styleSet.styles.length === 0) {
        styleSetContent.innerHTML = '<p class="no-styles-message">В этом наборе нет стилей</p>';
        return;
    }
    
    // Add each style
    styleSet.styles.forEach(style => {
        const styleItem = document.createElement('div');
        styleItem.className = 'style-item';
        styleItem.dataset.id = style.id;
        
        // Create the style text with the appropriate font styling
        const styleItemText = document.createElement('div');
        styleItemText.className = 'style-item-text';
        styleItemText.style.fontFamily = `"${style.fontFamily}", sans-serif`;
        styleItemText.style.fontWeight = getFontWeight(style.fontType);
        styleItemText.style.fontStyle = style.isItalic ? 'italic' : 'normal';
        styleItemText.style.fontSize = `${style.fontSize}px`;
        styleItemText.style.lineHeight = `${style.lineHeight}px`;
        
        // Format the style text
        const italicText = style.isItalic ? ' · Italic' : '';
        styleItemText.textContent = `${style.fontSize}/${style.lineHeight} · ${styleSet.name} · ${style.fontFamily} · ${style.fontType}${italicText}`;
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-style-item-btn';
        deleteButton.title = 'Удалить стиль';
        deleteButton.innerHTML = '<img src="img_src/x-icon.svg" alt="Удалить">';
        deleteButton.addEventListener('click', function() {
            deleteStyleFromStyleSet(styleSetId, style.id);
        });
        
        // Add elements to style item
        styleItem.appendChild(styleItemText);
        styleItem.appendChild(deleteButton);
        
        // Add style item to content
        styleSetContent.appendChild(styleItem);
    });
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

// Modify the createStyleSetCard function to include the event listener for addStyleToSetBtn
function createStyleSetCard(styleSet) {
    console.log('Creating style set card for', styleSet.name);
    const styleSetCard = document.createElement('div');
    styleSetCard.className = 'style-set-card';
    styleSetCard.dataset.id = styleSet.id;
    
    styleSetCard.innerHTML = `
        <div class="style-set-header">
            <h4 class="style-set-name">${styleSet.name}</h4>
            <button class="delete-style-set-btn" title="Удалить набор стилей">
                <img src="img_src/trash-icon.svg" alt="Удалить">
            </button>
        </div>
        <div class="style-set-content">
            ${styleSet.styles && styleSet.styles.length > 0 
                ? styleSet.styles.map(style => {
                    const italicText = style.isItalic ? ' · Italic' : '';
                    return `
                        <div class="style-item" data-id="${style.id}">
                            <div class="style-item-text" style="
                                font-family: '${style.fontFamily}', sans-serif;
                                font-weight: ${getFontWeight(style.fontType)};
                                font-style: ${style.isItalic ? 'italic' : 'normal'};
                                font-size: ${style.fontSize}px;
                                line-height: ${style.lineHeight}px;
                            ">
                                ${style.fontSize}/${style.lineHeight} · ${styleSet.name} · ${style.fontFamily} · ${style.fontType}${italicText}
                            </div>
                            <button class="delete-style-item-btn" title="Удалить стиль">
                                <img src="img_src/x-icon.svg" alt="Удалить">
                            </button>
                        </div>
                    `;
                }).join('') 
                : '<p class="no-styles-message">В этом наборе нет стилей</p>'}
        </div>
        <button class="add-style-to-set-btn btn btn-primary" data-style-set-id="${styleSet.id}">Добавить стиль</button>
    `;
    
    // Добавляем обработчики для кнопок
    const deleteBtn = styleSetCard.querySelector('.delete-style-set-btn');
    const addStyleBtn = styleSetCard.querySelector('.add-style-to-set-btn');
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            deleteStyleSet(styleSet.id);
            styleSetCard.remove();
        });
    }
    
    if (addStyleBtn) {
        addStyleBtn.addEventListener('click', function() {
            // Устанавливаем ID набора стилей в скрытое поле формы
            const styleSetIdInput = document.getElementById('styleSetId');
            if (styleSetIdInput) {
                styleSetIdInput.value = styleSet.id;
                
                // Populate the font select with available fonts
                populateFontSelect(styleSet.id);
                
                // Reset the preview text
                const previewStyleText = document.getElementById('previewStyleText');
                if (previewStyleText) {
                    previewStyleText.textContent = `-/- · ${styleSet.name} · - · - · -`;
                    previewStyleText.style = ''; // Reset inline styles
                }
                
                // Открываем модальное окно добавления стиля в набор
                const modal = new bootstrap.Modal(document.getElementById('addStyleToSetModal'));
                if (modal) {
                    modal.show();
                }
            }
        });
    }
    
    // Add event listeners for delete style buttons
    const deleteStyleBtns = styleSetCard.querySelectorAll('.delete-style-item-btn');
    deleteStyleBtns.forEach(btn => {
        const styleItem = btn.closest('.style-item');
        if (styleItem && styleItem.dataset.id) {
            btn.addEventListener('click', function() {
                deleteStyleFromStyleSet(styleSet.id, parseInt(styleItem.dataset.id, 10));
            });
        }
    });
    
    return styleSetCard;
}

// Функция добавления шрифта в бренд
function addFontToBrand(font) {
    console.log('Adding font to brand... Font ID:', font.id);
    console.log('Call stack:', new Error().stack);
    
    // Получаем активный бренд
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    console.log('Active brand ID:', activeBrandId);
    if (!activeBrandId) {
        console.error('Не найден активный бренд');
        return;
    }
    
    // Находим бренд в данных
    console.log('Looking for brand in data...');
    console.log('Available brands:', window.brands);
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand) {
        console.error('Бренд не найден в данных');
        return;
    }
    console.log('Found brand:', activeBrand.name);
    
    // Инициализируем структуру данных для шрифтов, если её нет
    if (!activeBrand.sections) activeBrand.sections = {};
    if (!activeBrand.sections.typography) activeBrand.sections.typography = {};
    if (!activeBrand.sections.typography.fonts) activeBrand.sections.typography.fonts = [];
    
    // Проверяем, есть ли уже такой шрифт
    const existingFontIndex = activeBrand.sections.typography.fonts.findIndex(f => f.id === font.id);
    if (existingFontIndex !== -1) {
        console.warn(`Font with ID ${font.id} is already in the collection! Skipping addition.`);
        return;
    }
    
    // Добавляем шрифт в данные
    activeBrand.sections.typography.fonts.push(font);
    console.log('Font added to brand data. Current fonts:', activeBrand.sections.typography.fonts);
    
    // Логирование общего числа шрифтов до поиска элементов DOM
    console.log(`Total fonts after adding: ${activeBrand.sections.typography.fonts.length}`);
    
    // Находим секцию в DOM для отображения шрифта
    console.log('Looking for brand item in DOM...');
    const brandItem = document.querySelector(`.brand-item[data-id="${activeBrandId}"]`);
    if (!brandItem) {
        console.error('Элемент бренда не найден в DOM');
        return;
    }
    console.log('Brand item found in DOM');
    
    // Находим нужную секцию типографики
    console.log('Looking for typography section in the brand...');
    const sections = brandItem.querySelectorAll('.section-item');
    console.log('Found sections:', sections.length);
    
    // Dump titles of all sections for debugging
    sections.forEach((section, idx) => {
        const title = section.querySelector('.section-title span');
        console.log(`Section ${idx} title:`, title ? title.textContent : 'No title');
    });
    
    const targetSection = Array.from(sections).find(section => {
        const title = section.querySelector('.section-title span');
        const hasTitle = title && title.textContent === "Типографика";
        if (hasTitle) console.log('Found typography section!');
        return hasTitle;
    });
    
    if (!targetSection) {
        console.error('Секция типографики не найдена');
        return;
    }
    console.log('Typography section found');
    
    // Находим содержимое секции
    const sectionContent = targetSection.querySelector('.section-content');
    if (!sectionContent) {
        console.error('Содержимое секции не найдено');
        return;
    }
    console.log('Section content found');
    
    // Ищем или создаем контейнер typography-content
    let typographyContent = sectionContent.querySelector('.typography-content');
    if (!typographyContent) {
        console.log('Creating typography content container...');
        typographyContent = document.createElement('div');
        typographyContent.className = 'typography-content mt-3';
        sectionContent.appendChild(typographyContent);
        console.log('Typography content created and appended');
    }
    
    // Находим или создаем блок шрифтов
    let fontsBlock = typographyContent.querySelector('.fonts-block');
    if (!fontsBlock) {
        console.log('Creating fonts block...');
        fontsBlock = document.createElement('div');
        fontsBlock.className = 'fonts-block';
        fontsBlock.id = `fontsBlock-${activeBrandId}`;
        fontsBlock.innerHTML = '<h3>Добавленные шрифты</h3>';
        
        // Создаем список шрифтов в блоке шрифтов
        const fontsList = document.createElement('div');
        fontsList.className = 'fonts-list';
        fontsBlock.appendChild(fontsList);
        
        // Добавляем блок шрифтов в контейнер
        typographyContent.appendChild(fontsBlock);
        console.log('Fonts block created with fonts-list inside and appended to typography content');
    }
    
    // Показываем блок шрифтов
    fontsBlock.style.display = 'block';
    
    // Находим список шрифтов
    let fontsList = fontsBlock.querySelector('.fonts-list');
    if (!fontsList) {
        console.log('Creating fonts list container...');
        fontsList = document.createElement('div');
        fontsList.className = 'fonts-list';
        fontsBlock.appendChild(fontsList);
    }
    
    // Создаем и добавляем новый шрифт в список
    const fontItem = createFontItem(font);
    fontsList.appendChild(fontItem);
    console.log('Font item created and added to fonts list');
}

// Функция добавления набора стилей в бренд
function addStyleSetToBrand(styleSet) {
    console.log('Adding style set to brand... Style Set ID:', styleSet.id);
    
    // Получаем активный бренд
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    console.log('Active brand ID:', activeBrandId);
    if (!activeBrandId) {
        console.error('Не найден активный бренд');
        return;
    }
    
    // Находим бренд в данных
    console.log('Looking for brand in data...');
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand) {
        console.error('Бренд не найден в данных');
        return;
    }
    console.log('Found brand:', activeBrand.name);
    
    // Инициализируем структуру данных для наборов стилей, если её нет
    if (!activeBrand.sections) activeBrand.sections = {};
    if (!activeBrand.sections.typography) activeBrand.sections.typography = {};
    if (!activeBrand.sections.typography.styleSets) activeBrand.sections.typography.styleSets = [];
    
    // Проверяем, есть ли уже такой набор стилей
    const existingStyleSetIndex = activeBrand.sections.typography.styleSets.findIndex(s => s.id === styleSet.id);
    if (existingStyleSetIndex !== -1) {
        console.warn(`Style set with ID ${styleSet.id} is already in the collection! Skipping addition.`);
        return;
    }
    
    // Добавляем набор стилей в данные
    activeBrand.sections.typography.styleSets.push(styleSet);
    console.log('Style set added to brand data. Current style sets:', activeBrand.sections.typography.styleSets);
    
    // Находим секцию в DOM для отображения набора стилей
    console.log('Looking for brand item in DOM...');
    const brandItem = document.querySelector(`.brand-item[data-id="${activeBrandId}"]`);
    if (!brandItem) {
        console.error('Элемент бренда не найден в DOM');
        return;
    }
    console.log('Brand item found in DOM');
    
    // Находим нужную секцию типографики
    console.log('Looking for typography section in the brand...');
    const sections = brandItem.querySelectorAll('.section-item');
    
    const targetSection = Array.from(sections).find(section => {
        const title = section.querySelector('.section-title span');
        const hasTitle = title && title.textContent === "Типографика";
        if (hasTitle) console.log('Found typography section!');
        return hasTitle;
    });
    
    if (!targetSection) {
        console.error('Секция типографики не найдена');
        return;
    }
    console.log('Typography section found');
    
    // Находим содержимое секции
    const sectionContent = targetSection.querySelector('.section-content');
    if (!sectionContent) {
        console.error('Содержимое секции не найдено');
        return;
    }
    console.log('Section content found');
    
    // Ищем или создаем контейнер typography-content
    let typographyContent = sectionContent.querySelector('.typography-content');
    if (!typographyContent) {
        console.log('Creating typography content container...');
        typographyContent = document.createElement('div');
        typographyContent.className = 'typography-content mt-3';
        sectionContent.appendChild(typographyContent);
        console.log('Typography content created and appended');
    }
    
    // Находим или создаем блок стилей
    let stylesBlock = typographyContent.querySelector('.styles-block');
    if (!stylesBlock) {
        console.log('Creating styles block...');
        stylesBlock = document.createElement('div');
        stylesBlock.className = 'styles-block';
        stylesBlock.id = `stylesBlock-${activeBrandId}`;
        stylesBlock.innerHTML = '<h3>Стили типографики</h3>';
        
        // Создаем список стилей
        const stylesGallery = document.createElement('div');
        stylesGallery.className = 'styles-gallery';
        stylesGallery.id = 'stylesGallery';
        stylesBlock.appendChild(stylesGallery);
        
        // Добавляем блок стилей в контейнер
        typographyContent.appendChild(stylesBlock);
        console.log('Styles block created and appended to typography content');
    }
    
    // Показываем блок стилей
    stylesBlock.style.display = 'block';
    
    // Находим список стилей
    let stylesGallery = stylesBlock.querySelector('.styles-gallery');
    if (!stylesGallery) {
        console.log('Creating styles gallery container...');
        stylesGallery = document.createElement('div');
        stylesGallery.className = 'styles-gallery';
        stylesGallery.id = 'stylesGallery';
        stylesBlock.appendChild(stylesGallery);
    }
    
    // Создаем и добавляем карточку набора стилей
    const styleSetCard = createStyleSetCard(styleSet);
    stylesGallery.appendChild(styleSetCard);
    console.log('Style set card created and added to gallery');
}

// Функция создания элемента шрифта
function createFontItem(font) {
    console.log('Creating font item for', font.family, font.type);
    const fontItem = document.createElement('div');
    fontItem.className = 'font-item';
    fontItem.dataset.id = font.id;
    
    // Создаем классы для стилизации шрифта
    const typeClass = `font-type-${font.type.toLowerCase()}`;
    const italicClass = font.isItalic ? 'font-italic' : '';
    
    // Формируем HTML для элемента шрифта
    fontItem.innerHTML = `
        <div class="font-info">
            <div class="font-name ${typeClass} ${italicClass}">${font.family} ${font.type}</div>
            ${font.isItalic ? '<div class="font-tag">Italic</div>' : ''}
        </div>
        <div class="font-actions">
            <button class="download-font-btn" title="Скачать шрифт">
                <img src="img_src/download-icon.svg" alt="Скачать">
            </button>
            <button class="delete-font-btn" title="Удалить шрифт">
                <img src="img_src/trash-icon.svg" alt="Удалить">
            </button>
        </div>
    `;
    
    // Добавляем обработчики для кнопок
    const downloadBtn = fontItem.querySelector('.download-font-btn');
    const deleteBtn = fontItem.querySelector('.delete-font-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadFont(font);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            deleteFont(font.id);
            fontItem.remove();
        });
    }
    
    return fontItem;
}

// Функция скачивания шрифта
function downloadFont(font) {
    console.log('Downloading font:', font.fileName);
    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    link.href = font.base64;
    link.download = font.fileName;
    
    // Добавляем ссылку в документ и кликаем по ней
    document.body.appendChild(link);
    link.click();
    
    // Удаляем ссылку из документа
    document.body.removeChild(link);
    console.log('Font download initiated');
}

// Функция удаления шрифта
function deleteFont(fontId) {
    console.log('Deleting font with ID:', fontId);
    // Получаем активный бренд
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (!activeBrandId) {
        console.error('Не найден активный бренд');
        return;
    }
    
    // Находим бренд в данных
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand || !activeBrand.sections || !activeBrand.sections.typography || !activeBrand.sections.typography.fonts) {
        console.error('Шрифты не найдены для бренда');
        return;
    }
    
    // Удаляем шрифт из массива
    const initialLength = activeBrand.sections.typography.fonts.length;
    activeBrand.sections.typography.fonts = activeBrand.sections.typography.fonts.filter(font => font.id !== fontId);
    console.log(`Font deleted. Fonts before: ${initialLength}, after: ${activeBrand.sections.typography.fonts.length}`);
}

// Функция удаления набора стилей
function deleteStyleSet(styleSetId) {
    console.log('Deleting style set with ID:', styleSetId);
    
    // Получаем активный бренд
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (!activeBrandId) {
        console.error('Не найден активный бренд');
        return;
    }
    
    // Находим бренд в данных
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand || !activeBrand.sections || !activeBrand.sections.typography || !activeBrand.sections.typography.styleSets) {
        console.error('Наборы стилей не найдены для бренда');
        return;
    }
    
    // Удаляем набор стилей из массива
    const initialLength = activeBrand.sections.typography.styleSets.length;
    activeBrand.sections.typography.styleSets = activeBrand.sections.typography.styleSets.filter(s => s.id !== styleSetId);
    console.log(`Style set deleted. Style sets before: ${initialLength}, after: ${activeBrand.sections.typography.styleSets.length}`);
}

// Экспортируем функции
window.initTypography = initTypography;
window.addFontToBrand = addFontToBrand;
window.downloadFont = downloadFont;
window.deleteFont = deleteFont;
window.addStyleSetToBrand = addStyleSetToBrand;
window.deleteStyleSet = deleteStyleSet;
window.populateFontSelect = populateFontSelect;
window.addStyleToStyleSet = addStyleToStyleSet;
window.deleteStyleFromStyleSet = deleteStyleFromStyleSet;
window.updateStyleSetInDOM = updateStyleSetInDOM;
window.getFontWeight = getFontWeight;

// Инициализация модуля при загрузке страницы
if (!window.typographyInitialized) {
    window.typographyInitialized = true;
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded event: initializing typography module');
        initTypography();
    });
}

console.log('Typography module loaded');
