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
        return;
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
      var l = [].concat(a.slice(0,i), a.slice(i,j-1), a.slice(j+1));
      var t = a[i] + a[j];
      if(isValidIntermediate(t)) {
        r.push(new Node([t].concat(l), `${a[i]} + ${a[j]}`, n));
      }
      t = a[i] - a[j];
      // TODO skip if a[i]-a[j] == a[j]
      if(isValidIntermediate(t)) {
        r.push(new Node([t].concat(l), `${a[i]} - ${a[j]}`, n));
      }
      // TODO skip multiplying by 1
      t = a[i] * a[j];
      if(isValidIntermediate(t)) {
        r.push(new Node([t].concat(l), `${a[i]} * ${a[j]}`, n));
      }
      // TODO skip dividing by 1 and 0
      t = a[i] / a[j];
      if(isValidIntermediate(t)) {
        r.push(new Node([t].concat(l), `${a[i]} / ${a[j]}`, n));
      }
    }
  }
  return r;
}

function isValidIntermediate(n) {
  // No negative or fractional intermediates allowed
  return n >= 0 && n % 1 === 0;
}

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
