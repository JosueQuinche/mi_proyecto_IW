/* =========================================
   Constelación Interactiva - script.js
   Partículas que se mueven, se conectan entre sí
   y reaccionan al mouse, al clic y al teclado.
   ========================================= */

// ---------- Referencias al DOM ----------
const lienzo = document.getElementById("lienzo");
const ctx = lienzo.getContext("2d");

const inputCantidad = document.getElementById("cantidad");
const inputVelocidad = document.getElementById("velocidad");
const inputDistancia = document.getElementById("distancia");

const valorCantidad = document.getElementById("valorCantidad");
const valorVelocidad = document.getElementById("valorVelocidad");
const valorDistancia = document.getElementById("valorDistancia");

const botonPausar = document.getElementById("pausar");
const botonReiniciar = document.getElementById("reiniciar");
const panel = document.getElementById("panel");
const panelToggle = document.getElementById("panelToggle");

const textoFps = document.getElementById("fps");
const textoTotal = document.getElementById("total");

// ---------- Paletas de colores ----------
const PALETAS = {
  oceano: ["#38bdf8", "#818cf8", "#7dd3fc", "#a5b4fc"],
  atardecer: ["#f97316", "#f43f5e", "#fb923c", "#fda4af"],
  bosque: ["#4ade80", "#2dd4bf", "#86efac", "#5eead4"],
  neon: ["#e879f9", "#22d3ee", "#f0abfc", "#67e8f9"],
};

// ---------- Estado de la aplicación ----------
const estado = {
  cantidad: Number(inputCantidad.value),
  velocidad: Number(inputVelocidad.value),
  distancia: Number(inputDistancia.value),
  modo: "atraer", // "atraer" | "repeler"
  paleta: "oceano",
  pausado: false,
};

const mouse = { x: null, y: null, radio: 160 };

let particulas = [];
let ondas = []; // ondas expansivas que deja cada clic
let ancho = 0;
let alto = 0;
const dpr = Math.min(window.devicePixelRatio || 1, 2);

// ---------- Utilidades ----------
const aleatorio = (min, max) => Math.random() * (max - min) + min;
const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];

// Convierte "#rrggbb" a "rgba(r,g,b,a)"
function hexARgba(hex, alfa) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
}

// ---------- Clase Partícula ----------
class Particula {
  constructor(x, y) {
    this.x = x ?? aleatorio(0, ancho);
    this.y = y ?? aleatorio(0, alto);
    const angulo = aleatorio(0, Math.PI * 2);
    const rapidez = aleatorio(0.2, 0.8);
    this.vx = Math.cos(angulo) * rapidez;
    this.vy = Math.sin(angulo) * rapidez;
    this.radio = aleatorio(1.5, 3.5);
    this.color = elegir(PALETAS[estado.paleta]);
    this.fase = aleatorio(0, Math.PI * 2); // para el parpadeo
  }

  actualizar() {
    // Interacción con el mouse
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radio && dist > 1) {
        const fuerza = (1 - dist / mouse.radio) * 0.35;
        const sentido = estado.modo === "atraer" ? 1 : -1;
        this.vx += (dx / dist) * fuerza * sentido;
        this.vy += (dy / dist) * fuerza * sentido;
      }
    }

    // Fricción suave para que no se aceleren sin control
    this.vx *= 0.985;
    this.vy *= 0.985;

    // Velocidad mínima para que nunca se queden quietas
    const rapidez = Math.hypot(this.vx, this.vy);
    if (rapidez < 0.15) {
      this.vx += aleatorio(-0.05, 0.05);
      this.vy += aleatorio(-0.05, 0.05);
    }

    this.x += this.vx * estado.velocidad;
    this.y += this.vy * estado.velocidad;

    // Rebote en los bordes
    if (this.x < 0) { this.x = 0; this.vx *= -1; }
    if (this.x > ancho) { this.x = ancho; this.vx *= -1; }
    if (this.y < 0) { this.y = 0; this.vy *= -1; }
    if (this.y > alto) { this.y = alto; this.vy *= -1; }

    this.fase += 0.04;
  }

  dibujar() {
    const brillo = 0.65 + Math.sin(this.fase) * 0.35;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
    ctx.fillStyle = hexARgba(this.color, brillo);
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ---------- Onda expansiva (efecto del clic) ----------
class Onda {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radio = 0;
    this.vida = 1;
    this.color = elegir(PALETAS[estado.paleta]);
  }

  actualizar() {
    this.radio += 6;
    this.vida -= 0.025;
  }

  dibujar() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
    ctx.strokeStyle = hexARgba(this.color, Math.max(this.vida, 0) * 0.6);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// ---------- Configuración del lienzo ----------
function ajustarLienzo() {
  ancho = window.innerWidth;
  alto = window.innerHeight;
  lienzo.width = ancho * dpr;
  lienzo.height = alto * dpr;
  lienzo.style.width = ancho + "px";
  lienzo.style.height = alto + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function crearParticulas() {
  particulas = Array.from({ length: estado.cantidad }, () => new Particula());
  textoTotal.textContent = particulas.length;
}

// Ajusta la cantidad sin reiniciar todo (agrega o quita)
function ajustarCantidad(nueva) {
  while (particulas.length < nueva) particulas.push(new Particula());
  if (particulas.length > nueva) particulas.length = nueva;
  textoTotal.textContent = particulas.length;
}

// ---------- Dibujo de conexiones ----------
function dibujarConexiones() {
  const max = estado.distancia;
  const max2 = max * max;

  for (let i = 0; i < particulas.length; i++) {
    const a = particulas[i];

    for (let j = i + 1; j < particulas.length; j++) {
      const b = particulas[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;

      if (d2 < max2) {
        const opacidad = 1 - Math.sqrt(d2) / max;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hexARgba(a.color, opacidad * 0.35);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Línea hacia el mouse
    if (mouse.x !== null) {
      const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dist < mouse.radio) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = hexARgba(a.color, (1 - dist / mouse.radio) * 0.5);
        ctx.stroke();
      }
    }
  }
}

// ---------- Explosión al hacer clic ----------
function explosion(x, y) {
  ondas.push(new Onda(x, y));

  // Empuja las partículas cercanas hacia afuera
  for (const p of particulas) {
    const dx = p.x - x;
    const dy = p.y - y;
    const dist = Math.hypot(dx, dy);
    if (dist < 250 && dist > 0) {
      const fuerza = (1 - dist / 250) * 8;
      p.vx += (dx / dist) * fuerza;
      p.vy += (dy / dist) * fuerza;
    }
  }

  // Y crea unas cuantas partículas nuevas en el punto del clic
  for (let i = 0; i < 6; i++) {
    const nueva = new Particula(x, y);
    nueva.vx *= 6;
    nueva.vy *= 6;
    particulas.push(nueva);
  }

  // Quita las más viejas para no pasarse del límite elegido
  if (particulas.length > estado.cantidad) {
    particulas.splice(0, particulas.length - estado.cantidad);
  }
}

// ---------- Bucle de animación ----------
let ultimoTiempo = performance.now();
let cuadros = 0;
let acumulado = 0;

function animar(ahora) {
  // Contador de FPS (se actualiza cada medio segundo)
  const delta = ahora - ultimoTiempo;
  ultimoTiempo = ahora;
  cuadros++;
  acumulado += delta;
  if (acumulado >= 500) {
    textoFps.textContent = Math.round((cuadros * 1000) / acumulado);
    cuadros = 0;
    acumulado = 0;
  }

  if (!estado.pausado) {
    // Fondo con un poco de transparencia → deja una estela suave
    ctx.fillStyle = "rgba(6, 9, 24, 0.28)";
    ctx.fillRect(0, 0, ancho, alto);

    for (const p of particulas) p.actualizar();
    dibujarConexiones();
    for (const p of particulas) p.dibujar();

    for (const o of ondas) {
      o.actualizar();
      o.dibujar();
    }
    ondas = ondas.filter((o) => o.vida > 0);
  }

  requestAnimationFrame(animar);
}

// ---------- Acciones ----------
function alternarPausa() {
  estado.pausado = !estado.pausado;
  botonPausar.textContent = estado.pausado ? "Reanudar" : "Pausar";
}

function reiniciar() {
  ctx.fillStyle = "#060918";
  ctx.fillRect(0, 0, ancho, alto);
  ondas = [];
  crearParticulas();
}

function cambiarPaleta(nombre) {
  estado.paleta = nombre;
  const colores = PALETAS[nombre];

  // Recolorea las partículas existentes
  for (const p of particulas) p.color = elegir(colores);

  // Actualiza los colores de acento del panel
  document.documentElement.style.setProperty("--acento", colores[0]);
  document.documentElement.style.setProperty("--acento-2", colores[1]);

  document.querySelectorAll(".paleta").forEach((b) => {
    b.classList.toggle("activo", b.dataset.paleta === nombre);
  });
}

function cambiarModo(modo) {
  estado.modo = modo;
  document.querySelectorAll(".boton-modo").forEach((b) => {
    b.classList.toggle("activo", b.dataset.modo === modo);
  });
}

// ---------- Eventos ----------
window.addEventListener("resize", ajustarLienzo);

// Mouse
lienzo.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
lienzo.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});
lienzo.addEventListener("click", (e) => explosion(e.clientX, e.clientY));

// Pantallas táctiles (celular)
lienzo.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  mouse.x = t.clientX;
  mouse.y = t.clientY;
}, { passive: true });
lienzo.addEventListener("touchend", () => {
  mouse.x = null;
  mouse.y = null;
});

// Sliders
inputCantidad.addEventListener("input", () => {
  estado.cantidad = Number(inputCantidad.value);
  valorCantidad.textContent = estado.cantidad;
  ajustarCantidad(estado.cantidad);
});

inputVelocidad.addEventListener("input", () => {
  estado.velocidad = Number(inputVelocidad.value);
  valorVelocidad.textContent = estado.velocidad.toFixed(1);
});

inputDistancia.addEventListener("input", () => {
  estado.distancia = Number(inputDistancia.value);
  valorDistancia.textContent = estado.distancia;
});

// Botones
document.querySelectorAll(".boton-modo").forEach((b) => {
  b.addEventListener("click", () => cambiarModo(b.dataset.modo));
});

document.querySelectorAll(".paleta").forEach((b) => {
  b.addEventListener("click", () => cambiarPaleta(b.dataset.paleta));
});

botonPausar.addEventListener("click", alternarPausa);
botonReiniciar.addEventListener("click", reiniciar);
panelToggle.addEventListener("click", () => panel.classList.toggle("oculto"));

// Teclado
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  const tecla = e.key.toLowerCase();

  if (e.code === "Space") {
    e.preventDefault();
    alternarPausa();
  } else if (tecla === "r") {
    reiniciar();
  } else if (tecla === "h") {
    panel.classList.toggle("oculto");
  }
});

// ---------- Inicio ----------
ajustarLienzo();
crearParticulas();
requestAnimationFrame(animar);
