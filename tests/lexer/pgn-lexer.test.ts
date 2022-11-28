import { lexPGN } from "lexer/pgn-lexer"
import { Token } from "lexer/token";
import { TokenType } from "lexer/token-type";

describe("PGN Lexer correctly lexes given well-formed and malformed inputs", () => {
    test("With only moves", () => {
        const pgn: string = "1. e4 e5 2. Nf3 Nc6 3. Nc3 Bc5 *";
        const tokens = [...lexPGN(pgn)];
        expect(tokens).toHaveLength(10);
        tokensMatch(tokens, [
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e4"
            },
            {
                tokenType: TokenType.Move,
                value: "e5"
            },
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "2"
            },
            {
                tokenType: TokenType.Move,
                value: "Nf3"
            },
            {
                tokenType: TokenType.Move,
                value: "Nc6"
            },
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "3"
            },
            {
                tokenType: TokenType.Move,
                value: "Nc3"
            },
            {
                tokenType: TokenType.Move,
                value: "Bc5"
            },
            {
                tokenType: TokenType.GameResult,
                value: "*"
            }
        ]);
    });

    test("With annotations", () => {
        const pgn: string = "1. e4 e5 {Hello World} 2. d4 d5 {Annotation} *";
        const tokens = [...lexPGN(pgn)];
        expect(tokens).toHaveLength(9);
        tokensMatch(tokens, [
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e4"
            },
            {
                tokenType: TokenType.Move,
                value: "e5"
            },
            {
                tokenType: TokenType.Annotation,
                value: "Hello World"
            },
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "2"
            },
            {
                tokenType: TokenType.Move,
                value: "d4"
            },
            {
                tokenType: TokenType.Move,
                value: "d5"
            },
            {
                tokenType: TokenType.Annotation,
                value: "Annotation"
            },
            {
                tokenType: TokenType.GameResult,
                value: "*"
            }
        ])
    });

    test("Escaped annotations in between moves should replace backslash", () => {
        const pgn: string = "1. e4 {Hello \\} World} 1... e5 *";
        const tokens = [...lexPGN(pgn)];
        expect(tokens).toHaveLength(6);
        tokensMatch(tokens, [
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e4"
            },
            {
                tokenType: TokenType.Annotation,
                value: "Hello } World"
            },
            {
                tokenType: TokenType.MoveNumberBlack,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e5"
            },
            {
                tokenType: TokenType.GameResult,
                value: "*"
            }
        ]);
    });

    test("With variations", () => {
        const pgn: string = "1. e4 (1. d4 d5) 1... e5 *";
        const tokens = [...lexPGN(pgn)];
        expect(tokens).toHaveLength(10);
        tokensMatch(tokens, [
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e4"
            },
            {
                tokenType: TokenType.StartVariation,
                value: "("
            },
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "d4"
            },
            {
                tokenType: TokenType.Move,
                value: "d5"
            },
            {
                tokenType: TokenType.EndVariation,
                value: ")"
            },
            {
                tokenType: TokenType.MoveNumberBlack,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e5"
            },
            {
                tokenType: TokenType.GameResult,
                value: "*"
            }
        ]);
    });

    test("With numeric annotation glyphs", () => {
        const pgn: string = "1. e4 $25 1... e5 (1... Nc6)";
        const tokens = [...lexPGN(pgn)];
        expect(tokens).toHaveLength(9);
        tokensMatch(tokens, [
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e4"
            },
            {
                tokenType: TokenType.NumericAnnotationGlyph,
                value: "25"
            },
            {
                tokenType: TokenType.MoveNumberBlack,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e5"
            },
            {
                tokenType: TokenType.StartVariation,
                value: "("
            },
            {
                tokenType: TokenType.MoveNumberBlack,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "Nc6"
            },
            {
                tokenType: TokenType.EndVariation,
                value: ")"
            }
        ]);
    });

    test("With minimal spaces, still lexes correctly", () => {
        const pgn: string = "1.e4 e5(1...c6{Annotation})";
        const tokens = [...lexPGN(pgn)];
        expect(tokens).toHaveLength(8);
        tokensMatch(tokens, [
            {
                tokenType: TokenType.MoveNumberWhite,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "e4"
            },
            {
                tokenType: TokenType.Move,
                value: "e5"
            },
            {
                tokenType: TokenType.StartVariation,
                value: "("
            },
            {
                tokenType: TokenType.MoveNumberBlack,
                value: "1"
            },
            {
                tokenType: TokenType.Move,
                value: "c6"
            },
            {
                tokenType: TokenType.Annotation,
                value: "Annotation"
            },
            {
                tokenType: TokenType.EndVariation,
                value: ")"
            }
        ]);
    });

    test("With extra spaces, still lexes correctly", () => {
        const pgn: string = "1.     e4 e5  {Annotation}    2. d4    1/2-1/2";
        const tokens = [...lexPGN(pgn)];
        expect(tokens).toHaveLength(7);
    })
});

function tokensMatch(tokens: Token[], expected: Token[]) {
    for (let i = 0; i < tokens.length; ++i) {
        expect(tokens[i]).toEqual(expected[i]);
    }
}