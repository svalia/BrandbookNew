import { saveBrandsToStorage, loadBrandsFromStorage } from './storageManager.js';
import { addColorToPalette, deletePalette, updatePaletteColors, removeColorFromPalette } from './colorManager.js';
import { addItem, deleteItem } from './itemManager.js';

// Функции для управления пользовательским интерфейсом

// Заголовки секций
const sectionTitles = {
    brandDescription: 'Описание бренда',
    logos: 'Логотипы',
    colors: 'Цвета',
    textures: 'Текстуры',
    typography: 'Типография',
    keyElements: 'Ключевые элементы',
    toneOfVoice: 'Тон коммуникации',
    serviceStandards: 'Стандарты обслуживания',
    graphicElements: 'Графические элементы',
    advertisingMaterials: 'Рекламные материалы',
    styleGuide: 'Руководство по стилю'
};

// Константы для логотипов
const logoOptions = {
    colors: {
        white: 'White',
        black: 'Black',
        green: 'Green',
        graphite: 'Graphite',
        multicolor: 'Multicolor',
        custom: 'Custom'
    },
    languages: {
        rus: 'Russian',
        eng: 'English',
        multi: 'Universal'
    },
    types: {
        main: 'Primary',
        simple: 'Simplified',
        sign: 'Sign'
    },
    orientations: {
        horizontal: 'Horizontal',
        vertical: 'Vertical',
        square: 'Square'
    }
};

// Функция для сохранения состояния секций в localStorage
function saveSectionState(sectionId, isExpanded) {
    const sectionStates = JSON.parse(localStorage.getItem('sectionStates')) || {};
    sectionStates[sectionId] = isExpanded;
    localStorage.setItem('sectionStates', JSON.stringify(sectionStates));
    console.log(`Сохранено состояние секции: ${sectionId}, развернута: ${isExpanded}`);
}

// Функция для загрузки состояния секций из localStorage
function loadSectionState(sectionId) {
    const sectionStates = JSON.parse(localStorage.getItem('sectionStates')) || {};
    const state = sectionStates[sectionId] || false;
    console.log(`Загружено состояние секции: ${sectionId}, развернута: ${state}`);
    return state;
}

// Функция для сохранения состояния всех секций
export function saveAllSectionStates() {
    const sectionStates = {};
    document.querySelectorAll('.collapse').forEach(collapseElement => {
        const sectionId = collapseElement.id;
        const isExpanded = collapseElement.classList.contains('show');
        sectionStates[sectionId] = isExpanded;
    });
    localStorage.setItem('sectionStates', JSON.stringify(sectionStates));
    console.log('Сохранены состояния всех секций:', sectionStates);
}

// Функция для восстановления состояния всех секций
export function restoreAllSectionStates() {
    const sectionStates = JSON.parse(localStorage.getItem('sectionStates')) || {};
    document.querySelectorAll('.collapse').forEach(collapseElement => {
        const sectionId = collapseElement.id;
        const isExpanded = sectionStates[sectionId];
        if (isExpanded) {
            collapseElement.classList.add('show');
            const icon = collapseElement.previousElementSibling.querySelector('.bi');
            if (icon) {
                icon.classList.remove('bi-chevron-right');
                icon.classList.add('bi-chevron-down');
            }
        } else {
            collapseElement.classList.remove('show');
            const icon = collapseElement.previousElementSibling.querySelector('.bi');
            if (icon) {
                icon.classList.remove('bi-chevron-down');
                icon.classList.add('bi-chevron-right');
            }
        }
    });
    console.log('Восстановлены состояния всех секций:', sectionStates);
}

// Хранилище для экземпляров EasyMDE
export const editors = {};

// Инициализация EasyMDE для конкретного textarea
function initializeEditor(sectionId, textarea) {
    if (editors[sectionId]) {
        // Уничтожаем существующий редактор перед повторной инициализацией
        editors[sectionId].toTextArea();
        editors[sectionId] = null;
    }

    console.log(`Инициализация редактора для секции: ${sectionId}`);
    try {
        editors[sectionId] = new EasyMDE({
            element: textarea,
            autoDownloadFontAwesome: false,
            toolbar: [
                'bold', 'italic', 'heading', '|',
                'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', '|',
                'preview'
            ],
            status: false,
            spellChecker: false,
            initialValue: textarea.value,
            minHeight: '100px'
        });

        // Сохраняем текущее состояние секции
        const section = textarea.closest('.collapse');
        if (section) {
            const isExpanded = section.classList.contains('show');
            saveSectionState(section.id, isExpanded);
        }
    } catch (error) {
        console.error(`Ошибка при инициализации редактора для секции: ${sectionId}`, error);
    }
}

// Отображение секций бренда
function renderItemsSection(section, brandId, sectionKey) {
    const sectionHtml = `
        <div class="items-section mt-3">
            <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-primary btn-sm add-item-btn" 
                        data-bs-toggle="modal" 
                        data-bs-target="#addItemModal" 
                        data-brand-id="${brandId}"
                        data-section-key="${sectionKey}">
                    <i class="bi bi-plus"></i> Добавить элемент
                </button>
            </div>
            ${section.items && section.items.length > 0 ? `
                <div class="row g-3">
                    ${section.items.map(item => `
                        <div class="col-md-4">
                            <div class="card h-100 item-card" data-item-id="${item.id}">
                                <div class="card-img-top p-3 bg-light text-center">
                                    <img src="${item.image}" alt="" class="img-fluid" style="max-height: 150px;">
                                </div>
                                <div class="card-body">
                                    <h6 class="card-title">${item.type}</h6>
                                    <div class="mb-2">
                                        ${item.tags.map(tag => `
                                            <span class="badge bg-secondary me-1">${tag}</span>
                                        `).join('')}
                                    </div>
                                    <p class="card-text description-preview">
                                        ${item.description ? 
                                            (item.description.length > 100 ? 
                                                `<span class="short-description">${item.description.substring(0, 100)}... 
                                                    <a href="#" class="show-more" title="${item.description}">Подробнее</a>
                                                </span>` : 
                                                item.description) : 
                                            '<em class="text-muted">Нет описания</em>'}
                                    </p>
                                    <div class="d-flex justify-content-end mt-2">
                                        <button class="btn btn-sm btn-danger delete-item-btn"
                                                data-item-id="${item.id}"
                                                data-brand-id="${brandId}"
                                                data-section-key="${sectionKey}">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<div class="text-muted">Нет добавленных элементов</div>'}
        </div>
    `;

    // Добавляем обработчики после рендеринга
    setTimeout(() => {
        // Обработчик для "Подробнее" - теперь просто показываем тултип
        document.querySelectorAll('.show-more').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
            
            // Инициализируем тултип Bootstrap
            new bootstrap.Tooltip(link, {
                placement: 'top',
                html: true,
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner text-start" style="max-width: 300px; text-align: left;"></div></div>'
            });
        });

        // Обработчик для кнопки удаления
        document.querySelectorAll('.delete-item-btn').forEach(button => {
            // Удаляем предыдущие обработчики, если они есть
            button.removeEventListener('click', handleDeleteItem);

            // Добавляем новый обработчик
            button.addEventListener('click', handleDeleteItem);
        });
    }, 0);

    return sectionHtml;
}

async function handleDeleteItem(e) {
    e.stopPropagation(); // Предотвращаем всплытие события
    const itemId = parseInt(e.currentTarget.dataset.itemId);
    const brandId = parseInt(e.currentTarget.dataset.brandId);
    const sectionKey = e.currentTarget.dataset.sectionKey;

    console.log(`Обработчик удаления вызван для itemId: ${itemId}, brandId: ${brandId}, sectionKey: ${sectionKey}`);

    // Показываем диалоговое окно подтверждения
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот элемент?');
    console.log(`Результат диалогового окна: ${confirmed ? 'OK' : 'Cancel'}`);

    if (!confirmed) {
        console.log('Удаление отменено пользователем.');
        return; // Если пользователь нажал "Отмена", выходим из функции
    }

    try {
        const result = await deleteItem(brandId, itemId, sectionKey);
        if (result.success) {
            console.log(`Элемент с itemId: ${itemId} успешно удален.`);
            renderBrands(result.brands);
        } else {
            throw new Error(result.error || 'Ошибка при удалении');
        }
    } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Произошла ошибка при удалении элемента');
    }
}

function openEditItemModal(brandId, itemId) {
    const modal = document.getElementById('addItemModal');
    const form = document.getElementById('addItemForm');
    
    // Загружаем актуальные данные из хранилища
    const currentBrands = loadBrandsFromStorage();
    const brand = currentBrands.find(b => b.id === brandId);
    
    // Ищем элемент во всех секциях бренда
    let foundItem = null;
    if (brand && brand.sections) {
        for (const sectionKey in brand.sections) {
            const section = brand.sections[sectionKey];
            if (section.items && Array.isArray(section.items)) {
                foundItem = section.items.find(i => i.id === itemId);
                if (foundItem) break;
            }
        }
    }
    
    if (foundItem) {
        // Заполняем форму данными
        document.getElementById('itemId').value = foundItem.id;
        document.getElementById('itemType').value = foundItem.type;
        document.getElementById('itemTags').value = foundItem.tags.join(', ');
        document.getElementById('itemDescription').value = foundItem.description;
        
        // Показываем предпросмотр изображения
        const preview = document.getElementById('itemPreviewImage');
        const placeholder = document.getElementById('itemPreviewPlaceholder');
        preview.src = foundItem.image;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Показываем модальное окно
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
}

export function initializeUIManager() {
    // Инициализация UI
}

export function renderBrands(brands) {
    // Отрисовка брендов
}

export function renderBrandSections(brand) {
    // Отрисовка секций бренда
}