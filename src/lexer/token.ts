import { TokenType } from "./token-type"

export type Token = {
    tokenType: TokenType;
    value: string;
}