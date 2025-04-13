// Модуль для работы с редактором текста

// Функция инициализации
function initEditor() {
    console.log('Editor module initialized');
    // Редактор инициализируется по требованию с помощью openEditor
}

// Функция открытия редактора
function openEditor(contentElement) {
    if (!contentElement) {
        console.error('Content element not provided');
        return;
    }
    
    // Создаем модальное окно редактора
    const editorModal = document.createElement('div');
    editorModal.className = 'editor-modal';
    
    // Получаем текущее содержимое
    const currentContent = contentElement.innerHTML || '';
    
    // Формируем содержимое модального окна
    editorModal.innerHTML = `
        <div class="editor-container">
            <div class="editor-toolbar">
                <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h1">H1</button>
                <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h2">H2</button>
                <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h3">H3</button>
                <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h4">H4</button>
                <button type="button" class="btn btn-sm btn-light" data-command="bold">Жирный</button>
                <button type="button" class="btn btn-sm btn-light" data-command="italic">Курсив</button>
                <button type="button" class="btn btn-sm btn-light" data-command="insertUnorderedList">Маркированный список</button>
                <button type="button" class="btn btn-sm btn-light" data-command="insertOrderedList">Нумерованный список</button>
            </div>
            <div class="editor-content">
                <div id="wysiwyg-editor" contenteditable="true">${currentContent}</div>
            </div>
            <div class="editor-actions">
                <button type="button" class="btn-save">Сохранить</button>
                <button type="button" class="btn-cancel">Отмена</button>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM
    document.body.appendChild(editorModal);
    
    // Настраиваем редактор
    const editorElement = editorModal.querySelector('#wysiwyg-editor');
    const saveButton = editorModal.querySelector('.btn-save');
    const cancelButton = editorModal.querySelector('.btn-cancel');
    const toolbarButtons = editorModal.querySelectorAll('.editor-toolbar button');
    
    // Настраиваем кнопки на панели инструментов
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            const value = this.dataset.value || null;
            
            if (command) {
                document.execCommand(command, false, value);
                editorElement.focus();
            }
        });
    });
    
    // Обработчик кнопки Сохранить
    saveButton.addEventListener('click', function() {
        // Сохраняем содержимое и обновляем формат
        contentElement.innerHTML = editorElement.innerHTML;
        
        // Создаем форматированное представление
        const formattedContent = document.createElement('div');
        formattedContent.className = 'formatted-description';
        formattedContent.innerHTML = editorElement.innerHTML;
        
        // Заменяем старое содержимое
        contentElement.innerHTML = '';
        contentElement.appendChild(formattedContent);
        
        // Добавляем кнопку редактирования
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-secondary edit-description-btn mt-3';
        editButton.textContent = 'Редактировать';
        editButton.addEventListener('click', function() {
            openEditor(contentElement);
        });
        
        contentElement.appendChild(editButton);
        
        // Закрываем редактор
        editorModal.remove();
    });
    
    // Обработчик кнопки Отмена
    cancelButton.addEventListener('click', function() {
        editorModal.remove();
    });
    
    // Фокус на редакторе
    editorElement.focus();
}
