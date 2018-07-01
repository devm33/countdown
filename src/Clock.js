import React, { Component } from 'react';
import './Clock.css';

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.interval = false;
  }

  countdown() {
    if(!this.props.isOn) {
      return;
    }
    if(this.props.seconds > 0) {
      this.props.update(this.props.seconds - 1);
    } else {
      clearInterval(this.interval);
      this.interval = false;
      this.props.done();
    }
  }

  render() {
    var handStyle = {transform: `rotate(${180-6*this.props.seconds}deg)`};
    if(this.props.isOn && !this.interval) {
      this.interval = setInterval(() => this.countdown(), 1000);
    }
    return (
      <div className="Clock">
        <div className="Bar"></div>
        <div className="Tic" style={{transform: 'rotate(30deg)'}}></div>
        <div className="Tic" style={{transform: 'rotate(60deg)'}}></div>
        <div className="Bar" style={{transform: 'rotate(90deg)'}}></div>
        <div className="Tic" style={{transform: 'rotate(120deg)'}}></div>
        <div className="Tic" style={{transform: 'rotate(150deg)'}}></div>
        <div className="Tic" style={{transform: 'rotate(210deg)'}}></div>
        <div className="Tic" style={{transform: 'rotate(240deg)'}}></div>
        <div className="Tic" style={{transform: 'rotate(300deg)'}}></div>
        <div className="Tic" style={{transform: 'rotate(330deg)'}}></div>
        <div className="Hand" style={handStyle}></div>
      </div>
    );
  }
}
