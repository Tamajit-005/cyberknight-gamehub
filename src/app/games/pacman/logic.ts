export type Direction = "U" | "D" | "L" | "R";

export interface Block {
  x: number;
  y: number;
}

export interface Ghost extends Block {
  color: "blue" | "red" | "pink" | "orange";
  dir: Direction;
  spawnX: number;
  spawnY: number;
}

export interface PacState extends Block {
  dir: Direction;
  spriteKey: "up" | "down" | "left" | "right";
  spawnX: number;
  spawnY: number;
}

export interface GameState {
  rows: number;
  cols: number;
  tileSize: number;
  walls: Block[];
  foods: Block[];
  pacman: PacState;
  ghosts: Ghost[];
  lives: number;
  score: number;
  gameOver: boolean;
}

const tileMap = [
  "XXXXXXXXXXXXXXXXXXX",
  "X........X........X",
  "X.XX.XXX.X.XXX.XX.X",
  "X.................X",
  "X.XX.X.XXXXX.X.XX.X",
  "X....X.......X....X",
  "XXXX.XXXX.XXX.XXXXX",
  "OOOX.X.......X.XOOO",
  "XXXX.X.XXrXX.X.XXXX",
  "O....b..p.o....b..O",
  "XXXX.X.XXXXX.X.XXXX",
  "OOOX.X.......X.XOOO",
  "XXXX.X.XXXXX.X.XXXX",
  "X........X........X",
  "X.XX.XXX.X.XXX.XX.X",
  "X..X.....P.....X..X",
  "XX.X.X.XXXXX.X.X.XX",
  "X....X...X...X....X",
  "X.XXXXXX.X.XXXXXX.X",
  "X.................X",
  "XXXXXXXXXXXXXXXXXXX",
];

export const ROWS = tileMap.length;
export const COLS = tileMap[0].length;

export function createInitialState(tileSize: number): GameState {
  const walls: Block[] = [];
  const foods: Block[] = [];
  const ghosts: Ghost[] = [];
  let pacman: PacState | null = null;

  for (let r = 0; r < ROWS; r++) {
    const row = tileMap[r];

    for (let c = 0; c < COLS; c++) {
      const ch = row[c];

      if (ch === "X") {
        walls.push({ x: c, y: r });
      } else if (ch === ".") {
        foods.push({ x: c, y: r });
      } else if (ch === "P") {
        pacman = {
          x: c,
          y: r,
          spawnX: c,
          spawnY: r,
          dir: "R" as Direction,
          spriteKey: "right",
        };
      } else if (ch === "b") {
        ghosts.push({
          x: c,
          y: r,
          spawnX: c,
          spawnY: r,
          color: "blue",
          dir: "U" as Direction,
        });
      } else if (ch === "r") {
        ghosts.push({
          x: c,
          y: r,
          spawnX: c,
          spawnY: r,
          color: "red",
          dir: "U" as Direction,
        });
      } else if (ch === "p") {
        ghosts.push({
          x: c,
          y: r,
          spawnX: c,
          spawnY: r,
          color: "pink",
          dir: "U" as Direction,
        });
      } else if (ch === "o") {
        ghosts.push({
          x: c,
          y: r,
          spawnX: c,
          spawnY: r,
          color: "orange",
          dir: "U" as Direction,
        });
      }
    }
  }

  if (!pacman) {
    pacman = {
      x: 9,
      y: 15,
      spawnX: 9,
      spawnY: 15,
      dir: "R" as Direction,
      spriteKey: "right",
    };
  }

  return {
    rows: ROWS,
    cols: COLS,
    tileSize,
    walls,
    foods,
    ghosts,
    pacman,
    lives: 3,
    score: 0,
    gameOver: false,
  };
}

export function gridToPixels(x: number, y: number, tileSize: number) {
  return {
    left: x * tileSize,
    top: y * tileSize,
  };
}

export function equalPos(a: Block, b: Block) {
  return a.x === b.x && a.y === b.y;
}
