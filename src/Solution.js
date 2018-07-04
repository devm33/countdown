import React, { PureComponent } from 'react';

export default class Solution extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
    if(window.Worker) {
      this.worker = new Worker('search.js');
      this.worker.addEventListener('message', e => this.onMessage(e.data));
    }
  }

  getInitState() {
    return { complete: false, time: 0, paths: [] };
  }

  onMessage(m) {
    switch(m.type) {
      case 'GOAL':
        this.state.paths.push(m.path);
        this.setState({ paths: this.state.paths });
        break;
      case 'DONE': this.setState({ complete: true, time: m.time }); break;
      default: console.error('Unknown message from worker');
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.numbers !== this.props.numbers ||
      prevProps.goal !== this.props.goal) {
      this.setState({ complete: false, solution: [] });
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
    if(!this.props.goal) {
      return <div></div>;
    }
    return (
      <div>
        <div>
          { this.state.complete &&
              <div>Search completed in {this.state.time} seconds.</div>
          }
          <div>Found {this.state.paths.length} unique solutions.</div>
          <ul>
            {this.state.paths.map((m, i) => <li key={i}>{print(m)}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

function print(p) {
  if(p.op) {
    return `${p.value} = (${print(p.left)}) ${p.op} (${print(p.right)})`;
  }
  return p.value;
}
