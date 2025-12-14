export type Board = number[][];

export type Difficulty = "Easy" | "Medium" | "Hard";

const SOLVED: Board = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

export function generatePuzzle(difficulty: Difficulty): Board {
  const removals = difficulty === "Easy" ? 30 : difficulty === "Medium" ? 45 : 54;
  const board = SOLVED.map(r => [...r]);

  const positions = Array.from({ length: 81 }, (_, i) => i)
    .sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const pos of positions) {
    if (removed >= removals) break;
    const r = Math.floor(pos / 9);
    const c = pos % 9;
    board[r][c] = 0;
    removed++;
  }

  return board;
}

export function isValid(board: Board, row: number, col: number, val: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === val && i !== col) return false;
    if (board[i][col] === val && i !== row) return false;
  }

  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;

  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] === val && (r !== row || c !== col)) return false;
    }
  }
  return true;
}

export function solveSudoku(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (isValid(board, r, c, n)) {
            board[r][c] = n;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function getHint(board: Board): { row: number; col: number; value: number } | null {
  const copy = board.map(r => [...r]);
  if (!solveSudoku(copy)) return null;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        return { row: r, col: c, value: copy[r][c] };
      }
    }
  }
  return null;
}
