# Step-by-Step Guide: Deploy Weather Web App to Hugging Face Spaces

## Prerequisites
- GitHub account
- Hugging Face account (free at https://huggingface.co)
- Your code pushed to GitHub

---

## Step 1: Prepare Your GitHub Repository

1. **Make sure all files are committed:**
   ```bash
   git add .
   git commit -m "Prepare for Hugging Face deployment"
   git push origin master
   ```

2. **Verify these files exist in your repo:**
   - ✅ `Dockerfile` (created for you)
   - ✅ `pom.xml`
   - ✅ `src/` directory with all your code
   - ✅ `.dockerignore` (created for you)

---

## Step 2: Create Hugging Face Account & Space

1. **Go to Hugging Face:**
   - Visit: https://huggingface.co
   - Sign up for a free account (or log in)

2. **Create a new Space:**
   - Click your profile icon → **"New Space"**
   - Or go directly to: https://huggingface.co/new-space

3. **Fill in Space details:**
   - **Space name:** `weather-web-app` (or your preferred name)
   - **SDK:** Select **"Docker"** ⚠️ (Important: Must be Docker, not Gradio/Streamlit)
   - **Visibility:** Public or Private (your choice)
   - Click **"Create Space"**

---

## Step 3: Connect GitHub Repository

1. **In your Hugging Face Space settings:**
   - Go to your Space page
   - Click **"Files and versions"** tab
   - Click **"Add file"** → **"Connect repo"**

2. **Connect your GitHub repo:**
   - Authorize Hugging Face to access GitHub (if first time)
   - Select your repository: `PRINCE200016/Weather-web`
   - Select branch: `master`
   - Click **"Connect"**

---

## Step 4: Configure Space Settings

1. **Update README.md (optional but recommended):**
   - In your Space, click **"Files and versions"**
   - Click on `README.md` → **"Edit"**
   - Replace with the content from `README_HF.md` (or keep your existing README)
   - The README should have this header:
     ```yaml
     ---
     title: Weather Web App
     emoji: 🌤️
     colorFrom: blue
     colorTo: green
     sdk: docker
     app_port: 7860
     ---
     ```

2. **Verify Dockerfile is present:**
   - Check that `Dockerfile` exists in the root of your Space
   - It should be visible in "Files and versions"

---

## Step 5: Build and Deploy

1. **Trigger build:**
   - Hugging Face will automatically start building when you connect the repo
   - Go to **"Logs"** tab to watch the build progress
   - First build takes 5-10 minutes (downloading dependencies)

2. **Monitor build logs:**
   - Watch for: `[INFO] BUILD SUCCESS`
   - Watch for: `Started ServerConnector... {0.0.0.0:7860}`
   - If errors occur, check the logs and fix issues

---

## Step 6: Access Your Deployed App

1. **Once build completes:**
   - Go to your Space page
   - Click **"App"** tab (or the URL shown)
   - Your app will be at: `https://your-username-weather-web-app.hf.space`

2. **Test the application:**
   - Enter a city name (e.g., "London", "New York")
   - Click search
   - Verify weather data displays correctly

---

## Troubleshooting

### Build Fails
- **Check logs:** Go to "Logs" tab in your Space
- **Common issues:**
  - Maven dependency download timeout → Rebuild (Hugging Face will retry)
  - Port conflict → Already handled (using port 7860)
  - Missing files → Ensure all files are pushed to GitHub

### App Not Loading
- **Check if build succeeded:** Look for "Running" status
- **Check logs:** Look for Jetty startup messages
- **Wait 1-2 minutes:** First startup can be slow

### 404 Errors
- **Check context path:** App should be at root `/` (WAR deployed as ROOT.war)
- **Try:** `https://your-space.hf.space/` (root URL)

### API Key Issues
- Your OpenWeatherMap API key is hardcoded in `MyServlet.java`
- For production, consider using environment variables (requires code changes)

---

## Important Notes

⚠️ **Hugging Face Spaces Limitations:**
- Free tier has resource limits
- Apps may sleep after inactivity
- First build is slower (dependency download)
- Not optimized for Java apps (but works!)

💡 **Better Alternatives for Java Apps:**
- **Railway** (railway.app) - Better Java support
- **Render** (render.com) - Free tier available
- **Google Cloud Run** - Pay per use

---

## Updating Your App

1. **Make changes locally**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update app"
   git push origin master
   ```
3. **Hugging Face will auto-rebuild** (may take a few minutes)

---

## Success Checklist

- ✅ Dockerfile created
- ✅ Code pushed to GitHub
- ✅ Hugging Face Space created with Docker SDK
- ✅ GitHub repo connected
- ✅ Build completed successfully
- ✅ App accessible at your Space URL
- ✅ Weather search working

---

**Need Help?** Check Hugging Face docs: https://huggingface.co/docs/hub/spaces
