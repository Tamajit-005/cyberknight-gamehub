import { Game } from "./Game";
import { PieceType, Color } from "./Piece";

export class SimulationGame extends Game {
  constructor(pieces: PieceType[] = [], turn: Color = "white") {
    super(pieces, turn);
  }

  override startNewGame(pieces: PieceType[], turn: Color): void {
    const cloned: PieceType[] = pieces.map((p) => ({ ...p }));
    super.startNewGame(cloned, turn);
  }

  override undo(): boolean {
    return false;
  }
}
