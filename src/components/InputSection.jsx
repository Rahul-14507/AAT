import React from "react";
import { motion } from "framer-motion";
import {
  Key,
  BookOpen,
  FileText,
  Wand2,
  Loader2,
  AlertCircle,
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
  loading,
  onGenerate,
  error,
  progress,
  darkMode,
}) => {
  const inputClasses = `w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all ${
    darkMode
      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 hover:bg-slate-600"
      : "bg-slate-50 border-slate-200 text-slate-900 hover:bg-white"
  }`;

  const labelClasses = `block text-sm font-semibold mb-2 ${
    darkMode ? "text-slate-300" : "text-slate-700"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-xl p-8 mb-8 border transition-colors duration-300 ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2">
          <label className={`${labelClasses} flex items-center gap-2`}>
            <Key className="w-4 h-4 text-indigo-500" />
            Gemini API Key
          </label>
          <input
            type="password"
            className={inputClasses}
            placeholder="Paste your API key here (starts with AIza...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p
            className={`text-xs mt-2 ml-1 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Your key is used locally and never saved. Get one at{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-400 font-medium hover:underline"
            >
              Google AI Studio
            </a>
            .
          </p>
        </div>

        <div>
          <label className={`${labelClasses} flex items-center gap-2`}>
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Subject Name
          </label>
          <input
            type="text"
            className={inputClasses}
            placeholder="e.g. Artificial Intelligence"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClasses}>Student Name</label>
          <input
            type="text"
            className={inputClasses}
            placeholder="e.g. Rahul Pujari"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClasses}>Student ID</label>
          <input
            type="text"
            className={inputClasses}
            placeholder="e.g. 25951A05EB"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClasses}>Department</label>
          <input
            type="text"
            className={inputClasses}
            placeholder="e.g. CSE"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        <div>
          <label className={`${labelClasses} flex items-center gap-2`}>
            <FileText className="w-4 h-4 text-indigo-500" />
            Problem Statement
          </label>
          <textarea
            className={`${inputClasses} resize-none`}
            rows="1"
            placeholder="e.g. Design a system to..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={generateSlides}
            onChange={(e) => setGenerateSlides(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
          />
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Generate Slides
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={generateReport}
            onChange={(e) => setGenerateReport(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
          />
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Generate Report
          </span>
        </label>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`mt-6 p-4 border rounded-xl text-sm flex items-center gap-3 ${
            darkMode
              ? "bg-red-900/30 border-red-800 text-red-400"
              : "bg-red-50 border-red-100 text-red-600"
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <div className="mt-8">
        <button
          onClick={onGenerate}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold shadow-lg transition-all flex justify-center items-center gap-3 text-lg
            ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl transform hover:-translate-y-0.5"
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              {progress || "Processing..."}
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6" />
              Generate Content
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default InputSection;
