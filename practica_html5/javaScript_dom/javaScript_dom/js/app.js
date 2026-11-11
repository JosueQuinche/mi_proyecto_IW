"use strict";

// PASO 1. Variables: const para referencias que no se reasignan; let para contadores.
const nombreCurso = "Ingeniería Web";
let cantidadSaludos = 0;

// PASO 2. Funciones y eventos.
function construirSaludo(curso, veces) {
  return `¡Bienvenidos a ${curso}! Has presionado el botón ${veces} vez/veces.`;
}

const botonSaludo = document.querySelector("#btn-saludo");
const textoSaludo = document.querySelector("#saludo");

botonSaludo.addEventListener("click", () => {
  cantidadSaludos += 1;
  textoSaludo.textContent = construirSaludo(nombreCurso, cantidadSaludos);
});

// PASO 3. Arreglo de objetos: cada objeto representa un tema.
const temas = [
  { titulo: "Variables y funciones", detalle: "Guardar valores y reutilizar operaciones." },
  { titulo: "Arreglos y objetos", detalle: "Organizar información estructurada." },
  { titulo: "Eventos y DOM", detalle: "Responder al usuario y modificar la página." }
];

const contenedorTemas = document.querySelector("#lista-temas");
const contadorTemas = document.querySelector("#total-temas");

function mostrarTemas() {
  // Se crea HTML de forma segura usando createElement y textContent.
  contenedorTemas.replaceChildren();
  temas.forEach((tema) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tema";
    const titulo = document.createElement("h3");
    titulo.textContent = tema.titulo;
    const detalle = document.createElement("p");
    detalle.textContent = tema.detalle;
    tarjeta.append(titulo, detalle);
    contenedorTemas.append(tarjeta);
  });
  contadorTemas.textContent = String(temas.length);
}

mostrarTemas();

// PASO 4. Crear un tema y actualizar el DOM sin recargar.
const formularioTema = document.querySelector("#form-tema");
const campoTema = document.querySelector("#nuevo-tema");
const mensajeTema = document.querySelector("#tema-mensaje");

formularioTema.addEventListener("submit", (evento) => {
  evento.preventDefault(); // Evita la recarga habitual del formulario.
  const titulo = campoTema.value.trim();
  if (titulo.length < 3) {
    mensajeTema.textContent = "Escribe un tema de al menos 3 caracteres.";
    return;
  }
  temas.push({ titulo, detalle: "Tema agregado durante la práctica." });
  mostrarTemas();
  formularioTema.reset();
  mensajeTema.textContent = "Tema agregado correctamente.";
});

// PASO 5. Formulario: leer, validar y mostrar registros en pantalla.
const participantes = [];
const formularioRegistro = document.querySelector("#form-registro");
const listaParticipantes = document.querySelector("#lista-participantes");
const totalParticipantes = document.querySelector("#total-participantes");

function mostrarError(nombreCampo, mensaje) {
  const campo = document.querySelector(`#${nombreCampo}`);
  const error = document.querySelector(`#error-${nombreCampo}`);
  error.textContent = mensaje;
  campo.classList.toggle("invalido", Boolean(mensaje));
  campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
}

function correoValido(correo) {
  // Validación didáctica básica: no reemplaza la validación del servidor.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarRegistro(nombre, correo, rol) {
  let esValido = true;
  mostrarError("nombre", "");
  mostrarError("correo", "");
  mostrarError("rol", "");

  if (nombre.length < 3) {
    mostrarError("nombre", "Ingresa al menos 3 caracteres.");
    esValido = false;
  }
  if (!correoValido(correo)) {
    mostrarError("correo", "Ingresa un correo con formato válido.");
    esValido = false;
  }
  if (!rol) {
    mostrarError("rol", "Selecciona un rol.");
    esValido = false;
  }
  return esValido;
}

function mostrarParticipantes() {
  listaParticipantes.replaceChildren();
  totalParticipantes.textContent = String(participantes.length);
  if (participantes.length === 0) {
    const mensaje = document.createElement("li");
    mensaje.className = "vacio";
    mensaje.textContent = "Todavía no hay participantes.";
    listaParticipantes.append(mensaje);
    return;
  }
  participantes.forEach((persona) => {
    const elemento = document.createElement("li");
    const nombre = document.createElement("strong");
    nombre.textContent = persona.nombre;
    const detalle = document.createElement("span");
    detalle.textContent = `${persona.correo} · ${persona.rol}`;
    elemento.append(nombre, detalle);
    listaParticipantes.append(elemento);
  });
}

formularioRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nombre = document.querySelector("#nombre").value.trim();
  const correo = document.querySelector("#correo").value.trim();
  const rol = document.querySelector("#rol").value;
  if (!validarRegistro(nombre, correo, rol)) return;

  participantes.push({ nombre, correo, rol });
  mostrarParticipantes();
  formularioRegistro.reset();
  ["nombre", "correo", "rol"].forEach((campo) => mostrarError(campo, ""));
});

document.querySelector("#btn-limpiar").addEventListener("click", () => {
  participantes.length = 0;
  mostrarParticipantes();
});

// Los arreglos viven solo en la memoria del navegador: no hay base de datos.
