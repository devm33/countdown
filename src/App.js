import React, { Component } from 'react';
import Board from './Board';
import Selector from './Selector';
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
    this.show = this.show.bind(this);
    this.setNumbers = this.setNumbers.bind(this);
    this.setGoal = this.setGoal.bind(this);
    this.onClockUpdate = this.onClockUpdate.bind(this);
    this.onClockDone = this.onClockDone.bind(this);
  }

  onClockUpdate(s) {
    this.setState({ countdown: s });
  }

  onClockDone(s) {
    this.setState({ countdown: 30, isClockOn: false });
  }


  setNumbers(n) {
    this.setState({ numbers: n, isClockOn: true, countdown: 30 });
  }

  setGoal(g) {
    this.setState({ goal: g });
  }

  show() {
    // TODO solve and display solutions
  }

  render() {
    return (
      <div className="flex">
        <div className="center">
          <Board chars={['C', 'O', 'U', 'N', 'T', 'D', 'O', 'W', 'N', ]}/>
          <Selector setNumbers={this.setNumbers} setGoal={this.setGoal}/>
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
