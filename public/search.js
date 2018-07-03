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
  var q = [a.sort(numericCompare)];
  var s = {};
  var c;
  while(q.length > 0) {
    // TODO should sort queue by heuristic
    c = q.shift();
    addNeighbors(q, s, g, c);
  }
  postMessage({ text: 'Search done' });
}

function addNeighbors(q, s, g, a) {
  for(var i = 0; i < a.length - 1; i++) {
    for(var j = i + 1; j < a.length; j++) {
      // Addition
      var t = a[i] + a[j];
      if(isValidIntermediate(t)) {
        enqueue(q, s, g, createNewList(a, t, i, j));
      }
      // Subtraction
      t = a[i] - a[j];
      // TODO skip if a[i]-a[j] == a[j]
      if(isValidIntermediate(t)) {
        enqueue(q, s, g, createNewList(a, t, i, j));
      }
      // Multiplication
      // TODO skip multiplying by 1
      t = a[i] * a[j];
      if(isValidIntermediate(t)) {
        enqueue(q, s, g, createNewList(a, t, i, j));
      }
      // Division
      // TODO skip dividing by 1 and 0
      t = a[i] / a[j];
      if(isValidIntermediate(t)) {
        enqueue(q, s, g, createNewList(a, t, i, j));
      }
    }
  }
}

function enqueue(q, s, g, l) {
  if(l.includes(g)) {
    postMessage({ text: `Goal found ${l}` });
    q.splice(0,q.length); // TODO remove hack to stop search
  }
  if(l.length === 1) {
    return;
  }
  if(l.toString() in s) {
    return;
  }
  s[l.toString()] = true;
  q.push(l);
}

function createNewList(a, t, i, j) {
  return [].concat(
    a.slice(0, i),
    t,
    a.slice(i, j-1),
    a.slice(j+1)
  ).sort(numericCompare);
}

function isValidIntermediate(n) {
  // No negative or fractional intermediates allowed
  return n >= 0 && n % 1 === 0;
}

function numericCompare(a, b) {
  return a - b;
}
