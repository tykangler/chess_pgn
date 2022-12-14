import { Token } from "./token";
import { isMoveNumber, lexMoveNumber } from "./token-lexers/move-number";
import { isAnnotation, lexAnnotation } from "./token-lexers/annotation";
import { isMove, lexMove } from "./token-lexers/move";
import { isStartVariation, lexStartVariation } from "./token-lexers/start-variation";
import { isEndVariation, lexEndVariation } from "./token-lexers/end-variation";
import { isNumericAnnotationGlyph, lexNumericAnnotationGlyph } from "./token-lexers/numeric-annotation-glyph";
import { isGameResult, lexGameResult } from "./token-lexers/game-result";

export function* lexPGN(pgn: string): Generator<Token, null> {
    let currentIndex: number = 0;
    while (currentIndex < pgn.length) {
        if (isMoveNumber(pgn, currentIndex)) {
            const { token, nextIndex } = lexMoveNumber(pgn, currentIndex);
            currentIndex = nextIndex;
            yield token;
        } else if (isAnnotation(pgn, currentIndex)) {
            const { token, nextIndex } = lexAnnotation(pgn, currentIndex);
            currentIndex = nextIndex;
            yield token;
        } else if (isMove(pgn, currentIndex)) {
            const { token, nextIndex } = lexMove(pgn, currentIndex); 
            currentIndex = nextIndex;
            yield token;
        } else if (isStartVariation(pgn, currentIndex)) {
            const { token, nextIndex } = lexStartVariation(pgn, currentIndex);
            currentIndex = nextIndex;
            yield token;
        } else if (isEndVariation(pgn, currentIndex)) {
            const { token, nextIndex } = lexEndVariation(pgn, currentIndex);
            currentIndex = nextIndex;
            yield token;
        } else if (isNumericAnnotationGlyph(pgn, currentIndex)) {
            const { token, nextIndex } = lexNumericAnnotationGlyph(pgn, currentIndex);
            currentIndex = nextIndex;
            yield token;
        } else if (isGameResult(pgn, currentIndex)) {
            const { token, nextIndex } = lexGameResult(pgn, currentIndex);
            currentIndex = nextIndex;
            yield token;
        } else if (pgn.charAt(currentIndex) === " ") {
            currentIndex = advanceToNonWhitespace(pgn, currentIndex);
        } else {
            throw new Error(`PGN badly formed at col ${currentIndex}: ${pgn[currentIndex]}`);
        } 
    }
    return null;
}

function advanceToNonWhitespace(pgn: string, index: number) {
    while (!pgn.charAt(index).trim() && index < pgn.length) {
        index++;
    }
    return index;
}