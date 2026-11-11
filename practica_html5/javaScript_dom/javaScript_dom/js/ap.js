// 1. Acceder a los elementos del DOM

const nombre = document.querySelector("#nombre");
const boton = document.querySelector("#botonSaludar");
const mensaje = document.querySelector("#mensaje");


// 2. Crear una función

function saludar() {

    // Obtener el valor ingresado
    const nombreUsuario = nombre.value.trim();

        // Actualizar el contenido del DOM
        mensaje.textContent =
            "¡Hola, " + nombreUsuario +
            "! Bienvenido a mi aplicación web.";

}

// 5. Escuchar el evento del botón

boton.addEventListener("click", saludar);