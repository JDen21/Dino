/**
 * <statement> ::= <let_stmt>";" | <assigment_stmt>";" | <expression>";"
 * <let_stmt> ::= "let" <identifier> | "let" <identifier> <optional_init>
 * <optional_init> ::= "=" <expression> | E
 * <assignment_stmt> :: <identifier> "=" <expression>
 * <expression> ::= <term> | <expression> "+" <term> | <expression> "-" <term>
    <term> ::= <factor> | <term> "*" <factor> | <term> "/" <factor>
    <factor> ::= <number> | <identifier> | "(" <expression> ")"
    <identifier> ::= <character> | <identifier><character> | <identifier> <digit>
    <number> ::= <digit> | <digit> <number>
    
    <character> ::= "A" | "a" | "B" | "b" .. "Z" | "z"
    <digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
 */

import { get_ttype } from '../Tokenizer.mjs';
// TODO try more elegant RD parser with single look ahead all the time
// ! REBUILD cause this feels worthless atm
export class LetStatement {
    let_identifier;
    parent;
}

export class Assignment {
    identifier;
    expression;
    parent;
}
export class Identifier {
    value;
    parent;
}
export class Number {
    value;
    parent;
}
export class Operator {
    type;
    parent;
}
export class Factor {
    number;
    expression;
    parent;
}
export class Term {
    factor_op;
    term;
    factor;
    parent;
}
export class Expression {
    term_op;
    expression;
    term;
    parent;
}
export class Statement {
    statement;
    parent;
}
export class Program {
    statements = [];
    parent = undefined;
}
export function build_ast(tokens) {
    let ast = new Program();
    let idx = 0;
    let last_end_idx = 0;

    while (idx < tokens.length) {
        // commands usually end with endline token
        if (tokens[idx].ttype === get_ttype(1)) {
            ast.statements.push(build_statement(tokens.slice(last_end_idx, idx), ast));
            last_end_idx = idx + 1;
        }
        idx++;
    }

    console.log( JSON.stringify(ast, (key, value) => {
    if (key === "parent") {
      return undefined;
    }
    return value;
  }))

    return ast;
}

function build_statement(tokens, parent) {
    const stmt = new Statement();
    stmt.parent = parent;
    stmt.statement = build_let(tokens, stmt);
    
    return stmt;
}

function build_let (tokens, parent) {
    if (tokens[0].ttype === get_ttype(11)) {
        const letStmt = new LetStatement();
        letStmt.parent = parent;
        letStmt.let_identifier = build_identifier(tokens.slice(1), letStmt);
        return letStmt;
    }

    const let_op_idx = tokens.findLastIndex(token => {
        return token.ttype === get_ttype(11);
    });

    if (let_op_idx === -1) {
        return build_assigment(tokens, letStmt);
    }

    letStmt.let_identifier = build_identifier(tokens.slice(let_op_idx + 1), letStmt);
    return letStmt;
}

function build_assigment (tokens, parent) {
    const assmt = new Assignment();
    assmt.parent = parent;

    const assmt_op_idx = tokens.findLastIndex(token => {
        return token.ttype === get_ttype(9);
    });

    if (assmt_op_idx === -1) {
        return build_expression(tokens, assmt);
    } else {
        assmt.identifier = build_identifier(tokens.slice(0, assmt_op_idx), assmt);
        assmt.expression = build_expression(tokens.slice(assmt_op_idx + 1), assmt);
    }
    return assmt;
}

function build_identifier (tokens, parent) {
    const id = new Identifier();
    id.parent = parent;
    
    if (tokens.length > 1) {
        throw new Error(`Anomalous expression: ${JSON.stringify(tokens)}`);
    }
    id.value = tokens[0].value;
    return id;
}

function build_expression(tokens, parent) {
    const expr = new Expression();
    expr.parent = parent;

    let impaired_paren = 0;
    const term_op_idx = tokens.findLastIndex(token => {
        if (token.ttype === get_ttype(7)) {
            ++impaired_paren;
        }
        if (token.ttype === get_ttype(8)) {
            --impaired_paren;
        }

        // sub expression
        if (impaired_paren !== 0) {
            return false;
        }
        // + -
        return token.ttype === get_ttype(3) || token.ttype === get_ttype(4);
    });

    if (term_op_idx === -1) {
        return build_term(tokens, expr);
    } else {
        expr.expression = build_expression(tokens.slice(0, term_op_idx), expr);
        expr.term_op = build_operator(tokens[term_op_idx], expr);
        expr.term = build_term(tokens.slice(term_op_idx + 1), expr);
    }

    return expr;
}
function build_term(tokens, parent) {
    const term = new Term();
    term.parent = parent;

    let impaired_paren = 0;
    const factor_op_idx = tokens.findLastIndex(token => {
        if (token.ttype === get_ttype(7)) {
            ++impaired_paren;
        }
        if (token.ttype === get_ttype(8)) {
            --impaired_paren;
        }

        // sub expression
        if (impaired_paren !== 0) {
            return false;
        }

        // * / 
        return token.ttype === get_ttype(5) || token.ttype === get_ttype(6);
    });

    if (factor_op_idx === -1) {
        return build_factor(tokens, term);
    } else {   
        term.term = build_term(tokens.slice(0, factor_op_idx), term);
        term.factor_op = build_operator(tokens[factor_op_idx], term);
        term.factor = build_factor(tokens.slice(factor_op_idx + 1), term);
    }

    return term;
}
function build_factor(tokens, parent) {
    const factor = new Factor();
    factor.parent = parent;

    // if sub-expression
    if (tokens[0].ttype === get_ttype(7)
        && tokens[tokens.length - 1].ttype === get_ttype(8)) {
        return build_expression(tokens.slice(1, tokens.length - 1), factor);
    } else {
        factor.number = build_number(tokens, factor);
    }

    return factor;
}
function build_operator(token, parent) {
    const op = new Operator();
    op.type = token.ttype;
    op.parent = parent;
    return op;
}
function build_number(tokens, parent) {
    const number = new Number();
    number.parent = parent;

    if (tokens.length > 1) {
        throw new Error(`Anomalous expression: ${JSON.stringify(tokens)}`);
    }
    number.value = parseInt(tokens[0].value);
    return number;
}
