import { loadBrandsFromStorage, saveBrandsToStorage } from './storageManager.js';

export async function addItem(brandId, sectionKey, data) {
    try {
        const item = {
            id: Date.now(),
            image: data.image,
            type: data.type === 'custom' ? data.customType : data.type,
            tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            description: data.description || '',
            dateCreated: new Date().toISOString()
        };

        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId)) {
                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        [sectionKey]: {
                            ...brand.sections[sectionKey],
                            items: [...(brand.sections[sectionKey].items || []), item]
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Error saving data');
        }

        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Error adding item:', error);
        return { success: false, error: error.message };
    }
}

export async function updateItem(brandId, sectionKey, itemId, data, file = null) {
    try {
        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === parseInt(brandId)) {
                const items = brand.sections[sectionKey].items.map(item => {
                    if (item.id === itemId) {
                        return {
                            ...item,
                            type: data.type === 'custom' ? data.customType : data.type,
                            tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                            description: data.description || '',
                            ...(file ? { image: file } : {})
                        };
                    }
                    return item;
                });

                return {
                    ...brand,
                    sections: {
                        ...brand.sections,
                        [sectionKey]: {
                            ...brand.sections[sectionKey],
                            items
                        }
                    }
                };
            }
            return brand;
        });

        if (!saveBrandsToStorage(updatedBrands)) {
            throw new Error('Error saving data');
        }

        return { success: true, brands: updatedBrands };
    } catch (error) {
        console.error('Error updating item:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteItem(brandId, itemId, sectionKey) {
    try {
        const brands = loadBrandsFromStorage();
        const updatedBrands = brands.map(brand => {
            if (brand.id === brandId) {
                const sections = { ...brand.sections };
                if (sections[sectionKey] && Array.isArray(sections[sectionKey].items)) {
                    sections[sectionKey] = {
                        ...sections[sectionKey],
                        items: sections[sectionKey].items.filter(item => item.id !== itemId)
                    };
                }
                return { ...brand, sections };
            }
            return brand;
        });

        if (saveBrandsToStorage(updatedBrands)) {
            return { success: true, brands: updatedBrands };
        } else {
            throw new Error('Ошибка при сохранении данных');
        }
    } catch (error) {
        console.error('Ошибка при удалении элемента:', error);
        return { success: false, error: error.message };
    }
}
