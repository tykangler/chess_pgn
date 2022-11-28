import { Token } from "lexer/token";
import { TokenType } from "lexer/token-type";
import { regexExecFrom } from "utilities/regexp-utilities";

const gameResults = [
    "1/2-1/2",
    "*",
    "0-1",
    "1-0"
]

export function isGameResult(pgn: string, index: number) {
    for (let result of gameResults) {
        if (pgn.indexOf(result, index) === index) {
            return true;
        }
    }
}

export function lexGameResult(pgn: string, index: number): { token: Token, nextIndex: number } {
    const regex = /1\/2-1\/2|\*|0-1|1-0/y;
    const match = regexExecFrom(regex, pgn, index);
    if (!match) {
        throw new Error("Game result badly formed");
    }
    const nextIndex = match.index + match[0].length;
    const token: Token = {
        tokenType: TokenType.GameResult,
        value: match[0]
    }
    return { token, nextIndex };
}