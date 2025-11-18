"use client";

import Link from "next/link";
import { useEffect } from "react";
import { initTicTacToe } from "./logic";
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
export default function TicTacToePage() {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    initTicTacToe();
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-gray-950 text-white flex flex-col items-center">
      <motion.div
        className="w-full flex flex-col items-center max-w-4xl"
        variants={pageEntranceVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="container text-center mt-8">
          <h1 className="text-4xl font-bold tracking-tight">
            CyberKnight<span className="text-cyan-400"> TicTacToe</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Created by <strong>SUBHADIP JANA</strong>
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

        <section className="container max-w-2xl p-6">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg p-6 mt-10">
            <div className="controls flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <label className="flex items-center gap-2 text-gray-300">
                <span>Mode:</span>
                <select
                  id="mode"
                  className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="ai">Human vs AI</option>
                  <option value="human">Human vs Human</option>
                </select>
              </label>

              <button
                id="reset"
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-5 py-2 rounded-lg shadow-md transition"
              >
                Reset
              </button>
            </div>

            <div
              id="status"
              className="text-gray-400 mb-4 text-center font-medium"
            >
              X to move
            </div>

            <div
              id="board"
              className="grid grid-cols-3 gap-3 justify-center place-items-center"
            ></div>

            <div className="legend mt-6 flex items-center justify-between text-gray-400">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-cyan-400 font-bold rounded-full">
                  X
                </span>
                <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-pink-400 font-bold rounded-full">
                  O
                </span>
              </div>

              <div className="score flex gap-4 text-sm">
                <span>
                  X: <strong id="scoreX">0</strong>
                </span>
                <span>
                  O: <strong id="scoreO">0</strong>
                </span>
                <span>
                  Ties: <strong id="scoreT">0</strong>
                </span>
              </div>
            </div>
          </div>

          <section className="tips mt-10">
            <h2 className="text-lg font-semibold text-cyan-400 mb-2">
              How to play
            </h2>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
              <li>Pick a mode: play a friend or battle the AI.</li>
              <li>X always starts.</li>
              <li>Use Reset to start a new round.</li>
            </ul>
          </section>
        </section>

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
