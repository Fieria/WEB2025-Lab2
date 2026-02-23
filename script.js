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

// Функция для обработки добавления новой задачи
function handleAddTask(event) {
    event.preventDefault();
    
    const input = event.target.querySelector('input[type="text"]');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        return;
    }
    
    // Добавляем задачу в массив
    const task = {
        id: Date.now(),
        text: taskText
    };
    
    tasks.push(task);
    
    // Сохраняем в localStorage
    saveTasks();
    
    // Очищаем поле ввода
    input.value = '';
    
    // Обновляем отображение списка
    renderTasks();
}

// Функция для удаления задачи
function handleDeleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Функция для отображения списка задач
function renderTasks() {
    const taskList = document.getElementById('task-list');
    
    // Очищаем список
    taskList.innerHTML = '';
    
    // Создаем элементы для каждой задачи
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        listItem.appendChild(taskText);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Удалить';
        deleteButton.setAttribute('aria-label', `Удалить задачу: ${task.text}`);
        deleteButton.addEventListener('click', () => handleDeleteTask(task.id));
        listItem.appendChild(deleteButton);
        
        taskList.appendChild(listItem);
    });
}

// Функция для сохранения задач в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция для загрузки задач из localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);

