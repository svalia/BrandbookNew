// Модуль для работы с типографикой

// Добавим функцию getCurrentBrand в начало файла
function getCurrentBrand() {
    // Проверяем, существует ли функция в глобальном контексте (brands.js)
    if (window.getCurrentBrand) {
        return window.getCurrentBrand();
    }

    // Реализация функции для локального использования, если она не определена глобально
    const activeElements = document.querySelectorAll('.brand-item.active');
    if (activeElements.length > 0) {
        const brandId = parseInt(activeElements[0].dataset.id, 10);
        if (window.brands) {
            return window.brands.find(brand => brand.id === brandId);
        }
    }
    
    // Если активный бренд не найден через класс, берем первый бренд из списка
    const firstBrand = document.querySelector('.brand-item');
    if (firstBrand && firstBrand.dataset && firstBrand.dataset.id) {
        const brandId = parseInt(firstBrand.dataset.id, 10);
        if (window.brands) {
            return window.brands.find(brand => brand.id === brandId);
        }
    }
    
    // Если все еще не нашли, используем первый бренд из массива данных
    if (window.brands && window.brands.length > 0) {
        return window.brands[0];
    }
    
    console.warn("Не удалось найти активный бренд. Возможно, вы еще не добавили бренды.");
    return null;
}

// Функция инициализации модуля типографики
function initTypography() {
    console.log("Initializing typography section...");

    // Настроим модальное окно для добавления шрифта
    setupFontModal();

    // Настроим модальное окно для добавления набора стилей
    setupStyleSetModal();

    // Добавим обработчик события открытия модального окна для добавления стиля в набор
    const addStyleToSetModal = document.getElementById('addStyleToSetModal');
    if (addStyleToSetModal) {
        addStyleToSetModal.addEventListener('show.bs.modal', function (event) {
            // Получаем кнопку, которая вызвала модальное окно
            const button = event.relatedTarget;
            // Получаем ID набора стилей из атрибута data-set-id кнопки
            const styleSetId = button.getAttribute('data-set-id');
            // Настраиваем модальное окно для этого набора стилей
            setupStyleToSetModal(this, styleSetId);
        });
    }
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

// Добавляем функцию createTypographySectionForBrand, которая используется в refreshTypographySection
function createTypographySectionForBrand(brandId) {
    console.log("Creating typography section for brand ID:", brandId);
    
    // Находим элемент бренда
    const brandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
    if (!brandItem) {
        console.error("Brand item not found for ID:", brandId);
        return;
    }
    
    // Находим список секций бренда
    const sectionsList = brandItem.querySelector(".brand-sections-content .list-group");
    if (!sectionsList) {
        console.error("Sections list not found in brand:", brandId);
        return;
    }
    
    // Ищем секцию типографики
    let typographySection = Array.from(sectionsList.querySelectorAll(".section-item")).find(section => {
        const title = section.querySelector(".section-title");
        return title && title.textContent.includes("Типографика");
    });
    
    // Если секции типографики нет, создаем ее
    if (!typographySection) {
        typographySection = document.createElement("li");
        typographySection.className = "list-group-item section-item";
        typographySection.innerHTML = `
            <div class="section-header">
                <div class="section-title">
                    <span>Типографика</span>
                    <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                </div>
            </div>
            <div class="section-content" style="display: none;" data-section="typography">
                <div class="description-block">
                    <div class="description-content"></div>
                    <button class="add-description-btn btn btn-primary">Добавить описание</button>
                </div>
                <div class="typography-content mt-3">
                    <div class="typography-actions">
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addFontModal">Добавить шрифт</button>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStyleSetModal">Добавить набор стилей</button>
                    </div>
                    <div class="fonts-block">
                        <h3>Шрифты</h3>
                        <div class="fonts-list">
                            <p class="no-styles-message">Нет добавленных шрифтов.</p>
                        </div>
                    </div>
                    <div class="styles-block">
                        <h3>Наборы стилей</h3>
                        <p class="no-styles-message">Нет добавленных наборов стилей.</p>
                    </div>
                </div>
            </div>
        `;
        sectionsList.appendChild(typographySection);
        
        // Добавляем обработчик для сворачивания/разворачивания секции
        const sectionHeader = typographySection.querySelector(".section-header");
        const sectionContent = typographySection.querySelector(".section-content");
        const sectionIcon = sectionHeader.querySelector(".section-toggle-icon");
        
        sectionHeader.addEventListener("click", function() {
            const isVisible = sectionContent.style.display === "block";
            sectionContent.style.display = isVisible ? "none" : "block";
            sectionIcon.src = isVisible ? "img_src/chevron-down-gray.svg" : "img_src/chevron-up-gray.svg";
        });
        
        // Добавляем обработчик для кнопки "Добавить описание"
        const addDescriptionBtn = typographySection.querySelector(".add-description-btn");
        if (addDescriptionBtn) {
            addDescriptionBtn.addEventListener("click", function() {
                const descriptionBlock = this.closest(".description-block");
                if (descriptionBlock) {
                    const descriptionContent = descriptionBlock.querySelector(".description-content");
                    if (descriptionContent) {
                        // Предполагаем, что функция openEditor определена где-то еще
                        if (typeof openEditor === 'function') {
                            openEditor(descriptionContent);
                        } else {
                            console.error("openEditor function is not defined");
                        }
                    }
                }
            });
        }
    }
    
    // Показываем секцию типографики
    const sectionContent = typographySection.querySelector(".section-content");
    if (sectionContent) {
        sectionContent.style.display = "block";
        const sectionIcon = typographySection.querySelector(".section-toggle-icon");
        if (sectionIcon) {
            sectionIcon.src = "img_src/chevron-up-gray.svg";
        }
    }
    
    // Обновляем содержимое секции типографики
    renderTypographySection(brandId);
    
    return typographySection;
}

// Добавляем функцию refreshTypographySection
function refreshTypographySection(brandId) {
    console.log("Refreshing typography section for brand ID:", brandId);
    
    // Находим контейнер для секции типографики
    const brand = getBrandById(brandId);
    if (!brand) {
        console.error("Brand not found for ID:", brandId);
        return;
    }
    
    // Попробуем найти существующую секцию типографики
    const brandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
    if (!brandItem) {
        console.error("Brand item not found for ID:", brandId);
        return;
    }
    
    // Находим секцию типографики внутри бренда
    let typographySection = brandItem.querySelector('.section-content[data-section="typography"]');
    
    // Если секции типографики нет, создаем ее
    if (!typographySection) {
        console.log("Creating new typography section for brand ID:", brandId);
        const sectionItem = createTypographySectionForBrand(brandId);
        if (!sectionItem) {
            console.error("Failed to create typography section");
            return;
        }
        typographySection = sectionItem.querySelector('.section-content[data-section="typography"]');
    } else {
        console.log("Rendering existing typography section for brand ID:", brandId);
        // Если секция уже есть, просто перерисуем её
        renderTypographySection(brandId);
    }
}

// Вспомогательная функция для получения бренда по ID
function getBrandById(brandId) {
    if (window.brands) {
        return window.brands.find(brand => brand.id === parseInt(brandId, 10));
    }
    return null;
}

// Добавляем функцию getFontById, которая отсутствует
function getFontById(fontId) {
    const activeBrand = getCurrentBrand();
    if (!activeBrand || !activeBrand.sections || !activeBrand.sections.typography || !activeBrand.sections.typography.fonts) {
        console.warn("Не удалось найти шрифты в активном бренде");
        return null;
    }
    
    // Преобразуем fontId в число, если он передан как строка
    const id = typeof fontId === 'string' ? parseInt(fontId, 10) : fontId;
    
    // Ищем шрифт по ID
    const font = activeBrand.sections.typography.fonts.find(font => font.id === id);
    if (!font) {
        console.warn(`Шрифт с ID ${fontId} не найден`);
    }
    
    return font;
}

// Полностью переписываем функцию для настройки модального окна добавления набора стилей
function setupStyleSetModal() {
    console.log("Setting up style set modal...");
    
    // Вместо того, чтобы кешировать ссылки на элементы, будем получать их при каждом вызове функции
    // Это избежит проблем, если элементы были переопределены или удалены из DOM
    document.getElementById('addStyleForm').onsubmit = function(e) {
        e.preventDefault();
        console.log("Style set form submitted");
        
        // Получаем значение поля ввода непосредственно при отправке формы
        const styleSetNameValue = document.getElementById('styleSetName').value;
        console.log("Style set name value:", styleSetNameValue);
        
        // Проверяем, что значение не пустое
        if (!styleSetNameValue || styleSetNameValue.trim() === '') {
            console.error("Style set name is required");
            alert("Пожалуйста, введите название набора стилей");
            return false; // Останавливаем отправку формы
        }
        
        // Получаем активный бренд
        const activeBrand = getCurrentBrand();
        if (!activeBrand) {
            console.error("No active brand");
            alert("Пожалуйста, сначала выберите бренд");
            return false;
        }
        
        console.log("Active brand found:", activeBrand.name);
        
        // Создаем новый набор стилей
        const newStyleSet = {
            id: Date.now(),
            name: styleSetNameValue.trim(),
            styles: []
        };
        
        // Инициализируем структуру данных бренда, если она отсутствует
        if (!activeBrand.sections) {
            activeBrand.sections = {};
        }
        
        if (!activeBrand.sections.typography) {
            activeBrand.sections.typography = { description: '', fonts: [], styleSets: [] };
        }
        
        if (!activeBrand.sections.typography.styleSets) {
            activeBrand.sections.typography.styleSets = [];
        }
        
        // Добавляем набор стилей в бренд
        activeBrand.sections.typography.styleSets.push(newStyleSet);
        console.log("Style set added:", newStyleSet);
        
        // Обновляем отображение
        try {
            // Используем простую функцию вместо вызова сложной
            updateTypographyUI(activeBrand.id);
            console.log("Typography UI updated");
        } catch (error) {
            console.error("Error updating typography UI:", error);
        }
        
        // Закрываем модальное окно
        const modal = document.getElementById('addStyleSetModal');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
                console.log("Modal hidden");
            }
        }
        
        // Сбрасываем форму
        document.getElementById('styleSetName').value = '';
        this.reset();
        console.log("Form reset");
        
        return false; // Предотвращаем стандартную отправку формы
    };
}

// Обновляем функцию setupStyleToSetModal для корректной работы формы добавления стиля
function setupStyleToSetModal(modalElement, styleSetId) {
    console.log(`Setting up style to set modal for set ID: ${styleSetId}`);
    
    if (!modalElement) {
        console.error("Modal element is undefined");
        return;
    }
    
    // Получаем элементы формы
    const form = modalElement.querySelector('#addStyleToSetForm');
    const styleSetIdInput = modalElement.querySelector('#styleSetId');
    const fontSizeInput = modalElement.querySelector('#styleFontSize');
    const lineHeightInput = modalElement.querySelector('#styleLineHeight');
    const fontSelect = modalElement.querySelector('#styleFontId');
    const previewTextElement = modalElement.querySelector('#previewStyleText');
    
    // Проверяем наличие всех необходимых элементов
    if (!form || !styleSetIdInput || !fontSizeInput || !lineHeightInput || !fontSelect || !previewTextElement) {
        console.error("Some form elements not found in style to set modal");
        return;
    }
    
    // Устанавливаем ID набора стилей в скрытое поле
    styleSetIdInput.value = styleSetId;
    
    // Очищаем и заполняем список шрифтов
    fontSelect.innerHTML = '<option value="">Выберите шрифт</option>';
    
    // Получаем текущий бренд
    const activeBrand = getCurrentBrand();
    if (activeBrand && activeBrand.sections && activeBrand.sections.typography && activeBrand.sections.typography.fonts) {
        // Заполняем список шрифтов из текущего бренда
        const fonts = activeBrand.sections.typography.fonts;
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.id;
            option.textContent = `${font.family} ${font.type}${font.isItalic ? ' Italic' : ''}`;
            fontSelect.appendChild(option);
        });
    } else {
        console.warn("Не удалось найти шрифты для заполнения списка");
        // Добавим проверку наличия шрифтов при отправке формы
    }
    
    // Функция для обновления предпросмотра
    function updatePreview() {
        const fontSize = fontSizeInput.value || '0';
        const lineHeight = lineHeightInput.value || '0';
        const fontId = fontSelect.value;
        
        // Обновляем текст превью
        previewTextElement.textContent = `${fontSize}/${lineHeight} · Стиль`;
        
        // Сбрасываем стили перед установкой новых
        previewTextElement.style.fontFamily = '';
        previewTextElement.style.fontWeight = '';
        previewTextElement.style.fontStyle = '';
        
        // Обновляем стили превью, если выбран шрифт
        if (fontId && activeBrand && activeBrand.sections && activeBrand.sections.typography && activeBrand.sections.typography.fonts) {
            const font = activeBrand.sections.typography.fonts.find(f => f.id == fontId);
            if (font) {
                previewTextElement.style.fontFamily = `'${font.family}', sans-serif`;
                previewTextElement.style.fontWeight = getFontWeight(font.type);
                previewTextElement.style.fontStyle = font.isItalic ? 'italic' : 'normal';
            }
        }
        
        // Устанавливаем размер и межстрочный интервал
        previewTextElement.style.fontSize = `${fontSize}px`;
        previewTextElement.style.lineHeight = `${lineHeight}px`;
    }
    
    // Удаляем старые обработчики событий для предотвращения дублирования
    fontSizeInput.removeEventListener('input', updatePreview);
    lineHeightInput.removeEventListener('input', updatePreview);
    fontSelect.removeEventListener('change', updatePreview);
    
    // Добавляем обработчики событий для обновления предпросмотра
    fontSizeInput.addEventListener('input', updatePreview);
    lineHeightInput.addEventListener('input', updatePreview);
    fontSelect.addEventListener('change', updatePreview);
    
    // Если у формы есть старый обработчик, удаляем его
    const oldSubmitHandler = form._submitHandler;
    if (oldSubmitHandler) {
        form.removeEventListener('submit', oldSubmitHandler);
    }
    
    // Обработчик отправки формы
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Получаем значения полей формы
        const setId = parseInt(styleSetIdInput.value, 10);
        const fontSize = parseInt(fontSizeInput.value, 10);
        const lineHeight = parseInt(lineHeightInput.value, 10);
        const fontId = parseInt(fontSelect.value, 10);
        
        console.log("Form values:", {
            setId,
            fontSize,
            lineHeight,
            fontId
        });
        
        // Проверяем валидность введенных данных
        if (!setId || isNaN(setId)) {
            console.error("Неверный ID набора стилей");
            alert("Ошибка: неверный ID набора стилей");
            return;
        }
        
        if (!fontSize || isNaN(fontSize)) {
            console.error("Размер шрифта должен быть числом");
            alert("Пожалуйста, введите числовое значение для размера шрифта");
            return;
        }
        
        if (!lineHeight || isNaN(lineHeight)) {
            console.error("Межстрочный интервал должен быть числом");
            alert("Пожалуйста, введите числовое значение для межстрочного интервала");
            return;
        }
        
        if (!fontId || isNaN(fontId)) {
            console.error("Не выбран шрифт");
            alert("Пожалуйста, выберите шрифт из списка");
            return;
        }
        
        // Получаем текущий бренд и набор стилей
        const activeBrand = getCurrentBrand();
        if (!activeBrand || !activeBrand.sections || !activeBrand.sections.typography) {
            console.error("Не удалось найти активный бренд или секцию типографики");
            alert("Ошибка: не удалось найти активный бренд или секцию типографики");
            return;
        }
        
        // Инициализируем секцию типографики, если она отсутствует
        if (!activeBrand.sections.typography) {
            activeBrand.sections.typography = { 
                description: '', 
                fonts: [], 
                styleSets: [] 
            };
        }
        
        // Инициализируем наборы стилей, если они отсутствуют
        if (!activeBrand.sections.typography.styleSets) {
            activeBrand.sections.typography.styleSets = [];
        }
        
        // Находим нужный набор стилей по ID
        const styleSet = activeBrand.sections.typography.styleSets.find(set => set.id === setId);
        if (!styleSet) {
            console.error(`Набор стилей с ID ${setId} не найден`);
            alert("Ошибка: набор стилей не найден");
            return;
        }
        
        // Инициализируем массив стилей, если он еще не существует
        if (!styleSet.styles) {
            styleSet.styles = [];
        }
        
        // Создаем новый стиль
        const newStyle = {
            id: Date.now(),
            fontSize: fontSize,
            lineHeight: lineHeight,
            fontId: fontId
        };
        
        // Добавляем стиль в набор
        styleSet.styles.push(newStyle);
        console.log("Стиль добавлен в набор:", newStyle);
        
        // Обновляем отображение секции типографики
        try {
            updateTypographyUI(activeBrand.id);
            console.log("Отображение секции типографики обновлено");
        } catch (error) {
            console.error("Ошибка при обновлении отображения:", error);
        }
        
        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
            console.log("Модальное окно закрыто");
        }
        
        // Сбрасываем форму
        form.reset();
        previewTextElement.textContent = "-/- · Стиль · - · - · -";
        previewTextElement.style = "";
    }
    
    // Сохраняем обработчик в свойстве формы для возможности его удаления в будущем
    form._submitHandler = handleFormSubmit;
    
    // Добавляем обработчик отправки формы
    form.addEventListener('submit', handleFormSubmit);
    
    // Инициализируем предпросмотр при открытии модального окна
    fontSizeInput.value = "";
    lineHeightInput.value = "";
    fontSelect.value = "";
    previewTextElement.textContent = "-/- · Стиль · - · - · -";
    previewTextElement.style = "";
}

// Обновляем функцию renderTypographySection, чтобы она отображала всю секцию типографики
function renderTypographySection(brandId) {
    console.log("Рендер секции типографики для бренда:", brandId);
    
    const brand = getBrandById(brandId);
    if (!brand) {
        console.error("Бренд не найден для рендера типографики:", brandId);
        return;
    }
    
    // Находим контейнер для секции типографики
    const typographyContainer = document.querySelector(`#brandsList .brand-item[data-id="${brandId}"] .section-content[data-section="typography"]`);
    if (!typographyContainer) {
        console.error("Контейнер секции типографики не найден для бренда:", brandId);
        return;
    }
    
    // Очищаем контейнер
    // typographyContainer.innerHTML = ''; 
    // НЕ очищаем полностью контейнер, чтобы сохранить описание и другие элементы
    
    // Проверяем, существует ли уже дочерний элемент с классом typography-content
    let typographyContent = typographyContainer.querySelector('.typography-content');
    
    // Если нет, создаем новый
    if (!typographyContent) {
        typographyContent = document.createElement('div');
        typographyContent.className = 'typography-content';
        typographyContainer.appendChild(typographyContent);
    } else {
        // Если элемент уже существует, очищаем его содержимое
        typographyContent.innerHTML = '';
    }
    
    // Добавляем кнопки действий
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'typography-actions';
    actionsDiv.innerHTML = `
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addFontModal">Добавить шрифт</button>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStyleSetModal">Добавить набор стилей</button>
    `;
    typographyContent.appendChild(actionsDiv);
    
    // Отрисовываем блок шрифтов
    const fontsBlock = document.createElement('div');
    fontsBlock.className = 'fonts-block';
    fontsBlock.innerHTML = `<h3>Шрифты</h3>`;
    
    const fontsList = document.createElement('div');
    fontsList.className = 'fonts-list';
    
    // Проверяем наличие шрифтов
    if (brand.sections.typography && brand.sections.typography.fonts && brand.sections.typography.fonts.length > 0) {
        brand.sections.typography.fonts.forEach(font => {
            const fontItem = document.createElement('div');
            fontItem.className = 'font-item';
            
            const fontClass = font.isItalic ? 'font-italic' : '';
            const fontWeight = getFontWeightClass(font.type);
            
            fontItem.innerHTML = `
                <div class="font-info">
                    <span class="font-name ${fontWeight} ${fontClass}" style="font-family: '${font.family}', sans-serif;">
                        ${font.family}
                    </span>
                    <span class="font-tag">${font.type}${font.isItalic ? ' Italic' : ''}</span>
                </div>
                <div class="font-actions">
                    <button class="delete-font-btn" data-font-id="${font.id}">
                        <img src="img_src/x-icon.svg" alt="Удалить">
                    </button>
                </div>
            `;
            
            // Добавляем обработчик для кнопки удаления шрифта
            const deleteBtn = fontItem.querySelector('.delete-font-btn');
            deleteBtn.addEventListener('click', function() {
                if (confirm('Вы уверены, что хотите удалить этот шрифт?')) {
                    deleteFont(brand.id, font.id);
                    fontItem.remove();
                }
            });
            
            fontsList.appendChild(fontItem);
        });
    } else {
        fontsList.innerHTML = '<p class="no-styles-message">Нет добавленных шрифтов.</p>';
    }
    
    fontsBlock.appendChild(fontsList);
    typographyContent.appendChild(fontsBlock);
    
    // Отрисовываем блок наборов стилей
    const stylesBlock = document.createElement('div');
    stylesBlock.className = 'styles-block';
    stylesBlock.innerHTML = `<h3>Наборы стилей</h3>`;
    
    // Проверяем наличие наборов стилей
    if (brand.sections.typography && brand.sections.typography.styleSets && brand.sections.typography.styleSets.length > 0) {
        brand.sections.typography.styleSets.forEach(styleSet => {
            const styleSetCard = document.createElement('div');
            styleSetCard.className = 'style-set-card';
            
            const styleSetHeader = document.createElement('div');
            styleSetHeader.className = 'style-set-header';
            styleSetHeader.innerHTML = `
                <h4 class="style-set-name">${styleSet.name}</h4>
                <button class="delete-style-set-btn" data-set-id="${styleSet.id}">
                    <img src="img_src/x-icon.svg" alt="Удалить">
                </button>
            `;
            
            // Добавляем обработчик для кнопки удаления набора стилей
            styleSetHeader.querySelector('.delete-style-set-btn').addEventListener('click', function() {
                if (confirm('Вы уверены, что хотите удалить этот набор стилей?')) {
                    deleteStyleSet(brand.id, styleSet.id);
                    styleSetCard.remove();
                }
            });
            
            const styleSetContent = document.createElement('div');
            styleSetContent.className = 'style-set-content';
            
            // Проверяем наличие стилей в наборе
            if (styleSet.styles && styleSet.styles.length > 0) {
                styleSet.styles.forEach(style => {
                    const styleItem = createStyleItem(style, styleSet.id);
                    styleSetContent.appendChild(styleItem);
                });
            } else {
                styleSetContent.innerHTML = '<p class="no-styles-message">В этом наборе пока нет стилей.</p>';
            }
            
            const addStyleBtn = document.createElement('button');
            addStyleBtn.className = 'btn btn-sm btn-outline-primary add-style-to-set-btn';
            addStyleBtn.textContent = 'Добавить стиль';
            addStyleBtn.dataset.setId = styleSet.id;
            addStyleBtn.dataset.bsToggle = 'modal';
            addStyleBtn.dataset.bsTarget = '#addStyleToSetModal';
            
            styleSetCard.appendChild(styleSetHeader);
            styleSetCard.appendChild(styleSetContent);
            styleSetCard.appendChild(addStyleBtn);
            stylesBlock.appendChild(styleSetCard);
        });
    } else {
        stylesBlock.innerHTML += '<p class="no-styles-message">Нет добавленных наборов стилей.</p>';
    }
    
    typographyContent.appendChild(stylesBlock);
}

// Вспомогательная функция для создания элемента стиля
function createStyleItem(style, setId) {
    const styleItem = document.createElement('div');
    styleItem.className = 'style-item';
    
    // Получаем информацию о шрифте
    const font = getFontById(style.fontId);
    const fontName = font ? `${font.family} ${font.type}${font.isItalic ? ' Italic' : ''}` : 'Неизвестный шрифт';
    
    // Добавляем текст стиля
    const styleText = document.createElement('div');
    styleText.className = 'style-item-text';
    styleText.textContent = `${style.fontSize}/${style.lineHeight} · ${fontName}`;
    
    // Если шрифт найден, применяем его стили
    if (font) {
        styleText.style.fontFamily = `'${font.family}', sans-serif`;
        styleText.style.fontSize = `${style.fontSize}px`;
        styleText.style.lineHeight = `${style.lineHeight}px`;
        styleText.style.fontWeight = getFontWeight(font.type);
        if (font.isItalic) {
            styleText.style.fontStyle = 'italic';
        }
    }
    
    // Добавляем кнопку удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-style-item-btn';
    deleteBtn.dataset.styleId = style.id;
    deleteBtn.dataset.setId = setId;
    
    const deleteImg = document.createElement('img');
    deleteImg.src = 'img_src/x-icon.svg';
    deleteImg.alt = 'Удалить';
    
    deleteBtn.appendChild(deleteImg);
    
    // Добавляем элементы в стиль
    styleItem.appendChild(styleText);
    styleItem.appendChild(deleteBtn);
    
    return styleItem;
}

// Функция удаления шрифта
function deleteFont(brandId, fontId) {
    const brand = getBrandById(brandId);
    if (!brand || !brand.sections.typography || !brand.sections.typography.fonts) return;
    
    brand.sections.typography.fonts = brand.sections.typography.fonts.filter(font => font.id !== fontId);
    
    // Также проверяем стили, использующие этот шрифт
    if (brand.sections.typography.styleSets) {
        brand.sections.typography.styleSets.forEach(styleSet => {
            if (styleSet.styles) {
                // Помечаем стили с удаленным шрифтом
                styleSet.styles.forEach(style => {
                    if (style.fontId === fontId) {
                        style.fontDeleted = true;
                    }
                });
            }
        });
    }
}

// Функция удаления набора стилей
function deleteStyleSet(brandId, setId) {
    const brand = getBrandById(brandId);
    if (!brand || !brand.sections.typography || !brand.sections.typography.styleSets) return;
    
    brand.sections.typography.styleSets = brand.sections.typography.styleSets.filter(set => set.id !== setId);
}

// Вспомогательная функция для получения класса весов шрифтов
function getFontWeightClass(fontType) {
    switch (fontType) {
        case 'Thin': return 'font-type-thin';
        case 'Light': return 'font-type-light';
        case 'Regular': return 'font-type-regular';
        case 'Medium': return 'font-type-medium';
        case 'Semibold': return 'font-type-semibold';
        case 'Bold': return 'font-type-bold';
        case 'Heavy': return 'font-type-heavy';
        default: return 'font-type-regular';
    }
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

// Добавим простую функцию для обновления UI секции типографики
function updateTypographyUI(brandId) {
    console.log("Updating typography UI for brand:", brandId);
    
    // Найдем бренд по ID
    const brand = window.brands.find(b => b.id === brandId);
    if (!brand) {
        console.error("Brand not found:", brandId);
        return;
    }
    
    // Найдем контейнер секции типографики для этого бренда
    const brandItem = document.querySelector(`.brand-item[data-id="${brandId}"]`);
    if (!brandItem) {
        console.error("Brand item element not found for ID:", brandId);
        return;
    }
    
    // Найдем в нём секцию типографики
    let typographySection;
    const sections = brandItem.querySelectorAll('.section-item');
    for (const section of sections) {
        const title = section.querySelector('.section-title');
        if (title && title.textContent.includes('Типографика')) {
            typographySection = section;
            break;
        }
    }
    
    if (!typographySection) {
        console.error("Typography section not found in brand:", brandId);
        return;
    }
    
    // Находим или создаем контейнер для контента секции
    let sectionContent = typographySection.querySelector('.section-content');
    if (!sectionContent) {
        sectionContent = document.createElement('div');
        sectionContent.className = 'section-content';
        sectionContent.style.display = 'block';
        typographySection.appendChild(sectionContent);
    } else {
        sectionContent.style.display = 'block';
    }
    
    // Проверяем наличие контейнера для типографики
    let typographyContent = sectionContent.querySelector('.typography-content');
    if (!typographyContent) {
        typographyContent = document.createElement('div');
        typographyContent.className = 'typography-content';
        sectionContent.appendChild(typographyContent);
    }
    
    // Формируем HTML для кнопок добавления в типографику
    let html = `
        <div class="typography-actions">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addFontModal">Добавить шрифт</button>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStyleSetModal">Добавить набор стилей</button>
        </div>
    `;
    
    // Формируем HTML для блока шрифтов
    html += `
        <div class="fonts-block">
            <h3>Шрифты</h3>
            <div class="fonts-list">
    `;
    
    // Добавляем шрифты, если они есть
    if (brand.sections?.typography?.fonts && brand.sections.typography.fonts.length > 0) {
        brand.sections.typography.fonts.forEach(font => {
            html += `
                <div class="font-item">
                    <div class="font-info">
                        <span class="font-name">${font.family}</span>
                        <span class="font-tag">${font.type}${font.isItalic ? ' Italic' : ''}</span>
                    </div>
                    <div class="font-actions">
                        <button class="delete-font-btn" data-font-id="${font.id}">
                            <img src="img_src/x-icon.svg" alt="Удалить">
                        </button>
                    </div>
                </div>
            `;
        });
    } else {
        html += '<p class="no-styles-message">Нет добавленных шрифтов.</p>';
    }
    
    html += `
            </div>
        </div>
    `;
    
    // Формируем HTML для блока наборов стилей
    html += `
        <div class="styles-block">
            <h3>Наборы стилей</h3>
    `;
    
    // Добавляем наборы стилей, если они есть
    if (brand.sections?.typography?.styleSets && brand.sections.typography.styleSets.length > 0) {
        brand.sections.typography.styleSets.forEach(styleSet => {
            html += `
                <div class="style-set-card">
                    <div class="style-set-header">
                        <h4 class="style-set-name">${styleSet.name}</h4>
                        <button class="delete-style-set-btn" data-set-id="${styleSet.id}">
                            <img src="img_src/x-icon.svg" alt="Удалить">
                        </button>
                    </div>
                    <div class="style-set-content">
            `;
            
            // Добавляем стили из набора
            if (styleSet.styles && styleSet.styles.length > 0) {
                styleSet.styles.forEach(style => {
                    // Находим информацию о шрифте
                    const font = brand.sections.typography.fonts.find(f => f.id === style.fontId);
                    const fontName = font ? `${font.family} ${font.type}${font.isItalic ? ' Italic' : ''}` : 'Неизвестный шрифт';
                    
                    html += `
                        <div class="style-item">
                            <div class="style-item-text" style="
                                ${font ? `font-family: '${font.family}', sans-serif;` : ''}
                                font-size: ${style.fontSize}px;
                                line-height: ${style.lineHeight}px;
                                ${font ? `font-weight: ${getFontWeight(font.type)};` : ''}
                                ${font && font.isItalic ? 'font-style: italic;' : ''}
                            ">
                                ${style.fontSize}/${style.lineHeight} · ${fontName}
                            </div>
                            <button class="delete-style-item-btn" data-style-id="${style.id}" data-set-id="${styleSet.id}">
                                <img src="img_src/x-icon.svg" alt="Удалить">
                            </button>
                        </div>
                    `;
                });
            } else {
                html += '<p class="no-styles-message">В этом наборе пока нет стилей.</p>';
            }
            
            html += `
                    </div>
                    <button class="btn btn-sm btn-outline-primary add-style-to-set-btn" data-set-id="${styleSet.id}" data-bs-toggle="modal" data-bs-target="#addStyleToSetModal">
                        Добавить стиль
                    </button>
                </div>
            `;
        });
    } else {
        html += '<p class="no-styles-message">Нет добавленных наборов стилей.</p>';
    }
    
    html += `
        </div>
    `;
    
    // Обновляем содержимое
    typographyContent.innerHTML = html;
    
    // Разворачиваем секцию
    const sectionHeader = typographySection.querySelector('.section-header');
    if (sectionHeader) {
        const toggleIcon = sectionHeader.querySelector('.section-toggle-icon');
        if (toggleIcon) {
            toggleIcon.src = 'img_src/chevron-up-gray.svg';
        }
    }
    
    // Добавляем обработчики для кнопок удаления стилей и шрифтов
    attachDeleteHandlers(typographyContent, brandId);
}

// Функция для привязки обработчиков к кнопкам удаления
function attachDeleteHandlers(container, brandId) {
    // Обработчики для кнопок удаления шрифтов
    const fontDeleteButtons = container.querySelectorAll('.delete-font-btn');
    fontDeleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const fontId = parseInt(this.dataset.fontId);
            if (confirm('Вы уверены, что хотите удалить этот шрифт?')) {
                deleteFont(brandId, fontId);
                this.closest('.font-item').remove();
            }
        });
    });
    
    // Обработчики для кнопок удаления наборов стилей
    const setDeleteButtons = container.querySelectorAll('.delete-style-set-btn');
    setDeleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const setId = parseInt(this.dataset.setId);
            if (confirm('Вы уверены, что хотите удалить этот набор стилей?')) {
                deleteStyleSet(brandId, setId);
                this.closest('.style-set-card').remove();
            }
        });
    });
    
    // Обработчики для кнопок удаления стилей
    const styleDeleteButtons = container.querySelectorAll('.delete-style-item-btn');
    styleDeleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const setId = parseInt(this.dataset.setId);
            const styleId = parseInt(this.dataset.styleId);
            const brand = getBrandById(brandId);
            
            if (brand && brand.sections?.typography?.styleSets) {
                const styleSet = brand.sections.typography.styleSets.find(set => set.id === setId);
                if (styleSet && styleSet.styles) {
                    styleSet.styles = styleSet.styles.filter(style => style.id !== styleId);
                    this.closest('.style-item').remove();
                }
            }
        });
    });
}

// Экспортируем функции для использования в других модулях
window.initTypography = initTypography;
window.updateFontsList = updateFontsList;

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event: initializing typography module');
    initTypography();
});
