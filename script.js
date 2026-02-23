// Массив для хранения задач
let tasks = [];

// Функция для создания и добавления элементов на страницу
function initApp() {
    // Создаем основной контейнер
    const main = document.createElement('main');
    
    // Создаем заголовок
    const heading = document.createElement('h1');
    heading.textContent = 'ToDo-лист';
    main.appendChild(heading);
    
    // Создаем форму для добавления задач
    const form = document.createElement('form');
    
    // Создаем поле ввода
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Введите новую задачу...';
    input.setAttribute('aria-label', 'Поле для ввода новой задачи');
    form.appendChild(input);
    
    // Создаем кнопку добавления
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = 'Добавить задачу';
    form.appendChild(addButton);
    
    main.appendChild(form);
    
    // Создаем список задач
    const taskList = document.createElement('ul');
    taskList.id = 'task-list';
    taskList.setAttribute('aria-label', 'Список задач');
    main.appendChild(taskList);
    
    // Добавляем main в body
    document.body.appendChild(main);
    
    // Загружаем задачи из localStorage при загрузке страницы
    loadTasks();
}



// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);

