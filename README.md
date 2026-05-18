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