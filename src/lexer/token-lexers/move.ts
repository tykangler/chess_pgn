import { StateMachine } from "state-machine/state-machine";
import { Transition } from "state-machine/transition";
import { regexExecFrom } from "utilities/regexp-utilities";
import { Token } from "../token";
import { TokenType } from "../token-type";

export function isMove(pgn: string, index: number) {
    return /^[a-hRNBQKO]+$/.test(pgn.charAt(index));
}

// I had considered using a state machine to validate. But honestly the regex works fine. The state machine is overkill.
export function lexMove(pgn: string, index: number): { token: Token, nextIndex: number } {
    const regex = /[RNBQK]?[a-h]?[1-8]?x?(?<!^(?:K?[a-h1-8]|[1-8]?x))[a-h][1-8](?:(?<![RNBQK1-7].*)=[RNBQK])?[+#]?|O-O(?:-O)?[+#]?/y;
    const match = regexExecFrom(regex, pgn, index);
    if (!match) {
        throw new Error("Move badly formed");
    }
    let nextIndex = match.index + match[0].length;
    const token: Token = { tokenType: TokenType.Move, value: match[0] };
    return { token, nextIndex };
}
