/**
 * Takes tac list
 * outputs program results
 */

const globalMem = {};
const execQueue = [];

export default function interpret(tacs) {
  for (const tac of tacs) {
    let left = tac[2], right = tac[3];
  
    if (isNaN(left)) {
      left = execQueue.shift();
    }  
  
    if (isNaN(right)) {
      right = execQueue.shift();
    }
    switch (tac[1]) {
      case "ADD": {
        execQueue.push(left + right);
        break;
      }
      case 'SUBTRACT': {
        execQueue.push(left - right);
        break;
      }
      case 'MULTIPLY': {
        execQueue.push(left * right);
        break;
      }
      case 'DIVIDE': {
        execQueue.push(left / right);
        break;
      }
    }
  }

  console.log(execQueue)
}
