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
  var q = new Queue();
  q.enqueue(new Node(a));
  while(q.hasNext()) {
    for(var n of getNeighbors(q.dequeue())) {
      // Check for goal
      if(n.list.includes(g)) {
        postMessage({ text: `Goal found: ${n.path}` });
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
  for(var i = 0; i < a.length - 1; i++) {
    for(var j = i + 1; j < a.length; j++) {
      var l = a.filter((_, k) => k !== i && k !== j);
      for(var o of OPERATORS) {
        var t = o.f(a[i], a[j]);
        if(t === 0 || t === a[i] || t === a[j]) {
          continue; // Skipping since not useful
        }
        if(t < 0 || t % 1 !== 0) {
          continue; // Skipping since no negative or fractions allowed
        }
        r.push(new Node([t].concat(l), ` ${a[i]} ${o.s} ${a[j]} = ${t} `, n));
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

function numericCompare(a, b) {
  return a - b;
}

class Node {
  constructor(list, op, prev) {
    this.list = list.sort(numericCompare);
    if(prev) {
      this.path = prev.path.concat([op]);
    } else {
      this.path = [];
    }
  }
}

class Queue {
  constructor() {
    this.q = [];
    this.s = new Set();
  }
  hasNext() {
    return this.q.length > 0;
  }
  hasSeen(n) {
    return this.s.has(n.list.toString());
  }
  enqueue(n) {
    // TODO should sort the q by a heuristic
    this.q.push(n);
    this.s.add(n.toString());
  }
  dequeue() {
    return this.q.shift();
  }
}
