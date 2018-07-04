import React, { PureComponent } from 'react';

export default class Solution extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { solution: [] };
    if ('Worker' in window) {
      this.worker = new Worker('search.js');
      this.worker.addEventListener('message', e => {
        this.setState({ solution: this.state.solution.concat([e.data.text]) });
      });
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.numbers !== this.props.numbers ||
      prevProps.goal !== this.props.goal) {
      this.setState({ solution: [] });
      if(this.worker) {
        this.worker.postMessage({
          numbers: this.props.numbers,
          goal: this.props.goal,
        });
      } else {
        this.setState({ solution: ['Web Worker not supported'] });
      }
    }
  }

  render() {
    return (
      <code>
        {this.state.solution.map((m, i) => <div key={i}>{m}</div>)}
      </code>
    );
  }
}