import React, { PureComponent } from 'react';

export default class Solution extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { solution: [] };
    this.worker = new Worker('search.js');
    this.worker.addEventListener('message', e => {
      this.setState({ solution: this.state.solution.concat([e.data]) });
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.numbers !== this.props.numbers ||
      prevProps.goal !== this.props.goal) {
      this.setState({ solution: [] });
      this.worker.postMessage({
        cmd: 'start',
        numbers: this.props.numbers,
        goal: this.props.goal,
      });
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
