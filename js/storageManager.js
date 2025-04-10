// Функции для работы с localStorage

const STORAGE_KEY = 'brandbook_data';

// Сохранение брендов в localStorage
export function saveBrandsToStorage(brands) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
}

// Загрузка брендов из localStorage
export function loadBrandsFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Экспорт данных в JSON
export function exportToJson() {
    const data = loadBrandsFromStorage();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brandbook-export.json';
    a.click();
}