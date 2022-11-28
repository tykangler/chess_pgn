import { Token } from "../token";
import { TokenType } from "../token-type";

export function isStartVariation(pgn: string, index: number) {
    return pgn.charAt(index) === "(";
}

export function lexStartVariation(pgn: string, index: number): { token: Token, nextIndex: number } {
    const token: Token = {
        tokenType: TokenType.StartVariation,
        value: pgn.charAt(index)
    };
    const nextIndex = index + 1;
    return { token, nextIndex };
}