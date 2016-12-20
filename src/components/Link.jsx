import React, { Component } from 'react'
import { Entity } from 'draft-js'

class Link extends Component {

  showLinkEditor = () => {
    this.props.showLinkEditor(this.props.entityKey, this.refs.link)
  }

  handleMouseEnter = (e) => {
    if (e.nativeEvent.which === 1 || e.nativeEvent.buttons) { return } // dragging / selecting
    this.showLinkEditor()
  }

  componentWillReceiveProps = (props) => {
    return true
  }

  render() {
    const { entityKey } = this.props
    const url = Entity.get(entityKey).getData().url

    return (
      <a
        href={url}
        ref='link'
        className='link'
        data-entity-key={entityKey}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={(e) => this.props.onMouseLeaveLink(e, entityKey)}
        target='_blank'>
        {this.props.children}
      </a>
    )
  }
}

export default Link
