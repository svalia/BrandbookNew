// Обработчики событий и инициализация
import { addBrand } from './brandManager.js';
import { saveBrandsToStorage, loadBrandsFromStorage } from './storageManager.js';
import { renderBrands } from './uiManager.js';
import { addItem } from './itemManager.js';  // Добавляем этот импорт
import { initializeBrandManager } from './brandManager.js';

// Убедимся, что экспортируем функцию initializeApp
export function initializeApp() {
    // Логика инициализации приложения
    console.log('Приложение инициализировано');
    setupEventListeners();
    loadInitialData();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Привязываем обработчик к кнопке "Добавить бренд"
    const addBrandBtn = document.getElementById('addBrandBtn');
    if (addBrandBtn) {
        addBrandBtn.addEventListener('click', () => {
            const brandName = prompt('Введите название бренда:');
            if (brandName && brandName.trim() !== '') {
                const brands = loadBrandsFromStorage();
                addBrand(brandName, brands);
                saveBrandsToStorage(brands);
                renderBrands(brands);
            } else {
                alert('Название бренда не может быть пустым.');
            }
        });
    } else {
        console.error('Кнопка "Добавить бренд" не найдена в DOM.');
    }

    // Привязываем обработчики для экспорта и импорта JSON
    document.getElementById('exportJsonBtn').addEventListener('click', exportToJson);
    document.getElementById('importJsonBtn').addEventListener('click', importFromJson);
}

function loadInitialData() {
    const brands = loadBrandsFromStorage();
    renderBrands(brands);
}

function exportToJson() {
    const brands = loadBrandsFromStorage();
    const dataStr = JSON.stringify(brands, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brands.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            saveBrandsToStorage(data);
            renderBrands(data);
        };
        reader.readAsText(file);
    });
    input.click();
}