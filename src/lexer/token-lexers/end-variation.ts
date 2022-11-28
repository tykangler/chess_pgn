import { Token } from "../token";
import { TokenType } from "../token-type";

export function isEndVariation(pgn: string, index: number) {
    return pgn.charAt(index) === ")";
}

export function lexEndVariation(pgn: string, index: number) {
    const token: Token = {
        tokenType: TokenType.EndVariation,
        value: pgn.charAt(index)
    };
    const nextIndex = index + 1;
    return { token, nextIndex };
}