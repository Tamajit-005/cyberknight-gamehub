"use client";

import { useCallback, useEffect, useState } from "react";
import { pickTarget, evaluateGuess, WORDS } from "./words";

const ROWS = 6;
const COLS = 5;

type Result = "correct" | "present" | "absent" | null;

export default function WordleBoard() {
  const [target, setTarget] = useState("");
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [results, setResults] = useState<Result[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // hydration-safe init
  useEffect(() => {
    setTarget(pickTarget());
  }, []);

  const reset = () => {
    setTarget(pickTarget());
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill("")));
    setResults(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setRow(0);
    setCol(0);
    setMessage("");
    setGameOver(false);
    setShowAnswer(false);
  };

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver || row >= ROWS) return;

      // prevent editing submitted rows
      if (results[row][0] !== null) return;

      // delete
      if (key === "Backspace" || key === "Del") {
        if (col > 0) {
          const next = board.map((r) => [...r]);
          next[row][col - 1] = "";
          setBoard(next);
          setCol(col - 1);
        }
        return;
      }

      // submit
      if (key === "Enter") {
        if (col < COLS) {
          setMessage("Enter 5 letters");
          return;
        }

        const guess = board[row].join("").toUpperCase();
        if (!WORDS.includes(guess)) {
          setMessage("Word not in list");
          return;
        }

        const evaluated = evaluateGuess(guess, target);
        const nextResults = results.map((r) => [...r]);
        nextResults[row] = evaluated;
        setResults(nextResults);

        if (guess === target) {
          setMessage("🎉 Correct!");
          setGameOver(true);
          return;
        }

        if (row === ROWS - 1) {
          setMessage(`😔 Answer: ${target}`);
          setGameOver(true);
          return;
        }

        setRow((r) => r + 1);
        setCol(0);
        setMessage("");
        return;
      }

      // letters
      if (/^[a-zA-Z]$/.test(key) && col < COLS) {
        const next = board.map((r) => [...r]);
        next[row][col] = key.toUpperCase();
        setBoard(next);
        setCol((c) => c + 1);
      }
    },
    [board, col, row, results, target, gameOver]
  );

  // keyboard listener (single, stable)
  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKey(e.key);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleKey]);

  const tileColor = (r: Result) =>
    r === "correct"
      ? "bg-emerald-500"
      : r === "present"
      ? "bg-yellow-400"
      : r === "absent"
      ? "bg-slate-600"
      : "bg-slate-900";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          {showAnswer ? "Hide" : "Reveal"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300"
        >
          Restart
        </button>
      </div>

      <div className="grid grid-rows-6 gap-2">
        {board.map((r, ri) => (
          <div key={ri} className="grid grid-cols-5 gap-2">
            {r.map((cell, ci) => (
              <div
                key={ci}
                className={`w-12 h-12 rounded-md flex items-center justify-center text-xl font-bold ${tileColor(
                  results[ri][ci]
                )}`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {message && <div className="text-amber-300 font-semibold">{message}</div>}
      {showAnswer && target && (
        <div className="text-emerald-300 font-bold">🔍 Answer: {target}</div>
      )}
    </div>
  );
}
