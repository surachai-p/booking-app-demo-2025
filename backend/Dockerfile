# ─────────────────────────────────────────────────────────────
# Stage: Production Environment
# Base Image: node:20-alpine (Active LTS — node:18 EOL เม.ย. 2025)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine

# ─── Build Tools สำหรับ better-sqlite3 ────────────────────
# better-sqlite3 เป็น Native Module ต้องการ C++ compiler
# python3 + make + g++ ใช้ตอน Build เท่านั้น
RUN apk add --no-cache python3 make g++

# กำหนด Working Directory ภายใน Container
WORKDIR /app

# ─── Install Dependencies ──────────────────────────────────
# คัดลอก package files ก่อน (เพื่อใช้ Layer Cache)
# ถ้า package.json ไม่เปลี่ยน → npm install จะใช้ Cache
COPY package*.json ./

# ติดตั้ง Production Dependencies เท่านั้น
RUN npm install --omit=dev

# ─── Copy Source Code ─────────────────────────────────────
# คัดลอก Source Code (ทำทีหลังเพื่อ Cache Optimization)
COPY . .

# ─── Database Directory ───────────────────────────────────
# สร้างโฟลเดอร์สำหรับเก็บ SQLite database file
RUN mkdir -p /app/data

# ─── Configuration ────────────────────────────────────────
# รวม ENV ไว้บรรทัดเดียว = ลด Layer 1 ชั้น (Best Practice)
ENV NODE_ENV=production PORT=5000 DB_PATH=/app/data/booking.db

# ระบุ Port ที่ Application ฟัง
EXPOSE 5000

# ─── Start Application ────────────────────────────────────
# CMD จะถูกแทนที่ได้เมื่อรัน Container
CMD ["node", "server.js"]