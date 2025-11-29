
import { tokenize } from "./index.mjs";
import data from './test_tokenize.json' with { type: 'json' };

let testCount = 1;
let response;

for (const d of data) {
    response = tokenize(d.program);
    test(JSON.stringify(d.tokens), d.comment);    
}


function test(expected, comment) {
    const result = JSON.stringify(response) === expected;
    if (result === false) {
        console.log(testCount++, "Test error:", comment);
        return;
    }
    console.log(testCount++, result);
}

function log() {
    console.log(JSON.stringify(response));
}