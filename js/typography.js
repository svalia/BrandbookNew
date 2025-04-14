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
    const modal = document.getElementById('addFontModal');
    if (!modal) {
        console.warn('Модальное окно для добавления шрифта не найдено. Будет доступно после полной загрузки DOM.');
        
        // Попробуем установить обработчик через setTimeout для случая, когда DOM загружается асинхронно
        setTimeout(() => {
            const modalDelayed = document.getElementById('addFontModal');
            if (modalDelayed) {
                console.log('Найдено модальное окно шрифта после задержки');
                setupFontModalHandlers(modalDelayed);
            }
        }, 500);
        
        return;
    }
    
    setupFontModalHandlers(modal);
}

// Функция для установки обработчиков в модальном окне
function setupFontModalHandlers(modal) {
    const form = document.getElementById('addFontForm');
    if (!form) {
        console.error('Форма добавления шрифта не найдена');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('fontFile');
        const fontFamily = document.getElementById('fontFamily').value.trim();
        const fontType = document.getElementById('fontType').value;
        const isItalic = document.getElementById('fontItalic').checked;
        
        if (!fileInput.files || !fileInput.files[0]) {
            alert('Пожалуйста, выберите файл шрифта');
            return;
        }
        
        if (!fontFamily) {
            alert('Пожалуйста, введите название семейства шрифтов');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Преобразуем в base64
            const base64Font = e.target.result;
            
            // Создаем объект шрифта
            const font = {
                id: Date.now(),
                family: fontFamily,
                type: fontType,
                isItalic: isItalic,
                base64: base64Font,
                fileName: file.name
            };
            
            // Добавляем шрифт в текущий бренд
            addFontToBrand(font);
            
            // Сбрасываем форму
            form.reset();
            
            // Закрываем модальное окно
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        };
        
        reader.readAsDataURL(file);
    });
}

// Функция настройки модального окна добавления стиля
function setupStyleModal() {
    const modal = document.getElementById('addStyleModal');
    if (!modal) {
        console.error('Модальное окно для добавления стиля не найдено');
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
    // Получаем активный бренд
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (!activeBrandId) {
        console.error('Не найден активный бренд');
        return;
    }
    
    // Находим бренд в данных
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand) {
        console.error('Бренд не найден');
        return;
    }
    
    // Инициализируем структуру данных для шрифтов, если её нет
    if (!activeBrand.sections) activeBrand.sections = {};
    if (!activeBrand.sections.typography) activeBrand.sections.typography = {};
    if (!activeBrand.sections.typography.fonts) activeBrand.sections.typography.fonts = [];
    
    // Добавляем шрифт в данные
    activeBrand.sections.typography.fonts.push(font);
    
    // Находим секцию в DOM для отображения шрифта
    const brandItem = document.querySelector(`.brand-item[data-id="${activeBrandId}"]`);
    if (!brandItem) {
        console.error('Элемент бренда не найден в DOM');
        return;
    }
    
    // Находим нужную секцию типографики
    const sections = brandItem.querySelectorAll('.section-item');
    const targetSection = Array.from(sections).find(section => {
        const title = section.querySelector('.section-title span');
        return title && title.textContent === "Типографика";
    });
    
    if (!targetSection) {
        console.error('Секция типографики не найдена');
        return;
    }
    
    // Находим или создаем блок шрифтов
    let fontsBlock = targetSection.querySelector('.fonts-block');
    const typographyContent = targetSection.querySelector('.typography-content');
    
    if (!fontsBlock && typographyContent) {
        // Если блока нет, создаем его
        fontsBlock = document.createElement('div');
        fontsBlock.className = 'fonts-block';
        fontsBlock.innerHTML = '<h3>Добавленные шрифты</h3>';
        
        const fontsList = document.createElement('div');
        fontsList.className = 'fonts-list';
        fontsBlock.appendChild(fontsList);
        
        typographyContent.appendChild(fontsBlock);
        fontsBlock.style.display = 'block';
    } else if (fontsBlock) {
        fontsBlock.style.display = 'block';
    }
    
    // Добавляем шрифт в список
    if (fontsBlock) {
        const fontsList = fontsBlock.querySelector('.fonts-list');
        if (fontsList) {
            // Создаем элемент шрифта
            const fontItem = createFontItem(font);
            fontsList.appendChild(fontItem);
        }
    }
}

// Функция создания элемента шрифта
function createFontItem(font) {
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
            <button class="download-font-btn" title="Скачать шрифт"></button>
            <button class="delete-font-btn" title="Удалить шрифт"></button>
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
    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    link.href = font.base64;
    link.download = font.fileName;
    
    // Добавляем ссылку в документ и кликаем по ней
    document.body.appendChild(link);
    link.click();
    
    // Удаляем ссылку из документа
    document.body.removeChild(link);
}

// Функция удаления шрифта
function deleteFont(fontId) {
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
    activeBrand.sections.typography.fonts = activeBrand.sections.typography.fonts.filter(font => font.id !== fontId);
}

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', initTypography);

// Экспортируем функции
window.initTypography = initTypography;
