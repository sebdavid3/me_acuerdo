# Me acuerdo de...

A digital diary with a vintage book / Neocities aesthetic. A personal space to write and revisit memories, with a retro web feel.

## Features

- **Daily diary entries** -- write, edit, and delete memories with dates
- **Recuerdo del dia** -- a random featured memory changes daily
- **Calendar** -- visual calendar with dots on days that have entries; navigate by month
- **Archive** -- browse entries grouped by month, or search by keyword
- **Auth** -- password-protected write mode to keep the diary private
- **Music player** -- sidebar player with a playlist of retro-inspired tracks
- **Background selector** -- toggle between animated GIF backgrounds or no background
- **Visitor counter** -- tracked via Supabase
- **Now Playing bar** -- fixed bottom bar showing current track and days since start date
- **GIF sticker columns** -- infinite-scrolling bird and cat GIFs on both sides (desktop only)
- **Subtle click sounds** -- soft procedural audio feedback on all interactive elements
- **Favicon** -- custom inline star icon

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no framework)
- **Backend**: Supabase (PostgreSQL + REST API)
- **Fonts**: DotGothic16 (display), VT323 (body/entries) via Google Fonts
- **Audio**: Web Audio API for procedural sound effects; MP3 files for music tracks
- **Hosting**: Static site (works on Vercel, Netlify, or any static host)

## Getting Started

### 1. Clone and open

Serve the project directory with any static file server:

```bash
cd me-acuerdo
npx serve .
```

### 2. Supabase setup (optional)

The app works with demo data out of the box. To use a real database:

1. Create a Supabase project at https://supabase.com
2. Run the following SQL in the Supabase SQL editor:

```sql
-- Memories table
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (for password and visitor count)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert default password
INSERT INTO settings (key, value) VALUES ('password', 'your-password-here');
INSERT INTO settings (key, value, is_count) VALUES ('visitor_count', '0');

-- Enable Row Level Security (optional but recommended)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write
CREATE POLICY "anon_all_entries" ON entries FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_settings" ON settings FOR ALL TO anon USING (true) WITH CHECK (true);
```

### 3. Configure

Open `js/config.js` and replace the values:

```js
const CONFIG = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  PASSWORD: 'your-password',
};
```

## Project Structure

```
me-acuerdo/
  index.html              -- Main HTML page
  css/
    styles.css            -- All styles (941+ lines)
  js/
    config.js             -- Supabase URL, anon key, password
    supabase.js           -- Database CRUD operations
    app.js                -- App logic, rendering, event handlers
    sound.js              -- Procedural Web Audio sounds (flip + click)
    auth.js               -- Password unlock / edit mode
    calendar.js           -- Calendar grid rendering and navigation
    archive.js            -- Month archive and search
    player.js             -- Music player with playlist
  assets/
    favicon.svg           -- Custom star favicon
    fondos/               -- Background GIFs (pattern 357, 362, flowers 17, 27)
    pajaros_gatos/        -- Bird and cat GIFs for scrolling columns
    buttons/              -- Pixel button sprites (play, pause, prev, next)
    audio/                -- Music tracks (MP3)
  .github/
    workflows/
      keep-alive.yml      -- Pings the site every 48h to prevent Supabase pause
```

## Customization

- **Colors**: Edit CSS variables in `:root` in `styles.css`
- **Fonts**: Change Google Fonts links in `index.html` and update CSS variables
- **Music tracks**: Replace MP3 files in `assets/audio/` and update the playlist in `js/player.js`
- **Backgrounds**: Add GIFs to `assets/fondos/` and add corresponding CSS classes + HTML buttons
- **Password**: Change in Supabase `settings` table or in `config.js` as fallback

## Deployment

Deploy to any static host. The app requires no build step.

### Vercel

```bash
vercel --prod
```

### GitHub Pages / Netlify

Push the repository and point the host to the root directory.

For the keep-alive GitHub Action to work, enable GitHub Actions on your repository and set the `SITE_URL` secret if not using the default URL.

## License

MIT
