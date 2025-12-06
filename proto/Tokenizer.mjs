// TODO TOKENIZER ERROR HANDLER
// TODO NEGATIVE NUMBER
// TODO FUNCTION CALL

import { tokenize_eq_char, tokenize_semicol_char, tokenize_number_chars, tokenize_add_char, tokenize_subt_char, tokenize_mult_char, tokenize_div_char, tokenize_open_paren_char, tokenize_close_paren_char, tokenize_char_chars } from "./tokenizer_methods.mjs";

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
  
  function push_tok(new_tok) {
    curr_token.value = curr_token.value.trim();
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

  const helper_funcs = { push_tok, update_curr_tok };

  for (const char of chars) {
    switch (char) {
      default:
        throw new Error("Invalid Character input.");
      case ' ': {
        switch (curr_token.ttype) {
          // <space>
          case get_ttype(0):{
            break;
          }
          default: {
            update_curr_tok(' ');
            break;
          }
        }
        break;
      }
      case '\n': {
        break;
      }
        case "=": {
        tokenize_eq_char(curr_token, char, helper_funcs);
        break;
      }
      case ";": {
        tokenize_semicol_char(curr_token, char, helper_funcs);
        break;
      }
      case 'a':
      case 'b':
      case 'c':
      case 'd':
      case 'e':
      case 'f':
      case 'g':
      case 'h':
      case 'i':
      case 'j':
      case 'k':
      case 'l':
      case 'm':
      case 'n':
      case 'o':
      case 'p':
      case 'q':
      case 'r':
      case 's':
      case 't':
      case 'u':
      case 'v':
      case 'w':
      case 'x':
      case 'y':
      case 'z':
      case 'A':
      case 'B':
      case 'C':
      case 'D':
      case 'E':
      case 'F':
      case 'G':
      case 'H':
      case 'I':
      case 'J':
      case 'K':
      case 'L':
      case 'M':
      case 'N':
      case 'O':
      case 'P':
      case 'Q':
      case 'R':
      case 'S':
      case 'T':
      case 'U':
      case 'V':
      case 'W':
      case 'X':
      case 'Y':
      case 'Z': {
        tokenize_char_chars(curr_token, char, helper_funcs);
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
        tokenize_number_chars(curr_token, char, helper_funcs);
        break;
      }
      case "+": {
        tokenize_add_char(curr_token, char, helper_funcs);
        break;
      }
      case "-": {
        tokenize_subt_char(curr_token, char, helper_funcs);
        break;
      }
      case "*": {
        tokenize_mult_char(curr_token, char, helper_funcs);
        break;
      }
      case "/": {
        tokenize_div_char(curr_token, char, helper_funcs);
        break;
      }
      case "(": {
        tokenize_open_paren_char(curr_token, char, helper_funcs);
        break;
      }
      case ")": {
        tokenize_close_paren_char(curr_token, char, helper_funcs);
        break;
      }
    }
  }

  if (curr_token.ttype !== get_ttype(1) && curr_token.ttype !== get_ttype(0)) {
    throw new Error("Invalid Program End.");
  } else {
    push_tok(curr_token);
  }

  return tokens;
}

export function get_ttype(idx) {
  return Token_Types[idx][1];
}
