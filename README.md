# ESTUDIANTE:
 1.- Josue Quinche
# Práctica de HTML5 — Maquetado semántico

Dos páginas construidas únicamente con etiquetas HTML5.

## Archivos

```
practica_html5/
├── periodico/index.html            # Portada de periódico
└── informe_requisitos/index.html   # Informe de requisitos
```

## Etiquetas utilizadas

**Estructura**
`header` · `nav` · `main` · `section` · `article` · `aside` · `footer`

**Contenido**
`h1` a `h4` · `p` · `ul` · `ol` · `li` · `dl` · `dt` · `dd` · `a` · `img` · `figure` · `figcaption` · `time` · `hr` · `strong` · `em` · `small` · `cite` · `address`

**Tablas**
`table` · `caption` · `thead` · `tbody` · `tfoot` · `tr` · `th` · `td`

**Formularios**
`form` · `fieldset` · `legend` · `label` · `input` · `select` · `option` · `button`

## Puntos clave

- `li` va siempre dentro de `ul` o `ol`.
- Una lista anidada va **dentro** del `li` padre.
- `caption` es el primer hijo de `table`.
- `th scope="col"` para encabezado de columna, `scope="row"` para el de fila.
- `label for="x"` debe coincidir con el `id` del campo.
- `img` siempre lleva `alt`.
- `time` lleva `datetime` con la fecha en formato `AAAA-MM-DD`.
- `href="#id"` enlaza a un elemento de la misma página.
- `href="pagina.html"` es un enlace relativo; los externos necesitan `https://`.