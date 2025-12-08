
/**
 * The black box memory execution scope
 */
export default class Environment {
    memory = {};
    parent = undefined;
    execution_nodes = {};

    constructor (parent, execution_nodes) {
        this.parent = parent;
        this.execution_nodes = execution_nodes
    }

}