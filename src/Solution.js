import React, { Component } from 'react';

export default class Solution extends Component {
  constructor(props) {
    super(props);
    this.state = { solution: '' };
  }

  componentDidUpdate() {
    // TODO Perform a BFS to determine if a solution is possible
  }

  render() {
    return (
      <div>
        {this.state.solution}
      </div>
    );
  }
}

function getNeighbors(a) {
  n = [];
  for(var i = 0; i < a.length - 1; i++) {
    for(var j = i + 1; j < a.length; j++) {
      // TODO go through each pairing checking for validity, being the goal, and dupes
    }
  }

}

function validIntermediate(n) {
  // No negative or fractional intermediates allowed
  return n >= 0 && n % 1 == 0;
}
