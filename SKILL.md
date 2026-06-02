---
name: diario-me-acuerdo-frontend
description: >
  Construir el frontend del libro digital de recuerdos "Me acuerdo de...".
  Usar SIEMPRE que se cree, edite o estilice cualquier parte de la interfaz de este proyecto:
  la portada, las páginas del libro, el efecto de pasar hoja, el calendario, el archivo por
  meses, la búsqueda o el campo de contraseña. Esta skill define la estética obligatoria
  (diario antiguo encuadernado, papel envejecido, tinta sepia, acento morado pastel) y
  prohíbe explícitamente el aspecto de "front genérico de IA". No usar para el backend
  (Supabase) ni para tareas ajenas a la UI.
---

# Frontend de "Me acuerdo de..." — Diario digital de recuerdos

Este proyecto es un **regalo de aniversario**: un libro digital donde dos personas escriben
sus recuerdos al estilo de Georges Perec (cada entrada empieza por *"Me acuerdo de..."*).
**No es una app cualquiera.** Es un objeto íntimo que debe sentirse como abrir un cuaderno
de cuero gastado guardado durante años. Si el resultado parece un dashboard, una plantilla o
un sitio "limpio digital", está MAL hecho aunque funcione.

## Documentos que mandan sobre esta skill

Antes de escribir una sola línea, leer y respetar:

1. **`01-STACK.md`** — tecnología y arquitectura (Vercel, HTML/CSS/JS vanilla, StPageFlip, Supabase).
2. **`02-FUNCIONALIDADES.md`** — qué hace cada parte y los dos modos (lectura / edición).
3. **`03-DESIGN.md`** — los **tokens de diseño son la fuente de verdad** de colores y tipografías.
   No inventar colores ni fuentes fuera de ese archivo.

Si algo en esta skill contradice a `03-DESIGN.md`, gana el archivo de diseño.

## La visión (lo que hace que NO sea genérico)

El concepto es **un libro físico envejecido, digitalizado**. Cada decisión debe reforzar la
ilusión de papel y tinta, no la de una interfaz moderna. La estética es **editorial / artesanal
/ retro**, ejecutada con precisión y restraint — no maximalismo recargado, sino la calidez
imperfecta de un objeto real.

La frase que resume el listón: *"parece escaneado de un cuaderno viejo, no diseñado en Figma".*

### Materia prima obligatoria

- **Papel, no fondo plano.** Las páginas usan `paper`/`neutral` con **textura de grano** sutil
  (un PNG/SVG de grano a baja opacidad, o `filter`/`background-blend`). Nunca un color liso y duro.
- **Tinta, no `color: #000`.** El texto es `primary` (#2B2118), sepia profundo. Negro puro
  PROHIBIDO. Blanco puro PROHIBIDO.
- **Texto de los recuerdos en máquina de escribir** (`Special Elite`), interlineado generoso
  (1.7), márgenes amplios (`spacing.xl`). Debe leerse como una hoja mecanografiada de verdad.
- **Toques manuscritos** (`Caveat`): la fecha de cada recuerdo, notas al margen, el campo de
  contraseña, la cinta. Aportan la mano humana.
- **Acento morado apagado** (`tertiary` #5E4B78) SOLO para interacción y marcas (días con
  recuerdos, mes activo, estados). **Lavanda pastel** (`lavender` #CDBCDD) SOLO para superficies
  suaves (la cinta marcadora, resaltados). El morado destaca por escaso, no por omnipresente.
- **Sombras cálidas y sepia**, difusas, como de objeto bajo luz tenue. Nunca sombras grises
  planas de Material/Tailwind por defecto.

### El libro y el paso de página (corazón del proyecto)

- Usar **StPageFlip** (`page-flip`) para el efecto de hoja girando. Es el momento estrella:
  debe sentirse físico y satisfactorio, no una transición CSS de opacidad.
- **Sombra de encuadernación**: un degradado/oscurecido en el lomo (centro), como el "valle"
  entre las dos páginas de un libro abierto.
- La página en movimiento proyecta su propia sombra sobre la siguiente.
- **Sonido suave de hoja al pasar** (un sample corto, volumen bajo, con opción de silenciar).
- **Bordes de página ligeramente irregulares/desgastados** — no rectángulos perfectos de CSS.
- **Cinta marcadora** (`ribbon-marker`, lavanda) que cuelga del libro como acento físico.

### Estado vacío y portada

- Si no hay recuerdos aún, la primera página es una **portada/bienvenida** que invita a escribir
  el primero — con cariño, no con un "No data available" frío.
- La portada puede llevar veteado de cuero y un título en `Playfair Display`.

## Anti-patrones — PROHIBIDO

Estos son los errores que convierten cualquier proyecto en "front genérico de IA". Evitarlos
explícitamente:

- Fuentes genéricas: **Inter, Roboto, Arial, Helvetica, system-ui, Open Sans**. Solo las cuatro
  de `03-DESIGN.md` (Playfair Display, Special Elite, EB Garamond, Caveat).
- **Blanco puro (#FFF) o negro puro (#000)** en cualquier parte.
- **Tarjetas modernas** flotando sobre fondo claro con `border-radius` grande y sombra gris suave.
  Aquí no hay "cards": hay páginas, márgenes y cintas.
- **Esquinas muy redondeadas.** Máximo `rounded.sm`/`rounded.md` (3–6px).
- Gradientes morados sobre blanco (el cliché de IA por excelencia). El morado va apagado y sobre papel.
- Layout de **dashboard / panel de control** con widgets uniformes. El libro manda; el panel
  derecho es un margen estrecho, como el índice cosido de un cuaderno, no una barra de herramientas.
- Transiciones genéricas de fade/slide para "pasar de página". Eso es para lo que está StPageFlip.
- Emojis e iconografía moderna brillante. Si hace falta un icono, que sea discreto y acorde
  (líneas finas, estilo grabado/sello).
- Animaciones por todas partes. Pocas, físicas y con sentido: el paso de hoja, la tinta que
  "asienta" al guardar un recuerdo, el marcador. Nada de micro-animaciones nerviosas.

## Estructura y conexión (resumen operativo)

Respetar la estructura de archivos de `01-STACK.md`. Puntos clave de implementación:

- **Dos modos** (`02-FUNCIONALIDADES.md`): por defecto **lectura**; al escribir la contraseña
  correcta (leída de la tabla `settings` de Supabase) se desbloquea **edición** (escribir/editar/
  borrar). El campo de contraseña va **arriba a la derecha, sobre el calendario** — no es una pantalla.
- **Recuerdos** desde Supabase (tabla `entries`), ordenados por `entry_date`. Confirmar el orden
  con el cliente (sugerido: cronológico ascendente). Cada nuevo recuerdo arranca con
  "Me acuerdo de..." prellenado.
- **Calendario**: días con recuerdos marcados en `tertiary`; clic salta a esa fecha.
- **Archivo por meses**: filtra el libro a un solo mes; siempre debe poder volverse a "ver todo".
- **Búsqueda por palabra**: `ilike` sobre `content`; filtra el libro; siempre limpiable.
- Calendario, archivo y búsqueda son **tres filtros del mismo libro** — coherentes entre sí,
  uno reemplaza al anterior.

## Responsive

- **Pantalla grande:** libro a doble página centrado + **panel derecho fijo** (contraseña,
  calendario, archivo, búsqueda).
- **Celular:** el panel se pliega en un **cajón** que abre una cinta/marcador lateral, y el libro
  pasa a **una sola página**. (Confirmar con el cliente si se incluye celular o no.)

## Definición de "terminado" (checklist de calidad)

Antes de dar por hecho cualquier trozo de UI, verificar:

- [ ] ¿Usa los tokens de `03-DESIGN.md` y solo esas fuentes/colores?
- [ ] ¿Hay textura de papel real y nada de blanco/negro puros?
- [ ] ¿El texto de los recuerdos está en máquina de escribir con buen aire (márgenes/interlineado)?
- [ ] ¿El morado aparece SOLO como acento y la lavanda SOLO en superficies suaves?
- [ ] ¿El paso de página se siente físico (StPageFlip + sombra de lomo + sonido opcional)?
- [ ] ¿La portada/estado vacío invita con cariño en lugar de mostrar un vacío frío?
- [ ] ¿El panel derecho parece el margen de un cuaderno y no un dashboard?
- [ ] ¿Funciona el modo lectura sin contraseña y el de edición tras desbloquear?
- [ ] Si alguien dijera "esto parece una plantilla genérica", ¿se podría defender lo contrario?

Si el último punto no se cumple con honestidad, **rehacerlo**. El listón es un objeto que
emocione, no una interfaz correcta.
