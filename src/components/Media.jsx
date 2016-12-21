import React, { Component } from 'react'
import { Entity } from 'draft-js'
import { MEDIA_TYPE } from '../constants/Draft'

const MediaMap = {
  audio: (props) => {
    return <audio controls src={props.url} />
  },

  image: (props) => {
    return <img src={props.url} />
  },

  video: (props) => {
    return <video controls src={props.url} />
  },
}

class Media extends Component {
  constructor(props) {
    super(props)
    const { block } = props
    const entity = Entity.get(block.getEntityAt(0))
    const data = entity.getData()
    const { type, url } = data
    this.state = {
      editingMode: false,
      type,
      url,
    }
  }

  componentWillReceiveProps = (props) => {
    const { block } = this.props
    const entity = Entity.get(block.getEntityAt(0))
    const data = entity.getData()
    const { type, url } = data
    if (url === this.state.url) return
    this.setState({
      type,
      url,
    })
  }

  toggleEditMode = () => {
    this.props.blockProps.onFocus(this.props.block)
    this.setState({
      editingMode: true
    })
  }

  handleTypeSelect = (e) => {
    const value = e.target.value
    this.setState({
      type: value
    })
  }

  handleInput = (e) => {
    const value = e.target.value
    this.setState({
      url: value
    })
  }

  handleConfirm = () => {
    const { block, blockProps } = this.props
    const entityKey = block.getEntityAt(0)
    const { updateEntity, onBlur } = blockProps
    const { type, url } = this.state
    this.setState({
      editingMode: false
    })
    updateEntity(entityKey, {
      type,
      url,
    })
    onBlur()
  }

  renderDisplayMode = (type, url) => {
    return [
      <p 
        className='media-info' onClick={this.toggleEditMode}>
        <span className='type'><em>{type}</em></span>
        <span className='url'><em>{url}</em></span>
      </p>
    ]
  }

  renderEditMode = (type, url) => {
    const optionsMap = ['audio', 'image', 'video'].map((d) => (
      <option value={d}> {d} </option>
    ))
    return (
      <div className='media-modify'>
        <select 
          value={this.state.type} 
          onChange={this.handleTypeSelect}>
          {optionsMap}
        </select>
        <input
          type='url'
          value={url}
          onChange={this.handleInput}
        />
        <button type='button' onClick={this.handleConfirm}>
          >
        </button>
      </div>
    )
  }

  render() {
    const { block, blockProps } = this.props
    const { type, url, editingMode } = this.state

    return (
      <div 
        className='custom-media'>
        { MediaMap[type]({url}) }
        { editingMode ? this.renderEditMode(type, url)
                      : this.renderDisplayMode(type, url)
        }
      </div>
    )
  }
}

export default Media
