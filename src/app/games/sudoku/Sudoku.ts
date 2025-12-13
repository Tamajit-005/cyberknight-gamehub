// sudoku.ts
export type Board = number[][];

// Very small random puzzle generator for demo purposes.
// Returns a board with 0 for empty cells.
export function generatePuzzle(difficulty: "Easy" | "Medium" | "Hard" = "Medium"): Board {
  // A solved base (valid full board). We'll remove cells to make a puzzle.
  // For simplicity and determinism we use one solved grid then remove cells randomly.
  const solved: Board = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];

  // Choose removals by difficulty
  const removeCount = difficulty === "Easy" ? 30 : difficulty === "Medium" ? 45 : 54;

  // Start from solved and remove removeCount cells (random)
  const puzzle: Board = solved.map(r => r.slice());
  const positions = Array.from({length:81}, (_,i)=>i).sort(()=>Math.random()-0.5);

  let removed = 0;
  for (const pos of positions) {
    if (removed >= removeCount) break;
    const r = Math.floor(pos/9), c = pos%9;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    // Quick uniqueness check: attempt to solve and ensure at least one solution.
    // We only want to avoid creating trivially ambiguous puzzles in this simple generator.
    const copy = puzzle.map(row => row.slice());
    if (!solveSudokuLimited(copy, 2)) { // more than 1 solution -> revert
      puzzle[r][c] = backup;
    } else {
      removed++;
    }
  }

  return puzzle;
}

// ------------------------------
// validation & solver
// ------------------------------
export function isValid(board: Board, row: number, col: number, val: number): boolean {
  if (val === 0) return true;
  for (let i=0;i<9;i++){
    if (board[row][i] === val && i !== col) return false;
    if (board[i][col] === val && i !== row) return false;
  }
  const br = Math.floor(row/3)*3, bc = Math.floor(col/3)*3;
  for (let r=br;r<br+3;r++) for (let c=bc;c<bc+3;c++) {
    if ((r !== row || c !== col) && board[r][c] === val) return false;
  }
  return true;
}

// Standard backtracking solver that fills 'board' in-place and returns true if solved.
export function solveSudoku(board: Board): boolean {
  const empty = findEmpty(board);
  if (!empty) return true;
  const [r,c] = empty;
  for (let n=1;n<=9;n++){
    if (isValid(board, r, c, n)) {
      board[r][c] = n;
      if (solveSudoku(board)) return true;
      board[r][c] = 0;
    }
  }
  return false;
}

// Slightly modified solver that stops after 'limit' solutions found.
// Returns true if at least 1 solution exists; if limit>1 it tracks count and returns true if count >= 1.
// Also used to detect multiple solutions by counting up to limit.
function solveSudokuLimited(board: Board, limit = 1): boolean {
  let count = 0;

  const findEmptyLocal = (): [number, number] | null => {
    for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (board[r][c] === 0) return [r,c];
    return null;
  };

  const backtrack = (): boolean => {
    const spot = findEmptyLocal();
    if (!spot) {
      count++;
      return count >= limit;
    }
    const [r,c] = spot;
    for (let n=1;n<=9;n++){
      if (isValid(board, r, c, n)) {
        board[r][c] = n;
        const stop = backtrack();
        if (stop) return true;
        board[r][c] = 0;
      }
    }
    return false;
  };

  backtrack();
  return count > 0;
}

// find first empty cell
function findEmpty(board: Board): [number, number] | null {
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (board[r][c] === 0) return [r,c];
  return null;
}

// ------------------------------
// hint
// ------------------------------
export function getHint(board: Board): { row: number, col: number, value: number } | null {
  // Copy and solve the puzzle; if unsolvable return null
  const copy = board.map(r => r.slice());
  if (!solveSudoku(copy)) return null;

  // find first empty cell in original board and return the solution value
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (board[r][c] === 0) {
    return { row: r, col: c, value: copy[r][c] };
  }
  return null;
}
