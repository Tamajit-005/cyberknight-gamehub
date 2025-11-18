"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { initFlappyBird } from "./game";
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
export default function FlappyBirdPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (canvasRef.current) {
      initFlappyBird(canvasRef.current);
    }
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-900 to-gray-950 text-white flex flex-col items-center">
      <motion.div
        className="w-full flex flex-col items-center max-w-lg"
        variants={pageEntranceVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="text-center mt-8">
          <h1 className="text-4xl font-bold">
            CyberKnight<span className="text-fuchsia-300"> FlappyBird</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Created by <strong>SNEHENDU GHOSH</strong>
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

        <section className="mt-10 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={360}
            height={640}
            className="border-4 border-slate-700 rounded-lg shadow-lg bg-slate-900"
          ></canvas>
          <p className="mt-4 text-gray-400 text-sm">
            Press <strong>Space</strong> or <strong>Click</strong> to flap.
          </p>
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
