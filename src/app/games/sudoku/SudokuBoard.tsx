// sudokuBoard.tsx
import React, { useEffect, useState } from "react";
import { generatePuzzle, solveSudoku, getHint, isValid, Board } from "./Sudoku";

export default function SudokuBoard() {
  // initialPuzzle = the clues (never change)
  // board = current board (clues + user entries)
  const [initialPuzzle, setInitialPuzzle] = useState<Board>(() => generatePuzzle("Medium"));
  const [board, setBoard] = useState<Board>(() => initialPuzzle.map(r => r.slice()));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState("Puzzle ready");

  // regenerate puzzle
  const newPuzzle = (difficulty: "Easy"|"Medium"|"Hard" = "Medium") => {
    const p = generatePuzzle(difficulty);
    setInitialPuzzle(p);
    setBoard(p.map(r => r.slice()));
    setSelected(null);
    setMessage("Puzzle ready");
  };

  useEffect(() => {
    // ensure board follows initialPuzzle on first mount
    setBoard(initialPuzzle.map(r => r.slice()));
  }, []); // eslint-disable-line

  // helper: is this cell a clue/prefilled?
  const isPrefilled = (r:number, c:number) => initialPuzzle[r][c] !== 0;

  // place a number at selected cell (only if not a clue)
  const placeNumber = (n:number) => {
    if (!selected) return;
    const [r,c] = selected;
    if (isPrefilled(r,c)) { setMessage("Cannot change a clue"); return; }

    // check validity against both clues and current board (excluding this cell)
    const copy = board.map(row => row.slice());
    copy[r][c] = n;
    if (!isValid(copy, r, c, n)) { setMessage("Invalid move"); return; }

    setBoard(copy);
    setMessage(`Placed ${n} at ${r+1},${c+1}`);
  };

  // clear selected cell (only if not a clue)
  const clearCell = () => {
    if (!selected) return;
    const [r,c] = selected;
    if (isPrefilled(r,c)) { setMessage("Cannot clear a clue"); return; }
    if (board[r][c] === 0) { setMessage("Cell already empty"); return; }

    const copy = board.map(row => row.slice());
    copy[r][c] = 0;
    setBoard(copy);
    setMessage("Cell cleared");
  };

  // hint: find hint based on initialPuzzle (clues) and current board entries
  const giveHint = () => {
    // create a puzzle that uses clues from initialPuzzle and current user entries
    const puzzleForHint = initialPuzzle.map((row, r) => row.map((val, c) => (val !== 0 ? val : board[r][c])));
    const h = getHint(puzzleForHint);
    if (!h) { setMessage("No hint available or puzzle unsolvable"); return; }

    // only apply hint to a cell that is not a clue and currently empty
    if (isPrefilled(h.row, h.col)) { setMessage("No suitable hint cell"); return; }
    if (board[h.row][h.col] !== 0) { setMessage("No empty non-clue cell to hint"); return; }

    const copy = board.map(r => r.slice());
    copy[h.row][h.col] = h.value;
    setBoard(copy);
    setSelected([h.row, h.col]);
    setMessage(`Hint: put ${h.value} at ${h.row+1},${h.col+1}`);
  };

  // solve: produce the full solution of the ORIGINAL puzzle (the clues)
  const solve = () => {
    // Solve from initialPuzzle; ignore current user mistakes and show correct solution.
    const solverInput = initialPuzzle.map(row => row.slice());
    const ok = solveSudoku(solverInput);
    if (!ok) { setMessage("Cannot solve puzzle"); return; }
    setBoard(solverInput);
    setMessage("Solved (from clues)");
    setSelected(null);
  };

  // keyboard support
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (!selected) return;

    if (e.key >= "1" && e.key <= "9") placeNumber(parseInt(e.key));
    if (e.key === "Backspace" || e.key === "Delete" || e.key.toLowerCase() === "c") clearCell();

    setSelected(prev => {
      if (!prev) return null; // guard against null
      const [r, c] = prev;

      switch (e.key) {
        case "ArrowRight": return [r, (c+1)%9] as [number, number];
        case "ArrowLeft": return [r, (c+8)%9] as [number, number]; // +8 instead of -1
        case "ArrowUp": return [(r+8)%9, c] as [number, number];
        case "ArrowDown": return [(r+1)%9, c] as [number, number];
        default: return prev;
      }
    });
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [selected, board]);


  // render cell
  const renderCell = (r:number, c:number) => {
    const val = board[r][c];
    const pre = isPrefilled(r,c);
    const sel = selected && selected[0] === r && selected[1] === c;
    const className = "cell" + (pre ? " prefilled" : "") + (sel ? " selected" : "");
    return (
      <div
        key={`${r}-${c}`}
        className={className}
        data-r={r}
        data-c={c}
        onClick={() => {
          setSelected([r,c]);
          setMessage(pre ? "This is a clue" : `Selected ${r+1},${c+1}`);
        }}
      >
        {val === 0 ? "" : val}
      </div>
    );
  };

  return (
    <div className="app" style={{padding:18, maxWidth:980, margin:"12px auto"}}>
      <style>{`
        :root{
          --bg:#0f1724; --card:#0b1220; --accent:#60a5fa; --muted:#9aa4b2; --cell:#0e1722;
        }
        *{box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,-apple-system,'Helvetica Neue',Arial}
        .app{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border-radius:12px;box-shadow:0 8px 30px rgba(2,6,23,0.6);color:#ecf0f3}
        header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:6px 12px}
        h1{font-size:18px;margin:0}
        .controls{display:flex;gap:8px;align-items:center}
        select, button{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted);padding:8px 10px;border-radius:8px;cursor:pointer}
        button.primary{background:var(--accent);border:0;color:#072034}
        .main{display:flex;gap:18px;padding:12px}
        .board{background:var(--card);padding:12px;border-radius:10px}
        .grid{display:grid;grid-template-columns:repeat(9,44px);grid-template-rows:repeat(9,44px);gap:4px}
        .cell{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:var(--cell);border-radius:6px;cursor:pointer;user-select:none;font-size:18px}
        .cell.prefilled{font-weight:700;color:#dbeafe;cursor:default}
        .cell.selected{outline:3px solid rgba(96,165,250,0.18)}
        .cell.invalid{background:rgba(220,38,38,0.12)}
        .sidebar{flex:1}
        .pad{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
        .pad button{width:44px;height:44px;border-radius:8px;cursor:pointer}
        .info{background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);padding:10px;border-radius:8px;color:var(--muted)}
        footer{display:flex;justify-content:space-between;margin-top:10px;color:var(--muted);font-size:13px}
      `}</style>

      <header>
        <h1>Sudoku</h1>
        <h1>by Soumyajit and Snehendu</h1>
        <div className="controls">
          <label>
            Difficulty:
            <select onChange={(e)=> newPuzzle(e.target.value as "Easy"|"Medium"|"Hard")}>
              <option value="Easy">Easy</option>
              <option value="Medium" selected>Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          <button className="primary" onClick={() => newPuzzle("Medium")}>New Puzzle</button>
          <button onClick={solve}>Solve</button>
        </div>
      </header>

      <div className="main">
        <div className="board">
          <div className="grid" role="grid" aria-label="Sudoku board">
            {Array.from({length:9}, (_,r) => Array.from({length:9}, (_,c) => renderCell(r,c))).flat()}
          </div>
        </div>

        <aside className="sidebar">
          <div className="pad">
            {Array.from({length:9}, (_,i)=>i+1).map(n => (
              <button key={n} onClick={() => placeNumber(n)}>{n}</button>
            ))}
            <button onClick={clearCell}>Clear</button>
            <button onClick={giveHint}>Hint</button>
          </div>

          <div className="info">{message}</div>
          <footer><div>Ready</div></footer>
        </aside>
      </div>
    </div>
  );
}
