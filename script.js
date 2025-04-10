let brands = []; // Массив для хранения данных о брендах

document.addEventListener("DOMContentLoaded", () => {
    const brandsList = document.getElementById("brandsList");
    const addBrandForm = document.getElementById("addBrandForm");

    // Обработчик формы добавления бренда
    addBrandForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const brandName = document.getElementById("brandName").value.trim();
        if (brandName) {
            const newBrand = {
                id: Date.now(),
                name: brandName,
                sections: {} // Пустые секции для будущей реализации
            };
            brands.push(newBrand);
            renderBrands();
            addBrandForm.reset();
            const addBrandModal = bootstrap.Modal.getInstance(document.getElementById("addBrandModal"));
            addBrandModal.hide();
        }
    });

    // Функция для отображения списка брендов
    function renderBrands() {
        brandsList.innerHTML = "";
        brands.forEach((brand) => {
            const brandItem = document.createElement("div");
            brandItem.className = "list-group-item d-flex justify-content-between align-items-center";
            brandItem.innerHTML = `
                <span>${brand.name}</span>
                <button class="btn btn-danger btn-sm" data-id="${brand.id}">Удалить</button>
            `;
            brandsList.appendChild(brandItem);
        });

        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll(".btn-danger").forEach((button) => {
            button.addEventListener("click", (e) => {
                const brandId = parseInt(e.target.getAttribute("data-id"), 10);
                brands = brands.filter((brand) => brand.id !== brandId);
                renderBrands();
            });
        });
    }
});
