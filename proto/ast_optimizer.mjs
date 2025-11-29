import { Number, Operator, Expression } from './ast_gen.mjs';

export function optimize_ast(ast) {
    for (const cmd of ast.commands) {
        optimize_command(cmd);
    }
    return ast;
}
function optimize_command(command_root) {
    // traverse via dfs
    const stack = [];
    let curr_node = null;
    stack.push(command_root);

    while (stack.length > 0) {
        curr_node = stack.pop();

        // continue when end nodes
        if (curr_node instanceof Number) { continue; }
        if (curr_node instanceof Operator) { continue; }

        if (curr_node instanceof Expression) {

            /**
             * simplify (1+1) -> 1+1
             * expression(term only) -> term(factor only) -> factor(expression)
             */
            // expression with no term operator
            if (curr_node.term_op === undefined) {
                let next_node = curr_node.term;

                // term with no factor operator
                if (next_node.factor_op === undefined) {
                    next_node = next_node.factor;

                    // factor is sub expression
                    if (next_node.expression !== undefined) {
                        // remove consecutive expression term factor
                        next_node = next_node.expression;
                        next_node.parent = curr_node.parent;
                        curr_node.parent.expression = next_node;

                        // since curr_node is now discarded line, push next_node instead
                        stack.push(next_node);
                        continue;
                    }
                }
            }
        }

        // default to dfs behaviour
        // get push next child nodes, remove undefined nodes
        stack.push(...Object
            .keys(curr_node)
            .filter(key => key !== 'parent')
            .map(key => curr_node[key])
            .filter(node => node)
        );
    }
}
