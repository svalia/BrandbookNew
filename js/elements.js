// Модуль для работы с графическими элементами

// Инициализация модуля
function initElements() {
    console.log('Elements module initialized');
    
    // Настройка модального окна
    setupGraphicElementModal();
    
    // Настройка тултипов
    setupTooltips();
}

// Функция настройки модального окна
function setupGraphicElementModal() {
    const modal = document.getElementById('addGraphicElementModal');
    if (!modal) {
        console.error('Модальное окно для графических элементов не найдено');
        return;
    }
    
    // Настройка выбора типа элемента
    const elementTypeSelect = document.getElementById('elementType');
    const customTypeField = document.getElementById('customTypeField');
    if (elementTypeSelect && customTypeField) {
        elementTypeSelect.addEventListener('change', function() {
            customTypeField.style.display = this.value === 'Other' ? 'block' : 'none';
        });
    }
    
    // Настройка предпросмотра файла
    const fileInput = document.getElementById('elementFile');
    const previewContainer = document.getElementById('elementPreview');
    if (fileInput && previewContainer) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            // Проверка типов файлов
            if (!['image/svg+xml', 'image/png'].includes(file.type)) {
                previewContainer.innerHTML = '<p class="text-danger">Неподдерживаемый формат файла. Используйте SVG или PNG.</p>';
                return;
            }
            
            // Создаем превью
            const reader = new FileReader();
            reader.onload = function(e) {
                previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px;">`;
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Счетчик символов для описания
    const descriptionInput = document.getElementById('elementDescription');
    const charCounter = document.getElementById('descriptionChars');
    if (descriptionInput && charCounter) {
        descriptionInput.addEventListener('input', function() {
            const count = this.value.length;
            charCounter.textContent = count;
            
            // Меняем цвет при приближении к лимиту
            if (count > 400) {
                charCounter.className = count > 450 ? 'text-danger' : 'text-warning';
            } else {
                charCounter.className = '';
            }
        });
    }
    
    // Обработчик формы
    const form = document.getElementById('addGraphicElementForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем тип элемента (стандартный или пользовательский)
            const typeSelect = document.getElementById('elementType');
            const customTypeInput = document.getElementById('customType');
            
            let elementType;
            if (typeSelect.value === 'Other' && customTypeInput.value.trim()) {
                elementType = customTypeInput.value.trim();
            } else if (typeSelect.value && typeSelect.value !== 'Other') {
                elementType = typeSelect.value;
            } else {
                alert('Пожалуйста, выберите тип элемента или введите свой');
                return;
            }
            
            // Проверяем загруженный файл
            const fileInput = document.getElementById('elementFile');
            if (!fileInput.files || !fileInput.files[0]) {
                alert('Пожалуйста, выберите файл');
                return;
            }
            
            // Получаем теги
            const tagsInput = document.getElementById('elementTags');
            if (!tagsInput.value.trim()) {
                alert('Пожалуйста, введите хотя бы один тег');
                return;
            }
            
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            // Получаем описание
            const description = document.getElementById('elementDescription').value.trim();
            
            // Конвертируем файл в base64
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Создаем объект элемента
                const element = {
                    id: Date.now(),
                    type: elementType,
                    tags: tags,
                    description: description,
                    image: e.target.result // base64 данные
                };
                
                // Добавляем элемент в текущий бренд
                addElementToBrand(element);
                
                // Сбрасываем форму и закрываем модальное окно
                form.reset();
                previewContainer.innerHTML = '<p class="text-muted mb-0">Изображение будет показано здесь после выбора файла</p>';
                customTypeField.style.display = 'none';
                charCounter.textContent = '0';
                
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            };
            
            reader.readAsDataURL(file);
        });
    }
}

// Функция добавления элемента в бренд
function addElementToBrand(element) {
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
    
    // Инициализируем структуру данных для элементов, если её нет
    if (!activeBrand.sections) activeBrand.sections = {};
    if (!activeBrand.sections.graphicElements) activeBrand.sections.graphicElements = {};
    if (!activeBrand.sections.graphicElements.items) activeBrand.sections.graphicElements.items = [];
    
    // Добавляем элемент в данные
    activeBrand.sections.graphicElements.items.push(element);
    
    // Находим секцию в DOM для отображения элемента
    const brandItem = document.querySelector(`.brand-item[data-id="${activeBrandId}"]`);
    if (!brandItem) {
        console.error('Элемент бренда не найден в DOM');
        return;
    }
    
    // Находим нужную секцию с графическими элементами
    const sectionItems = brandItem.querySelectorAll('.section-item');
    const targetSection = Array.from(sectionItems).find(section => {
        const title = section.querySelector('.section-title span');
        return title && title.textContent === "Графические элементы";
    });
    
    if (!targetSection) {
        console.error('Секция для графических элементов не найдена');
        return;
    }
    
    // Находим или создаем галерею элементов
    let elementGallery = targetSection.querySelector('.element-gallery');
    const sectionContent = targetSection.querySelector('.section-content');
    
    if (!elementGallery && sectionContent) {
        // Если галерея не найдена, возможно мы неправильно ищем
        console.log('Галерея элементов не найдена, проверяем всю секцию');
        console.log('Содержимое секции:', sectionContent.innerHTML);
    }
    
    if (!elementGallery && sectionContent) {
        // Если галереи нет, создаем её
        elementGallery = document.createElement('div');
        elementGallery.className = 'element-gallery mt-3';
        sectionContent.appendChild(elementGallery);
    }
    
    if (elementGallery) {
        // Создаем карточку элемента
        const card = createElementCard(element);
        elementGallery.appendChild(card);
    }
}

// Функция создания карточки элемента
function createElementCard(element) {
    const card = document.createElement('div');
    card.className = 'element-card';
    card.dataset.id = element.id;
    
    // Форматируем тип для CSS-класса
    const typeClass = element.type.replace(/\s+/g, '-');
    
    // Создаем HTML для карточки
    card.innerHTML = `
        <div class="element-preview">
            <img src="${element.image}" alt="${element.type}">
            <button class="delete-element-btn">
                <img src="img_src/x-icon.svg" alt="Удалить">
            </button>
        </div>
        <div class="element-info">
            <span class="element-type ${typeClass}">${element.type}</span>
            <div class="element-tags">
                ${element.tags.map(tag => `<span class="element-tag">${tag}</span>`).join('')}
            </div>
            <div class="element-tooltip dynamic-tooltip">
                <span class="element-description-link">Посмотреть описание</span>
                <span class="tooltip-text">${element.description || 'Без описания'}</span>
            </div>
        </div>
    `;
    
    // Добавляем обработчик для кнопки удаления
    const deleteBtn = card.querySelector('.delete-element-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Удаляем карточку из DOM
            card.remove();
            
            // Удаляем элемент из данных
            const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
            if (activeBrandId) {
                const activeBrand = window.brands.find(b => b.id === activeBrandId);
                if (activeBrand && activeBrand.sections && activeBrand.sections.graphicElements) {
                    // Фильтруем массив элементов, удаляя текущий
                    activeBrand.sections.graphicElements.items = 
                        activeBrand.sections.graphicElements.items.filter(el => el.id !== element.id);
                }
            }
        });
    }
    
    return card;
}

// Функция настройки тултипов
function setupTooltips() {
    document.addEventListener('mouseover', function(e) {
        if (e.target && (e.target.classList.contains('element-description-link') || 
            e.target.closest('.element-description-link'))) {
            
            const tooltip = e.target.closest('.element-tooltip').querySelector('.tooltip-text');
            if (tooltip) {
                // Get position of the link
                const linkRect = e.target.getBoundingClientRect();
                
                // Calculate position for tooltip
                const top = linkRect.top - tooltip.offsetHeight - 10;
                const left = linkRect.left + (linkRect.width / 2);
                
                // Apply position
                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
                tooltip.style.transform = 'translateX(-50%)';
                
                // Make sure tooltip stays within viewport
                setTimeout(() => {
                    const tooltipRect = tooltip.getBoundingClientRect();
                    
                    // Check if tooltip is outside viewport horizontally
                    if (tooltipRect.left < 10) {
                        tooltip.style.left = '10px';
                        tooltip.style.transform = 'none';
                    } else if (tooltipRect.right > window.innerWidth - 10) {
                        tooltip.style.left = 'auto';
                        tooltip.style.right = '10px';
                        tooltip.style.transform = 'none';
                    }
                    
                    // Check if tooltip is outside viewport vertically
                    if (tooltipRect.top < 10) {
                        // Position below instead of above
                        tooltip.style.top = `${linkRect.bottom + 10}px`;
                    }
                }, 0);
            }
        }
    });
}

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', initElements);
