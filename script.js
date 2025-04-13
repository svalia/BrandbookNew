let brands = []; // Массив для хранения данных о брендах

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM полностью загружен и обработан"); // Отладочное сообщение

    const brandsList = document.getElementById("brandsList");
    const addBrandForm = document.getElementById("addBrandForm");
    const addBrandButton = document.querySelector('[data-bs-target="#addBrandModal"]'); // Кнопка "Добавить бренд"

    // Обновляем кнопку "Добавить бренд"
    addBrandButton.classList.add("btn-add-brand");
    addBrandButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Добавить бренд
    `;

    // Проверяем, что элементы найдены
    if (!brandsList || !addBrandForm) {
        console.error("Не удалось найти элементы brandsList или addBrandForm");
        return;
    }

    const hintToggle = document.getElementById("hintToggle");
    const hintContent = document.getElementById("hintContent");
    const toggleIcon = hintToggle.querySelector(".toggle-icon");

    hintToggle.addEventListener("click", () => {
        hintContent.classList.toggle("show");
        toggleIcon.classList.toggle("collapsed");
    });

    // Обработчик формы добавления бренда
    addBrandForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Форма отправлена"); // Отладочное сообщение

        const brandName = document.getElementById("brandName").value.trim();
        if (brandName) {
            console.log(`Добавляем бренд: ${brandName}`); // Отладочное сообщение

            const newBrand = {
                id: Date.now(),
                name: brandName,
                sections: {} // Пустые секции для будущей реализации
            };
            brands.push(newBrand);
            console.log("Текущий список брендов:", brands); // Отладочное сообщение
            renderBrands();
            addBrandForm.reset();

            // Закрываем модальное окно
            const addBrandModal = bootstrap.Modal.getInstance(document.getElementById("addBrandModal"));
            if (addBrandModal) {
                addBrandModal.hide();
                // Добавляем задержку перед переносом фокуса
                setTimeout(() => {
                    if (addBrandButton) {
                        addBrandButton.focus();
                    }
                }, 300); // Задержка в 300 мс
            } else {
                console.error("Не удалось получить экземпляр модального окна");
            }
        } else {
            console.warn("Название бренда не может быть пустым");
        }
    });

    // Функция для отображения списка брендов
    function renderBrands() {
        console.log("Обновляем список брендов"); // Отладочное сообщение

        brandsList.innerHTML = "";
        brands.forEach((brand) => {
            console.log(`Добавляем бренд в список: ${brand.name}`); // Отладочное сообщение

            const brandItem = document.createElement("div");
            brandItem.className = "brand-item";
            brandItem.dataset.id = brand.id; // Добавляем data-id для определения активного бренда
            brandItem.innerHTML = `
                <div class="toggle-section" data-id="${brand.id}">
                    <div class="brand-name-container">
                        <span>${brand.name}</span>
                        <img src="img_src/chevron-down-green.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                    </div>
                    <button class="btn btn-danger btn-sm" data-id="${brand.id}">Удалить</button>
                </div>
                <div class="brand-sections-content">
                    <ul class="list-group">
                        ${renderSections()}
                    </ul>
                </div>
            `;
            brandsList.appendChild(brandItem);

            // Добавляем обработчики для сворачивания/разворачивания секций бренда
            const toggleSection = brandItem.querySelector(".toggle-section");
            const brandContent = brandItem.querySelector(".brand-sections-content");
            const toggleIcon = toggleSection.querySelector(".section-toggle-icon");
            toggleSection.addEventListener("click", (e) => {
                if (e.target.tagName === "BUTTON") return; // Игнорируем клик по кнопке "Удалить"
                const isVisible = brandContent.style.display === "block";
                brandContent.style.display = isVisible ? "none" : "block";
                toggleIcon.src = isVisible ? "img_src/chevron-down-green.svg" : "img_src/chevron-up-green.svg";
            });

            // Добавляем обработчики для дочерних секций
            const sectionItems = brandItem.querySelectorAll(".section-item");
            sectionItems.forEach(item => {
                const sectionHeader = item.querySelector(".section-header");
                const sectionContent = item.querySelector(".section-content");
                const sectionIcon = sectionHeader ? sectionHeader.querySelector(".section-toggle-icon") : null;

                if (sectionHeader && sectionContent) {
                    sectionHeader.addEventListener("click", () => {
                        const isVisible = sectionContent.style.display === "block";
                        sectionContent.style.display = isVisible ? "none" : "block";
                        if (sectionIcon) {
                            sectionIcon.src = isVisible ? 
                                "img_src/chevron-down-gray.svg" : 
                                "img_src/chevron-up-gray.svg";
                        }
                    });
                } else {
                    console.warn("Не удалось найти элементы sectionHeader или sectionContent для секции:", item);
                }
            });

            // Добавляем обработчик для кнопки удаления бренда
            const deleteButton = brandItem.querySelector(".btn.btn-danger");
            deleteButton.addEventListener("click", (e) => {
                const brandId = parseInt(e.target.getAttribute("data-id"), 10);
                console.log(`Удаляем бренд с ID: ${brandId}`); // Отладочное сообщение

                brands = brands.filter((brand) => brand.id !== brandId);
                renderBrands();
            });

            // Добавляем обработчик для кнопки "Добавить описание"
            const addDescriptionButtons = brandItem.querySelectorAll(".add-description-btn");
            if (addDescriptionButtons && addDescriptionButtons.length > 0) {
                addDescriptionButtons.forEach((button) => {
                    if (button) {
                        button.addEventListener("click", (e) => {
                            const descriptionBlock = e.target.closest(".description-block");
                            if (descriptionBlock) {
                                const descriptionContent = descriptionBlock.querySelector(".description-content");
                                if (descriptionContent) {
                                    openEditor(descriptionContent);
                                } else {
                                    console.warn("Не удалось найти элемент description-content");
                                }
                            } else {
                                console.warn("Не удалось найти родительский элемент description-block");
                            }
                        });
                    }
                });
            } else {
                console.warn("Кнопки 'Добавить описание' не найдены");
            }

            // Добавляем обработчики для кнопок управления цветами - здесь добавляем обработчики сразу после создания
            const addColorButtons = brandItem.querySelectorAll("#addColor");
            const addPairedColorsButtons = brandItem.querySelectorAll("#addPairedColors");
            const addPaletteButtons = brandItem.querySelectorAll("#addPalette");

            const mainColorsBlocks = brandItem.querySelectorAll("#mainColorsBlock");
            const pairedColorsBlocks = brandItem.querySelectorAll("#pairedColorsBlock");
            const palettesBlocks = brandItem.querySelectorAll("#palettesBlock");

            if (addColorButtons && addColorButtons.length > 0) {
                addColorButtons.forEach((button, index) => {
                    button.addEventListener("click", function() {
                        if (mainColorsBlocks[index]) {
                            mainColorsBlocks[index].style.display = "block";
                        }
                        // Открыть модальное окно для добавления цвета
                        const addColorModal = new bootstrap.Modal(document.getElementById('addColorModal'));
                        addColorModal.show();
                    });
                });
            }

            if (addPairedColorsButtons && addPairedColorsButtons.length > 0) {
                addPairedColorsButtons.forEach((button, index) => {
                    button.addEventListener("click", function() {
                        if (pairedColorsBlocks[index]) {
                            pairedColorsBlocks[index].style.display = "block";
                        }
                    });
                });
            }

            if (addPaletteButtons && addPaletteButtons.length > 0) {
                addPaletteButtons.forEach((button, index) => {
                    button.addEventListener("click", function() {
                        if (palettesBlocks[index]) {
                            palettesBlocks[index].style.display = "block";
                        }
                    });
                });
            }

            setupAddPairedColorsButtons(brandItem);
        });
    }

    function renderSections() {
        const sections = [
            "Описание бренда", 
            "Тональность коммуникации", 
            "Логотипы", 
            "Цвета и цветовые стили", 
            "Типографика", 
            "Текстуры, Градиенты, Ключевые персонажи/элементы, Графические элементы и Рекламные материалы"
        ];

        return sections.map(section => `
            <li class="list-group-item section-item">
                <div class="section-header">
                    <div class="section-title">
                        <span>${section}</span>
                        <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                    </div>
                </div>
                <div class="section-content" style="display: none;">
                    <div class="description-block">
                        <div class="description-content"></div>
                        <button class="add-description-btn btn btn-primary">Добавить описание</button>
                    </div>
                    ${section === "Цвета и цветовые стили" ? `
                        <div class="color-actions mt-3">
                            <button class="add-description-btn btn btn-primary" id="addColor">Добавить цвет</button>
                            <button class="add-description-btn btn btn-primary" id="addPairedColors">Добавить парные цвета</button>
                            <button class="add-description-btn btn btn-primary" id="addPalette">Добавить палитру</button>
                        </div>
                        <div id="colorBlocks">
                            <div class="color-block" id="mainColorsBlock" style="display: none;">
                                <h3>Основные и дополнительные цвета</h3>
                                <div class="color-gallery" id="mainColorsGallery">
                                    <!-- Карточки цветов будут добавляться здесь -->
                                </div>
                            </div>
                            <div class="color-block" id="pairedColorsBlock" style="display: none;">
                                <h3>Парные цвета</h3>
                                <div class="paired-colors-gallery" id="pairedColorsGallery">
                                    <!-- Карточки парных цветов будут добавляться здесь -->
                                </div>
                            </div>
                            <div class="color-block" id="palettesBlock" style="display: none;">
                                <h3>Палитры цветов</h3>
                                <div class="palettes-gallery" id="palettesGallery">
                                    <!-- Карточки палитр будут добавляться здесь -->
                                </div>
                            </div>
                        </div>
                    ` : ""}
                    ${section === "Логотипы" ? `
                        <button class="btn btn-success mt-3 add-logo-btn" data-bs-toggle="modal" data-bs-target="#addLogoModal">Добавить логотип</button>
                        <div class="logos-gallery mt-4">
                            <!-- Галерея логотипов будет динамически добавляться -->
                        </div>
                    ` : ""}
                </div>
            </li>
        `).join('');
    }

    // Закомментируем или удалим обработчик формы парных цветов из основного скрипта,
    // так как теперь он находится в colors.js
    /*
    const pairedColorsGallery = document.querySelector(".paired-colors-gallery");
    const addPairedColorsForm = document.getElementById("addPairedColorsForm");

    // Обновляем обработчик отправки формы с парными цветами
    if (addPairedColorsForm) {
        addPairedColorsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // ... остальной код обработчика
        });
    }
    */

    // Функция для получения ID активного бренда
    function getActiveBrandId() {
        const activeBrandElement = document.querySelector(".brand-item .brand-sections-content[style*='display: block']");
        if (activeBrandElement) {
            const brandItem = activeBrandElement.closest(".brand-item");
            if (brandItem && brandItem.dataset && brandItem.dataset.id) {
                return parseInt(brandItem.dataset.id, 10);
            }
        }
        
        // Если активный бренд не найден через открытую секцию, берем первый бренд из списка
        const firstBrand = document.querySelector(".brand-item");
        if (firstBrand && firstBrand.dataset && firstBrand.dataset.id) {
            return parseInt(firstBrand.dataset.id, 10);
        }
        
        // Если все еще не нашли, используем первый бренд из массива данных
        if (brands.length > 0) {
            return brands[0].id;
        }
        
        return null;
    }

    // Обновим функцию добавления цветов
    function addColorsToActiveBrand(colorValues, brandId) {
        const activeBrand = brands.find(brand => brand.id === brandId);
        if (!activeBrand) {
            console.error("Активный бренд не найден.");
            return;
        }

        if (!activeBrand.sections.colors) {
            activeBrand.sections.colors = { primary: [] };
        } else if (!activeBrand.sections.colors.primary) {
            activeBrand.sections.colors.primary = [];
        }

        const mainColorsBlock = document.querySelector(`#brandsList .brand-item[data-id="${brandId}"] #mainColorsBlock`);
        const colorGallery = mainColorsBlock ? mainColorsBlock.querySelector("#mainColorsGallery") : null;

        if (!colorGallery) {
            console.error("Галерея цветов не найдена для бренда:", brandId);
            return;
        }

        mainColorsBlock.style.display = "block";

        colorValues.forEach(colorHex => {
            if (colorHex) {
                const formattedHex = colorHex.startsWith("#") ? colorHex : `#${colorHex}`;

                const colorCard = document.createElement("div");
                colorCard.className = "color-card";
                colorCard.innerHTML = `
                    <div class="color-preview" style="background-color: ${formattedHex}"></div>
                    <div class="color-info">
                        <span class="color-hex">${formattedHex}</span>
                    </div>
                    <button class="delete-color-btn">
                        <img src="img_src/x-icon.svg" alt="Удалить">
                    </button>
                `;

                colorGallery.appendChild(colorCard);

                activeBrand.sections.colors.primary.push({ hex: formattedHex });

                const deleteButton = colorCard.querySelector(".delete-color-btn");
                deleteButton.addEventListener("click", function() {
                    colorCard.remove();

                    const colorIndex = activeBrand.sections.colors.primary.findIndex(color => color.hex === formattedHex);
                    if (colorIndex !== -1) {
                        activeBrand.sections.colors.primary.splice(colorIndex, 1);
                    }
                });
            }
        });
    }

    // Обработчик формы добавления цветов
    const addColorForm = document.getElementById("addColorForm");
    if (addColorForm) {
        addColorForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const colorHexInput = document.getElementById("colorHex");
            const colorValues = colorHexInput.value.split(",").map(c => c.trim());
            
            const activeBrandId = getActiveBrandId();
            if (!activeBrandId) {
                console.error("Не удалось определить активный бренд.");
                alert("Ошибка: Сначала добавьте и выберите бренд.");
                return;
            }

            addColorsToActiveBrand(colorValues, activeBrandId);

            addColorForm.reset();

            const addColorModal = bootstrap.Modal.getInstance(document.getElementById("addColorModal"));
            if (addColorModal) {
                addColorModal.hide();
            }
        });
    }

    // Добавляем функцию для создания кастомного селекта
    function createCustomColorSelect(containerEl, options, onChangeCallback) {
        // Очищаем контейнер
        containerEl.innerHTML = '';
        
        // Создаем элементы кастомного селекта
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-color-select';
        
        const selectHeader = document.createElement('div');
        selectHeader.className = 'select-header';
        
        const selectDropdown = document.createElement('div');
        selectDropdown.className = 'select-dropdown';
        
        // Скрытый оригинальный селект для сохранения формы
        const hiddenSelect = document.createElement('select');
        hiddenSelect.style.display = 'none';
        hiddenSelect.name = containerEl.id;
        
        // Добавляем опции в выпадающий список и скрытый селект
        let firstOption = null;
        options.forEach((option, index) => {
            // Создаем опцию для выпадающего списка
            const selectOption = document.createElement('div');
            selectOption.className = 'select-option';
            selectOption.dataset.value = option.value;
            
            const colorPreview = document.createElement('div');
            colorPreview.className = 'select-color-preview';
            colorPreview.style.backgroundColor = option.value;
            
            const colorValue = document.createElement('div');
            colorValue.className = 'select-color-value';
            colorValue.textContent = option.value;
            
            selectOption.appendChild(colorPreview);
            selectOption.appendChild(colorValue);
            selectDropdown.appendChild(selectOption);
            
            // Добавляем опцию в скрытый селект
            const hiddenOption = document.createElement('option');
            hiddenOption.value = option.value;
            hiddenOption.textContent = option.value;
            hiddenSelect.appendChild(hiddenOption);
            
            // Сохраняем первую опцию
            if (index === 0) firstOption = option;
            
            // Добавляем обработчик клика на опцию
            selectOption.addEventListener('click', () => {
                // Обновляем заголовок селекта
                updateSelectHeader(selectHeader, option.value);
                
                // Обновляем значение скрытого селекта
                hiddenSelect.value = option.value;
                
                // Скрываем выпадающий список
                selectDropdown.style.display = 'none';
                selectHeader.classList.remove('active');
                
                // Устанавливаем класс selected для выбранной опции
                const options = selectDropdown.querySelectorAll('.select-option');
                options.forEach(opt => opt.classList.remove('selected'));
                selectOption.classList.add('selected');
                
                // Вызываем callback, если он передан
                if (onChangeCallback) onChangeCallback(option.value);
            });
        });
        
        // Инициализация заголовка селекта с первой опцией
        if (firstOption) {
            updateSelectHeader(selectHeader, firstOption.value);
            hiddenSelect.value = firstOption.value;
        }
        
        // Добавляем обработчик клика на заголовок
        selectHeader.addEventListener('click', () => {
            const isOpen = selectDropdown.style.display === 'block';
            selectDropdown.style.display = isOpen ? 'none' : 'block';
            selectHeader.classList.toggle('active', !isOpen);
        });
        
        // Закрываем выпадающий список при клике вне селекта
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                selectDropdown.style.display = 'none';
                selectHeader.classList.remove('active');
            }
        });
        
        // Собираем кастомный селект
        customSelect.appendChild(selectHeader);
        customSelect.appendChild(selectDropdown);
        customSelect.appendChild(hiddenSelect);
        
        // Добавляем селект в контейнер
        containerEl.appendChild(customSelect);
        
        return {
            element: customSelect,
            hiddenSelect: hiddenSelect,
            getValue: () => hiddenSelect.value,
            setValue: (value) => {
                // Обновляем заголовок и скрытый селект
                updateSelectHeader(selectHeader, value);
                hiddenSelect.value = value;
                
                // Обновляем класс selected для опций
                const options = selectDropdown.querySelectorAll('.select-option');
                options.forEach(opt => {
                    opt.classList.toggle('selected', opt.dataset.value === value);
                });
            }
        };
    }

    // Вспомогательная функция для обновления заголовка селекта
    function updateSelectHeader(header, colorValue) {
        header.innerHTML = '';
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'select-color-preview';
        colorPreview.style.backgroundColor = colorValue;
        
        const colorValueElement = document.createElement('div');
        colorValueElement.className = 'select-color-value';
        colorValueElement.textContent = colorValue;
        
        header.appendChild(colorPreview);
        header.appendChild(colorValueElement);
    }

    // Обновленная версия функции setupAddPairedColorsButtons - оставляем пустой,
    // так как настройку кнопок теперь выполняет colors.js
    function setupAddPairedColorsButtons(brandItem) {
        // Пустая функция, так как настройка теперь происходит в colors.js
    }
});

// Экспортируем brands в глобальный объект для доступа из других скриптов
window.brands = brands;
