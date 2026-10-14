# Constelación Interactiva ✨

Página web interactiva hecha con **HTML, CSS y JavaScript puro** (sin librerías).
Muestra una constelación de partículas que se mueven, se conectan entre sí con líneas
y reaccionan al mouse, a los clics y al teclado.

## Funcionalidades

- **Partículas animadas** que rebotan en los bordes y parpadean.
- **Conexiones dinámicas**: las partículas cercanas se unen con líneas.
- **Interacción con el mouse**: modo *Atraer* o *Repeler*.
- **Clic = explosión**: onda expansiva que empuja las partículas y crea nuevas.
- **Panel de controles**: cantidad de partículas, velocidad y distancia de conexión.
- **4 paletas de colores**: Océano, Atardecer, Bosque y Neón.
- **Contador de FPS** en tiempo real.
- **Responsive**: funciona en celular con el dedo.

## Atajos de teclado

| Tecla      | Acción                    |
|------------|---------------------------|
| `Clic`     | Explosión                 |
| `Espacio`  | Pausar / reanudar         |
| `R`        | Reiniciar                 |
| `H`        | Mostrar / ocultar panel   |

## Estructura del proyecto

```
mi_proyecto_web/
├── index.html        # Estructura de la página
├── css/
│   └── estilos.css   # Estilos, animaciones y diseño responsive
├── js/
│   └── script.js     # Lógica de partículas e interacción
├── README.md
└── .gitignore
```

## Cómo ejecutarlo

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd mi_proyecto_web
   ```
2. Abre `index.html` en tu navegador (doble clic).
   También puedes usar la extensión **Live Server** de VS Code.

## Tecnologías

- HTML5 (`<canvas>`)
- CSS3 (variables, animaciones, `backdrop-filter`)
- JavaScript (clases, `requestAnimationFrame`, eventos)
