// Инициализация формы добавления бренда
function initBrandForm() {
    const brandsList = document.getElementById("brandsList");
    const addBrandForm = document.getElementById("addBrandForm");
    const addBrandButton = document.querySelector('[data-bs-target="#addBrandModal"]');

    if (!brandsList || !addBrandForm) {
        console.error("Не удалось найти элементы brandsList или addBrandForm");
        return;
    }

    // Обработчик формы добавления бренда
    addBrandForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const brandName = document.getElementById("brandName").value.trim();
        if (brandName) {
            const newBrand = {
                id: Date.now(),
                name: brandName,
                sections: {}
            };
            brands.push(newBrand);
            console.log("Добавлен бренд:", newBrand.name);
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
                }, 300);
            }
        } else {
            console.warn("Название бренда не может быть пустым");
        }
    });
}

// Функция для отображения списка брендов
function renderBrands() {
    const brandsList = document.getElementById("brandsList");
    if (!brandsList) return;

    brandsList.innerHTML = "";
    brands.forEach((brand) => {
        const brandItem = createBrandElement(brand);
        brandsList.appendChild(brandItem);
    });
}

// Создание элемента бренда
function createBrandElement(brand) {
    const brandItem = document.createElement("div");
    brandItem.className = "brand-item";
    brandItem.dataset.id = brand.id;
    
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

    // Добавляем обработчики
    setupBrandToggle(brandItem, brand);
    setupSectionToggles(brandItem);
    setupDeleteButton(brandItem);
    setupDescriptionButtons(brandItem);
    setupColorButtons(brandItem, brand);
    
    return brandItem;
}

// Настройка кнопки разворачивания/сворачивания бренда
function setupBrandToggle(brandItem, brand) {
    const toggleSection = brandItem.querySelector(".toggle-section");
    const brandContent = brandItem.querySelector(".brand-sections-content");
    const toggleIcon = toggleSection.querySelector(".section-toggle-icon");
    
    toggleSection.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;
        const isVisible = brandContent.style.display === "block";
        brandContent.style.display = isVisible ? "none" : "block";
        toggleIcon.src = isVisible ? "img_src/chevron-down-green.svg" : "img_src/chevron-up-green.svg";
    });
}

// Настройка разворачивания/сворачивания секций
function setupSectionToggles(brandItem) {
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
        }
    });
}

// Настройка кнопки удаления бренда
function setupDeleteButton(brandItem) {
    const deleteButton = brandItem.querySelector(".btn.btn-danger");
    
    deleteButton.addEventListener("click", (e) => {
        const brandId = parseInt(e.target.getAttribute("data-id"), 10);
        brands = brands.filter((brand) => brand.id !== brandId);
        renderBrands();
    });
}

// Получение ID активного бренда
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
