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
    
    // Получаем текущее содержимое - очищаем от кнопок редактирования
    let currentContent = '';
    
    // Находим formatted-description внутри contentElement или используем все содержимое
    const formattedDesc = contentElement.querySelector('.formatted-description');
    if (formattedDesc) {
        currentContent = formattedDesc.innerHTML;
    } else {
        // Создаем временный контейнер для фильтрации содержимого
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentElement.innerHTML;
        
        // Удаляем все кнопки редактирования, если они есть
        const editButtons = tempDiv.querySelectorAll('.edit-description-btn');
        editButtons.forEach(btn => btn.remove());
        
        currentContent = tempDiv.innerHTML;
    }
    
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
        // Находим родительский блок description-block
        const descriptionBlock = contentElement.closest('.description-block');
        if (!descriptionBlock) {
            console.error('Не удалось найти родительский блок description-block');
            return;
        }
        
        // Очищаем contentElement
        contentElement.innerHTML = '';
        
        // Создаем форматированное представление
        const formattedContent = document.createElement('div');
        formattedContent.className = 'formatted-description';
        formattedContent.innerHTML = editorElement.innerHTML;
        
        // Добавляем отформатированное содержимое
        contentElement.appendChild(formattedContent);
        
        // Скрываем кнопку "Добавить описание" и показываем "Редактировать"
        const addButton = descriptionBlock.querySelector('.add-description-btn');
        if (addButton) {
            addButton.style.display = 'none';
        }
        
        // Проверяем, есть ли уже кнопка редактирования 
        let editButton = descriptionBlock.querySelector('.edit-description-btn');
        
        // Если кнопки нет, создаем новую
        if (!editButton) {
            editButton = document.createElement('button');
            editButton.className = 'btn btn-secondary edit-description-btn mt-3';
            editButton.textContent = 'Редактировать';
            editButton.addEventListener('click', function() {
                openEditor(contentElement);
            });
            
            descriptionBlock.appendChild(editButton);
        } else {
            // Если кнопка уже есть, убедимся что она видима
            editButton.style.display = 'inline-block';
        }
        
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

// Инициализация модуля при загрузке страницы
document.addEventListener('DOMContentLoaded', initEditor);

// Экспортируем функции для использования в других модулях
window.openEditor = openEditor;
