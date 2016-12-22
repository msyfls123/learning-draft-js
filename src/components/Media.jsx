import React, { Component } from 'react'
import { EditorState, Entity } from 'draft-js'
import { MEDIA_TYPE } from '../constants/Draft'
import Keys from '../constants/Keys'
import ClickOutside from './ClickOutside'

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
      focus: false,
      type,
      url,
    }
  }

  componentWillMount = () => {
    document.addEventListener(
      'keydown',
      this.handleKeyOnFigure,
      false
    )
  }

  componentWillUnmount = () => {
    document.removeEventListener(
      'keydown',
      this.handleKeyOnFigure,
      false
    )

    if (this.state.editingMode) {
      this._finishEdit()
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

  componentDidUpdate(prevProps) {
    if (this.props.selection !== prevProps.selection && !this.state.editingMode) {
      this.updateSelection(this.props.selection)
    }
  }

  updateSelection(selectionState) {
    if (!isSelectionInBlock(selectionState, this.props.block)) {
      return
    }
    setTimeout(() => {
      this.handleFocus()
    }, 0)
  }

  _remove = () => {
     const blockKey = this.props.block.getKey()
     this.props.blockProps.onRemove(blockKey)
  }

  _finishEdit = () => {
    if (!this.state.editingMode) { return }
    this.handleBlur()
    this.props.blockProps.onFinish()
    this.setState({
      editingMode: false
    })
  }

  handleFocus = () => {
    this.setState({
      focus: true
    })
  }

  handleBlur = () => {
    this.setState({
      focus: false
    })
  }

  _startEdit = () => {
    if(this.state.editingMode) { return }
    this.props.blockProps.onStart(this.props.block)
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

  handleKeyOnFigure = (e) => {
    if (!this.state.focus) { return }
    const keyCode = e.keyCode
    const blockKey = this.props.block.getKey()

    switch (keyCode) {
      case Keys.BACKSPACE:
      case Keys.DELETE:
        e.preventDefault()
        this._remove()
        break
     case Keys.UP:
     case Keys.LEFT:
       this.props.blockProps.onArrow(blockKey, 'up')
       this._finishEdit()
       break
     case Keys.DOWN:
     case Keys.RIGHT:
       this.props.blockProps.onArrow(blockKey, 'down')
       this._finishEdit()
       break
     case Keys.RETURN:
       this._finishEdit()
       break
     }
  }

  handleClickOutside = (e) => {
    if (!this.state.editingMode) { return }
    if (!document.querySelector('.DraftEditor-root').contains(e.target)) { return }
    this._finishEdit()
    setTimeout(function() {
      triggerSelectEvent(e)
    }, 0)
  }

  handleConfirm = () => {
    const { block, blockProps } = this.props
    const entityKey = block.getEntityAt(0)
    const { updateEntity } = blockProps
    const { type, url } = this.state
    updateEntity(entityKey, {
      type,
      url,
    })
    this._finishEdit()
  }

  renderDisplayMode = (type, url) => {
    return [
      <p 
        className='media-info' onClick={this._startEdit}>
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
    const { type, url, editingMode, focus } = this.state

    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div 
          className={'custom-media' + (focus ? ' isFocus' : '')}
        >
          <ClickOutside onClickOutside={this.handleBlur}>
            <div onClick={this.handleFocus}>
              { MediaMap[type]({url}) }
            </div>
          </ClickOutside>
          { editingMode ? this.renderEditMode(type, url)
                        : this.renderDisplayMode(type, url)
          }
        </div>
      </ClickOutside>
    )
  }
}

function isSelectionInBlock(selection, block) {
  const key = block.getKey()
  return selection.getAnchorKey() === key &&
      selection.getFocusKey() === key
}

function triggerSelectEvent(e) {
  const event = new MouseEvent('mouseup', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: e.clientX,
    clientY: e.clientY,
  })
  e.target.dispatchEvent(event)
  document.querySelector('.public-DraftEditor-content').dispatchEvent(event)
}

export default Media
