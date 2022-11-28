import { regexExecFrom } from "utilities/regexp-utilities";
import { Token } from "../token";
import { TokenType } from "../token-type";

export function isAnnotation(pgn: string, index: number) {
    return pgn.charAt(index) === "{";
}

export function lexAnnotation(pgn: string, index: number): { token: Token, nextIndex: number } {
    const regex = /{(.*?)(?<!\\)}/y;
    const match = regexExecFrom(regex, pgn, index);
    if (!match) {
        throw new Error("Annotation badly formed");
    }
    const nextIndex = match.index + match[0].length;
    const token: Token = { tokenType: TokenType.Annotation, value: match[1].replace("\\}", '}') };
    return { token, nextIndex };
}