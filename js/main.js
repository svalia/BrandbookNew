/*
Структура проекта (расположение основных функций):

1. main.js
   - Точка входа в приложение
   - Импорт и инициализация основных модулей

2. eventHandlers.js
   - Инициализация приложения (initializeApp)
   - Настройка обработчиков событий
   - Управление глобальным состоянием (массив брендов)

3. brandManager.js
   - Создание и удаление брендов
   - Управление структурой данных брендов
   - Работа с секциями брендбука

4. storageManager.js
   - Сохранение брендов в localStorage (saveBrandsToStorage)
   - Загрузка брендов из localStorage (loadBrandsFromStorage)

5. uiManager.js 
   - Отображение брендов и их секций
   - Управление интерфейсом
   - Заголовки и структура секций брендбука
*/

// Основной файл приложения
import { initializeBrandManager } from './brandManager.js';
import { initializeUIManager } from './uiManager.js';
import { initializeEventHandlers } from './eventHandlers.js';
import { initializeStorageManager } from './storageManager.js';
import { initializeColorManager } from './colorManager.js';
import { initializeApp } from './eventHandlers.js';

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});