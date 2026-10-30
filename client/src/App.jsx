import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactDiffViewer from "react-diff-viewer-continued";
import "./App.css";

const MAX_CHARS = 5000;

// Language-wise buggy presets
const CODE_EXAMPLES = {
  javascript: {
    label: "JavaScript (Off-by-One Loop Bug)",
    lang: "javascript",
    code: `function findDuplicates(arr) {\n  let duplicates = [];\n  for (let i = 0; i <= arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n        duplicates.push(arr[i]);\n      }\n    }\n  }\n  return duplicates;\n}`,
  },
  python: {
    label: "Python (Mutable Default Argument)",
    lang: "python",
    code: `def add_item_to_cart(item, cart=[]):\n    cart.append(item)\n    return cart\n\nprint(add_item_to_cart("Apple"))\nprint(add_item_to_cart("Banana"))`,
  },
};

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_EXAMPLES.javascript.code);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    if (CODE_EXAMPLES[selectedLang]) {
      setCode(CODE_EXAMPLES[selectedLang].code);
    }
    setReview(null);
    setError("");
  };

  const handleEditorChange = (value) => {
    // 1. FIX NOW: Client-side Character Limitation
    if (value.length > MAX_CHARS) {
      setError(`Code is too long! Limit is ${MAX_CHARS} characters.`);
    } else {
      setError("");
      setCode(value || "");
    }
  };

  const handleReview = async () => {
    if (!code.trim()) {
      setError("Please paste or type some code first.");
      return;
    }
    if (code.length > MAX_CHARS) {
      setError(`Cannot submit. Please reduce code size below ${MAX_CHARS} characters.`);
      return;
    }

    setLoading(true);
    setError("");
    setReview(null);

    try {
      const response = await fetch("https://codelens-ai-fnlw.onrender.com/review",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      // 2. FIX NOW: Robust Error Boundary handling
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error((errorData && errorData.detail) || `Server Error HTTP ${response.status}`);
      }

      const rawData = await response.json();
      
      // Parse if backend sent stringified JSON, otherwise use as is
      const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      setReview(parsedData);
      
    } catch (err) {
      setError(`Audit Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (review?.fixed_code) {
      navigator.clipboard.writeText(review.fixed_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">⚡ CodeLens AI</h1>
          <span style={{ fontSize: "13px", color: "#8b949e" }}>
            Real-time Static Analysis & Refactoring Engine
          </span>
        </div>
        <span className="badge">FastAPI + Gemini</span>
      </header>

      {error && (
        <div style={{ background: "#381a1c", color: "#ff7b72", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px", border: "1px solid #ff7b72" }}>
          ⚠️ {error}
        </div>
      )}

      <div className="main-grid">
        <section className="pane">
          <div className="pane-header">
            <span style={{ fontWeight: 600 }}>Source Input</span>
            <select value={language} onChange={handleLanguageChange}>
              <option value="javascript">JavaScript Example</option>
              <option value="python">Python Example</option>
            </select>
          </div>

          <div style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid #30363d" }}>
            <Editor
              height="380px"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <span style={{ fontSize: "12px", color: code.length > MAX_CHARS ? "#ff7b72" : "#8b949e" }}>
              {code.length} / {MAX_CHARS} chars
            </span>
            <button className="primary-btn" style={{ margin: 0 }} onClick={handleReview} disabled={loading || code.length > MAX_CHARS}>
              {loading ? "Analyzing AST & Logic..." : "Run Inspection"}
            </button>
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span style={{ fontWeight: 600 }}>Inspection Report</span>
            {review?.time_complexity && (
              <span style={{ background: "#21262d", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", color: "#d2a8ff" }}>
                Complexity: {review.time_complexity}
              </span>
            )}
          </div>

          {!review && !loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", color: "#8b949e" }}>
              Click "Run Inspection" to audit the code.
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", color: "#8b949e" }}>
              <div className="skeleton-bar" style={{ width: "200px", height: "16px", background: "#30363d", borderRadius: "4px", marginBottom: "12px", animation: "pulse 1.5s infinite" }}></div>
              <p>Consulting Gemini model...</p>
            </div>
          )}

          {review && (
            <div style={{ overflowY: "auto", maxHeight: "550px", paddingRight: "4px" }}>
              <div className="card card-bugs">
                <h4 style={{ margin: "0 0 6px 0", color: "#f85149" }}>🐛 Logical Flaws & Risks</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{review.bugs}</p>
              </div>

              <div className="card card-improvements">
                <h4 style={{ margin: "0 0 6px 0", color: "#58a6ff" }}>💡 Optimization & Clean Code</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{review.improvements}</p>
              </div>
            </div>
          )}
        </section>
      </div>
      
      {/* 3. IMPROVE NEXT: Git-Style Diff Viewer Section */}
      {review?.fixed_code && (
        <div style={{ marginTop: "24px", border: "1px solid #30363d", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", background: "#161b22", borderBottom: "1px solid #30363d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#e6edf3" }}>🔍 Version History (Git Diff)</h4>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? "✓ Copied Fix" : "Copy Fixed Code"}
            </button>
          </div>
          <ReactDiffViewer
            oldValue={code}
            newValue={review.fixed_code}
            splitView={true}
            useDarkTheme={true}
            leftTitle="Original Code"
            rightTitle="AI Optimized Code"
            styles={{
              variables: { dark: { diffViewerBackground: '#0d1117', addedBackground: '#04260f', removedBackground: '#3fb9501a' } }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;