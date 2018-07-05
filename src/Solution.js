import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Path from './Path';
import './Solution.css';

export default class Solution extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
    if(window.Worker) {
      this.worker = new Worker('search.js');
      this.worker.addEventListener('message', e => this.onMessage(e.data));
    }
    this.toggleSolution = this.toggleSolution.bind(this);
  }

  getInitState() {
    return { complete: false, time: 0, paths: [], showSolution: false };
  }

  onMessage(m) {
    switch(m.type) {
      case 'GOAL':
        this.state.paths.push(m.path);
        this.setState({ paths: this.state.paths });
        break;
      case 'CLOSEST': this.setState({ closest: m.path }); break;
      case 'DONE': this.setState({ complete: true, time: m.time }); break;
      default: console.error('Unknown message from worker');
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.numbers !== this.props.numbers ||
      prevProps.goal !== this.props.goal) {
      this.setState(this.getInitState());
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

  print(p) {
    // TODO change this to draw tree (and overlapping list of trees)
    if(p.op) {
      return `${p.value} = (${this.print(p.left)}) ${p.op} (${this.print(p.right)})`;
    }
    return p.value;
  }

  toggleSolution() {
    this.setState({ showSolution: !this.state.showSolution });
  }

  render() {
    if(!this.props.goal) {
      return <div></div>;
    }
    return (
      <div>
        <div className="spacing">
          <span>Found {this.state.paths.length} unique solutions. </span>
          { this.state.complete &&
              <span>Search completed in {this.state.time} seconds. </span>
          }
          <Button variant="contained" color="primary"
            onClick={this.toggleSolution}>
            { this.state.showSolution ? "Hide" :
              this.state.paths.length > 1 ? "Show solutions" :
              this.state.paths.length > 0 ? "Show solution" : "Show nearest"
            }
          </Button>
        </div>
        { this.state.showSolution &&
            <div>
              {this.state.paths.map((m, i) => <div><Path key={i} node={m}/></div>)}
              {this.state.paths.length === 0 && this.state.closest && 
                  <div>
                    <div>Closest found: {this.state.closest.value}</div>
                    <Path node={this.state.closest}/>
                  </div>
              }
            </div>
        }
      </div>
    );
  }
}
