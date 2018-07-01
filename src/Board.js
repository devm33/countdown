import React, { Component } from 'react';
import './Board.css';

export default class Board extends Component {
  render() {
    return (
      <div className="Board">
        { this.props.chars.map((x,i) =>
          <div key={i} className="Letter">{x}</div>)
        }
      </div>
    );
  }
}

