"use client";
import { useEffect, useState } from "react";
import { Game } from "../logic/Game";
import { PieceType } from "../logic/Piece";
import Image from "next/image";

const initialPieces: PieceType[] = [
  {
    rank: "rook",
    position: 11,
    color: "white",
    name: "whiteRook1",
    ableToCastle: true,
  },
  { rank: "knight", position: 12, color: "white", name: "whiteKnight1" },
  { rank: "bishop", position: 13, color: "white", name: "whiteBishop1" },
  { rank: "queen", position: 14, color: "white", name: "whiteQueen" },
  {
    rank: "king",
    position: 15,
    color: "white",
    name: "whiteKing",
    ableToCastle: true,
  },
  { rank: "bishop", position: 16, color: "white", name: "whiteBishop2" },
  { rank: "knight", position: 17, color: "white", name: "whiteKnight2" },
  {
    rank: "rook",
    position: 18,
    color: "white",
    name: "whiteRook2",
    ableToCastle: true,
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    rank: "pawn" as const,
    position: 21 + i,
    color: "white" as const,
    name: `whitePawn${i + 1}`,
  })),
  {
    rank: "rook",
    position: 81,
    color: "black",
    name: "blackRook1",
    ableToCastle: true,
  },
  { rank: "knight", position: 82, color: "black", name: "blackKnight1" },
  { rank: "bishop", position: 83, color: "black", name: "blackBishop1" },
  { rank: "queen", position: 84, color: "black", name: "blackQueen" },
  {
    rank: "king",
    position: 85,
    color: "black",
    name: "blackKing",
    ableToCastle: true,
  },
  { rank: "bishop", position: 86, color: "black", name: "blackBishop2" },
  { rank: "knight", position: 87, color: "black", name: "blackKnight2" },
  {
    rank: "rook",
    position: 88,
    color: "black",
    name: "blackRook2",
    ableToCastle: true,
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    rank: "pawn" as const,
    position: 71 + i,
    color: "black" as const,
    name: `blackPawn${i + 1}`,
  })),
];

export default function ChessBoard() {
  const [game] = useState(() => new Game(initialPieces, "white"));
  const [pieces, setPieces] = useState<PieceType[]>(game.pieces.slice());
  const [turn, setTurn] = useState<"white" | "black">(game.turn);
  const [lastMove, setLastMove] = useState<number[]>([]);
  const [status, setStatus] = useState("White to move");
  const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);
  const [captured, setCaptured] = useState<{
    white: PieceType[];
    black: PieceType[];
  }>({
    white: [],
    black: [],
  });

  useEffect(() => {
    game.on("pieceMove", ({ from, to }) => {
      setPieces([...game.pieces]);
      setLastMove([from, to]);
      setSelectedPiece(null);
    });

    game.on("turnChange", (color) => {
      setTurn(color);
      setStatus(`${color[0].toUpperCase() + color.slice(1)} to move`);
    });

    game.on("check", (color) => setStatus(`${color} is in check`));
    game.on("checkMate", (color) => setStatus(`${color} is checkmated`));

    game.on("kill", (piece) => {
      setCaptured((prev) => ({
        ...prev,
        [piece.color === "white" ? "black" : "white"]: [
          ...prev[piece.color === "white" ? "black" : "white"],
          piece,
        ],
      }));
    });
  }, [game]);

  const handleSquareClick = (pos: number) => {
    const piece = game.getPieceByPos(pos);
    if (piece && piece.color === game.turn) {
      setSelectedPiece(piece);
      game.setClickedPiece(piece);
      return;
    }

    if (selectedPiece) {
      const ok = game.movePiece(selectedPiece.name, pos);
      if (!ok) setStatus("Invalid move");
      setSelectedPiece(null);
    }
  };

  const undo = () => {
    if (game.undo()) {
      setPieces([...game.pieces]);
      setStatus(`${game.turn[0].toUpperCase() + game.turn.slice(1)} to move`);
      setLastMove([]);
    }
  };

  const imgPath = (p: PieceType) =>
    `/games/chess/assets/${p.color}-${p.rank}.webp`;
  const darkTile = "#4b5e3c";
  const lightTile = "#e6e6d2";

  return (
    <div className="flex flex-col items-center text-white">
      {/* --- Top sematary (captured by white) --- */}
      <div className="flex flex-wrap justify-center items-center bg-slate-800 rounded-t-md w-[min(90vw,520px)] py-1 shadow-inner">
        {captured.white.map((p) => (
          <Image
            key={p.name}
            src={imgPath(p)}
            alt={p.rank}
            width={40}
            height={40}
            className="w-7 h-7 md:w-9 md:h-9 mx-0.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.6)]"
            draggable={false}
            priority
          />
        ))}
      </div>

      {/* --- Board --- */}
      <div
        className="grid grid-cols-8 border-8 border-slate-700 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        style={{
          width: "min(90vw, 520px)",
          aspectRatio: "1 / 1",
          backgroundColor: "#1e293b",
        }}
      >
        {[...Array(8)].map((_, r) =>
          [...Array(8)].map((_, c) => {
            const id = (8 - r) * 10 + (c + 1);
            const piece = pieces.find((p) => p.position === id);
            const isDark = (r + c) % 2 === 1;
            const highlight = lastMove.includes(id);
            const isSelected = selectedPiece?.position === id;
            const bg = isSelected
              ? "#facc15"
              : highlight
              ? "#eab30888"
              : isDark
              ? darkTile
              : lightTile;

            return (
              <div
                key={id}
                onClick={() => handleSquareClick(id)}
                className="flex items-center justify-center cursor-pointer select-none aspect-square"
                style={{ backgroundColor: bg }}
              >
                {piece && (
                  <Image
                    src={imgPath(piece)}
                    alt={piece.rank}
                    width={80}
                    height={80}
                    draggable={false}
                    className={`w-[80%] h-[80%] ${
                      piece.color === "black"
                        ? "drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]"
                        : ""
                    }`}
                    priority
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- Bottom sematary (captured by black) --- */}
      <div className="flex flex-wrap justify-center items-center bg-slate-800 rounded-b-md w-[min(90vw,520px)] py-1 mt-1 shadow-inner">
        {captured.black.map((p) => (
          <Image
            key={p.name}
            src={imgPath(p)}
            alt={p.rank}
            width={40}
            height={40}
            className="w-7 h-7 md:w-9 md:h-9 mx-0.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.6)]"
            draggable={false}
            priority
          />
        ))}
      </div>

      {/* --- Controls --- */}
      <div className="flex items-center gap-4 mt-4">
        <p className="text-gray-400">
          Turn: <span className="font-semibold">{turn.toUpperCase()}</span>
        </p>
        <button
          onClick={undo}
          className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          Undo
        </button>
      </div>

      <p className="mt-3 text-gray-400 text-sm text-center">{status}</p>
    </div>
  );
}
