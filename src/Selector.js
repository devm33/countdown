import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import './Selector.css';

const SMALLS = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
const BIGINS = [25,50,75,100];

export default class Selector extends Component {
  constructor(props) {
    super(props);
    this.pick = this.pick.bind(this);
  }

  pick(small, big) {
    return this.pick_.bind(this, small, big);
  }

  pick_(s, b) {
    this.props.setNumbers(
      [].concat(choose(b, BIGINS), choose(s, SMALLS)),
      Math.floor(Math.random() * 900) + 101
    );
  }

  render() {
    return (
      <div className="Selector">
        Choose from:
        <Button variant="contained" onClick={this.pick(6,0)}>
          All Small
        </Button>
        <Button variant="contained" onClick={this.pick(5,1)}>
          Five Small
        </Button>
        <Button variant="contained" onClick={this.pick(4,2)}>
          Four Small
        </Button>
        <Button variant="contained" onClick={this.pick(3,3)}>
          Three of each
        </Button>
        <Button variant="contained" onClick={this.pick(2,4)}>
          Two Small
        </Button>
      </div>
    );
  }
}

function choose(n, a) {
  var l = a.length;
  if(n > l) {
    throw new RangeError(`Cannot choose ${n} from ${l} elements.`);
  }
  var r = new Array(n);
  var t = new Array(l);
  while(n--) {
    var x  = Math.floor(Math.random() * l);
    r[n] = a[x in t ? t[x] : x];
    t[x] = --l;
  }
  return r;
}
