export type Color = "white" | "black";

export interface PieceType {
  rank: "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
  position: number;
  color: Color;
  name: string;
  ableToCastle?: boolean;
}

export const changePosition = (piece: PieceType, position: number, castle = false): void => {
  piece.position = position;
  if (piece.rank === "king" && castle) piece.ableToCastle = false;
  if (piece.rank === "rook") piece.ableToCastle = false;
};

const linearMoves = (start: number, step: number): number[] => {
  const moves: number[] = [];
  for (let move = start + step; move <= 88 && move >= 11; move += step) {
    const col = move % 10;
    if (col === 0 || col === 9) break;
    moves.push(move);
  }
  return moves;
};

export const getAllowedMoves = (piece: PieceType): number[][] => {
  const pos = piece.position;
  switch (piece.rank) {
    case "pawn": {
      const dir = piece.color === "white" ? 1 : -1;
      const attacks = [pos + dir * 9, pos + dir * 11];
      const moves = [pos + dir * 10];
      const startRow = piece.color === "white" ? 20 : 70;
      if (pos > startRow && pos < startRow + 9) moves.push(pos + dir * 20);
      return [attacks, moves];
    }
    case "knight":
      return [
        [pos + 21], [pos - 21], [pos + 19], [pos - 19],
        [pos + 12], [pos - 12], [pos + 8], [pos - 8],
      ];
    case "bishop":
      return [linearMoves(pos, 11), linearMoves(pos, 9), linearMoves(pos, -9), linearMoves(pos, -11)];
    case "rook":
      return [linearMoves(pos, 10), linearMoves(pos, -10), linearMoves(pos, 1), linearMoves(pos, -1)];
    case "queen":
      return [
        ...getAllowedMoves({ ...piece, rank: "rook" }),
        ...getAllowedMoves({ ...piece, rank: "bishop" }),
      ];
    case "king":
      return [
        [pos + 1], [pos - 1], [pos + 10], [pos - 10],
        [pos + 11], [pos - 11], [pos + 9], [pos - 9],
      ];
    default:
      return [];
  }
};
