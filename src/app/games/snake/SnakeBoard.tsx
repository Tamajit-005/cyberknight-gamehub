"use client";

import { useEffect, useState, useCallback } from "react";
import {
  SnakeState,
  initialState,
  updateGame,
  changeDirection,
  Point,
} from "./logic";
import { motion, AnimatePresence } from "framer-motion";

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);
  return mounted;
};
type Difficulty = "easy" | "normal" | "hard" | "insane";

const DIFFICULTY_SPEED: Record<Difficulty, number> = {
  easy: 4,
  normal: 7,
  hard: 10,
  insane: 15,
};

export default function SnakeBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [openDropdown, setOpenDropdown] = useState(false);

  const [state, setState] = useState<SnakeState | null>(null);

  const isMounted = useMounted();

  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isMounted && !state) {
      setTimeout(() => {
        setState(initialState());
      }, 0);
    }
  }, [isMounted, state]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!state || state.gameOver) return;

      let dir: Point | null = null;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          dir = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
        case "S":
          dir = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          dir = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
        case "D":
          dir = { x: 1, y: 0 };
          break;
      }

      if (dir) {
        setState((prev) =>
          prev
            ? {
                ...prev,
                nextDirection: changeDirection(prev.direction, dir),
                started: true,
              }
            : prev
        );
      }
    },
    [state]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey as EventListener);
    return () =>
      window.removeEventListener("keydown", handleKey as EventListener);
  }, [handleKey]);

  useEffect(() => {
    if (!state) return;
    const speed = DIFFICULTY_SPEED[difficulty];

    const interval = setInterval(
      () => setState((prev) => (prev ? updateGame(prev) : prev)),
      1000 / speed
    );

    return () => clearInterval(interval);
  }, [state, difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
    }, 3000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const restart = () => setState(initialState());

  if (!isMounted || !state) {
    return null;
  }

  const dir = state.direction;
  const isUp = dir.y === -1;
  const isDown = dir.y === 1;
  const isLeft = dir.x === -1;
  const isRight = dir.x === 1;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        {/* Difficulty Dropdown Button */}
        <button
          onClick={() => setOpenDropdown((p) => !p)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white flex items-center gap-2 hover:bg-slate-700 transition"
        >
          Difficulty:{" "}
          <span className="capitalize text-green-300">{difficulty}</span>
          <motion.span
            animate={{ rotate: openDropdown ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </button>

        {/* Difficulty Dropdown Menu animated */}
        <AnimatePresence>
          {openDropdown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-20 overflow-hidden"
            >
              {(["easy", "normal", "hard", "insane"] as Difficulty[]).map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDifficulty(opt);
                      setOpenDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm capitalize transition ${
                      opt === difficulty
                        ? "bg-slate-700 text-green-300"
                        : "text-gray-300 hover:bg-slate-700"
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score Display */}
      <div className="flex items-center gap-6 mb-4">
        <div className="text-lg font-bold text-green-300">
          Score: {state.score}
        </div>
      </div>

      {/* Game Over Message */}
      {state.gameOver && (
        <div className="mb-3 text-red-400 font-semibold text-lg">
          Game Over!
        </div>
      )}

      {/* Start Game Prompt */}
      {!state.started && !state.gameOver && (
        <p className="mb-2 text-sm text-blue-300 animate-pulse">
          Press Arrow Keys or WASD to start
        </p>
      )}

      {/* Game Grid */}
      <div
        className="grid bg-linear-to-br from-green-200 to-yellow-200 border border-gray-600 rounded-lg"
        style={{
          width: "90vmin",
          height: "90vmin",
          maxWidth: 480,
          maxHeight: 480,
          gridTemplateColumns: "repeat(18, 1fr)",
          gridTemplateRows: "repeat(18, 1fr)",
        }}
      >
        {/* Render Snake Body Segments */}
        {state.snake.map((seg, i) => {
          const isHead = i === 0;

          return (
            <div
              key={i}
              className={
                isHead
                  ? "relative bg-green-800 shadow-[0_0_14px_#00f7a4] rounded-full border-2 border-green-900" // Styling for the Snake Head
                  : "bg-green-500 shadow-[0_0_10px_#00d68f] rounded-full" // Styling for the Snake Body
              }
              style={{
                gridColumnStart: seg.x,
                gridRowStart: seg.y,
                transition: "transform 0.12s linear",
                transform: isHead
                  ? isUp
                    ? "rotate(0deg)"
                    : isDown
                    ? "rotate(180deg)"
                    : isLeft
                    ? "rotate(-90deg)"
                    : "rotate(90deg)"
                  : "none",
              }}
            >
              {isHead && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Snake Left Eye */}
                    <div
                      className={`absolute w-[18%] h-[18%] bg-white rounded-full ${
                        isBlinking ? "scale-y-0" : "scale-y-100"
                      } transition-all duration-150`}
                      style={{
                        top: isDown ? "60%" : isUp ? "20%" : "32%",
                        left: isRight ? "28%" : isLeft ? "46%" : "32%",
                      }}
                    >
                      <div className="absolute w-1/2 h-1/2 bg-black rounded-full top-1/4 left-1/4" />{" "}
                      {/* Pupil */}
                    </div>

                    {/* Snake Right Eye */}
                    <div
                      className={`absolute w-[18%] h-[18%] bg-white rounded-full ${
                        isBlinking ? "scale-y-0" : "scale-y-100"
                      } transition-all duration-150`}
                      style={{
                        top: isDown ? "60%" : isUp ? "20%" : "32%",
                        right: isRight ? "46%" : isLeft ? "28%" : "32%",
                      }}
                    >
                      <div className="absolute w-1/2 h-1/2 bg-black rounded-full top-1/4 left-1/4" />{" "}
                      {/* Pupil */}
                    </div>

                    {/* Snake Tongue */}
                    <div
                      className="absolute w-[22%] h-[30%] bg-red-500 rounded-full animate-pulse"
                      style={{
                        bottom: isUp ? "-12%" : "auto",
                        top: isDown ? "-12%" : "auto",
                        left: isLeft ? "10%" : isRight ? "70%" : "40%",
                        transform:
                          isLeft || isRight
                            ? "translateY(35%)"
                            : "translateX(35%)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Food Pellet */}
        <div
          className="bg-linear-to-br from-red-600 to-purple-700 border border-black rounded-md"
          style={{
            width: "70%",
            height: "70%",
            justifySelf: "center",
            alignSelf: "center",
            gridColumnStart: state.food.x,
            gridRowStart: state.food.y,
          }}
        />
      </div>

      {/* Restart Button */}
      <button
        onClick={restart}
        className="mt-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
      >
        Restart
      </button>
    </div>
  );
}
