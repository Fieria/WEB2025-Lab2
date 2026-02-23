// Массив для хранения задач
let tasks = [];
let searchQuery = ''; // Переменная для хранения поискового запроса

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
    
    // Создаем поле поиска
    const searchContainer = document.createElement('div');
    searchContainer.setAttribute('class', 'search-container');
    
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('id', 'search-input');
    searchInput.setAttribute('placeholder', 'Поиск задач...');
    searchInput.setAttribute('aria-label', 'Поле для поиска задач');
    searchInput.addEventListener('input', handleSearch);
    searchContainer.append(searchInput);
    
    main.append(searchContainer);
    
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
        date: dateValue,
        completed: false
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

// Функция для обработки поиска
function handleSearch(event) {
    searchQuery = event.target.value.toLowerCase().trim();
    renderTasks();
}

// Функция для удаления задачи
function handleDeleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Функция для переключения статуса выполнения задачи
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Функция для редактирования даты задачи
function editTaskDate(taskId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const listItem = document.querySelector(`li[data-task-id="${taskId}"]`);
    if (!listItem) return;
    
    const taskDateElement = listItem.querySelector('.task-date');
    if (!taskDateElement) return;
    
    // Создаем поле ввода для редактирования даты
    const editInput = document.createElement('input');
    editInput.setAttribute('type', 'text');
    editInput.className = 'task-date-edit-input';
    editInput.setAttribute('placeholder', 'дд.мм.гггг');
    editInput.setAttribute('maxlength', '10');
    editInput.value = task.date || '';
    
    // Добавляем обработчик форматирования при вводе
    editInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 2) {
                value = value;
            } else if (value.length <= 4) {
                value = value.slice(0, 2) + '.' + value.slice(2);
            } else {
                value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
            }
        }
        e.target.value = value;
    });
    
    // Заменяем дату на поле ввода
    taskDateElement.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    
    // Обработчик сохранения при потере фокуса или нажатии Enter
    const saveEdit = () => {
        const newDate = editInput.value.trim();
        const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const match = newDate.match(datePattern);
        
        if (newDate === '') {
            // Если дата пустая, удаляем её
            task.date = '';
            saveTasks();
            renderTasks();
        } else if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            // Проверяем валидность даты
            const date = new Date(year, month - 1, day);
            if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
                task.date = newDate;
                saveTasks();
                renderTasks();
            } else {
                // Невалидная дата, восстанавливаем оригинал
                renderTasks();
            }
        } else {
            // Неправильный формат, восстанавливаем оригинал
            renderTasks();
        }
    };
    
    editInput.addEventListener('blur', saveEdit);
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editInput.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            renderTasks();
        }
    });
}

// Функция для редактирования задачи
function editTask(taskId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const listItem = document.querySelector(`li[data-task-id="${taskId}"]`);
    if (!listItem) return;
    
    const taskTextElement = listItem.querySelector('.task-text');
    if (!taskTextElement) return;
    
    // Создаем поле ввода для редактирования
    const editInput = document.createElement('input');
    editInput.setAttribute('type', 'text');
    editInput.className = 'task-edit-input';
    editInput.value = task.text;
    
    // Заменяем текст на поле ввода
    taskTextElement.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    
    // Обработчик сохранения при потере фокуса или нажатии Enter
    const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText !== '' && newText !== task.text) {
            task.text = newText;
            saveTasks();
            renderTasks();
        } else if (newText === '') {
            // Если текст пустой, восстанавливаем оригинал
            renderTasks();
        } else {
            renderTasks();
        }
    };
    
    editInput.addEventListener('blur', saveEdit);
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editInput.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            renderTasks();
        }
    });
}

// Функция для отображения списка задач
function renderTasks() {
    const taskList = document.getElementById('task-list');
    
    // Очищаем список
    taskList.innerHTML = '';
    
    // Фильтруем задачи по поисковому запросу
    const filteredTasks = tasks.filter(task => {
        if (!searchQuery) {
            return true; // Если поиск пустой, показываем все задачи
        }
        return task.text.toLowerCase().includes(searchQuery);
    });
    
    // Создаем элементы для каждой задачи через методы DOM
    filteredTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-task-id', task.id);
        
        // Добавляем класс для выполненных задач
        if (task.completed) {
            listItem.className = 'task-completed';
        }
        
        // Создаем чекбокс для отметки выполнения
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed || false;
        checkbox.setAttribute('aria-label', `Отметить задачу как выполненную: ${task.text}`);
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleTaskCompletion(task.id);
        });
        listItem.append(checkbox);
        
        // Всегда создаем элемент для даты (даже если она пустая)
        const taskDate = document.createElement('div');
        taskDate.className = 'task-date';
        if (task.date) {
            taskDate.textContent = task.date;
        } else {
            // Оставляем пустое место для даты
            taskDate.textContent = '\u00A0'; // Неразрывный пробел для сохранения высоты
            taskDate.style.minHeight = '1.2em';
        }
        // Добавляем обработчик левого клика для редактирования/добавления даты
        taskDate.addEventListener('click', (e) => {
            e.stopPropagation();
            editTaskDate(task.id, e);
        });
        listItem.append(taskDate);
        
        // Всегда добавляем разделительную линию
        const separator = document.createElement('hr');
        separator.className = 'task-separator';
        listItem.append(separator);
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        // Добавляем обработчик левого клика для редактирования текста
        taskText.addEventListener('click', (e) => {
            e.stopPropagation();
            editTask(task.id, e);
        });
        listItem.append(taskText);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', `Удалить задачу: ${task.text}`);
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDeleteTask(task.id);
        });
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
        // Убеждаемся, что у всех задач есть поле completed
        tasks.forEach(task => {
            if (task.completed === undefined) {
                task.completed = false;
            }
        });
        saveTasks(); // Сохраняем обновленные задачи
        renderTasks();
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);

