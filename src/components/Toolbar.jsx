import React, { Component } from 'react'
import {canAddLink, createLinkEntity, insertLinkEntity} from '../utils/LinkUtils'

class Toolbar extends Component {
  handleToggleLink = () => {
    const { editorState, onChange } = this.props
    if (canAddLink(editorState)) {
      const entityKey = createLinkEntity()
      onChange(insertLinkEntity(editorState, entityKey))
      console.log(1)
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
      </div>
    )
  }
}

export default Toolbar
