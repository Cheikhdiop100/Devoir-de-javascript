class TodoList {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskInput = document.getElementById('task-input');
        this.taskList = document.getElementById('task-list');
        this.totalTasksSpan = document.getElementById('total-tasks');
        this.completedTasksSpan = document.getElementById('completed-tasks');
        this.clearAllBtn = document.getElementById('clear-all');

        this.initializeEventListeners();
        this.renderTasks();
        this.updateStats();  
    }

    
    initializeEventListeners() {
        document.getElementById('add-task').addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());
    }

    // Ajouter une nouvelle tâche
    addTask() {
        const taskText = this.taskInput.value.trim();
        if (!taskText) return; // Ne rien faire si l'entrée est vide

        const task = { id: Date.now(), text: taskText, completed: false };
        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task);
        this.taskInput.value = ''; // Réinitialise le champ d'entrée
        this.updateStats();
    }

    
    renderTask(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="delete-btn">Supprimer</button>
        `;

        li.style.opacity = 0;
        setTimeout(() => {
            li.style.opacity = 1;
            li.style.transition = 'opacity 0.5s ease-in-out';
        }, 50);

        li.querySelector('.task-text').addEventListener('click', () => this.toggleTaskCompletion(task, li));


        li.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id, li));

        this.taskList.appendChild(li);
    }

    
    toggleTaskCompletion(task, li) {
        task.completed = !task.completed;
        li.querySelector('.task-text').classList.toggle('completed');
        this.saveTasks();
        this.updateStats();
    }

    deleteTask(taskId, li) {
        // Animation de disparition
        li.style.opacity = 0;
        li.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            li.remove();
            this.saveTasks();
            this.updateStats();
        }, 500); // Attends la fin de l'animation
    }

    // Afficher toutes les tâches
    renderTasks() {
        this.taskList.innerHTML = ''; // Réinitialise la liste
        this.tasks.forEach(task => this.renderTask(task));
    }

    
    clearAllTasks() {
        this.tasks = [];
        this.saveTasks();
        this.updateStats();


        Array.from(this.taskList.children).forEach((li, index) => {
            setTimeout(() => {
                li.style.opacity = 0;
                li.style.transition = 'opacity 0.5s ease-in-out';
                li.remove();
            }, index * 100); 
        });
    }

    
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;

        this.totalTasksSpan.textContent = totalTasks;
        this.completedTasksSpan.textContent = completedTasks;
    }

    
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});
