import { useCallback, useEffect, useRef, useState } from "react";
import { useDeckStore, type DpadDirection } from "../store/deckStore";
import { useDeckJoystickDirection } from "../hooks/useDeckJoystickDirection";

type Point = { x: number; y: number };
const GRID = 20;
const CELL = 20;
const TICK_MS = 130;

function directionToVector(dir: DpadDirection): Point {
  switch (dir) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}

export function SnakeGame() {
  const navigateTo = useDeckStore((s) => s.navigateTo);
  const pressedButtons = useDeckStore((s) => s.pressedButtons);

  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const applyDirection = useCallback((direction: DpadDirection) => {
    setDir(directionToVector(direction));
  }, []);

  useDeckJoystickDirection(applyDirection);

  useEffect(() => {
    if (pressedButtons.has("A") && gameOver) {
      setSnake([{ x: 10, y: 10 }]);
      setDir({ x: 1, y: 0 });
      setScore(0);
      setGameOver(false);
    }
  }, [pressedButtons, gameOver]);

  // Keyboard fallback for desktop testing without the 3D device
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown") setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft") setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight") setDir({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };

        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID ||
          head.y >= GRID ||
          prev.some((p) => p.x === head.x && p.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }

        const ateFood = head.x === food.x && head.y === food.y;
        const nextSnake = [head, ...prev];
        if (ateFood) {
          setScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
          });
        } else {
          nextSnake.pop();
        }
        return nextSnake;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [food, gameOver]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative">
      <button
        onClick={() => navigateTo("games")}
        className="absolute top-4 left-4 text-xs px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
      >
        ← B: Back
      </button>
      <div className="text-white mb-2 text-sm">Score: {score}</div>
      <svg width={GRID * CELL} height={GRID * CELL} className="bg-neutral-950 border border-neutral-800">
        {snake.map((s, i) => (
          <rect
            key={i}
            x={s.x * CELL}
            y={s.y * CELL}
            width={CELL - 1}
            height={CELL - 1}
            fill={i === 0 ? "#3b82f6" : "#1d4ed8"}
          />
        ))}
        <rect x={food.x * CELL} y={food.y * CELL} width={CELL - 1} height={CELL - 1} fill="#ef4444" />
      </svg>
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-3">
          <p className="text-xl font-bold">Game Over — Score: {score}</p>
          <button
            onClick={() => {
              setSnake([{ x: 10, y: 10 }]);
              setDir({ x: 1, y: 0 });
              setScore(0);
              setGameOver(false);
            }}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
          >
            Retry (A)
          </button>
        </div>
      )}
    </div>
  );
}
