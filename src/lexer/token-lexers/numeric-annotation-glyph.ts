import { regexExecFrom } from "utilities/regexp-utilities";
import { Token } from "../token";
import { TokenType } from "../token-type";

export function isNumericAnnotationGlyph(pgn: string, index: number) {
    return pgn.charAt(index) === "$";
}

export function lexNumericAnnotationGlyph(pgn: string, index: number): { token: Token, nextIndex: number } {
    const regex = /\$(\d+)/y;
    const match = regexExecFrom(regex, pgn, index);
    if (!match) {
        throw new Error("NAG badly formed");
    }
    const nextIndex = match.index + match[0].length
    const token: Token = {
        tokenType: TokenType.NumericAnnotationGlyph,
        value: match[1]
    };
    return { token, nextIndex };
}