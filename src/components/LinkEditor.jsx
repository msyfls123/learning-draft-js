import React, { Component } from 'react'
import { Entity } from 'draft-js'

class LinkEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  componentWillMount() {
    this.initValue(this.props)
  }

  componentWillReceiveProps(props) {
    if (props.entityKey !== this.props.entityKey) {
      this.initValue(props)
    }
  }

  initValue = (props) => {
    const url = Entity.get(props.entityKey).getData().url
    this.setState({
      value: url
    })
  }

  handleChange = (e) => {
    const { changeUrl, entityKey } = this.props
    changeUrl(entityKey, e.target.value)
  }

  handleMouseEnter = () => {
    const { keepLinkEditor, entityKey } = this.props
    keepLinkEditor(entityKey)
  }

  handleMouseLeave = (e) => {
    const { entityKey, hideLinkEditor } = this.props
    const relatedTarget = e.nativeEvent.relatedTarget ||
      e.nativeEvent.explicitOriginalTarget
    const relatedLink = closest(relatedTarget, (el) => el.className === 'link')

    if (
      !relatedLink ||
      relatedLink.getAttribute('data-entity-key') !== entityKey
    ) {
      hideLinkEditor()
    }
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  handleConfirm = () => {
    const { entityKey, onConfirm } = this.props
    const { value } = this.state
    onConfirm(entityKey, value)
  }

  render() {
    const { position, url } = this.props
    const { value } = this.state
    const styleMap = {
      top: position.top + 70,
      left: position.left - 40,
    }
    return (
      <div 
        className='link-editor'
        style={styleMap}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onChange={this.handleChange}
      >
        <input type='url' 
          value={value}
          placeholder='Input a URL'
          onChange={this.handleChange}
        />
        <a className='link-submit' onClick={this.handleConfirm}>›</a>
      </div>
    )
  }
}

function closest(el, predicate) {
  if (!el || el.className === 'public-DraftEditor-content') { return null }
  if (predicate(el)) { return el }
  return closest(el.parentElement, predicate)
}

export default LinkEditor
