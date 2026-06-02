# 02 · Funcionalidades

Proyecto: **"Me acuerdo de..."** — libro digital de recuerdos.
Segundo documento de tres (stack → **funcionalidades** → diseño).

Aquí se define **qué hace la página y cómo se comporta**. El "cómo se ve" va en el documento de diseño.

---

## Concepto general

La página es **un solo libro digital**. Cada recuerdo es una página del libro. Las entradas siguen
el estilo de Georges Perec: cada una empieza por **"Me acuerdo de..."**.

La página tiene **dos modos**:

- **Modo lectura (por defecto):** cualquiera que abra la página puede pasar las hojas y leer los
  recuerdos, usar el calendario, el archivo y la búsqueda. No puede modificar nada.
- **Modo edición (tras escribir la contraseña):** se desbloquean las opciones de escribir, editar
  y borrar recuerdos.

---

## F1 · Desbloqueo por contraseña

- **No es una pantalla de login.** Es un **campo pequeño** ubicado arriba a la derecha, **sobre el
  calendario**, donde ella escribe la contraseña.
- No hay campo de usuario, solo la contraseña (tú la defines y queda guardada en Supabase).
- Al escribir la contraseña correcta → la página pasa a **modo edición** y aparecen los botones de
  escribir / editar / borrar.
- Si la contraseña es incorrecta → un aviso discreto ("la contraseña no coincide"), sin bloquear la lectura.
- Mientras no se desbloquee, la página funciona normal en **modo lectura**.
- Una vez desbloqueada, conviene un pequeño indicador de que está en modo edición (ej. el campo se
  convierte en "modo escritura ✓") y la opción de **volver a bloquear**.

**Comportamiento técnico:** el frontend lee la contraseña de la tabla `settings` y la compara con lo
que ella escribe. (Recordatorio del doc de stack: la "cerradura" es simbólica, prioriza simplicidad.)

## F2 · Escribir un recuerdo nuevo

- Disponible **solo en modo edición**.
- Un área de escritura con la frase **"Me acuerdo de..."** ya puesta al inicio, como homenaje a Perec.
- **Fecha del recuerdo:**
  - Por defecto, la fecha de hoy.
  - Ella puede **cambiarla** (por si escribe un recuerdo de otro día), con un selector de fecha.
- Al guardar:
  - Se inserta en Supabase (`entries`: `content`, `entry_date`).
  - Aparece como una nueva página del libro, ubicada según su fecha.
  - El calendario y el archivo se actualizan para reflejarlo.

## F3 · Editar y borrar un recuerdo

- Disponible **solo en modo edición**.
- **Editar:** cada página, en modo edición, muestra un botón para editar su texto y/o su fecha.
  Al guardar, se actualiza en Supabase (`updated_at` se refresca).
- **Borrar:** botón para eliminar la entrada, **con confirmación** ("¿Borrar este recuerdo?") para
  evitar accidentes. Tras borrar, el libro, el calendario y el archivo se actualizan.

## F4 · El libro y el paso de páginas

- Las entradas se presentan como un **libro a doble página** (en pantalla grande) usando StPageFlip.
- **Navegación:** pasar a la página siguiente / anterior, con el **efecto realista de hoja girando**.
- Orden: las páginas se ordenan por `entry_date`. (A definir contigo: ¿de más antiguo a más reciente,
  como un diario que avanza en el tiempo, o al revés? Sugerencia: cronológico ascendente, como un libro.)
- Detalles que dan vibe (se concretan en el doc de diseño): sonido suave al pasar la hoja, sombra
  entre páginas, cinta marcadora.
- **Estado vacío:** si todavía no hay recuerdos, mostrar una primera página de bienvenida/portada
  invitando a escribir el primero.

## F5 · Calendario (panel derecho, fijo)

- Muestra el **mes actual**, con navegación a meses anteriores/siguientes.
- Los **días que tienen recuerdos** aparecen **marcados** (un punto, un subrayado, algo sutil y retro).
- Al **hacer clic en un día con recuerdos** → el libro salta a la(s) entrada(s) de esa fecha.
- Si un día no tiene recuerdos, no pasa nada (o un aviso discreto).

## F6 · Archivo por meses (panel derecho, fijo)

- Lista de **meses** que contienen recuerdos (ej. "Enero 2026", "Febrero 2026"...).
- Al **elegir un mes** → el libro muestra **solo las entradas de ese mes**.
- Debe haber una forma clara de **volver a ver todos los recuerdos** (quitar el filtro).
- El archivo se construye dinámicamente a partir de las fechas que existan en `entries`.

## F7 · Búsqueda por palabra

- Un campo de búsqueda (en el panel derecho o en una cinta superior, se decide en diseño).
- Al escribir una palabra → el libro muestra **solo los recuerdos que la contienen** (búsqueda sobre
  el texto del recuerdo, sin distinguir mayúsculas/minúsculas).
- Forma clara de **limpiar la búsqueda** y volver a todos los recuerdos.
- Encaja con el espíritu de Perec: los recuerdos se reencuentran por un detalle suelto (una palabra,
  un nombre, una canción).

> **Nota sobre filtros:** calendario, archivo y búsqueda son tres formas de **filtrar el mismo libro**.
> Conviene que sean coherentes entre sí: aplicar un filtro nuevo reemplaza al anterior, y siempre
> existe la opción de "ver todo".

## F8 · Comportamiento responsive (pantalla grande vs. celular)

- **Pantalla grande (laptop/escritorio):** libro al centro + **panel derecho fijo** (campo de
  contraseña, calendario, archivo, búsqueda) siempre visible. Tal como lo pediste.
- **Celular:** ese mismo panel se convierte en un **cajón / pestaña** que se abre con un botón (idea:
  un marcador o cinta lateral con vibe retro), para que el libro tenga espacio. El libro pasa a una
  sola página visible en lugar de doble.

> Si prefieres ignorar el celular por ahora y diseñar solo para pantalla grande, dímelo y lo quitamos.

---

## Resumen de qué se puede hacer en cada modo

| Acción | Modo lectura | Modo edición |
|---|---|---|
| Pasar páginas / leer | ✅ | ✅ |
| Usar calendario | ✅ | ✅ |
| Usar archivo por meses | ✅ | ✅ |
| Buscar por palabra | ✅ | ✅ |
| Escribir recuerdo nuevo | ❌ | ✅ |
| Editar recuerdo | ❌ | ✅ |
| Borrar recuerdo | ❌ | ✅ |

---

## Cosas a confirmar contigo

1. **Orden del libro:** ¿cronológico ascendente (sugerido) o del más reciente al más antiguo?
2. **Celular:** ¿incluimos el cajón lateral o diseñamos solo para pantalla grande?
3. **Búsqueda:** ¿la ubicamos en el panel derecho junto al archivo, o como una cinta arriba del libro?

*Siguiente documento: `03-DESIGN.md` — la estética, en formato DESIGN.md.*
