# VidyaSaathi Deployment Guide (Vercel + Render)

## 1. Push to GitHub
In terminal inside this directory (idyasaathi):
`ash
git init
git add .
git commit -m "VidyaSaathi initial commit - fully working 4 dashboards"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/vidyasaathi.git
git push -u origin main
`

## 2. Deploy Backend on Render (Free)
1. Go to [https://render.com](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (idyasaathi).
3. Set the Root Directory to: ackend
4. Runtime: Python 3
5. Build Command: pip install -r requirements.txt
6. Start Command: uvicorn app.main:app --host 0.0.0.0 --port 
7. In Environment Variables:
   - SECRET_KEY: supersecretkey_vidyasaathi_jwt_secret_token_2025_rural_edu
   - CORS_ORIGINS: *
8. Click **Create Web Service**.
9. Once deployed, copy your Render backend URL (e.g. https://vidyasaathi-backend.onrender.com).

## 3. Deploy Frontend on Vercel (Free)
1. Go to [https://vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your GitHub repository (idyasaathi).
3. Set the Root Directory to: rontend
4. Framework Preset: **Vite**
5. Add Environment Variable:
   - Name: VITE_API_BASE_URL
   - Value: https://<YOUR_RENDER_BACKEND_URL>
6. Click **Deploy**.
7. In 60 seconds, Vercel gives you your permanent production live URL (e.g. https://vidyasaathi.vercel.app)!
