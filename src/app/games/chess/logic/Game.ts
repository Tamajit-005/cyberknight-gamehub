// src/app/games/chess/logic/Game.ts
import { PieceType, changePosition, getAllowedMoves, Color } from "./Piece";
import { History, SubStep } from "./History";

export type EventName = "pieceMove" | "kill" | "check" | "promotion" | "checkMate" | "turnChange";

export type EventPayloads = {
  pieceMove: { piece: PieceType; from: number; to: number; castling?: boolean };
  kill: PieceType;
  check: Color;
  promotion: PieceType;
  checkMate: Color;
  turnChange: Color;
};

type EventHandler<K extends EventName> = (payload: EventPayloads[K]) => void;
type HistoryStep = SubStep | { from: number; to: number; piece: PieceType; castling?: boolean };

export class Game {
  pieces: PieceType[] = [];
  playerPieces: Record<Color, PieceType[]> = { white: [], black: [] };
  turn: Color = "white";
  clickedPiece: PieceType | null = null;
  history: History = new History();
  private events: { [K in EventName]: EventHandler<K>[] } = {
    pieceMove: [],
    kill: [],
    check: [],
    promotion: [],
    checkMate: [],
    turnChange: [],
  };

  constructor(initialPieces: PieceType[] = [], turn: Color = "white") {
    this.startNewGame(initialPieces, turn);
  }

  startNewGame(pieces: PieceType[], turn: Color): void {
    this._setPieces(pieces);
    this.turn = turn;
    this.clickedPiece = null;
    this.history = new History();
  }

  // ---------------- Event System ----------------
  on<K extends EventName>(event: K, handler: EventHandler<K>): void {
    this.events[event].push(handler);
  }

  protected trigger<K extends EventName>(event: K, payload: EventPayloads[K]): void {
    for (const fn of this.events[event]) fn(payload);
  }

  triggerEvent<K extends EventName>(eventName: K, params?: EventPayloads[K]): void {
    if (params !== undefined) this.trigger(eventName, params);
  }

  // ---------------- Piece Management ----------------
  private _setPieces(pieces: PieceType[]): void {
    this.pieces = pieces.map((p) => ({ ...p }));
    this.playerPieces = {
      white: this.pieces.filter((p) => p.color === "white"),
      black: this.pieces.filter((p) => p.color === "black"),
    };
  }

  private _removePiece(piece: PieceType): void {
    this.pieces = this.pieces.filter((p) => p !== piece);
    this.playerPieces[piece.color] = this.playerPieces[piece.color].filter((p) => p !== piece);
  }

  private _addPiece(piece: PieceType): void {
    this.pieces.push(piece);
    this.playerPieces[piece.color].push(piece);
  }

  addToHistory(step: HistoryStep): void {
    this.history.add(step as SubStep);
  }

  undo(): boolean {
    const step = this.history.pop();
    if (!step) return false;

    for (const sub of step) {
      changePosition(sub.piece, sub.from);
      if (sub.from !== 0) {
        if (sub.to === 0) this._addPiece(sub.piece);
        else if (sub.castling) sub.piece.ableToCastle = true;
        this.trigger("pieceMove", { piece: sub.piece, from: sub.to, to: sub.from, castling: sub.castling });
      } else {
        this._removePiece(sub.piece);
        this.trigger("kill", sub.piece);
      }

      if (sub.from !== 0 && sub.to !== 0 && (!sub.castling || sub.piece.rank === "king")) {
        this.softChangeTurn();
      }
    }
    return true;
  }

  softChangeTurn(): void {
    this.turn = this.turn === "white" ? "black" : "white";
    this.trigger("turnChange", this.turn);
  }

  changeTurn(): void {
    this.softChangeTurn();
    this.history.save();
  }

  getPieceByName(name: string): PieceType | undefined {
    return this.pieces.find((p) => p.name === name);
  }

  getPieceByPos(pos: number): PieceType | undefined {
    return this.pieces.find((p) => p.position === pos);
  }

  getPiecesByColor(color: Color): PieceType[] {
    return this.playerPieces[color];
  }

  getPlayerPositions(color: Color): number[] {
    return this.getPiecesByColor(color).map((p) => p.position);
  }

  positionHasExistingPiece(position: number): boolean {
    return !!this.getPieceByPos(position);
  }

  // ---------------- Move Validation ----------------
  unblockedPositions(piece: PieceType, allowedPositions: number[][], checking = true): number[] {
    const valid: number[] = [];
    const myColor = piece.color;
    const enemyColor = myColor === "white" ? "black" : "white";
    const myBlocked = this.getPlayerPositions(myColor);
    const enemyBlocked = this.getPlayerPositions(enemyColor);

    if (piece.rank === "pawn") {
      for (const move of allowedPositions[0]) {
        if (checking && this.myKingChecked(move)) continue;
        if (enemyBlocked.includes(move)) valid.push(move);
      }
      for (const move of allowedPositions[1]) {
        if (myBlocked.includes(move) || enemyBlocked.includes(move)) break;
        if (checking && this.myKingChecked(move, false)) continue;
        valid.push(move);
      }
    } else {
      for (const group of allowedPositions) {
        for (const move of group) {
          if (myBlocked.includes(move)) break;
          if (checking && this.myKingChecked(move)) {
            if (enemyBlocked.includes(move)) break;
            continue;
          }
          valid.push(move);
          if (enemyBlocked.includes(move)) break;
        }
      }
    }
    return valid.filter((pos) => pos > 10 && pos < 89 && pos % 10 !== 9 && pos % 10 !== 0);
  }

  getPieceAllowedMoves(name: string): number[] {
    const piece = this.getPieceByName(name);
    if (!piece || this.turn !== piece.color) return [];
    this.setClickedPiece(piece);

    let moves = getAllowedMoves(piece);
    if (piece.rank === "king") moves = this.getCastlingSquares(piece, moves);
    return this.unblockedPositions(piece, moves, true);
  }

  getCastlingSquares(king: PieceType, allowed: number[][]): number[][] {
    if (!king.ableToCastle || this.king_checked(this.turn)) return allowed;

    const rook1 = this.getPieceByName(this.turn + "Rook1");
    const rook2 = this.getPieceByName(this.turn + "Rook2");

    if (rook1?.ableToCastle) {
      const pos = rook1.position + 2;
      if (
        !this.positionHasExistingPiece(pos - 1) &&
        !this.positionHasExistingPiece(pos) &&
        !this.myKingChecked(pos) &&
        !this.positionHasExistingPiece(pos + 1) &&
        !this.myKingChecked(pos + 1)
      )
        allowed[1].push(pos);
    }

    if (rook2?.ableToCastle) {
      const pos = rook2.position - 1;
      if (
        !this.positionHasExistingPiece(pos - 1) &&
        !this.myKingChecked(pos - 1) &&
        !this.positionHasExistingPiece(pos) &&
        !this.myKingChecked(pos)
      )
        allowed[0].push(pos);
    }

    return allowed;
  }

  setClickedPiece(piece: PieceType | null): void {
    this.clickedPiece = piece;
  }

  // ---------------- Move Execution ----------------
  movePiece(name: string, pos: number): boolean {
    const piece = this.getPieceByName(name);
    if (!piece) return false;

    if (!this.getPieceAllowedMoves(piece.name).includes(pos)) return false;

    const prev = piece.position;
    const target = this.getPieceByPos(pos);
    if (target) this.kill(target);

    const castling = !target && piece.rank === "king" && piece.ableToCastle === true;
    if (castling) {
      if (pos - prev === 2) this.castleRook(piece.color + "Rook2");
      else if (pos - prev === -2) this.castleRook(piece.color + "Rook1");
      changePosition(piece, pos, true);
    } else changePosition(piece, pos);

    const move = { from: prev, to: pos, piece, castling };
    this.addToHistory(move);
    this.trigger("pieceMove", move);

    if (piece.rank === "pawn" && (pos > 80 || pos < 20)) this.promote(piece);
    this.changeTurn();

    if (this.king_checked(this.turn)) {
      this.trigger("check", this.turn);
      if (this.king_dead(this.turn)) this.checkmate(piece.color);
    }

    return true;
  }

  kill(piece: PieceType): void {
    this._removePiece(piece);
    this.addToHistory({ from: piece.position, to: 0, piece });
    this.trigger("kill", piece);
  }

  promote(pawn: PieceType): void {
    pawn.rank = "queen";
    pawn.name = pawn.name.replace("Pawn", "Queen");
    this.addToHistory({ from: 0, to: pawn.position, piece: pawn });
    this.trigger("promotion", pawn);
  }

  castleRook(name: string): void {
    const rook = this.getPieceByName(name);
    if (!rook) return;
    const prev = rook.position;
    const newPos = name.includes("Rook2") ? rook.position - 2 : rook.position + 3;
    changePosition(rook, newPos);
    const move = { from: prev, to: newPos, piece: rook, castling: true };
    this.trigger("pieceMove", move);
    this.addToHistory(move);
  }

  myKingChecked(pos: number, kill = true): number {
    const piece = this.clickedPiece;
    if (!piece) return 0;

    const prevPos = piece.position;
    const victim = this.getPieceByPos(pos);
    const willKill = kill && victim && victim.rank !== "king";

    changePosition(piece, pos);
    if (willKill) this._removePiece(victim);

    const isChecked = this.king_checked(piece.color);
    changePosition(piece, prevPos);
    if (willKill) this._addPiece(victim);

    return isChecked;
  }

  // ---------------- King & Check Logic ----------------
  king_checked(color: Color): number {
    const king = this.getPieceByName(color + "King");
    if (!king) return 1; // Defensive guard for simulation states

    const enemies = this.getPiecesByColor(color === "white" ? "black" : "white");
    for (const enemy of enemies) {
      this.setClickedPiece(enemy);
      const moves = this.unblockedPositions(enemy, getAllowedMoves(enemy), false);
      if (moves.includes(king.position)) {
        this.setClickedPiece(null);
        return 1;
      }
    }
    this.setClickedPiece(null);
    return 0;
  }

  king_dead(color: Color): number {
    const pieces = this.getPiecesByColor(color);
    for (const piece of pieces) {
      this.setClickedPiece(piece);
      const moves = this.unblockedPositions(piece, getAllowedMoves(piece), true);
      if (moves.length) {
        this.setClickedPiece(null);
        return 0;
      }
    }
    this.setClickedPiece(null);
    return 1;
  }

  checkmate(color: Color): void {
    this.trigger("checkMate", color);
  }
}
