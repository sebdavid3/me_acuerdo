---
version: alpha
name: Me acuerdo de...
description: Diario digital de recuerdos con estética de libro antiguo encuadernado. Vibe retro, papel envejecido, tinta sepia.
colors:
  primary: "#2B2118"
  secondary: "#7A6A52"
  tertiary: "#5E4B78"
  lavender: "#CDBCDD"
  neutral: "#F0E6D2"
  paper: "#F5ECD9"
  leather: "#4A2F1A"
  ink-faded: "#5C4A33"
  on-tertiary: "#F5ECD9"
  on-leather: "#EBD9B8"
typography:
  h1:
    fontFamily: Playfair Display
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.01em
  h2:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.2
  entry:
    fontFamily: Special Elite
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: EB Garamond
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  handwritten:
    fontFamily: Caveat
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.3
  label-caps:
    fontFamily: EB Garamond
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: 0.12em
rounded:
  sm: 3px
  md: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  button-primary:
    backgroundColor: "{colors.leather}"
    textColor: "{colors.on-leather}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-leather}"
  button-accent:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
    padding: 12px
  password-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    typography: "{typography.handwritten}"
    rounded: "{rounded.sm}"
    padding: 8px
  entry-page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    typography: "{typography.entry}"
    padding: 40px
  calendar-day:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink-faded}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
  calendar-day-marked:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.tertiary}"
  archive-item:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    padding: 8px
  ribbon-marker:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.primary}"
    typography: "{typography.handwritten}"
---

## Overview

**"Me acuerdo de..."** es un diario digital con alma de objeto físico: un libro encuadernado de
tapas de cuero, con páginas de papel envejecido y recuerdos escritos a máquina. La sensación que
busca es la de abrir un cuaderno guardado en un cajón durante años — cálido, gastado, íntimo.

El tono es **nostálgico y artesanal**, nunca corporativo ni "limpio digital". No hay blancos puros,
ni sombras planas modernas, ni esquinas muy redondeadas. Todo tiende a lo cálido, lo orgánico y lo
ligeramente imperfecto. El homenaje a Georges Perec (la repetición de "Me acuerdo de...") se refuerza
con una tipografía de máquina de escribir para los recuerdos.

## Colors

La paleta nace del **papel envejecido y la tinta sepia**, y el **morado** —vuestro color favorito— entra
como acento en su versión apagada y empolvada, como una tinta violeta de pluma que ha envejecido en el
papel. Un morado brillante chocaría con el sepia; un violeta desaturado, en cambio, lo acompaña con calidez.

- **Primary (#2B2118):** Tinta sepia profunda. Texto principal de los recuerdos y titulares.
- **Secondary (#7A6A52):** Sepia desvaído. Bordes, fechas, metadatos, líneas tenues del papel.
- **Tertiary (#5E4B78):** "Tinta violeta gastada". El **único** motor de interacción: días con recuerdos
  en el calendario, mes activo, estados destacados, acentos. Violeta tinta sobre crema → contraste
  ~6.5:1, cumple WCAG AA, así que se lee bien además de verse bonito.
- **Lavender (#CDBCDD):** Lavanda pastel suave. Para rellenos delicados: la cinta marcadora, fondos de
  resaltado, marcas tenues. Es el "morado pastel" visible, usado en superficie y no en texto pequeño.
- **Neutral (#F0E6D2):** Papel envejecido de fondo, más cálido que el blanco. Base de toda la página.
- **Paper (#F5ECD9):** Papel ligeramente más claro para la superficie de las páginas del libro.
- **Leather (#4A2F1A):** Cuero oscuro de las tapas y de los botones principales.
- **Ink-faded (#5C4A33):** Tinta tenue para texto secundario sobre el papel.

Texto principal (#2B2118) sobre papel (#F5ECD9) alcanza un contraste ~13:1 — lectura cómoda y
duradera. Evitar el negro puro y el blanco puro: rompen la ilusión de papel.

> **Variante para más morado:** si queréis que el libro sea aún más "vuestro", las tapas (`leather`)
> pueden pasar de cuero marrón a un **cuero berenjena/ciruela** envejecido (ej. `#3E2A40`). Se deja
> anotado; por defecto mantengo el cuero marrón y el morado como acento, que es más equilibrado.

## Typography

Tres voces tipográficas, cada una con un papel claro:

- **Playfair Display** — Titulares (portada del libro, encabezados "Calendario" / "Archivo").
  Serif de alto contraste, elegante y libresca. Usar para `h1` y `h2`.
- **Special Elite** — **El texto de los recuerdos.** Tipografía de máquina de escribir que conecta
  directamente con el ejercicio literario de Perec (originalmente mecanografiado). Es la voz central
  del proyecto. Usar para `entry`.
- **EB Garamond** — Texto de interfaz, etiquetas, ítems del archivo. Serif clásica de cuerpo, discreta.
  Usar para `body-md` y `label-caps`.
- **Caveat** — Acentos manuscritos: la fecha de cada recuerdo, anotaciones al margen, el texto de la
  cinta marcadora, el campo de contraseña. Aporta el toque personal e íntimo de un diario hecho a mano.

> Si más adelante prefieres que **los recuerdos** se vean manuscritos en lugar de a máquina, basta con
> cambiar la fuente de `entry` de Special Elite a Caveat. Se deja anotado como variante.

Todas son fuentes de Google Fonts, gratuitas y libres de cargar.

## Layout

- **Estructura general:** libro a doble página **centrado** + **panel derecho fijo** (campo de
  contraseña arriba, calendario, archivo y búsqueda debajo). El panel siempre visible en pantalla
  grande, como pediste.
- **El libro** es el protagonista visual: ocupa el centro y la mayor parte del ancho. El panel derecho
  es un margen estrecho, como el lomo o el índice cosido de un cuaderno.
- **Escala de espaciado:** `xs 4 · sm 8 · md 16 · lg 24 · xl 40`. Las páginas respiran con márgenes
  amplios (`xl`) para que el texto mecanografiado luzca como en una hoja real.
- **Responsive (celular):** el panel derecho se pliega en un **cajón** que se abre con una cinta /
  marcador lateral, y el libro pasa a **una sola página**. (Pendiente de tu confirmación: incluir
  celular o diseñar solo para pantalla grande.)

## Elevation & Depth

La profundidad imita un objeto físico, no la UI moderna:

- **Sombra de encuadernación:** un degradado sutil hacia el centro del libro (el "valle" entre las dos
  páginas), más oscuro en el lomo.
- **Sombras cálidas y suaves**, en tono sepia, nunca grises ni negras puras. Difusas, como las de un
  objeto bajo luz tenue.
- El libro reposa sobre el fondo (`neutral`) con una sombra exterior suave, como apoyado en una mesa.
- El efecto de **pasar la hoja** (StPageFlip) aporta la profundidad principal: la página en movimiento
  proyecta su propia sombra sobre la siguiente.

## Shapes

- **Esquinas:** muy poco redondeadas (`sm 3px`, `md 6px`). El papel y el cuero no tienen radios
  digitales marcados. Los botones llevan apenas un suavizado.
- **Texturas (clave para el vibe):** grano de papel sutil en las páginas, ligero veteado en las tapas
  de cuero, manchas o sombras de tinta muy tenues. Bordes de página ligeramente irregulares/desgastados.
- **Líneas:** finas, en `secondary`, como el rayado tenue de un cuaderno.
- **La cinta marcadora** (`ribbon-marker`) en lavanda pastel (`lavender`) cuelga del libro como acento
  físico y, en celular, hace de tirador del cajón.

## Components

- **button-primary:** acciones principales (guardar recuerdo). Cuero oscuro, texto crema, mayúsculas
  espaciadas. En hover, oscurece hacia `primary`. Contraste alto, cumple WCAG AA.
- **button-accent:** acción destacada o de confirmación, en tinta violeta (`tertiary`). Usar con moderación.
- **password-field:** el campo de desbloqueo, arriba del calendario. Texto manuscrito (`Caveat`) sobre
  papel, discreto, como una nota escrita a mano.
- **entry-page:** la página del recuerdo. Papel, texto a máquina (`Special Elite`), márgenes amplios
  (`padding 40px`). La fecha se rotula en manuscrita (`Caveat`).
- **calendar-day / calendar-day-marked:** días del calendario. Los días **con recuerdos** se marcan en
  `tertiary` (un punto o número en tinta violeta); los demás quedan en tinta tenue.
- **archive-item:** cada mes del archivo, en `EB Garamond`. El mes activo se resalta en `tertiary`.
- **ribbon-marker:** cinta marcadora en lavanda pastel (`lavender`) con texto en tinta; acento decorativo
  y, en móvil, tirador del cajón.

## Do's and Don'ts

**Do**
- Usar papel cálido (`neutral` / `paper`) como base de todo.
- Reservar el violeta (`tertiary`) **solo** para interacción y marcas — que destaque por ser escaso.
- Usar la lavanda (`lavender`) para toques suaves de superficie (cinta, resaltados), no para texto pequeño.
- Dar textura: grano de papel, veteado de cuero, sombras sepia suaves.
- Dejar márgenes generosos en las páginas para que el texto mecanografiado respire.
- Mantener los recuerdos en `Special Elite` y los toques personales (fechas, notas) en `Caveat`.

**Don't**
- No usar blanco puro (#FFFFFF) ni negro puro (#000000): rompen la ilusión de papel y tinta.
- No usar un morado brillante o saturado: rompe la armonía con el sepia. Siempre apagado y empolvado.
- No abusar del acento violeta; si todo es morado, nada resalta.
- No redondear mucho las esquinas ni usar sombras grises planas de UI moderna.
- No mezclar más fuentes de las cuatro definidas.
- No saturar el panel derecho: debe sentirse como el margen de un cuaderno, no como un dashboard.

---

*Documento de diseño en formato DESIGN.md. Tercero y último del proyecto (stack → funcionalidades → diseño).*
