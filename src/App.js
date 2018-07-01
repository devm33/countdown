import React, { Component } from 'react';
import Board from './Board';
import Button from '@material-ui/core/Button';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { numbers: [] };
    this.pick = this.pick.bind(this);
    this.show = this.show.bind(this);
  }

  pick(small, big) {
    return this.pick_.bind(this, small, big);
  }

  show() {
    // TODO solve and display solutions
  }

  render() {
    return (
      <div>
        <Board display="COUNTDOWN"/>
        <div className="Buttons">
          <Button variant="contained" onClick={pick(4,2)}>
            The normal (4 small, 2 big)
          </Button>
          <Button variant="contained" onClick={this.pick(6,0)}>
            All Small
          </Button>
          <Button variant="contained" onClick={this.pick(1,5)}>
            One Small
          </Button>
          <Button variant="contained" onClick={this.pick(0,6)}>
            All Big
          </Button>
          <Button variant="contained" onClick={this.pick(5,1)}>
            One Big
          </Button>
          <Button variant="contained" onClick={this.pick(3,3)}>
            Three of each
          </Button>
          <Button variant="contained" color="primary" onClick={this.show}>
            Show answers
          </Button>
        </div>
      </div>
    );
  }
}
