import { loadBrandsFromStorage, saveBrandsToStorage } from './storageManager.js';

// Функция для генерации имени логотипа на основе параметров
function generateLogoName(properties) {
    const parts = [
        properties.color === 'custom' ? properties.customColor : properties.color,
        properties.language,
        properties.type,
        properties.orientation
    ];
    return parts.join('_');
}

// Функция для добавления логотипа
export async function addLogo(brandId, file, properties) {
    try {
        // Конвертируем файл в base64
        const base64 = await fileToBase64(file);

        const logo = {
            id: Date.now(),
            name: generateLogoName(properties),
            image: base64,
            properties: {
                ...properties,
                iconWidth: parseFloat(properties.iconWidth).toFixed(2),
                safeZone: parseFloat(properties.safeZone).toFixed(2)
            }
        };

        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        logos: {
                            ...brand.sections.logos,
                            items: [...brand.sections.logos.items, logo]
                        }
                    }
                };
            }
            return brand;
        });

        if (saveBrandsToStorage(updatedBrands)) {
            return { success: true, brands: updatedBrands };
        }
        throw new Error('Ошибка сохранения данных');
    } catch (error) {
        console.error('Ошибка при добавлении логотипа:', error);
        return { success: false, error: error.message };
    }
}

// Вспомогательная функция для конвертации файла в base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Функции для работы с логотипами и их метаданными

// Функция для проверки MIME-типа файла
export function validateLogoFile(file) {
    const allowedTypes = ['image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Неподдерживаемый формат файла. Разрешены только PNG и SVG');
    }
    return true;
}

// Функция для расчета значений логотипа
export function calculateLogoValues(measurements) {
    const {
        totalWidth,
        totalHeight,
        iconWidth,
        letterBHeight
    } = measurements;

    // Проверка входных данных
    if (!totalWidth || !totalHeight || !iconWidth || !letterBHeight) {
        throw new Error('Не все размеры указаны');
    }

    // Расчет половины ширины иконки в процентах
    const iconWidthPercent = (iconWidth / totalWidth) * 100 / 2;

    // Расчет охранного поля в процентах
    const safeZonePercent = (letterBHeight / totalHeight) * 100;

    return {
        iconWidthPercent: parseFloat(iconWidthPercent.toFixed(3)),
        safeZonePercent: parseFloat(safeZonePercent.toFixed(3))
    };
}
