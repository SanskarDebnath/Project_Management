# Frontend Monorepo - Enterprise Portal

Welcome to the **Frontend Monorepo** for the Enterprise Project & Employee Management Platform. This repository contains the client-side applications built using **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Workspace Applications

This monorepo uses npm workspaces and houses two primary applications:

| Application | Path | Dev Server Port | Description |
| :--- | :--- | :--- | :--- |
| **Employee Portal** | `apps/employee` | `http://localhost:3000` | Interface for employees to view tasks, submit reports, and track projects. |
| **Management Portal** | `apps/management` | `http://localhost:5174` | Administrative interface for managers to oversee projects, approve workflows, and manage teams. |

---

## 🛠️ Tech Stack & Dependencies

- **Core**: React 19, TypeScript 5.7, Vite 6
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
- **Icons & UI**: Lucide React Icons, Framer Motion, Sonner (Toasts), Recharts
- **State Management**: Zustand
- **Form & Validation**: React Hook Form, Zod
- **Routing**: React Router v7

---

## 📁 Directory Structure

```
Frontend/
├── apps/
│   ├── employee/               # Employee Portal Application
│   │   ├── src/                # Components, Pages, Hooks, Stores
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── management/             # Management Portal Application
│       ├── src/                # Components, Pages, Hooks, Stores
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── .gitignore                  # Ignored files (node_modules, .env, Dockerfile)
├── Dockerfile                  # Multi-stage Docker build configuration
├── package.json                # Workspace root package configuration
├── README.md                   # Frontend Documentation
└── tsconfig.json               # Solution-style TypeScript configuration
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher

### Installation

From the `Frontend` root directory, install all workspace dependencies:

```bash
npm install
```

---

## 📜 NPM Scripts

You can run commands for individual workspace applications or across all workspaces simultaneously from the root `Frontend` folder:

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev:employee` | `npm run dev:employee` | Starts the Employee Portal dev server on `http://localhost:3000` |
| `dev:management` | `npm run dev:management` | Starts the Management Portal dev server on `http://localhost:5174` |
| `build:employee` | `npm run build:employee` | Builds production artifacts for Employee Portal |
| `build:management` | `npm run build:management` | Builds production artifacts for Management Portal |
| `build:all` | `npm run build:all` | Builds production artifacts for all applications |

---

## 🐳 Docker Setup

A multi-stage `Dockerfile` is configured to build and serve both applications via Nginx.

### Build Docker Image

```bash
docker build -t enterprise-frontend:latest .
```

### Run Docker Container

```bash
docker run -d -p 8080:80 enterprise-frontend:latest
```

Once running, access:
- **Employee Portal**: `http://localhost:8080/employee/`
- **Management Portal**: `http://localhost:8080/management/`

---

## 🔑 Environment Variables (`.env`)

Each application (`apps/employee/.env` and `apps/management/.env`) uses environment variables starting with `VITE_`:

```env
# Security & Encryption
VITE_SECRET_KEY=EnterprisePortalAESSecretKey2026Secure

# API Configurations
VITE_BASE_URL=/
VITE_BASE_API_URL=http://localhost:8000/v1
VITE_BASE_API_URL_WITHOUT_BIDDER=http://localhost:8000/v1/master

# Branding & Navigation
VITE_DEPARTMENT_NAME=Department of Public Works & Infrastructure
VITE_GOVERNMENT_NAME=State Portal Authority
VITE_PORTAL_NAME=Enterprise Employee & Project Tracking Portal
VITE_MANAGEMENT_URL=http://localhost:5174
```

> ⚠️ **Note**: All `.env` files are ignored by git in [.gitignore](file:///c:/Users/Sanskar%20Debnath/Desktop/Project_Management/Frontend/.gitignore).

---

## 🔒 Security & Git Ignore Policy

The project [.gitignore](file:///c:/Users/Sanskar%20Debnath/Desktop/Project_Management/Frontend/.gitignore) explicitly ignores:
1. **NPM Packages**: `node_modules/`, `*.log`
2. **Environment Secrets**: `.env`, `.env.*`
3. **Containerization Files**: `Dockerfile`, `Dockerfile.*`
