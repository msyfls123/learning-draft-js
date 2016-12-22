import React, { Component, PropTypes } from 'react'

export default class ClickOutside extends Component {
  static propTypes = {
    onClickOutside: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
    eventType: PropTypes.string,
  }

  static defaultProps = {
    eventType: 'click'
  }
  render() {
    /*eslint no-unused-vars: 0*/
    // Do not pass 'onClickOutside' to the <div />
    // https://facebook.github.io/react/warnings/unknown-prop.html
    const { children, onClickOutside, eventType, ...props } = this.props
    return <div {...props} ref='container'>{children}</div>
  }

  componentDidMount() {
    document.addEventListener(this.props.eventType, this.handle, true)
  }

  componentWillUnmount() {
    document.removeEventListener(this.props.eventType, this.handle, true)
  }

  handle = e => {
    const { onClickOutside } = this.props
    const el = this.refs.container
    if (!el.contains(e.target)) {
      onClickOutside(e)
    }
  }
}
