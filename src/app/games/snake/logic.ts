export type Point = { x: number; y: number };

export interface SnakeState {
  snake: Point[];
  food: Point;
  direction: Point;
  nextDirection: Point;
  score: number;
  gameOver: boolean;
  started: boolean;
}

const GRID_SIZE = 18;

export const initialState = (): SnakeState => {
  return {
    snake: [{ x: 13, y: 15 }],
    food: randomFood(),
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    score: 0,
    gameOver: false,
    started: false,
  };
};

export function randomFood(): Point {
  const a = 2, b = 16;
  return {
    x: Math.floor(a + Math.random() * (b - a)),
    y: Math.floor(a + Math.random() * (b - a)),
  };
}

export function updateGame(state: SnakeState): SnakeState {
  if (state.gameOver) return state;
  if (!state.started) return state;

  const snake = [...state.snake];
  const direction = state.nextDirection;

  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (
    newHead.x <= 0 ||
    newHead.x >= GRID_SIZE ||
    newHead.y <= 0 ||
    newHead.y >= GRID_SIZE
  ) {
    return { ...state, gameOver: true };
  }

  if (snake.some((p) => p.x === newHead.x && p.y === newHead.y)) {
    return { ...state, gameOver: true };
  }

  snake.unshift(newHead);

  let score = state.score;
  let food = state.food;

  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  return {
    ...state,
    snake,
    food,
    score,
    direction,
  };
}

export function changeDirection(current: Point, next: Point): Point {
  if (current.x === -next.x && current.x !== 0) return current;
  if (current.y === -next.y && current.y !== 0) return current;
  return next;
}
