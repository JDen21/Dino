import { get_ttype, Token } from "./Tokenizer.mjs";

export function tokenize_close_paren_char(curr_token, char, helper_funcs) {
  const { push_tok } = helper_funcs;

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
    // =) x) let(
    case get_ttype(9):
    case get_ttype(10):
    case get_ttype(11): {
      throw new Error("Invalid Token Position.");
    }
  }
}
export function tokenize_open_paren_char(curr_token, char, helper_funcs) {
  const { update_curr_tok, push_tok } = helper_funcs;

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
    // =(
    case get_ttype(9): {
      push_tok(new Token(char, get_ttype(7)));
      break;
    }
    // x(
    case get_ttype(10): {
      throw new Error("Invalid Token Position.");
    }
    // let(
    case get_ttype(11): {
      throw new Error('Invalid Identifier.');
    }
  }
}
export function tokenize_div_char(curr_token, char, helper_funcs) {
  const { push_tok } = helper_funcs;

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
}
export function tokenize_mult_char(curr_token, char, helper_funcs) {
  const { push_tok } = helper_funcs;

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
    // +-*/(*
    case get_ttype(3):
    case get_ttype(4):
    case get_ttype(5):
    case get_ttype(6):
    case get_ttype(7): {
      throw new Error("Invalid Token Position.");
    }
    // )*
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
}
export function tokenize_subt_char(curr_token, char, helper_funcs) {
  const { push_tok } = helper_funcs;

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
}
export function tokenize_add_char(curr_token, char, helper_funcs) {
  const { push_tok } = helper_funcs;

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
}
export function tokenize_char_chars(curr_token, char, helper_funcs) {
  const { push_tok, update_curr_tok } = helper_funcs;

  switch (curr_token.ttype) {
    // a 
    case get_ttype(0):  {
      update_curr_tok(char, get_ttype(10));
      break;
    }
    // ;a
    case get_ttype(1): {
      push_tok(new Token(char, get_ttype(10)));
      break;
    }
    // 2a
    case get_ttype(2): {
      throw new Error('Invalid Token Position.');
    }
    // +-*/(a
    case get_ttype(3):
    case get_ttype(4):
    case get_ttype(5):
    case get_ttype(6):
    case get_ttype(7): {
      push_tok(new Token(char, get_ttype(10)));
      break;
    }
    // )a
    case get_ttype(8): {
      throw new Error('Invalid Token Position.');
    }
    // =a
    case get_ttype(9): {
      push_tok(new Token(char, get_ttype(10)));
      break;
    }
    // ab let
    case get_ttype(10):
    case get_ttype(11): {
      
      // a<space> let<space>a
      if (curr_token.value.endsWith(' ')) {
        push_tok(new Token(char, get_ttype(10)));
        break;
      }

      // assignment keyword
      if (curr_token.value + char === 'let') {
        update_curr_tok(char, get_ttype(11));
        break;
      }

      // identifier
      update_curr_tok(char, get_ttype(10));
      break;
    }
  }
}
export function tokenize_number_chars(curr_token, char, helper_funcs) {
  const { update_curr_tok, push_tok } = helper_funcs;

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
      // 1 1
      if (curr_token.value.endsWith(' ')) {
        throw new Error('Invalid Number.');
      }
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
      // x 1
      if (curr_token.value.endsWith(' ')) {
        throw new Error('Invalid Token Position.');
      }
      update_curr_tok(char);
      break;
    }
    // let1
    // ? keyword becomes identifier
    case get_ttype(11): {
      // let 1
      if (curr_token.value.endsWith(' ')) {
        throw new Error('Invalid Identifier.');
      }
      update_curr_tok(char, get_ttype(10));
      break;
    }
  }
}
export function tokenize_semicol_char(curr_token, char, helper_funcs) {
  const { update_curr_tok, push_tok } = helper_funcs;
  switch (curr_token.ttype) {
    // ;
    case get_ttype(0): {
      update_curr_tok(char, get_ttype(1));
      break;
    }
    // ;; 1;
    case get_ttype(1):
    case get_ttype(2): {
      push_tok(new Token(";", get_ttype(1)));
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
}
export function tokenize_eq_char(curr_token, char, helper_funcs) {
  const { push_tok } = helper_funcs;

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
    // let=
    case get_ttype(11): {
      throw new Error(`Invalid Token Position. ${char}`);
    }
  }
}
