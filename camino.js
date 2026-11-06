/*
  El camino: el mapa en forma de ruta, con una parada por pregunta,
  y la tira de progreso que se ve arriba en el celular.
  Se dibuja con SVG al ancho real de la pantalla.
*/

// La mascota (un candado con cara) dibujada en SVG para usar dentro del mapa
function mascotaSvg(escala, saltar) {
  const grupo = crearSvg("g", { class: saltar ? "salta" : null });
  const cuerpo = crearSvg("g", { class: "mascota", transform: escala && escala !== 1 ? `scale(${escala})` : null });
  cuerpo.append(
    crearSvg("path", { class: "masc-arco", d: "M -7.5 -3 V -8.5 A 7.5 7.5 0 0 1 7.5 -8.5 V -3" }),
    crearSvg("rect", { class: "masc-cuerpo", x: "-12.5", y: "-4", width: "25", height: "19", rx: "6" }),
    crearSvg("circle", { class: "masc-ojo", cx: "-4.6", cy: "3.8", r: "2" }),
    crearSvg("circle", { class: "masc-ojo", cx: "4.6", cy: "3.8", r: "2" }),
    crearSvg("path", { class: "masc-boca", d: "M -3.6 8.8 Q 0 11.8 3.6 8.8" })
  );
  grupo.append(cuerpo);
  return grupo;
}

// Lo que va adentro de cada parada: el número, la mascota o el resultado
function contenidoParada(clave, i) {
  if (clave === "actual") return mascotaSvg(1, true);
  if (clave === "bien") return crearSvg("path", { class: "icono", d: "M-5.2 0.4 L-1.6 4 L5.4 -3.6" });
  if (clave === "mal") return crearSvg("path", { class: "icono", d: "M-4.2 -4.2 L4.2 4.2 M4.2 -4.2 L-4.2 4.2" });
  const texto = crearSvg("text", { class: clave === "nose" ? "icono-txt" : "num", "text-anchor": "middle", "dominant-baseline": "central", y: "0.5" });
  texto.textContent = clave === "nose" ? "?" : String(i + 1);
  return texto;
}

/*
  Crea el mapa del camino adentro de "lienzo".
  "datos" es una función que devuelve { orden, tramos, indice, tipo, pos, vista }.
  "alTocar" se llama con el número de parada cuando alguien toca una (puede ser null).
  Devuelve { actualizar, destruir }.
*/
function crearMapa(lienzo, datos, alTocar) {
  let dibujo = null;
  let anchoDibujado = 0;

  function dibujar() {
    const W = Math.round(lienzo.clientWidth);
    if (!W) return; // está oculto: se dibuja cuando aparezca
    anchoDibujado = W;

    const d = datos();
    const N = d.orden.length;
    const filas = d.tramos.length;
    const muchasFilas = filas > 5; // el camino completo tiene 9 filas: se juntan un poco
    const xInicio = 12;
    const margen = 46;          // espacio a los costados para las curvas
    const altoFila = muchasFilas ? 54 : 70; // distancia entre una fila y la siguiente
    const radio = altoFila / 2;
    const arriba = 46;
    const abajo = 30;
    const H = arriba + (filas - 1) * altoFila + abajo;
    const largoFila = W - 2 * margen;

    const svg = crearSvg("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "group", "aria-label": `Camino de ${N} paradas` });
    const puntos = new Array(N);
    const etiquetas = [];
    let camino = "";
    let largo = margen - xInicio; // largo del camino hasta cada punto
    let xMeta = xInicio;
    let yMeta = arriba;

    // Cada sección es una fila: las pares van a la derecha y las impares a la izquierda
    d.tramos.forEach((tramo, fila) => {
      const y = arriba + fila * altoFila;
      const haciaDerecha = fila % 2 === 0;
      const n = tramo.items.length;
      if (fila === 0) camino += `M ${xInicio} ${y} `;

      tramo.items.forEach((p, k) => {
        const f = n <= 3 ? (k + 1) / (n + 1) : k / (n - 1);
        const x = haciaDerecha ? margen + f * largoFila : W - margen - f * largoFila;
        puntos[d.indice.get(p.n)] = { x, y, distancia: largo + f * largoFila };
      });

      const xFin = haciaDerecha ? W - margen : margen;
      camino += `H ${xFin} `;
      largo += largoFila;

      if (fila < filas - 1) {
        // Curva en U para bajar a la fila siguiente
        camino += `A ${radio} ${radio} 0 0 ${haciaDerecha ? 1 : 0} ${xFin} ${y + altoFila} `;
        largo += Math.PI * radio;
      } else {
        xMeta = haciaDerecha ? W - xInicio : xInicio;
        yMeta = y;
        camino += `H ${xMeta}`;
        largo += margen - xInicio;
      }

      const etiqueta = crearSvg("text", {
        class: "tramo",
        x: haciaDerecha ? margen - 6 : W - margen + 6,
        y: y - (muchasFilas ? 26 : 29),
        "text-anchor": haciaDerecha ? "start" : "end",
      });
      etiqueta.textContent = tramo.nombre.toUpperCase();
      etiquetas.push(etiqueta);
    });
    const largoTotal = largo;

    // La ruta: asfalto, líneas blancas y la parte ya recorrida en amarillo
    svg.append(crearSvg("path", { class: "asfalto", d: camino }));
    svg.append(crearSvg("path", { class: "pintura", d: camino }));
    const recorrida = crearSvg("path", { class: "recorrida", d: camino, pathLength: largoTotal.toFixed(2) });
    recorrida.style.strokeDasharray = `${largoTotal} ${largoTotal}`;
    svg.append(recorrida);

    // Línea de salida y bandera a cuadros de llegada
    svg.append(crearSvg("rect", { class: "linea-salida", x: xInicio + 1, y: arriba - 7, width: 3, height: 14 }));
    const xCuadros = xMeta < W / 2 ? xMeta - 4 : xMeta - 3;
    for (let f = 0; f < 4; f++) {
      for (let c = 0; c < 2; c++) {
        if ((f + c) % 2 === 0) {
          svg.append(crearSvg("rect", { class: "cuadro-meta", x: xCuadros + c * 3.5, y: yMeta - 7 + f * 3.5, width: 3.5, height: 3.5 }));
        }
      }
    }
    etiquetas.forEach((etiqueta) => svg.append(etiqueta));

    // Las paradas
    const paradas = puntos.map((punto, i) => {
      const grupo = crearSvg("g", { class: "parada", transform: `translate(${punto.x.toFixed(1)} ${punto.y})`, "data-i": i });
      grupo.append(crearSvg("circle", { class: "hit", r: 22 }));
      grupo.append(crearSvg("circle", { class: "pulso", r: 14 }));
      const cuerpo = crearSvg("g", { class: "cuerpo" });
      cuerpo.append(crearSvg("circle", { class: "aro", r: 14 }));
      const contenido = crearSvg("g", { class: "contenido" });
      cuerpo.append(contenido);
      grupo.append(cuerpo);
      grupo.append(crearSvg("circle", { class: "marco", r: 22 }));
      svg.append(grupo);
      return { grupo, contenido, clave: null, distancia: punto.distancia };
    });

    if (alTocar) {
      svg.addEventListener("click", (evento) => {
        const parada = evento.target.closest(".parada.es-pulsable");
        if (parada) alTocar(Number(parada.dataset.i));
      });
      svg.addEventListener("keydown", (evento) => {
        if (evento.key !== "Enter" && evento.key !== " ") return;
        const parada = evento.target.closest(".parada.es-pulsable");
        if (!parada) return;
        evento.preventDefault();
        alTocar(Number(parada.dataset.i));
      });
    }

    lienzo.replaceChildren(svg);
    dibujo = { paradas, recorrida, largoTotal };
  }

  // Pinta cada parada según la respuesta y avanza la parte amarilla
  function actualizar() {
    if (!dibujo) return;
    const d = datos();
    const N = d.orden.length;
    const terminado = d.pos >= N;

    dibujo.paradas.forEach((parada, i) => {
      const tipo = d.tipo(d.orden[i]);
      const aqui = i === d.pos;
      const sePuedeTocar = !!alTocar && i <= d.pos;
      const g = parada.grupo;

      g.classList.toggle("es-aqui", aqui);
      g.classList.toggle("es-actual", aqui && !tipo);
      g.classList.toggle("es-bien", tipo === "bien");
      g.classList.toggle("es-mal", tipo === "mal");
      g.classList.toggle("es-nose", tipo === "nose");
      g.classList.toggle("es-viendo", d.vista === i);
      g.classList.toggle("es-pulsable", sePuedeTocar);

      if (sePuedeTocar) {
        g.setAttribute("role", "button");
        g.setAttribute("tabindex", "0");
      } else {
        g.setAttribute("role", "img");
        g.removeAttribute("tabindex");
      }

      let descripcion = "todavía no llegaste";
      if (tipo === "bien") descripcion = "correcta";
      else if (tipo === "mal") descripcion = "incorrecta";
      else if (tipo === "nose") descripcion = "no sabías";
      else if (aqui) descripcion = "estás acá";
      g.setAttribute("aria-label", `Parada ${i + 1}, ${descripcion}${sePuedeTocar ? ". Ver pregunta" : ""}`);

      const clave = tipo || (aqui && !terminado ? "actual" : "num");
      if (parada.clave !== clave) {
        parada.contenido.replaceChildren(contenidoParada(clave, i));
        parada.clave = clave;
      }
    });

    const avance = terminado ? dibujo.largoTotal : dibujo.paradas[d.pos].distancia;
    dibujo.recorrida.style.strokeDashoffset = String(dibujo.largoTotal - avance);
  }

  // Si cambia el ancho de la pantalla, se vuelve a dibujar
  let pendiente = 0;
  const observador = "ResizeObserver" in window ? new ResizeObserver(() => {
    cancelAnimationFrame(pendiente);
    pendiente = requestAnimationFrame(() => {
      const ancho = Math.round(lienzo.clientWidth);
      if (ancho && ancho !== anchoDibujado) {
        dibujar();
        actualizar();
      }
    });
  }) : null;
  if (observador) observador.observe(lienzo);

  dibujar();
  actualizar();

  return {
    actualizar,
    destruir: () => { if (observador) observador.disconnect(); },
  };
}

// Dibuja la tira de progreso: el camino en una sola línea, para celulares
function dibujarTira(contenedor, { orden, pos, tipo }) {
  const W = Math.round(contenedor.clientWidth);
  if (!W) return;

  const N = orden.length;
  const enJuego = pos < N;
  const H = 50;
  const y = 30;
  const x0 = 18;
  const x1 = W - 26;
  const paso = N > 1 ? (x1 - x0) / (N - 1) : 0;
  const grandes = paso >= 26; // si hay lugar, las paradas llevan ícono
  // Con muchas paradas (30 o 50) los puntos se achican para que no se pisen
  const radioPendiente = grandes ? 6 : Math.min(4.5, paso * 0.42);
  const radioRespondida = grandes ? 10 : Math.min(6.5, paso * 0.5);

  const svg = crearSvg("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, "aria-hidden": "true", focusable: "false" });
  const linea = `M ${x0 - 10} ${y} H ${x1 + 14}`;
  svg.append(crearSvg("path", { class: "asfalto asfalto-fino", d: linea }));
  svg.append(crearSvg("path", { class: "pintura", d: linea }));
  const xAvance = enJuego ? x0 + pos * paso : x1 + 14;
  svg.append(crearSvg("path", { class: "recorrida-fija", d: `M ${x0 - 10} ${y} H ${xAvance.toFixed(1)}` }));

  for (let f = 0; f < 4; f++) {
    for (let c = 0; c < 2; c++) {
      if ((f + c) % 2 === 0) svg.append(crearSvg("rect", { class: "cuadro-meta", x: x1 + 9 + c * 3, y: y - 6 + f * 3, width: 3, height: 3 }));
    }
  }

  orden.forEach((p, i) => {
    const x = x0 + i * paso;
    const resultado = tipo(p);
    const aqui = i === pos;
    const grupo = crearSvg("g", { transform: `translate(${x.toFixed(1)} ${y})` });

    if (aqui && !resultado) {
      grupo.append(mascotaSvg(0.68, true));
    } else if (resultado) {
      const r = radioRespondida;
      if (aqui) grupo.append(crearSvg("circle", { class: "tira-aqui", r: r + 3.5 }));
      grupo.append(crearSvg("circle", { class: "tira-punto es-" + resultado, r }));
      if (grandes) {
        const chico = crearSvg("g", { transform: "scale(.72)" });
        chico.append(contenidoParada(resultado, i));
        grupo.append(chico);
      }
    } else {
      grupo.append(crearSvg("circle", { class: "tira-pendiente", r: radioPendiente.toFixed(1) }));
    }
    svg.append(grupo);
  });

  contenedor.replaceChildren(svg);
}
