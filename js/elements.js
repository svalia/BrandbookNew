// Модуль для работы с графическими элементами

// Инициализация модуля
function initElements() {
    console.log('Elements module initialized');
    
    // Настройка модального окна добавления графического элемента
    setupElementModal();
}

// Функция настройки модального окна добавления графического элемента
function setupElementModal() {
    console.log('Setting up element modal...');
    const modal = document.getElementById('addGraphicElementModal');
    if (!modal) {
        console.error('Модальное окно для добавления графического элемента не найдено');
        return;
    }
    
    console.log('Element modal found, setting up form...');
    const form = document.getElementById('addGraphicElementForm');
    if (!form) {
        console.error('Форма добавления графического элемента не найдена');
        return;
    }
    
    // Remove any existing submit event listeners to prevent duplicates
    const clonedForm = form.cloneNode(true);
    form.parentNode.replaceChild(clonedForm, form);
    
    console.log('Element form found, adding submit event listener...');
    // Add flag to track submission in progress
    let isSubmitting = false;
    
    // Setup file input preview
    const fileInput = clonedForm.querySelector('#elementFile');
    const elementPreview = document.getElementById('elementPreview');
    
    if (fileInput && elementPreview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '200px';
                    elementPreview.innerHTML = '';
                    elementPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Setup description character counter
    const descriptionTextarea = clonedForm.querySelector('#elementDescription');
    const descriptionCounter = clonedForm.querySelector('#descriptionChars');
    
    if (descriptionTextarea && descriptionCounter) {
        descriptionTextarea.addEventListener('input', function() {
            const count = this.value.length;
            descriptionCounter.textContent = count;
            
            if (count > 400) {
                descriptionCounter.classList.add('warning');
            } else {
                descriptionCounter.classList.remove('warning');
            }
            
            if (count > 450) {
                descriptionCounter.classList.add('danger');
            } else {
                descriptionCounter.classList.remove('danger');
            }
        });
    }
    
    // Handle form submission
    clonedForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (isSubmitting) {
            console.log('Submission already in progress, ignoring duplicate submit event');
            return;
        }
        
        isSubmitting = true;
        console.log('Form submitted, processing element data...');
        
        const elementType = document.getElementById('elementType').value;
        const elementFile = document.getElementById('elementFile');
        const elementTags = document.getElementById('elementTags').value.trim();
        const elementDescription = document.getElementById('elementDescription').value.trim();
        
        if (!elementFile.files || !elementFile.files[0]) {
            console.error('No file selected');
            alert('Пожалуйста, выберите файл.');
            isSubmitting = false;
            return;
        }
        
        if (!elementTags) {
            console.error('No tags provided');
            alert('Пожалуйста, введите хотя бы один тег.');
            isSubmitting = false;
            return;
        }
        
        const file = elementFile.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const elementData = {
                id: Date.now(),
                type: elementType,
                image: e.target.result,
                tags: elementTags.split(',').map(tag => tag.trim()),
                description: elementDescription,
                fileName: file.name
            };
            
            addElementToBrand(elementData);
            
            // Reset submission flag
            isSubmitting = false;
            
            // Reset form
            clonedForm.reset();
            elementPreview.innerHTML = '<p class="text-muted mb-0">Изображение будет показано здесь после выбора файла</p>';
            descriptionCounter.textContent = '0';
            
            // Close modal
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        };
        
        reader.onerror = function(error) {
            console.error('Error reading file:', error);
            alert('Произошла ошибка при чтении файла.');
            isSubmitting = false;
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Exception when reading file:', error);
            alert('Произошла ошибка при обработке файла.');
            isSubmitting = false;
        }
    });
    
    console.log('Element modal setup completed');
}

// Функция добавления элемента в бренд
function addElementToBrand(elementData) {
    console.log('Adding element to brand:', elementData);
    
    // Получаем активный бренд
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (!activeBrandId) {
        console.error('Не найден активный бренд');
        alert('Ошибка: Не удалось найти активный бренд. Пожалуйста, выберите бренд перед добавлением элемента.');
        return;
    }
    
    // Находим бренд в данных
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand) {
        console.error('Бренд не найден в данных');
        alert('Ошибка: Бренд не найден в данных. Пожалуйста, обновите страницу и попробуйте снова.');
        return;
    }
    
    console.log('Found brand:', activeBrand.name);
    
    // Инициализируем структуру для элементов, если её нет
    if (!activeBrand.sections) activeBrand.sections = {};
    if (!activeBrand.sections.elements) activeBrand.sections.elements = {};
    if (!activeBrand.sections.elements.items) activeBrand.sections.elements.items = [];
    
    // Добавляем элемент в данные
    activeBrand.sections.elements.items.push(elementData);
    console.log('Element added to brand data. Current elements:', activeBrand.sections.elements.items.length);
    
    // Находим секцию в DOM для отображения элемента
    const brandItem = document.querySelector(`.brand-item[data-id="${activeBrandId}"]`);
    if (!brandItem) {
        console.error('Элемент бренда не найден в DOM');
        return;
    }
    
    // Находим галерею элементов
    const elementGallery = findElementGallery(brandItem);
    if (!elementGallery) {
        console.error('Галерея элементов не найдена в DOM');
        return;
    }
    
    // Создаем и добавляем элемент в галерею
    const elementCard = createElementCard(elementData);
    elementGallery.appendChild(elementCard);
    
    console.log('Element card created and added to gallery');
}

// Функция для нахождения галереи элементов в DOM
function findElementGallery(brandItem) {
    const sections = brandItem.querySelectorAll('.section-item');
    
    // Ищем секцию "Графические элементы"
    for (const section of sections) {
        const title = section.querySelector('.section-title span');
        if (title && title.textContent.includes('Графические элементы')) {
            // Нашли нужную секцию, ищем в ней галерею
            const elementGallery = section.querySelector('.element-gallery');
            if (elementGallery) {
                return elementGallery;
            }
            
            // Если галерея не найдена, создаем её
            const sectionContent = section.querySelector('.section-content');
            if (sectionContent) {
                // Проверяем, есть ли уже контейнер для добавления элементов
                let container = sectionContent.querySelector('.mt-3');
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'mt-3';
                    sectionContent.appendChild(container);
                    
                    const addButton = document.createElement('button');
                    addButton.className = 'btn btn-primary add-element-btn';
                    addButton.textContent = 'Добавить';
                    addButton.addEventListener('click', function() {
                        const modal = new bootstrap.Modal(document.getElementById('addGraphicElementModal'));
                        modal.show();
                    });
                    container.appendChild(addButton);
                    
                    const gallery = document.createElement('div');
                    gallery.className = 'element-gallery mt-3';
                    container.appendChild(gallery);
                    
                    return gallery;
                }
                
                // Если контейнер есть, ищем в нем галерею
                let gallery = container.querySelector('.element-gallery');
                if (!gallery) {
                    gallery = document.createElement('div');
                    gallery.className = 'element-gallery mt-3';
                    container.appendChild(gallery);
                    
                    return gallery;
                }
                
                return gallery;
            }
        }
    }
    
    return null;
}

// Функция для создания карточки элемента
function createElementCard(elementData) {
    const card = document.createElement('div');
    card.className = 'element-card';
    card.dataset.id = elementData.id;
    
    // Создаем превью элемента
    const preview = document.createElement('div');
    preview.className = 'element-preview';
    
    const img = document.createElement('img');
    img.src = elementData.image;
    img.alt = elementData.fileName || 'Graphic element';
    preview.appendChild(img);
    
    // Создаем информацию об элементе
    const info = document.createElement('div');
    info.className = 'element-info';
    
    // Создаем блок с типом элемента
    const typeClass = elementData.type.replace(/\s+/g, '-');
    const typeElement = document.createElement('div');
    typeElement.className = `element-type ${typeClass}`;
    typeElement.textContent = elementData.type;
    info.appendChild(typeElement);
    
    // Создаем блок с тегами
    if (elementData.tags && elementData.tags.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'element-tags';
        
        elementData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'element-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        info.appendChild(tagsContainer);
    }
    
    // Создаем блок с описанием, если оно есть
    if (elementData.description) {
        const descriptionLink = document.createElement('div');
        descriptionLink.className = 'element-description-link element-tooltip';
        descriptionLink.textContent = 'Подробнее';
        
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = elementData.description;
        
        descriptionLink.appendChild(tooltip);
        info.appendChild(descriptionLink);
        
        // Добавляем обработчик для позиционирования тултипа
        descriptionLink.addEventListener('mouseenter', function(e) {
            const rect = descriptionLink.getBoundingClientRect();
            tooltip.style.bottom = `${window.innerHeight - rect.top + 10}px`;
            tooltip.style.left = `${rect.left}px`;
        });
    }
    
    // Создаем кнопку удаления
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-element-btn';
    deleteButton.title = 'Удалить элемент';
    
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'img_src/trash-icon.svg';
    deleteIcon.alt = 'Удалить';
    
    deleteButton.appendChild(deleteIcon);
    
    // Добавляем обработчик удаления
    deleteButton.addEventListener('click', function() {
        deleteElement(elementData.id);
        card.remove();
    });
    
    // Собираем карточку
    card.appendChild(preview);
    card.appendChild(info);
    card.appendChild(deleteButton);
    
    return card;
}

// Функция для удаления элемента
function deleteElement(elementId) {
    console.log('Deleting element with ID:', elementId);
    
    const activeBrandId = window.getActiveBrandId ? window.getActiveBrandId() : null;
    if (!activeBrandId) {
        console.error('Не найден активный бренд');
        return;
    }
    
    const activeBrand = window.brands.find(b => b.id === activeBrandId);
    if (!activeBrand || !activeBrand.sections || !activeBrand.sections.elements || !activeBrand.sections.elements.items) {
        console.error('Элементы не найдены для бренда');
        return;
    }
    
    const initialLength = activeBrand.sections.elements.items.length;
    activeBrand.sections.elements.items = activeBrand.sections.elements.items.filter(item => item.id !== elementId);
    console.log(`Element deleted. Elements before: ${initialLength}, after: ${activeBrand.sections.elements.items.length}`);
}

// Экспортируем функции
window.initElements = initElements;
window.addElementToBrand = addElementToBrand;
window.deleteElement = deleteElement;

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', initElements);
