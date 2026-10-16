# Foodie Hu Mai — Deployment Guide 🚀

## 🌐 1. Instant Public Live URL (Currently Active)
Your app is currently live on the public internet with SSL/HTTPS:
**Live URL:** [https://4a208b6f2e405c.lhr.life](https://4a208b6f2e405c.lhr.life)

You can open this URL on your mobile phone, share it on WhatsApp, or view it from anywhere in the world!

---

## ☁️ 2. Free Permanent Cloud Deployment Options

### Option A: Render.com (Recommended for Node.js - 100% Free)
1. Go to [https://render.com](https://render.com) and sign up with GitHub.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`foodie-hu-mai`).
4. Settings:
   - **Environment:** `Node`
   - **Build Command:** (leave empty)
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Click **Create Web Service**! Render will give you a permanent `.onrender.com` URL.

### Option B: Vercel (100% Free Global Edge)
1. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your repository. The included `vercel.json` will automatically configure the routing and serverless runtime.
4. Click **Deploy**! Vercel will give you a `.vercel.app` URL.

### Option C: Railway.app
1. Go to [https://railway.app](https://railway.app).
2. Click **Deploy from GitHub repo**.
3. Railway automatically detects `Procfile` and `package.json` and runs `node server.js`.

---

## 🔒 Security & Performance Features Active
- **Zero Dependencies:** Pure native Node.js (no bloated node_modules needed).
- **Security Headers:** `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy`.
- **Path Traversal Protection:** Hardened static asset routing with MIME type whitelist.
- **Real Order Tracking API:** Protected endpoint `/api/record-successful-order` and `/api/orders-log`.
