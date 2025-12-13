import React, { useEffect, useState } from "react";
import { pickTarget, evaluateGuess, WORDS } from "./words";

export default function WordleGame() {
  const ROWS = 6;
  const COLS = 5;

  const [target, setTarget] = useState(pickTarget());
  const [board, setBoard] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [resultGrid, setResultGrid] = useState<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  const [message, setMessage] = useState<string>("");
  const [gameOver, setGameOver] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);  // 👈 NEW STATE (reveal/hide)

  const reset = () => {
    setTarget(pickTarget());
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill("")));
    setResultGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setRow(0);
    setCol(0);
    setMessage("");
    setGameOver(false);
    setShowAnswer(false);        // hide on reset
  };

  const reveal = () => {
    setShowAnswer(true);         // 👈 Show answer
  };

  const hide = () => {
    setShowAnswer(false);        // 👈 Hide answer
  };

  const handleKey = (key: string) => {
    if (gameOver) return;

    if (row >= ROWS) return;

    // Delete
    if (key === "Backspace" || key === "Del") {
      if (col > 0) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col - 1] = "";
        setBoard(newBoard);
        setCol(col - 1);
      }
      return;
    }

    // Enter
    if (key === "Enter") {
      if (col < COLS) {
        setMessage("⛔ Enter 5 letters.");
        return;
      }

      const guess = board[row].join("").toUpperCase();

      if (!WORDS.includes(guess)) {
        setMessage("❌ Word not in valid list.");
        return;
      }

      const result = evaluateGuess(guess, target);
      const updated = resultGrid.map(r => [...r]);
      updated[row] = result;
      setResultGrid(updated);

      if (guess === target) {
        setMessage("🎉 Correct! You win!");
        setGameOver(true);
        return;
      }

      if (row + 1 === ROWS) {
        setMessage(`😔 Game Over! Correct word: ${target}`);
        setGameOver(true);
        return;
      }

      setRow(row + 1);
      setCol(0);
      setMessage("");
      return;
    }

    // Letters
    if (/^[a-zA-Z]$/.test(key)) {
      if (col < COLS) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = key.toUpperCase();
        setBoard(newBoard);
        setCol(col + 1);

        if (message) setMessage("");
      }
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKey(e.key);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });

  const renderKey = (k: string) => (
    <button key={k} onClick={() => handleKey(k)} className="key">
      {k}
    </button>
  );

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(145deg, #001f3f, #003566);
          margin: 0;
          font-family: Arial, sans-serif;
          color: white;
        }
        .wordle-container {
          padding: 20px;
          text-align: center;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .btn-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .btn {
          background: #123c7a;
          padding: 8px 18px;
          border-radius: 6px;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }
        .btn:hover {
          background: #1d4ea1;
        }
        .board {
          width: 260px;
          margin: 0 auto;
        }
        .row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .tile {
          width: 48px;
          height: 48px;
          background: #001a33;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 22px;
          color: white;
          font-weight: bold;
        }
        .tile.correct {
          background: #00b300;
        }
        .tile.present {
          background: #e6b800;
        }
        .tile.absent {
          background: #555;
        }
        .keyboard {
          margin-top: 30px;
        }
        .kb-row {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .key {
          background: #123c7a;
          border: none;
          padding: 10px 12px;
          border-radius: 6px;
          cursor: pointer;
          color: white;
          font-size: 15px;
        }
        .key:hover {
          background: #1d4ea1;
        }
        .message {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
          color: #ffd700;
        }
        .answer-box {
          margin-top: 10px;
          font-size: 22px;
          font-weight: bold;
          color: #00ffea;
        }
      `}</style>

      <div className="wordle-container">
        <h1 className="title">WORDLE — By Snehendu</h1>

        {/* Reveal / Hide Toggle Buttons */}
        <div className="btn-row">
          {!showAnswer ? (
            <button className="btn" onClick={reveal}>Reveal</button>
          ) : (
            <button className="btn" onClick={hide}>Hide</button>
          )}
          <button className="btn" onClick={reset}>Restart</button>
        </div>

        <div className="board">
          {board.map((r, rIndex) => (
            <div className="row" key={rIndex}>
              {r.map((cell, cIndex) => {
                const result = resultGrid[rIndex][cIndex];
                return (
                  <div key={cIndex} className={`tile ${result ?? ""}`}>
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="keyboard">
          <div className="kb-row">
            {["Q","W","E","R","T","Y","U","I","O","P"].map(renderKey)}
          </div>
          <div className="kb-row">
            {["A","S","D","F","G","H","J","K","L"].map(renderKey)}
          </div>
          <div className="kb-row">
            {renderKey("Enter")}
            {["Z","X","C","V","B","N","M"].map(renderKey)}
            {renderKey("Del")}
          </div>
        </div>

        {/* Message Section */}
        {message && <div className="message">{message}</div>}

        {/* Reveal Answer Section */}
        {showAnswer && (
          <div className="answer-box">
            🔍 Answer: {target}
          </div>
        )}
      </div>
    </>
  );
}
