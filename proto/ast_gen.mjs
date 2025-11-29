import { get_ttype } from './Tokenizer.mjs';

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
    term;
    factor_op;
    factor;
    parent;
}
export class Expression {
    term_op;
    expression;
    term;
    parent;
}
export class Command {
    expression;
    parent;
}
export class Program {
    commands = [];
    parent = undefined;
}
export function build_ast(tokens) {
    let ast = new Program();
    let idx = 0;
    let last_end_idx = 0;

    while (idx < tokens.length) {
        // commands usually end with endline token
        if (tokens[idx].ttype === get_ttype(1)) {
            ast.commands.push(build_command(tokens.slice(last_end_idx, idx), ast));
            last_end_idx = idx + 1;
        }
        idx++;
    }

    return ast;
}
function build_command(tokens, parent) {
    const command = new Command();
    command.parent = parent;

    command.expression = build_expression(tokens, command);
    return command;
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
        expr.term = build_term(tokens, expr);
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
        term.factor = build_factor(tokens, term);
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
        factor.expression = build_expression(tokens.slice(1, tokens.length - 1), factor);
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
