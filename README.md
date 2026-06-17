# FixItNow — Frontend Application

Welcome to the frontend repository for **FixItNow**. This repository (Company C) is dedicated entirely to the user interface and client-side logic of the application.

---

## ⚠️ Critical Repository Rules

To maintain code integrity and ensure smooth collaboration across the development team, please strictly adhere to the following workflow:

*   **No Direct Commits:** Do not make or push any direct changes to the `main` branch.
*   **Branch Strategy:** **Always use your assigned subsystem branch for coding! 😊** 
*   **Pull Requests:** Submit a Pull Request (PR) to merge your subsystem branch into the main branch only after thorough local testing.

---

## 🛠️ Tech Stack

*   **Runtime Environment:** Node.js (v18+ recommended)
*   **Frontend Framework:** React
*   **Build Tool:** Vite (configured for `npm run dev`)
*   **Package Manager:** npm

---

## 🚀 Getting Started & Frontend Setup

Follow these step-by-step instructions to clone the repository, set up your local environment, and spin up the development server.

### Step 1: Clone the Repository
Open your terminal, navigate to your local workspace directory, and run:
```bash
git clone "https://github.com/Company-C-MSD-Project/frontend.git"
```

### Step 2: Move into the Project Root
Navigate into the newly cloned project folder:
```bash
cd frontend
```

### Step 3: Switch to Your Subsystem Branch
**Crucial Step**. Switch to your designated working branch before installing anything or making modifications:
```bash
git checkout <your-subsystem-branch-name>
```

### Step 4: Navigate to the Frontend Application Directory
Move into the specific directory containing the React application configuration and source code:
```bash
cd fix_it_now
```

### Step 5: Install Dependencies
Download and install all the necessary Node modules specified in the package.json file:
```bash
npm install
```

### Step 6: Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```
The app runs at **http://localhost:3000**.

> Convenience launcher at the monorepo root: `start-frontend.cmd` (auto-installs if needed).

---

## 🔌 Connecting to the backend (important)

The frontend talks to the **Spring Boot backend on `http://localhost:8080`**
(`VITE_USE_NEW_API="true"` in the committed `.env`). So before you sign in or load data,
**start the backend first** (see the backend repo's README). If the backend isn't running
on `:8080`, you'll see `404`s / failed requests and Google sign-in won't work.

---

## ⚙️ Environment configuration

The committed `fix_it_now/.env` already provides the backend URL and feature flag, so the
app runs out of the box. The **only** thing missing on a fresh clone is the (git-ignored)
**Google Maps key**, which is optional:

```bash
cd fix_it_now
cp .env.local.example .env.local      # then put your Google Maps key in it
```
Without a Maps key the booking address field gracefully falls back to a plain text input —
everything else works.

---

## ✅ Testing

Unit tests use **Vitest + Testing Library**:
```bash
cd fix_it_now
npm run test          # run once
npm run test:watch    # watch mode
```
Tests also run automatically on every push via **GitHub Actions**
(`.github/workflows/frontend-ci.yml`).

---

## 🧰 Troubleshooting

- **`npm run dev` says "Could not read package.json"** → you're in the wrong folder. The
  Node project is in `fix_it_now/`, so run `cd fix_it_now` first.
- **Google sign-in shows `404 ... /api/v1/auth/oauth/google`** → the **backend isn't
  running on `:8080`** (or an old process is squatting on the port). Start the backend, then retry.
- **Port 3000 already in use** → stop the other dev server, or change the port in `vite.config.ts`.