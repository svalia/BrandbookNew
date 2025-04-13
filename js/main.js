let brands = []; // Массив для хранения данных о брендах

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM полностью загружен и обработан");

    // Инициализация UI элементов
    initUI();

    // Инициализация обработчиков событий для основных форм
    initBrandForm();
    initLogoForm();
    initColorForms();

    // Установка обработчиков событий для подсказок
    setupHints();
});

// Инициализация UI элементов
function initUI() {
    const addBrandButton = document.querySelector('[data-bs-target="#addBrandModal"]');
    
    if (addBrandButton) {
        addBrandButton.classList.add("btn-add-brand");
        addBrandButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Добавить бренд
        `;
    }
}

// Настройка подсказок
function setupHints() {
    const hintToggle = document.getElementById("hintToggle");
    const hintContent = document.getElementById("hintContent");
    
    if (hintToggle && hintContent) {
        const toggleIcon = hintToggle.querySelector(".toggle-icon");
        
        hintToggle.addEventListener("click", () => {
            hintContent.classList.toggle("show");
            toggleIcon.classList.toggle("collapsed");
        });
    }
}
