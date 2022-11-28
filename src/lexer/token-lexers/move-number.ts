import { regexExecFrom } from "utilities/regexp-utilities";
import { Token } from "../token";
import { TokenType } from "../token-type";

function isNumber(s: string) {
    return s >= '0' && s <= '9';
}

export function isMoveNumber(pgn: string, index: number): boolean {
    return isNumber(pgn.charAt(index)) &&
        (isNumber(pgn.charAt(index + 1)) || pgn.charAt(index + 1) === '.');
}

export function lexMoveNumber(pgn: string, startIndex: number): { token: Token, nextIndex: number } {
    const regex = /(\d+)(\.{1,3})/y
    const match = regexExecFrom(regex, pgn, startIndex);
    if (!match) {
        throw new Error("Move number badly formed");
    }
    const nextIndex = match.index + match[0].length;
    const moveNumber = match[1];
    const tokenType = match[2].length === 1 ?
        TokenType.MoveNumberWhite : TokenType.MoveNumberBlack; // 1. e4 vs 1... e5
    const token: Token = { tokenType, value: moveNumber };
    return { token, nextIndex };
}