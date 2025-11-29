import fs from "fs/promises";
import { build_ast } from "./ast_gen.mjs";
import tokenize from "./Tokenizer.mjs";
import { optimize_ast } from "./ast_optimizer.mjs";

let testCount = 1;
let response;

// (1+1) -> 1+1
const tokens = [
  { value: '(', ttype: 'OPEN_PAREN' }, 
  { value: '1', ttype: 'NUMBER' },
  { value: '+', ttype: 'ADD' },
  { value: '1', ttype: 'NUMBER' },
  { value: ')', ttype: 'CLOSE_PAREN' },
  { value: ';', ttype: 'ENDLINE' }
]
const ast = build_ast(tokens);
optimize_ast(ast);
response = ast;
const optim1 = "{\"commands\":[{\"expression\":{\"term_op\":{\"type\":\"ADD\"},\"expression\":{\"term\":{\"factor\":{\"number\":{\"value\":\"1\"}}}},\"term\":{\"factor\":{\"number\":{\"value\":\"1\"}}}}}]}";
test(optim1, "AST Optimization removes extra parenthesis.");

function test(expected, comment) {
    const result =  (
        JSON.stringify(response, (key, value) => {
            if (key === "parent") {
                return undefined;
            }
            return value;
        }) === expected
    );

    if (result === false) {
        console.log(testCount++, "Test error:", comment);
        return;
    }
    console.log(testCount++, result);
}

function log() {
   fs.writeFile("view.json", JSON.stringify(response, (key, value) => {
    if (key === "parent") {
        return undefined;
    }
    return value;
}));
}