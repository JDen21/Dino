// import { LetStatement, Program, Statement } from "./ast_gen.mjs";
import tokenize, { get_ttype } from "./Tokenizer.mjs";

let curr_tokens = [];
let curr_tok_pos = 0;

const match = (expectedType) => {
    if (lookAhead().ttype === expectedType) {
        curr_tok_pos+=1;
        return;
    }
    throw new Error('Syntax Error.');
};

const lookAhead = (custom_idx) => {
    if (custom_idx !== undefined) {
        return curr_tokens[custom_idx];
    }
    return curr_tokens[curr_tok_pos]
};

export default function ast_gen (tokens) {
    curr_tokens = tokens;
    const program = new Program();
    
    while (curr_tok_pos < tokens.length) {
        program.commands.push(generate_statement());
    }

    console.log(JSON.stringify(program))
}

function generate_statement () {
    const tok_type = lookAhead().ttype;

    if (tok_type === get_ttype(11)) {
        match(get_ttype(11)); // let
        const stmt = generate_let();
        match(get_ttype(1)); // ;
        return stmt;
    }

    if (tok_type === get_ttype(10)) {
        // check after identifier
        const aft_iden = lookAhead(curr_tok_pos + 1).ttype;
        switch (aft_iden) {
            // a =
            case get_ttype(9): {
                const stmt = generate_assignment();
                match(get_ttype(1));
                return stmt;
            }
            // expr starting with iden
            default: {
                const stmt = generate_expression();
                match(get_ttype(1));
                return stmt;
            }
        }
    }

    // expr starting with num
    if (tok_type === get_ttype(2)) {
        const value = generate_expression();
        console.log({ value })
        match(get_ttype(1));
        return value;
    }
}

function generate_let () {
    const let_stmt = new Let_Statement();
    let_stmt.let_identifier = lookAhead().value;
    match(get_ttype(10));
    let_stmt.let_opt_init = generate_optional_init();
    return let_stmt;
}

function generate_optional_init () {
    match(9); // =
    return generate_expression();
}

function generate_assignment () {
    const ass_stmt = new Assigment_Stmt();
    ass_stmt.assign_identifier = lookAhead().value;
    match(10); // identifier
    match(9); // =
    ass_stmt.assign_expr = generate_expression();
    return ass_stmt;
}

function generate_expression () {
    let left = generate_term();
    let operand = lookAhead();
    while (operand.ttype === get_ttype(3) || operand.ttype === get_ttype(4)) {
        if (operand.ttype === get_ttype(3)) {
            match(get_ttype(3));
        } else {
            match(get_ttype(4));
        }
        const right = generate_term();
        const node = new Binary_Expr();
        node.bin_op = operand.value;
        node.left = left;
        node.right = right;
        
        left = node;
        operand = lookAhead();
    }

    return left;
}

function generate_term () {
    let left = generate_factor();
    let operand = lookAhead();
    while (operand.ttype === get_ttype(5) || operand.ttype === get_ttype(6)) {
        if (operand.ttype === get_ttype(5)) {
            match(get_ttype(5));
        } else {
            match(get_ttype(6));
        }
        const right = generate_factor();
        const node = new Binary_Expr();
        node.bin_op = operand.value;
        node.left = left;
        node.right = right;
        
        left = node;
        operand = lookAhead();
    }
    
    return left;
}

function generate_factor () {
    const ttype = lookAhead().ttype;
    // number or identifier or subexpress
    if (ttype === get_ttype(2)) {
        const value = lookAhead().value;
        match(get_ttype(2));
        return value;
    } else if (ttype === get_ttype(10)) {
        const value = lookAhead().value;
        match(get_ttype(10));
        return value;
    } else if (ttype === get_ttype(7)) {
        match(get_ttype(7));
        const value = generate_expression();
        match(get_ttype(8));
        return value;
    }
}

class Program {
    commands = [];   
}

class Let_Statement {
    let_identifier;
    let_opt_init;
}

class Assigment_Stmt {
    assign_identifier;
    assign_expr;
}

class Binary_Expr {
    bin_op;
    left;
    right;
}
