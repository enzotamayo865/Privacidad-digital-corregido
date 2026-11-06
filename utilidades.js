/*
  Funciones de ayuda: crear elementos, dar formato a los textos e íconos.
*/

const SVG_NS = "http://www.w3.org/2000/svg";

// Atajo para buscar un elemento de la página
const $ = (selector) => document.querySelector(selector);

// Crea un elemento HTML con sus atributos y su contenido.
// Ejemplo: crear("p", { class: "texto" }, "Hola")
function crear(etiqueta, atributos, ...hijos) {
  const elemento = document.createElement(etiqueta);
  if (atributos) {
    for (const [nombre, valor] of Object.entries(atributos)) {
      if (valor == null || valor === false) continue;
      if (nombre === "class") elemento.className = valor;
      else elemento.setAttribute(nombre, valor === true ? "" : valor);
    }
  }
  for (const hijo of hijos.flat()) {
    if (hijo == null || hijo === false) continue;
    elemento.append(hijo instanceof Node ? hijo : String(hijo));
  }
  return elemento;
}

// Lo mismo, pero para las partes de un dibujo SVG
function crearSvg(etiqueta, atributos) {
  const elemento = document.createElementNS(SVG_NS, etiqueta);
  if (atributos) {
    for (const [nombre, valor] of Object.entries(atributos)) {
      if (valor != null) elemento.setAttribute(nombre, valor);
    }
  }
  return elemento;
}

// Convierte las marcas de los textos (ver preguntas.js) en elementos.
// Con { glosario: false } las palabras del glosario quedan como texto común
// (se usa dentro de los botones de las opciones).
function textoConFormato(texto, opciones) {
  const conGlosario = !(opciones && opciones.glosario === false);
  const fragmento = document.createDocumentFragment();
  const partes = String(texto).split(/(\[\[.+?\]\]|`[^`]+`|\{\{.+?\}\}|<<.+?>>)/);

  for (const parte of partes) {
    if (!parte) continue;

    if (parte.startsWith("[[")) {
      // Ruta de menú: [[Ajustes > Cuenta]]
      // (después de cada "›" puede cortarse la línea, para que entre en el celular)
      const ruta = crear("span", { class: "ruta-config" });
      parte.slice(2, -2).split(" > ").forEach((paso, i) => {
        if (i > 0) ruta.append(crear("span", { class: "sep", "aria-hidden": "true" }, "›"), crear("wbr"));
        ruta.append(paso);
      });
      fragmento.append(ruta);
    } else if (parte.startsWith("`")) {
      fragmento.append(crear("code", null, parte.slice(1, -1)));
    } else if (parte.startsWith("{{")) {
      fragmento.append(crear("span", { class: "enlace-falso" }, parte.slice(2, -2)));
    } else if (parte.startsWith("<<")) {
      // Palabra del glosario: <<palabra>> o <<palabra|clave>>
      const [visible, clave] = parte.slice(2, -2).split("|");
      const claveGlosario = (clave || visible).toLowerCase();
      if (conGlosario && GLOSARIO[claveGlosario]) {
        fragmento.append(crear("button", {
          type: "button",
          class: "glosa",
          "data-glosa": claveGlosario,
          "aria-expanded": "false",
          "aria-haspopup": "dialog",
        }, visible));
      } else {
        fragmento.append(visible);
      }
    } else {
      fragmento.append(parte);
    }
  }
  return fragmento;
}

// El mismo texto pero sin marcas
function textoPlano(texto) {
  return String(texto)
    .replace(/\[\[(.+?)\]\]/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\{\{(.+?)\}\}/g, "[$1]")
    .replace(/<<(.+?)>>/g, (_, contenido) => contenido.split("|")[0]);
}

// La pregunta completa en una sola línea (para la lista de repaso)
function resumenPregunta(p) {
  const partes = [p.contexto, p.mensaje ? "“" + p.mensaje + "”" : null, p.texto];
  return partes.filter(Boolean).map(textoPlano).join(" ");
}

// Ícono de respuesta correcta ("bien"), incorrecta ("mal") o "no sé"
function icono(tipo, medida) {
  const svg = crearSvg("svg", { class: "ico", viewBox: "-8 -8 16 16", width: medida, height: medida, "aria-hidden": "true", focusable: "false" });
  if (tipo === "bien") {
    svg.append(crearSvg("path", { d: "M-5 0.3 L-1.5 3.8 L5.2 -3.4" }));
  } else if (tipo === "mal") {
    svg.append(crearSvg("path", { d: "M-4 -4 L4 4 M4 -4 L-4 4" }));
  } else {
    const signo = crearSvg("text", { x: "0", y: "0.5", "text-anchor": "middle", "dominant-baseline": "central" });
    signo.textContent = "?";
    svg.append(signo);
  }
  return svg;
}

// Flechita de los botones
function flecha() {
  const svg = crearSvg("svg", { viewBox: "0 0 16 16", width: "18", height: "18", "aria-hidden": "true", focusable: "false" });
  svg.append(crearSvg("path", {
    d: "M3 8 H12.5 M8.5 4 L12.5 8 L8.5 12",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  }));
  return svg;
}

// La mascota como imagen (candado.svg, al lado de index.html)
function imagenMascota(ancho) {
  return crear("img", {
    class: "mascota-img",
    src: "candado.svg",
    alt: "",
    width: ancho,
    height: Math.round(ancho * 37 / 30),
  });
}

// Un celular dibujado (ver escenas.js) con su texto de abajo
function figuraEscena(html, pie) {
  const figura = crear("figure", { class: "escena", "aria-hidden": "true" });
  figura.innerHTML = html;
  if (pie) figura.append(crear("figcaption", null, pie));
  return figura;
}
