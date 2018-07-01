import React, { Component } from 'react';
import './Goal.css';

export default class App extends Component {
  render() {
    var g = ('000' + this.props.goal).substr(-3);
    return (
      <div className="Goal">
        {g}
      </div>
    );
  }
}
