import ast_gen from "./ast_gen2.mjs";
import tokenize from "./Tokenizer.mjs";
import fs from "fs/promises";

// const program = '(1+1);';
const program = "1/21*53+42*(12+5)-12/54;";
// const program = "let a;";
const tokens = tokenize(program);
console.log({tokens})
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

// const tacs = tacs_gen(ast);
// console.log({ program }, { tokens }, { ast }, { tacs });
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