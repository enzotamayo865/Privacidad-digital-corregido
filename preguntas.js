/*
  Camino de la privacidad: contenido del juego.
  Acá están las secciones, las 50 preguntas con sus explicaciones,
  los recorridos, el glosario y los niveles de la licencia final.
  En cada partida se mezclan las 50 y se eligen algunas al azar.

  Marcas que se pueden usar en los textos:
    <<palabra>> o <<palabra|clave>>  palabra del glosario (se toca para ver qué significa)
    [[A > B]]                         ruta de menú del celular
    `x`                               texto técnico
    {{x}}                             enlace falso
*/

const SECCIONES = {
  // Nivel básico (preguntas 1 a 20)
  1: "Permisos de las apps",
  2: "Tus datos",
  3: "Navegación y cuentas",
  4: "Situaciones de riesgo",
  // Nivel desafío (preguntas 21 a 50)
  5: "Mensajes y llamadas falsas",
  6: "Compras y plata",
  7: "Redes sociales",
  8: "Celular y wifi",
  9: "Si algo sale mal",
};

// Cada pregunta tiene su número (n), la sección, la letra correcta,
// un consejo para recordar y las opciones (de 2 a 4) con el porqué de cada una.
// "contexto" y "mensaje" son opcionales: sirven para mostrar lo que te escriben o te dicen.
// Las opciones "No sé" llevan nose: true.
const PREGUNTAS = [
  // ---------- 1. Permisos de las apps ----------
  {
    n: 1, seccion: 1, correcta: "c",
    consejo: "Dale a cada app solo los permisos que necesita para funcionar.",
    texto: "Instalás una app de fotos y te pide permiso para usar tus fotos, la cámara, tus contactos y tu ubicación. ¿Qué hacés?",
    opciones: {
      a: { texto: "Acepto todo, y después reviso los permisos en Configuración.", porque: "Revisar está bien, pero mientras tanto la app ya pudo copiar tus contactos y tu ubicación. Mejor no darlos desde el principio." },
      b: { texto: "Rechazo todo y voy aceptando lo que me pida al usarla.", porque: "Si rechazás todo, la app no puede ni sacar fotos. Lo justo es darle solo lo que necesita: tus fotos y la cámara." },
      c: { texto: "Acepto fotos y cámara, y nada más.", porque: "Una app de fotos solo necesita tus fotos y la cámara. Tus contactos y el lugar donde estás no tienen nada que ver con sacar fotos." },
    },
  },
  {
    n: 2, seccion: 1, correcta: "b",
    consejo: "Elegí la ubicación «solo mientras usás la app».",
    texto: "Una app te pregunta si puede usar tu ubicación «todo el tiempo» o «solo mientras usás la app». ¿Cuál es la diferencia?",
    opciones: {
      a: { texto: "Que con «todo el tiempo» la ubicación es más exacta.", porque: "La exactitud es la misma. Lo único que cambia es cuándo la app puede saber dónde estás." },
      b: { texto: "Que una sabe dónde estás aunque no la uses.", porque: "Con ese permiso, la app puede seguir tus pasos todo el día, incluso con el celular en el bolsillo. Casi siempre conviene elegir «solo mientras usás la app»." },
      c: { texto: "Que con «solo mientras la usás» te pregunta cada vez.", porque: "No te pregunta cada vez: la usa sola, pero únicamente con la app abierta. Con «todo el tiempo», también con la app cerrada." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 3, seccion: 1, correcta: "a",
    consejo: "Antes de darle tus contactos a una app, pensá si de verdad los necesita.",
    texto: "Le das permiso a una app para ver tus contactos. ¿Qué puede ver?",
    opciones: {
      a: { texto: "Toda tu agenda, y la puede copiar.", porque: "Puede leer todo lo que guardaste de tus contactos, y muchas apps lo suben a sus servidores. Tus contactos nunca dieron permiso para eso." },
      b: { texto: "Solo los contactos que también usan esa app.", porque: "Ve toda tu agenda, tengan o no la app. Así muchas apps saben de personas que nunca se registraron." },
      c: { texto: "Toda tu agenda, pero solo dentro de tu celular.", porque: "Muchas apps suben la agenda entera a sus servidores. Una vez que sale de tu celular, no sabés qué hacen con ella." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 4, seccion: 1, correcta: "b",
    consejo: "Si ves el puntito de color sin estar usando la cámara o el micrófono, fijate qué app es.",
    texto: "¿Cómo te das cuenta de que una app está usando la cámara o el micrófono?",
    opciones: {
      a: { texto: "Te llega una notificación con el nombre de la app.", porque: "No llega ninguna notificación: el aviso es un puntito o un ícono arriba en la pantalla, y es fácil no verlo." },
      b: { texto: "Aparece un puntito de color arriba.", porque: "En iPhone es verde (cámara) o naranja (micrófono); en Android, desde la versión 12, aparece un ícono verde. Si lo ves sin estar usándolos, fijate qué app es." },
      c: { texto: "Se prende una lucecita al lado de la cámara.", porque: "Eso pasa en algunas compus, pero en los celulares el aviso es un puntito o un ícono arriba en la pantalla." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 5, seccion: 1, correcta: "a",
    consejo: "Revisá cada tanto qué permisos tienen tus apps, y sacales los que no necesitan.",
    texto: "Hace un año instalaste una app de linterna para un corte de luz. Hoy ves que tiene permiso para usar tu ubicación. ¿Qué conviene hacer?",
    opciones: {
      a: { texto: "Sacarle el permiso, o desinstalarla.", porque: "Una linterna no necesita saber dónde estás. Las apps que ya no usás pueden seguir juntando datos, así que conviene revisar los <<permisos>> cada tanto." },
      b: { texto: "Apagar la ubicación del celular cuando no la uso.", porque: "Sirve un rato, pero cuando la prendas para otra cosa, la linterna también la va a poder usar. Es más fácil sacarle el permiso." },
      c: { texto: "Cerrar la app cada vez que la uso.", porque: "Cerrarla no le saca el permiso: algunas apps pueden usar la ubicación aunque estén cerradas." },
      d: { texto: "No sé cómo se saca un permiso.", nose: true, porque: "En Android, abrí Configuración y buscá [[Administrador de permisos]]. En iPhone, entrá a [[Configuración > Privacidad y seguridad]]." },
    },
  },

  // ---------- 2. Tus datos ----------
  {
    n: 6, seccion: 2, correcta: "c",
    consejo: "Tus datos valen, aunque no tengas nada que ocultar.",
    contexto: "Un amigo te dice:",
    mensaje: "No me importan mis datos, no tengo nada que ocultar.",
    texto: "¿Tiene razón?",
    opciones: {
      a: { texto: "Sí, mientras no publique datos como el DNI.", porque: "No hace falta el DNI: con lo que mirás, dónde estás y qué comprás se arma un perfil tuyo." },
      b: { texto: "Sí, porque los datos que juntan las apps son anónimos.", porque: "Muchas veces no son anónimos, y aunque lo sean, juntando varios datos se puede saber quién sos." },
      c: { texto: "No: con sus datos arman un perfil de él.", porque: "No se trata de ocultar algo malo. Con lo que hacés en el celular se arma un <<perfil>> tuyo que se usa para venderte cosas y, si hay una <<filtración>>, para estafarte." },
    },
  },
  {
    n: 7, seccion: 2, correcta: "a",
    consejo: "En los carteles de cookies, tocá «Rechazar» o «Solo necesarias».",
    texto: "Entrás a una página y aparece un cartel sobre <<cookies>>. ¿Qué te conviene tocar?",
    opciones: {
      a: { texto: "«Rechazar» o «Solo necesarias».", porque: "La página sigue funcionando igual y les das menos datos a las empresas de publicidad." },
      b: { texto: "«Aceptar todas», y después borro las cookies.", porque: "Borrarlas ayuda, pero mientras tanto ya registraron lo que hiciste. Es más simple rechazarlas al entrar." },
      c: { texto: "«Aceptar», si la página es conocida y confiable.", porque: "Que sea conocida no cambia nada: las cookies de publicidad te siguen igual de página en página." },
      d: { texto: "No sé qué son las cookies.", nose: true, porque: "Son archivitos que las páginas guardan en tu navegador. Algunas hacen que la página funcione y otras registran lo que mirás." },
    },
  },
  {
    n: 8, seccion: 2, correcta: "b",
    consejo: "Si no querés que tus fotos digan dónde las sacaste, desactivá la ubicación en la cámara.",
    texto: "¿Una foto puede guardar el lugar exacto donde la sacaste?",
    opciones: {
      a: { texto: "Solo si la subís a una red con la ubicación puesta.", porque: "La ubicación puede ir dentro del archivo aunque no la agregues. Si mandás la foto como documento o por mail, viaja con ella." },
      b: { texto: "Sí, si la cámara tenía la ubicación.", porque: "Las fotos guardan datos ocultos (<<metadatos>>): la fecha, el modelo del celular y, a veces, el lugar exacto. Se puede desactivar en la configuración de la cámara." },
      c: { texto: "No: WhatsApp y las redes se la borran siempre.", porque: "Muchas apps la borran al mandarla, pero no todas. Y si mandás la foto como documento o por mail, viaja con ella." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 9, seccion: 2, correcta: "a",
    consejo: "No hace falta apagar todo por miedo: alcanza con no aceptar conexiones de desconocidos.",
    texto: "Tenés el Bluetooth prendido todo el día para los auriculares. ¿Te pueden sacar datos del celular por eso?",
    opciones: {
      a: { texto: "Es difícil, si no aceptás conexiones raras.", porque: "Con el Bluetooth prendido no te roban datos así nomás: hace falta que aceptes la conexión. Lo importante es no aceptar pedidos de dispositivos que no conocés y tener el celular actualizado." },
      b: { texto: "Sí: cualquiera cerca se puede conectar y ver tus archivos.", porque: "No es tan fácil: para conectarse, el otro dispositivo necesita que vos aceptes. Con el celular actualizado, el riesgo es muy bajo." },
      c: { texto: "Sí, por eso hay que apagarlo cada vez que salís.", porque: "No hace falta apagarlo siempre: el riesgo es bajo si tenés el celular actualizado y no aceptás conexiones de desconocidos." },
    },
  },

  // ---------- 3. Navegación y cuentas ----------
  {
    n: 10, seccion: 3, correcta: "c",
    consejo: "El candado no alcanza: mirá bien la dirección de la página.",
    texto: "Una página tiene un candado al lado de la dirección. ¿Qué quiere decir?",
    opciones: {
      a: { texto: "Que la página está registrada como empresa real.", porque: "No: cualquiera, incluso un estafador, consigue el candado gratis en minutos, sin demostrar quién es." },
      b: { texto: "Que la página no guarda los datos que le mandás.", porque: "La página recibe todo lo que le mandes y lo puede guardar." },
      c: { texto: "Que la conexión es segura, nada más.", porque: "El candado (<<https>>) quiere decir que la conexión está <<cifrada>>: nadie puede leer en el camino lo que mandás. Pero las páginas falsas también lo tienen. Para saber si es la verdadera, mirá bien la dirección." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 11, seccion: 3, correcta: "a",
    consejo: "El modo incógnito no te hace invisible.",
    texto: "¿Qué hace el <<modo incógnito>> del navegador?",
    opciones: {
      a: { texto: "No guarda el historial en tu dispositivo.", porque: "Pero no te hace invisible: el wifi, tu compañía de internet y las páginas donde iniciás sesión igual ven lo que hacés." },
      b: { texto: "Esconde lo que hacés del wifi de tu casa o del colegio.", porque: "No: el wifi y tu compañía de internet igual pueden ver a qué páginas entrás." },
      c: { texto: "No deja que las páginas te identifiquen ni te sigan.", porque: "Las páginas igual saben desde dónde te conectás, y si iniciás sesión, saben que sos vos." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 12, seccion: 3, correcta: "b",
    consejo: "Usá contraseñas largas, por ejemplo cuatro palabras al azar.",
    texto: "¿Cuál de estas contraseñas es más difícil de adivinar?",
    opciones: {
      a: { texto: "Juan2005!", porque: "Un nombre con un año es lo primero que prueban, y esos datos suelen estar en tus redes." },
      b: { texto: "mate-lluvia-tren-azul", porque: "Lo que más cuenta es el largo: cuatro palabras al azar suman más de 20 letras y son fáciles de recordar." },
      c: { texto: "micontraseñasegura2024", porque: "Es larga, pero son palabras comunes y un año: está en las listas que los programas prueban primero." },
      d: { texto: "K9#x!q2", porque: "Es rara, pero corta: con 7 caracteres, un programa la adivina rápido. El largo pesa más que los símbolos." },
    },
  },
  {
    n: 13, seccion: 3, correcta: "c",
    consejo: "Usá una contraseña distinta en cada cuenta importante.",
    texto: "Para no olvidarte, usás la misma contraseña en todas tus cuentas, pero le cambiás el número del final: Lucas1, Lucas2, Lucas3… ¿Es seguro?",
    opciones: {
      a: { texto: "Sí, si la parte que se repite tiene símbolos y números.", porque: "Los símbolos ayudan, pero si se filtra una, las demás se adivinan cambiando el número del final." },
      b: { texto: "Sí, si las cambio todas cada tres meses.", porque: "Cambiarlas no sirve si el patrón sigue siendo el mismo: con conocer una, adivinan la nueva." },
      c: { texto: "No: con una, adivinan las demás.", porque: "Si se filtra una contraseña, prueban variaciones en todas tus cuentas. Usá una distinta en cada cuenta importante: un <<gestor de contraseñas>>, como el de Google o el del iPhone, las recuerda por vos." },
    },
  },
  {
    n: 14, seccion: 3, correcta: "a",
    consejo: "Activá la verificación en dos pasos, empezando por tu mail.",
    texto: "Activaste la <<verificación en dos pasos>> en tu mail, y alguien consigue tu contraseña. ¿Qué pasa?",
    opciones: {
      a: { texto: "Le falta el código que te llega a vos.", porque: "Además de la contraseña, le piden un código o un <<PIN|pin>> que solo tenés vos. En WhatsApp se activa en [[Ajustes > Cuenta > Verificación en dos pasos]]." },
      b: { texto: "Entra, pero te avisan y podés cerrarle la sesión.", porque: "Sin el código no llega a entrar. Algunos servicios avisan del intento, pero la protección es justamente que le falta el código." },
      c: { texto: "No entra desde un celular, pero sí desde una compu.", porque: "Da igual desde dónde lo intente: en cualquier dispositivo nuevo le van a pedir el código." },
      d: { texto: "No sé qué es.", nose: true, porque: "Es un segundo paso para entrar a tu cuenta: además de la contraseña, te piden un código." },
    },
  },

  // ---------- 4. Situaciones de riesgo ----------
  {
    n: 15, seccion: 4, correcta: "c",
    consejo: "Nunca pases un código que te llega por SMS, aunque te lo pida un conocido.",
    contexto: "Un contacto te escribe:",
    mensaje: "Te llegó un código por SMS por error, ¿me lo pasás?",
    texto: "¿Qué hacés?",
    opciones: {
      a: { texto: "Se lo paso solo si me explica bien para qué es.", porque: "Te van a dar una excusa creíble. Ese código no se pasa nunca, a nadie." },
      b: { texto: "Le pido que me mande un audio para ver si es él.", porque: "Aunque sea él, ese código sirve para abrir tu WhatsApp en otro celular. Y los audios se pueden copiar." },
      c: { texto: "No se lo paso y lo llamo para avisarle.", porque: "Ese código sirve para abrir tu WhatsApp en otro celular: si lo pasás, te roban la cuenta. Seguramente a tu contacto ya le robaron la suya." },
    },
  },
  {
    n: 16, seccion: 4, correcta: "b",
    consejo: "Si un mensaje te apura con un link, no lo toques: revisá tu cuenta desde la app.",
    contexto: "Te escriben por Instagram:",
    mensaje: "Tu cuenta será eliminada en 24 horas. Apelá acá: {{enlace}}",
    texto: "¿Qué hacés?",
    opciones: {
      a: { texto: "Entro al link si en la dirección dice «instagram».", porque: "Las direcciones falsas suelen incluir la palabra «instagram» para engañar. Revisá tu cuenta desde la app." },
      b: { texto: "Reviso mi cuenta desde la app.", porque: "El apuro de «24 horas» es una trampa clásica. Si hubiera un problema de verdad, lo verías en la configuración de la app, no en un mensaje con un link." },
      c: { texto: "Respondo preguntando por qué la van a eliminar.", porque: "Si respondés, saben que la cuenta está activa y te siguen apurando. Revisá desde la app." },
    },
  },
  {
    n: 17, seccion: 4, correcta: "d",
    consejo: "Ningún sorteo de verdad necesita la foto de tu DNI.",
    texto: "Un sorteo en redes te pide tu nombre, tu DNI, tu dirección y una foto del DNI. ¿Qué hacés?",
    opciones: {
      a: { texto: "Mando los datos, pero tapo el número de trámite.", porque: "Igual les das tu nombre, tu DNI, tu dirección y una foto: con eso ya pueden intentar estafas." },
      b: { texto: "Participo solo si la cuenta tiene tilde azul.", porque: "Hoy la tilde azul se puede pagar, y las cuentas verificadas también se roban." },
      c: { texto: "Mando todo, pero por privado y no en comentarios.", porque: "Que sea privado no cambia nada: los datos llegan igual a quien armó el sorteo falso." },
      d: { texto: "No participo: no necesitan la foto.", porque: "Muchos sorteos falsos existen solo para juntar datos. Con la foto de tu DNI pueden intentar sacar créditos o abrir cuentas a tu nombre." },
    },
  },
  {
    n: 18, seccion: 4, correcta: "a",
    consejo: "Bajá apps solo de la tienda oficial.",
    texto: "Un amigo te pasa una app paga, pero «gratis», para instalar con un archivo <<.apk|apk>>. ¿Qué puede pasar?",
    opciones: {
      a: { texto: "Que traiga algo escondido que robe datos.", porque: "Para «liberarla», alguien cambió la app, y nadie sabe qué más le agregó. Bajá apps solo de la <<tienda oficial>>." },
      b: { texto: "Nada, si la página de descarga tiene buenas reseñas.", porque: "Las reseñas se inventan, y cualquier página puede subir una app modificada." },
      c: { texto: "Nada, si el antivirus del celular no encuentra nada.", porque: "Muchos programas dañinos están hechos para que el antivirus no los detecte." },
    },
  },
  {
    n: 19, seccion: 4, correcta: "c",
    consejo: "Si publican una foto tuya sin permiso, pedí que la borren y, si no, denunciala.",
    texto: "Alguien sube una foto tuya sin tu permiso. ¿Qué podés hacer?",
    opciones: {
      a: { texto: "Nada, si la foto es en un lugar público.", porque: "Aunque sea en un lugar público, para publicar tu imagen necesitan tu consentimiento, salvo pocas excepciones." },
      b: { texto: "Denunciarla directo, sin hablar con quien la subió.", porque: "Denunciar está bien, pero muchas veces alcanza con pedirle que la borre. Si no lo hace, ahí la denunciás." },
      c: { texto: "Pedir que la borre, y si no, denunciarla.", porque: "Tu imagen es tuya: en Argentina, para publicarla necesitan tu <<consentimiento>>, salvo pocas excepciones (artículo 53 del Código Civil y Comercial). Si es grave, pedí ayuda a un docente o a un adulto de confianza." },
      d: { texto: "Pedirle que la borre, pero no se puede denunciar.", porque: "Sí se puede denunciar: tu imagen está protegida por ley, y las redes sociales bajan las fotos publicadas sin permiso." },
    },
  },
  {
    n: 20, seccion: 4, correcta: "b",
    consejo: "Si circula un chat privado, no lo reenvíes y pedí que lo borren.",
    texto: "En el grupo del curso alguien comparte la <<captura>> de un chat privado de un compañero. ¿Qué hacés?",
    opciones: {
      a: { texto: "Le aviso en privado a mi compañero y en el grupo no digo nada.", porque: "Avisarle está bien, pero la captura sigue circulando. Pedir que la borren ayuda a frenarla." },
      b: { texto: "Pido que la borren; si sigue, aviso a un docente.", porque: "Frenar la difusión protege a tu compañero. Difundir un chat privado puede ser delito si perjudica o puede perjudicar a alguien (artículo 155 del Código Penal)." },
      c: { texto: "Salgo del grupo para no tener nada que ver.", porque: "Así no la ves más, pero la captura sigue circulando. Pedir que la borren ayuda a frenarla." },
    },
  },

  // ---------- 5. Mensajes y llamadas falsas ----------
  {
    n: 21, seccion: 5, correcta: "c",
    consejo: "Si alguien te pide plata por mensaje, confirmá llamando a su número de siempre.",
    contexto: "A tu mamá le llega este mensaje de un número que no tiene agendado:",
    mensaje: "Hola ma, cambié de número. ¿Me podés transferir $80.000? Es urgente, después te explico.",
    texto: "¿Qué le conviene hacer?",
    opciones: {
      a: { texto: "Transferir, si le responde bien algo que solo sabe su hijo.", porque: "Ayuda, pero no alcanza: muchas respuestas se pueden averiguar mirando las redes. Lo más seguro es llamar al número de siempre." },
      b: { texto: "Pedirle una foto actual antes de transferir.", porque: "Una foto se puede sacar de las redes. Lo seguro es llamar al número de siempre." },
      c: { texto: "Llamar al número de siempre del hijo.", porque: "Es la estafa del «cambié de número»: alguien se hace pasar por un familiar. Con una llamada al número de siempre se descubre enseguida." },
    },
  },
  {
    n: 22, seccion: 5, correcta: "a",
    consejo: "Si te llaman «del banco», cortá y llamá vos al número oficial.",
    contexto: "Te llaman diciendo que son del banco:",
    mensaje: "Detectamos un movimiento raro en tu cuenta. Para frenarlo, decinos el código que te acaba de llegar por SMS.",
    texto: "¿Qué hacés?",
    opciones: {
      a: { texto: "Corto y llamo yo al número oficial del banco.", porque: "Ningún banco te pide códigos por teléfono. Si cortás y llamás vos al número oficial, sabés que del otro lado está el banco de verdad." },
      b: { texto: "Les pido mis datos para comprobar que son del banco.", porque: "Los estafadores muchas veces ya tienen tu nombre, tu DNI y parte de tu tarjeta por alguna <<filtración>>. Que los sepan no prueba nada." },
      c: { texto: "Solo les confirmo mi DNI para que frenen el movimiento.", porque: "Cualquier dato que les des les sirve para seguir con la estafa. Cortá y llamá vos al banco." },
    },
  },
  {
    n: 23, seccion: 5, correcta: "c",
    consejo: "Para ver un envío, escribí vos la dirección de la página oficial.",
    contexto: "Te llega este SMS:",
    mensaje: "Tu paquete está retenido por falta de pago. Pagá $350 para recibirlo: {{correo-envios.info/pago}}",
    texto: "¿Qué hacés?",
    opciones: {
      a: { texto: "Entro al link solo para ver el número de seguimiento.", porque: "El link lleva a una página falsa, armada para que pongas tus datos. Buscá el envío vos en la página oficial." },
      b: { texto: "Pago, si el mensaje tiene mi nombre y mi dirección.", porque: "Tus datos pueden haber salido de alguna <<filtración>>. No buscan los $350: buscan los datos de tu tarjeta." },
      c: { texto: "Busco el envío en la página del correo.", porque: "Si de verdad tenés un paquete, lo vas a ver ahí. Escribir la dirección vos te asegura que no entrás a una página falsa." },
    },
  },
  {
    n: 24, seccion: 5, correcta: "b",
    consejo: "Mirá cómo termina la dirección antes de la primera barra «/».",
    texto: "Tu <<billetera virtual>> es «mibilletera.com». Te llega un mail que dice ser de ellos. ¿Cuál de estas direcciones es de verdad de tu billetera?",
    opciones: {
      a: { texto: "mibilletera.com.seguridad-cuenta.net", mono: true, porque: "Empieza igual, pero lo que manda es el final: termina en «seguridad-cuenta.net», que es otra página." },
      b: { texto: "mibilletera.com/ayuda", mono: true, porque: "Lo que importa es cómo termina la dirección antes de la primera barra «/». Acá es «mibilletera.com», y lo que sigue después de la barra es solo una sección de la página." },
      c: { texto: "mibilletera-ayuda.com", mono: true, porque: "Es otra página: el guion la convierte en una dirección distinta, y cualquiera puede comprarla." },
    },
  },
  {
    n: 25, seccion: 5, correcta: "a",
    consejo: "Nunca instales una app porque te lo pide alguien que te llamó.",
    contexto: "Te llaman de «soporte técnico»:",
    mensaje: "Tu celular tiene un virus. Para arreglarlo, instalá esta app que nos deja ver tu pantalla.",
    texto: "¿Qué hacés?",
    opciones: {
      a: { texto: "Corto y no instalo nada.", porque: "Las empresas no te llaman para avisarte que tenés un virus. Si te piden instalar una app para ver tu pantalla, es una estafa." },
      b: { texto: "La instalo, y la desinstalo apenas terminen.", porque: "Mientras la tenés, pueden ver y manejar tu celular: tus mensajes, tus códigos y la app del banco." },
      c: { texto: "Les pido que primero me manden un mail oficial.", porque: "Un mail se falsifica fácil. Y las empresas no te llaman para avisarte que tenés un virus." },
    },
  },
  {
    n: 26, seccion: 5, correcta: "b",
    consejo: "Acordá con tu familia una palabra clave para emergencias.",
    contexto: "Te llega un audio con la voz de tu hermano, desde un número que no conocés:",
    mensaje: "Soy yo, se me rompió el celu. Necesito plata ya, después te explico.",
    texto: "¿Podés confiar porque es su voz?",
    opciones: {
      a: { texto: "Sí, si además me manda una foto.", porque: "Las fotos se sacan de las redes, y la voz se copia con <<inteligencia artificial>>. Llamalo a su número de siempre." },
      b: { texto: "No: lo llamo a su número de siempre.", porque: "Con unos segundos de audio, hay programas de <<inteligencia artificial>> que imitan la voz de cualquiera. Llamalo a su número de siempre. Una buena idea es tener una palabra clave en la familia para estos casos." },
      c: { texto: "Sí, si me habla de cosas que solo sabe él.", porque: "Muchos datos se sacan de las redes, y la voz se puede copiar. Lo más seguro es llamarlo a su número de siempre." },
    },
  },

  // ---------- 6. Compras y plata ----------
  {
    n: 27, seccion: 6, correcta: "c",
    consejo: "Desconfiá de los precios muy bajos con pago solo por transferencia.",
    texto: "Una cuenta de Instagram vende zapatillas originales a mitad de precio. Solo aceptan transferencia y te apuran: «¡Quedan 2 pares!». ¿Qué hacés?",
    opciones: {
      a: { texto: "Compro, si me mandan fotos con un papel con la fecha.", porque: "Hasta esas fotos se pueden conseguir o armar. Con transferencia, si no llega nada, perdiste la plata." },
      b: { texto: "Compro, si la cuenta tiene años y buenos comentarios.", porque: "Las cuentas se compran o se roban, y los comentarios los puede escribir la misma persona desde otras cuentas." },
      c: { texto: "No le compro a esa cuenta.", porque: "Una transferencia no se puede cancelar: si no te mandan nada, perdiste la plata. Comprá en tiendas conocidas o con un medio de pago que te proteja." },
    },
  },
  {
    n: 28, seccion: 6, correcta: "a",
    consejo: "Antes de entregar algo que vendiste, fijate que la plata esté en tu cuenta.",
    texto: "Vendés tu bici usada por internet. El comprador te manda el comprobante de la transferencia y te pide que se la mandes hoy. ¿Qué hacés?",
    opciones: {
      a: { texto: "Espero a ver la plata en mi cuenta.", porque: "Lo único que vale es ver la plata en tu cuenta. Hasta que no la ves, no entregues nada." },
      b: { texto: "Se la mando si el comprobante tiene el logo del banco.", porque: "Un comprobante es solo una imagen, y se puede armar uno falso con el logo en un minuto." },
      c: { texto: "Le pido el comprobante en PDF, que es más difícil de falsificar.", porque: "Un PDF también se puede falsificar. Lo que importa es tu cuenta, no el comprobante." },
    },
  },
  {
    n: 29, seccion: 6, correcta: "b",
    consejo: "Si te prometen duplicar tu plata, es una estafa.",
    texto: "Ves una publicidad donde un famoso dice que invirtió y duplicó su plata en una semana. ¿Qué pensás?",
    opciones: {
      a: { texto: "Que conviene probar con poquito.", porque: "Al principio te pueden mostrar «ganancias» para que pongas más plata. Después desaparecen con todo." },
      b: { texto: "Que es una estafa.", porque: "Las inversiones de verdad no prometen ganancias seguras ni rápidas. Y ninguna te apura con «cupos limitados»." },
      c: { texto: "Que es real si salió en YouTube.", porque: "Las plataformas no revisan bien todas las publicidades, y los videos de famosos se arman con <<inteligencia artificial>>." },
    },
  },
  {
    n: 30, seccion: 6, correcta: "b",
    consejo: "Antes de pagar con QR, fijate a quién le estás pagando.",
    texto: "En un bar, para pagar hay un <<código QR|código qr>> en la mesa. Parece un sticker pegado arriba de otro. ¿Qué hacés?",
    opciones: {
      a: { texto: "Lo escaneo y me fijo que el link tenga https.", porque: "Que tenga https no dice quién cobra. Fijate el nombre de quien cobra antes de confirmar." },
      b: { texto: "Le pregunto al mozo cómo pagar.", porque: "Si algo se ve raro, preguntá. Y antes de confirmar un pago con QR, fijate que el nombre de quien cobra sea el del local." },
      c: { texto: "Lo escaneo: si abre la app de pagos, es seguro.", porque: "La app de pagos se abre igual con un QR falso. Lo que importa es a quién le pagás: fijate el nombre antes de confirmar." },
    },
  },
  {
    n: 31, seccion: 6, correcta: "c",
    consejo: "En una tienda que no conocés, pagá con tarjeta de crédito.",
    texto: "Vas a comprar por primera vez en una tienda online que no conocés. ¿Cuál es la forma de pago más segura?",
    opciones: {
      a: { texto: "Transferencia, si me mandan los datos de la empresa.", porque: "Cualquiera puede inventar los datos de una empresa. Si no te llega nada, la plata de una transferencia no vuelve." },
      b: { texto: "Billetera virtual, transfiriendo desde la app.", porque: "Una transferencia desde la billetera tampoco vuelve. Lo que te protege es pagar con tarjeta de crédito." },
      c: { texto: "Tarjeta de crédito, que permite reclamar.", porque: "Si no te llega lo que compraste, con la tarjeta de crédito podés hacer un reclamo para que te devuelvan la plata." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 32, seccion: 6, correcta: "a",
    consejo: "Un premio de verdad no te pide plata para recibirlo.",
    contexto: "Te llega este mensaje, pero no participaste en ningún sorteo:",
    mensaje: "¡Felicitaciones! Ganaste un celular. Para recibirlo, pagá $5.000 de envío: {{premios-ya.net}}",
    texto: "¿Qué pensás?",
    opciones: {
      a: { texto: "Que es una trampa para sacarme plata.", porque: "Te piden poquito para que no lo pienses. Después van a pedir más, o usar los datos de tu tarjeta." },
      b: { texto: "Que puede ser real, si el envío es barato.", porque: "Te piden poquito para que no lo pienses. Si no participaste en nada, no puede haber premio." },
      c: { texto: "Que es real si la página tiene candado.", porque: "Las páginas de estafa también tienen candado. Y si no participaste en nada, no puede haber premio." },
    },
  },

  // ---------- 7. Redes sociales ----------
  {
    n: 33, seccion: 7, correcta: "c",
    consejo: "Subí las historias más tarde y sin ubicación.",
    texto: "Todos los días, cuando llegás a tu casa, subís una historia con la ubicación. ¿Qué puede saber alguien que las mira?",
    opciones: {
      a: { texto: "Nada, si las historias se borran a las 24 horas.", porque: "Mientras están, cualquiera que las mira arma tu rutina. Y se pueden capturar antes de que se borren." },
      b: { texto: "Solo en qué barrio vivís, no la casa.", porque: "Juntando varias historias y lo que se ve en las fotos, se puede saber la casa y a qué hora llegás." },
      c: { texto: "Dónde vivís y a qué hora llegás.", porque: "Con varias historias se arma tu rutina: dónde vivís, a qué hora llegás y cuándo no hay nadie. Subilas más tarde y sin ubicación." },
    },
  },
  {
    n: 34, seccion: 7, correcta: "a",
    consejo: "Antes de subir algo, pensá si te molestaría que lo vea cualquiera.",
    texto: "Tenés la cuenta privada y solo te siguen tus amigos. ¿Tus fotos están 100% protegidas?",
    opciones: {
      a: { texto: "No: cualquiera puede capturarlas.", porque: "La cuenta privada ayuda, pero no es una caja fuerte. Cualquiera de tus seguidores puede guardar una foto y pasarla." },
      b: { texto: "Sí, si no acepto a desconocidos.", porque: "Aunque solo te sigan conocidos, cualquiera puede sacar una captura y pasarla." },
      c: { texto: "Sí, porque la red social avisa si alguien hace captura.", porque: "Muchas redes no avisan, y nadie se entera si fotografían la pantalla con otro celular." },
    },
  },
  {
    n: 35, seccion: 7, correcta: "b",
    consejo: "Si alguien de internet te pide fotos o secretos, contale a un adulto de confianza.",
    texto: "Jugando online, alguien que dice tener tu edad te regala monedas del juego. Después te pide una foto tuya y que no le cuentes a nadie. ¿Qué hacés?",
    opciones: {
      a: { texto: "Le mando una foto común, de la cara, sin nada raro.", porque: "Que te pida una foto y que no le cuentes a nadie ya es una señal de alarma. Después, con esa foto, te pide más." },
      b: { texto: "No mando nada y le cuento a un adulto.", porque: "Regalos, pedidos de fotos y secretos son señales de <<grooming>>: un adulto que se hace pasar por alguien de tu edad. Es un delito en Argentina (artículo 131 del Código Penal). Bloquealo, denuncialo en el juego y contale a un adulto. Nunca es tu culpa." },
      c: { texto: "Lo bloqueo y no le cuento a nadie, para no meterme en problemas.", porque: "Bloquearlo está bien, pero contale a un adulto: puede estar haciéndoles lo mismo a otros, y vos no hiciste nada malo." },
    },
  },
  {
    n: 36, seccion: 7, correcta: "c",
    consejo: "Pública o privada, lo que más cuenta es qué compartís.",
    texto: "Tu cuenta de Instagram es pública. ¿Es peligroso tenerla así?",
    opciones: {
      a: { texto: "Sí: hay que tenerla privada sí o sí.", porque: "No es obligatorio. Lo que importa es qué publicás: tu ubicación, tu rutina, tu colegio o tus datos." },
      b: { texto: "Sí: una cuenta pública es más fácil de hackear.", porque: "Que sea pública no hace más fácil robarla: eso depende de tu contraseña y de la <<verificación en dos pasos>>." },
      c: { texto: "Depende de lo que publiques en ella.", porque: "Una cuenta pública no es peligrosa por sí sola. El riesgo está en publicar dónde vivís, tu rutina, tu colegio o datos personales." },
    },
  },
  {
    n: 37, seccion: 7, correcta: "a",
    consejo: "Lo que publicás hoy te puede encontrar dentro de muchos años.",
    texto: "Dentro de unos años buscás trabajo, y la empresa busca tu nombre en internet. ¿Qué puede pasar con lo que publicás hoy?",
    opciones: {
      a: { texto: "Lo pueden encontrar y usar para decidir.", porque: "Todo lo que publicás deja una <<huella digital>> que dura años. Antes de publicar, preguntate si te molestaría que lo vea un profesor o una empresa." },
      b: { texto: "Nada, si después borro esas publicaciones viejas.", porque: "Borrar ayuda, pero alguien pudo guardar una captura, y algunas páginas guardan copias." },
      c: { texto: "Nada, si uso un apodo en vez de mi nombre.", porque: "Las fotos, los amigos en común y lo que otros publican de vos igual pueden llevar a tu cuenta." },
    },
  },
  {
    n: 38, seccion: 7, correcta: "b",
    consejo: "Si ves una cuenta repetida de un amigo, avisale por otro lado y denunciala.",
    texto: "Te llega una solicitud de una cuenta con la foto y el nombre de una amiga, pero ya la seguís en su cuenta de siempre. ¿Qué puede ser?",
    opciones: {
      a: { texto: "Que se hizo otra cuenta: la acepto.", porque: "Primero preguntale por otro lado. Si no fue ella, aceptar la copia le sirve a quien la creó para escribirte." },
      b: { texto: "Que alguien copió su perfil.", porque: "Copian la foto y el nombre para pedirles plata o datos a sus contactos. Avisale a tu amiga por otro medio y denunciá la cuenta." },
      c: { texto: "Que le robaron la cuenta vieja.", porque: "Si fuera así, te avisaría por otro lado. Una cuenta nueva con su foto, mientras la vieja sigue activa, es una copia." },
    },
  },

  // ---------- 8. Celular y wifi ----------
  {
    n: 39, seccion: 8, correcta: "c",
    consejo: "Para el banco, usá tus datos móviles y no un wifi abierto.",
    texto: "Estás en una plaza con wifi gratis y sin contraseña, y querés entrar al <<home banking>>. ¿Qué te conviene?",
    opciones: {
      a: { texto: "Entrar, si se llama «WiFi Plaza Municipal».", porque: "Cualquiera puede crear una red con ese nombre. Para el banco, usá tus <<datos móviles>>." },
      b: { texto: "Entrar en modo incógnito, así no queda nada.", porque: "El modo incógnito solo no guarda el historial en tu celular: no te protege de quien maneja la red." },
      c: { texto: "Usar los datos móviles del celular.", porque: "Tus <<datos móviles>> son una conexión solo tuya. Una red abierta la usa cualquiera, y cualquiera puede crear una con un nombre parecido. Para cosas importantes, mejor los datos." },
    },
  },
  {
    n: 40, seccion: 8, correcta: "a",
    consejo: "Cargá el celular con tu cargador o con una batería portátil.",
    texto: "En la terminal de ómnibus hay puertos USB para cargar el celular. ¿Qué es más seguro?",
    opciones: {
      a: { texto: "Mi cargador en un enchufe, o una batería.", porque: "Así por el cable solo pasa electricidad. Si alguna vez usás un USB público y el celular pregunta si permitís el acceso a tus datos, tocá «No permitir»." },
      b: { texto: "El USB de la terminal, con el celular bloqueado.", porque: "Bloqueado ayuda, pero lo más seguro es que por el cable solo pase electricidad: tu cargador en un enchufe." },
      c: { texto: "Da igual: por un cable USB solo pasa electricidad.", porque: "Por un cable USB también pasan datos. Por eso el celular, a veces, pregunta si querés permitir el acceso." },
    },
  },
  {
    n: 41, seccion: 8, correcta: "b",
    consejo: "Configurá que solo tus contactos te puedan mandar archivos.",
    texto: "Vas en el colectivo y te aparece un aviso: un dispositivo desconocido quiere mandarte un archivo. ¿Qué hacés?",
    opciones: {
      a: { texto: "Lo acepto si tiene el nombre de alguien conocido.", porque: "Cualquiera puede ponerle a su celular el nombre que quiera. Si no estás esperando un archivo, rechazalo." },
      b: { texto: "Lo rechazo y limito quién me manda.", porque: "Si no sabés quién es, rechazalo. En AirDrop (iPhone) o Quick Share (Android) podés elegir que solo te manden archivos tus contactos." },
      c: { texto: "Lo acepto, pero lo borro sin abrirlo.", porque: "Aunque lo borres, ya llegó: puede ser una imagen ofensiva o un archivo dañino. Si no sabés quién es, rechazalo." },
    },
  },
  {
    n: 42, seccion: 8, correcta: "c",
    consejo: "Mantené actualizados el celular y las apps.",
    texto: "Te aparece un aviso para actualizar el sistema del celular. ¿Conviene instalarlo?",
    opciones: {
      a: { texto: "Espero unas semanas a ver si trae problemas.", porque: "Mientras esperás, el celular queda con fallas que los delincuentes ya conocen. Instalala con wifi y con batería cargada." },
      b: { texto: "Solo si es grande, con cambios de diseño.", porque: "Las actualizaciones chicas suelen ser justo las de seguridad: tapan fallas que ya se conocen." },
      c: { texto: "Sí, lo antes posible.", porque: "Cada actualización tapa agujeros de seguridad que ya se conocen. Instalala con wifi y con batería cargada, y actualizá también las apps." },
      d: { texto: "No sé.", nose: true },
    },
  },
  {
    n: 43, seccion: 8, correcta: "a",
    consejo: "Configurá que los mensajes no se lean con el celular bloqueado.",
    texto: "Tu celular está bloqueado, pero en la pantalla se lee el código que te llegó por SMS. ¿Qué riesgo hay?",
    opciones: {
      a: { texto: "Que alguien lo lea sin desbloquearlo.", porque: "Con ese código pueden entrar a tus cuentas. Podés hacer que los mensajes no se lean con el celular bloqueado: en iPhone, en [[Configuración > Notificaciones > Mostrar previsualizaciones]]; en Android, buscá «pantalla de bloqueo» en Configuración." },
      b: { texto: "Ninguno, si tengo un PIN de 6 números.", porque: "El PIN no tapa las notificaciones: el código se ve sin desbloquear." },
      c: { texto: "Solo si alguien me roba el celular.", porque: "Alcanza con que alguien mire la pantalla un segundo, en la mesa o en el colectivo." },
    },
  },
  {
    n: 44, seccion: 8, correcta: "b",
    consejo: "Bloqueá el celular con un PIN de 6 números o más.",
    texto: "¿Cuál de estos bloqueos de pantalla protege más tu celular?",
    opciones: {
      a: { texto: "Un PIN de 4 números, más fácil de recordar.", porque: "Con 4 números hay 10.000 combinaciones; con 6, un millón. Y muchos PIN de 4 son fechas fáciles de adivinar." },
      b: { texto: "Un PIN de 6 números que no sea una fecha.", porque: "Un <<PIN|pin>> largo y que no sea una fecha es mucho más difícil de adivinar. Podés sumarle la huella del dedo o la cara para no escribirlo cada vez." },
      c: { texto: "Un patrón largo, que pase por los 9 puntos.", porque: "Es mejor que uno corto, pero las marcas del dedo en la pantalla dejan ver el dibujo, y alguien lo puede ver de reojo." },
    },
  },

  // ---------- 9. Si algo sale mal ----------
  {
    n: 45, seccion: 9, correcta: "b",
    consejo: "Si perdés el celular, bloquealo desde otro dispositivo cuanto antes.",
    texto: "Perdiste el celular. ¿Qué es lo primero que conviene hacer?",
    opciones: {
      a: { texto: "Borrarlo a distancia enseguida, para proteger mis datos.", porque: "Si lo borrás de entrada, ya no lo podés ubicar. Primero bloquealo y buscalo; borralo solo si no lo recuperás." },
      b: { texto: "Ubicarlo y bloquearlo desde otro dispositivo.", porque: "Desde otra compu o celular entrá a `google.com/android/find` (Android) o `icloud.com/find` (iPhone): podés hacerlo sonar, bloquearlo o borrarlo. Si no aparece, pedile a tu compañía de teléfono que bloquee el <<chip>>." },
      c: { texto: "Hacer la denuncia en la policía antes que nada.", porque: "La denuncia sirve, pero lleva tiempo. Lo primero es bloquearlo, para que no usen tus cuentas." },
    },
  },
  {
    n: 46, seccion: 9, correcta: "c",
    consejo: "Si te roban una cuenta, recuperala desde la app oficial y avisá a tus contactos.",
    texto: "Te robaron la cuenta de Instagram: te cambiaron la contraseña y el mail. ¿Qué hacés?",
    opciones: {
      a: { texto: "Me hago otra cuenta y aviso que me robaron la vieja.", porque: "Avisar está bien, pero no abandones la cuenta: recuperala con la opción oficial, o la van a usar para estafar a tus contactos." },
      b: { texto: "Le escribo a una cuenta de soporte de Instagram.", porque: "Las cuentas que dicen ser «soporte» casi siempre son otra estafa. Usá la recuperación oficial de la app." },
      c: { texto: "Uso la recuperación oficial de la app.", porque: "En la pantalla de inicio tocá «¿Olvidaste tu contraseña?» o entrá a `instagram.com/hacked`. Mientras tanto, avisá por otro lado que te robaron la cuenta." },
    },
  },
  {
    n: 47, seccion: 9, correcta: "a",
    consejo: "Si se filtra una contraseña, cambiala en todas las cuentas donde la usabas.",
    texto: "Te avisan que la contraseña que usabas en una tienda online apareció en una <<filtración>>. ¿Qué hacés?",
    opciones: {
      a: { texto: "La cambio en todas donde la usaba.", porque: "Los delincuentes prueban las contraseñas filtradas en muchas páginas. Cambiala en todas y activá la <<verificación en dos pasos>>." },
      b: { texto: "Borro mi cuenta en esa tienda y listo.", porque: "Borrar la cuenta no sirve: tu contraseña ya la tienen otros y la van a probar en otras páginas." },
      c: { texto: "Cambio solo la de esa tienda, que es la que se filtró.", porque: "Si la repetías en otras cuentas, la van a probar ahí también." },
    },
  },
  {
    n: 48, seccion: 9, correcta: "b",
    consejo: "Si te amenazan, no pagues ni mandes nada: guardá pruebas y pedí ayuda.",
    contexto: "Alguien que no conocés te escribe:",
    mensaje: "Tengo una foto tuya. Si no me pagás, se la mando a todos tus contactos.",
    texto: "¿Qué hacés?",
    opciones: {
      a: { texto: "Le pido que me muestre la foto antes de pagar.", porque: "Muchas veces no tienen ninguna foto. Y si pagás, casi siempre piden más." },
      b: { texto: "No pago, guardo pruebas y pido ayuda.", porque: "Es una <<extorsión>>, y es un delito. No respondas ni pagues, guardá las capturas, bloqueá la cuenta y pedí ayuda. La culpa nunca es tuya." },
      c: { texto: "Lo bloqueo, borro el chat y no le cuento a nadie.", porque: "Bloquear está bien, pero guardá antes las capturas: sirven para denunciarlo. No tenés que pasar por esto sin ayuda." },
    },
  },
  {
    n: 49, seccion: 9, correcta: "c",
    consejo: "Antes de vender el celular, hacé una copia y restablecelo de fábrica.",
    texto: "Vas a vender tu celular viejo. ¿Qué tenés que hacer antes?",
    opciones: {
      a: { texto: "Borrar fotos, mensajes y contactos, y cerrar mis cuentas.", porque: "Es un buen comienzo, pero quedan datos que no ves. Restablecerlo de fábrica borra todo; antes, hacé una copia." },
      b: { texto: "Sacarle el chip y la tarjeta, y borrar las fotos.", porque: "El chip y la tarjeta conviene sacarlos, pero en el celular quedan tus mensajes y tus cuentas. Restablecelo de fábrica." },
      c: { texto: "Hacer una copia y restablecerlo de fábrica.", porque: "Con la <<copia de seguridad>> no perdés nada, y al <<restablecerlo de fábrica|restablecer de fábrica>> queda como nuevo, sin tus datos. Sacale también el <<chip>> y la tarjeta de memoria." },
    },
  },
  {
    n: 50, seccion: 9, correcta: "a",
    consejo: "Activá la copia de seguridad automática de tus fotos.",
    texto: "Se te rompió el celular y no prende. ¿Qué te hubiera permitido recuperar tus fotos?",
    opciones: {
      a: { texto: "La copia de seguridad automática.", porque: "Con la <<copia de seguridad>> automática, tus fotos se guardan en la nube (como Google Fotos o iCloud) y las recuperás en otro celular." },
      b: { texto: "Pasar las fotos a la compu cada tanto.", porque: "Sirve, pero solo tenés las fotos hasta la última vez que te acordaste. La copia automática guarda todas sin que hagas nada." },
      c: { texto: "Mandarme las fotos a mí mismo por WhatsApp.", porque: "Sirve para alguna foto suelta, pero no para todas, y les baja la calidad." },
    },
  },
];

// Recorridos que se eligen en el inicio. En cada partida se eligen al azar
// "cantidad" preguntas entre las 50 (nunca más de 20).
const RECORRIDOS = {
  rapido: { nombre: "Recorrido rápido", cantidad: 10 },
  completo: { nombre: "Recorrido completo", cantidad: 20 },
};

// Resultados de la encuesta (completar cuando cierre).
// Porcentaje de encuestados que eligió cada opción, por número de pregunta:
//   1: { a: 12, b: 65, c: 23 },
// Con los datos cargados, cada explicación muestra cuántos eligieron esa opción.
const RESULTADOS = {
};

// "encuesta": orden original. "errores": primero las preguntas con más errores
// (solo funciona si todas las preguntas del recorrido tienen resultados).
const ORDEN = "encuesta";

const GLOSARIO = {
  "permisos": { termino: "Permisos", def: "Lo que una app te pide para usar partes de tu celular, como la cámara, el micrófono, tus fotos, tus contactos o tu ubicación. Podés aceptarlos o rechazarlos de a uno." },
  "perfil": { termino: "Perfil", def: "Todo lo que se puede saber de vos juntando tus datos: qué mirás, qué te gusta, por dónde andás y con quién hablás." },
  "filtración": { termino: "Filtración", def: "Cuando datos que tenían que ser privados quedan expuestos, por ejemplo si hackean a una empresa y se publica lo que tenía guardado." },
  "cookies": { termino: "Cookies", def: "Archivos chiquitos que las páginas guardan en tu navegador. Algunas hacen que la página funcione y otras registran lo que mirás para mostrarte publicidad." },
  "metadatos": { termino: "Metadatos", def: "Datos escondidos dentro de un archivo. En una foto pueden ser la fecha, el modelo de celular y el lugar donde la sacaste." },
  "captura": { termino: "Captura de pantalla", def: "Una foto de lo que se ve en la pantalla del celular o de la compu." },
  "https": { termino: "https", def: "Aparece al principio de la dirección de una página, junto al candado. Quiere decir que lo que mandás viaja cifrado, pero no dice si la página es honesta." },
  "cifrada": { termino: "Conexión cifrada", def: "Lo que mandás viaja codificado, como en un idioma secreto que solo entienden tu dispositivo y la página." },
  "modo incógnito": { termino: "Modo incógnito", def: "Una forma de usar el navegador sin que guarde el historial en tu dispositivo. No te vuelve invisible en internet." },
  "gestor de contraseñas": { termino: "Gestor de contraseñas", def: "Una app o función del celular que guarda tus contraseñas de forma segura y las completa por vos." },
  "verificación en dos pasos": { termino: "Verificación en dos pasos", def: "Un segundo control para entrar a tu cuenta. Además de la contraseña, te piden un código o un PIN." },
  "pin": { termino: "PIN", def: "Un número secreto corto que elegís vos." },
  "apk": { termino: "Archivo .apk", def: "El tipo de archivo con el que se instalan apps en Android. Si lo bajás de afuera de la tienda oficial, no sabés quién lo armó ni qué tiene adentro." },
  "tienda oficial": { termino: "Tienda oficial", def: "La tienda de apps que viene con tu celular, como Google Play en Android o App Store en iPhone." },
  "consentimiento": { termino: "Consentimiento", def: "Tu permiso. Que vos digas que sí." },
  "billetera virtual": { termino: "Billetera virtual", def: "Una app para guardar plata, transferir y pagar desde el celular, por ejemplo con un código QR." },
  "código qr": { termino: "Código QR", def: "Un cuadradito con dibujos que el celular lee con la cámara. Adentro tiene un link o los datos para hacer un pago." },
  "inteligencia artificial": { termino: "Inteligencia artificial", def: "Programas que aprenden de muchísimos ejemplos y pueden, entre otras cosas, escribir textos o imitar una voz o una cara." },
  "grooming": { termino: "Grooming", def: "Cuando un adulto contacta a un chico o a una chica por internet, muchas veces haciéndose pasar por alguien de su edad, para ganarse su confianza y pedirle fotos o un encuentro. Es un delito." },
  "huella digital": { termino: "Huella digital", def: "Todo lo que queda de vos en internet: lo que publicás, lo que comentás y lo que otros suben sobre vos." },
  "home banking": { termino: "Home banking", def: "La página o la app de tu banco, donde ves tu cuenta y hacés transferencias." },
  "datos móviles": { termino: "Datos móviles", def: "El internet que te da tu compañía de teléfono a través del chip, sin usar wifi." },
  "chip": { termino: "Chip (tarjeta SIM)", def: "La tarjetita de tu compañía de teléfono. Con ella recibís llamadas y SMS, incluso los códigos para entrar a tus cuentas." },
  "copia de seguridad": { termino: "Copia de seguridad", def: "Una copia de tus fotos, contactos y mensajes guardada en otro lugar, como la nube, para recuperarlos si perdés el celular o se rompe." },
  "restablecer de fábrica": { termino: "Restablecer de fábrica", def: "Borrar todo lo que tiene el celular para que quede como recién comprado." },
  "extorsión": { termino: "Extorsión", def: "Cuando alguien te amenaza para obligarte a darle plata, fotos u otra cosa. Es un delito." },
};

// Niveles de la licencia final, según el porcentaje de aciertos
const NIVELES = [
  { min: 0.9, nombre: "Escudo total", frase: "Casi ninguna trampa te toma por sorpresa." },
  { min: 0.7, nombre: "Radar encendido", frase: "Detectás la mayoría de las trampas. Repasá las que se te escaparon." },
  { min: 0.4, nombre: "En práctica", frase: "Vas bien, pero algunas trampas todavía te pueden sorprender." },
  { min: 0, nombre: "Permiso de aprendiz", frase: "Hay varias cosas nuevas para aprender. Para eso está el camino." },
];

// Consejos que se muestran si alguien no tuvo ningún error
const CONSEJOS_BASE = [15, 14, 12];
