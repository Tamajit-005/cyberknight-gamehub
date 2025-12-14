"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";

const SudokuBoard = dynamic(() => import("./SudokuBoard"), {
  ssr: false, // required to avoid hydration mismatch
});

const pageEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function SudokuPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-gray-950 text-white flex flex-col items-center">
      <motion.div
        className="w-full flex flex-col items-center max-w-4xl"
        variants={pageEntranceVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <header className="container text-center mt-8">
          <h1 className="text-4xl font-bold tracking-tight">
            CyberKnight<span className="text-blue-400"> Sudoku</span>
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Created by <strong>Soumyajit &amp; Snehendu</strong>
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

        {/* GAME */}
        <section className="container max-w-4xl p-6">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg p-6 mt-10">
            <SudokuBoard />
          </div>
        </section>

        {/* FOOTER */}
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
