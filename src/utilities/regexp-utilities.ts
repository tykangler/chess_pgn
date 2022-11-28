export function regexExecFrom(regex: RegExp, s: string, from: number): RegExpExecArray | null {
    const match = regex.exec(s.slice(from));
    if (match == null) {
        return null;
    }
    match.index = match.index + from;
    return match;
}