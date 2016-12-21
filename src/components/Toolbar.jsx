import React, { Component } from 'react'
import { canAddLink, createLinkEntity, insertLinkEntity} from '../utils/LinkUtils'
import { insertMediaBlock } from '../utils/MediaUtils'

class Toolbar extends Component {

  handleToggleLink = () => {
    const { editorState, onChange } = this.props
    if (canAddLink(editorState)) {
      const entityKey = createLinkEntity()
      onChange(insertLinkEntity(editorState, entityKey))
    }
  }

  handleAddMedia = () => {
    const { editorState, onChange } = this.props
    onChange(insertMediaBlock(editorState))
  }

  btnMaker = (name, f) => {
    return (
      <button
        className='btn'
        onClick={f}>
        {name}
      </button>
    )
  } 

  render() {
    return (
      <div className='toolbar'>
        {this.btnMaker('LINK', this.handleToggleLink)}
        {this.btnMaker('MEDIA', this.handleAddMedia)}
        {this.btnMaker('LOG', this.props.handleLogger)}
      </div>
    )
  }
}

export default Toolbar
