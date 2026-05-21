# DevHire — Tech Recruitment Platform

**DevHire** is a skill-first recruitment board designed exclusively for software developers and tech employers. By offering dedicated, role-specific portals for recruiters and candidates, DevHire eliminates the friction of generic job platforms through real-time tag-based filtering, clean dark-mode visuals, and secure backend architecture.

---

### 1. Project Overview

Finding and hiring technical talent on generic platforms is slow and inefficient. DevHire addresses this gap by creating an streamlined, developer-first job marketplace. 

Built as a full-stack Node.js and Next.js application, the platform provides tailored interfaces:
* **Developers** can create detailed profiles, showcase engineering skills, upload resumes, and track their application lifecycle.
* **Recruiters** can post job vacancies, manage applicant pipelines in real-time, and update application statuses instantly.
* **Impact**: Empowers companies to filter technical candidates early and allows developers to find role-matching vacancies with zero clutter.

---

### 2. Features

* **Tailored Workspaces**: Independent interfaces for candidate tracking (developers) and job post management (recruiters).
* **Smart Filter & Search**: Instant, real-time query mechanics based on skill tags, salary ranges, location, and employment type.
* **Fallback Asset Storage**: Intelligent local disk fallback for document uploads when Cloudinary configurations are absent, preventing setup barriers.
* **Fallback Notifications**: Clean server console logging fallback for transaction emails when SMTP relays are unconfigured.
* **Security Hardening**: Protected with double-gated API rate limiters (preventing automated brute-force hits), input sanitization against query injection, and secure Helmet headers.
* **Centralized Resilience**: Express-wide error middleware translating database anomalies into structured JSON responses, paired with client-side Next.js error boundaries.

---

### 3. Tech Stack

* **Frontend**: Next.js 14 (App Router), Vanilla CSS (Custom Glassmorphism), Axios, Lucide Icons, React Hot Toast
* **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM)
* **Monitoring & Security**: Winston Logger (Structured log rotation), Helmet, Express-Rate-Limit, Express-Mongo-Sanitize

---

### 4. Installation

Get the application running locally in three quick steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RamanDalal01/DevHire.git
   cd DevHire
   ```

2. **Install Dependencies** (Installs packages for root, backend, and frontend concurrently):
   ```bash
   npm run install-all
   ```

3. **Launch Local Servers**:
   ```bash
   npm run dev
   ```
   * Next.js UI will run on `http://localhost:3000`
   * Express API will run on `http://localhost:5000`

---

### 5. Environment Variables

To run the backend, create a `.env` file in the `/backend` folder. Below is the `.env.example` template:

```env
# Server Port Configuration
PORT=5000

# Database Connection (MongoDB)
MONGODB_URI=your_mongodb_uri

# Secure Signature & Token Configurations
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Email Notification Delivery (SMTP - Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

# Media Storage Credentials (Cloudinary - Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

### 6. API Endpoints (short)

#### User Accounts & Profile
* `POST /api/auth/register` — Create developer or recruiter account
* `POST /api/auth/login` — Create secure session
* `GET /api/auth/me` — Retrieve current user profile
* `PUT /api/auth/profile` — Update user profile details
* `POST /api/auth/upload` — Upload candidate resume file

#### Job Listings
* `GET /api/jobs` — Retrieve and filter vacancies
* `POST /api/jobs` — Create new job post *(Recruiter only)*
* `PUT /api/jobs/:id` — Edit vacancy details *(Owner only)*
* `DELETE /api/jobs/:id` — Delete vacancy *(Owner only)*

#### Applications
* `POST /api/jobs/:id/apply` — Apply to a job vacancy *(Developer only)*
* `GET /api/applications/me` — Track submitted applications *(Developer only)*
* `GET /api/applications/company` — Review incoming resumes *(Recruiter only)*
* `PUT /api/applications/:id/status` — Transition application stage *(Recruiter only)*

---

### 7. Folder Structure

```text
DevHire/
├── backend/            # Express API Server
│   ├── config/         # Logger, database connection, and mail settings
│   ├── controllers/    # Request controllers and business logic
│   ├── middleware/     # RBAC, security limiters, and error handlers
│   ├── models/         # Mongoose Schemas (User, Job, Application)
│   ├── routes/         # Express API route declarations
│   └── server.js       # Express server entry point
├── frontend/           # Next.js App Router Client
│   ├── src/
│   │   ├── app/        # Pages, layouts, recovery boundaries, and 404s
│   │   ├── components/ # Custom global elements (Navbar, Footer, Buttons)
│   │   ├── context/    # React context and custom Axios configuration
│   │   └── utils/      # Client-side endpoint consumers
│   └── package.json    # Frontend configuration and scripts
└── package.json        # Root workspace runner and execution setup
```

---

### 8. Future Improvements

1. **AI Resume Matching**: Auto-match developer profile resumes against recruiter job specifications to provide a compatibility percentage.
2. **Interactive Code Playground**: Embedded tech screen sandbox within the recruitment flow for early skills evaluation.
3. **Integrated Scheduling**: Live integrations with calendar services (e.g. Google Calendar or Jitsi) to schedule technical interviews directly.

