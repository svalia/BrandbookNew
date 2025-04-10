// Обработчики событий и инициализация
import { addBrand } from './brandManager.js';
import { saveBrandsToStorage, loadBrandsFromStorage } from './storageManager.js';
import { renderBrands } from './uiManager.js';
import { addItem } from './itemManager.js';  // Добавляем этот импорт
import { initializeBrandManager } from './brandManager.js';

// Инициализация приложения
export function initializeApp() {
    setupEventListeners();
    loadInitialData();
}

// Настройка обработчиков событий
function setupEventListeners() {
    document.getElementById('addBrandBtn').addEventListener('click', () => {
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