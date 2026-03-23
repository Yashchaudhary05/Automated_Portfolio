# DevOps CI/CD Pipeline — End-to-End

![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-Automation-EE0000?logo=ansible&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)

Production-grade CI/CD pipeline that automates the entire software delivery lifecycle — from code commit to containerized deployment — using industry-standard DevOps tooling. Zero manual intervention. Fully reproducible. Infrastructure as Code.

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Developer   │────▶│  GitHub (main)   │────▶│   GitHub     │────▶│  Docker Hub  │────▶│  Target Server  │
│  Push Code   │     │  Repository      │     │   Actions    │     │  Registry    │     │  (via Ansible)  │
└─────────────┘     └──────────────────┘     │              │     └──────────────┘     └─────────────────┘
                                              │  1. Test     │
                                              │  2. Build    │
                                              │  3. Push     │
                                              │  4. Deploy   │
                                              └──────────────┘
```

### Pipeline Flow

```
Code Push → GitHub Actions Triggered
  ├── Stage 1: TEST
  │   ├── Checkout code
  │   ├── Setup Node.js 20 (with npm cache)
  │   ├── Install dependencies (npm ci)
  │   ├── Run test suite (Jest + Supertest)
  │   └── Upload coverage report
  │
  ├── Stage 2: BUILD & PUSH (only on main)
  │   ├── Setup Docker Buildx
  │   ├── Login to Docker Hub (secrets)
  │   ├── Build multi-stage Docker image
  │   ├── Push with SHA + latest tags
  │   └── Verify pushed image
  │
  └── Stage 3: DEPLOY (only on main)
      ├── Install Ansible
      ├── Run playbook against target servers
      ├── Pull latest Docker image
      ├── Stop old container gracefully
      ├── Start new container with health check
      └── Verify deployment via /health endpoint
```

---

## Project Structure

```
devops/
├── app/                          # Application source code
│   ├── src/
│   │   ├── app.js                # Express app (routes, middleware)
│   │   └── server.js             # Server entry point
│   ├── tests/
│   │   └── app.test.js           # Jest test suite
│   ├── .dockerignore             # Docker build context exclusions
│   └── package.json              # Node.js dependencies
│
├── docker/                       # Container configuration
│   ├── Dockerfile                # Multi-stage production build
│   ├── .dockerignore             # Build context exclusions
│   └── docker-compose.yml        # Local orchestration
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # GitHub Actions pipeline
│
├── ansible/                      # Deployment automation
│   ├── ansible.cfg               # Ansible configuration
│   ├── playbook.yml              # Deployment playbook
│   ├── inventory/
│   │   └── hosts.yml             # Target server inventory
│   └── vars/
│       └── main.yml              # Deployment variables
│
├── scripts/
│   └── deploy-local.sh           # Quick local deployment
│
├── .gitignore
├── PORTFOLIO.md                  # Portfolio integration guide
└── README.md                     # This file
```

---

## Tech Stack

| Layer          | Technology                        | Purpose                            |
| -------------- | --------------------------------- | ---------------------------------- |
| **Application**| Node.js 20 + Express              | REST API with health endpoints     |
| **Security**   | Helmet, CORS                      | HTTP security headers              |
| **Testing**    | Jest + Supertest                  | Unit & integration tests           |
| **Container**  | Docker (multi-stage, Alpine)      | Lightweight production image       |
| **CI/CD**      | GitHub Actions                    | Automated test → build → deploy    |
| **Registry**   | Docker Hub                        | Container image storage            |
| **Deployment** | Ansible                           | Infrastructure automation          |
| **Monitoring** | Docker HEALTHCHECK                | Container health verification      |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone & Run Locally

```bash
git clone https://github.com/Yashchaudhary05/devops-pipeline.git
cd devops-pipeline

# Install dependencies
cd app && npm install

# Run the application
npm start
# → http://localhost:3000
# → http://localhost:3000/health

# Run tests
npm test
```

### 2. Run with Docker

```bash
# Build and run
docker build -t devops-pipeline-app -f docker/Dockerfile app/
docker run -d -p 3000:3000 --name devops-app devops-pipeline-app

# Or use Docker Compose
cd docker && docker-compose up -d
```

### 3. Deploy with Ansible

```bash
cd ansible
ansible-playbook playbook.yml -i inventory/hosts.yml
```

---

## CI/CD Pipeline Setup

### GitHub Repository Secrets

Add these secrets in your GitHub repository (`Settings → Secrets → Actions`):

| Secret               | Description                     |
| -------------------- | ------------------------------- |
| `DOCKERHUB_USERNAME` | Your Docker Hub username        |
| `DOCKERHUB_TOKEN`    | Docker Hub access token         |

### Trigger the Pipeline

```bash
git add .
git commit -m "feat: initial pipeline setup"
git push origin main
```

The pipeline runs automatically on every push to `main`.

---

## API Endpoints

| Endpoint   | Method | Description                    | Response                      |
| ---------- | ------ | ------------------------------ | ----------------------------- |
| `/`        | GET    | Application status & info      | `{ status, message, version }`|
| `/health`  | GET    | Health check for monitoring    | `{ status, uptime }`         |
| `/info`    | GET    | Runtime metadata               | `{ app, node, platform }`    |

---

## Docker Best Practices Used

- **Multi-stage build** — Separate builder and production stages
- **Alpine base image** — Minimal footprint (~50MB final image)
- **Non-root user** — Security hardened container
- **Layer caching** — Dependencies cached separately from source
- **HEALTHCHECK** — Built-in container health monitoring
- **.dockerignore** — Clean build context

---

## Key Learnings & DevOps Principles Applied

- **End-to-end automation**: Zero manual steps from code commit to production deployment
- **Infrastructure as Code**: All deployment config is version-controlled and reproducible via Ansible
- **Security-first containers**: Non-root user, Helmet HTTP headers, GitHub Secrets for credentials
- **Immutable deployments**: Every deploy pulls a fresh, versioned image — no in-place mutations
- **Observability hooks**: Health check endpoints and Docker HEALTHCHECK for proactive monitoring
- **Industry-standard toolchain**: GitHub Actions + Docker + Ansible — the same stack used at Cisco, Netflix, and Google

---

## Screenshots

> Add screenshots of your running pipeline for maximum portfolio impact

| Screenshot                        | Description                                |
| --------------------------------- | ------------------------------------------ |
| `screenshots/pipeline-pass.png`   | GitHub Actions pipeline running green      |
| `screenshots/docker-hub.png`      | Docker Hub with pushed images              |
| `screenshots/app-running.png`     | Application responding on localhost        |
| `screenshots/health-check.png`    | Health endpoint response                   |
| `screenshots/ansible-deploy.png`  | Ansible playbook execution output          |

---

## Future Enhancements

- [ ] Add Kubernetes (k8s) manifests for container orchestration
- [ ] Implement Terraform for infrastructure provisioning
- [ ] Add Prometheus + Grafana monitoring stack
- [ ] Implement blue-green deployment strategy
- [ ] Add Slack/email notifications on pipeline events

---

## Author

**Yash Chaudhary**
Software Engineer @ Cisco | AWS CSA | CCNA

- [GitHub](https://github.com/Yashchaudhary05)
- [Portfolio](https://yashchaudhary05.github.io/Portfolio)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
