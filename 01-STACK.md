# 01 · Stack Tecnológico

Proyecto: **"Me acuerdo de..."** — libro digital de recuerdos (regalo de aniversario).
Estética: diario antiguo / libro encuadernado, vibe retro.

Este documento define **qué tecnología se usa y cómo se conecta**. Es el primero de tres
(stack → funcionalidades → diseño). Está escrito para que un agente lo pueda ejecutar paso a paso.

---

## Resumen de decisiones

| Área | Decisión | Motivo |
|---|---|---|
| Hosting | **Vercel** | Estático, gratis, HTTPS automático, deploy en cada push, integra con Supabase |
| Frontend | **HTML + CSS + JavaScript vanilla** | Ligero, fiel al espíritu "Neocities", sin framework pesado |
| Efecto de páginas | **StPageFlip** (`page-flip`) | Efecto realista de hoja al pasar; moderno y sin jQuery |
| Almacenamiento | **Supabase** (Postgres) | Los recuerdos se guardan en la nube, no en el navegador → no se pierden |
| Contraseña | Guardada en **Supabase** | Decisión confirmada; ver advertencia honesta más abajo |

---

## 1. Hosting — Vercel

- El sitio es **estático** (no necesita servidor propio). Se sube a Vercel y queda en una URL tipo
  `turegalo.vercel.app` (o dominio propio si se quiere más adelante).
- Vercel reconstruye y publica automáticamente cada vez que el agente sube cambios al repositorio.
- HTTPS incluido sin configurar nada.
- **No** se necesitan Serverless Functions ni backend de Vercel: Supabase hace ese trabajo.

## 2. Frontend — HTML / CSS / JS vanilla

- Estructura mínima de archivos sugerida:

  ```
  /
  ├── index.html          ← página única
  ├── /css/
  │   └── styles.css       ← estilos (paleta y texturas van en el doc de diseño)
  ├── /js/
  │   ├── app.js           ← lógica principal (render del libro, navegación)
  │   ├── supabase.js      ← conexión y consultas a Supabase
  │   ├── auth.js          ← desbloqueo por contraseña (modo lectura ↔ edición)
  │   ├── calendar.js      ← calendario lateral
  │   └── archive.js       ← archivo por meses + búsqueda
  └── /assets/             ← texturas, fuentes, sonido de página, marcador, etc.
  ```

- No se usa framework (ni React ni Vue). Si el agente lo considera necesario más adelante,
  que lo proponga, pero el objetivo es mantenerlo simple.

## 3. Efecto de páginas — StPageFlip

- Librería: **StPageFlip** (paquete npm `page-flip`, también disponible por CDN).
- Da el efecto de libro a doble página con la hoja girando de forma realista.
- Se inicializa sobre un contenedor que contiene las "páginas" (cada recuerdo es una página).
- Alternativa descartada: `turn.js` (más antiguo y depende de jQuery).

## 4. Almacenamiento — Supabase

Supabase es una base de datos Postgres en la nube con una API lista para usar desde el navegador
mediante su librería JavaScript (`@supabase/supabase-js`) y una **clave pública (anon key)**.

### Esquema de tablas

**Tabla `entries`** — los recuerdos:

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | Clave primaria (default `gen_random_uuid()`) |
| `content` | `text` | El recuerdo. Empieza por "Me acuerdo de..." |
| `entry_date` | `date` | Fecha del recuerdo (la elige ella o por defecto hoy) |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Se actualiza al editar |

**Tabla `settings`** — configuración, incluida la contraseña:

| Columna | Tipo | Notas |
|---|---|---|
| `key` | `text` | Clave primaria (ej. `"password"`) |
| `value` | `text` | El valor (la contraseña que tú definas) |

> La búsqueda por palabra y el filtrado por mes se resuelven **consultando `entries`**
> (por `content` para la búsqueda, por rango de `entry_date` para el mes). No hacen falta tablas extra.

### Consultas que el frontend necesita

- Leer todos los recuerdos ordenados por `entry_date`.
- Insertar un recuerdo nuevo.
- Editar / borrar un recuerdo por `id`.
- Filtrar recuerdos por mes (rango de fechas).
- Buscar recuerdos por palabra (`ilike` sobre `content`).
- Leer la contraseña de `settings` para compararla con lo que ella escribe.

## 5. La contraseña — advertencia honesta

Tú confirmaste guardarla en Supabase. Esto **funciona perfecto para el propósito** (desbloquear
las opciones de escritura), pero quiero que lo sepas con claridad:

- En un sitio estático, la clave pública de Supabase (anon key) viaja en el navegador, así que
  alguien con conocimientos técnicos *podría* leer la tabla `settings` y ver la contraseña.
- Esto **no es un problema** para un regalo íntimo: la "cerradura" es simbólica, para que solo ella
  entre a escribir, no para proteger secretos de un atacante.
- Si en algún momento quieres subir un poco el nivel sin complicarte, se puede guardar un **hash**
  de la contraseña en lugar del texto plano. Queda anotado como opción; por defecto vamos con lo simple.

Las reglas de acceso (RLS) de Supabase se configurarán para que:
- **Cualquiera pueda leer** los recuerdos (modo lectura sin contraseña).
- La **escritura/edición/borrado** quede gestionada desde el frontend tras desbloquear con la
  contraseña. (Para un control real del lado servidor habría que ir más allá; aquí priorizamos
  simplicidad, como acordamos.)

---

## Variables y credenciales que el agente necesitará

- `SUPABASE_URL` — URL del proyecto Supabase.
- `SUPABASE_ANON_KEY` — clave pública del proyecto.

Estas dos van en el frontend (es normal que sean públicas en Supabase). Conviene ponerlas en un
archivo de configuración (`/js/config.js`) o como variables de entorno de Vercel, según prefiera el agente.

## Pasos de montaje (orden sugerido para el agente)

1. Crear proyecto en Supabase y las tablas `entries` y `settings`.
2. Insertar la fila de contraseña en `settings` (`key="password"`, `value=<la que definas>`).
3. Configurar las reglas de acceso (lectura pública).
4. Crear el repositorio con la estructura de archivos de arriba.
5. Conectar el frontend a Supabase (`supabase.js`).
6. Desplegar en Vercel y conectar el repositorio.

---

*Siguiente documento: `02-FUNCIONALIDADES.md` — qué hace la página y cómo se comporta.*
