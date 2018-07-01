import React, { Component } from 'react';
import './Board.css';

export default class Board extends Component {
  render() {
    var chars = this.props.display.split('');
    return (
      <div className="Board">
        { chars.map((x,i) => <span key={i} className="Letter">{x}</span>) }
      </div>
    );
  }
}

