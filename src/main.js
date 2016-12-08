import React, { Component } from 'react'
import {render} from 'react-dom'
import { MyEditor } from 'components/editor'

require('./css/RichEditor.css')

class Clock extends Component {
  constructor() {
    super();
    // set initial time:
    this.state = {
      time: Date.now()
    }
  }

  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now()  });
    }, 1000);
  }
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{ time  }</span>;
  }
}

class Root extends Component {
  render() {
    return (
      <div>
        <Clock />
        <div />
        <MyEditor />
      </div>
    )
  }
}

const rootEle = document.getElementById('app')
render(<Root />, rootEle)
