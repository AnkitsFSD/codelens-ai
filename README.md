# ⚡ CodeLens AI

**An AI-Powered Static Analysis & Refactoring Engine**

CodeLens AI is a full-stack developer tool designed to catch logical flaws, security vulnerabilities, and performance bottlenecks that traditional linters miss. It leverages a robust Backend-For-Frontend (BFF) architecture using FastAPI, paired with a React and Monaco Editor frontend, to deliver real-time, deterministic code reviews powered by the Google Gemini API.

---

## ✨ Features

- **Semantic Code Auditing:** Goes beyond static AST analysis to identify intent-based bugs, memory leaks, and unchecked exceptions.
- **Git-Style Diff Viewer:** Implements a side-by-side comparison of original and optimized code for seamless developer UX.
- **Native Developer Experience:** Integrates Monaco Editor (the core of VS Code) for out-of-the-box syntax highlighting, auto-indentation, and multi-language support.
- **Security First:** 
  - API keys are completely isolated on the server side.
  - Strict input sanitization and payload limits (`max_length=5000`) prevent token exhaustion attacks.
  - Hardened system prompts prevent prompt injection vulnerabilities.
- **Deterministic JSON Output:** Gemini LLM is constrained to output strict schemas, ensuring reliable UI state management without parsing errors.

---

## 🏗️ Architecture & Tech Stack

The project operates as a monorepo containing both the backend daemon and the frontend client.

### 🖥️ Frontend (Client)
- **Framework:** React (Vite)
- **Code Editor:** `@monaco-editor/react`
- **Diff Viewer:** `react-diff-viewer-continued`
- **State Management:** React Hooks with strict error boundaries and loading skeleton states.

### ⚙️ Backend (Server)
- **Framework:** FastAPI (Python)
- **LLM Engine:** Google Gemini 2.5 Flash API
- **Concurrency:** Non-blocking async execution (`run_in_threadpool`) prevents event-loop bottlenecks under load.
- **Data Validation:** Pydantic models enforce strict I/O payload boundaries.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Google Gemini API Key

### 1. Backend Setup (FastAPI)
Navigate to the root directory and set up the Python environment:

\`\`\`bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn google-genai pydantic python-dotenv

# Set up environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run the server
uvicorn server:app --reload
\`\`\`
*The API will be available at `http://localhost:8000`. You can test endpoints via the Swagger UI at `http://localhost:8000/docs`.*

### 2. Frontend Setup (React)
Open a new terminal window, navigate to the `client` directory:

\`\`\`bash
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
\`\`\`
*The UI will be accessible at `http://localhost:5173`.*

---

## 🔒 Security & Performance Considerations

- **CORS Policy:** FastAPI strictly allows traffic only from specified frontend origins.
- **Token Economics:** Pydantic validators reject oversized payloads before API invocation, saving compute and API quota.
- **Graceful Failures:** If the LLM hallucinates malformed JSON, the backend intercepts the `JSONDecodeError` and translates it into a standard `502 Bad Gateway` response, preventing frontend crashes.

---
*Built as a production-grade demonstration of AI integration, secure system design, and modern developer tooling.*