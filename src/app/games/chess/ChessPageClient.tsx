"use client";

import Link from "next/link";
import ChessBoard from "./ui/ChessBoard";

export default function ChessPageClient() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-gray-950 text-white flex flex-col items-center">
      {/* Header */}
      <header className="container text-center mt-8">
        <h1 className="text-4xl font-bold tracking-tight">
          CyberKnight<span className="text-cyan-400"> Chess</span>
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Created by <strong>TAMAJIT SAHA</strong>
        </p>

        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="text-gray-400 text-sm mt-4 italic">
          Check. Mate. Repeat.
        </p>
      </header>

      {/* Chess Board */}
      <div className="mt-8">
        <ChessBoard />
      </div>

      {/* Footer */}
      <footer className="mt-20 w-full text-center text-sm text-gray-500 border-t border-slate-800 py-6">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">CyberKnights</span>. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
