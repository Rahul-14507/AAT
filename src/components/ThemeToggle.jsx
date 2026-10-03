import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
        darkMode
          ? "bg-zinc-900 border-zinc-700/80 text-amber-400 hover:bg-zinc-800 hover:border-zinc-600 shadow-sm"
          : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300 shadow-sm"
      }`}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 90 : 0, scale: darkMode ? 1 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {darkMode ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-zinc-700" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;

