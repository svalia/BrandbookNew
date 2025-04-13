// Открытие редактора для элемента
function openEditor(targetElement, existingContent = "") {
    const editorModal = document.createElement("div");
    editorModal.className = "editor-modal";
    editorModal.innerHTML = `
        <div class="editor-container">
            <div class="editor-toolbar">
                <button data-action="h1">H1</button>
                <button data-action="h2">H2</button>
                <button data-action="h3">H3</button>
                <button data-action="h4">H4</button>
                <button data-action="bold">B</button>
                <button data-action="italic">I</button>
                <button data-action="ul">•</button>
                <button data-action="ol">1.</button>
            </div>
            <div class="editor-content">
                <textarea id="wysiwyg-editor" maxlength="10000" placeholder="Добавьте описание">${existingContent}</textarea>
            </div>
            <div class="editor-actions">
                <button class="btn-cancel">Отмена</button>
                <button class="btn-save">Сохранить</button>
            </div>
        </div>
    `;
    document.body.appendChild(editorModal);

    // Настраиваем редактор
    setupEditor(editorModal, targetElement, existingContent);
}

// Настройка редактора
function setupEditor(editorModal, targetElement, existingContent) {
    const textarea = editorModal.querySelector("#wysiwyg-editor");
    const toolbar = editorModal.querySelector(".editor-toolbar");
    const saveButton = editorModal.querySelector(".btn-save");
    const cancelButton = editorModal.querySelector(".btn-cancel");

    // Обработчики кнопок форматирования
    toolbar.addEventListener("click", (e) => handleToolbarClick(e, textarea));

    // Обработчик сохранения
    saveButton.addEventListener("click", () => {
        saveEditorContent(textarea, targetElement);
        document.body.removeChild(editorModal);
    });

    // Обработчик отмены
    cancelButton.addEventListener("click", () => {
        document.body.removeChild(editorModal);
    });
}

// Обработка клика по панели инструментов
function handleToolbarClick(e, textarea) {
    const action = e.target.dataset.action;
    if (!action) return;

    const actions = {
        h1: '# ',
        h2: '## ',
        h3: '### ',
        h4: '#### ',
        bold: '**',
        italic: '_',
        ul: '- ',
        ol: '1. '
    };

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    
    switch(action) {
        case 'bold':
        case 'italic':
            textarea.value = textarea.value.substring(0, start) + 
                           actions[action] + selected + actions[action] +
                           textarea.value.substring(end);
            break;
        case 'ul':
        case 'ol':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
            textarea.value = textarea.value.substring(0, start) +
                           actions[action] + selected +
                           textarea.value.substring(end);
            break;
    }
}

// Сохранение содержимого редактора
function saveEditorContent(textarea, targetElement) {
    const content = textarea.value;
    
    if (typeof marked !== 'undefined' && typeof marked.parse === "function") {
        targetElement.innerHTML = `
            <div class="formatted-description">${marked.parse(content)}</div>
            <button class="btn btn-secondary edit-description-btn">Редактировать</button>
        `;
    } else {
        targetElement.innerHTML = `
            <div class="formatted-description" style="white-space: pre-wrap;">${content}</div>
            <button class="btn btn-secondary edit-description-btn">Редактировать</button>
        `;
    }

    // Удаляем кнопку "Добавить описание", если она есть
    const addDescriptionButton = targetElement.closest(".description-block").querySelector(".add-description-btn");
    if (addDescriptionButton) {
        addDescriptionButton.remove();
    }

    // Добавляем обработчик для кнопки "Редактировать"
    const editButton = targetElement.querySelector(".edit-description-btn");
    editButton.addEventListener("click", () => {
        openEditor(targetElement, content);
    });
}
