# 🚀 JacobTechLabs Fitness API - Deployment Guide

Complete deployment guide for the JacobTechLabs Fitness API. Deploy your own instance in minutes.

---

## 📚 Quick Links

- **Documentation**: [docs.jacobtechlabs.dev](https://docs.jacobtechlabs.dev)
- **GitHub**: [github.com/jacobtechlabs/api-core](https://github.com/jacobtechlabs/api-core)
- **Support**: [dev@jacobtechlabs.dev](mailto:dev@jacobtechlabs.dev)

---

## 🎯 Deployment Options

Choose the deployment method that best fits your needs:

| Method | Best For | Time to Deploy | Cost |
|--------|----------|----------------|------|
| **Docker** | Production, full control | 10 min | Server costs |
| **Google Cloud Run** | Auto-scaling production | 15 min | Pay-per-use |
| **Railway** | Quick deployment | 5 min | Generous free tier |
| **Render** | Simple hosting | 5 min | Free tier available |
| **Vercel** | Serverless functions | 2 min | Free tier |

---

## 🐳 Option 1: Docker (Recommended for Production)

### Prerequisites
- Docker installed ([docker.com](https://docker.com))

### Build and Run

```bash
# Clone repository
git clone https://github.com/jacobtechlabs/api-core.git
cd api-core

# Build Docker image
docker build -t jacobtechlabs-api .

# Run container
docker run -d -p 3000:3000 --name jtl-api jacobtechlabs-api

# Test
curl http://localhost:3000/health
```

### Using Docker Compose

```bash
# Start with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☁️ Option 2: Google Cloud Run (Best for Production)

### Prerequisites
- Google Cloud account with billing enabled
- Google Cloud CLI installed

### Deploy Steps

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/jacobtechlabs-api

# Deploy to Cloud Run
gcloud run deploy jacobtechlabs-api \
  --image gcr.io/PROJECT-ID/jacobtechlabs-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --max-instances 10
```

**Why Cloud Run?**
- ✅ Auto-scales to zero (cost-effective)
- ✅ Sub-second cold starts with Bun
- ✅ Global load balancing
- ✅ Built-in HTTPS

---

## 🚂 Option 3: Railway (Easiest)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `jacobtechlabs/api-core`
5. Railway auto-detects and deploys

Done! Railway provides a URL automatically.

---

## 🎨 Option 4: Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your GitHub repo
5. Select:
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Port**: 3000
6. Click "Create Web Service"

---

## ⚡ Option 5: Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jacobtechlabs/api-core)

**Note**: Vercel uses Node.js runtime instead of Bun. For best performance, use Docker deployment options.

---

## 🧪 Testing Your Deployment

### Health Check

```bash
curl https://your-api-url/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z",
  "version": "1.0.0"
}
```

### API Endpoints Test

```bash
# List exercises (paginated)
curl "https://your-api-url/api/v1/exercises?limit=5"

# Search exercises
curl "https://your-api-url/api/v1/exercises/search?q=bench+press"

# Get exercises by muscle
curl "https://your-api-url/api/v1/muscles/chest/exercises"

# List reference data
curl "https://your-api-url/api/v1/muscles"
curl "https://your-api-url/api/v1/equipments"
curl "https://your-api-url/api/v1/bodyparts"
```

### Interactive Documentation

Visit `https://your-api-url/docs` to explore the API interactively.

---

## 🔧 Environment Variables

Optional configuration via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |

---

## 🔒 Security Best Practices

1. **Rate Limiting**: Enabled by default (100 req/min)
2. **CORS**: Configure allowed origins in production
3. **Security Headers**: Helmet.js included
4. **Health Checks**: Use `/health` for monitoring

---

## 📊 Monitoring & Logging

### Health Endpoint
- **URL**: `/health`
- **Returns**: Status, timestamp, version

### Response Headers
All responses include:
- `X-Response-Time` - Request processing time
- `X-Powered-By` - API Engine identifier

---

## 🆘 Troubleshooting

### Build Failures

```bash
# Clean and rebuild
rm -rf node_modules dist
bun install
bun run build
```

### Port Already in Use

```bash
# Change port
PORT=8080 bun run dev
```

### Docker Issues

```bash
# Rebuild with no cache
docker build --no-cache -t jacobtechlabs-api .

# Check container logs
docker logs jtl-api
```

---

## 🎓 Need Help?

- 📧 Email: [dev@jacobtechlabs.dev](mailto:dev@jacobtechlabs.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/jacobtechlabs/api-core/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/jacobtechlabs/api-core/discussions)

---

**Powered by JacobTechLabs** - *Building the future of fitness technology*