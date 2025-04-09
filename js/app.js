// Storage Manager
const storageManager = {
    saveBrandsToStorage(brands) {
        try {
            localStorage.setItem('brands', JSON.stringify(brands));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    loadBrandsFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('brands')) || [];
        } catch (error) {
            console.error('Loading error:', error);
            return [];
        }
    }
};

// Brand Manager
const brandManager = {
    createBrand(name) {
        return {
            id: Date.now(),
            name: name,
            sections: {
                brandDescription: { description: '' },
                logos: { description: '', items: [] },
                colors: {
                    description: '',
                    primary: [],
                    secondary: [],
                    paired: [],
                    palettes: []
                },
                textures: { description: '', items: [] },
                typography: { description: '', fonts: [], hierarchy: [], rules: [] },
                keyElements: { description: '', items: [] },
                toneOfVoice: { description: '' },
                serviceStandards: { description: '' },
                graphicElements: { description: '', items: [] },
                advertisingMaterials: { description: '', items: [] },
                styleGuide: { description: '' }
            }
        };
    },

    addBrand(brandName) {
        const brands = storageManager.loadBrandsFromStorage();
        const newBrand = this.createBrand(brandName);
        const updatedBrands = [...brands, newBrand];
        storageManager.saveBrandsToStorage(updatedBrands);
        uiManager.renderBrands(updatedBrands);
    },

    deleteBrand(brandId) {
        const brands = storageManager.loadBrandsFromStorage();
        const updatedBrands = brands.filter(b => b.id !== parseInt(brandId));
        storageManager.saveBrandsToStorage(updatedBrands);
        uiManager.renderBrands(updatedBrands);
    }
};

// UI Manager
const uiManager = {
    editors: {},

    renderBrands(brands) {
        const brandsList = document.getElementById('brandsList');
        if (!brandsList) return;

        brandsList.innerHTML = '';
        brands.forEach(brand => {
            const element = this.createBrandElement(brand);
            brandsList.appendChild(element);
        });
    },

    createBrandElement(brand) {
        const div = document.createElement('div');
        div.className = 'card mb-3';
        div.innerHTML = `
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${brand.name}</h5>
                    <button class="btn btn-sm btn-danger delete-brand-btn" 
                            data-brand-id="${brand.id}">
                        Удалить
                    </button>
                </div>
            </div>
        `;
        return div;
    }
};

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    const brands = storageManager.loadBrandsFromStorage();
    uiManager.renderBrands(brands);

    // Add brand button handler
    document.getElementById('saveBrandBtn')?.addEventListener('click', () => {
        const input = document.getElementById('brandName');
        const name = input?.value?.trim();
        if (name) {
            brandManager.addBrand(name);
            input.value = '';
            bootstrap.Modal.getInstance(document.getElementById('addBrandModal'))?.hide();
        }
    });

    // Delete brand button handler
    document.addEventListener('click', (e) => {
        if (e.target.matches('.delete-brand-btn')) {
            const brandId = e.target.dataset.brandId;
            if (confirm('Удалить бренд?')) {
                brandManager.deleteBrand(parseInt(brandId));
            }
        }
    });
});
