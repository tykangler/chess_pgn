import { lexPGN } from "lexer/pgn-lexer";
import { Token } from "lexer/token";
import { TokenType } from "lexer/token-type";
import { Move } from "./models/move";
import { MovePair } from "./models/move-pair";

export function parsePGN(pgn: string) {
    let tokens = lexPGN(pgn);
    const root: MovePair = descentParsePGN(tokens, 0, true);
}

function descentParsePGN(tokens: Iterable<Token>, moveNumber: number, isMainline: boolean, currentWhiteMove?: Move, previousMove?: MovePair): MovePair {
    let root: MovePair | null = null;
    let currentMovePair: MovePair | null = null;
    let readWhiteObject: boolean = false;
    let whiteMoveRead: boolean = false;
    let readBlackObject: boolean = false;
    let blackMoveRead: boolean = false;
    let currentMoveNumber: number = 0;
    let whiteMove: Move = { move: "" };
    let blackMove: Move = { move: "" };
    for (let token of tokens) {
        switch (token.tokenType) {
            case TokenType.Annotation:
                break;
            case TokenType.NumericAnnotationGlyph:
                break;
            case TokenType.StartVariation:
                break;
            case TokenType.EndVariation:
                break;
            case TokenType.MoveNumberBlack:
                break;
            case TokenType.MoveNumberWhite:
                currentMoveNumber = parseInt(token.value);
                readWhiteObject = true;
                break;
            case TokenType.Move:
                break;
            case TokenType.GameResult:
                break;
        }
    }
}

