import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation,
  FileText,
  Download,
  LayoutTemplate,
  FileType,
} from "lucide-react";

const ResultsSection = ({
  generatedData,
  onDownloadPPT,
  onDownloadWord,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState("slides");

  const hasSlides = generatedData?.slides && generatedData.slides.length > 0;
  const hasReport = !!generatedData?.report;

  // Set active tab based on what's available when data changes
  useEffect(() => {
    if (!generatedData) return;

    if (hasSlides) {
      setActiveTab("slides");
    } else if (hasReport) {
      setActiveTab("report");
    }
  }, [generatedData, hasSlides, hasReport]);

  // Don't render anything if no data
  if (!generatedData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="animate-fade-in-up"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2
          className={`text-3xl font-bold flex items-center gap-3 ${
            darkMode ? "text-white" : "text-slate-800"
          }`}
        >
          <LayoutTemplate className="w-8 h-8 text-indigo-600" />
          Generated Content
        </h2>
        <div className="flex gap-4 mt-4 md:mt-0">
          {hasSlides && (
            <button
              onClick={onDownloadPPT}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Presentation className="w-5 h-5" />
              Download PPT
            </button>
          )}
          {hasReport && (
            <button
              onClick={onDownloadWord}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FileType className="w-5 h-5" />
              Download Report
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`flex p-1 rounded-xl mb-8 w-fit ${
          darkMode ? "bg-slate-700" : "bg-slate-100"
        }`}
      >
        {hasSlides && (
          <button
            className={`py-2 px-6 rounded-lg font-medium text-sm transition-all flex items-center gap-2
              ${
                activeTab === "slides"
                  ? darkMode
                    ? "bg-slate-800 text-indigo-400 shadow-sm"
                    : "bg-white text-indigo-600 shadow-sm"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            onClick={() => setActiveTab("slides")}
          >
            <Presentation className="w-4 h-4" />
            Slides ({generatedData.slides.length})
          </button>
        )}
        {hasReport && (
          <button
            className={`py-2 px-6 rounded-lg font-medium text-sm transition-all flex items-center gap-2
              ${
                activeTab === "report"
                  ? darkMode
                    ? "bg-slate-800 text-indigo-400 shadow-sm"
                    : "bg-white text-indigo-600 shadow-sm"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            onClick={() => setActiveTab("report")}
          >
            <FileText className="w-4 h-4" />
            Report Preview
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "slides" && hasSlides ? (
          <motion.div
            key="slides"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {generatedData.slides.map((slide, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col group ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
                style={{ maxHeight: "500px" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      darkMode
                        ? "bg-indigo-900/50 text-indigo-300 border-indigo-700"
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}
                  >
                    Slide {idx + 1}
                  </span>
                </div>
                <h3
                  className={`text-lg font-bold mb-3 leading-tight group-hover:text-indigo-500 transition-colors ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {slide.title}
                </h3>
                <ul
                  className={`list-disc pl-4 text-sm space-y-2 mb-4 flex-grow overflow-y-auto ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {slide.content.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        ) : activeTab === "report" && hasReport ? (
          <motion.div
            key="report"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-10 rounded-2xl shadow-sm border prose max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl ${
              darkMode
                ? "bg-slate-800 border-slate-700 prose-invert prose-p:text-slate-400"
                : "bg-white border-slate-200 prose-indigo prose-p:text-slate-600"
            }`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: generatedData.report }}
            ></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsSection;
