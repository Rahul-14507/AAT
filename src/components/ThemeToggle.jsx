import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative p-2 rounded-xl transition-all duration-300 ${
        darkMode
          ? "bg-slate-700 hover:bg-slate-600 text-yellow-400"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
      }`}
      whileTap={{ scale: 0.95 }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
