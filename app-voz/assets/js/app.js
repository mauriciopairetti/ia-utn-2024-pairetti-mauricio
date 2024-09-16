//la que no va

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
    const tasksList = document.querySelector(".tasks");
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
            recognizing = true;// actuLIZA EL ESTADO
            startListeningButton.innerHTML = "<i class='bx bx-loader bx-spin'></i>";
            startListeningButton.classList.add("recording");// agraga la clase recording
            recognition.start(); // Iniciar la grabación reconocieminto voz

        }
    };

    // Evento que se dispara cuando se detecta una frase (puedes agregar lógica aquí para manejar el reconocimiento de voz)
    // Evento que se dispara cuando se detecta una frase
    recognition.onresult = (event) => {
        console.log(event);
        const taskText = event.results[event.results.length - 1][0].transcript;
        addTask(taskText); // Pasamos la transcripción a la función addTask
        // Lógica para agregar tareas o manejar la transcripción
    };
    // Función para agregar una tarea
    function addTask(taskText) {
        const task = {
            id: crypto.randomUUID(), // Genera un ID único
            text: taskText.charAt(0).toUpperCase() + taskText.slice(1) + ".", // Capitaliza la primera letra
            done: false,
        };


        tasks.unshift(task); // Agrega la tarea al array
        saveTasksToLocalStorage();
        console.log(task);



    }
    // Función para guardar las tareas en localStorage
    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();


    }


    // Función para renderizar todas las tareas guardadas en localStorage
    function renderTasks() {
        const storedTasks = localStorage.getItem("tasks"); // Recuperar el array de tareas de localStorage
        if (storedTasks) {
            const tasks = JSON.parse(storedTasks); // Convertir el string de localStorage a un array de objetos

            // Limpiar la lista de tareas antes de renderizar
            tasksList.innerHTML = "";

            // Iterar sobre cada tarea y renderizarla en el DOM
            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.classList.add("task");

                // Estructura HTML de la tarea
                taskItem.innerHTML = `




                
                <input type="checkbox" ${task.done ? "checked" : ""} />
                <span class ="${task.done ? "task-done" : ""}">${task.text}</span>
                 
                
                <button class="delete-task">
                    <i class='bx bx-user-voice'></i>
                </button>
                <button class="delete-task">
                    <i class='bx bxl-whatsapp'></i>
                </button>
                <button class="delete-task">
                    <i class='bx bx-envelope'></i>
                </button>
                <button class="delete-task">
                    <i class="bx bx-trash"></i>
                </button>
                

                 
             `;
                // Añadir evento para cambiar el estado de completada
                const checkbox = taskItem.querySelector("input[type='checkbox']");
                checkbox.addEventListener("change", () => {

                    toggleTaskDone(task.id, checkbox.checked);
                });
                // Añadir evento para eliminar la tarea
                taskItem.querySelector(".bx-trash").addEventListener("click", () => {
                    if (checkbox.checked) {
                        deleteTask(task.id);
                    } else {
                        alert("Debes marcar la tarea como completada antes de eliminarla.");
                    }
                });
                // Añadir evento para leer la tarea en voz alta
                taskItem.querySelector(".bx-user-voice").addEventListener("click", () => {
                    leerTarea(task.text); // Llama a la función leerTarea con el texto de la tarea
                });
                taskItem.querySelector(".bxl-whatsapp").addEventListener("click", () => {
                    if (checkbox.checked) {
                        shareTaskWhatsApp(task.text);
                    } else {
                        alert("Debes marcar la tarea como completada antes de compartirla por WhatsApp.");
                    }
                });

                taskItem.querySelector(".bx-envelope").addEventListener("click", () => {
                    if (checkbox.checked) {
                        shareTaskEmail(task.text);
                    } else {
                        alert("Debes marcar la tarea como completada antes de compartirla por correo.");
                    }
                });
                
                //tasksList.prepend(taskItem);
                tasksList.appendChild(taskItem);

            });
        }


        function toggleTaskDone(taskId, isChecked) {
            const task = tasks.find(task => task.id === taskId);
            if (task) {
                task.done = isChecked; // Cambia el estado de "done"

                saveTasksToLocalStorage();
                renderTasks();
            }
        }

        // Función para eliminar una tarea
        function deleteTask(taskId) {

            // Filtrar las tareas, eliminando la que coincida con el id proporcionado
            tasks = tasks.filter((task) => task.id !== taskId);

            // Guardar las tareas actualizadas en localStorage
            saveTasksToLocalStorage();

            // Renderizar nuevamente la lista de tareas en el DOM
            renderTasks();

        }
        //renderTasks();
        // Función para leer una tarea en voz alta
        function leerTarea(taskText) {
            const utterance = new SpeechSynthesisUtterance(taskText);
            utterance.lang = 'es-ES'; // Establecer el idioma a español
            window.speechSynthesis.speak(utterance);
        }
        // Función para compartir la tarea por WhatsApp
        function shareTaskWhatsApp(taskText) {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(taskText)}`;
            window.open(whatsappUrl, '_blank');
        }

        // Función para compartir la tarea por correo electrónico
        function shareTaskEmail(taskText) {
            const emailSubject = "Tarea compartida";
            const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(taskText)}`;
            window.open(mailtoUrl, '_blank');
        }


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
    }
});
