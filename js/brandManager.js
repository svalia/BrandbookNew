import { saveBrandsToStorage, loadBrandsFromStorage } from './storageManager.js';

export function initializeBrandManager(initialBrands = []) {
    // Инициализация управления брендами
}

export function createBrand(name) {
    return {
        id: Date.now(),
        name,
        sections: {
            brandDescription: { description: '' },
            logos: { description: '', items: [] },
            colors: {
                description: '',
                primary: [],
                secondary: [],
                paired: [],
                palettes: [],
                gradients: []
            },
            textures: { description: '', items: [] },
            typography: {
                description: '',
                fonts: [],
                hierarchy: [],
                rules: []
            },
            keyElements: { description: '', items: [] },
            toneOfVoice: { description: '' },
            serviceStandards: { description: '' },
            graphicElements: { description: '', items: [] },
            advertisingMaterials: { description: '', items: [] },
            styleGuide: { description: '', items: [] }
        }
    };
}

export function validateBrand(brand) {
    return brand && brand.id && brand.name;
}

export function addBrand(name, brands) {
    const newBrand = {
        id: Date.now(),
        name,
        sections: {
            brandDescription: { description: '' },
            logos: { description: '', items: [] },
            colors: { description: '', primary: [], secondary: [], paired: [], palettes: [], gradients: [] },
            typography: { description: '', fonts: [], presets: [] },
            // ...other sections...
        },
    };
    brands.push(newBrand);
}

export function deleteBrand(id) {
    let brands = loadBrandsFromStorage();
    brands = brands.filter((brand) => brand.id !== id);
    saveBrandsToStorage(brands);
}

export function updateSectionDescription(brands, brandId, sectionKey, description) {
    if (!Array.isArray(brands)) {
        console.error('Получен не массив брендов:', brands);
        return loadBrandsFromStorage();
    }

    try {
        // Гарантируем, что description всегда строка
        const safeDescription = description === null || description === undefined ? '' : String(description);
        
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId)) {
                // Убеждаемся, что секция существует
                if (!brand.sections[sectionKey]) {
                    brand.sections[sectionKey] = { description: '', items: [] };
                }
                
                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        [sectionKey]: {
                            ...brand.sections[sectionKey],
                            description: safeDescription
                        }
                    }
                };
            }
            return brand;
        });

        // Проверяем успешность обновления
        const brandExists = updatedBrands.some(b => b.id === parseInt(brandId));
        if (!brandExists) {
            throw new Error(`Бренд с ID ${brandId} не найден`);
        }

        // Сохраняем обновленные данные
        const saved = saveBrandsToStorage(updatedBrands);
        if (!saved) {
            throw new Error('Ошибка сохранения данных');
        }

        return updatedBrands;
    } catch (error) {
        console.error('Ошибка обновления описания секции:', error);
        // Возвращаем актуальное состояние из хранилища
        return loadBrandsFromStorage();
    }
}