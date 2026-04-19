# Kamel Flashcards — Local Dev Project

A flashcard web app loaded with **107 Kamel Unit 1 questions** (pages 43–66), ready to run locally in VS Code.

## Quick start (30 seconds)

1. **Open this folder in VS Code** (File → Open Folder → select this project)
2. Install the recommended extension when VS Code prompts you (**Live Server** by Ritwick Dey) — or install manually from the Extensions panel
3. **Right-click `index.html` → "Open with Live Server"**
4. The app opens at `http://127.0.0.1:5500/index.html` with all 107 cards loaded

That's it. No build step, no npm install.

## Alternative: use the built-in task

If you don't want to install Live Server:

1. Open this folder in VS Code
2. **Ctrl+Shift+P** → type "Run Task" → pick **"Run local server"**
3. A terminal opens running Python's `http.server` on port 8000
4. Open `http://localhost:8000` in your browser

Press **Ctrl+C** in the terminal to stop it.

## What's inside

```
kamel_project/
├── index.html              ← the whole web app (single-file)
├── content.json            ← 107 flashcard MCQ cards (images + answers)
├── manifest.webmanifest    ← PWA manifest
├── sw.js                   ← service worker (offline support)
├── icon192.png, icon512.png ← PWA icons
├── requirements.txt        ← Python deps (only needed if rebuilding content)
├── .vscode/                ← VS Code tasks, launch, recommended extensions
├── tools/
│   ├── build_content_json.py  ← regenerate content.json from crops + answers
│   └── crop_kamel.py          ← crop a PDF into question images
└── content_raw/
    ├── answers.md          ← human-editable answers file
    └── crops/              ← 107 cropped question PNGs
```

## How the cards work

Tap any card in the study view:

- **Single-letter answers (أ / ب / جـ / د):** 39 cards. Tap the letter → marks correct or wrong.
- **Written answers (e.g. `ص = 5س - 4`):** 66 cards. Tap any letter → reveals the full answer text in the back. Works as a flashcard.
- **Watermark-blocked (Q2, Q90):** 2 cards. Back says "غير متوفرة" — read these from the source PDF and edit `content_raw/answers.md` + regenerate.

## Regenerating content.json

If you edit `content_raw/answers.md` (e.g. fill in the blocked answers, fix typos):

1. `pip install -r requirements.txt` (first time only)
2. VS Code → **Ctrl+Shift+P** → "Run Task" → **"Rebuild content.json"**
3. Refresh your browser (hard refresh: **Ctrl+Shift+R**)

Or from terminal:

```bash
python tools/build_content_json.py \
    content_raw/crops \
    content_raw/answers.md \
    Math \
    "الوحدة الأولى — تطبيقات هندسية وفيزيائية" \
    "أسئلة وزارية وتجريبية (ص ٤٣-٦٦)" \
    content.json
```

## Adding new pages (e.g. Unit 2)

1. Drop your PDF somewhere accessible
2. Run the crop script:
   ```bash
   python tools/crop_kamel.py /path/to/unit2.pdf <start_page> <end_page> content_raw/unit2
   ```
3. Fill in answers in `content_raw/unit2/answers.md`
4. Merge into existing content:
   ```bash
   python tools/build_content_json.py \
       content_raw/unit2 \
       content_raw/unit2/answers.md \
       Math \
       "الوحدة الثانية — اسم الوحدة" \
       "اسم الدرس" \
       content.json \
       --merge content.json
   ```
5. Refresh browser

## Why you need a server (can't just open index.html)

The app uses `fetch()` to load `content.json`. Browsers block `fetch()` on `file://` URLs for security. You **must** serve the folder over HTTP — either Live Server or `python -m http.server`.

If you see "1 empty card" or no cards at all when opening `index.html` directly, that's why.

## Troubleshooting

**Cards show as empty / only 1 card appears**
- Hard refresh (**Ctrl+Shift+R** / **Cmd+Shift+R**) to clear cached content
- Check browser DevTools Console (**F12**) — if you see `QuotaExceededError`, the content.json is too big for localStorage. The current file is 2.4 MB and should be fine.

**"GitHub load failed" warning in console**
- That's harmless. The app tries to fetch content.json from a public GitHub repo first, falls back to the local file. Ignore it.

**Python tools fail with "No module named PIL"**
- Run the "Install Python deps" task, or: `pip install -r requirements.txt`

**Arabic text looks broken / right-to-left is off**
- Make sure your browser supports Arabic fonts (all modern browsers do). The app uses `dir="rtl"` attributes — layout should work automatically.

## Publishing to the internet

This is a static site — you can deploy the whole folder to any static host:

- **Netlify:** drag the folder onto netlify.com/drop
- **GitHub Pages:** push to a repo, enable Pages in Settings
- **Vercel:** `vercel` in this folder
- **Cloudflare Pages:** connect a git repo

The service worker (`sw.js`) will cache the app for offline use on subsequent visits.
