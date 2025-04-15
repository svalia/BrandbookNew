// Модуль для работы с типографикой

// Функция инициализации модуля типографики
function initTypography() {
    console.log('Typography module initialized');
    
    // Настройка модального окна для шрифтов
    setupFontModal();
    
    // Настройка модального окна для наборов стилей
    setupStyleModal();
    
    // Настройка модального окна для добавления стиля в набор
    setupAddStyleToSetModal();
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

// Экспортируем функции для использования в других модулях
window.initTypography = initTypography;
window.updateFontsList = updateFontsList;

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event: initializing typography module');
    initTypography();
});
