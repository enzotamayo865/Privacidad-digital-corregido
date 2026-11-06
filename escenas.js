/*
  Escenas: los celulares dibujados que muestran cada situación.
    antes   → se ve junto a la pregunta
    despues → se ve en la explicación, después de responder
    pie     → texto que va debajo del celular (solo con "despues")
    cubre   → el celular ya muestra el mensaje de la pregunta, así que no se repite
*/

// Íconos de línea (24 × 24) que se usan dentro de los celulares
const ICONOS = {
  foto: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.7"/><path d="M4.5 17.5l5-5 4 4 2.5-2.5 3.5 3.5"/></svg>',
  camara: '<svg viewBox="0 0 24 24"><path d="M4 8.5h3.2L9 6h6l1.8 2.5H20V19H4z"/><circle cx="12" cy="13.2" r="3.4"/></svg>',
  contacto: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 19.5c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/></svg>',
  grupo: '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.5"/><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M14.5 15c2.6-.4 4.6.8 5.5 3.5"/></svg>',
  ubicacion: '<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  candado: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
  incognito: '<svg viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M5.6 10.4 7.3 5.4c.3-.9 1.2-1.3 2.1-1l2.6.9 2.6-.9c.9-.3 1.8.1 2.1 1l1.7 5z"/><rect x="2.5" y="10.4" width="19" height="2.3" rx="1.15" fill="currentColor" stroke="none"/><circle cx="7.6" cy="17.2" r="2.9"/><circle cx="16.4" cy="17.2" r="2.9"/><path d="M10.5 16.8c1-.7 2-.7 3 0"/></svg>',
  regalo: '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M3 7h18v3H3zM12 7v13"/><path d="M12 7c-1.4-2.8-5-3.2-5-1.2S10 7 12 7c2 0 5-.2 5-1.2S13.4 4.2 12 7"/></svg>',
  archivo: '<svg viewBox="0 0 24 24"><path d="M6.5 3h7.5l4 4v14h-11.5z"/><path d="M14 3v4h4"/></svg>',
  unaVez: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" stroke-dasharray="3.2 2.2"/><path d="M10.6 9.2l2-1.4V16"/></svg>',
  mensaje: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-4 3.5V16H4z"/></svg>',
  sol: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>',
  linterna: '<svg viewBox="0 0 24 24"><path d="M8 3h8v4l-2 3v11h-4V10L8 7z"/><path d="M11 14h2"/></svg>',
  ajustes: '<svg viewBox="0 0 24 24"><path d="M10.36 4.89 L10.61 2.10 L13.39 2.10 L13.64 4.89 L15.87 5.81 L18.02 4.01 L19.99 5.98 L18.19 8.13 L19.11 10.36 L21.90 10.61 L21.90 13.39 L19.11 13.64 L18.19 15.87 L19.99 18.02 L18.02 19.99 L15.87 18.19 L13.64 19.11 L13.39 21.90 L10.61 21.90 L10.36 19.11 L8.13 18.19 L5.98 19.99 L4.01 18.02 L5.81 15.87 L4.89 13.64 L2.10 13.39 L2.10 10.61 L4.89 10.36 L5.81 8.13 L4.01 5.98 L5.98 4.01 L8.13 5.81 Z"/><circle cx="12" cy="12" r="3.2"/></svg>',
  musica: '<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>',
  reloj: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',
  corazon: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  enviar: '<svg viewBox="0 0 24 24"><path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/></svg>',
  // Íconos de las preguntas 21 a 50
  tel: '<svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4.5-2 1.5a10.5 10.5 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2C11 19.5 4.5 13 4.5 5.5a2 2 0 0 1 2-2z"/></svg>',
  microfono: '<svg viewBox="0 0 24 24"><path d="M12 3.5a2.8 2.8 0 0 1 2.8 2.8v5a2.8 2.8 0 0 1-5.6 0v-5A2.8 2.8 0 0 1 12 3.5zM6 11a6 6 0 0 0 12 0M12 17v3.5"/></svg>',
  numeros: '<svg viewBox="0 0 24 24"><g fill="currentColor" stroke="none"><circle cx="6" cy="4.5" r="1.7"/><circle cx="12" cy="4.5" r="1.7"/><circle cx="18" cy="4.5" r="1.7"/><circle cx="6" cy="10" r="1.7"/><circle cx="12" cy="10" r="1.7"/><circle cx="18" cy="10" r="1.7"/><circle cx="6" cy="15.5" r="1.7"/><circle cx="12" cy="15.5" r="1.7"/><circle cx="18" cy="15.5" r="1.7"/><circle cx="12" cy="21" r="1.7"/></g></svg>',
  sonido: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  banco: '<svg viewBox="0 0 24 24"><path d="M3 9.5 12 4l9 5.5zM5.5 10v7.5M9.8 10v7.5M14.2 10v7.5M18.5 10v7.5M3 20.5h18"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>',
  alerta: '<svg viewBox="0 0 24 24"><path d="M12 3.5 21.5 20h-19z"/><path d="M12 9.8v4.6M12 17.1v.1"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M8 5.5v13l10.5-6.5z"/></svg>',
  zapatilla: '<svg viewBox="0 0 24 24"><path d="M2.5 17.5V9.2c1.6.6 3.3.5 4.6-.4l3.9 3.8c1.3 1 3 1.2 4.7.9l3.6 1.2c1.4.5 2.2 1.6 2.2 2.8z"/><path d="M2.5 17.5h19v.8a1.7 1.7 0 0 1-1.7 1.7H4.2a1.7 1.7 0 0 1-1.7-1.7zM8.6 10.6l1.6-1.4M11 12.6l1.5-1.5"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  grafico: '<svg viewBox="0 0 24 24"><path d="M3.5 20.5h17M5 16l4.5-4.5 3.5 3 6.5-7M15.5 7.5h4v4"/></svg>',
  enlace: '<svg viewBox="0 0 24 24"><path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2"/></svg>',
  tarjeta: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 9.5h19M6 15h4"/></svg>',
  efectivo: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6.5" width="19" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M5.5 9.5v.1M18.5 14.5v.1"/></svg>',
  buscar: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/></svg>',
  wifi: '<svg viewBox="0 0 24 24"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>',
  rayo: '<svg viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M13.5 2.5 5 13.5h5.5L9.5 21.5 19 10h-5.5z"/></svg>',
  compartir: '<svg viewBox="0 0 24 24"><circle cx="17.5" cy="5.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/><path d="M8.7 10.8l6.6-3.9M8.7 13.2l6.6 3.9"/></svg>',
  actualizar: '<svg viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 0 1-13.2 4.9M4.5 12a7.5 7.5 0 0 1 13.2-4.9"/><path d="M18 3.5v4h-4M6 20.5v-4h4"/></svg>',
  borrar: '<svg viewBox="0 0 24 24"><path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 13.5h9l1-13.5M10 10v6.5M14 10v6.5"/></svg>',
  escudo: '<svg viewBox="0 0 24 24"><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M12 8.5v4.5M12 16.2v.1"/></svg>',
  llave: '<svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3.5M15.5 12v2.5"/></svg>',
  nube: '<svg viewBox="0 0 24 24"><path d="M7 18.5h10.5a4 4 0 0 0 .6-8 6 6 0 0 0-11.5 1.6A3.3 3.3 0 0 0 7 18.5z"/></svg>',
};

// Partes que se repiten en varias pantallas
const BARRA_ESTADO = `<div class="barra-estado"><span>10:24</span><span class="iconos-estado"><i class="senal"></i><i class="bat"></i></span></div>`;
const BARRA_ESTADO_CAMARA = `<div class="barra-estado"><span>10:24</span><span class="iconos-estado"><i class="punto-camara"></i><i class="senal"></i><i class="bat"></i></span></div>`;
const CAJA_MENSAJE = `<div class="app-entrada"><span>Mensaje</span><i></i></div>`;
const APPS_INICIO = `
  <div class="inicio-apps">
    <span><i class="ap ap-camara">${ICONOS.camara}</i>Cámara</span>
    <span><i class="ap ap-galeria">${ICONOS.foto}</i>Galería</span>
    <span><i class="ap ap-mensajes">${ICONOS.mensaje}</i>Mensajes</span>
    <span><i class="ap ap-clima">${ICONOS.sol}</i>Clima</span>
    <span><i class="ap ap-mapas">${ICONOS.ubicacion}</i>Mapas</span>
    <span><i class="ap ap-ajustes">${ICONOS.ajustes}</i>Ajustes</span>
    <span><i class="ap ap-musica">${ICONOS.musica}</i>Música</span>
    <span><i class="ap ap-reloj">${ICONOS.reloj}</i>Reloj</span>
  </div>`;

// Arma el celular (marco, parlante, cámara y botones) con el contenido de la pantalla
function telefono(contenido, clase = "") {
  return `
    <div class="telefono">
      <div class="tel-arriba"><span class="tel-parlante"></span><span class="tel-camara"></span></div>
      <div class="pantalla ${clase}">${contenido}</div>
      <span class="tel-inicio"></span>
    </div>`;
}

// Parte de arriba de un chat: flecha para volver, foto y nombre
function cabeceraChat(avatar, nombre, detalle, claseAvatar = "") {
  return `
    <div class="app-barra">
      <span class="atras">‹</span>
      <span class="avatar ${claseAvatar}">${avatar}</span>
      <span><b>${nombre}</b><small>${detalle}</small></span>
    </div>`;
}

// Pantalla de una llamada: entrante (Rechazar / Atender) o en curso (con botones)
function pantallaLlamada({ nombre, detalle, icono, enCurso, arriba = "" }) {
  const botones = enCurso
    ? `<div class="llamada-controles">
        <span><i>${ICONOS.microfono}</i>Silenciar</span>
        <span><i>${ICONOS.numeros}</i>Teclado</span>
        <span><i>${ICONOS.sonido}</i>Altavoz</span>
      </div>
      <div class="llamada-botones"><span><i class="colgar">${ICONOS.tel}</i>Cortar</span></div>`
    : `<div class="llamada-botones">
        <span><i class="colgar">${ICONOS.tel}</i>Rechazar</span>
        <span><i class="atender">${ICONOS.tel}</i>Atender</span>
      </div>`;
  return telefono(`
    ${BARRA_ESTADO}
    ${arriba}
    <div class="llamada-quien">
      <span class="llamada-foto">${icono}</span>
      <b class="llamada-nombre">${nombre}</b>
      <span class="llamada-detalle">${detalle}</span>
    </div>
    ${botones}`, "llamada");
}

// Un código QR de mentira: cuadraditos al azar, pero siempre iguales para la misma semilla
function codigoQr(semilla) {
  let numero = semilla;
  const azar = () => {
    numero = (numero * 16807) % 2147483647;
    return numero / 2147483647;
  };
  // Los tres cuadrados grandes de las esquinas
  const ojo = (x, y) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  let dibujo = ojo(0, 0) + ojo(14, 0) + ojo(0, 14);
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const enUnOjo = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!enUnOjo && azar() < 0.5) dibujo += `M${x} ${y}h1v1h-1z`;
    }
  }
  return `<svg class="qr" viewBox="-1 -1 23 23"><path fill-rule="evenodd" d="${dibujo}"/></svg>`;
}

const ESCENAS = {
  // 1. La galería pide permisos de más
  1: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="fondo-app">
        <div class="app-titulo">Galería</div>
        <div class="grilla-fotos">${"<i></i>".repeat(12)}</div>
      </div>
      <div class="velo"></div>
      <div class="dialogo">
        <span class="app-icono">${ICONOS.foto}</span>
        <p class="dialogo-titulo"><b>Galería</b> quiere acceder a:</p>
        <ul class="dialogo-lista">
          <li>${ICONOS.foto}Fotos</li>
          <li>${ICONOS.camara}Cámara</li>
          <li>${ICONOS.contacto}Contactos</li>
          <li>${ICONOS.ubicacion}Ubicación</li>
        </ul>
        <div class="dialogo-botones"><span>No permitir</span><span class="primario">Permitir</span></div>
      </div>`, "con-dialogo"),
  },

  // 2. El clima pide la ubicación
  2: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="fondo-app">
        <div class="app-titulo">Clima</div>
        <div class="clima-grande">${ICONOS.sol}<span>24°</span></div>
        <div class="clima-dias"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span></div>
      </div>
      <div class="velo"></div>
      <div class="dialogo">
        <span class="app-icono">${ICONOS.ubicacion}</span>
        <p class="dialogo-titulo">¿Permitir que <b>Clima</b> acceda a tu ubicación?</p>
        <div class="dialogo-opciones">
          <span>Todo el tiempo</span>
          <span>Solo mientras usás la app</span>
          <span>No permitir</span>
        </div>
      </div>`, "con-dialogo"),
  },

  // 3. La linterna pide los contactos
  3: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="fondo-app">
        <div class="app-titulo">Linterna</div>
        <div class="linterna-boton">${ICONOS.linterna}</div>
      </div>
      <div class="velo"></div>
      <div class="dialogo">
        <span class="app-icono">${ICONOS.contacto}</span>
        <p class="dialogo-titulo">¿Permitir que <b>Linterna</b> acceda a tus contactos?</p>
        <div class="dialogo-botones"><span>No permitir</span><span class="primario">Permitir</span></div>
      </div>`, "con-dialogo"),
  },

  // 4. El punto de color que avisa que se está usando la cámara
  4: {
    despues: telefono(`
      ${BARRA_ESTADO_CAMARA}
      ${APPS_INICIO}`, "inicio"),
    pie: "El punto de color aparece arriba, junto a la batería, cuando una app usa la cámara o el micrófono.",
  },

  // 7. El cartel de cookies
  7: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="nav-barra">${ICONOS.candado}<span>noticias-del-dia.com.ar</span></div>
      <div class="nav-pagina"><i class="titulo"></i><i class="imagen"></i><i></i><i></i><i class="corta"></i></div>
      <div class="banner-cookies">
        <p><b>Cookies</b><br>Usamos cookies para que la página funcione y para mostrarte publicidad.</p>
        <div class="banner-botones"><span class="primario">Aceptar todas</span><span>Solo necesarias</span></div>
      </div>`, "navegador"),
  },

  // 8. Los datos escondidos de una foto
  8: {
    despues: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra">
        <span class="atras">‹</span>
        <span><b>Galería</b><small>Detalles de la foto</small></span>
      </div>
      <div class="foto-grande"></div>
      <dl class="foto-datos">
        <div><dt>Fecha</dt><dd>14/09 · 18:32</dd></div>
        <div><dt>Celular</dt><dd>Modelo T-2045</dd></div>
        <div class="resaltado"><dt>Lugar</dt><dd>${ICONOS.ubicacion}Calle San Martín 1250</dd></div>
      </dl>`),
    pie: "Datos que pueden viajar escondidos dentro de una foto.",
  },


  // 10. Una página con candado
  10: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="nav-barra resaltada">${ICONOS.candado}<span><b>https://</b>compras-ya.com.ar</span></div>
      <div class="nav-pagina"><i class="titulo"></i><i class="producto"></i><i></i><i class="corta"></i><i class="boton-falso"></i></div>`, "navegador"),
  },

  // 11. Una pestaña de incógnito
  11: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="nav-barra oscura">${ICONOS.incognito}<span>Buscá o escribí una dirección</span></div>
      <div class="incognito">${ICONOS.incognito}<p><b>Pestaña de incógnito</b></p></div>`, "oscura"),
  },

  // 14. El código de la verificación en dos pasos
  14: {
    despues: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra">
        <span class="atras">‹</span>
        <span><b>Iniciar sesión</b><small>Verificación en dos pasos</small></span>
      </div>
      <p class="escena-titulo">Ingresá el código que te llegó</p>
      <div class="codigo"><span>4</span><span>8</span><span>2</span><span>9</span><span>1</span><span class="cursor"></span></div>
      <div class="teclado"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i></i><i>0</i><i></i></div>`),
    pie: "Además de la contraseña, te piden un código.",
  },

  // 15. Te piden el código que llegó por SMS
  15: {
    cubre: true,
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="notificacion">
        <span class="notif-app">${ICONOS.mensaje}Mensajes · ahora</span>
        <p>Tu código de verificación es <b>482-913</b>. No lo compartas con nadie.</p>
      </div>
      ${cabeceraChat("C", "Contacto", "en línea")}
      <div class="chat">
        <div class="burbuja">Te llegó un código por SMS por error, ¿me lo pasás?</div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 16. Un mensaje que apura con un link
  16: {
    cubre: true,
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat("S", "soporte.cuentas", "Mensaje directo")}
      <div class="chat">
        <div class="burbuja">Tu cuenta será eliminada en 24 horas. Apelá acá: <span class="enlace-falso">enlace</span></div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 17. Un sorteo que pide la foto del DNI
  17: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="post-cabecera">
        <span class="avatar regalo">${ICONOS.regalo}</span>
        <b>sorteos.premios.ya</b>
        <span class="mas">···</span>
      </div>
      <div class="post-imagen">${ICONOS.regalo}<span>Sorteo</span></div>
      <div class="post-acciones">${ICONOS.corazon}${ICONOS.mensaje}${ICONOS.enviar}</div>
      <p><b>sorteos.premios.ya</b> ¡Ganate un celular nuevo! Para participar, mandanos tu nombre, DNI, dirección y una foto del DNI.</p>`, "red-social"),
  },

  // 18. Una app paga "gratis"
  18: {
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat("F", "Fede", "en línea")}
      <div class="chat">
        <div class="burbuja">Te paso la app paga, gratis. Instalala.</div>
        <div class="burbuja archivo">${ICONOS.archivo}<span><b>app-premium-gratis.apk</b><small>48 MB · Instalar</small></span></div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 20. Comparten un chat privado en el grupo
  20: {
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat(ICONOS.grupo, "Grupo del curso", "28 participantes")}
      <div class="chat">
        <div class="burbuja"><small class="de">Juli</small>Miren este chat jajaja</div>
        <div class="burbuja captura"><span class="captura-mini"><i></i><i></i><i></i><i></i></span><small>Captura de pantalla</small></div>
        <div class="burbuja"><small class="de">Tomi</small>JAJAJA no puede ser</div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // ---------- Nivel desafío ----------

  // 21. "Cambié de número": piden plata desde un número nuevo
  21: {
    cubre: true,
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat(ICONOS.contacto, "+54 9 11 0142-7788", "Número no agendado")}
      <div class="chat">
        <div class="aviso-chat">Este número no está en tus contactos.<span><b>Bloquear</b><b>Agregar</b></span></div>
        <div class="burbuja">Hola ma, cambié de número.</div>
        <div class="burbuja">¿Me podés transferir $80.000? Es urgente, después te explico.</div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 22. Una llamada "del banco" justo cuando llega un código
  22: {
    antes: pantallaLlamada({
      nombre: "Banco",
      detalle: "Llamada en curso · 00:42",
      icono: ICONOS.banco,
      enCurso: true,
      arriba: `
        <div class="notificacion">
          <span class="notif-app">${ICONOS.mensaje}Mensajes · ahora</span>
          <p>Código de seguridad: <b>739-201</b>. No lo compartas con nadie.</p>
        </div>`,
    }),
  },

  // 23. Un SMS de un paquete retenido
  23: {
    cubre: true,
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat(ICONOS.mensaje, "CORREO-ENVIOS", "Mensaje de texto")}
      <div class="chat">
        <small class="chat-fecha">Hoy 09:12</small>
        <div class="burbuja sms">Tu paquete está retenido por falta de pago. Pagá $350 para recibirlo: <span class="enlace-falso">correo-envios.info/pago</span></div>
      </div>
      <div class="app-entrada"><span>Mensaje de texto</span><i></i></div>`, "app-chat sms"),
  },

  // 24. Un mail que imita a la billetera virtual
  24: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Recibidos</b><small>Correo</small></span></div>
      <p class="mail-asunto">Tu cuenta fue suspendida</p>
      <div class="mail-de">
        <span class="avatar">${ICONOS.mail}</span>
        <span><b>Mi Billetera</b><small>avisos@mibilletera-ayuda.com</small></span>
      </div>
      <p class="mail-texto">Detectamos actividad sospechosa. Verificá tus datos en las próximas 24 horas o tu cuenta será dada de baja.</p>
      <span class="boton-app">Verificar cuenta</span>`, "correo"),
    despues: telefono(`
      ${BARRA_ESTADO}
      <div class="nav-barra">${ICONOS.candado}<span>mibilletera.com.seguridad-cuenta.net/login</span></div>
      <div class="direccion">
        <p class="rotulo-app">Dirección completa</p>
        <p class="direccion-texto">mibilletera.com.<mark>seguridad-cuenta.net</mark>/login</p>
        <p class="direccion-nota">${ICONOS.alerta}<span>La página es <b>seguridad-cuenta.net</b>, no tu billetera.</span></p>
      </div>
      <div class="login">
        <b class="login-marca">Mi Billetera</b>
        <span class="campo">Usuario</span>
        <span class="campo">Clave</span>
        <span class="boton-app">Ingresar</span>
      </div>`, "navegador"),
    pie: "Fijate cómo termina la dirección antes de la primera barra «/»: esa es la página a la que entrás.",
  },

  // 25. Una llamada de "soporte técnico"
  25: {
    antes: pantallaLlamada({
      nombre: "Número privado",
      detalle: "Llamada entrante",
      icono: ICONOS.contacto,
      enCurso: false,
    }),
  },

  // 26. Un audio con una voz copiada
  26: {
    cubre: true,
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat(ICONOS.contacto, "+54 9 11 0179-2240", "Número no agendado")}
      <div class="chat">
        <div class="burbuja audio"><span class="audio-play">${ICONOS.play}</span><span class="audio-ondas">${"<i></i>".repeat(18)}</span><small>0:12</small></div>
        <div class="burbuja">Soy yo, se me rompió el celu. Necesito plata ya, después te explico.</div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 27. Zapatillas a mitad de precio
  27: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="post-cabecera">
        <span class="avatar">${ICONOS.zapatilla}</span>
        <b>zapas.originales.ok</b>
        <span class="mas">···</span>
      </div>
      <div class="post-imagen oferta">${ICONOS.zapatilla}<span>50% OFF</span></div>
      <div class="post-acciones">${ICONOS.corazon}${ICONOS.mensaje}${ICONOS.enviar}</div>
      <p><b>zapas.originales.ok</b> Originales a mitad de precio. Solo transferencia. ¡Quedan 2 pares!</p>
      <p class="comentario"><b>usuario_123</b> re confiable, me llegaron!!</p>`, "red-social"),
  },

  // 28. Un comprobante de transferencia
  28: {
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat("M", "Comprador", "en línea")}
      <div class="chat">
        <div class="burbuja">Listo, ya te transferí. Mandame la bici hoy.</div>
        <div class="burbuja comprobante">
          <span class="comprobante-ok">${ICONOS.check}</span>
          <b>Transferencia enviada</b>
          <span class="comprobante-monto">$85.000</span>
          <small>Comprobante N.º 00483921</small>
        </div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 29. Una publicidad que promete duplicar la plata
  29: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="post-cabecera">
        <span class="avatar">${ICONOS.grafico}</span>
        <span><b>Inversiones Ya</b><small>Publicidad</small></span>
        <span class="mas">···</span>
      </div>
      <div class="post-imagen inversion">
        <span class="famoso">${ICONOS.contacto}<i>${ICONOS.check}</i></span>
        <span class="globo-post">«¡Dupliqué mi plata!»</span>
        <b>x2 en 7 días</b>
      </div>
      <p><b>Inversiones Ya</b> Invertí desde $10.000 y duplicá tu plata en una semana. ¡Cupos limitados!</p>
      <span class="boton-app">Quiero invertir</span>`, "red-social"),
  },

  // 30. Un QR pegado arriba de otro
  30: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="visor">
        <div class="cartel-mesa">
          <b>Pagá con QR · Mesa 12</b>
          <div class="qr-zona">
            <span class="qr-original">${codigoQr(271828)}</span>
            <span class="qr-sticker">${codigoQr(314159)}</span>
          </div>
        </div>
        <i class="esquina e1"></i><i class="esquina e2"></i><i class="esquina e3"></i><i class="esquina e4"></i>
      </div>
      <div class="qr-enlace">${ICONOS.enlace}<span>Abrir <b>pagar-mesa12.com</b></span></div>`, "camara"),
  },

  // 31. Elegir cómo pagar en una tienda nueva
  31: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="nav-barra">${ICONOS.candado}<span>tienda-nueva.com.ar/pagar</span></div>
      <p class="pago-titulo">Elegí cómo pagar</p>
      <p class="pago-total"><span>Total</span><b>$42.000</b></p>
      <ul class="pago-opciones">
        <li class="elegida"><i></i>${ICONOS.banco}<span>Transferencia<small>10% de descuento</small></span></li>
        <li><i></i>${ICONOS.tarjeta}<span>Tarjeta de crédito</span></li>
        <li><i></i>${ICONOS.efectivo}<span>Depósito en efectivo</span></li>
      </ul>
      <span class="boton-app">Continuar</span>`, "navegador"),
  },

  // 32. Un premio que pide pagar el envío
  32: {
    cubre: true,
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat(ICONOS.regalo, "Premios Ya", "Cuenta de empresa", "regalo")}
      <div class="chat">
        <div class="burbuja">¡Felicitaciones! Ganaste un celular. Para recibirlo, pagá $5.000 de envío: <span class="enlace-falso">premios-ya.net</span></div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 33. Una historia con la ubicación
  33: {
    antes: telefono(`
      <div class="historia-barras"><i class="vista"></i><i class="vista"></i><i></i></div>
      <div class="historia-cabecera"><span class="avatar">J</span><b>Tu historia</b><small>Hace 5 min</small></div>
      <div class="historia-foto">
        <span class="ventana"></span>
        <span class="sticker-hora">19:30</span>
        <span class="sticker-texto">Llegué a casa</span>
        <span class="sticker-ubicacion">${ICONOS.ubicacion}BARRIO LOS CEIBOS</span>
      </div>
      <div class="historia-pie"><span>Enviar mensaje</span>${ICONOS.corazon}${ICONOS.enviar}</div>`, "historia"),
  },

  // 34. Una cuenta privada
  34: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="perfil-cabecera"><b>${ICONOS.candado}juli.p</b><span class="mas">···</span></div>
      <div class="perfil-quien"><span class="avatar grande">J</span><span><b>Juli Pérez</b><small>Dibujo, música y mates</small></span></div>
      <div class="perfil-datos">
        <span><b>48</b>fotos</span>
        <span><b>210</b>seguidores</span>
        <span><b>230</b>seguidos</span>
      </div>
      <p class="perfil-aviso">${ICONOS.candado}Cuenta privada: solo te ven tus seguidores</p>
      <div class="grilla-fotos">${"<i></i>".repeat(6)}</div>`, "red-social"),
  },

  // 35. Alguien pide una foto en un juego online
  35: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="juego-escena"><span class="sol-juego"></span><span class="montana"></span><span class="personaje"></span><span class="monedas">500</span></div>
      <div class="juego-chat">
        <p class="sistema">${ICONOS.regalo}nico_14 te regaló 500 monedas</p>
        <p><b>nico_14:</b> ¿me mandás una foto tuya?</p>
        <p><b>nico_14:</b> no le cuentes a nadie, es un secreto entre nosotros</p>
      </div>
      <div class="app-entrada oscura"><span>Escribí en el chat</span><i></i></div>`, "juego-online"),
  },


  // 37. Lo que aparece al buscar un nombre
  37: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="buscador">${ICONOS.buscar}<span>Juli Pérez</span></div>
      <div class="resultado"><small>redsocial.com › juli.p</small><b>Juli Pérez (@juli.p)</b><span>48 publicaciones · fotos y videos</span></div>
      <div class="resultado resaltado"><small>foro-gamer.com › 2019</small><b>«Me copié en el examen y nadie se dio cuenta»</b><span>Publicado por Juli Pérez</span></div>
      <div class="resultado"><small>fotos-fiestas.com › 2018</small><b>Fiesta de egresados: todas las fotos</b><span>Juli Pérez aparece en 23 fotos</span></div>`, "navegador"),
  },

  // 38. Una cuenta repetida que pide seguirte
  38: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Solicitudes</b></span></div>
      <p class="ajustes-titulo">Quiere seguirte</p>
      <div class="cuenta-fila"><span class="avatar">J</span><span><b>juli.perez_</b><small>12 seguidores · cuenta nueva</small></span></div>
      <div class="cuenta-botones"><span class="primario">Confirmar</span><span>Eliminar</span></div>
      <p class="ajustes-titulo">Ya la seguís</p>
      <div class="cuenta-fila"><span class="avatar">J</span><span><b>juli.perez</b><small>1.240 seguidores</small></span><span class="estado">Siguiendo</span></div>`, "red-social"),
  },

  // 39. Redes de wifi abiertas en una plaza
  39: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Wifi</b></span><span class="interruptor-mini encendido"></span></div>
      <p class="ajustes-titulo">Redes disponibles</p>
      <ul class="lista-ajustes">
        <li>${ICONOS.wifi}<span><b>Plaza_Gratis</b><small>Abierta</small></span></li>
        <li>${ICONOS.wifi}<span><b>Plaza Gratis WiFi</b><small>Abierta</small></span></li>
        <li>${ICONOS.wifi}<span><b>Casa_Gomez</b><small>Protegida</small></span>${ICONOS.candado}</li>
      </ul>`, "ajustes"),
  },

  // 40. El aviso que aparece al enchufar el celular a un USB
  40: {
    despues: telefono(`
      ${BARRA_ESTADO}
      <div class="carga">${ICONOS.rayo}<b>Cargando · 34%</b></div>
      <div class="velo"></div>
      <div class="dialogo">
        <span class="app-icono">${ICONOS.alerta}</span>
        <p class="dialogo-titulo">¿Permitir el acceso a los datos del teléfono?</p>
        <p class="dialogo-nota">El dispositivo conectado va a poder ver tus fotos y archivos.</p>
        <div class="dialogo-botones"><span>No permitir</span><span class="primario">Permitir</span></div>
      </div>`, "bloqueada con-dialogo"),
    pie: "Si al enchufarlo aparece este aviso, es porque por ese cable también pueden pasar datos.",
  },

  // 41. Un dispositivo desconocido quiere mandar un archivo
  41: {
    antes: telefono(`
      ${BARRA_ESTADO}
      ${APPS_INICIO}
      <div class="velo"></div>
      <div class="dialogo">
        <span class="app-icono">${ICONOS.compartir}</span>
        <p class="dialogo-titulo"><b>Dispositivo desconocido</b> quiere compartir un archivo</p>
        <p class="dialogo-nota">${ICONOS.archivo}foto_1234.jpg</p>
        <div class="dialogo-botones"><span>Rechazar</span><span class="primario">Aceptar</span></div>
      </div>`, "inicio con-dialogo"),
  },

  // 42. Una actualización del sistema
  42: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Actualización de software</b></span></div>
      <div class="actualizacion">
        <span class="app-icono grande">${ICONOS.actualizar}</span>
        <b>Versión 15.2 disponible</b>
        <small>820 MB</small>
      </div>
      <div class="nav-pagina"><i></i><i></i><i class="corta"></i><i></i><i class="corta"></i></div>
      <span class="boton-app">Descargar e instalar</span>`, "ajustes"),
  },

  // 43. El código se lee con el celular bloqueado
  43: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <span class="bloqueo-candado">${ICONOS.candado}</span>
      <p class="bloqueo-hora">10:24</p>
      <p class="bloqueo-fecha">jueves, 12 de marzo</p>
      <div class="notificacion">
        <span class="notif-app">${ICONOS.mensaje}Mensajes · ahora</span>
        <p>Tu código de verificación es <b>518-406</b>. No lo compartas con nadie.</p>
      </div>`, "bloqueada"),
  },

  // 44. Desbloquear con un PIN
  44: {
    despues: telefono(`
      ${BARRA_ESTADO}
      <span class="bloqueo-candado">${ICONOS.candado}</span>
      <p class="escena-titulo">Ingresá tu PIN</p>
      <div class="pin-puntos"><i class="lleno"></i><i class="lleno"></i><i class="lleno"></i><i></i><i></i><i></i></div>
      <div class="teclado claro"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i></i><i>0</i><i></i></div>`, "bloqueada"),
    pie: "Un PIN de 6 números que no sea una fecha es difícil de adivinar.",
  },

  // 45. Encontrar el celular desde otro dispositivo
  45: {
    despues: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Encontrar dispositivo</b><small>Mi celular · visto hace 3 min</small></span></div>
      <div class="mapa-falso"><span class="pin-mapa">${ICONOS.ubicacion}</span></div>
      <ul class="acciones-tel">
        <li>${ICONOS.sonido}Hacer sonar</li>
        <li>${ICONOS.candado}Bloquear</li>
        <li class="peligro">${ICONOS.borrar}Borrar</li>
      </ul>`),
    pie: "Desde otro celular o una compu podés hacerlo sonar, bloquearlo o borrarlo.",
  },

  // 46. No podés entrar a tu cuenta
  46: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="login">
        <span class="logo-app">${ICONOS.contacto}</span>
        <span class="campo">juli.p</span>
        <span class="campo error">••••••••</span>
        <p class="error-texto">${ICONOS.alerta}La contraseña no es correcta.</p>
        <span class="boton-app">Iniciar sesión</span>
        <span class="enlace-app">¿Olvidaste tu contraseña?</span>
      </div>`, "red-social"),
  },

  // 47. Una contraseña que apareció en una filtración
  47: {
    antes: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Revisión de contraseñas</b></span></div>
      <div class="alerta-tarjeta">${ICONOS.escudo}<span><b>1 contraseña expuesta</b><small>Apareció en una filtración de datos</small></span></div>
      <ul class="lista-ajustes">
        <li>${ICONOS.llave}<span><b>tienda-ropa.com</b><small>juli.p@correo.com</small></span></li>
      </ul>
      <span class="boton-app">Cambiar contraseña</span>`, "ajustes"),
  },

  // 48. Una amenaza por mensaje
  48: {
    cubre: true,
    antes: telefono(`
      ${BARRA_ESTADO}
      ${cabeceraChat("?", "Desconocido", "Te escribió por primera vez")}
      <div class="chat">
        <div class="burbuja">Tengo una foto tuya.</div>
        <div class="burbuja">Si no me pagás, se la mando a todos tus contactos.</div>
      </div>
      ${CAJA_MENSAJE}`, "app-chat"),
  },

  // 49. Restablecer el celular antes de venderlo
  49: {
    despues: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Restablecer datos de fábrica</b></span></div>
      <div class="aviso-ajustes">${ICONOS.alerta}<p>Se va a borrar todo lo que hay en el celular:</p></div>
      <ul class="lista-ajustes">
        <li>${ICONOS.contacto}<span>Cuentas de Google o Apple</span></li>
        <li>${ICONOS.foto}<span>Fotos y videos</span></li>
        <li>${ICONOS.mensaje}<span>Mensajes y apps</span></li>
      </ul>
      <span class="boton-app peligro">Borrar todo</span>`, "ajustes"),
    pie: "Así queda como nuevo y sin tus datos. Antes, hacé una copia de seguridad.",
  },

  // 50. Un celular roto, y la copia de seguridad que salva las fotos
  50: {
    antes: telefono(`
      <svg class="rajadura" viewBox="0 0 200 340" preserveAspectRatio="none">
        <path d="M132 112 200 70M132 112 200 128M132 112 178 0M132 112 104 0M132 112 0 66M132 112 0 196M132 112 62 340M132 112 150 340M132 112 200 250M166 91 186 60M86 84 60 36M44 274 14 320M154 222 192 232M120 101 145 104 141 124 123 125Z"/>
        <circle cx="132" cy="112" r="3" fill="#dce6fa" stroke="none"/>
      </svg>`, "rota"),
    despues: telefono(`
      ${BARRA_ESTADO}
      <div class="app-barra"><span class="atras">‹</span><span><b>Copia de seguridad</b></span></div>
      <div class="alerta-tarjeta ok">${ICONOS.nube}<span><b>Tus fotos están en la nube</b><small>Última copia: hoy, 10:24</small></span></div>
      <ul class="lista-ajustes">
        <li>${ICONOS.foto}<span>Fotos y videos</span><span class="interruptor-mini encendido"></span></li>
        <li>${ICONOS.contacto}<span>Contactos</span><span class="interruptor-mini encendido"></span></li>
        <li>${ICONOS.mensaje}<span>Mensajes</span><span class="interruptor-mini encendido"></span></li>
      </ul>`, "ajustes"),
    pie: "Con la copia automática, tus fotos se recuperan en otro celular.",
  },
};
