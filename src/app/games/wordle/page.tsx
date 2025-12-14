"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import WordleBoard from "./WordleBoard";

const pageEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function WordlePage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-gray-950 text-white flex flex-col items-center">
      <motion.div
        className="w-full max-w-4xl flex flex-col items-center"
        variants={pageEntranceVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="text-center mt-8">
          <h1 className="text-4xl font-bold">
            CyberKnight <span className="text-rose-400">Wordle</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Created by <strong>Snehendu</strong>
          </p>

          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700"
          >
            ← Back to Home
          </Link>
        </header>

        <section className="mt-10 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg p-6">
          <WordleBoard />
        </section>

        <footer className="mt-20 w-full text-center text-sm text-gray-500 border-t border-slate-800 py-6">
          © {year} <span className="font-semibold">CyberKnights</span>. All
          rights reserved.
        </footer>
      </motion.div>
    </main>
  );
}
