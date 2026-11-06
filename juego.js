/*
  Camino de la privacidad: lógica del juego.
  Maneja las pantallas (inicio, juego y final), las respuestas,
  el glosario, el modo stand y el uso con teclado.
*/
"use strict";

const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
const dosColumnas = window.matchMedia("(min-width: 900px)");
const tipoDeScroll = () => (menosMovimiento.matches ? "auto" : "smooth");
const tieneOpcion = (pregunta, letra) => Object.prototype.hasOwnProperty.call(pregunta.opciones, letra);


// ---------- Recorridos ----------

function tieneResultados(p) {
  return !!RESULTADOS[p.n] && typeof RESULTADOS[p.n][p.correcta] === "number";
}

// Devuelve una copia de la lista con los elementos en orden al azar
function mezclar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Elige al azar las preguntas de un recorrido entre las 50.
// Se mantiene la proporción de las 50: 2 de cada 5 son de las básicas (1 a 20) y van primero,
// así el camino empieza más fácil y se pone más difícil.
function elegirPreguntas(ruta) {
  const cantidad = RECORRIDOS[ruta].cantidad;
  const basicas = mezclar(PREGUNTAS.filter((p) => p.n <= 20));
  const dificiles = mezclar(PREGUNTAS.filter((p) => p.n > 20));
  const cuantasBasicas = Math.round(cantidad * basicas.length / PREGUNTAS.length);
  return basicas.slice(0, cuantasBasicas)
    .concat(dificiles.slice(0, cantidad - cuantasBasicas))
    .map((p) => p.n);
}

// Arma el recorrido con las preguntas elegidas (una lista de números de pregunta).
// El mapa se divide en tramos de 5 paradas.
function armarRecorrido(ruta, numeros) {
  const base = numeros.map((n) => PREGUNTAS.find((p) => p.n === n));
  const porErrores = ORDEN === "errores" && base.every(tieneResultados);
  const orden = porErrores
    ? base.slice().sort((a, b) => RESULTADOS[a.n][a.correcta] - RESULTADOS[b.n][b.correcta] || a.n - b.n)
    : base;

  const tramos = [];
  for (let k = 0; k < orden.length; k += 5) {
    tramos.push({ nombre: "Tramo " + (k / 5 + 1), items: orden.slice(k, k + 5) });
  }
  return { ruta, orden, tramos, indice: new Map(orden.map((p, i) => [p.n, i])) };
}

// El mapa de muestra del inicio: un recorrido de 20 paradas
const recorridoDeMuestra = armarRecorrido("completo", elegirPreguntas("completo"));

// Qué recorrido se ofrece al terminar cada uno
const SIGUIENTE = {
  rapido: { ruta: "completo", texto: "Hacer el recorrido de 20 preguntas" },
};


// ---------- Avance guardado en el navegador ----------

const CLAVE_AVANCE = "camino-privacidad:v4";
const CLAVE_STAND = "camino-privacidad:stand";

function leer(clave) {
  try {
    return localStorage.getItem(clave);
  } catch (e) {
    return null;
  }
}

function escribir(clave, valor) {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, valor);
  } catch (e) {
    // Si el navegador no deja guardar, la página funciona igual
  }
}

let modoStand = leer(CLAVE_STAND) === "1" || location.hash === "#stand";

function estadoVacio() {
  return { fase: "inicio", ruta: null, preguntas: [], respuestas: {}, pos: 0 };
}

// Las preguntas guardadas tienen que existir, no repetirse y ser la cantidad del recorrido
function preguntasValidas(ruta, numeros) {
  return Array.isArray(numeros)
    && numeros.length === RECORRIDOS[ruta].cantidad
    && new Set(numeros).size === numeros.length
    && numeros.every((n) => PREGUNTAS.some((p) => p.n === n));
}

function cargarAvance() {
  if (modoStand) return estadoVacio();
  try {
    const guardado = JSON.parse(leer(CLAVE_AVANCE) || "null");
    if (!guardado || !Object.prototype.hasOwnProperty.call(RECORRIDOS, guardado.ruta)) return estadoVacio();
    if (!preguntasValidas(guardado.ruta, guardado.preguntas)) return estadoVacio();

    const r = armarRecorrido(guardado.ruta, guardado.preguntas);
    const N = r.orden.length;
    const respuestas = {};
    for (const p of r.orden) {
      const letra = guardado.respuestas && guardado.respuestas[p.n];
      if (typeof letra === "string" && tieneOpcion(p, letra)) respuestas[p.n] = letra;
    }
    const pos = Number.isInteger(guardado.pos) ? Math.max(0, Math.min(N, guardado.pos)) : 0;

    // Todo lo anterior a la parada actual tiene que estar respondido, y nada de lo que sigue
    for (let i = 0; i < pos; i++) if (!respuestas[r.orden[i].n]) return estadoVacio();
    for (let i = pos + 1; i < N; i++) if (respuestas[r.orden[i].n]) return estadoVacio();

    const partida = typeof guardado.partida === "string" ? guardado.partida : nuevoCodigoPartida();
    return { fase: pos >= N ? "final" : "juego", ruta: guardado.ruta, preguntas: guardado.preguntas, respuestas, pos, partida };
  } catch (e) {
    return estadoVacio();
  }
}

function guardarAvance() {
  if (modoStand) return;
  if (estado.fase === "inicio") escribir(CLAVE_AVANCE, null);
  else escribir(CLAVE_AVANCE, JSON.stringify(estado));
}


// ---------- Estado del juego ----------

let estado = cargarAvance();
let recorrido = estado.ruta ? armarRecorrido(estado.ruta, estado.preguntas) : null;
let vista = null;        // parada que se está repasando (o null)
let mapaJuego = null;
let recorridoDelMapa = null;
let mapaInicio = null;

// Devuelve "bien", "mal", "nose" o null si todavía no se respondió
function tipoDeRespuesta(p) {
  const letra = estado.respuestas[p.n];
  if (!letra) return null;
  if (letra === p.correcta) return "bien";
  return p.opciones[letra].nose ? "nose" : "mal";
}

function contar() {
  const total = { bien: 0, mal: 0, nose: 0, respondidas: 0 };
  if (!recorrido) return total;
  for (const p of recorrido.orden) {
    const tipo = tipoDeRespuesta(p);
    if (tipo) {
      total[tipo]++;
      total.respondidas++;
    }
  }
  return total;
}

function datosDelJuego() {
  return {
    orden: recorrido.orden,
    tramos: recorrido.tramos,
    indice: recorrido.indice,
    tipo: tipoDeRespuesta,
    pos: estado.pos,
    vista,
  };
}

// El mapa de muestra del inicio: las paradas del nivel básico, sin responder
function datosDelInicio() {
  return {
    orden: recorridoDeMuestra.orden,
    tramos: recorridoDeMuestra.tramos,
    indice: recorridoDeMuestra.indice,
    tipo: () => null,
    pos: 0,
    vista: null,
  };
}


// ---------- Pantallas ----------

function mostrarPantalla() {
  const fase = estado.fase;
  $("#vista-inicio").hidden = fase !== "inicio";
  $("#vista-juego").hidden = fase === "inicio";
  $("#vista-juego").classList.toggle("es-final", fase === "final");
  $("#barra").hidden = fase === "inicio";
  $("#btn-salir").hidden = fase !== "juego";
}

// El mapa se vuelve a crear solo cuando cambia el recorrido
function prepararMapa() {
  if (mapaJuego && recorridoDelMapa === recorrido) return;
  if (mapaJuego) mapaJuego.destruir();
  mapaJuego = crearMapa($("#lienzo"), datosDelJuego, abrirParada);
  recorridoDelMapa = recorrido;
}

function actualizarConteo() {
  const c = contar();
  const N = recorrido.orden.length;
  let texto;
  if (estado.fase === "final") {
    texto = `Recorrido terminado · ${c.bien} de ${N} correctas`;
  } else {
    texto = `Parada ${estado.pos + 1} de ${N}`;
    if (c.bien) texto += ` · ${c.bien} ${c.bien === 1 ? "correcta" : "correctas"}`;
    if (c.mal + c.nose) texto += ` · ${c.mal + c.nose} para repasar`;
  }
  $("#conteo").textContent = texto;
}

function actualizarTira() {
  const N = recorrido.orden.length;
  const c = contar();
  const enJuego = estado.pos < N;
  const actual = recorrido.orden[Math.min(estado.pos, N - 1)];
  const aciertos = `${c.bien} ${c.bien === 1 ? "acierto" : "aciertos"}`;

  $("#tira-parada").textContent = enJuego ? `Parada ${estado.pos + 1} de ${N} · ${SECCIONES[actual.seccion]}` : "Recorrido terminado";
  $("#tira-aciertos").textContent = aciertos;
  $("#tira-aciertos").classList.toggle("cero", c.bien === 0);
  $("#tira-lienzo").setAttribute("aria-label", `Progreso: parada ${Math.min(estado.pos + 1, N)} de ${N}, ${aciertos}`);
  dibujarTira($("#tira-lienzo"), { orden: recorrido.orden, pos: estado.pos, tipo: tipoDeRespuesta });
}

// Marca cada opción según la respuesta elegida
function pintarOpciones(lista, p, elegida) {
  lista.classList.toggle("respondida", !!elegida);

  lista.querySelectorAll(".opcion").forEach((boton) => {
    const letra = boton.dataset.letra;
    const opcion = p.opciones[letra];
    const esCorrecta = letra === p.correcta;
    const esElegida = letra === elegida;
    const insignia = boton.querySelector(".letra");
    const etiquetaVieja = boton.querySelector(".etiqueta");

    boton.classList.remove("es-correcta", "es-elegida-mal", "es-elegida-nose", "es-otra");
    if (etiquetaVieja) etiquetaVieja.remove();

    if (!elegida) {
      insignia.replaceChildren(letra);
      boton.removeAttribute("aria-disabled");
      boton.removeAttribute("tabindex");
      return;
    }

    boton.setAttribute("aria-disabled", "true");
    boton.setAttribute("tabindex", "-1");
    let etiqueta = null;
    if (esCorrecta) {
      boton.classList.add("es-correcta");
      insignia.replaceChildren(icono("bien", 15));
      etiqueta = esElegida ? "Tu respuesta · Correcta" : "Correcta";
    } else if (esElegida) {
      boton.classList.add(opcion.nose ? "es-elegida-nose" : "es-elegida-mal");
      insignia.replaceChildren(icono(opcion.nose ? "nose" : "mal", 15));
      etiqueta = "Tu respuesta";
    } else {
      boton.classList.add("es-otra");
      insignia.replaceChildren(letra);
    }
    if (etiqueta) boton.querySelector(".opcion-texto").append(crear("span", { class: "etiqueta" }, etiqueta));
  });
}

function frasePorcentaje(tipo, porcentaje) {
  const valor = Math.round(porcentaje);
  if (tipo === "bien") return `El ${valor}% de los encuestados también acertó.`;
  if (tipo === "nose") return `El ${valor}% de los encuestados tampoco sabía.`;
  return `El ${valor}% de los encuestados también eligió esta opción.`;
}

function botonDevolucion() {
  if (vista !== null) {
    const texto = estado.fase === "final" ? "Volver a tu licencia" : `Volver a la parada ${estado.pos + 1}`;
    return crear("button", { type: "button", class: "boton", "data-accion": "volver" }, texto, flecha());
  }
  const esLaUltima = estado.pos === recorrido.orden.length - 1;
  return crear("button", { type: "button", class: "boton", "data-accion": "siguiente" }, esLaUltima ? "Ver mi licencia" : "Siguiente parada", flecha());
}

// La explicación que aparece después de responder
function devolucion(p, letra) {
  const opcion = p.opciones[letra];
  const tipo = letra === p.correcta ? "bien" : opcion.nose ? "nose" : "mal";
  const titulos = { bien: "¡Correcto!", mal: "Incorrecto", nose: "Ahora ya sabés" };
  const caja = crear("div", { class: "devolucion" });

  caja.append(crear("p", { class: "veredicto " + tipo, tabindex: "-1" },
    crear("span", { class: "sello" }, icono(tipo, 18)),
    titulos[tipo]));

  if (tipo === "bien") {
    caja.append(crear("p", { class: "texto" }, textoConFormato(opcion.porque)));
  } else {
    if (opcion.porque) {
      caja.append(crear("div", { class: "bloque" },
        crear("p", { class: "rotulo" }, tipo === "mal" ? "Por qué es incorrecta" : (opcion.rotulo || "Para saber")),
        crear("p", { class: "texto" }, textoConFormato(opcion.porque))));
    }
    const correcta = p.opciones[p.correcta];
    caja.append(crear("div", { class: "la-correcta" },
      crear("p", { class: "rotulo" }, "La respuesta correcta"),
      crear("p", { class: "correcta-opcion" },
        crear("span", { class: "letra-mini", "aria-hidden": "true" }, p.correcta),
        crear("span", { class: correcta.mono ? "mono" : null },
          crear("span", { class: "sr" }, p.correcta + ") "),
          textoConFormato(correcta.texto))),
      crear("p", { class: "texto" }, textoConFormato(correcta.porque))));
  }

  const escena = ESCENAS[p.n];
  if (escena && escena.despues) caja.append(figuraEscena(escena.despues, escena.pie));

  caja.append(crear("div", { class: "nota" },
    imagenMascota(32),
    crear("div", null,
      crear("p", { class: "rotulo" }, "Para recordar"),
      crear("p", { class: "nota-texto" }, p.consejo))));

  const resultados = RESULTADOS[p.n];
  if (resultados && typeof resultados[letra] === "number") {
    caja.append(crear("p", { class: "dato" }, frasePorcentaje(tipo, resultados[letra])));
  }

  caja.append(crear("div", { class: "acciones" }, botonDevolucion()));
  return caja;
}

function renderPregunta(i) {
  const p = recorrido.orden[i];
  const N = recorrido.orden.length;
  const elegida = estado.respuestas[p.n] || null;
  const escena = ESCENAS[p.n];
  const conEscena = !!(escena && escena.antes);

  const cabecera = crear("div", { class: "tarjeta-cabecera" },
    crear("div", { class: "chips" },
      vista !== null ? crear("span", { class: "chip chip-repaso" }, "Repaso") : null,
      crear("span", { class: "chip" }, SECCIONES[p.seccion])),
    crear("p", { class: "parada-num" }, "Parada ", crear("b", null, String(i + 1).padStart(2, "0")), ` / ${N}`));

  // Si el celular ya muestra el mensaje, en el título queda solo para lectores de pantalla
  // (y el contexto termina en punto, porque el mensaje ya no aparece abajo)
  const titulo = crear("h2", { class: "pregunta", id: "pregunta-titulo", tabindex: "-1", "data-foco": "" });
  const cubre = !!(escena && escena.cubre);
  if (p.contexto) titulo.append(crear("span", { class: "contexto" }, textoConFormato(cubre ? p.contexto.replace(/:$/, ".") : p.contexto)));
  if (p.mensaje) titulo.append(crear("span", { class: cubre ? "sr" : "mensaje" }, textoConFormato(p.mensaje)));
  titulo.append(crear("span", { class: "pregunta-texto" }, textoConFormato(p.texto)));

  const lista = crear("ul", { class: "opciones", "aria-labelledby": "pregunta-titulo" });
  for (const [letra, opcion] of Object.entries(p.opciones)) {
    lista.append(crear("li", null,
      crear("button", { type: "button", class: "opcion", "data-letra": letra },
        crear("span", { class: "letra", "aria-hidden": "true" }, letra),
        crear("span", { class: "opcion-texto" },
          crear("span", { class: opcion.mono ? "mono" : null },
            crear("span", { class: "sr" }, letra + ") "),
            textoConFormato(opcion.texto, { glosario: false }))))));
  }
  pintarOpciones(lista, p, elegida);

  const disposicion = crear("div", { class: "pregunta-layout" + (conEscena ? " con-escena" : "") },
    conEscena ? figuraEscena(escena.antes) : null,
    crear("div", { class: "pregunta-cuerpo" }, titulo, lista));

  const zona = crear("div", { class: "zona-devolucion" });
  if (elegida) zona.append(devolucion(p, elegida));

  const tarjeta = $("#tarjeta");
  tarjeta.setAttribute("aria-label", `Parada ${i + 1} de ${N}`);
  tarjeta.replaceChildren(cabecera, disposicion, zona);
}

function renderFinal() {
  const c = contar();
  const N = recorrido.orden.length;
  const nivel = NIVELES.find((n) => c.bien / N >= n.min);
  const fecha = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const dato = (titulo, valor, clase) => crear("div", { class: clase || null }, crear("dt", null, titulo), crear("dd", null, valor));

  const licencia = crear("div", { class: "licencia" },
    crear("div", { class: "lic-banda" },
      crear("span", { class: "lic-titulo" }, "Licencia de navegante digital"),
      crear("span", { class: "lic-ruta" }, RECORRIDOS[recorrido.ruta].nombre)),
    crear("div", { class: "lic-cuerpo" },
      crear("div", { class: "lic-foto" }, imagenMascota(54), crear("span", null, "Foto: no compartida")),
      crear("dl", { class: "lic-datos" },
        dato("Titular", "Dato protegido"),
        dato("Nivel", nivel.nombre, "lic-nivel"),
        dato("Aciertos", `${c.bien} de ${N}`),
        dato("Fecha", fecha))),
    crear("p", { class: "lic-frase" }, nivel.frase));

  const detalle = [];
  if (c.mal) detalle.push(`${c.mal} ${c.mal === 1 ? "incorrecta" : "incorrectas"}`);
  if (c.nose) detalle.push(`${c.nose} que no sabías`);

  // Consejos de las preguntas que salieron mal (o generales si no hubo errores)
  const fallidas = recorrido.orden.filter((p) => {
    const tipo = tipoDeRespuesta(p);
    return tipo && tipo !== "bien";
  });
  const deDondeSalen = fallidas.length ? fallidas : CONSEJOS_BASE.map((n) => PREGUNTAS.find((p) => p.n === n));
  const consejos = deDondeSalen.slice(0, 5).map((p) => crear("li", null, p.consejo));

  const filas = Object.keys(SECCIONES).map(Number).map((id) => {
    const deLaSeccion = recorrido.orden.filter((p) => p.seccion === id).sort((a, b) => a.n - b.n);
    if (!deLaSeccion.length) return null;
    const bien = deLaSeccion.filter((p) => tipoDeRespuesta(p) === "bien").length;
    return crear("li", { class: "fila" },
      crear("span", null, SECCIONES[id]),
      crear("span", { class: "puntos", "aria-hidden": "true" },
        deLaSeccion.map((p) => crear("span", { class: "punto " + (tipoDeRespuesta(p) || "") }))),
      crear("span", { class: "fila-cifra" },
        crear("span", { class: "sr" }, `${bien} de ${deLaSeccion.length} correctas`),
        crear("span", { "aria-hidden": "true" }, `${bien}/${deLaSeccion.length}`)));
  }).filter(Boolean);

  let repaso;
  if (fallidas.length) {
    repaso = crear("ul", { class: "repaso" }, fallidas.map((p) => {
      const i = recorrido.indice.get(p.n);
      const tipo = tipoDeRespuesta(p);
      return crear("li", null,
        crear("button", { type: "button", class: "repaso-item", "data-accion": "repasar", "data-i": i },
          crear("span", { class: "marca-estado " + tipo }, icono(tipo, 14)),
          crear("span", { class: "repaso-texto" },
            crear("span", { class: "repaso-num" }, `Parada ${i + 1} · ${tipo === "mal" ? "Incorrecta" : "No sabías"}`),
            crear("span", null, resumenPregunta(p))),
          flecha()));
    }));
  } else {
    repaso = crear("p", { class: "sin-repaso" }, "No tenés nada para repasar.");
  }

  // Botón para seguir con el próximo nivel (si hay)
  const siguienteNivel = SIGUIENTE[recorrido.ruta];
  const botonNivel = siguienteNivel
    ? crear("button", { type: "button", class: "boton boton-secundario", "data-ruta": siguienteNivel.ruta }, siguienteNivel.texto)
    : null;

  const tarjeta = $("#tarjeta");
  tarjeta.setAttribute("aria-label", "Resultado del recorrido");
  tarjeta.replaceChildren(crear("div", { class: "final" },
    crear("p", { class: "antetitulo" }, "Llegada"),
    crear("h2", { class: "final-titulo", tabindex: "-1", "data-foco": "" }, "¡Llegaste al final del camino!"),
    licencia,
    detalle.length ? crear("p", { class: "detalle" }, detalle.join(" · ")) : null,
    crear("h3", { class: "subtitulo" }, fallidas.length ? "Consejos para llevarte" : "Consejos para pasarle a alguien"),
    crear("ul", { class: "consejos" }, consejos),
    crear("h3", { class: "subtitulo" }, "Por sección"),
    crear("ul", { class: "secciones" }, filas),
    crear("h3", { class: "subtitulo" }, "Repasá tus respuestas"),
    repaso,
    crear("div", { class: "acciones" },
      crear("button", { type: "button", class: "boton", "data-accion": "otra-vez" }, modoStand ? "Que juegue otra persona" : "Jugar de nuevo", flecha()),
      botonNivel)));
}

function renderTarjeta() {
  if (estado.fase === "final" && vista === null) renderFinal();
  else renderPregunta(vista === null ? estado.pos : vista);
}

// Muestra la pantalla que corresponde según el estado
function render() {
  cerrarGlosario(false);
  mostrarPantalla();

  if (estado.fase === "inicio") {
    if (!mapaInicio) mapaInicio = crearMapa($("#lienzo-preview"), datosDelInicio, null);
    return;
  }

  prepararMapa();
  mapaJuego.actualizar();
  actualizarConteo();
  actualizarTira();
  renderTarjeta();
}


// ---------- Navegación ----------

// Lleva la pantalla hasta un elemento si no se ve
function llevarA(destino) {
  if (!destino) return;
  const caja = destino.getBoundingClientRect();
  if (caja.top < 0 || caja.top > window.innerHeight * 0.6) {
    destino.scrollIntoView({ behavior: tipoDeScroll(), block: "start" });
  }
}

function irArriba() {
  $("#pagina").scrollIntoView({ behavior: "auto", block: "start" });
}

// Pone el foco en el título de la pantalla (para lectores de pantalla y teclado)
function enfocar() {
  const titulo = estado.fase === "inicio" ? $("#titulo-inicio") : $("#tarjeta [data-foco]");
  if (titulo) titulo.focus({ preventScroll: true });
}

function destinoDelPaso() {
  return dosColumnas.matches ? $("#tarjeta") : $("#tira");
}

function empezar(ruta) {
  // Cada vez que se empieza, se eligen preguntas nuevas al azar
  const preguntas = elegirPreguntas(ruta);
  estado = { fase: "juego", ruta, preguntas, respuestas: {}, pos: 0, partida: nuevoCodigoPartida() };
  recorrido = armarRecorrido(ruta, preguntas);
  vista = null;
  guardarAvance();
  sonar("empezar");
  render();
  irArriba();
  enfocar();
}

function reiniciarTodo() {
  cerrarDialogo(false);
  estado = estadoVacio();
  recorrido = null;
  vista = null;
  guardarAvance();
  render();
  irArriba();
  enfocar();
}

function responder(letra) {
  if (estado.fase !== "juego" || vista !== null) return;
  const p = recorrido.orden[estado.pos];
  if (!p || estado.respuestas[p.n] || !tieneOpcion(p, letra)) return;

  estado.respuestas[p.n] = letra;
  if (!estado.partida) estado.partida = nuevoCodigoPartida();
  guardarAvance();

  // Se guarda en la planilla (de forma anónima) qué opción eligió
  registrarRespuesta({
    partida: estado.partida,
    recorrido: estado.ruta,
    parada: estado.pos + 1,
    pregunta: p.n,
    opcion: letra,
    resultado: tipoDeRespuesta(p),
    stand: modoStand ? "sí" : "no",
  });

  const tarjeta = $("#tarjeta");
  const lista = tarjeta.querySelector(".opciones");
  pintarOpciones(lista, p, letra);

  // Animación: latido si acertó, sacudida si se equivocó
  const tipo = tipoDeRespuesta(p);
  sonar(tipo);
  const elegido = lista.querySelector(`.opcion[data-letra="${letra}"]`);
  if (elegido && tipo !== "nose") elegido.classList.add(tipo === "bien" ? "recien-bien" : "recien-mal");

  const zona = tarjeta.querySelector(".zona-devolucion");
  zona.replaceChildren(devolucion(p, letra));
  mapaJuego.actualizar();
  actualizarConteo();
  actualizarTira();

  const veredicto = zona.querySelector(".veredicto");
  if (veredicto) veredicto.focus({ preventScroll: true });
  zona.scrollIntoView({ behavior: tipoDeScroll(), block: "nearest" });
}

function siguiente() {
  if (estado.fase !== "juego" || vista !== null) return;
  const N = recorrido.orden.length;
  const p = recorrido.orden[estado.pos];
  if (!p || !estado.respuestas[p.n]) return;

  estado.pos += 1;
  if (estado.pos >= N) estado.fase = "final";
  guardarAvance();
  render();

  sonar(estado.fase === "final" ? "final" : "paso");
  if (estado.fase === "final") {
    irArriba();
    if (contar().bien / N >= 0.7) confeti();
  } else {
    llevarA(destinoDelPaso());
  }
  enfocar();
}

function volver() {
  vista = null;
  render();
  if (estado.fase === "final") irArriba();
  else llevarA(destinoDelPaso());
  enfocar();
}

// Abre una parada ya respondida para repasarla
function abrirParada(i) {
  if (!recorrido || estado.fase === "inicio" || i > estado.pos || i >= recorrido.orden.length) return;
  vista = estado.fase === "juego" && i === estado.pos ? null : i;
  render();
  llevarA($("#tarjeta"));
  enfocar();
}


// ---------- Glosario ----------

let botonGlosario = null;

function abrirGlosario(boton) {
  const ventana = $("#glosa-pop");
  if (botonGlosario === boton && !ventana.hidden) {
    cerrarGlosario();
    return;
  }
  const palabra = GLOSARIO[boton.dataset.glosa];
  if (!palabra) return;

  cerrarGlosario(false);
  botonGlosario = boton;
  boton.setAttribute("aria-expanded", "true");
  $("#glosa-termino").textContent = palabra.termino;
  $("#glosa-def").textContent = palabra.def;

  // En pantallas angostas se abre desde abajo; en las grandes, al lado de la palabra
  const angosta = window.innerWidth < 640;
  ventana.classList.toggle("hoja", angosta);
  ventana.style.left = "";
  ventana.style.top = "";
  ventana.hidden = false;

  if (!angosta) {
    const caja = boton.getBoundingClientRect();
    const ancho = ventana.offsetWidth;
    const alto = ventana.offsetHeight;
    const izquierda = Math.min(Math.max(12, caja.left), window.innerWidth - ancho - 12);
    let arriba = caja.bottom + 8;
    if (arriba + alto > window.innerHeight - 12) arriba = Math.max(12, caja.top - alto - 8);
    ventana.style.left = izquierda + "px";
    ventana.style.top = arriba + "px";
  }
  ventana.focus({ preventScroll: true });
}

function cerrarGlosario(devolverFoco = true) {
  const ventana = $("#glosa-pop");
  if (ventana.hidden) return;
  ventana.hidden = true;
  if (botonGlosario) {
    botonGlosario.setAttribute("aria-expanded", "false");
    if (devolverFoco && botonGlosario.isConnected) botonGlosario.focus({ preventScroll: true });
  }
  botonGlosario = null;
}


// ---------- Avisos (salir y "¿seguís ahí?") ----------

let modal = null;

function mostrarDialogo(opciones) {
  cerrarDialogo(false);
  cerrarGlosario(false);

  const texto = crear("p", { class: "modal-texto", id: "modal-texto" });
  const botonPrincipal = crear("button", { type: "button", class: "boton" }, opciones.primario);
  const botonSecundario = opciones.secundario
    ? crear("button", { type: "button", class: "boton boton-secundario" }, opciones.secundario)
    : null;
  const panel = crear("div", { class: "modal", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "modal-titulo", "aria-describedby": "modal-texto" },
    crear("h2", { class: "modal-titulo", id: "modal-titulo" }, opciones.titulo),
    texto,
    crear("div", { class: "acciones" }, botonPrincipal, botonSecundario));
  const fondo = crear("div", { class: "modal-fondo" }, panel);

  // El texto puede tener una cuenta regresiva
  let segundosRestantes = opciones.segundos || 0;
  const escribirTexto = () => {
    texto.textContent = typeof opciones.texto === "function" ? opciones.texto(segundosRestantes) : opciones.texto;
  };
  escribirTexto();

  modal = { fondo, anterior: document.activeElement, alEscape: opciones.alEscape, reloj: null };
  if (opciones.segundos) {
    modal.reloj = setInterval(() => {
      segundosRestantes -= 1;
      if (segundosRestantes <= 0) {
        cerrarDialogo(false);
        if (opciones.alTerminar) opciones.alTerminar();
      } else {
        escribirTexto();
      }
    }, 1000);
  }

  botonPrincipal.addEventListener("click", () => {
    cerrarDialogo();
    if (opciones.alPrincipal) opciones.alPrincipal();
  });
  // El botón secundario puede quedar bloqueado unos segundos, para no confirmar sin leer
  if (botonSecundario && opciones.esperaSecundario) {
    let espera = opciones.esperaSecundario;
    botonSecundario.disabled = true;
    botonSecundario.textContent = `${opciones.secundario} (${espera})`;
    modal.relojEspera = setInterval(() => {
      espera -= 1;
      if (espera > 0) {
        botonSecundario.textContent = `${opciones.secundario} (${espera})`;
      } else {
        clearInterval(modal.relojEspera);
        botonSecundario.disabled = false;
        botonSecundario.textContent = opciones.secundario;
      }
    }, 1000);
  }
  if (botonSecundario) {
    botonSecundario.addEventListener("click", () => {
      if (botonSecundario.disabled) return;
      cerrarDialogo(false);
      if (opciones.alSecundario) opciones.alSecundario();
    });
  }

  // Escape cierra; Tab no deja salir del aviso
  panel.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      evento.preventDefault();
      evento.stopPropagation();
      const alEscape = modal && modal.alEscape;
      cerrarDialogo();
      if (alEscape) alEscape();
    } else if (evento.key === "Tab") {
      const botones = [botonPrincipal, botonSecundario].filter(Boolean);
      const actual = botones.indexOf(document.activeElement);
      evento.preventDefault();
      botones[(actual + (evento.shiftKey ? -1 : 1) + botones.length) % botones.length].focus();
    }
  });

  document.body.append(fondo);
  botonPrincipal.focus();
}

function cerrarDialogo(devolverFoco = true) {
  if (!modal) return;
  clearInterval(modal.reloj);
  clearInterval(modal.relojEspera);
  modal.fondo.remove();
  const anterior = modal.anterior;
  modal = null;
  if (devolverFoco && anterior && anterior.isConnected && anterior.focus) anterior.focus({ preventScroll: true });
}


// ---------- Modo stand: vuelve al inicio si nadie usa la pantalla ----------

let ultimoUso = Date.now();

function marcarUso() {
  ultimoUso = Date.now();
}

function revisarInactividad() {
  if (!modoStand || modal || estado.fase === "inicio") return;
  const limite = estado.fase === "final" ? 60 : 120; // segundos
  if ((Date.now() - ultimoUso) / 1000 < limite) return;

  mostrarDialogo({
    titulo: "¿Seguís ahí?",
    texto: (segundos) => `Si nadie toca la pantalla, el camino vuelve al inicio en ${segundos} segundos.`,
    primario: "Sigo acá",
    secundario: "Volver al inicio",
    alPrincipal: marcarUso,
    alSecundario: reiniciarTodo,
    alEscape: marcarUso,
    segundos: 20,
    alTerminar: reiniciarTodo,
  });
}


// ---------- Festejo al terminar ----------

function confeti() {
  if (menosMovimiento.matches) return;
  const capa = crear("div", { class: "confeti", "aria-hidden": "true" });
  const colores = ["var(--signal)", "var(--ok)", "var(--primary)", "var(--nose)"];
  for (let i = 0; i < 36; i++) {
    const pieza = crear("i");
    pieza.style.left = (Math.random() * 100).toFixed(1) + "%";
    pieza.style.background = colores[i % colores.length];
    pieza.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s";
    pieza.style.animationDuration = (1.8 + Math.random() * 1.2).toFixed(2) + "s";
    pieza.style.setProperty("--giro", (Math.random() * 720 - 360).toFixed(0) + "deg");
    pieza.style.setProperty("--deriva", (Math.random() * 80 - 40).toFixed(0) + "px");
    capa.append(pieza);
  }
  document.body.append(capa);
  setTimeout(() => capa.remove(), 3600);
}


// ---------- Eventos ----------

function conectarEventos() {
  // Clics en la pantalla: elegir recorrido, responder y botones de las tarjetas
  $("#vista").addEventListener("click", (evento) => {
    if (evento.target.closest(".glosa")) return;

    const ruta = evento.target.closest("[data-ruta]");
    if (ruta) {
      empezar(ruta.dataset.ruta);
      return;
    }
    const opcion = evento.target.closest(".opcion");
    if (opcion) {
      responder(opcion.dataset.letra);
      return;
    }
    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;
    const accion = boton.dataset.accion;
    if (accion !== "siguiente") sonar("toque");
    if (accion === "siguiente") siguiente();
    else if (accion === "volver") volver();
    else if (accion === "repasar") abrirParada(Number(boton.dataset.i));
    else if (accion === "otra-vez") reiniciarTodo();
  });

  // Palabras del glosario (están en las preguntas y en el inicio)
  document.addEventListener("click", (evento) => {
    const palabra = evento.target.closest(".glosa");
    if (palabra) {
      evento.preventDefault();
      sonar("toque");
      abrirGlosario(palabra);
      return;
    }
    const ventana = $("#glosa-pop");
    if (!ventana.hidden && !ventana.contains(evento.target)) cerrarGlosario(false);
  });
  $("#glosa-ok").addEventListener("click", () => cerrarGlosario());
  window.addEventListener("scroll", () => {
    const ventana = $("#glosa-pop");
    if (!ventana.hidden && !ventana.classList.contains("hoja")) cerrarGlosario(false);
  }, { passive: true });

  $("#btn-salir").addEventListener("click", () => mostrarDialogo({
    titulo: "¿Salir del recorrido?",
    texto: "Se borran las respuestas de este recorrido.",
    primario: "Seguir jugando",
    secundario: "Sí, salir",
    alSecundario: reiniciarTodo,
  }));

  // Respuestas guardadas en esta compu
  $("#btn-descargar").addEventListener("click", () => { sonar("toque"); descargarExcel(); });
  $("#btn-borrar-local").addEventListener("click", () => mostrarDialogo({
    titulo: "¿Borrar las respuestas guardadas?",
    texto: "Se borran todas las respuestas guardadas en esta compu y no se pueden recuperar. Antes, descargá el Excel si las necesitás. Las que ya llegaron a Google Sheets no se borran.",
    primario: "No, dejarlas",
    secundario: "Sí, borrar",
    esperaSecundario: 5,
    alSecundario: borrarHistorial,
  }));

  // El panel de respuestas está oculto para el público. Se abre (o se vuelve a ocultar) tocando
  // 5 veces seguidas el aviso de datos del pie, o con Ctrl + Shift + E. También tiene un botón «Ocultar».
  // Al recargar la página siempre empieza oculto.
  const panelDatos = $("#panel-datos");
  function abrirPanelDatos() {
    if (!panelDatos.hidden) { ocultarPanelDatos(); return; }
    panelDatos.hidden = false;
    panelDatos.open = true;
    panelDatos.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function ocultarPanelDatos() {
    panelDatos.open = false;
    panelDatos.hidden = true;
  }
  $("#btn-ocultar-panel").addEventListener("click", ocultarPanelDatos);
  let toquesAviso = 0;
  let relojAviso = null;
  $("#aviso-datos").addEventListener("click", () => {
    toquesAviso++;
    clearTimeout(relojAviso);
    relojAviso = setTimeout(() => { toquesAviso = 0; }, 2000);
    if (toquesAviso >= 5) { toquesAviso = 0; abrirPanelDatos(); }
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.ctrlKey && evento.shiftKey && evento.key.toLowerCase() === "e") {
      evento.preventDefault();
      abrirPanelDatos();
    }
  });

  // Sonidos
  const interruptorSonido = $("#sonido");
  interruptorSonido.checked = sonidoActivado;
  interruptorSonido.addEventListener("change", () => cambiarSonido(interruptorSonido.checked));

  // Modo stand
  const interruptor = $("#modo-stand");
  interruptor.checked = modoStand;
  interruptor.addEventListener("change", () => {
    modoStand = interruptor.checked;
    escribir(CLAVE_STAND, modoStand ? "1" : null);
    if (modoStand) escribir(CLAVE_AVANCE, null);
    else guardarAvance();
    marcarUso();
    if (estado.fase === "final" && vista === null) renderFinal();
  });
  ["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((tipo) => {
    window.addEventListener(tipo, marcarUso, { passive: true });
  });

  // Teclado: 1 a 4 (o A a D) para responder y Enter para seguir.
  // Sirve para manejarla desde una compu o con un proyector.
  document.addEventListener("keydown", (evento) => {
    const ventana = $("#glosa-pop");
    if (modal || !ventana.hidden) {
      if (evento.key === "Escape" && !ventana.hidden) cerrarGlosario();
      return;
    }
    if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
    if (estado.fase !== "juego" || vista !== null) return;

    const p = recorrido.orden[estado.pos];
    if (!p) return;
    if (!estado.respuestas[p.n]) {
      const teclas = { "1": "a", "2": "b", "3": "c", "4": "d", a: "a", b: "b", c: "c", d: "d" };
      const letra = teclas[evento.key.toLowerCase()];
      if (letra && tieneOpcion(p, letra)) {
        evento.preventDefault();
        responder(letra);
      }
    } else if ((evento.key === "Enter" || evento.key === "ArrowRight") && !evento.target.closest("button, a, summary, input, [role=button]")) {
      evento.preventDefault();
      siguiente();
    }
  });

  // La tira de progreso se redibuja si cambia el ancho
  if ("ResizeObserver" in window) {
    let anchoTira = 0;
    new ResizeObserver(() => {
      const ancho = Math.round($("#tira-lienzo").clientWidth);
      if (ancho && ancho !== anchoTira && recorrido) {
        anchoTira = ancho;
        actualizarTira();
      }
    }).observe($("#tira-lienzo"));
  }
}


// ---------- Inicio ----------

function minutosAproximados(cantidad) {
  return Math.max(1, Math.round(cantidad * 0.4));
}

function iniciar() {
  // Cantidad de preguntas de cada recorrido (por si se cambia RECORRIDOS)
  document.querySelectorAll("[data-dato]").forEach((elemento) => {
    const cantidad = RECORRIDOS[elemento.dataset.dato].cantidad;
    elemento.textContent = `${cantidad} preguntas · unos ${minutosAproximados(cantidad)} minutos`;
  });
  $("#dato-total").textContent = PREGUNTAS.length;

  // Lista del glosario del pie, en orden alfabético
  const palabras = Object.values(GLOSARIO).slice().sort((a, b) => a.termino.localeCompare(b.termino, "es"));
  $("#glosario-lista").append(...palabras.flatMap((g) => [crear("dt", null, g.termino), crear("dd", null, g.def)]));

  conectarEventos();
  setInterval(revisarInactividad, 1000);
  render();
}

iniciar();
