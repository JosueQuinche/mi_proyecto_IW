/* ============================================================
   Script del informe de requisitos
   Proyecto: Dashboard de Nomina para NETTPLUS
   JavaScript puro, sin librerias
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. UTILIDADES
     ============================================================ */

  function altoBarra() {
    var barra = document.querySelector(".barra");
    return barra ? barra.offsetHeight + 10 : 0;
  }

  function guardar(clave, valor) {
    try {
      window.localStorage.setItem(clave, valor);
    } catch (e) {
      return;
    }
  }

  function leer(clave) {
    try {
      return window.localStorage.getItem(clave);
    } catch (e) {
      return null;
    }
  }

  function prefiereQuietud() {
    if (!window.matchMedia) {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ============================================================
     2. FONDO ANIMADO: RED DE FIBRA
     ============================================================ */

  function iniciarFondo() {
    var lienzo = document.getElementById("lienzo-fibra");

    if (!lienzo || !lienzo.getContext || prefiereQuietud()) {
      return;
    }

    var ctx = lienzo.getContext("2d");
    var puntos = [];
    var ancho = 0;
    var alto = 0;
    var DISTANCIA = 150;

    function dimensionar() {
      ancho = window.innerWidth;
      alto = window.innerHeight;
      lienzo.width = ancho;
      lienzo.height = alto;
      crearPuntos();
    }

    function crearPuntos() {
      /* Un punto cada 18000 pixeles cuadrados, entre 24 y 70 nodos */
      var total = Math.round((ancho * alto) / 18000);

      if (total < 24) {
        total = 24;
      }
      if (total > 70) {
        total = 70;
      }

      puntos = [];

      var i;
      for (i = 0; i < total; i = i + 1) {
        puntos.push({
          x: Math.random() * ancho,
          y: Math.random() * alto,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.5 + Math.random() * 2,
          verde: Math.random() > 0.45
        });
      }
    }

    function dibujar() {
      ctx.clearRect(0, 0, ancho, alto);

      var i;
      var j;
      var p;
      var q;
      var dx;
      var dy;
      var dist;
      var alfa;

      /* Lineas entre nodos cercanos */
      for (i = 0; i < puntos.length; i = i + 1) {
        for (j = i + 1; j < puntos.length; j = j + 1) {
          p = puntos[i];
          q = puntos[j];
          dx = p.x - q.x;
          dy = p.y - q.y;
          dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < DISTANCIA) {
            alfa = (1 - dist / DISTANCIA) * 0.22;
            ctx.strokeStyle = "rgba(63, 147, 221, " + alfa.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      /* Nodos */
      for (i = 0; i < puntos.length; i = i + 1) {
        p = puntos[i];

        if (p.verde) {
          ctx.fillStyle = "rgba(140, 198, 63, 0.55)";
        } else {
          ctx.fillStyle = "rgba(18, 82, 154, 0.40)";
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        /* Movimiento y rebote en los bordes */
        p.x = p.x + p.vx;
        p.y = p.y + p.vy;

        if (p.x < 0 || p.x > ancho) {
          p.vx = -p.vx;
        }
        if (p.y < 0 || p.y > alto) {
          p.vy = -p.vy;
        }
      }

      window.requestAnimationFrame(dibujar);
    }

    dimensionar();
    window.addEventListener("resize", dimensionar);
    window.requestAnimationFrame(dibujar);
  }

  /* ============================================================
     3. CONTADORES DE LA PORTADA
     ============================================================ */

  function contarRequisitos() {
    var celdas = document.querySelectorAll("tbody th");
    var totalRf = 0;
    var totalRnf = 0;
    var i;
    var texto;

    for (i = 0; i < celdas.length; i = i + 1) {
      texto = celdas[i].textContent.trim();

      if (/^RF\d+$/.test(texto)) {
        totalRf = totalRf + 1;
      } else if (/^RNF\d+$/.test(texto)) {
        totalRnf = totalRnf + 1;
      }
    }

    var cifraRf = document.getElementById("cifra-rf");
    var cifraRnf = document.getElementById("cifra-rnf");

    if (cifraRf) {
      cifraRf.textContent = String(totalRf);
    }
    if (cifraRnf) {
      cifraRnf.textContent = String(totalRnf);
    }
  }

  /* ============================================================
     4. BUSCADOR DE REQUISITOS
     ============================================================ */

  /* Construye una lista con todos los requisitos del documento.
     Solo se indexan las filas cuyo encabezado es un codigo RF o RNF. */

  function construirIndice() {
    var filas = document.querySelectorAll("tbody tr");
    var indice = [];
    var i;
    var fila;
    var encabezado;
    var codigo;
    var celdas;
    var titulo;

    for (i = 0; i < filas.length; i = i + 1) {
      fila = filas[i];
      encabezado = fila.querySelector("th");

      if (!encabezado) {
        continue;
      }

      codigo = encabezado.textContent.trim();

      if (!/^(RF|RNF)\d+$/.test(codigo)) {
        continue;
      }

      celdas = fila.querySelectorAll("td");
      titulo = celdas.length > 0 ? celdas[0].textContent.trim() : "";

      if (titulo.length > 90) {
        titulo = titulo.substring(0, 90) + "...";
      }

      indice.push({
        codigo: codigo,
        titulo: titulo,
        seccion: nombreSeccion(fila),
        texto: fila.textContent.toLowerCase(),
        fila: fila
      });
    }

    return indice;
  }

  /* Busca el titulo de la tabla a la que pertenece una fila */

  function nombreSeccion(fila) {
    var tabla = fila;

    while (tabla && tabla.tagName !== "TABLE") {
      tabla = tabla.parentNode;
    }

    if (!tabla) {
      return "";
    }

    var leyenda = tabla.querySelector("caption");

    return leyenda ? leyenda.textContent.trim() : "";
  }

  /* Lleva a la fila encontrada y la resalta unos segundos */

  function irAFila(fila) {
    var anteriores = document.querySelectorAll("tr.resaltada");
    var i;

    for (i = 0; i < anteriores.length; i = i + 1) {
      anteriores[i].classList.remove("resaltada");
    }

    var posicion =
      fila.getBoundingClientRect().top + window.pageYOffset - altoBarra() - 20;

    window.scrollTo({ top: posicion, behavior: "smooth" });
    fila.classList.add("resaltada");

    window.setTimeout(function () {
      fila.classList.remove("resaltada");
    }, 4000);
  }

  function iniciarBuscador() {
    var campo = document.getElementById("buscar");
    var lista = document.getElementById("resultados");
    var formulario = document.getElementById("form-buscar");

    if (!campo || !lista) {
      return;
    }

    var indice = construirIndice();

    if (formulario) {
      formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
      });
    }

    function cerrar() {
      lista.classList.remove("visible");
    }

    function pintar(encontrados, termino) {
      lista.innerHTML = "";

      if (encontrados.length === 0) {
        var vacio = document.createElement("li");
        vacio.className = "vacio";
        vacio.textContent = 'Ningun requisito contiene "' + termino + '"';
        lista.appendChild(vacio);
        lista.classList.add("visible");
        return;
      }

      var i;
      var elemento;
      var boton;
      var codigo;
      var seccion;
      var limite = encontrados.length > 10 ? 10 : encontrados.length;

      for (i = 0; i < limite; i = i + 1) {
        elemento = document.createElement("li");
        boton = document.createElement("button");
        boton.type = "button";

        codigo = document.createElement("span");
        codigo.className = "codigo";
        codigo.textContent = encontrados[i].codigo + "  ";

        seccion = document.createElement("span");
        seccion.className = "seccion";
        seccion.textContent = encontrados[i].seccion;

        boton.appendChild(codigo);
        boton.appendChild(document.createTextNode(encontrados[i].titulo));
        boton.appendChild(seccion);

        /* Se guarda la fila en el propio boton para no depender del indice */
        boton.filaDestino = encontrados[i].fila;

        boton.addEventListener("click", function () {
          irAFila(this.filaDestino);
          cerrar();
        });

        elemento.appendChild(boton);
        lista.appendChild(elemento);
      }

      if (encontrados.length > limite) {
        var resto = document.createElement("li");
        resto.className = "vacio";
        resto.textContent =
          "y " + (encontrados.length - limite) + " resultado(s) mas";
        lista.appendChild(resto);
      }

      lista.classList.add("visible");
    }

    campo.addEventListener("input", function () {
      var termino = campo.value.trim().toLowerCase();

      if (termino === "") {
        cerrar();
        return;
      }

      var encontrados = [];
      var i;

      for (i = 0; i < indice.length; i = i + 1) {
        if (indice[i].texto.indexOf(termino) !== -1) {
          encontrados.push(indice[i]);
        }
      }

      pintar(encontrados, campo.value.trim());
    });

    /* Enter lleva al primer resultado */
    campo.addEventListener("keydown", function (evento) {
      if (evento.key === "Enter") {
        evento.preventDefault();
        var primero = lista.querySelector("button");
        if (primero) {
          primero.click();
        }
      }
      if (evento.key === "Escape") {
        campo.value = "";
        cerrar();
      }
    });

    /* Se cierra al hacer clic fuera del buscador */
    document.addEventListener("click", function (evento) {
      if (formulario && !formulario.contains(evento.target)) {
        cerrar();
      }
    });
  }

  /* ============================================================
     5. CAMBIO DE TEMA
     ============================================================ */

  function iniciarTema() {
    var boton = document.getElementById("boton-tema");
    var raiz = document.documentElement;
    var guardado = leer("tema-informe");

    if (guardado === "oscuro") {
      raiz.setAttribute("data-tema", "oscuro");
    }

    if (!boton) {
      return;
    }

    function actualizarTexto() {
      if (raiz.getAttribute("data-tema") === "oscuro") {
        boton.textContent = "Tema claro";
      } else {
        boton.textContent = "Tema oscuro";
      }
    }

    actualizarTexto();

    boton.addEventListener("click", function () {
      if (raiz.getAttribute("data-tema") === "oscuro") {
        raiz.removeAttribute("data-tema");
        guardar("tema-informe", "claro");
      } else {
        raiz.setAttribute("data-tema", "oscuro");
        guardar("tema-informe", "oscuro");
      }
      actualizarTexto();
    });
  }

  /* ============================================================
     6. ENLACES INTERNOS CON COMPENSACION DE LA BARRA
     ============================================================ */

  function iniciarEnlacesInternos() {
    var enlaces = document.querySelectorAll('a[href^="#"]');
    var i;

    for (i = 0; i < enlaces.length; i = i + 1) {
      enlaces[i].addEventListener("click", function (evento) {
        var destino = this.getAttribute("href");

        if (destino === "#" || destino.length < 2) {
          return;
        }

        var elemento = document.getElementById(destino.substring(1));

        if (!elemento) {
          return;
        }

        evento.preventDefault();

        var posicion =
          elemento.getBoundingClientRect().top + window.pageYOffset - altoBarra();

        window.scrollTo({ top: posicion, behavior: "smooth" });
      });
    }
  }

  /* ============================================================
     7. SECCION ACTIVA EN EL INDICE
     ============================================================ */

  function iniciarIndiceActivo() {
    var enlaces = document.querySelectorAll(".indices a");

    if (enlaces.length === 0) {
      return;
    }

    function actualizar() {
      var limite = window.pageYOffset + altoBarra() + 40;
      var activo = null;
      var i;
      var destino;
      var elemento;

      for (i = 0; i < enlaces.length; i = i + 1) {
        destino = enlaces[i].getAttribute("href");

        if (!destino || destino.charAt(0) !== "#") {
          continue;
        }

        /* Los enlaces del indice de tablas y figuras no marcan seccion */
        if (destino.indexOf("#tabla") === 0 || destino.indexOf("#figura") === 0) {
          continue;
        }

        elemento = document.getElementById(destino.substring(1));

        if (elemento && elemento.offsetTop <= limite) {
          activo = enlaces[i];
        }
      }

      for (i = 0; i < enlaces.length; i = i + 1) {
        enlaces[i].classList.remove("activo");
      }

      if (activo) {
        activo.classList.add("activo");
      }

      marcarMenu(limite);
    }

    window.addEventListener("scroll", actualizar);
    actualizar();
  }

  /* Resalta en la barra la seccion que se esta leyendo */

  function marcarMenu(limite) {
    var enlacesMenu = document.querySelectorAll(".menu a");
    var activo = null;
    var i;
    var destino;
    var elemento;

    for (i = 0; i < enlacesMenu.length; i = i + 1) {
      enlacesMenu[i].classList.remove("activo-menu");
      destino = enlacesMenu[i].getAttribute("href");

      if (!destino || destino.charAt(0) !== "#") {
        continue;
      }

      elemento = document.getElementById(destino.substring(1));

      if (elemento && elemento.offsetTop <= limite) {
        activo = enlacesMenu[i];
      }
    }

    if (activo) {
      activo.classList.add("activo-menu");
    }
  }

  /* ============================================================
     8. BOTON VOLVER ARRIBA
     ============================================================ */

  function iniciarBotonArriba() {
    var boton = document.getElementById("boton-arriba");

    if (!boton) {
      return;
    }

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 500) {
        boton.classList.add("visible");
      } else {
        boton.classList.remove("visible");
      }
    });

    boton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================================
     9. ARRANQUE
     ============================================================ */

  document.addEventListener("DOMContentLoaded", function () {
    iniciarFondo();
    contarRequisitos();
    iniciarBuscador();
    iniciarTema();
    iniciarEnlacesInternos();
    iniciarIndiceActivo();
    iniciarBotonArriba();
  });
})();