<div align="center">
  <img src="https://cdn.jacobtechlabs.dev/banner.png" alt="JacobTechLabs Fitness API Banner" width="100%" height="400px" />
  
  <br />
  <br />
  <img src="https://cdn.jacobtechlabs.dev/logo.png" alt="JacobTechLabs Logo" width="120" height="120" />

  <h1>JacobTechLabs Fitness API</h1>
  <h3>Developer-First API Infrastructure for Fitness Applications</h3>
  
  <p>
    <strong>5,000+ structured exercises</strong> • <strong>Sub-100ms Response Time</strong> • <strong>99.9% Uptime</strong>
  </p>
  
  <p>
    <span style="margin-right: 10px;">
      <a href="https://docs.jacobtechlabs.dev">
        <img src="https://img.shields.io/badge/Documentation-1a365d?style=for-the-badge&logo=book&logoColor=white" alt="Documentation" />
      </a>
    </span>
    <span style="margin-right: 10px;">
      <a href="https://github.com/jacobtechlabs/api-core">
        <img src="https://img.shields.io/badge/GitHub-1a365d?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
      </a>
    </span>
    <span>
      <a href="#quick-start">
        <img src="https://img.shields.io/badge/Quick%20Start-00d4ff?style=for-the-badge&logo=rocket&logoColor=black" alt="Quick Start" />
      </a>
    </span>
  </p>

</div>

---

## 🚀 Overview

**JacobTechLabs Fitness API** is a developer-first API infrastructure providing fast, reliable access to 5,000+ structured fitness exercises. Built with modern technologies (Bun, Hono, TypeScript) and designed for seamless integration into fitness apps, health platforms, and workout tools.

### Key Features

- ⚡ **Lightning Fast**: Sub-100ms response times with intelligent caching
- 🔍 **Advanced Search**: Fuzzy search across exercise names, muscles, and equipment
- 📊 **Structured Data**: Consistent JSON schema with comprehensive metadata
- 🛡️ **Production Ready**: Rate limiting, security headers, and health monitoring
- 📚 **OpenAPI/Swagger**: Interactive documentation at `/docs`

### Perfect For

- 💪 **Fitness App Developers** - Build workout tracking and planning apps
- 🏥 **Health Platforms** - Integrate exercise data into wellness solutions
- 🎯 **Personal Training Tools** - Create custom workout generators
- 📱 **Mobile Apps** - RESTful API perfect for iOS/Android integration
- 🔬 **Research Projects** - Structured data for fitness analytics

---

## 🎯 Quick Start

### 1. Deploy Your Own Instance

#### Option A: Vercel (One-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jacobtechlabs/api-core)

#### Option B: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/jacobtechlabs/api-core.git
cd api-core

# Build and run with Docker
docker build -t jacobtechlabs-api .
docker run -p 3000:3000 jacobtechlabs-api
```

#### Option C: Local Development

```bash
# Clone and install dependencies
git clone https://github.com/jacobtechlabs/api-core.git
cd api-core

# Using Bun (recommended)
bun install
bun run dev

# Or using npm
npm install
npm run dev
```

### 2. Make Your First Request

```bash
curl https://your-api-url/api/v1/exercises?limit=5
```

---

## 📡 API Endpoints

### Exercises

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/v1/exercises` | List all exercises with pagination | `?limit=10&offset=0` |
| `GET /api/v1/exercises/search` | Search exercises by keyword | `?q=bench&threshold=0.3` |
| `GET /api/v1/exercises/filter` | Filter by multiple criteria | `?muscles=chest&equipment=barbell` |
| `GET /api/v1/exercises/{id}` | Get specific exercise by ID | `/api/v1/exercises/K6NnTv0` |

### Reference Data

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/muscles` | List all target muscles |
| `GET /api/v1/bodyparts` | List all body parts |
| `GET /api/v1/equipments` | List all equipment types |
| `GET /api/v1/muscles/{name}/exercises` | Exercises by muscle group |
| `GET /api/v1/bodyparts/{name}/exercises` | Exercises by body part |
| `GET /api/v1/equipments/{name}/exercises` | Exercises by equipment |

### System

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check status |
| `GET /docs` | Interactive API documentation |
| `GET /swagger` | OpenAPI specification (JSON) |

---

## 💻 Code Examples

### JavaScript/TypeScript

```typescript
// Search exercises
const response = await fetch(
  'https://api.jacobtechlabs.dev/api/v1/exercises/search?q=chest'
);
const exercises = await response.json();

// Get exercises by muscle
const muscleExercises = await fetch(
  'https://api.jacobtechlabs.dev/api/v1/muscles/chest/exercises'
);
```

### Python

```python
import requests

# Get all exercises with pagination
response = requests.get(
    'https://api.jacobtechlabs.dev/api/v1/exercises',
    params={'limit': 10, 'offset': 0}
)
exercises = response.json()
```

### cURL

```bash
# Filter exercises by equipment and muscle
curl "https://api.jacobtechlabs.dev/api/v1/exercises/filter?equipment=dumbbell&muscles=biceps"
```

---

## 🏋️‍♂️ Exercise Data Model

```json
{
  "exerciseId": "K6NnTv0",
  "name": "Bench Press",
  "imageUrl": "Barbell-Bench-Press_Chest.png",
  "equipments": ["Barbell"],
  "bodyParts": ["Chest"],
  "exerciseType": "weight_reps",
  "targetMuscles": ["Pectoralis Major Clavicular Head"],
  "secondaryMuscles": ["Deltoid Anterior", "Triceps Brachii"],
  "videoUrl": "Barbell-Bench-Press_Chest_.mp4",
  "keywords": [
    "Chest workout with barbell",
    "Strength training for chest"
  ],
  "overview": "The Bench Press is a classic strength training exercise...",
  "instructions": [
    "Grip the barbell with your hands slightly wider than shoulder-width apart...",
    "Slowly lower the barbell down to your chest..."
  ],
  "exerciseTips": [
    "Avoid Arching Your Back...",
    "Controlled Movement..."
  ],
  "variations": [
    "Decline Bench Press",
    "Close-Grip Bench Press"
  ],
  "relatedExerciseIds": ["U0uPZBq", "QD32SbB"]
}
```

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Framework**: [Hono](https://hono.dev) - Lightweight, fast web framework
- **Language**: TypeScript - Type-safe development
- **API Docs**: OpenAPI 3.1 + Scalar UI
- **Testing**: Vitest
- **Linting**: ESLint + Prettier

---

## 📊 Deployment Options

| Platform | Best For | Setup Time |
|----------|----------|------------|
| **Google Cloud Run** | Production, auto-scaling | 15 min |
| **Railway** | Quick deployment, prototyping | 5 min |
| **Render** | Simplicity, free tier | 5 min |
| **Vercel** | Serverless functions | 2 min |
| **Self-Hosted** | Full control, enterprise | 30 min |

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📬 Support

| Channel | Contact |
|---------|---------|
| 📧 **Email** | [dev@jacobtechlabs.dev](mailto:dev@jacobtechlabs.dev) |
| 🐛 **Issues** | [GitHub Issues](https://github.com/jacobtechlabs/api-core/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/jacobtechlabs/api-core/discussions) |

---

## 📄 License

[AGPL-3.0](./LICENSE) - JacobTechLabs

---

<div align="center">
  <p><strong>Powered by JacobTechLabs</strong></p>
  <p><em>Building the future of fitness technology</em></p>
</div>
