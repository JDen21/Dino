/**
 * <assigment> ::= <initialization> "=" <expression> | <identifier> "=" <expression>
 * <initialization> ::= "let" <identifier>
 * <expression> ::= <term> | <expression> "+" <term> | <expression> "-" <term>
    <term> ::= <factor> | <term> "*" <factor> | <term> "/" <factor>
    <factor> ::= <number> | <identifier> | "(" <expression> ")"
    <identifier> ::= <character> | <identifier><character> | <identifier> <digit>
    <number> ::= <digit> | <digit> <number>
    <character> ::= "A" | "a" | "B" | "b" .. "Z" | "z"
    <digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

 */

import { build_ast } from "./ast_gen.mjs";
import { optimize_ast } from "./ast_optimizer.mjs";
import { tacs_gen } from "./tacs_gen.mjs";
import tokenize from "./Tokenizer.mjs";
import Tokenizer from "./Tokenizer.mjs";
import fs from "fs/promises";
import interpret from "./runtime/index.mjs";

// const program = '(1+1);';
// const program = "1/21*53+42-12/54;";
const program = "let a = 25;";
const tokens = tokenize(program);
const ast = build_ast(tokens);

// in place ast optimization
optimize_ast(ast);
const tacs = tacs_gen(ast);
console.log({ program }, { tokens }, { ast }, { tacs });
interpret(tacs);

fs.writeFile(
  "./gen/tokens.json",
  JSON.stringify(tokens, (key, value) => {
    if (key === "parent") {
      return undefined;
    }
    return value;
  }),
);

fs.writeFile(
  "./gen/ast.json",
  JSON.stringify(ast, (key, value) => {
    if (key === "parent") {
      return undefined;
    }
    return value;
  }),
);

fs.writeFile(
  "./gen/tacs.json",
  JSON.stringify(tacs, (key, value) => {
    if (key === "parent") {
      return undefined;
    }
    return value;
  }),
);

export { Tokenizer as tokenize };
