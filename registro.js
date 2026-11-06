/*
  Camino de la privacidad: guarda las respuestas en una planilla de Google Sheets.

  Es anónimo: solo se manda qué pregunta se respondió, qué opción se eligió y si estaba bien.
  No se guarda ningún nombre, mail ni dato de la persona.

  Además, cada respuesta queda guardada en esta compu, y abajo de todo hay un botón
  para descargarlas en un archivo que abre Excel.

  Para mandarlas a Google Sheets, pegá entre las comillas la dirección de la aplicación web de Apps Script
  (termina en /exec). Si queda vacío, la página funciona igual pero no guarda nada.
*/
const URL_PLANILLA = "https://script.google.com/macros/s/AKfycbwxmMJ7eL8mt_l0I1TWZscg1k8vpJb2r3Edre7BYfuEPOiGoKjvqnAfYnyg_oUyZMVL-g/exec";

const CLAVE_PENDIENTES = "camino-privacidad:pendientes";
const MAX_PENDIENTES = 2000; // por si queda mucho tiempo sin internet

// Código al azar para agrupar las respuestas de una misma partida, sin saber quién es
function nuevoCodigoPartida() {
  const letras = "abcdefghijkmnpqrstuvwxyz23456789";
  let codigo = "";
  for (let i = 0; i < 8; i++) codigo += letras[Math.floor(Math.random() * letras.length)];
  return codigo;
}

function leerPendientes() {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE_PENDIENTES) || "[]");
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

function guardarPendientes(lista) {
  try {
    if (lista.length) localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(lista.slice(-MAX_PENDIENTES)));
    else localStorage.removeItem(CLAVE_PENDIENTES);
  } catch (error) {
    // Si el navegador no deja guardar, se pierde solo lo que no se pudo mandar
  }
}

let enviando = false;
const CLAVE_ENVIADAS = "camino-privacidad:enviadas";

function contarEnviadas(cuantas) {
  try {
    const total = Number(localStorage.getItem(CLAVE_ENVIADAS) || 0) + cuantas;
    localStorage.setItem(CLAVE_ENVIADAS, String(total));
    return total;
  } catch (error) {
    return cuantas;
  }
}

// Muestra abajo de todo cuántas respuestas se mandaron y cuántas esperan (sirve para revisar que ande)
function mostrarEstadoEnvio(texto) {
  const lugar = document.getElementById("estado-envio");
  if (lugar) { lugar.hidden = false; lugar.textContent = texto; }
}

function actualizarEstadoEnvio() {
  let enviadas = 0;
  try { enviadas = Number(localStorage.getItem(CLAVE_ENVIADAS) || 0); } catch (e) { /* nada */ }
  const esperando = leerPendientes().length;
  if (!enviadas && !esperando) return;
  mostrarEstadoEnvio(`Respuestas enviadas a la planilla de Google: ${enviadas}` +
    (esperando ? ` · esperando conexión: ${esperando}` : ""));
}

// Manda todo lo que esté esperando, de a 8 respuestas por vez, dentro de la dirección (GET).
// Si no hay internet, queda guardado y se reintenta después.
async function enviarPendientes() {
  if (!URL_PLANILLA || enviando) return;
  const lista = leerPendientes();
  if (!lista.length) { actualizarEstadoEnvio(); return; }
  enviando = true;
  const tanda = lista.slice(0, 8);
  const filas = tanda.map((f) => [f.hora, f.partida, f.recorrido, f.parada, f.pregunta, f.opcion, f.resultado, f.stand]);
  try {
    await fetch(URL_PLANILLA + "?d=" + encodeURIComponent(JSON.stringify(filas)), {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
    });
    // Llegó: se sacan de la lista las que se mandaron
    const resto = leerPendientes().slice(tanda.length);
    guardarPendientes(resto);
    contarEnviadas(tanda.length);
    enviando = false;
    actualizarEstadoEnvio();
    if (resto.length) enviarPendientes();
  } catch (error) {
    enviando = false; // sin conexión: se vuelve a intentar más tarde
    actualizarEstadoEnvio();
  }
}

// ---------- Copia local: todas las respuestas quedan guardadas en esta compu ----------
const CLAVE_HISTORIAL = "camino-privacidad:historial";
const MAX_HISTORIAL = 50000;

function leerHistorial() {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) || "[]");
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

function guardarEnHistorial(fila) {
  try {
    const lista = leerHistorial();
    lista.push(fila);
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(lista.slice(-MAX_HISTORIAL)));
  } catch (error) {
    // Si el navegador no deja guardar, se sigue jugando igual
  }
  actualizarConteoLocal();
}

// Borra las respuestas guardadas en esta compu y pone en cero el contador de enviadas
// (no toca las que esperan conexión, para no perder respuestas que todavía no llegaron a la planilla)
function borrarHistorial() {
  try {
    localStorage.removeItem(CLAVE_HISTORIAL);
    localStorage.removeItem(CLAVE_ENVIADAS);
  } catch (error) { /* nada */ }
  const lugar = document.getElementById("estado-envio");
  if (lugar) { lugar.hidden = true; lugar.textContent = ""; }
  actualizarConteoLocal();
  actualizarEstadoEnvio();
}

function actualizarConteoLocal() {
  const lugar = document.getElementById("conteo-local");
  if (!lugar) return;
  const lista = leerHistorial();
  const partidas = new Set(lista.map((f) => f.partida)).size;
  lugar.textContent = lista.length
    ? `En esta compu hay ${lista.length} respuestas guardadas, de ${partidas} ${partidas === 1 ? "partida" : "partidas"}.`
    : "Todavía no hay respuestas guardadas en esta compu.";
}

// Saca las marcas especiales de los textos (<<palabra>>, [[menú]], etc.)
function textoPlano(texto) {
  return String(texto || "")
    .replace(/<<([^|>]+)(\|[^>]*)?>>/g, "$1")
    .replace(/\[\[(.+?)\]\]/g, (_, r) => r.replace(/\s*>\s*/g, " › "))
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\{\{(.+?)\}\}/g, "$1")
    .replace(/<[^>]+>/g, "");
}

// Arma un archivo de Excel con las mismas dos hojas que la planilla de Google:
//   «Partidas»: una fila por persona, con sus totales y la letra que eligió en P1 a P50.
//   «Preguntas»: una fila por pregunta, con cuántos respondieron bien, mal y «No sé»,
//   cuántos eligieron cada letra y la opción incorrecta más elegida.
// Se usa el formato XML de Excel (sin librerías). Al abrirlo, Excel puede avisar que el formato
// no coincide con la extensión: se toca «Sí» y abre normal.
function descargarExcel() {
  const preguntas = typeof PREGUNTAS !== "undefined" ? PREGUNTAS.slice().sort((a, b) => a.n - b.n) : [];
  const porNumero = {};
  preguntas.forEach((p) => { porNumero[p.n] = p; });
  const cantidad = { rapido: 10, completo: 20 };
  const nombreRecorrido = { rapido: "Rápido", completo: "Completo" };

  const resultado = (n, letra) => {
    const p = porNumero[n];
    if (!p || !letra || !p.opciones[letra]) return "";
    if (letra === p.correcta) return "bien";
    return p.opciones[letra].nose ? "nose" : "mal";
  };

  // Junta las respuestas por partida. Si una parada aparece dos veces, vale la última.
  const partidas = {};
  const orden = [];
  leerHistorial().forEach((f) => {
    if (!f || !f.partida || !porNumero[f.pregunta]) return;
    if (!partidas[f.partida]) {
      partidas[f.partida] = { recorrido: f.recorrido, paradas: {} };
      orden.push(f.partida);
    }
    partidas[f.partida].paradas[f.parada] = { pregunta: f.pregunta, opcion: f.opcion };
  });

  const titulosPartidas = ["Partida", "Recorrido", "Completa", "Respondidas", "Bien", "Mal", "No sé", "% de aciertos"]
    .concat(preguntas.map((p) => "P" + p.n));
  const filasPartidas = orden.map((codigo) => {
    const partida = partidas[codigo];
    const letras = {};
    Object.values(partida.paradas).forEach((r) => { letras[r.pregunta] = r.opcion; });
    const cuenta = { bien: 0, mal: 0, nose: 0 };
    Object.keys(letras).forEach((n) => { const r = resultado(Number(n), letras[n]); if (r) cuenta[r]++; });
    const respondidas = cuenta.bien + cuenta.mal + cuenta.nose;
    return [codigo, nombreRecorrido[partida.recorrido] || "Rápido",
      respondidas >= (cantidad[partida.recorrido] || 10) ? "Sí" : "No",
      respondidas, cuenta.bien, cuenta.mal, cuenta.nose,
      { porcentaje: respondidas ? cuenta.bien / respondidas : "" }]
      .concat(preguntas.map((p) => letras[p.n] || ""));
  });

  const titulosPreguntas = ["Pregunta", "Sección", "Correcta", "Respondieron", "Bien", "Mal", "No sé", "% bien",
    "Eligieron a", "Eligieron b", "Eligieron c", "Eligieron d", "Incorrecta más elegida"];
  const filasPreguntas = preguntas.map((p, i) => {
    const elegidas = { a: 0, b: 0, c: 0, d: 0 };
    const cuenta = { bien: 0, mal: 0, nose: 0 };
    filasPartidas.forEach((fila) => {
      const letra = fila[8 + i];
      if (!letra) return;
      elegidas[letra] = (elegidas[letra] || 0) + 1;
      const r = resultado(p.n, letra);
      if (r) cuenta[r]++;
    });
    const respondieron = cuenta.bien + cuenta.mal + cuenta.nose;
    let peor = "", maximo = 0;
    Object.keys(p.opciones).forEach((letra) => {
      if (letra !== p.correcta && !p.opciones[letra].nose && elegidas[letra] > maximo) { maximo = elegidas[letra]; peor = letra; }
    });
    return ["P" + p.n, (typeof SECCIONES !== "undefined" && SECCIONES[p.seccion]) || "", p.correcta,
      respondieron, cuenta.bien, cuenta.mal, cuenta.nose, { porcentaje: respondieron ? cuenta.bien / respondieron : "" },
      elegidas.a, elegidas.b, elegidas.c, p.opciones.d ? elegidas.d : "", peor];
  });

  // Escribe una hoja en el formato XML de Excel
  const xml = (texto) => String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const celda = (valor) => {
    if (valor && typeof valor === "object") {
      return valor.porcentaje === "" ? "<Cell/>" : `<Cell ss:StyleID="pct"><Data ss:Type="Number">${valor.porcentaje}</Data></Cell>`;
    }
    if (typeof valor === "number") return `<Cell><Data ss:Type="Number">${valor}</Data></Cell>`;
    return valor === "" ? "<Cell/>" : `<Cell><Data ss:Type="String">${xml(valor)}</Data></Cell>`;
  };
  const hoja = (nombre, titulos, filas) =>
    `<Worksheet ss:Name="${nombre}"><Table>` +
    `<Row>${titulos.map((t) => `<Cell ss:StyleID="titulo"><Data ss:Type="String">${xml(t)}</Data></Cell>`).join("")}</Row>` +
    filas.map((fila) => `<Row>${fila.map(celda).join("")}</Row>`).join("") +
    `</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/>` +
    `<SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane><ActivePane>2</ActivePane></WorksheetOptions></Worksheet>`;

  const contenido = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
    '<Styles><Style ss:ID="titulo"><Font ss:Bold="1"/></Style><Style ss:ID="pct"><NumberFormat ss:Format="0%"/></Style></Styles>' +
    hoja("Partidas", titulosPartidas, filasPartidas) +
    hoja("Preguntas", titulosPreguntas, filasPreguntas) +
    "</Workbook>";

  const archivo = new Blob([contenido], { type: "application/vnd.ms-excel" });
  const enlace = document.createElement("a");
  const hoy = new Date().toISOString().slice(0, 10);
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = `respuestas-camino-privacidad-${hoy}.xls`;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}

// Se llama cada vez que alguien responde una pregunta
function registrarRespuesta(datos) {
  const fila = { ...datos, hora: new Date().toISOString() };
  guardarEnHistorial(fila);          // siempre: copia en esta compu
  if (!URL_PLANILLA) return;         // y, si hay planilla, también a Google Sheets
  const lista = leerPendientes();
  lista.push(fila);
  guardarPendientes(lista);
  enviarPendientes();
}

// Reintentos: al volver internet y cada 30 segundos
window.addEventListener("online", enviarPendientes);
document.addEventListener("DOMContentLoaded", () => { actualizarEstadoEnvio(); actualizarConteoLocal(); });
setInterval(enviarPendientes, 30000);
enviarPendientes();
