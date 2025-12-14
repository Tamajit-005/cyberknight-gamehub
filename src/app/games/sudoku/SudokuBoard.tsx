"use client";

import { useCallback, useEffect, useState } from "react";
import { Board, generatePuzzle, getHint, isValid, solveSudoku } from "./sudoku";

const cloneBoard = (b: Board): Board => b.map((r) => [...r]);

export default function SudokuBoard() {
  // ----------------------------------
  // STATE
  // ----------------------------------
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium"
  );

  const [initialBoard, setInitialBoard] = useState<Board>(() =>
    generatePuzzle("Medium")
  );

  const [board, setBoard] = useState<Board>(() => cloneBoard(initialBoard));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState("Puzzle ready");
  const [won, setWon] = useState(false);

  // ----------------------------------
  // HELPERS
  // ----------------------------------
  const isPrefilled = useCallback(
    (r: number, c: number) => initialBoard[r][c] !== 0,
    [initialBoard]
  );

  // ----------------------------------
  // NEW PUZZLE
  // ----------------------------------
  const newPuzzle = useCallback(
    (diff: "Easy" | "Medium" | "Hard" = difficulty) => {
      const p = generatePuzzle(diff);
      setDifficulty(diff);
      setInitialBoard(p);
      setBoard(cloneBoard(p));
      setSelected(null);
      setWon(false);
      setMessage("Puzzle ready");
    },
    [difficulty]
  );

  // ----------------------------------
  // PLACE NUMBER (NO WIN LOGIC HERE)
  // ----------------------------------
  const placeNumber = useCallback(
    (n: number) => {
      if (!selected || won) return;

      const [r, c] = selected;
      if (isPrefilled(r, c)) return;

      const next = cloneBoard(board);
      next[r][c] = n;

      if (!isValid(next, r, c, n)) {
        setMessage("Invalid move");
        return;
      }

      setBoard(next);
      setMessage(`Placed ${n}`);
    },
    [selected, board, won, isPrefilled]
  );

  // ----------------------------------
  // CLEAR CELL
  // ----------------------------------
  const clearCell = useCallback(() => {
    if (!selected || won) return;

    const [r, c] = selected;
    if (isPrefilled(r, c)) return;

    const next = cloneBoard(board);
    next[r][c] = 0;

    setBoard(next);
    setMessage("Cleared");
  }, [selected, board, won, isPrefilled]);

  // ----------------------------------
  // HINT
  // ----------------------------------
  const giveHint = useCallback(() => {
    if (won) return;

    const merged: Board = initialBoard.map((row, r) =>
      row.map((v, c) => (v !== 0 ? v : board[r][c]))
    );

    const hint = getHint(merged);
    if (!hint) {
      setMessage("No hint available");
      return;
    }

    const { row, col, value } = hint;
    if (isPrefilled(row, col)) return;

    const next = cloneBoard(board);
    next[row][col] = value;

    setBoard(next);
    setSelected([row, col]);
    setMessage("Hint applied");
  }, [board, initialBoard, won, isPrefilled]);

  // ----------------------------------
  // SOLVE
  // ----------------------------------
  const solve = useCallback(() => {
    const solved = cloneBoard(initialBoard);
    solveSudoku(solved);
    setBoard(solved);
    setWon(true);
    setMessage("Solved");
  }, [initialBoard]);

  // ----------------------------------
  // ✅ WIN DETECTION (SAFE)
  // ----------------------------------
  useEffect(() => {
    if (won) return;

    const complete = board.every((row, r) =>
      row.every((val, c) => val !== 0 && isValid(board, r, c, val))
    );

    if (complete) {
      setWon(true);
      setMessage("🎉 You solved it!");
    }
  }, [board, won]);

  // ----------------------------------
  // KEYBOARD INPUT
  // ----------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selected || won) return;

      if (e.key >= "1" && e.key <= "9") {
        placeNumber(Number(e.key));
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        clearCell();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, won, placeNumber, clearCell]);

  // ----------------------------------
  // RENDER
  // ----------------------------------
  return (
    <div className="flex gap-10">
      {/* BOARD */}
      <div className="grid grid-cols-9 gap-1">
        {board.map((row, r) =>
          row.map((val, c) => {
            const active = selected?.[0] === r && selected?.[1] === c;
            const pre = isPrefilled(r, c);

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => setSelected([r, c])}
                className={`
                  w-12 h-12 rounded-md flex items-center justify-center
                  text-lg cursor-pointer select-none
                  ${pre ? "text-cyan-300 font-bold" : "text-white"}
                  ${active ? "ring-2 ring-cyan-400" : ""}
                  bg-slate-900 hover:bg-slate-800
                `}
              >
                {val || ""}
              </div>
            );
          })
        )}
      </div>

      {/* SIDE PANEL */}
      <div className="flex flex-col gap-4 min-w-[260px]">
        <div className="flex gap-2">
          <select
            value={difficulty}
            onChange={(e) =>
              newPuzzle(e.target.value as "Easy" | "Medium" | "Hard")
            }
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <button
            onClick={() => newPuzzle(difficulty)}
            className="bg-cyan-400 text-black px-4 py-2 rounded font-semibold"
          >
            New
          </button>

          <button onClick={solve} className="bg-slate-700 px-4 py-2 rounded">
            Solve
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => placeNumber(n)}
              className="h-12 rounded bg-slate-800 hover:bg-slate-700"
            >
              {n}
            </button>
          ))}

          <button
            onClick={clearCell}
            className="col-span-2 h-12 rounded bg-slate-800 hover:bg-slate-700"
          >
            Clear
          </button>

          <button
            onClick={giveHint}
            className="h-12 rounded bg-slate-800 hover:bg-slate-700"
          >
            Hint
          </button>
        </div>

        <div className="text-sm text-gray-400">{message}</div>
      </div>
    </div>
  );
}
