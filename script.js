let brands = []; // Массив для хранения данных о брендах

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM полностью загружен и обработан"); // Отладочное сообщение

    const brandsList = document.getElementById("brandsList");
    const addBrandForm = document.getElementById("addBrandForm");
    const brandSections = document.getElementById("brandSections");
    const addBrandButton = document.querySelector('[data-bs-target="#addBrandModal"]'); // Кнопка "Добавить бренд"

    // Проверяем, что элементы найдены
    if (!brandsList || !addBrandForm || !brandSections) {
        console.error("Не удалось найти элементы brandsList, addBrandForm или brandSections");
        return;
    }

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

    // Функция для отображения секций выбранного бренда
    function renderBrandSections(brand) {
        console.log(`Отображаем секции для бренда: ${brand.name}`); // Отладочное сообщение

        brandSections.innerHTML = `
            <div class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="brand">
                <span>Секции бренда: ${brand.name}</span>
                <span class="section-toggle-icon">▼</span>
            </div>
            <div class="brand-sections-content" style="display: none;">
                <ul class="list-group">
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="brandDescription">
                        <span>Описание бренда</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="logos">
                        <span>Логотипы</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="colors">
                        <span>Цвета и цветовые стили</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="textures">
                        <span>Текстуры</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="gradients">
                        <span>Градиенты</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="typography">
                        <span>Типографика</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="keyElements">
                        <span>Ключевые персонажи/элементы</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="toneOfVoice">
                        <span>Тональность коммуникации</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="serviceStandards">
                        <span>Стандарты сервиса</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="graphicElements">
                        <span>Графические элементы</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="advertisingMaterials">
                        <span>Рекламные материалы</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                    <li class="list-group-item toggle-section d-flex justify-content-between align-items-center" data-section="styleGuide">
                        <span>Стили бренда</span>
                        <span class="section-toggle-icon">▼</span>
                    </li>
                </ul>
            </div>
        `;

        console.log("Секции бренда добавлены в DOM"); // Отладочное сообщение

        // Добавляем обработчик для сворачивания/разворачивания секции бренда
        const brandToggle = document.querySelector('[data-section="brand"]');
        const brandContent = document.querySelector(".brand-sections-content");
        brandToggle.addEventListener("click", () => {
            brandContent.style.display = brandContent.style.display === "none" ? "block" : "none";
            const toggleIcon = brandToggle.querySelector(".section-toggle-icon");
            toggleIcon.textContent = brandContent.style.display === "block" ? "▲" : "▼";
        });

        // Добавляем обработчики для сворачивания/разворачивания дочерних секций
        document.querySelectorAll(".toggle-section").forEach((section) => {
            if (section.dataset.section !== "brand") {
                console.log(`Добавлен обработчик для секции: ${section.getAttribute("data-section")}`); // Отладочное сообщение
                section.addEventListener("click", (e) => {
                    const sectionElement = e.currentTarget;
                    const sectionName = sectionElement.getAttribute("data-section");
                    console.log(`Клик по секции: ${sectionName}`); // Отладочное сообщение

                    // Переключаем класс для отображения/скрытия
                    sectionElement.classList.toggle("active");
                    const toggleIcon = sectionElement.querySelector(".section-toggle-icon");
                    if (sectionElement.classList.contains("active")) {
                        console.log(`Секция ${sectionName} развернута`); // Отладочное сообщение
                        toggleIcon.textContent = "▲"; // Меняем стрелку на "развернуто"
                    } else {
                        console.log(`Секция ${sectionName} свернута`); // Отладочное сообщение
                        toggleIcon.textContent = "▼"; // Меняем стрелку на "свернуто"
                    }
                });
            }
        });
    }

    // Функция для отображения списка брендов
    function renderBrands() {
        console.log("Обновляем список брендов"); // Отладочное сообщение

        brandsList.innerHTML = "";
        brands.forEach((brand) => {
            console.log(`Добавляем бренд в список: ${brand.name}`); // Отладочное сообщение

            const brandItem = document.createElement("div");
            brandItem.className = "list-group-item d-flex justify-content-between align-items-center";
            brandItem.innerHTML = `
                <span class="brand-name" data-id="${brand.id}">${brand.name}</span>
                <button class="btn btn-danger btn-sm" data-id="${brand.id}">Удалить</button>
            `;
            brandsList.appendChild(brandItem);
        });

        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll(".btn-danger").forEach((button) => {
            console.log(`Добавлен обработчик для удаления бренда с ID: ${button.getAttribute("data-id")}`); // Отладочное сообщение
            button.addEventListener("click", (e) => {
                const brandId = parseInt(e.target.getAttribute("data-id"), 10);
                console.log(`Удаляем бренд с ID: ${brandId}`); // Отладочное сообщение

                brands = brands.filter((brand) => brand.id !== brandId);
                renderBrands();
                brandSections.innerHTML = ""; // Очищаем секции, если бренд удален
            });
        });

        // Добавляем обработчики для клика по названию бренда
        document.querySelectorAll(".brand-name").forEach((nameElement) => {
            console.log(`Добавлен обработчик для бренда с ID: ${nameElement.getAttribute("data-id")}`); // Отладочное сообщение
            nameElement.addEventListener("click", (e) => {
                const brandId = parseInt(e.target.getAttribute("data-id"), 10);
                console.log(`Клик по бренду с ID: ${brandId}`); // Отладочное сообщение

                const selectedBrand = brands.find((brand) => brand.id === brandId);
                if (selectedBrand) {
                    renderBrandSections(selectedBrand);
                } else {
                    console.error(`Бренд с ID ${brandId} не найден`);
                }
            });
        });
    }
});
