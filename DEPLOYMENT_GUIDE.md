# 🚀 ExerciseDB API - Complete Deployment Guide for Beginners

Hey there! 👋 This guide will walk you through everything you need to know about deploying your ExerciseDB API to the internet. No prior experience needed!

---

## 📚 Table of Contents

1. [What is this API?](#what-is-this-api)
2. [What You'll Need](#what-youll-need)
3. [Step 1: Install Required Software](#step-1-install-required-software)
4. [Step 2: Create a GitHub Account](#step-2-create-a-github-account)
5. [Step 3: Upload Your Code to GitHub](#step-3-upload-your-code-to-github)
6. [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
7. [Step 5: Test Your API](#step-5-test-your-api)
8. [All Available Endpoints](#all-available-endpoints)
9. [Troubleshooting](#troubleshooting)

---

## 🤔 What is this API?

This API is like a giant database of exercise information. Think of it as a fitness encyclopedia that your apps can talk to. When you send a request like "give me chest exercises", it sends back detailed information about exercises that work your chest - complete with instructions, images, and more!

**What can it do?**
- Return lists of exercises
- Search for exercises by name
- Filter exercises by muscle group, equipment, or body part
- Get detailed information about specific exercises

---

## 🛠️ What You'll Need

Before we start, make sure you have these (don't worry, they're all free!):

1. **Node.js** - Software that lets your computer run JavaScript code
2. **GitHub Account** - Where your code will live online
3. **Vercel Account** - Where your API will be hosted (free!)
4. **Git** - A tool to upload your code to GitHub

---

## Step 1: Install Required Software

### Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Click the green "LTS" button (this is the stable version)
3. Download and install it (just click "Next" through everything)
4. To verify it installed, open a terminal/command prompt and type:
   ```bash
   node --version
   ```
   You should see something like `v20.x.x`

### Install Git

1. Go to [https://git-scm.com](https://git-scm.com)
2. Download and install Git
3. To verify, type in terminal:
   ```bash
   git --version
   ```

---

## Step 2: Create a GitHub Account

1. Go to [https://github.com](https://github.com)
2. Click "Sign Up"
3. Create a free account
4. Verify your email

---

## Step 3: Upload Your Code to GitHub

### Option A: Using GitHub Desktop (Easiest for Beginners)

1. **Download GitHub Desktop**: [https://desktop.github.com](https://desktop.github.com)
2. **Install and sign in** with your GitHub account
3. **Add your project**:
   - Click "File" → "Add Local Repository"
   - Click "Choose..." and select your `exercise_plug` folder
   - Click "Add Repository"
4. **Commit your changes**:
   - You'll see your modified files listed
   - Write a summary like "Fix API endpoint for deployment"
   - Click "Commit to main"
5. **Publish to GitHub**:
   - Click "Publish repository"
   - Give it a name like "exercisedb-api"
   - Click "Publish Repository"

### Option B: Using Command Line (If you're comfortable with terminal)

```bash
# Navigate to your project
cd path/to/exercise_plug

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Fix API endpoint for deployment"

# Add your GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/exercisedb-api.git

# Push to GitHub
git push -u origin main
```

---

## Step 4: Deploy to Vercel

1. **Go to Vercel**: [https://vercel.com](https://vercel.com)
2. **Sign up** with your GitHub account
3. **Import your repository**:
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose your `exercisedb-api` repository
4. **Configure deployment**:
   - Framework Preset: Select "Other"
   - Root Directory: Leave as `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Click "Deploy"**
6. **Wait for deployment** (usually takes 1-2 minutes)
7. **Copy your URL** - Vercel will give you a URL like `https://your-project.vercel.app`

🎉 **Congratulations! Your API is now live on the internet!**

---

## Step 5: Test Your API

### Test using your browser:

1. Open your browser
2. Go to: `https://YOUR_VERCEL_URL.vercel.app/docs`
3. You should see the interactive API documentation!

### Test using curl (in terminal):

```bash
# Get all exercises
curl "https://YOUR_VERCEL_URL.vercel.app/api/v1/exercises?limit=5"

# Search for exercises
curl "https://YOUR_VERCEL_URL.vercel.app/api/v1/exercises/search?q=chest"

# Get exercises by muscle
curl "https://YOUR_VERCEL_URL.vercel.app/api/v1/muscles/abs/exercises"
```

---

## 📡 All Available Endpoints

Here's every endpoint your API supports. Replace `YOUR_URL` with your actual Vercel URL.

### Exercise Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/v1/exercises` | Get all exercises with pagination | `YOUR_URL/api/v1/exercises?limit=10&offset=0` |
| `GET /api/v1/exercises/search` | Search exercises by keyword | `YOUR_URL/api/v1/exercises/search?q=chest&threshold=0.3` |
| `GET /api/v1/exercises/filter` | Filter by multiple criteria | `YOUR_URL/api/v1/exercises/filter?muscles=chest&equipment=dumbbell` |
| `GET /api/v1/exercises/{exerciseId}` | Get specific exercise by ID | `YOUR_URL/api/v1/exercises/ztAa1RK` |
| `GET /api/v1/bodyparts/{bodyPartName}/exercises` | Get exercises by body part | `YOUR_URL/api/v1/bodyparts/upper arms/exercises` |
| `GET /api/v1/equipments/{equipmentName}/exercises` | Get exercises by equipment | `YOUR_URL/api/v1/equipments/dumbbell/exercises` |
| `GET /api/v1/muscles/{muscleName}/exercises` | Get exercises by muscle | `YOUR_URL/api/v1/muscles/abs/exercises?includeSecondary=false` |

### List Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/v1/muscles` | Get all muscle names | `YOUR_URL/api/v1/muscles` |
| `GET /api/v1/bodyparts` | Get all body part names | `YOUR_URL/api/v1/bodyparts` |
| `GET /api/v1/equipments` | Get all equipment names | `YOUR_URL/api/v1/equipments` |

### Documentation

| Endpoint | Description |
|----------|-------------|
| `GET /docs` | Interactive API documentation (Swagger UI) |
| `GET /swagger` | OpenAPI specification (JSON) |

---

## 🔧 Troubleshooting

### "Command not found: node" or "Command not found: npm"
- Node.js is not installed or not in your PATH
- Solution: Reinstall Node.js from [nodejs.org](https://nodejs.org)

### "Git is not recognized"
- Git is not installed
- Solution: Install Git from [git-scm.com](https://git-scm.com)

### Vercel deployment fails
- Check the deployment logs in Vercel dashboard
- Common issues:
  - Missing `package.json` - make sure it exists
  - Build errors - run `npm run build` locally first to check

### API returns 404
- Make sure you're using the correct URL format
- All endpoints start with `/api/v1/`
- Check that your Vercel deployment completed successfully

### API returns 500 (Internal Server Error)
- This means the code ran but encountered an error
- Check Vercel logs for error details
- The issue might be with the data or a specific query

---

## 💡 Tips for Success

1. **Always test locally first** before deploying
   ```bash
   npm run dev
   ```

2. **Keep your code on GitHub updated** - every time you make changes, commit and push them

3. **Vercel automatically deploys** when you push to GitHub - no need to manually deploy each time!

4. **Use the /docs endpoint** to explore all available endpoints interactively

5. **Save your Vercel URL** - you'll need it to access your API

---

## 🎓 What You Learned

Congratulations! You've learned:
- ✅ How to set up Node.js and Git
- ✅ How to use GitHub to store your code
- ✅ How to deploy an API using Vercel
- ✅ How to test API endpoints
- ✅ All the available endpoints in your ExerciseDB API

You're now ready to build awesome fitness applications! 🏋️‍♂️

---

## 📞 Need Help?

- Check the [README.md](README.md) for more information about the API
- Visit the API documentation at `YOUR_URL/docs`
- Check Vercel's documentation at [vercel.com/docs](https://vercel.com/docs)

---

**Made with ❤️ for aspiring developers**

*This guide was generated by your EL Architect. Ask me anything!*

**Made with ❤️ by GodFaather-Zeus**