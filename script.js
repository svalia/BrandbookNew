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
                        <li class="list-group-item">
                            <span>Описание бренда</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Логотипы</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Цвета и цветовые стили</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Текстуры</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Градиенты</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Типографика</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Ключевые персонажи/элементы</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Тональность коммуникации</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Графические элементы</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                        <li class="list-group-item">
                            <span>Рекламные материалы</span>
                            <img src="img_src/chevron-down-gray.svg" alt="Chevron Down" class="section-toggle-icon" width="16" height="16">
                        </li>
                    </ul>
                </div>
            `;
            brandsList.appendChild(brandItem);

            // Добавляем обработчик для сворачивания/разворачивания секции бренда
            const toggleSection = brandItem.querySelector(".toggle-section");
            const brandContent = brandItem.querySelector(".brand-sections-content");
            const toggleIcon = toggleSection.querySelector(".section-toggle-icon");
            toggleSection.addEventListener("click", (e) => {
                if (e.target.tagName === "BUTTON") return; // Игнорируем клик по кнопке "Удалить"
                const isVisible = brandContent.style.display === "block";
                brandContent.style.display = isVisible ? "none" : "block";
                toggleIcon.src = isVisible ? "img_src/chevron-down-green.svg" : "img_src/chevron-up-green.svg";
            });

            // Добавляем обработчик для кнопки удаления бренда
            const deleteButton = brandItem.querySelector(".btn.btn-danger");
            deleteButton.addEventListener("click", (e) => {
                const brandId = parseInt(e.target.getAttribute("data-id"), 10);
                console.log(`Удаляем бренд с ID: ${brandId}`); // Отладочное сообщение

                brands = brands.filter((brand) => brand.id !== brandId);
                renderBrands();
            });
        });
    }
});
