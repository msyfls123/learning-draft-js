import React, { Component } from 'react'
import {canAddLink, createLinkEntity, insertLinkEntity} from '../utils/LinkUtils'

class Toolbar extends Component {
  handleToggleLink = () => {
    const { editorState, onChange } = this.props
    if (canAddLink(editorState)) {
      const entityKey = createLinkEntity()
      onChange(insertLinkEntity(editorState, entityKey))
    }
  }
  render() {
    return (
      <div className='toolbar'>
        <button 
          className='btn' 
          onClick={this.handleToggleLink}>
          Link
        </button>
        <button 
          className='btn' 
          onClick={this.props.handleLogger}>
          Log
        </button>
      </div>
    )
  }
}

export default Toolbar
