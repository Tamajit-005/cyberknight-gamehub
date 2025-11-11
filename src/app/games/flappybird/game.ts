export function initFlappyBird(canvas: HTMLCanvasElement) {
  // ✅ Non-null assertion — safe because we only call this when canvasRef.current exists
  const ctx = canvas.getContext("2d")!;
  const boardWidth = canvas.width;
  const boardHeight = canvas.height;

  // --- Game constants ---
  const birdX = boardWidth / 8;
  let birdY = boardHeight / 2;
  const birdWidth = 34;
  const birdHeight = 24;

  const velocityX = -2.5; // pipe movement speed
  let velocityY = 0;
  const gravity = 0.4;

  interface Pipe {
    x: number;
    y: number;
    width: number;
    height: number;
    passed: boolean;
  }

  const pipes: Pipe[] = [];
  let score = 0;
  let gameOver = false;
  let frame = 0;

  // --- Utility: preload images before game starts ---
  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(`Failed to load: ${src}`);
    });

  Promise.all([
    loadImage("/games/flappybird/assets/background.png"),
    loadImage("/games/flappybird/assets/flappy.png"),
    loadImage("/games/flappybird/assets/pipe.png"),
  ])
    .then(([bg, birdImg, pipeImg]) => startGame(bg, birdImg, pipeImg))
    .catch((err) => console.error("Image loading error:", err));

  // --- Core game logic ---
  function startGame(
    bg: HTMLImageElement,
    birdImg: HTMLImageElement,
    pipeImg: HTMLImageElement
  ) {
    // Flap (jump)
    function flap(): void {
      if (gameOver) {
        resetGame();
        return;
      }
      velocityY = -7;
    }

    // Event listeners
    canvas.addEventListener("click", flap);
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") flap();
    });

    // Place a pair of pipes
    function placePipes(): void {
      const pipeWidth = 64;
      const pipeHeight = 512;
      const openingSpace = boardHeight / 4;

      const randomPipeY =
        -pipeHeight / 4 - Math.random() * (pipeHeight / 2);

      // Top pipe
      pipes.push({
        x: boardWidth,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
      });

      // Bottom pipe
      pipes.push({
        x: boardWidth,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
      });
    }

    // Collision detection
    function collision(
      bird: { x: number; y: number; width: number; height: number },
      pipe: Pipe
    ): boolean {
      return (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
      );
    }

    // Reset the game after death
    function resetGame(): void {
      pipes.length = 0;
      score = 0;
      birdY = boardHeight / 2;
      velocityY = 0;
      frame = 0;
      gameOver = false;
      update();
    }

    // --- Game Loop ---
    function update(): void {
      frame++;

      // Background
      ctx.drawImage(bg, 0, 0, boardWidth, boardHeight);

      // Gravity + bird physics
      velocityY += gravity;
      birdY += velocityY;
      birdY = Math.max(birdY, 0); // prevent flying above screen

      // Spawn pipes periodically
      if (frame % 100 === 0) placePipes();

      // Move & draw pipes
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.x += velocityX;

        ctx.drawImage(pipeImg, pipe.x, pipe.y, pipe.width, pipe.height);

        // Score update (two pipes per point)
        if (!pipe.passed && birdX > pipe.x + pipe.width) {
          score += 0.5;
          pipe.passed = true;
        }

        // Collision
        if (
          collision(
            { x: birdX, y: birdY, width: birdWidth, height: birdHeight },
            pipe
          )
        ) {
          gameOver = true;
        }
      }

      // Remove old pipes
      while (pipes.length > 0 && pipes[0].x + pipes[0].width < 0) {
        pipes.shift();
      }

      // Draw bird
      ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

      // Display score
      ctx.fillStyle = "white";
      ctx.font = "28px Arial";
      if (gameOver) {
        ctx.fillText(`Game Over: ${Math.floor(score)}`, 10, 40);
      } else {
        ctx.fillText(`${Math.floor(score)}`, 10, 40);
      }

      // Ground collision
      if (birdY + birdHeight >= boardHeight) {
        gameOver = true;
      }

      // Game over overlay
      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, boardWidth, boardHeight);
        ctx.fillStyle = "#fff";
        ctx.font = "24px monospace";
        ctx.fillText("Game Over", boardWidth / 2 - 70, boardHeight / 2 - 20);
        ctx.font = "16px monospace";
        ctx.fillText(
          "Click or press SPACE to restart",
          boardWidth / 2 - 150,
          boardHeight / 2 + 10
        );
        return;
      }

      requestAnimationFrame(update);
    }

    update();
  }
}
