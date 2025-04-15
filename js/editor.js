// Модуль для работы с редактором текста

// Функция инициализации
function initEditor() {
    console.log('Editor module initialized');
    // Редактор инициализируется по требованию с помощью openEditor
}

// Функция открытия редактора
function openEditor(element, callback) {
    // Создаем модальное окно с редактором
    const editorModal = document.createElement('div');
    editorModal.className = 'editor-modal';
    
    // Получаем текущее содержимое элемента
    const currentContent = element.innerHTML || '';
    
    // Создаем контейнер для редактора
    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-container';
    
    // Создаем панель инструментов
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';
    toolbar.innerHTML = `
        <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h1">H1</button>
        <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h2">H2</button>
        <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h3">H3</button>
        <button type="button" class="btn btn-sm btn-light" data-command="formatBlock" data-value="h4">H4</button>
        <button type="button" class="btn btn-sm btn-light" data-command="bold">Жирный</button>
        <button type="button" class="btn btn-sm btn-light" data-command="italic">Курсив</button>
        <button type="button" class="btn btn-sm btn-light" data-command="insertUnorderedList">Маркированный список</button>
        <button type="button" class="btn btn-sm btn-light" data-command="insertOrderedList">Нумерованный список</button>
    `;
    
    // Создаем контент редактора
    const editorContent = document.createElement('div');
    editorContent.className = 'editor-content';
    
    // Создаем div для WYSIWYG редактирования
    const editor = document.createElement('div');
    editor.id = 'wysiwyg-editor';
    editor.contentEditable = true;
    editor.innerHTML = currentContent;
    
    // Создаем действия редактора
    const editorActions = document.createElement('div');
    editorActions.className = 'editor-actions';
    editorActions.innerHTML = `
        <button type="button" class="btn-save">Сохранить</button>
        <button type="button" class="btn-cancel">Отмена</button>
    `;
    
    // Собираем редактор
    editorContent.appendChild(editor);
    editorContainer.appendChild(toolbar);
    editorContainer.appendChild(editorContent);
    editorContainer.appendChild(editorActions);
    editorModal.appendChild(editorContainer);
    
    // Добавляем редактор в DOM
    document.body.appendChild(editorModal);
    
    // Настраиваем кнопки на панели инструментов
    const toolbarButtons = toolbar.querySelectorAll('button');
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            const value = this.dataset.value || null;
            
            if (command) {
                document.execCommand(command, false, value);
                editor.focus();
            }
        });
    });
    
    // Добавляем обработчик для кнопки сохранения
    const saveButton = editorModal.querySelector('.btn-save');
    saveButton.addEventListener('click', function () {
        // Сохраняем содержимое редактора
        const newContent = editor.innerHTML;
        element.innerHTML = newContent;
        
        console.log('Сохранено описание:', newContent);
        
        // Если есть callback, вызываем его с новым содержимым
        if (callback && typeof callback === 'function') {
            callback(newContent);
        }
        
        // Закрываем модальное окно
        document.body.removeChild(editorModal);
    });
    
    // Добавляем обработчик для кнопки отмены
    const cancelButton = editorModal.querySelector('.btn-cancel');
    cancelButton.addEventListener('click', function () {
        // Закрываем модальное окно без сохранения
        document.body.removeChild(editorModal);
    });
    
    // Фокусируемся на редакторе
    setTimeout(() => {
        editor.focus();
    }, 10);
}

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', initEditor);

// Экспортируем функции для использования в других модулях
window.openEditor = openEditor;
