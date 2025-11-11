export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-900 to-gray-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2">
          CyberKnight <span className="text-cyan-400">Game Hub</span>
        </h1>
        <p className="text-gray-400 mb-10">
          Play classic browser games — Tic Tac Toe, Flappy Bird, Chess, Pac-Man
          and more.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <a
            href="/games/tictactoe"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-cyan-300">
              Tic Tac Toe
            </h2>
            <p className="text-gray-400 text-sm">Challenge AI or a friend.</p>
          </a>

          <a
            href="/games/flappybird"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-fuchsia-300">
              Flappy Bird
            </h2>
            <p className="text-gray-400 text-sm">Flap through obstacles.</p>
          </a>
          <a
            href="/games/chess"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-green-400">Chess</h2>
            <p className="text-gray-400 text-sm">One move. One fate.</p>
          </a>

          <a
            href="/games/pacman"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">
              Pac-Man
            </h2>
            <p className="text-gray-400 text-sm">Eat. Run. Repeat.</p>
          </a>

          <a
            href="/games/snake"
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition transform hover:scale-105 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-orange-400">
              Viper Loop
            </h2>
            <p className="text-gray-400 text-sm">Don’t bite yourself.</p>
          </a>
        </div>

        <footer className="mt-20 w-full text-center text-sm text-gray-500 border-t border-slate-800 py-6">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">CyberKnights</span>. All rights
            reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
