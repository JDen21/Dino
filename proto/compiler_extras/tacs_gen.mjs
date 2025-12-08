import { Arithmetic_Expr, Assigment_Stmt, Let_Statement } from "../ast_gen2.mjs";


// three address codes
export function tacs_gen(ast) {
    const tacs_data = {
        counter: 0, 
        tacs: [],
        addr_stack: []
    };

    for (const program of ast.program_list) {
        gen_program_tac(program, tacs_data);
    }
    console.dir(tacs_data.tacs, { depth: null })
    return tacs_data.tacs;
}
function gen_program_tac(program, tacs_data) {
    if (program instanceof Let_Statement) {
        gen_let_tac(program, tacs_data);
        const result = tacs_data.addr_stack.pop();
        tacs_data.tacs.push([result, null, null, null]);
    }

    if (program instanceof Assigment_Stmt) {
        gen_assign_tac(program, tacs_data);
        const result = tacs_data.addr_stack.pop();
        tacs_data.tacs.push([result, null, null, null]);
    }

    if (program instanceof Arithmetic_Expr) {
        gen_arithmetic_tac(program, tacs_data);
        const result = tacs_data.addr_stack.pop();
        tacs_data.tacs.push([result, null, null, null]);
    }
}

function gen_let_tac(let_stmt, tacs_data) {
    let identifier = let_stmt.let_identifier;
    let init;
    let op = 'LET';

    if (let_stmt.let_opt_init) {
        gen_arithmetic_tac(let_stmt.let_opt_init, tacs_data);
        init = tacs_data.addr_stack.pop();
    }
    const addr = `t${tacs_data.counter++}`;
    tacs_data.addr_stack.push(addr);
    tacs_data.tacs.push([
        addr, op, identifier, init
    ]);
}

function gen_assign_tac(assign_stmt, tacs_data) {
    let identifier = assign_stmt.assign_identifier;
    let expr;
    let op = 'ASSIGN';

    gen_arithmetic_tac(assign_stmt.assign_expr, tacs_data);
    expr = tacs_data.addr_stack.pop();

    const addr = `t${tacs_data.counter++}`;
    tacs_data.addr_stack.push(addr);
    tacs_data.tacs.push([
        addr, op, identifier, expr
    ]);
}

function gen_arithmetic_tac(expression, tacs_data) {
    let l_operand;
    let r_operand;
    let operator = expression.arithmetic_op;
    
    if (!isNaN(expression.right)) {
        r_operand = expression.right;
    }

    if (!isNaN(expression.left)) {
        l_operand = expression.left;
    }

    if (expression.right instanceof Arithmetic_Expr) {
        gen_arithmetic_tac(expression.right, tacs_data);
        r_operand = tacs_data.addr_stack.pop();
    }

    if (expression.left instanceof Arithmetic_Expr) {
        gen_arithmetic_tac(expression.left, tacs_data);
        l_operand = tacs_data.addr_stack.pop();
    }


    const addr = `t${tacs_data.counter++}`;
    tacs_data.addr_stack.push(addr);
    tacs_data.tacs.push([addr, operator, l_operand, r_operand]);
}