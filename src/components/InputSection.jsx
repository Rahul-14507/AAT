import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  BookOpen,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Layers,
  FileSpreadsheet,
  FileCheck,
  User,
  Hash,
  Building2,
  ArrowRight,
} from "lucide-react";

const InputSection = ({
  apiKey,
  setApiKey,
  subject,
  setSubject,
  problem,
  setProblem,
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  department,
  setDepartment,
  generateSlides,
  setGenerateSlides,
  generateReport,
  setGenerateReport,
  slideCount,
  setSlideCount,
  loading,
  onGenerate,
  error,
  progress,
  darkMode,
  palette,
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const slidePresets = [10, 15, 20, 25, 30];

  const currentAccent = darkMode ? palette.accentDark : palette.accentLight;
  const currentBadge = darkMode ? palette.badgeDark : palette.badgeLight;

  const inputBaseClasses = `w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 ${palette.ringAccent} ${
    darkMode
      ? "bg-zinc-900/90 border-zinc-700/80 text-zinc-100 placeholder-zinc-500 hover:border-zinc-600 focus:bg-zinc-900"
      : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 hover:border-zinc-300 focus:bg-white shadow-xs"
  }`;

  const labelClasses = `block text-xs font-semibold uppercase tracking-wider mb-2 ${
    darkMode ? "text-zinc-400" : "text-zinc-600"
  }`;

  const cardClasses = `rounded-2xl border transition-all duration-300 ${
    darkMode
      ? "bg-zinc-900/60 border-zinc-800 shadow-xl"
      : "bg-white border-zinc-200/80 shadow-sm shadow-zinc-100"
  }`;

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !loading) {
      onGenerate();
    }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      {/* API Key Banner */}
      <div className={`${cardClasses} p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <label className={`${labelClasses} !mb-0 flex items-center gap-2`}>
            <Key className={`w-3.5 h-3.5 ${currentAccent}`} />
            <span>Groq API Key</span>
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md border ${currentBadge}`}
            >
              <ShieldCheck className="w-3 h-3" />
              Client-side only
            </span>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-[11px] font-medium hover:underline transition-colors ${currentAccent}`}
            >
              Get free key
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        <div className="relative">
          <input
            type={showApiKey ? "text" : "password"}
            className={`${inputBaseClasses} font-mono text-xs pr-10`}
            placeholder="gsk_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
              darkMode
                ? "text-zinc-400 hover:text-zinc-200"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            title={showApiKey ? "Hide API key" : "Show API key"}
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Assignment Form */}
      <div className={`${cardClasses} p-6 sm:p-8 space-y-6`}>
        {/* Subject & Problem Statement */}
        <div className="space-y-5">
          <div>
            <label className={`${labelClasses} flex items-center gap-2`}>
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              Subject / Course Title
            </label>
            <input
              type="text"
              className={inputBaseClasses}
              placeholder="e.g. Computer System Architecture & Organization"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className={`${labelClasses} flex items-center gap-2`}>
              <FileText className={`w-3.5 h-3.5 ${currentAccent}`} />
              Problem Statement / Topic Description
            </label>
            <textarea
              className={`${inputBaseClasses} min-h-[100px] leading-relaxed resize-y`}
              rows="3"
              placeholder="e.g. Study of DRAM issues at the system level: architecture bottlenecks, memory controllers, latency optimization, and thermal constraints..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Student Metadata Fields */}
        <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
          <p
            className={`text-xs font-semibold mb-3 ${
              darkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Presenter Details (Embedded on Title & Thank You slides)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`${labelClasses} flex items-center gap-1.5`}>
                <User className="w-3 h-3 text-zinc-400" />
                Student Name
              </label>
              <input
                type="text"
                className={inputBaseClasses}
                placeholder="e.g. Rahul Pujari"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div>
              <label className={`${labelClasses} flex items-center gap-1.5`}>
                <Hash className="w-3 h-3 text-zinc-400" />
                Roll / Student ID
              </label>
              <input
                type="text"
                className={inputBaseClasses}
                placeholder="e.g. 25951A05EB"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <label className={`${labelClasses} flex items-center gap-1.5`}>
                <Building2 className="w-3 h-3 text-zinc-400" />
                Department
              </label>
              <input
                type="text"
                className={inputBaseClasses}
                placeholder="e.g. CSE / IT"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Output Options & Slide Count Selector */}
        <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80 space-y-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <label
              className={`flex items-center gap-2.5 cursor-pointer select-none px-3 py-2 rounded-xl border transition-all ${
                generateSlides
                  ? darkMode
                    ? `${palette.bgAccentDark} ${palette.borderAccentDark} ${palette.accentDark}`
                    : `${palette.bgAccentLight} ${palette.borderAccentLight} text-zinc-900`
                  : darkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600"
              }`}
            >
              <input
                type="checkbox"
                checked={generateSlides}
                onChange={(e) => setGenerateSlides(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 cursor-pointer"
                style={{ accentColor: palette.primaryHex }}
              />
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Layers className={`w-3.5 h-3.5 ${currentAccent}`} />
                Generate Slide Deck (.pptx)
              </span>
            </label>

            <label
              className={`flex items-center gap-2.5 cursor-pointer select-none px-3 py-2 rounded-xl border transition-all ${
                generateReport
                  ? darkMode
                    ? `${palette.bgAccentDark} ${palette.borderAccentDark} ${palette.accentDark}`
                    : `${palette.bgAccentLight} ${palette.borderAccentLight} text-zinc-900`
                  : darkMode
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600"
              }`}
            >
              <input
                type="checkbox"
                checked={generateReport}
                onChange={(e) => setGenerateReport(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 cursor-pointer"
                style={{ accentColor: palette.primaryHex }}
              />
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <FileCheck className={`w-3.5 h-3.5 ${currentAccent}`} />
                Generate Academic Report (.doc)
              </span>
            </label>
          </div>

          {/* Slide Count Slider & Quick Presets */}
          <AnimatePresence>
            {generateSlides && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={labelClasses}>
                    Target Presentation Length
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${currentBadge}`}
                  >
                    {slideCount} Slides Total
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={slideCount}
                    onChange={(e) => setSlideCount(parseInt(e.target.value))}
                    style={{ accentColor: palette.primaryHex }}
                    className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
                      darkMode ? "bg-zinc-800" : "bg-zinc-200"
                    }`}
                  />
                  {/* Preset Pills */}
                  <div className="flex gap-1.5">
                    {slidePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSlideCount(preset)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                          slideCount === preset
                            ? `${palette.btnPrimary} shadow-xs`
                            : darkMode
                            ? "bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                darkMode
                  ? "bg-red-950/40 border-red-900/60 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={onGenerate}
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 flex justify-center items-center gap-2.5 select-none ${
              loading
                ? "opacity-60 cursor-not-allowed " + palette.btnPrimary
                : darkMode
                ? `${palette.btnPrimary} shadow-md hover:brightness-110`
                : `${palette.btnPrimary} shadow-md hover:brightness-105`
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{progress || "Generating assignment content..."}</span>
              </>
            ) : (
              <>
                <span>Generate Assignment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-2.5">
            <span
              className={`text-[11px] font-medium ${
                darkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">Enter</kbd> to run
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;

