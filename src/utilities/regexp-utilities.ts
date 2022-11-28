export function regexExecFrom(regex: RegExp, s: string, from: number): RegExpExecArray | null {
    regex.lastIndex = from;
    return regex.exec(s);
}