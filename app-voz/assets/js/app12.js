//la que va

// Seleccionamos el botón de alternancia y el icono
const toggleButton = document.getElementById('toggle-dark-mode');
const toggleIcon = document.getElementById('toggle-icon');
const body = document.body;

// Evento para alternar el modo oscuro
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode'); // Alterna la clase 'dark-mode'

    // Cambia el icono según el modo
    if (body.classList.contains('dark-mode')) {
        toggleIcon.classList.replace('bx-sun', 'bx-moon'); // Cambia a icono de luna
    } else {
        toggleIcon.classList.replace('bx-moon', 'bx-sun'); // Cambia a icono de sol
    }

    // Guardar la preferencia en localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
});

// Mantener la preferencia al recargar la página
window.addEventListener('DOMContentLoaded', () => {
    const darkModePreference = localStorage.getItem('dark-mode');
    if (darkModePreference === 'enabled') {
        body.classList.add('dark-mode');
        toggleIcon.classList.replace('bx-sun', 'bx-moon'); // Muestra el icono de luna en modo oscuro
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const startListeningButton = document.querySelector("#record");
    const tasksList = document.querySelector(".tasks"); // Elemento UL donde se agregan las tareas
    let tasks = [];
    let recognizing = false;

    recognition.continuous = true; // Para que la grabación no se detenga después de una pausa
    recognition.lang = "es"; // Idioma en español

    // Escuchar el click en el botón para iniciar/detener la grabación
    startListeningButton.addEventListener("click", toggleSpeechRecognition);

    // Función para alternar el estado de la grabación
    function toggleSpeechRecognition() {
        if (recognizing) {
            // Si está grabando, cambiar el icono y finalizar la grabación
            recognizing = false;
            startListeningButton.innerHTML = "<i class='bx bx-microphone'></i>";
            startListeningButton.classList.remove("recording");
            recognition.stop(); // Detener la grabación
        } else {
            // Si no está grabando, cambiar el icono y comenzar a grabar
            recognizing = true; // Actualiza el estado
            startListeningButton.innerHTML = "<i class='bx bx-loader bx-spin'></i>";
            startListeningButton.classList.add("recording"); // Agrega la clase "recording"
            recognition.start(); // Iniciar el reconocimiento de voz
        }
    };

    // Evento que se dispara cuando se detecta una frase
    recognition.onresult = (event) => {
        console.log(event);
        const taskText = event.results[event.results.length - 1][0].transcript;
        addTask(taskText); // Pasamos la transcripción a la función addTask
    };

    // Función para agregar una tarea
    function addTask(taskText) {
        const task = {
            id: crypto.randomUUID(), // Genera un ID único
            text: taskText.charAt(0).toUpperCase() + taskText.slice(1) + ".", // Capitaliza la primera letra
            done: false,
        };
        tasks.unshift(task); // Agrega la tarea al array

        // Llamamos a la función que actualiza la interfaz
        renderTask(task);
    }

    // Función para actualizar la lista de tareas en el DOM
    function renderTask(task) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task");
        taskItem.innerHTML = `
            <input type="checkbox" />
            <span>${task.text}</span>
            <button class="delete-task">
                <i class="bx bx-trash"></i>
            </button>
        `;
        tasksList.prepend(taskItem); // Agrega la tarea al principio de la lista visual

        // Aquí puedes agregar lógica para eliminar o marcar tareas como completadas
    }

    // Evento que se dispara cuando la grabación termina
    recognition.onend = () => {
        if (recognizing) {
            recognition.start(); // Reiniciar la grabación automáticamente si se detiene
        }
    };

    // Evento en caso de error
    recognition.onerror = (event) => {
        console.error("Error en el reconocimiento: ", event.error);
    };
});
