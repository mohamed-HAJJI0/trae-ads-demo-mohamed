# ============================================
# AdQuest — Playable Ads (Vite vanilla JS)
# Single-stage: Node 18 → build → preview on :9393
# ============================================

FROM node:18-alpine

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# Copy the rest of the project
COPY . .

# Build the static bundle
RUN npm run build

EXPOSE 9393

# Run Vite's preview server bound to all interfaces on port 9393
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "9393"]
