import React, { useState, useEffect } from "react";
import { GraduationCap, Sparkles } from "lucide-react";
import InputSection from "./components/InputSection";
import ResultsSection from "./components/ResultsSection";
import ThemeToggle from "./components/ThemeToggle";
import { callGemini, listModels } from "./services/gemini";
import { generatePPT, generateWordDoc } from "./services/pptGenerator";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [subject, setSubject] = useState("");
  const [problem, setProblem] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [generateSlides, setGenerateSlides] = useState(true);
  const [generateReport, setGenerateReport] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError("Please enter your Gemini API Key.");
      return;
    }
    if (!subject || !problem) {
      setError("Please fill in both Subject and Problem Statement.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedData(null);
    setProgress("Initializing AI research agent...");

    try {
      setProgress("Analyzing problem statement & researching...");
      const data = await callGemini(
        apiKey,
        subject,
        problem,
        generateSlides,
        generateReport,
      );

      setProgress("Structuring slides and report...");
      setGeneratedData(data);
    } catch (err) {
      setError(
        err.message || "Failed to generate content. Please check your API key.",
      );
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  const handleDownloadPPT = async () => {
    if (!generatedData) return;
    try {
      await generatePPT(subject, problem, generatedData.slides, {
        name: studentName,
        id: studentId,
        dept: department,
      });
    } catch (err) {
      alert("Failed to generate PPT: " + err.message);
    }
  };

  const handleDownloadWord = () => {
    if (!generatedData) return;
    generateWordDoc(subject, problem, generatedData.report);
  };

  return (
    <div
      className={`min-h-screen pb-20 transition-colors duration-300 ${
        darkMode ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b sticky top-0 z-10 backdrop-blur-md transition-colors duration-300 ${
          darkMode
            ? "bg-slate-900/80 border-slate-700"
            : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1
                className={`text-xl font-bold leading-none ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                AAT Automator
              </h1>
              <p
                className={`text-xs font-medium mt-1 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                AI-Powered Assignment Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                darkMode
                  ? "bg-indigo-900/50 text-indigo-300 border-indigo-700"
                  : "bg-indigo-50 text-indigo-700 border-indigo-100"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              20 Marks Guaranteed*
            </div>
            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={async () => {
                if (!apiKey) {
                  alert("Please enter an API key first");
                  return;
                }
                try {
                  const models = await listModels(apiKey);
                  console.log("AVAILABLE MODELS:", models);
                  const names = models
                    .map((m) => m.name.replace("models/", ""))
                    .join("\n");
                  alert(
                    "Available Models:\n" +
                      names +
                      "\n\n(See Console for details)",
                  );
                } catch (err) {
                  alert("Error listing models: " + err.message);
                }
              }}
              className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Debug Models
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-12 px-4">
        <div className="text-center mb-10">
          <h2
            className={`text-4xl font-extrabold mb-4 tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Automate Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Assignments
            </span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Generate professional slides and comprehensive reports in seconds
            using advanced AI. Focus on learning, not formatting.
          </p>
        </div>

        <InputSection
          apiKey={apiKey}
          setApiKey={setApiKey}
          subject={subject}
          setSubject={setSubject}
          problem={problem}
          setProblem={setProblem}
          studentName={studentName}
          setStudentName={setStudentName}
          studentId={studentId}
          setStudentId={setStudentId}
          department={department}
          setDepartment={setDepartment}
          generateSlides={generateSlides}
          setGenerateSlides={setGenerateSlides}
          generateReport={generateReport}
          setGenerateReport={setGenerateReport}
          loading={loading}
          onGenerate={handleGenerate}
          error={error}
          progress={progress}
          darkMode={darkMode}
        />

        <ResultsSection
          generatedData={generatedData}
          onDownloadPPT={handleDownloadPPT}
          onDownloadWord={handleDownloadWord}
          darkMode={darkMode}
        />
      </main>

      <footer
        className={`max-w-6xl mx-auto mt-20 px-4 text-center text-sm pb-8 ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        <p>© {new Date().getFullYear()} AAT Automator. Built for students.</p>
        <p className="mt-2 text-xs">
          Disclaimer: Use this tool to assist your learning. Always review the
          generated content for accuracy.
        </p>
      </footer>
    </div>
  );
}

export default App;
