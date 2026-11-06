/*
  Camino de la privacidad: sonidos suaves del juego.
  Se generan con el navegador (Web Audio), así que no hace falta ningún archivo de audio.
  Se pueden apagar con el interruptor «Sonidos» de abajo de todo.
*/
const CLAVE_SONIDO = "camino-privacidad:sonido";
const VOLUMEN = 1; // volumen general: 1 es el máximo; bajalo (por ejemplo a 0.5) si suena fuerte

let sonidoActivado = true;
try { sonidoActivado = localStorage.getItem(CLAVE_SONIDO) !== "0"; } catch (e) { /* sin almacenamiento */ }

let audio = null;
let salida = null;

function contextoDeAudio() {
  if (!audio) {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return null;
    audio = new Contexto();
    // Compresor: deja el sonido más fuerte y parejo sin que se distorsione
    salida = audio.createDynamicsCompressor();
    salida.threshold.value = -12;
    salida.ratio.value = 4;
    salida.connect(audio.destination);
  }
  if (audio.state === "suspended") audio.resume();
  return audio;
}

// Una nota corta que aparece y se apaga suave
function nota(frecuencia, inicio, duracion, volumen, forma = "sine") {
  const ctx = audio;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = forma;
  osc.frequency.setValueAtTime(frecuencia, ctx.currentTime + inicio);
  const t0 = ctx.currentTime + inicio;
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(volumen * VOLUMEN, t0 + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion);
  osc.connect(env).connect(salida || ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duracion + 0.05);
}

// Notas: do5 523, mi5 659, sol5 784, do6 1047, mi6 1319
const SONIDOS = {
  toque()   { nota(880, 0, 0.07, 0.14); },                                   // clic en un botón
  empezar() { nota(523, 0, 0.14, 0.24, "triangle"); nota(784, 0.1, 0.22, 0.24, "triangle"); },
  paso()    { nota(659, 0, 0.1, 0.14); },                                  // siguiente parada
  bien()    { nota(1047, 0, 0.16, 0.26, "triangle"); nota(1319, 0.11, 0.32, 0.26, "triangle"); },
  mal()     { nota(330, 0, 0.18, 0.26, "triangle"); nota(262, 0.13, 0.3, 0.24, "triangle"); },     // dos notas graves, sin alarma
  nose()    { nota(587, 0, 0.24, 0.2, "triangle"); },                                    // neutro
  final()   { [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.12, i === 3 ? 0.6 : 0.2, 0.24, "triangle")); },
};

function sonar(nombre) {
  if (!sonidoActivado || !SONIDOS[nombre]) return;
  try {
    if (!contextoDeAudio()) return;
    SONIDOS[nombre]();
  } catch (e) {
    // Si el navegador no puede reproducir, el juego sigue igual en silencio
  }
}

function cambiarSonido(activado) {
  sonidoActivado = activado;
  try { localStorage.setItem(CLAVE_SONIDO, activado ? "1" : "0"); } catch (e) { /* nada */ }
  if (activado) sonar("toque");
}
