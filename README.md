# Camino de la privacidad

Guía interactiva sobre privacidad digital para la expo del instituto. Es un recorrido de 50 preguntas sobre permisos de las apps, datos personales, cuentas, estafas, compras, redes sociales y qué hacer si algo sale mal. Si elegís una respuesta incorrecta, la página te explica por qué y te muestra la correcta.

Página online: https://enzotamayo865.github.io/dig_priv/

## Cómo se usa

- Abrí `index.html` en cualquier navegador. No hace falta instalar nada.
- Hay dos recorridos: el rápido (10 preguntas) y el completo (20 preguntas).
- Las preguntas salen al azar entre las 50: en cada partida te tocan otras. Primero vienen las más fáciles (de las 1 a 20) y después las más difíciles (de las 21 a 50).
- Al final aparece una "licencia de navegante" con el nivel y consejos según lo que se respondió mal.
- Para una compu o tablet del stand, activá **Modo stand** abajo de todo: no guarda el avance y vuelve al inicio si nadie la usa por 2 minutos.

## Archivos

Todos van juntos en la misma carpeta, sin subcarpetas:

```
index.html      estructura de la página
style.css       diseño y colores
candado.svg     la mascota (también es el ícono de la pestaña)
preguntas.js    preguntas, explicaciones, recorridos, glosario y niveles
escenas.js      los celulares dibujados de cada pregunta
utilidades.js   funciones para crear elementos y dar formato a los textos
camino.js       el mapa del camino y la tira de progreso
juego.js        la lógica del juego (pantallas, respuestas, modo stand)
sonidos.js      los sonidos suaves del juego (se apagan con el interruptor «Sonidos»)
registro.js     manda las respuestas (anónimas) a una planilla de Google Sheets
```

Si falta alguno, la página muestra arriba un cartel rojo que dice cuál hay que subir.

Para cambiar una pregunta o una explicación, alcanza con editar `preguntas.js`. Ahí también está `RECORRIDOS`, con cuántas preguntas tiene cada recorrido.

## Respuestas en Google Sheets

Cada respuesta se guarda de forma anónima en una planilla: la fecha, un código al azar de la partida, la pregunta, la opción elegida y si estaba bien. Para activarlo, pegá la dirección de la aplicación web de Apps Script en `URL_PLANILLA`, al principio de `registro.js`. El código que va en Apps Script está en el archivo `Codigo.gs`. Si no hay internet, las respuestas esperan en el navegador y se mandan solas cuando vuelve la conexión.

Además, todas las respuestas quedan guardadas en el navegador de la compu donde se juega. Ese panel está oculto: se abre tocando 5 veces seguidas el aviso de datos del pie, o con Ctrl + Shift + E, y se vuelve a ocultar con el botón **Ocultar** (o repitiendo los toques o el atajo). Ahí está **Descargar Excel**, que baja un archivo con las mismas dos hojas que la planilla de Google («Partidas» y «Preguntas»), y **Borrar las guardadas**, que pide confirmar y espera 5 segundos. La carpeta se puede copiar a otra compu y abrir `index.html` con doble clic.

## Hecho con

HTML, CSS y JavaScript, sin librerías.
