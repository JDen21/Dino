import fs from 'fs/promises';
import { tacs_gen } from "./tacs_gen.mjs";
import tokenize from './Tokenizer.mjs';
import { build_ast } from './ast_gen.mjs';

let testCount = 1;

const program1 = '1;';
let tokens = tokenize(program1);
let ast = build_ast(tokens);
let response = tacs_gen(ast);
let tacs = "[[\"1\",null,null,null]]";
test(tacs, "TAC results in correct final value");

const program2 = '1+1*1/2-2;';
tokens = tokenize(program2);
ast = build_ast(tokens);
response = tacs_gen(ast);
tacs = "[[\"t1\",\"MULTIPLY\",\"1\",\"1\"],[\"t2\",\"DIVIDE\",\"t1\",\"2\"],[\"t3\",\"ADD\",\"1\",\"t2\"],[\"t4\",\"SUBTRACT\",\"t3\",\"2\"],[\"t4\",null,null,null]]";
test(tacs, "TAC honors four basic arithmetic operations");

const program3 = '(1+1)*2-(3/(2+2));';
tokens = tokenize(program3);
ast = build_ast(tokens);
response = tacs_gen(ast);
tacs = "[[\"t1\",\"ADD\",\"1\",\"1\"],[\"t2\",\"MULTIPLY\",\"t1\",\"2\"],[\"t3\",\"ADD\",\"2\",\"2\"],[\"t4\",\"DIVIDE\",\"3\",\"t3\"],[\"t5\",\"SUBTRACT\",\"t2\",\"t4\"],[\"t5\",null,null,null]]";
test(tacs, "TAC honors sub expressions");

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