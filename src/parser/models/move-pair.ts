import { Move } from "./move";

export type MovePair = {
    moveNumber: number;
    whiteMove: Move;
    blackMove: Move;
    isMainline: boolean;

    previousMove: MovePair | null;
    nextMoves: MovePair[];
};