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
            <h3>Секции бренда: ${brand.name}</h3>
            <ul class="list-group">
                <li class="list-group-item toggle-section" data-section="brandDescription">Описание бренда</li>
                <li class="list-group-item toggle-section" data-section="logos">Логотипы</li>
                <li class="list-group-item toggle-section" data-section="colors">Цвета и цветовые стили</li>
                <li class="list-group-item toggle-section" data-section="textures">Текстуры</li>
                <li class="list-group-item toggle-section" data-section="gradients">Градиенты</li>
                <li class="list-group-item toggle-section" data-section="typography">Типографика</li>
                <li class="list-group-item toggle-section" data-section="keyElements">Ключевые персонажи/элементы</li>
                <li class="list-group-item toggle-section" data-section="toneOfVoice">Тональность коммуникации</li>
                <li class="list-group-item toggle-section" data-section="serviceStandards">Стандарты сервиса</li>
                <li class="list-group-item toggle-section" data-section="graphicElements">Графические элементы</li>
                <li class="list-group-item toggle-section" data-section="advertisingMaterials">Рекламные материалы</li>
                <li class="list-group-item toggle-section" data-section="styleGuide">Стили бренда</li>
            </ul>
        `;

        // Добавляем обработчики для сворачивания/разворачивания секций
        document.querySelectorAll(".toggle-section").forEach((section) => {
            section.addEventListener("click", (e) => {
                const sectionElement = e.target;
                const sectionName = sectionElement.getAttribute("data-section");
                console.log(`Клик по секции: ${sectionName}`); // Отладочное сообщение

                // Переключаем класс для отображения/скрытия
                sectionElement.classList.toggle("active");
                if (sectionElement.classList.contains("active")) {
                    sectionElement.innerHTML = `${sectionElement.textContent} (развернуто)`;
                } else {
                    sectionElement.innerHTML = sectionElement.textContent.replace(" (развернуто)", "");
                }
            });
        });
    }

    // Функция для отображения списка брендов
    function renderBrands() {
        console.log("Обновляем список брендов"); // Отладочное сообщение

        brandsList.innerHTML = "";
        brands.forEach((brand) => {
            console.log(`Отображаем бренд: ${brand.name}`); // Отладочное сообщение

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
            nameElement.addEventListener("click", (e) => {
                const brandId = parseInt(e.target.getAttribute("data-id"), 10);
                const selectedBrand = brands.find((brand) => brand.id === brandId);
                if (selectedBrand) {
                    renderBrandSections(selectedBrand);
                }
            });
        });
    }
});
