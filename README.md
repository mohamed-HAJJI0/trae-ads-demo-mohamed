# AdQuest — Playable Ads

A mobile-friendly, quiz-style interactive ad unit built with Vite + vanilla JS.
Supports two modes (Old Ads / New Ads) and four brand skins (Apple, Visa, Coca-Cola, McDonald's) with full EN / 中文 i18n.

---

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # produces ./dist
npm run preview      # http://localhost:4173
```

---

## Docker deployment (production)

The app is served by Vite's built-in `preview` server inside a lightweight `node:18-alpine` container. Bound to **localhost only** on port `9393` — no external exposure, no reverse proxy needed.

```bash
# Run
docker-compose up --build -d

# Stop
docker-compose down

# Open
http://localhost:9393
```

### Updating ad creatives at runtime (no rebuild)

Drop new `.webp` files into the `./ads` folder. The folder is bind-mounted into the container as `/app/dist/ads`, so the new creatives are picked up on the next page load without rebuilding the image.

```bash
cp my-new-ad.webp ./ads/
# refresh the page in the browser
```

### Useful commands

```bash
docker-compose logs -f adquest     # tail logs
docker-compose restart adquest     # restart
docker-compose down -v             # stop + remove containers
```

### Rebuild after code changes

```bash
docker-compose up --build -d
```

---

## Project layout

```
.
├── ads/               # Old-Ads .webp creatives (mounted at runtime)
├── src/               # Application source
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
├── package.json
├── Dockerfile         # node:18-alpine → build → vite preview
└── docker-compose.yml # localhost-only on :9393
```

---

## Notes

- **Port:** `9393` on the host → `9393` inside the container
- **Server:** private, localhost only
- **App name:** AdQuest
- **Stack:** static files only, no backend
