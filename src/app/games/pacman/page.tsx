"use client";

import Link from "next/link";
import PacmanBoard from "./PacmanBoard";
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

export default function PacmanPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      <motion.div
        className="w-full flex flex-col items-center max-w-4xl"
        variants={pageEntranceVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="container text-center mt-8">
          <h1 className="text-4xl font-bold tracking-tight">
            CyberKnight<span className="text-yellow-300"> Pac-Man</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Created by <strong>SOUMYAJIT GHOSH</strong>
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
          <PacmanBoard />
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
