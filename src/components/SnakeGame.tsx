import { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, Power } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 130;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [applesEaten, setApplesEaten] = useState(0);
  
  const directionRef = useRef(direction);
  const applesEatenRef = useRef(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOccupied) break;
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    setApplesEaten(0);
    applesEatenRef.current = 0;
  }, [generateFood, onScoreChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          resetGame();
        }
        return;
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      
      if (e.code === 'Space') {
        setIsPaused((p) => !p);
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    },
    [gameOver, resetGame]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    const currentSnake = snake;
    const head = currentSnake[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y,
    };

    // Check collision with walls
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      setGameOver(true);
      return;
    }

    // Check collision with self
    if (
      currentSnake.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      )
    ) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...currentSnake];

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      const newScore = score + 10;
      setScore(newScore);
      onScoreChange(newScore);
      applesEatenRef.current += 1;
      setApplesEaten(applesEatenRef.current);
      setFood(generateFood(newSnake));
      setSnake(newSnake);
    } else {
      newSnake.pop();
      setSnake(newSnake);
    }
  }, [snake, food, gameOver, isPaused, score, onScoreChange, generateFood]);

  useEffect(() => {
    const speed = Math.max(60, INITIAL_SPEED - Math.floor(score / 50) * 5);
    let timeoutId: number;
    if (!isPaused && !gameOver) {
      timeoutId = window.setTimeout(gameLoop, speed);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [gameLoop, isPaused, gameOver, score]);

  const finalAppleScale = Math.min(0.8 + Math.floor(applesEaten / 5) * 0.4, 2.5);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div 
        className="relative bg-black border-cyan-magenta overflow-hidden"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Food (Human Head) */}
        <div
          className="absolute transition-all duration-300 flex items-center justify-center"
          style={{
            width: '20px',
            height: '20px',
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
            transform: `scale(${finalAppleScale})`,
            zIndex: 5,
          }}
        >
          <svg viewBox="0 0 24 24" fill="#ff00ff" stroke="#00ffff" strokeWidth="1" className="w-full h-full drop-shadow-[2px_2px_0_#00ffff]">
             <path d="M12 2C8.69 2 6 4.69 6 8c0 2.82 1.95 5.18 4.58 5.82C7.4 14.45 5 17.04 5 20.5V22h14v-1.5c0-3.46-2.4-6.05-5.58-6.68C16.05 13.18 18 10.82 18 8c0-3.31-2.69-6-6-6z" />
          </svg>
        </div>

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const opacity = Math.max(0.3, 1 - (index / snake.length));
          const scale = isHead ? 1 : Math.max(0.6, 1 - (index / snake.length) * 0.4);
          
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-[#00ffff] z-10' : 'bg-[#008888]'}`}
              style={{
                width: '20px',
                height: '20px',
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
                transform: `scale(${scale})`,
                opacity: opacity,
                boxShadow: isHead ? '-2px 2px 0 #ff00ff' : 'none',
              }}
            />
          );
        })}

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff]">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-digital text-[#ff00ff] mb-2 font-bold uppercase tracking-widest">FATAL_ERROR</h2>
                <p className="text-xl text-[#00ffff] mb-6 font-cyber">ENTITY_TERMINATED</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-0 font-bold uppercase tracking-wider"
                >
                  <Power size={20} />
                  REBOOT_SEQUENCE
                </button>
                <p className="mt-4 text-sm text-[#ff00ff] font-cyber animate-pulse">PRESS [SPACE] OR [ENTER] TO REBOOT</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-digital text-[#00ffff] mb-6 font-bold uppercase tracking-widest">AWAITING_INPUT</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-black border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all duration-0 font-bold uppercase tracking-wider"
                >
                  <Terminal size={24} />
                  EXECUTE
                </button>
                <p className="mt-6 text-sm text-gray-500 font-cyber">INPUT: [W,A,S,D] OR [ARROWS]</p>
                <p className="mt-2 text-sm text-gray-500 font-cyber">INTERRUPT: [SPACE]</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
