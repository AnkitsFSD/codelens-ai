# 🔍 CodeLens AI

**Live Demo:** [codelens-ai-pink.vercel.app](https://codelens-ai-pink.vercel.app/)  
**API Backend:** [codelens-ai-fnlw.onrender.com](https://codelens-ai-fnlw.onrender.com/)

CodeLens AI is a full-stack, AI-powered static analysis and refactoring engine. It leverages Google's Gemini API to provide intelligent code reviews, detect bugs, and suggest optimized refactoring with deterministic JSON evaluation and a Git-style side-by-side diff viewer.

---

## ✨ Key Features

- **Backend-For-Frontend (BFF) Architecture:** Built with FastAPI to act as a secure proxy, completely hiding the Gemini API keys and credentials from the client side.
- **Interactive Diff Viewer:** Integrates the Microsoft Monaco Editor to display side-by-side comparisons of original and AI-optimized code, just like GitHub PRs.
- **Deterministic AI Outputs:** Implements strict prompt engineering and payload validation to ensure the LLM returns structured JSON data instead of probabilistic plain text.
- **Robust Security & Error Handling:** Includes strict payload limits, ANSI sanitization, and graceful UI error boundaries (e.g., handling 503 API limits without crashing).

## 💻 Tech Stack

**Frontend:**
- React.js (Vite)
- Microsoft Monaco Editor (for IDE-like code input & Diff viewing)
- CSS3 / Custom UI Components
- Hosted on **Vercel**

**Backend:**
- FastAPI (Python)
- Google Gemini 2.5 Flash API
- Uvicorn / Pydantic (for data validation)
- Hosted on **Render**

---

## 🚀 Local Development Setup

If you want to run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/AnkitsFSD/codelens-ai.git](https://github.com/AnkitsFSD/codelens-ai.git)
cd codelens-ai
