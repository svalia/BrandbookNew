import { loadBrandsFromStorage, saveBrandsToStorage } from './storageManager.js';

function validateHexColor(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
}

function convertHexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function convertRgbToCmyk(r, g, b) {
    // Нормализация RGB значений
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    // Вычисление черного канала
    let k = 1 - Math.max(rn, gn, bn);
    
    // Вычисление остальных каналов
    let c = k === 1 ? 0 : (1 - rn - k) / (1 - k);
    let m = k === 1 ? 0 : (1 - gn - k) / (1 - k);
    let y = k === 1 ? 0 : (1 - bn - k) / (1 - k);

    // Конвертация в проценты
    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

export function initializeColorManager() {
    // Инициализация работы с цветами
}

export function hexToRgb(hex) {
    // Конвертация HEX в RGB
}

export function rgbToCmyk(r, g, b) {
    // Конвертация RGB в CMYK
}

export function processColor(hex) {
    // Приводим к верхнему регистру и убираем пробелы
    hex = hex.trim().toUpperCase();
    
    // Добавляем # если его нет
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    return {
        hex,
        type: 'color'
    };
}

export async function addColors(brandId, hexCodes, type = 'primary') {
    try {
        // Проверяем тип цветов
        if (!['primary', 'secondary'].includes(type)) {
            throw new Error('Неверный тип цветов');
        }

        const processedHexCodes = hexCodes
            .split(',')
            .map(hex => hex.trim())
            .filter(hex => validateHexColor(hex));

        if (processedHexCodes.length === 0) {
            throw new Error('Нет валидных HEX-кодов');
        }

        const colors = processedHexCodes.map(processColor);
        const currentBrands = loadBrandsFromStorage();
        
        const updatedBrands = currentBrands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                // Инициализируем структуру colors, если она отсутствует
                const currentColors = brand.sections.colors || {
                    primary: [],
                    secondary: [],
                    paired: [],
                    palettes: []
                };

                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        colors: {
                            ...currentColors,
                            [type]: [...(currentColors[type] || []), ...colors]
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Ошибка сохранения данных');
        }

        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Ошибка при добавлении цветов:', error);
        return { success: false, error: error.message };
    }
}

export async function addPairedColors(brandId, textHex, bgHex, allowInversion) {
    try {
        if (!textHex || !bgHex) {
            throw new Error('Необходимо указать оба цвета');
        }

        // Обрабатываем цвета
        const textColor = processColor(textHex);
        const bgColor = processColor(bgHex);

        // Создаем объект парных цветов
        const pairedColor = {
            id: Date.now(),
            text: textColor,
            background: bgColor,
            allowInversion: !!allowInversion
        };

        // Получаем текущие бренды
        const brands = loadBrandsFromStorage();

        // Обновляем бренд
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                // Инициализируем структуру, если она отсутствует
                const colors = brand.sections.colors || {};
                const paired = colors.paired || [];
                
                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        colors: {
                            ...colors,
                            paired: [...paired, pairedColor]
                        }
                    }
                };
            }
            return brand;
        });

        // Сохраняем обновленные данные
        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Ошибка сохранения данных');
        }

        console.log('Парные цвета успешно добавлены:', pairedColor);
        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Ошибка при добавлении парных цветов:', error);
        return { success: false, error: error.message };
    }
}

export async function addColorPalette(brandId, hexCodes) {
    try {
        if (!hexCodes) {
            throw new Error('Не указаны цвета для палитры');
        }

        const processedHexCodes = hexCodes
            .split(',')
            .map(hex => hex.trim())
            .filter(hex => validateHexColor(hex));

        if (processedHexCodes.length === 0) {
            throw new Error('Нет валидных HEX-кодов. Формат: #RRGGBB,#RRGGBB,...');
        }

        const palette = {
            id: Date.now(),
            colors: processedHexCodes.map(processColor)
        };

        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                // Инициализируем структуру если её нет
                const currentColors = brand.sections.colors || {};
                const currentPalettes = currentColors.palettes || [];

                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        colors: {
                            ...currentColors,
                            palettes: [...currentPalettes, palette]
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Ошибка сохранения данных');
        }

        console.log('Палитра успешно добавлена:', palette);
        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Ошибка при добавлении палитры:', error);
        return { success: false, error: error.message };
    }
}

export async function updatePaletteColors(brandId, paletteId, colors) {
    try {
        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                const palettes = brand.sections.colors.palettes.map(palette => {
                    if (palette.id === paletteId) {
                        return { ...palette, colors };
                    }
                    return palette;
                });

                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        colors: {
                            ...brand.sections.colors,
                            palettes
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Ошибка сохранения данных');
        }

        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Ошибка при обновлении палитры:', error);
        return { success: false, error: error.message };
    }
}

export async function deletePalette(brandId, paletteId) {
    try {
        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        colors: {
                            ...brand.sections.colors,
                            palettes: brand.sections.colors.palettes.filter(p => p.id !== paletteId)
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Ошибка сохранения данных');
        }

        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Ошибка при удалении палитры:', error);
        return { success: false, error: error.message };
    }
}

export async function addColorToPalette(brandId, paletteId, hexCode) {
    try {
        if (!validateHexColor(hexCode)) {
            throw new Error('Некорректный формат HEX-кода');
        }

        const color = processColor(hexCode);
        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                const palettes = brand.sections.colors.palettes.map(palette => {
                    if (palette.id === paletteId) {
                        return {
                            ...palette,
                            colors: [...palette.colors, color]
                        };
                    }
                    return palette;
                });

                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        colors: {
                            ...brand.sections.colors,
                            palettes
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Ошибка сохранения данных');
        }

        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Ошибка при добавлении цвета в палитру:', error);
        return { success: false, error: error.message };
    }
}

export async function removeColorFromPalette(brandId, paletteId, hexToRemove) {
    try {
        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId, 10)) {
                const palettes = brand.sections.colors.palettes.map(palette => {
                    if (palette.id === paletteId) {
                        return {
                            ...palette,
                            colors: palette.colors.filter(color => color.hex !== hexToRemove)
                        };
                    }
                    return palette;
                });

                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        colors: {
                            ...brand.sections.colors,
                            palettes
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Ошибка сохранения данных');
        }

        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Ошибка при удалении цвета из палитры:', error);
        return { success: false, error: error.message };
    }
}
