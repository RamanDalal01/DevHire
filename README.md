# DevHire — Developer Job Board Platform

**DevHire** is a premium, skill-first developer job board designed to streamline software developer recruitment. It solves tech hiring by matching companies with qualified tech talent through modern interactive dashboards, structured filters, and SEO-optimized public listing pages.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Axios, Lucide React (for premium icons)
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT (JSON Web Tokens), bcryptjs
- **Services**: Cloudinary (Mock/Active Resume uploads), Nodemailer (Mock/Active email updates)

---

## 🛠️ Monorepo Structure

```text
DevHire/
├── backend/            # Express API Server
│   ├── config/         # Database and third-party configs
│   ├── controllers/    # Request controllers containing logic
│   ├── middleware/     # JWT authentication and RBAC middlewares
│   ├── models/         # Mongoose User, Job, & Application schemas
│   ├── routes/         # Express Router routes
│   └── server.js       # Backend Entry point
├── frontend/           # Next.js App Router Client
│   ├── src/
│   │   ├── app/        # Pages, Layouts, and routing
│   │   ├── components/ # Custom reusable UI components
│   │   └── context/    # Global Auth State & Axios Context
└── package.json        # Main script orchestrator
```

---

## 📦 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 2. Installation
To install dependencies for the root, backend, and frontend directories all in one go, run:
```bash
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in the `/backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devhire
JWT_SECRET=super_secret_jwt_key_devhire_2026
JWT_EXPIRE=7d

# Optional Cloudinary (for resumes) - will fall back to local disk if omitted
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional Nodemailer (for status updates) - will print to console if omitted
EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASS=
```

### 4. Running the Application
To run both backend and frontend concurrently in development mode:
```bash
npm run dev
```
The **Next.js UI** will be available at `http://localhost:3000`.
The **Express API Server** will be available at `http://localhost:5000`.

---

## 🌟 Premium Features Implemented
- **Premium Styling**: Sleek glassmorphic dark interface using curated harmonious HSL tones, smooth CSS transitions, glowing background gradients, and sleek typography.
- **Interactive Search & Filter**: Real-time filtering by tech stacks, salary range, job type, and location.
- **Role-Based Access (RBAC)**: Distinct, highly optimized workflows and dashboards for **Developers** (apply to jobs, track applications, upload resume, list skills) and **Companies** (post jobs, edit jobs, view applicants, manage status updates).
- **SEO & SSR Enabled**: Public job listing page and job detail pages utilize SSR (Server Components) for optimized search crawlers, fast initial load, and structured meta tags.
- **Fail-safe Integrations**: Built-in dynamic fallbacks for Cloudinary (local uploads) and Nodemailer (console logging) so the platform is immediately functional without setup friction.
