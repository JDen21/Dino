// three address codes
export function tacs_gen(ast) {
    const tacs_data = {
        counter: 0, tacs: []
    };

    for (const command of ast.commands) {
        gen_command_tac(command, tacs_data);
    }
    return tacs_data.tacs;
}
function gen_command_tac(command, tacs_data) {
    const result = gen_expression_tac(command.expression, tacs_data);
    tacs_data.tacs.push([result, null, null, null]);
}
function gen_expression_tac(expression, tacs_data) {
    let l_operand;

    if (expression.expression !== undefined) {
        l_operand = gen_expression_tac(expression.expression, tacs_data);
    }
    const r_operand = gen_term_tac(expression.term, tacs_data);

    if (expression.term_op !== undefined && expression.expression !== undefined) {
        const operator = expression.term_op.type;
        const addr = `t${++tacs_data.counter}`;
        tacs_data.tacs.push([addr, operator, l_operand, r_operand]);
        return addr;
    }

    return r_operand;
}
function gen_term_tac(term, tacs_data) {
    let l_operand;

    if (term.term !== undefined) {
        l_operand = gen_term_tac(term.term, tacs_data);
    }

    const r_operand = gen_factor_tac(term.factor, tacs_data);

    if (term.factor_op !== undefined && term.term !== undefined) {
        const operator = term.factor_op.type;
        const addr = `t${++tacs_data.counter}`;
        tacs_data.tacs.push([addr, operator, l_operand, r_operand]);
        return addr;
    }

    return r_operand;
}
function gen_factor_tac(factor, tacs_data) {
    if (factor.number !== undefined) {
        return gen_number_tac(factor.number);
    }

    return gen_expression_tac(factor.expression, tacs_data);
}
function gen_number_tac(number, tacs_data) {
    return number.value;
}
