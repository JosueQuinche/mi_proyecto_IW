// 1. Buscar elementos del DOM
const tarjeta = document.querySelector("#tarjeta");
const btnAzul = document.querySelector("#btnAzul");
const btnVerde = document.querySelector("#btnVerde");
const btnRojo = document.querySelector("#btnRojo");
const btnRestablecer = document.querySelector("#btnRestablecer");

// 2. Función que cambia el color de la tarjeta
function cambiarColor(color) {
    tarjeta.style.backgroundColor = color;
    tarjeta.style.color = "white"; // texto blanco para que se lea
}

// 3. Eventos de los botones de colores
//    (mismos colores que tienen los botones en el CSS)
btnAzul.addEventListener("click", () => {
    cambiarColor("#1a4fd6");
});

btnVerde.addEventListener("click", () => {
    cambiarColor("#1e9e4a");
});

btnRojo.addEventListener("click", () => {
    cambiarColor("#d32f2f");
});

// 4. Restablecer: quitar los estilos puestos con JS
btnRestablecer.addEventListener("click", () => {
    tarjeta.style.backgroundColor = ""; // vacío = vuelve al color del CSS
    tarjeta.style.color = "";
});