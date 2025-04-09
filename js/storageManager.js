// Функции для работы с localStorage

// Сохранение брендов в localStorage
export function saveBrandsToStorage(brands) {
    localStorage.setItem('brandbook_brands', JSON.stringify(brands));
}

// Загрузка брендов из localStorage
export function loadBrandsFromStorage() {
    const data = localStorage.getItem('brandbook_brands');
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