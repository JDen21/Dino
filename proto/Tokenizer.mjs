// TODO TOKENIZER ERROR HANDLER
// TODO NEGATIVE NUMBER
// TODO FUNCTION CALL

export class Token {
  value;
  ttype;

  constructor(value, ttype) {
    this.value = value;
    this.ttype = ttype;
  }
}

export const Token_Types = Object.entries([
  "NONE", // get_type(0)
  "ENDLINE", // get_type(1)
  "NUMBER", // get_type(2)
  "ADD", // get_type(3)
  "SUBTRACT", // get_type(4)
  "MULTIPLY", // get_type(5)
  "DIVIDE", // get_type(6)
  "OPEN_PAREN", // get_type(7)
  "CLOSE_PAREN", // get_type(8)
  "ASSIGNMENT", // 9
  "IDENTIFIER", // 10
  "LET", // 11
]);

export default function tokenize(program) {
  const tokens = [];
  const chars = program.toString().split("");
  let curr_token = new Token("", get_ttype(0));

  for (const char of chars) {
    switch (char) {
      default:
        throw new Error("Invalid Character input.");
      case ' ':
      case '\n': {
        break;
      }
        case "=": {
        switch (curr_token.ttype) {
          case get_ttype(0):
          case get_ttype(1):
          case get_ttype(2):
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7):
          case get_ttype(8):
          case get_ttype(9): {
            throw new Error(`Invalid Token Position. ${char}`);
          }
          // x=
          case get_ttype(10): {
            push_tok(new Token(char, get_ttype(9)));
            break;
          }
          case get_ttype(11): {
            throw new Error(`Invalid Token Position. ${char}`);
          }
        }
        break;
      }
      case ";": {
        switch (curr_token.ttype) {
          // ;
          case get_ttype(0): {
            update_curr_tok(char, get_ttype(1));
            break;
          }
          // ;; 1;
          case get_ttype(1):
          case get_ttype(2): {
            push_tok(new Token(char, get_ttype(1)));
            break;
          }
          // +; -; *; /; (;
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            throw new Error("Invalid Operand found.");
          }
          // );
          case get_ttype(8): {
            push_tok(new Token(";", get_ttype(1)));
            break;
          }
          // =;
          case get_ttype(9): {
            throw new Error("Invalid Assignment found.");
          }
          // x;
          case get_ttype(10): {
            push_tok(new Token(";", get_ttype(1)));
            break;
          }
          // let;
          case get_ttype(11): {
            throw new Error('Invalid Identifier.');
          }
        }
        break;
      }
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": {
        switch (curr_token.ttype) {
          // 1
          case get_ttype(0): {
            update_curr_tok(char, get_ttype(2));
            break;
          }
          // ;1
          case get_ttype(1): {
            push_tok(new Token(char, get_ttype(2)));
            break;
          }
          // 11
          case get_ttype(2): {
            update_curr_tok(char);
            break;
          }
          // +1 -1 *1 /1 (1
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            push_tok(new Token(char, get_ttype(2)));
            break;
          }
          // )1
          case get_ttype(8): {
            throw new Error("Invalid Token Position.");
          }
          // =1
          case get_ttype(9): {
            push_tok(new Token(char, get_ttype(2)));
            break;
          }
          // x1
          case get_ttype(10): {
            update_curr_tok(char);
            break;
          }
          // let1
          // ? keyword becomes identifier
          case get_ttype(11): {
            update_curr_tok(char, get_ttype(10));
            break;
          }
        }
        break;
      }
      case "+": {
        switch (curr_token.ttype) {
          // + ;+
          case get_ttype(0):
          case get_ttype(1): {
            throw new Error("Invalid Token Position.");
          }
          // 1+
          case get_ttype(2): {
            push_tok(new Token(char, get_ttype(3)));
            break;
          }
          // ++ -+ *+ /+ (+
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            throw new Error("Invalid Token Position.");
          }
          // )+
          case get_ttype(8): {
            push_tok(new Token(char, get_ttype(3)));
            break;
          }
          // =+
          case get_ttype(9): {
            throw new Error('Invalid Assignment.');
          }
          // x+
          case get_ttype(10): {
            push_tok(new Token(char, get_ttype(3)));
            break;
          }
          // let+
          case get_ttype(11): {
            throw new Error('Invalid Identifier.');
          }
        }
        break;
      }
      case "-": {
        switch (curr_token.ttype) {
          // - ;-
          case get_ttype(0):
          case get_ttype(1): {
            throw new Error("Invalid Token Position.");
          }
          // 1-
          case get_ttype(2): {
            push_tok(new Token(char, get_ttype(4)));
            break;
          }
          // +- -- *- /- (-
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            throw new Error("Invalid Token Position.");
          }
          // )-
          case get_ttype(8): {
            push_tok(new Token(char, get_ttype(4)));
            break;
          }
          // =-
          case get_ttype(9): {
            throw new Error('Invalid Assignment.');
          }
          // x-
          case get_ttype(10): {
            push_tok(new Token(char, get_ttype(4)));
            break;
          }
          // let-
          case get_ttype(11): {
            throw new Error('Invalid Identifier.');
          }
        }
        break;
      }
      case "*": {
        switch (curr_token.ttype) {
          // * ;*
          case get_ttype(0):
          case get_ttype(1): {
            throw new Error("Invalid Token Position");
          }
          // 1*
          case get_ttype(2): {
            push_tok(new Token(char, get_ttype(5)));
            break;
          }

          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            throw new Error("Invalid Token Position.");
          }
          case get_ttype(8): {
            push_tok(new Token(char, get_ttype(5)));
            break;
          }
          // =*
          case get_ttype(9): {
            throw new Error('Invalid Assignment.');
          }
          // x*
          case get_ttype(10): {
            push_tok(new Token(char, get_ttype(5)));
            break;
          }
          // let*
          case get_ttype(11): {
            throw new Error('Invalid Identifier.');
          }
        }
        break;
      }
      case "/": {
        switch (curr_token.ttype) {
          // / ;/
          case get_ttype(0):
          case get_ttype(1): {
            throw new Error("Invalid Token Position.");
          }
          // 1/
          case get_ttype(2): {
            push_tok(new Token(char, get_ttype(6)));
            break;
          }
          // +/ -/ */ // (/
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            throw new Error("Invalid Token Position.");
          }
          // )/
          case get_ttype(8): {
            push_tok(new Token(char, get_ttype(6)));
            break;
          }
          // =/
          case get_ttype(9): {
            throw new Error('Invalid Assignment.');
          }
          // x/
          case get_ttype(10): {
            push_tok(new Token(char, get_ttype(6)));
            break;
          }
          // let/
          case get_ttype(11): {
            throw new Error('Invalid Identifier.');
          }
        }
        break;
      }
      case "(": {
        switch (curr_token.ttype) {
          // (
          case get_ttype(0): {
            update_curr_tok(char, get_ttype(7));
            break;
          }
          // ;(
          case get_ttype(1): {
            push_tok(new Token(char, get_ttype(7)));
            break;
          }
          // 1(
          case get_ttype(2): {
            throw new Error("Invalid Token Position.");
          }
          // +( -( *( /( ((
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            push_tok(new Token(char, get_ttype(7)));
            break;
          }
          // )(
          case get_ttype(8): {
            throw new Error("Invalid Token Position.");
          }
        }
        break;
      }
      case ")": {
        switch (curr_token.ttype) {
          // ) ;)
          case get_ttype(0):
          case get_ttype(1): {
            throw new Error("Invalid Token Position.");
          }
          // 1)
          case get_ttype(2): {
            push_tok(new Token(char, get_ttype(8)));
            break;
          }
          // +) -) *) /)
          case get_ttype(3):
          case get_ttype(4):
          case get_ttype(5):
          case get_ttype(6):
          case get_ttype(7): {
            throw new Error("Invalid Token Position.");
          }
          // ))
          case get_ttype(8): {
            push_tok(new Token(char, get_ttype(8)));
            break;
          }
        }
        break;
      }
    }
  }

  if (curr_token.ttype !== get_ttype(1) && curr_token.ttype !== get_ttype(0)) {
    throw new Error("Invalid Program End.");
  } else {
    push_tok(curr_token);
  }

  function push_tok(new_tok) {
    tokens.push(curr_token);
    curr_token = new_tok;
  }

  function update_curr_tok(value, ttype, replace_value) {
    if (replace_value) {
      curr_token.value = value;
    } else {
      curr_token.value = curr_token.value + value;
    }

    if (ttype) {
      curr_token.ttype = ttype;
    }
  }

  return tokens;
}

export function get_ttype(idx) {
  return Token_Types[idx][1];
}
