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

    // Функция для отображения списка брендов
    function renderBrands() {
        console.log("Обновляем список брендов"); // Отладочное сообщение

        brandsList.innerHTML = "";
        brands.forEach((brand) => {
            console.log(`Добавляем бренд в список: ${brand.name}`); // Отладочное сообщение

            const brandItem = document.createElement("div");
            brandItem.className = "list-group-item brand-item";
            brandItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center toggle-section" data-id="${brand.id}">
                    <span>${brand.name}</span>
                    <span class="section-toggle-icon">▼</span>
                </div>
                <div class="brand-sections-content" style="display: none;">
                    <ul class="list-group mt-3">
                        <li class="list-group-item">Описание бренда</li>
                        <li class="list-group-item">Логотипы</li>
                        <li class="list-group-item">Цвета и цветовые стили</li>
                        <li class="list-group-item">Текстуры</li>
                        <li class="list-group-item">Градиенты</li>
                        <li class="list-group-item">Типографика</li>
                        <li class="list-group-item">Ключевые персонажи/элементы</li>
                        <li class="list-group-item">Тональность коммуникации</li>
                        <li class="list-group-item">Стандарты сервиса</li>
                        <li class="list-group-item">Графические элементы</li>
                        <li class="list-group-item">Рекламные материалы</li>
                        <li class="list-group-item">Стили бренда</li>
                    </ul>
                </div>
            `;
            brandsList.appendChild(brandItem);

            // Добавляем обработчик для сворачивания/разворачивания секции бренда
            const toggleSection = brandItem.querySelector(".toggle-section");
            const brandContent = brandItem.querySelector(".brand-sections-content");
            toggleSection.addEventListener("click", () => {
                const isVisible = brandContent.style.display === "block";
                brandContent.style.display = isVisible ? "none" : "block";
                const toggleIcon = toggleSection.querySelector(".section-toggle-icon");
                toggleIcon.textContent = isVisible ? "▼" : "▲";
            });
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
