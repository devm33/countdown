import React, { Component } from 'react';
import Board from './Board';
import Selector from './Selector';
import Solution from './Solution';
import Clock from './Clock';
import Goal from './Goal';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goal: 0,
      numbers: ['','','','','',''],
      countdown: 30,
      isClockOn: false,
    };
    this.setNumbers = this.setNumbers.bind(this);
    this.onClockUpdate = this.onClockUpdate.bind(this);
    this.onClockDone = this.onClockDone.bind(this);
  }

  onClockUpdate(s) {
    this.setState({ countdown: s });
  }

  onClockDone(s) {
    this.setState({ countdown: 30, isClockOn: false });
  }

  setNumbers(n, g) {
    this.setState({ numbers: n, goal: g, isClockOn: true, countdown: 30 });
  }

  render() {
    return (
      <div className="flex">
        <div className="center">
          <Board chars={['C', 'O', 'U', 'N', 'T', 'D', 'O', 'W', 'N', ]}/>
          <Selector setNumbers={this.setNumbers}/>
          <Solution numbers={this.state.numbers} goal={this.state.goal}/>
        </div>
        <div className="center">
          <Goal goal={this.state.goal}/>
          <Board chars={this.state.numbers}/>
          <Clock seconds={this.state.countdown} isOn={this.state.isClockOn}
          update={this.onClockUpdate} done={this.onClockDone} />
          {this.state.countdown}
        </div>
      </div>
    );
  }
}
