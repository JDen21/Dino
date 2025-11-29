import fs from "fs/promises";
import { build_ast } from "./ast_gen.mjs";
import data from './test_ast_gen.json' with { type: 'json' };

let testCount = 1;
let response;
let ast;

for (const tst of data) {
  response = build_ast(tst.tokens);
  ast = JSON.stringify(tst.ast);
  test(ast, tst.comment);
}

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