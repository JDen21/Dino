import ast_gen from "./ast_gen2.mjs";
// import { tacs_gen } from "./tacs_gen.mjs";
import interpret from "./interp_runtime/interpret.mjs";
import tokenize from "./Tokenizer.mjs";
import fs from "fs/promises";

// const program = '(1+1);';
// const program = "1/21*53+42*(12+5)-12/54;";
// const program = "let a;";
const program = "let a = 1/21*53+42*(12+5)-12/54; a = 1+1;";
// const program = "a = 1/21*53+42*(12+5)-12/54;";
const tokens = tokenize(program);
fs.writeFile(
  "./gen/tokens.json",
  JSON.stringify(tokens, (key, value) => {
    if (key === "parent") {
      return undefined;
    }
    return value;
  }),
);

const ast = ast_gen(tokens);
// in place ast optimization
// optimize_ast(ast);
fs.writeFile(
  "./gen/ast.json",
  JSON.stringify(ast, (key, value) => {
    if (key === "parent") {
      return undefined;
    }
    return value;
  }),
);

const env_keys_and_libs = {};
interpret(ast, env_keys_and_libs);

// const tacs = tacs_gen(ast);
// fs.writeFile(
//   "./gen/tacs.json",
//   JSON.stringify(tacs, (key, value) => {
//     if (key === "parent") {
//       return undefined;
//     }
//     return value;
//   }),
// );

// interpret(tacs);