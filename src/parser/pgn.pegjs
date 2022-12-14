{
	function parseInt(s) {
    	let val = +s;
        if (val) return val;
        else return null;
    }
}

Pgn = games:Game* { return games }

Game = tags:TagPair* "\n"* moves:MoveTextSection "\n"* {
	return { tags, moves }
}

// top level
TagPair = "[" WsOpt name:$([a-zA-Z]+) WsOpt '"' val:$([^"]+) '"' "]" "\n"+ {
    return { [name]: val };
}

MoveTextSection = moves:Move+ WsOpt { return moves }

// moves
Move = whiteMove:WhiteMove WsReq blackMove:BlackMove {
	return { 
      ...whiteMove,
      ...blackMove
    }
}

WhiteMove = preComment:Comment? WsOpt moveNumber:MoveNumberWhite WsOpt san:San postComment:(WsOpt MoveDetails)? {
	return { moveNumber, whiteMove: { preComment, ...san, postComment: postComment ? postComment[1] : null } }
}

BlackMove = moveNumber:MoveNumberBlack? WsOpt san:San postComment:(WsOpt Comment)? {
	return { blackMove: { postComment: postComment ? postComment[1] : null, ...san } }
}

MoveNumberWhite = num:$([1-9]+) "." { return num; }

MoveNumberBlack = num:$([1-9]+) "..." { return num; }

RecursiveVariation = "(" WsOpt moves:MoveTextSection WsOpt ")" { return moves; }

Comment = "{" comment:$([^}]*) "}" { return comment; }

Nag = "$" nag:$([1-9]) & { return arguments.length <= 3; } { return parseInt(nag); }

MoveDetails = details:(WsOpt (RecursiveVariation / Comment / Nag))* & { 
	let commentEncountered = false;
    let nagEncountered = false;
    for (let arg of arguments) {
    	if (typeof arg == "string") {
        	if (commentEncountered) { return false; }
            else { commentEncountered = true; }
        } else if (typeof arg == "number") {
        	if (nagEncountered) { return false; }
            else { nagEncountered = true; }
        }
    }
} { return details }

// san
San = 
basic:BasicSan promotedTo:Promotion? check:Check? {
	return { ...basic, promotedTo, check }	
}
/ piece:Piece rowDisc:[a-h] cap:"x"? basic:BasicSan check:Check? {
	return { ...basic, piece, rowDisc, capture: cap != null, check }
}
/ piece:Piece rowDisc:[a-h] colDisc:[1-8] cap:"x"? basic:BasicSan check:Check? {
	return { rowDisc, colDisc, capture: cap != null, ...basic, check }
}
/ piece:Piece colDisc:[1-8] cap:"x"? basic:BasicSan check:Check? {
	return { piece, colDisc, capture: cap != null, ...basic, check }
}
/ piece:Piece cap:"x"? basic:BasicSan check:Check? {
	return { piece, capture: cap != null, ...basic, check }
}
/ rowDisc:[a-h] cap:"x" basic:BasicSan promotedTo:Promotion? check:Check? {
	return { rowDisc, capture: true, ...basic, promotedTo, check }
}

BasicSan = row:[a-h] col:[1-8] {
	return { 
    	row, col
	}
}

Promotion = piece:("=" Piece) { return piece[1] }

Check = [+#]

Piece = [QBNRK]


WsOpt = " "*

WsReq = " "+