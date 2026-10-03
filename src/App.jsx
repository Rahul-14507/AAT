import React, { useState, useEffect } from "react";
import { GraduationCap, Zap, BookOpenCheck, Shield } from "lucide-react";
import InputSection from "./components/InputSection";
import ResultsSection from "./components/ResultsSection";
import ThemeToggle from "./components/ThemeToggle";
import PaletteSelector from "./components/PaletteSelector";
import { THEME_PALETTES } from "./utils/themePresets";
import { callGroq } from "./services/groq";
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
  const [slideCount, setSlideCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState("");
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  const [palette, setPalette] = useState(() => {
    const savedPaletteId = localStorage.getItem("themePaletteId");
    const found = THEME_PALETTES.find((p) => p.id === savedPaletteId);
    return found || THEME_PALETTES[0];
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSelectPalette = (newPalette) => {
    setPalette(newPalette);
    localStorage.setItem("themePaletteId", newPalette.id);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError("Please enter your Groq API Key.");
      return;
    }
    if (!subject || !problem) {
      setError("Please fill in both Subject and Problem Statement.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedData(null);
    setProgress("Initializing Groq inference engine...");

    try {
      setProgress("Analyzing problem statement & structuring technical concepts...");
      const data = await callGroq(
        apiKey,
        subject,
        problem,
        generateSlides,
        generateReport,
        slideCount,
      );

      setProgress("Finalizing presentation slides & report schema...");
      setGeneratedData(data);
    } catch (err) {
      setError(
        err.message || "Failed to generate content. Please check your API key and connection.",
      );
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  const handleDownloadPPT = async () => {
    if (!generatedData) return;
    try {
      await generatePPT(
        subject,
        problem,
        generatedData.slides,
        {
          name: studentName,
          id: studentId,
          dept: department,
        },
        slideCount,
      );
    } catch (err) {
      alert("Failed to generate PPT: " + err.message);
    }
  };

  const handleDownloadWord = () => {
    if (!generatedData) return;
    generateWordDoc(subject, problem, generatedData.report);
  };

  const currentAccent = darkMode ? palette.accentDark : palette.accentLight;
  const currentBadge = darkMode ? palette.badgeDark : palette.badgeLight;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 bg-grid-pattern ${
        darkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#fafafa] text-zinc-900"
      }`}
    >
      {/* Navigation Header */}
      <header
        className={`border-b sticky top-0 z-30 backdrop-blur-md transition-colors duration-200 ${
          darkMode
            ? "bg-[#09090b]/85 border-zinc-800/80"
            : "bg-white/85 border-zinc-200/80"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors duration-200"
              style={{ backgroundColor: palette.primaryHex }}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  AAT Automator
                </span>
                <span
                  className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-md border ${currentBadge}`}
                >
                  v2.0
                </span>
              </div>
              <p
                className={`text-[11px] font-medium leading-none mt-0.5 ${
                  darkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Academic Assessment & Presentation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Palette Switcher */}
            <PaletteSelector
              currentPalette={palette}
              onSelectPalette={handleSelectPalette}
              darkMode={darkMode}
            />

            <div
              className={`hidden lg:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
                darkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                  : "bg-zinc-100 border-zinc-200 text-zinc-700"
              }`}
            >
              <Zap
                className="w-3.5 h-3.5"
                style={{ color: palette.primaryHex }}
              />
              <span>Groq LPU Acceleration</span>
            </div>

            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 pt-2">
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${currentBadge}`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Structured Academic Coursework Generator</span>
          </div>
          <h1
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              darkMode ? "text-zinc-50" : "text-zinc-900"
            }`}
          >
            Generate University Presentations & Reports
          </h1>
          <p
            className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${
              darkMode ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Transform problem statements into formatted 16:9 slide decks and
            structured technical reports with deep academic rigor.
          </p>
        </div>

        {/* Input Configuration Section */}
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
          slideCount={slideCount}
          setSlideCount={setSlideCount}
          loading={loading}
          onGenerate={handleGenerate}
          error={error}
          progress={progress}
          darkMode={darkMode}
          palette={palette}
        />

        {/* Results / Preview Section */}
        <ResultsSection
          generatedData={generatedData}
          onDownloadPPT={handleDownloadPPT}
          onDownloadWord={handleDownloadWord}
          darkMode={darkMode}
          palette={palette}
        />
      </main>

      {/* Minimal Footer */}
      <footer
        className={`border-t py-8 text-center text-xs transition-colors duration-200 ${
          darkMode
            ? "border-zinc-800/80 text-zinc-500"
            : "border-zinc-200 text-zinc-400"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} AAT Automator. Built for engineering students.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Groq</span>
            <span>•</span>
            <span>Local Browser Processing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
