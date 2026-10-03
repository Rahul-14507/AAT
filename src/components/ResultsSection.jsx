import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation,
  FileText,
  Download,
  Copy,
  Check,
  FileType,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  Printer,
} from "lucide-react";

const ResultsSection = ({
  generatedData,
  onDownloadPPT,
  onDownloadWord,
  darkMode,
  palette,
}) => {
  const [activeTab, setActiveTab] = useState("slides");
  const [copied, setCopied] = useState(false);

  const hasSlides = generatedData?.slides && generatedData.slides.length > 0;
  const hasReport = !!generatedData?.report;

  const currentAccent = darkMode ? palette.accentDark : palette.accentLight;
  const currentBadge = darkMode ? palette.badgeDark : palette.badgeLight;

  useEffect(() => {
    if (!generatedData) return;
    if (hasSlides) {
      setActiveTab("slides");
    } else if (hasReport) {
      setActiveTab("report");
    }
  }, [generatedData, hasSlides, hasReport]);

  const handleCopyReport = async () => {
    if (!generatedData?.report) return;
    try {
      // Clean HTML tags for plain text clipboard copy
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = generatedData.report;
      const text = tempDiv.innerText || tempDiv.textContent;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Failed to copy", e);
    }
  };

  if (!generatedData) return null;

  const cardClasses = `rounded-2xl border transition-all duration-300 ${
    darkMode
      ? "bg-zinc-900/70 border-zinc-800 shadow-xl"
      : "bg-white border-zinc-200/80 shadow-sm"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pt-6"
    >
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60 dark:border-zinc-800/80">
        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 w-fit">
          {hasSlides && (
            <button
              onClick={() => setActiveTab("slides")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "slides"
                  ? darkMode
                    ? "bg-zinc-900 text-zinc-100 shadow-xs border border-zinc-700/60"
                    : "bg-white text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Presentation className={`w-3.5 h-3.5 ${currentAccent}`} />
              <span>Presentation Deck</span>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-zinc-200/70 dark:bg-zinc-700 font-mono">
                {generatedData.slides.length}
              </span>
            </button>
          )}

          {hasReport && (
            <button
              onClick={() => setActiveTab("report")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "report"
                  ? darkMode
                    ? "bg-zinc-900 text-zinc-100 shadow-xs border border-zinc-700/60"
                    : "bg-white text-zinc-900 shadow-xs border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${currentAccent}`} />
              <span>Written Report</span>
            </button>
          )}
        </div>

        {/* Download Actions */}
        <div className="flex items-center gap-2.5">
          {hasSlides && (
            <button
              onClick={onDownloadPPT}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                darkMode
                  ? `${palette.btnPrimary} border-transparent shadow-sm hover:brightness-110`
                  : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900 shadow-sm"
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Export PowerPoint (.pptx)</span>
            </button>
          )}

          {hasReport && (
            <button
              onClick={onDownloadWord}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                darkMode
                  ? "bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
              }`}
            >
              <FileType className={`w-3.5 h-3.5 ${currentAccent}`} />
              <span>Export Word (.doc)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "slides" && hasSlides ? (
          <motion.div
            key="slides-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {generatedData.slides.map((slide, idx) => (
              <div
                key={idx}
                className={`${cardClasses} p-6 flex flex-col justify-between group hover:border-zinc-500/40 transition-all duration-200`}
              >
                <div>
                  {/* Slide Header Pill */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border ${currentBadge}`}>
                      <Layers className="w-3 h-3" />
                      Slide {idx + 1}
                    </span>
                  </div>

                  {/* Slide Title */}
                  <h3
                    className={`text-base font-bold mb-4 leading-snug ${
                      darkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    {slide.title}
                  </h3>

                  {/* Bullet Points */}
                  <ul className="space-y-3">
                    {slide.content.map((point, pIdx) => {
                      const colonIdx = point.indexOf(":");
                      const hasHeader = colonIdx > 0 && colonIdx < 45;
                      const header = hasHeader
                        ? point.substring(0, colonIdx + 1)
                        : null;
                      const body = hasHeader
                        ? point.substring(colonIdx + 1)
                        : point;

                      return (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2.5 text-xs leading-relaxed"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: palette.primaryHex }}
                          />
                          <span
                            className={
                              darkMode ? "text-zinc-300" : "text-zinc-600"
                            }
                          >
                            {header && (
                              <strong
                                className="font-semibold mr-1"
                                style={{
                                  color: darkMode
                                    ? palette.primaryHex
                                    : "#18181b",
                                }}
                              >
                                {header}
                              </strong>
                            )}
                            {body}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        ) : activeTab === "report" && hasReport ? (
          <motion.div
            key="report-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${cardClasses} p-8 sm:p-12 relative max-w-4xl mx-auto`}
          >
            {/* Copy Button */}
            <div className="absolute top-6 right-6">
              <button
                onClick={handleCopyReport}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  copied
                    ? currentBadge
                    : darkMode
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                }`}
              >
                {copied ? (
                  <>
                    <Check className={`w-3 h-3 ${currentAccent}`} />
                    <span>Copied Text</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Academic Paper Styling */}
            <div
              className={`prose prose-sm sm:prose-base max-w-none ${
                darkMode
                  ? "prose-invert prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-headings:font-bold prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-2"
                  : "prose-neutral prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-li:text-zinc-700 prose-headings:font-bold prose-h2:border-b prose-h2:border-zinc-200 prose-h2:pb-2"
              }`}
              dangerouslySetInnerHTML={{ __html: generatedData.report }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultsSection;

