/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  createInitialState,
  gridToPixels,
  GameState,
  equalPos,
  PacState,
  Ghost,
  Direction,
} from "./logic";

const ASSET_BASE = "/games/pacman/assets";

const SPRITES = {
  pacUp: `${ASSET_BASE}/pacmanUp.png`,
  pacDown: `${ASSET_BASE}/pacmanDown.png`,
  pacLeft: `${ASSET_BASE}/pacmanLeft.png`,
  pacRight: `${ASSET_BASE}/pacmanRight.png`,
  ghostBlue: `${ASSET_BASE}/blueGhost.png`,
  ghostOrange: `${ASSET_BASE}/orangeGhost.png`,
  ghostPink: `${ASSET_BASE}/pinkGhost.png`,
  ghostRed: `${ASSET_BASE}/redGhost.png`,
  wall: `${ASSET_BASE}/wall.png`,
};

const TICK_MS = 120;

export default function PacmanBoard() {
  const tileSize = 32;

  const [state, setState] = useState<GameState>(() =>
    createInitialState(tileSize)
  );

  const tickRef = useRef<number | null>(null);
  const gameOver = state.gameOver;

  // KEY HANDLER (safe, typed)

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;
      const k = e.key;

      setState((s) => {
        const next = structuredClone(s);
        const pac = next.pacman as PacState;

        if (k === "ArrowUp" || k === "w" || k === "W") {
          pac.dir = "U" as Direction;
          pac.spriteKey = "up";
        } else if (k === "ArrowDown" || k === "s" || k === "S") {
          pac.dir = "D" as Direction;
          pac.spriteKey = "down";
        } else if (k === "ArrowLeft" || k === "a" || k === "A") {
          pac.dir = "L" as Direction;
          pac.spriteKey = "left";
        } else if (k === "ArrowRight" || k === "d" || k === "D") {
          pac.dir = "R" as Direction;
          pac.spriteKey = "right";
        }

        return next;
      });
    },
    [gameOver]
  );

  // MOVEMENT HELPERS

  const dirToDelta = (d: Direction) =>
    d === "U"
      ? { x: 0, y: -1 }
      : d === "D"
      ? { x: 0, y: 1 }
      : d === "L"
      ? { x: -1, y: 0 }
      : { x: 1, y: 0 };

  const tileBlocked = (
    walls: { x: number; y: number }[],
    x: number,
    y: number
  ) => walls.some((w) => w.x === x && w.y === y);

  // MOVE PAC-MAN

  const movePac = (gs: GameState): GameState => {
    const next = structuredClone(gs);
    const pac = next.pacman as PacState;

    const delta = dirToDelta(pac.dir);

    let nx = pac.x + delta.x;
    let ny = pac.y + delta.y;

    // wrap-around
    if (nx < 0) nx = next.cols - 1;
    if (nx >= next.cols) nx = 0;
    if (ny < 0) ny = next.rows - 1;
    if (ny >= next.rows) ny = 0;

    if (!tileBlocked(next.walls, nx, ny)) {
      pac.x = nx;
      pac.y = ny;
    }

    const idx = next.foods.findIndex((f) => f.x === pac.x && f.y === pac.y);
    if (idx !== -1) {
      next.foods.splice(idx, 1);
      next.score += 10;
    }

    return next;
  };

  // MOVE GHOSTS

  const moveGhosts = (gs: GameState): GameState => {
    const next = structuredClone(gs);

    for (const g of next.ghosts as Ghost[]) {
      const delta = dirToDelta(g.dir);

      let nx = g.x + delta.x;
      let ny = g.y + delta.y;

      if (nx < 0) nx = next.cols - 1;
      if (nx >= next.cols) nx = 0;
      if (ny < 0) ny = next.rows - 1;
      if (ny >= next.rows) ny = 0;

      // try to move
      if (!tileBlocked(next.walls, nx, ny)) {
        g.x = nx;
        g.y = ny;
      } else {
        // pick random direction
        const DIRS: Direction[] = ["U", "D", "L", "R"];
        for (let i = 0; i < 4; i++) {
          const cand = DIRS[Math.floor(Math.random() * DIRS.length)];
          const d = dirToDelta(cand);

          let cx = g.x + d.x;
          let cy = g.y + d.y;

          if (cx < 0) cx = next.cols - 1;
          if (cx >= next.cols) cx = 0;
          if (cy < 0) cy = next.rows - 1;
          if (cy >= next.rows) cy = 0;

          if (!tileBlocked(next.walls, cx, cy)) {
            g.dir = cand;
            break;
          }
        }
      }
    }

    return next;
  };

  // COLLISION CHECK

  const checkPacGhostCollision = (gs: GameState): GameState => {
    const next = structuredClone(gs);

    for (const g of next.ghosts) {
      if (equalPos(g, next.pacman)) {
        next.lives -= 1;

        if (next.lives <= 0) {
          next.gameOver = true;
          return next;
        }

        const base = createInitialState(tileSize);
        next.pacman = base.pacman;
        next.ghosts = base.ghosts;
        return next;
      }
    }

    return next;
  };

  // TICK LOOP

  const tick = useCallback(() => {
    setState((s) => {
      if (s.gameOver) return s;

      let next = movePac(s);
      next = moveGhosts(next);
      next = checkPacGhostCollision(next);

      if (next.foods.length === 0) {
        const base = createInitialState(tileSize);
        next.foods = base.foods;
      }

      return next;
    });
  }, []);

  // EFFECTS

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    tickRef.current = window.setInterval(tick, TICK_MS);

    return () => {
      window.removeEventListener("keydown", onKey);
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [onKey, tick]);

  // RESTART

  const restart = () => setState(createInitialState(tileSize));

  // SPRITE HELPERS

  const pacSprite = (key: string) =>
    key === "up"
      ? SPRITES.pacUp
      : key === "down"
      ? SPRITES.pacDown
      : key === "left"
      ? SPRITES.pacLeft
      : SPRITES.pacRight;

  const ghostSprite = (c: Ghost["color"]) =>
    c === "blue"
      ? SPRITES.ghostBlue
      : c === "orange"
      ? SPRITES.ghostOrange
      : c === "pink"
      ? SPRITES.ghostPink
      : SPRITES.ghostRed;

  // RENDER

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-bold text-green-300">
        Score: {state.score}
      </div>
      <div className="text-lg font-bold text-yellow-300 mb-4">
        Lives: {state.lives}
      </div>

      {state.gameOver && (
        <div className="text-red-400 font-semibold text-lg mb-4">
          Game Over!
        </div>
      )}

      <div
        className="relative border border-slate-700 rounded-md overflow-hidden"
        style={{
          width: state.cols * tileSize,
          height: state.rows * tileSize,
          background: "#000",
        }}
      >
        {/* walls */}
        {state.walls.map((w, idx) => {
          const px = gridToPixels(w.x, w.y, tileSize);
          return (
            <img
              key={idx}
              src={SPRITES.wall}
              alt=""
              style={{
                position: "absolute",
                left: px.left,
                top: px.top,
                width: tileSize,
                height: tileSize,
              }}
            />
          );
        })}

        {/* foods */}
        {state.foods.map((f, idx) => {
          const px = gridToPixels(f.x, f.y, tileSize);
          const size = Math.floor(tileSize * 0.22);
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: px.left + (tileSize - size) / 2,
                top: px.top + (tileSize - size) / 2,
                width: size,
                height: size,
                background: "white",
                borderRadius: "50%",
              }}
            />
          );
        })}

        {/* ghosts */}
        {state.ghosts.map((g, idx) => {
          const px = gridToPixels(g.x, g.y, tileSize);
          return (
            <img
              key={idx}
              src={ghostSprite(g.color)}
              alt=""
              style={{
                position: "absolute",
                left: px.left,
                top: px.top,
                width: tileSize,
                height: tileSize,
              }}
            />
          );
        })}

        {/* pacman */}
        <img
          src={pacSprite(state.pacman.spriteKey)}
          alt=""
          style={{
            position: "absolute",
            left: gridToPixels(state.pacman.x, state.pacman.y, tileSize).left,
            top: gridToPixels(state.pacman.x, state.pacman.y, tileSize).top,
            width: tileSize,
            height: tileSize,
          }}
        />
      </div>

      <button
        onClick={restart}
        className="mt-4 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition"
      >
        Restart
      </button>
    </div>
  );
}
