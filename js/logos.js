// Инициализация формы добавления логотипа
function initLogoForm() {
    const addLogoForm = document.getElementById("addLogoForm");
    if (!addLogoForm) return;

    // Обработчик изменения цвета логотипа
    const logoColorSelect = document.getElementById("logoColor");
    const customColorField = document.getElementById("customColorField");
    
    if (logoColorSelect && customColorField) {
        logoColorSelect.addEventListener("change", () => {
            customColorField.style.display = logoColorSelect.value === "custom" ? "block" : "none";
        });
    }
    
    // Инициализация полей расчета значений логотипа
    initLogoCalculations();
    
    // Обработчик отправки формы логотипа
    addLogoForm.addEventListener("submit", handleLogoFormSubmit);
}

// Инициализация расчетов значений логотипа
function initLogoCalculations() {
    const logoWidthInput = document.getElementById("logoWidth");
    const logoHeightInput = document.getElementById("logoHeight");
    const iconWidthPxInput = document.getElementById("iconWidthPx");
    const letterBHeightInput = document.getElementById("letterBHeight");
    
    // Добавляем обработчики для ввода данных
    if (logoWidthInput && logoHeightInput && iconWidthPxInput && letterBHeightInput) {
        [logoWidthInput, logoHeightInput, iconWidthPxInput, letterBHeightInput].forEach((input) => {
            input.addEventListener("input", () => {
                input.value = input.value.replace(",", ".");
                calculateValues();
            });
        });
    }
}

// Функция для нормализации дробных чисел
function normalizeNumber(value) {
    return parseFloat(value.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
}

// Функция для расчета значений логотипа
function calculateValues() {
    const logoWidthInput = document.getElementById("logoWidth");
    const logoHeightInput = document.getElementById("logoHeight");
    const iconWidthPxInput = document.getElementById("iconWidthPx");
    const letterBHeightInput = document.getElementById("letterBHeight");
    const calculatedIconWidthElement = document.getElementById("calculatedIconWidth");
    const calculatedSafeZoneElement = document.getElementById("calculatedSafeZone");
    
    if (!logoWidthInput || !logoHeightInput || !iconWidthPxInput || !letterBHeightInput || 
        !calculatedIconWidthElement || !calculatedSafeZoneElement) {
        return;
    }
    
    const logoWidth = normalizeNumber(logoWidthInput.value);
    const logoHeight = normalizeNumber(logoHeightInput.value);
    const iconWidthPx = normalizeNumber(iconWidthPxInput.value);
    const letterBHeight = normalizeNumber(letterBHeightInput.value);

    // Расчёт половины ширины иконки
    const iconWidthPercent = logoWidth > 0 ? ((iconWidthPx / logoWidth) * 100) / 2 : 0;

    // Расчёт охранного поля
    const safeZonePercent = logoHeight > 0 ? (letterBHeight / logoHeight) * 100 : 0;

    // Обновляем значения в текстовых элементах
    calculatedIconWidthElement.textContent = iconWidthPercent.toFixed(3);
    calculatedSafeZoneElement.textContent = safeZonePercent.toFixed(3);
}

// Обработка отправки формы логотипа
function handleLogoFormSubmit(e) {
    e.preventDefault();

    const logoFile = document.getElementById("logoFile").files[0];
    const calculatedIconWidthElement = document.getElementById("calculatedIconWidth");
    const calculatedSafeZoneElement = document.getElementById("calculatedSafeZone");
    
    if (!logoFile || !calculatedIconWidthElement || !calculatedSafeZoneElement) {
        alert("Выберите файл логотипа и заполните все поля.");
        return;
    }

    const logoWidth = parseFloat(calculatedIconWidthElement.textContent);
    const safeZone = parseFloat(calculatedSafeZoneElement.textContent);

    const reader = new FileReader();
    reader.onload = () => {
        const logoData = {
            id: Date.now(),
            name: logoFile.name,
            image: reader.result,
            properties: {
                iconWidth: `${logoWidth}%`,
                safeZone: `${safeZone}%`,
            }
        };

        // Добавляем логотип в галерею
        const logosGallery = document.querySelector(".logos-gallery");
        if (!logosGallery) {
            console.error("Галерея логотипов не найдена.");
            return;
        }

        const logoCard = createLogoCard(logoData);
        logosGallery.appendChild(logoCard);

        // Сбрасываем форму
        document.getElementById("addLogoForm").reset();

        // Закрываем модальное окно
        const addLogoModal = bootstrap.Modal.getInstance(document.getElementById("addLogoModal"));
        if (addLogoModal) {
            addLogoModal.hide();
        }
    };
    reader.readAsDataURL(logoFile);
}

// Создание карточки логотипа
function createLogoCard(logoData) {
    const logoCard = document.createElement("div");
    logoCard.className = "logo-card";
    logoCard.innerHTML = `
        <img src="${logoData.image}" alt="${logoData.name}" class="logo-preview">
        <div class="logo-details">
            <p><strong>Название:</strong> ${logoData.name}</p>
            <p><strong>Половина ширины иконки:</strong> ${logoData.properties.iconWidth}</p>
            <p><strong>Охранное поле:</strong> ${logoData.properties.safeZone}</p>
        </div>
        <button class="delete-logo-btn">
            <img src="img_src/trash-icon.svg" alt="Удалить" class="delete-icon">
        </button>
    `;
    
    // Добавляем обработчик для удаления логотипа
    const deleteButton = logoCard.querySelector(".delete-logo-btn");
    if (deleteButton) {
        deleteButton.addEventListener("click", () => {
            logoCard.remove();
            // Если нужно также удалить логотип из данных бренда, добавляем соответствующую логику здесь
        });
    }
    
    return logoCard;
}
