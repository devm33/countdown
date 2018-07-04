/* search.js WebWorker API:
 *
 * Request:
 *   goal: number to search for
 *   numbers: array of numbers to use for search
 *
 * Response:
 *   type: response type
 *     MSG: text response
 *   text: sent for MSG responses
 *
 */

addEventListener('message', function(e) {
  search(e.data.numbers, e.data.goal);
}, false);

function search(a, g) {
  postMessage({ text: `Searching for ${g}` });
  var q = new Queue();
  q.enqueue(new Node(a));
  while(q.hasNext()) {
    for(var n of getNeighbors(q.dequeue())) {
      // Check for goal
      var a = n.list.find(v => v.value === g);
      if(a) {
        postMessage({ text: `Goal found ${a.print()}` });
        continue; // Dont search past goal
        // return; Lets try exhaustive!
      }
      // Drop leaves
      if(n.list.length === 1) {
        continue;
      }
      // Enqueue if not seen
      if(!q.hasSeen(n)) {
        q.enqueue(n);
      }
    }
  }
  postMessage({ text: 'Search done' });
}

function getNeighbors(n) {
  var r = [];
  var a = n.list;
  for(var i = 0; i < a.length; i++) {
    for(var j = 0; j < a.length; j++) {
      if(i == j) {
        continue; // Cant use the same number twice
      }
      if(a[i].value < a[j].value) {
        // Skip these to remove duplicate paths from associative operators
        // and avoid invalid intermediates fro other operators.
        continue;
      }
      var l = a.filter((_, k) => k !== i && k !== j); // List without current
      for(var o of OPERATORS) {
        var t = o.f(a[i].value, a[j].value);
        if(t === 0 || t === a[i].value || t === a[j].value) {
          continue; // Skipping since not useful
        }
        if(t < 0 || t % 1 !== 0) {
          continue; // Skipping since no negative or fractions allowed
        }
        r.push(new Node(l, new PathNode(t, o.s, a[i], a[j])));
      }
    }
  }
  return r;
}

const OPERATORS = [
  { s: '+', f: (a,b) => a + b },
  { s: '-', f: (a,b) => a - b },
  { s: '*', f: (a,b) => a * b },
  { s: '/', f: (a,b) => a / b },
];

class Queue {
  constructor() {
    this.q = [];
    this.s = new Set();
  }
  hasNext() {
    return this.q.length > 0;
  }
  hasSeen(n) {
    return this.s.has(n.getKey());
  }
  enqueue(n) {
    // TODO should sort the q by a heuristic
    this.q.push(n);
    this.s.add(n.getKey());
  }
  dequeue() {
    return this.q.shift();
  }
}

class Node {
  constructor(list, node) {
    if(node) {
      this.list = list.slice(); // Shallow copy list
      var i = 0; // Insert new node in sorted order
      while(i < this.list.length && this.list[i].value < node.value) {
        i++;
      }
      this.list.splice(i, 0, node);
    } else {
      this.list = list.map(v => new PathNode(v)).sort(PathNode.compare);
    }
  }
  getKey() {
    return this.list.reduce((a, v) => a + ',' + v.value, '');
  }
}

class PathNode {
  constructor(value, op, left, right) {
    this.value = value;
    this.op = op;
    this.left = left;
    this.right = right;
  }
  print() {
    if(this.op) {
      return `${this.value} = (${this.left.print()}) ${this.op} (${this.right.print()})`;
    }
    return this.value;
  }
  static compare(a, b) {
    return a.value - b.value;
  }
}
