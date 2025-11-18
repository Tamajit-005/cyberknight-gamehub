"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-900 to-gray-950 text-white p-4">
      <motion.div
        className="text-center max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title and Subtitle */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl font-bold mb-2">
            CyberKnight <span className="text-cyan-400">Game Hub</span>
          </h1>
          <p className="text-gray-400 mb-10">
            Play classic browser games — Tic Tac Toe, Flappy Bird, Chess,
            Pac-Man and more.
          </p>
        </motion.div>

        {/* Game Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Card 1: Tic Tac Toe */}
          <motion.a
            href="/games/tictactoe"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg block"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-2 text-cyan-300">
              Tic Tac Toe
            </h2>
            <p className="text-gray-400 text-sm">Challenge AI or a friend.</p>
          </motion.a>

          {/* Card 2: Flappy Bird */}
          <motion.a
            href="/games/flappybird"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg block"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-2 text-fuchsia-300">
              Flappy Bird
            </h2>
            <p className="text-gray-400 text-sm">Flap through obstacles.</p>
          </motion.a>

          {/* Card 3: Chess */}
          <motion.a
            href="/games/chess"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg block"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-2 text-green-400">Chess</h2>
            <p className="text-gray-400 text-sm">One move. One fate.</p>
          </motion.a>

          {/* Card 4: Pac-Man */}
          <motion.a
            href="/games/pacman"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg block"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">
              Pac-Man
            </h2>
            <p className="text-gray-400 text-sm">Eat. Run. Repeat.</p>
          </motion.a>

          {/* Card 5: Viper Loop (Snake) */}
          <motion.a
            href="/games/snake"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg block"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-2 text-orange-400">
              Viper Loop
            </h2>
            <p className="text-gray-400 text-sm">Don’t bite yourself.</p>
          </motion.a>
        </motion.div>

        {/* Footer - Fades in */}
        <motion.footer
          className="mt-20 w-full text-center text-sm text-gray-500 border-t border-slate-800 py-6"
          variants={itemVariants}
        >
          <p>
            © {currentYear} <span className="font-semibold">CyberKnights</span>.
            All rights reserved.
          </p>
        </motion.footer>
      </motion.div>
    </main>
  );
}
