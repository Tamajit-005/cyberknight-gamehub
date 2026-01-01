type Player = "X" | "O" | "T";
type Cell = Player | null;
type Board = Cell[];

export function initTicTacToe(): void {
  const boardEl = document.getElementById("board") as HTMLElement;
  const statusEl = document.getElementById("status") as HTMLElement;
  const modeEl = document.getElementById("mode") as HTMLSelectElement;
  const resetBtn = document.getElementById("reset") as HTMLButtonElement;

  let board: Board = Array(9).fill(null);
  let current: Exclude<Player, "T"> = "X";

  let vsAI = true;
  let aiStarts = false;

  const scores: Record<Player, number> = { X: 0, O: 0, T: 0 };

  const scoreX = document.getElementById("scoreX")!;
  const scoreO = document.getElementById("scoreO")!;
  const scoreT = document.getElementById("scoreT")!;

  // Build board
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.className =
      "aspect-square w-24 sm:w-28 md:w-32 text-4xl font-extrabold flex items-center justify-center bg-slate-900 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-all duration-150 shadow-sm";
    cell.addEventListener("click", () => onCell(i));
    boardEl.appendChild(cell);
  }

  // MODE HANDLING (from old code)
  modeEl.addEventListener("change", () => {
    const v = modeEl.value;

    if (v === "human-human") {
      vsAI = false;
      aiStarts = false;
    } else {
      vsAI = true;
      aiStarts = v === "ai-ai-first";
    }

    reset(true);
  });

  resetBtn.addEventListener("click", () => reset());

  function reset(keepScores = false): void {
    board = Array(9).fill(null);
    current = "X";
    updateUI();
    setStatus(`Turn: ${current}${vsAI ? " (vs AI)" : ""}`);

    if (!keepScores) updateScores();

    // AI starts as X
    if (vsAI && aiStarts && current === "X") {
      const move = bestMove("X");
      if (move !== -1) {
        place(move, "X");
        checkGameEnd();
      }
    }
  }

  function setStatus(msg: string): void {
    statusEl.textContent = msg;
  }

  function updateScores(): void {
    scoreX.textContent = String(scores.X);
    scoreO.textContent = String(scores.O);
    scoreT.textContent = String(scores.T);
  }

  function updateUI(winnerLine: number[] | null = null): void {
    const cells = Array.from(boardEl.children) as HTMLElement[];
    cells.forEach((cell, idx) => {
      const mark = board[idx];
      cell.textContent = mark ?? "";
      cell.classList.remove(
        "text-cyan-400",
        "text-pink-400",
        "ring-2",
        "ring-green-500",
        "opacity-50"
      );

      if (mark === "X") cell.classList.add("text-cyan-400");
      if (mark === "O") cell.classList.add("text-pink-400");
      if (gameOver(board) || mark) cell.classList.add("opacity-50");

      if (winnerLine?.includes(idx)) {
        cell.classList.add("ring-2", "ring-green-500");
      }
    });
  }

  function onCell(i: number): void {
    if (board[i] || gameOver(board)) return;

    place(i, current);
    const result = checkGameEnd();
    if (result.done) return;

    // AI move (X or O depending on who starts)
    if (vsAI && current === (aiStarts ? "X" : "O")) {
      const move = bestMove(current);
      if (move !== -1) {
        place(move, current);
        checkGameEnd();
      }
    }
  }

  function place(i: number, player: Exclude<Player, "T">): void {
    board[i] = player;
    current = player === "X" ? "O" : "X";
    updateUI();
  }

  function checkGameEnd(): { done: boolean } {
    const w = winner(board);
    if (w) {
      const winLine = winningLine(board);
      setStatus(`${w} wins!`);
      scores[w]++;
      updateUI(winLine);
      updateScores();
      return { done: true };
    }

    if (full(board)) {
      setStatus("It's a tie.");
      scores.T++;
      updateScores();
      return { done: true };
    }

    setStatus(`Turn: ${current}`);
    return { done: false };
  }

  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function winner(b: Board): Exclude<Player, "T"> | null {
    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a] as Exclude<Player, "T">;
    }
    return null;
  }

  function winningLine(b: Board): number[] | null {
    for (const [a, c, d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return [a, c, d];
    }
    return null;
  }

  function full(b: Board): boolean {
    return b.every(Boolean);
  }

  function gameOver(b: Board): boolean {
    return !!winner(b) || full(b);
  }

  function bestMove(ai: Exclude<Player, "T">): number {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = ai;
        const score = minimax(board, 0, false, ai);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(
    b: Board,
    depth: number,
    isMax: boolean,
    ai: Exclude<Player, "T">
  ): number {
    const w = winner(b);
    if (w === ai) return 10 - depth;
    if (w && w !== ai) return depth - 10;
    if (full(b)) return 0;

    const human: Exclude<Player, "T"> = ai === "X" ? "O" : "X";

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = ai;
          best = Math.max(best, minimax(b, depth + 1, false, ai));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = human;
          best = Math.min(best, minimax(b, depth + 1, true, ai));
          b[i] = null;
        }
      }
      return best;
    }
  }

  reset();
}
