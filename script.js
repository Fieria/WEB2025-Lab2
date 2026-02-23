// Массив для хранения задач
let tasks = [];

// Функция для создания и добавления элементов на страницу
function initApp() {
    // Создаем основной контейнер
    const main = document.createElement('main');
    
    // Создаем заголовок
    const heading = document.createElement('h1');
    heading.textContent = 'ToDo-лист';
    main.append(heading);
    
    // Создаем форму для добавления задач
    const form = document.createElement('form');
    form.addEventListener('submit', handleAddTask);
    
    // Создаем поле ввода через методы DOM
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Введите новую задачу...');
    input.setAttribute('aria-label', 'Поле для ввода новой задачи');
    form.append(input);
    
    // Создаем контейнер для поля ввода даты
    const dateContainer = document.createElement('div');
    dateContainer.setAttribute('class', 'date-input-container');
    
    // Создаем поле ввода даты (текстовое) для формата дд.мм.гггг
    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'text');
    dateInput.setAttribute('id', 'task-date');
    dateInput.setAttribute('placeholder', 'дд.мм.гггг');
    dateInput.setAttribute('pattern', '\\d{2}\\.\\d{2}\\.\\d{4}');
    dateInput.setAttribute('maxlength', '10');
    dateInput.setAttribute('aria-label', 'Введите дату в формате дд.мм.гггг или выберите из календаря');
    dateInput.addEventListener('input', handleDateInput);
    dateContainer.append(dateInput);
    
    // Создаем скрытое поле для календаря
    const datePicker = document.createElement('input');
    datePicker.setAttribute('type', 'date');
    datePicker.setAttribute('id', 'task-date-picker');
    datePicker.setAttribute('style', 'position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;');
    datePicker.addEventListener('change', handleDatePickerChange);
    dateContainer.append(datePicker);
    
    // Создаем кнопку календаря
    const calendarButton = document.createElement('button');
    calendarButton.setAttribute('type', 'button');
    calendarButton.setAttribute('class', 'calendar-btn');
    calendarButton.textContent = '📅';
    calendarButton.setAttribute('aria-label', 'Открыть календарь');
    calendarButton.addEventListener('click', () => {
        datePicker.showPicker ? datePicker.showPicker() : datePicker.click();
    });
    dateContainer.append(calendarButton);
    
    form.append(dateContainer);
    
    // Создаем кнопку добавления через методы DOM
    const addButton = document.createElement('button');
    addButton.setAttribute('type', 'submit');
    addButton.textContent = 'Добавить задачу';
    form.append(addButton);
    
    main.append(form);
    
    // Создаем форму для отображения задач
    const tasksForm = document.createElement('form');
    tasksForm.setAttribute('id', 'tasks-form');
    
    // Создаем список задач
    const taskList = document.createElement('ul');
    taskList.setAttribute('id', 'task-list');
    taskList.setAttribute('aria-label', 'Список задач');
    tasksForm.append(taskList);
    
    main.append(tasksForm);
    
    // Добавляем main в body через метод append
    document.body.append(main);
    
    // Загружаем задачи из localStorage при загрузке страницы
    loadTasks();
}

// Функция для обработки ввода даты в формате дд.мм.гггг
function handleDateInput(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
    
    // Форматируем в дд.мм.гггг
    if (value.length > 0) {
        if (value.length <= 2) {
            value = value;
        } else if (value.length <= 4) {
            value = value.slice(0, 2) + '.' + value.slice(2);
        } else {
            value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
        }
    }
    input.value = value;
}

// Функция для обработки выбора даты из календаря
function handleDatePickerChange(event) {
    const datePicker = event.target;
    const dateInput = document.getElementById('task-date');
    
    if (datePicker.value) {
        const date = new Date(datePicker.value + 'T00:00:00');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        dateInput.value = `${day}.${month}.${year}`;
    }
}

// Функция для обработки добавления новой задачи
function handleAddTask(event) {
    event.preventDefault();
    
    const input = event.target.querySelector('input[type="text"]');
    const dateInput = document.getElementById('task-date');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        return;
    }
    
    // Получаем дату в формате дд.мм.гггг
    let dateValue = '';
    if (dateInput && dateInput.value.trim()) {
        // Проверяем формат дд.мм.гггг
        const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const match = dateInput.value.trim().match(datePattern);
        if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            // Проверяем валидность даты
            const date = new Date(year, month - 1, day);
            if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
                dateValue = dateInput.value.trim();
            }
        }
    }
    
    // Добавляем задачу в массив
    const task = {
        id: Date.now(),
        text: taskText,
        date: dateValue
    };
    
    tasks.push(task);
    
    // Сохраняем в localStorage
    saveTasks();
    
    // Очищаем поля ввода
    input.value = '';
    if (dateInput) {
        dateInput.value = '';
    }
    const datePicker = document.getElementById('task-date-picker');
    if (datePicker) {
        datePicker.value = '';
    }
    
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
    
    // Создаем элементы для каждой задачи через методы DOM
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        let displayText = task.text;
        if (task.date) {
            displayText += ` (${task.date})`;
        }
        taskText.textContent = displayText;
        listItem.append(taskText);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', `Удалить задачу: ${task.text}`);
        deleteButton.addEventListener('click', () => handleDeleteTask(task.id));
        listItem.append(deleteButton);
        
        taskList.append(listItem);
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

