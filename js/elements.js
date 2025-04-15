// Модуль для работы с графическими элементами

// Function to initialize elements module
function initElements() {
    console.log('Elements module initialized');
    
    // Check if the elements modal exists or create it
    createElementModal(); // Эта функция теперь также вызывает setupElementModal
}

// Function to set up the element modal
function setupElementModal() {
    console.log('[elements.js] -> setupElementModal: Начинаем настройку модального окна элемента.');
    
    const addElementForm = document.getElementById('addGraphicElementForm');
    if (!addElementForm) {
        console.error('[elements.js] -> setupElementModal: Форма addGraphicElementForm не найдена!');
        return;
    }
    
    // Set up file input preview
    const elementFileInput = document.getElementById('elementFile');
    const elementPreview = document.getElementById('elementPreview');
    
    if (elementFileInput && elementPreview) {
        elementFileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    elementPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px;">`;
                };
                
                reader.readAsDataURL(this.files[0]);
            } else {
                 elementPreview.innerHTML = `<p class="text-muted mb-0">Изображение будет показано здесь после выбора файла</p>`;
            }
        });
    }
    
    // Find the intended submit button by ID
    let submitButton = addElementForm.querySelector('#submitAddElementBtn');
    
    if (submitButton) {
        console.log('[elements.js] -> setupElementModal: Найдена кнопка #submitAddElementBtn.');
        submitButton.type = 'submit'; 
    } else {
        console.warn('[elements.js] -> setupElementModal: Кнопка #submitAddElementBtn не найдена в HTML. Попытка найти по type="submit".');
        submitButton = addElementForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log('[elements.js] -> setupElementModal: Найдена кнопка type="submit".');
            submitButton.id = 'submitAddElementBtn'; // Assign ID if missing
        } else {
            console.error('[elements.js] -> setupElementModal: Кнопка отправки не найдена! Проверьте HTML.');
        }
    }
    
    // Проверка количества кнопок "Добавить элемент" внутри формы ПОСЛЕ настройки
    const allSubmitButtons = addElementForm.querySelectorAll('button.btn-primary');
    console.log(`[elements.js] -> setupElementModal: Найдено кнопок '.btn-primary' внутри формы: ${allSubmitButtons.length}`);
    allSubmitButtons.forEach((btn, index) => {
        console.log(`  - Кнопка ${index + 1}: ID="${btn.id}", type="${btn.type}", text="${btn.textContent.trim()}"`);
    });
    if (allSubmitButtons.length > 1) {
        console.warn('[elements.js] -> setupElementModal: ВНИМАНИЕ! Обнаружено больше одной кнопки .btn-primary внутри формы addGraphicElementForm.');
    }
    
    // Character counter for description
    const descriptionField = document.getElementById('elementDescription');
    const charCounter = document.getElementById('descriptionChars');
    
    if (descriptionField && charCounter) {
        descriptionField.addEventListener('input', function() {
            const count = this.value.length;
            charCounter.textContent = count;
            
            // Add warning classes
            if (count > 400) {
                charCounter.className = count > 450 ? 'danger' : 'warning';
            } else {
                charCounter.className = '';
            }
        });
    }
    
    // Setup the custom type field toggle
    const elementTypeSelect = document.getElementById('elementType');
    const customTypeField = document.getElementById('customTypeField');
    
    if (elementTypeSelect && customTypeField) {
        elementTypeSelect.addEventListener('change', function() {
            const customTypeInput = document.getElementById('customType');
            if (this.value === 'Other') {
                customTypeField.style.display = 'block';
                customTypeInput.setAttribute('required', 'true');
            } else {
                customTypeField.style.display = 'none';
                customTypeInput.removeAttribute('required');
            }
        });
        elementTypeSelect.dispatchEvent(new Event('change'));
    }
}

// Function to create element modal if it doesn't exist
function createElementModal() {
    console.log('[elements.js] -> createElementModal: Вызвана функция создания модального окна.');
    // Check if it already exists
    if (document.getElementById('addElementModal')) {
        console.log('[elements.js] -> createElementModal: Модальное окно уже существует.');
        setupElementModal(); 
        return;
    }
    
    // Create modal HTML
    const modalHtml = `
    <div class="modal fade" id="addElementModal" tabindex="-1" aria-labelledby="addGraphicElementModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addGraphicElementModalLabel">Добавить графический элемент</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <form id="addGraphicElementForm">
                        <div class="mb-3">
                            <label for="elementType" class="form-label">Тип элемента</label>
                            <select class="form-select" id="elementType" required>
                                <option value="">Выберите тип элемента</option>
                                <option value="Textures">Текстуры</option>
                                <option value="Gradients">Градиенты</option>
                                <option value="Key-characters">Ключевые персонажи/элементы</option>
                                <option value="Graphic-elements">Графические элементы</option>
                                <option value="Advertising-materials">Рекламные материалы</option>
                                <option value="Locators">Локаторы</option>
                                <option value="Icons">Иконки</option>
                                <option value="Illustrations">Иллюстрации</option>
                                <option value="Other">Другое</option>
                            </select>
                        </div>
                        
                        <div class="mb-3" id="customTypeField" style="display: none;">
                            <label for="customType" class="form-label">Название типа</label>
                            <input type="text" class="form-control" id="customType" placeholder="Введите название типа элемента">
                        </div>
                        
                        <div class="mb-3">
                            <label for="elementFile" class="form-label">Выберите файл</label>
                            <input type="file" class="form-control" id="elementFile" accept=".png,.svg" required>
                            <small class="text-muted">Допустимые форматы: SVG, PNG</small>
                        </div>
                        
                        <div class="mb-3">
                            <label for="elementTags" class="form-label">Теги (необязательно)</label>
                            <input type="text" class="form-control" id="elementTags" placeholder="Введите теги через запятую">
                            <div class="alert alert-info mt-2">
                                <strong>Подсказка:</strong> Протегируйте элемент на английском языке, чтобы можно было использовать теги для поиска.
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="elementDescription" class="form-label">Описание элемента (необязательно)</label>
                            <textarea class="form-control" id="elementDescription" rows="3" maxlength="500" placeholder="Где и как используется коротко в 500 символов"></textarea>
                            <small class="text-muted"><span id="descriptionChars">0</span>/500 символов</small>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Предпросмотр</label>
                            <div id="elementPreview" class="element-preview border rounded p-3 text-center">
                                <p class="text-muted mb-0">Изображение будет показано здесь после выбора файла</p>
                            </div>
                        </div>
                        
                        <button type="submit" id="submitAddElementBtn" class="btn btn-primary w-100">Добавить элемент</button> 
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    console.log('[elements.js] -> createElementModal: Модальное окно добавлено в DOM.');
    
    // Setup the new modal
    setupElementModal();
}

// Function to initialize element handlers
function initElementsHandlers() {
    console.log('[elements.js] -> initElementsHandlers: Инициализация обработчиков элементов.');
    
    const addGraphicElementForm = document.getElementById('addGraphicElementForm');
    
    if (addGraphicElementForm) {
        const newForm = addGraphicElementForm.cloneNode(true);
        addGraphicElementForm.parentNode.replaceChild(newForm, addGraphicElementForm);
        
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('[elements.js] -> Обработчик SUBMIT формы addGraphicElementForm сработал.');
            
            const elementTypeSelect = document.getElementById('elementType');
            const customTypeInput = document.getElementById('customType');
            const elementFile = document.getElementById('elementFile').files[0];
            const tagsInput = document.getElementById('elementTags').value.trim();
            const description = document.getElementById('elementDescription').value.trim();
            
            let elementType = elementTypeSelect.value;
            if (elementType === 'Other') {
                elementType = customTypeInput.value.trim();
            }
            
            console.log(`[elements.js] -> Тип элемента для сохранения: "${elementType}"`);
            
            if (!elementType) {
                 alert('Пожалуйста, выберите или введите тип элемента');
                 console.error('[elements.js] -> Ошибка: Тип элемента не выбран/не введен.');
                 return;
            }
            if (!elementFile) {
                alert('Пожалуйста, выберите файл');
                console.error('[elements.js] -> Ошибка: Файл не выбран.');
                return;
            }
            
            let tags = [];
            if (tagsInput) {
                tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Image = event.target.result;
                
                const brandId = window.getActiveBrandId();
                if (!brandId) {
                    console.error("[elements.js] -> Не удалось определить активный бренд");
                    alert("Пожалуйста, сначала выберите бренд");
                    return;
                }
                
                const brand = window.brands.find(b => b.id === brandId);
                if (!brand) {
                    console.error("[elements.js] -> Бренд не найден", brandId);
                    return;
                }
                
                const newElement = {
                    id: Date.now(),
                    type: elementType,
                    image: base64Image,
                    description: description,
                    tags: tags,
                    fileName: elementFile.name
                };
                
                console.log("[elements.js] -> Добавляю новый элемент:", JSON.parse(JSON.stringify(newElement)));
                
                if (!brand.sections.elements) {
                    brand.sections.elements = { items: [] };
                }
                if (!brand.sections.elements.items) {
                    brand.sections.elements.items = [];
                }
                brand.sections.elements.items.push(newElement);
                
                if (window.renderBrandSections) {
                    const activeBrandElement = document.querySelector(`.brand-item[data-id="${brandId}"]`);
                    if (activeBrandElement) {
                        const sectionsContainer = activeBrandElement.querySelector('.brand-sections-content');
                        if (sectionsContainer) {
                             console.log("[elements.js] -> Обновление секций для бренда ID:", brandId);
                             sectionsContainer.innerHTML = window.renderSections(brand);
                             window.setupSectionHandlers(activeBrandElement, brand);
                        }
                    } else {
                         console.warn("[elements.js] -> Не найден элемент активного бренда для обновления секций. Выполняем полный ререндер.");
                         window.renderBrands();
                    }
                } else {
                     console.warn("[elements.js] -> Функция renderBrandSections не найдена. Выполняем полный ререндер.");
                     window.renderBrands();
                }

                newForm.reset();
                document.getElementById('elementPreview').innerHTML = `<p class="text-muted mb-0">Изображение будет показано здесь после выбора файла</p>`;
                document.getElementById('descriptionChars').textContent = '0';
                const customTypeField = document.getElementById('customTypeField');
                if (customTypeField) customTypeField.style.display = 'none';
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('addElementModal'));
                if (modal) {
                    modal.hide();
                    console.log("[elements.js] -> Модальное окно закрыто.");
                } else {
                     console.error("[elements.js] -> Не удалось получить экземпляр модального окна для закрытия.");
                }
            };
            
            reader.onerror = function(error) {
                 console.error("[elements.js] -> Ошибка чтения файла:", error);
                 alert("Произошла ошибка при чтении файла.");
            };
            
            reader.readAsDataURL(elementFile);
        });
    } else {
        console.error('[elements.js] -> initElementsHandlers: Форма addGraphicElementForm не найдена для добавления обработчика submit.');
    }
}

// Export functions
window.initElements = initElements;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event: initializing elements module');
    initElements();
    initElementsHandlers(); 
});
