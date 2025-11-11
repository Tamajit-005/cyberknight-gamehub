import { PieceType } from "./Piece";

export interface SubStep {
  piece: PieceType;
  from: number;
  to: number;
  castling?: boolean;
}

export class History {
  private steps: SubStep[][] = [];
  private current: SubStep[] = [];

  add(step: SubStep): void {
    this.current.push(step);
  }

  save(): void {
    if (this.current.length) {
      this.steps.push([...this.current]);
      this.current = [];
    }
  }

  pop(): SubStep[] | undefined {
    return this.steps.pop();
  }
}
