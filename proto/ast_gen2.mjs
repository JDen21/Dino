/**
 * <statement> 
 *  ::= <let_stmt>";" | 
 *  ::= <assigment_stmt>";" | 
 *  ::= <expression>";" | 
 *  ::= <comparison_expression>";" | 
 *  ::= <gate_expression>";"
 * <let_stmt> ::= "let" <identifier> | "let" <identifier> <optional_init>
 * <optional_init> ::= "=" <expression> | "=" <gate_expression> | "=" <comparison_expression> | E
 * <assignment_stmt> 
 *  ::= <identifier> "=" <expression> | 
 *  ::= <identifier> "=" <gate_expression> | 
 *  ::= <identifier> "=" <comparison_expression>
 * <gate_expression> 
 *  ::= "!"<comparison_expression> | 
 *  ::= <comparison_expression> "&&" <comparison_expression> | 
 *  ::= <comparison_expression> "||" <comparison_expression>
 * <comparison_expression> 
 *  ::= <expression> "==" <expression> | 
 *  ::= <expression> "!=" <expression> | 
 *  ::= <expression> "<" <expression> |
 *  ::= <expression> "<=" <expression> |
 *  ::= <expression> ">" <expression> |
 *  ::= <expression> ">=" <expression> |
 * <expression> ::= <term> | <expression> "+" <term> | <expression> "-" <term>
    <term> ::= <factor> | <term> "*" <factor> | <term> "/" <factor>
    <factor> ::= <number> | <identifier> | "(" <expression> ")"
    <identifier> ::= <character> | <identifier><character> | <identifier> <digit>
    <number> ::= <digit> | <digit> <number> 
    <character> ::= "A" | "a" | "B" | "b" .. "Z" | "z"
    <digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
 */
import { get_ttype } from "./Tokenizer.mjs";

let curr_tokens = [];
let curr_tok_pos = 0;

const match = (expectedType) => {
    if (lookAhead().ttype === expectedType) {
        curr_tok_pos+=1;
        return;
    }
    console.log(lookAhead(), expectedType)
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
        program.program_list.push(generate_statement());
    }
    curr_tokens = undefined;
    curr_tok_pos = undefined;
    // console.dir(program, { depth: null })
    return program;
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
    if (lookAhead().ttype === get_ttype(9)) {
        match(get_ttype(9)); // =
        return generate_expression();
    } else {
        // nothing to do here
    }
}

function generate_assignment () {
    const ass_stmt = new Assigment_Stmt();
    ass_stmt.assign_identifier = lookAhead().value;
    match(get_ttype(10)); // identifier
    match(get_ttype(9)); // =
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
        const node = new Arithmetic_Expr();
        node.arithmetic_op = operand.value;
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
        const node = new Arithmetic_Expr();
        node.arithmetic_op = operand.value;
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
        return parseInt(value);
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

export class Program {
    program_list = [];   
}

export class Let_Statement {
    let_identifier;
    let_opt_init;
}

export class Assigment_Stmt {
    assign_identifier;
    assign_expr;
}

export class Arithmetic_Expr {
    arithmetic_op;
    left;
    right;
}
