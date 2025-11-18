"use client";

import Link from "next/link";
import SnakeBoard from "./SnakeBoard";
import { motion, Variants } from "framer-motion";

const pageEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function SnakePage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-10">
      <motion.div
        className="w-full flex flex-col items-center max-w-lg"
        variants={pageEntranceVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight">
            CyberKnight<span className="text-orange-400"> Viper Loop</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Created by <strong>ASMIT GOSWAMI</strong>
          </p>

          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </header>

        <SnakeBoard />

        <footer className="mt-20 w-full text-center text-sm text-gray-500 border-t border-slate-800 py-6">
          <p>
            © {currentYear} <span className="font-semibold">CyberKnights</span>.
            All rights reserved.
          </p>
        </footer>
      </motion.div>
    </main>
  );
}
