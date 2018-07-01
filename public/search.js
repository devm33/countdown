
addEventListener('message', function(e) {
  var data = e.data;
  if(data.cmd === 'start') {
    postMessage(`Beginning search for ${data.goal} in ${data.numbers}`);
    search(data.numbers, data.goal);
  }
}, false);

function search(a, g) {
  var q = [a.sort(numericCompare)];
  var s = {};
  var c;
  var safety = 0;
  while(q.length > 0) {
    // TODO should sort queue by heuristic
    c = q.shift();
    addNeighbors(q, s, g, c);

    if(safety++ > 80000) {
      postMessage('Safety break! ' + q.length);
      return;
    }
    if(safety % 1000 === 0) {
      postMessage('Q length is ' + q.length + ' current is ' + c);
    }
  }
  postMessage('Search done');
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
      if(isValidIntermediate(t)) {
        enqueue(q, s, g, createNewList(a, t, i, j));
      }
      // Multiplication
      t = a[i] * a[j];
      if(isValidIntermediate(t)) {
        enqueue(q, s, g, createNewList(a, t, i, j));
      }
      // Division
      t = a[i] / a[j];
      if(isValidIntermediate(t)) {
        enqueue(q, s, g, createNewList(a, t, i, j));
      }
    }
  }
}

function enqueue(q, s, g, l) {
  if(l.includes(g)) {
    postMessage('Goal found');
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
