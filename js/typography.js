// Модуль для работы с типографикой

// Инициализация модуля
function initTypography() {
    console.log('Typography module initialized');
    
    // Настройка модального окна добавления шрифта
    setupFontModal();
    
    // Настройка модального окна добавления стиля
    setupStyleModal();
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
    const modal = document.getElementById('addStyleModal');
    if (!modal) {
        console.warn('Модальное окно для добавления стиля не найдено');
        return;
    }
    
    const form = document.getElementById('addStyleForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь будет логика обработки добавления стиля
            alert('Функция добавления стиля в разработке');
            
            // Закрываем модальное окно
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
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

// Экспортируем функции
window.initTypography = initTypography;
window.addFontToBrand = addFontToBrand;
window.downloadFont = downloadFont;
window.deleteFont = deleteFont;

// Инициализация модуля при загрузке страницы
if (!window.typographyInitialized) {
    window.typographyInitialized = true;
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded event: initializing typography module');
        initTypography();
    });
}

console.log('Typography module loaded');
