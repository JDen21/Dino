import { Arithmetic_Expr, Assigment_Stmt, Let_Statement } from "../ast_gen2.mjs";
import Environment from "./environment.mjs";

class Visitor {
    context; // env
    loc; // node
    expr_num_stack = [];
}

let global_env = new Environment(null, null, {});
let vis = new Visitor();

export default function interpret (ast, global_vars) {
    global_vars['~~namespace~~'] = 'Dino';
    global_env.memory['Dino'] = {...global_vars};
    vis.context = global_env;
    vis.loc = ast;

    for (const program of ast.program_list) {
        vis.loc = program;
        execute_stmt();
    }
    vis.loc = ast;
    console.dir(vis, { depth: null })
}

function execute_stmt () {
    if (vis.loc instanceof Let_Statement) {
        execute_let();
    }

    if (vis.loc instanceof Assigment_Stmt) {
        execute_assign();
    }
}

function execute_let () {
    const curr_node = vis.loc;
    const id = curr_node.let_identifier;

    if (id in vis.context.memory) {
        throw new Error(`Identifier '${id}' already initialized.`);
    }

    vis.context.memory[id] = null;

    if (curr_node.let_opt_init) {
        vis.loc = curr_node.let_opt_init;
        execute_expression();
        vis.context.memory[id] = vis.expr_num_stack.pop();
        vis.loc = curr_node;
    }
}

function execute_assign () {
    const curr_node = vis.loc;
    const id = curr_node.assign_identifier;
    let expr;

    if ((id in vis.context.memory) === false) {
        throw new Error(`Unknown Identifier '${id}'`);
    }

    vis.loc = curr_node.assign_expr;
    execute_expression();
    expr = vis.expr_num_stack.pop();
    vis.context.memory[id] = expr;
    vis.loc = curr_node;
}

function execute_expression () {
    const curr_node = vis.loc;
    const operator = curr_node.arithmetic_op;
    let left = curr_node.left;
    let right = curr_node.right;

    if (right instanceof Arithmetic_Expr) {
        vis.loc = curr_node.right;
        execute_expression();
        right = vis.expr_num_stack.pop();
        vis.loc = curr_node;
    }

    if (left instanceof Arithmetic_Expr) {
        vis.loc = curr_node.left;
        execute_expression();
        left = vis.expr_num_stack.pop();
        vis.loc = curr_node;
    }

    switch (operator) {
        case '+': {
            vis.expr_num_stack.push(left + right);
            break;
        }
        case '-': {
            vis.expr_num_stack.push(left - right);
            break;
        }
        case '*': {
            vis.expr_num_stack.push(left * right);
            break;
        }
        case '/': {
            vis.expr_num_stack.push(left / right);
            break;
        }
    }
}