import { Component } from 'react'
import { findDOMNode } from 'react-dom'
import {
  Editor,
  Entity,
  EditorState,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js'
import { connect } from 'react-redux'
import {
  saveData,
  loadData,
  updateArticle,
  trySaveTitleMap,
  tryLoadList,
  showLinkEditor,
  keepLinkEditor,
  hideLinkEditor,
  toggleSubEditor,
} from '../actions'

import Toolbar from 'components/Toolbar'
import LinkEditor from 'components/LinkEditor'
import createLinkDecorator from '../decorators/LinkDecorator'
import * as LinkUtils from '../utils/LinkUtils'
import * as SelectionUtils from '../utils/SelectionUtils'
import Media from './Media'

require('css/app.styl')

class App extends Component {
  constructor(props) {
    super(props)
    this.onChange = (editorState) => {this.props.updateArticle(editorState)}
    this.state = {
      title: '',
    }

    const LinkDecorator = createLinkDecorator({
      showLinkEditor: this.showLinkEditor,
      onMouseLeaveLink: (e) => {
        const relatedTarget = e.nativeEvent.relatedTarget ||
          e.nativeEvent.explicitOriginalTarget
        if (
          !relatedTarget ||
          relatedTarget.className.indexOf('link-editor') === -1
        ) {
          this.props.hideLinkEditor()
        }
      },
    })

    this.decorator = new CompositeDecorator([
      LinkDecorator
    ])

    this.props.tryLoadList()
    this.props.loadData(null, this.decorator)
  }

  componentDidMount() {
    setTimeout(() => { this.refs.editor.focus() }, 10)
  }

  componentWillReceiveProps(nextProps) {
    const {stamp_id, titleMap} = nextProps
    const now_id = this.props.stamp_id
    if (now_id === stamp_id) {
      return
    }
    if (!stamp_id || stamp_id === 'new') { 
      this.setState({title: ''})
    } else {
      this.setState({
        title: titleMap[stamp_id] ? titleMap[stamp_id] : ''
      })
    }
  } 

  blockRenderer = (contentBlock) => {
    const type = contentBlock.getType()
    if (type === 'atomic') {
      return {
        component: Media,
        editable: false,
        props: {
          updateEntity: this.updateEntity,
          onFocus: this.onSubEditorFocus,
          onBlur: this.onSubEditorBlur,
        }
      }
    }
  }

  onSubEditorFocus = (block) => {
    setTimeout(() => {
      const { editorState } = this.props
      this.props.toggleSubEditor(true)
      this.onChange(
        SelectionUtils.forceSelectionWithoutFocus(editorState, block)
      )
    }, 0)
  }

  onSubEditorBlur = () => {
    this.props.toggleSubEditor(false)
    this.focusEditor()
  }

  focusEditor = () => {
    setTimeout(() => { this.refs.editor.focus }, 0)
  }

  updateEntity = (entityKey, data) => {
    Entity.mergeData(entityKey, data)
    this.saveArticle()
  }

  handleLogger = () => {
    const { editorState } = this.props
    const content = convertToRaw(editorState.getCurrentContent())
    console.log('Content: ', content)
    console.log('Props: ', this.props)
  }

  saveArticle = () => {
    const { saveData, stamp_id } = this.props
    const title = this.state.title
    saveData(stamp_id, title)
  }

  handleSelect = (e) => {
    const stamp_id = e.target.value
    this.props.loadData(stamp_id, this.decorator)
  }

  handleTitleChange = (e) => {
    const title = e.target.value
    this.setState({
      title,
    })
  }

  handleTitleBlur = () => {
    const { stamp_id, trySaveTitleMap} = this.props
    const title = this.state.title
    if (!stamp_id) { return }
    trySaveTitleMap(stamp_id, title)
  }

  getInlineTipPosition(targetDOMNode) {
    const editor = findDOMNode(this.refs.editor)
    if (!editor) {
       // NOTE: Anti-pattern, here it might be called before first render.
       // Mostly caused by the buggy contentState load from local.
       return
    }
    const editorRect = editor.getBoundingClientRect()
    const targetRect = targetDOMNode.getBoundingClientRect()
    return {
      top: targetRect.top - editorRect.top,
      left: targetRect.left - editorRect.left + targetRect.width/2,
    }
  }

  showLinkEditor = (entityKey, targetDOMNode) => {
    if (this.props.linkEditor.show) {
      return
    }
    const position = this.getInlineTipPosition(targetDOMNode)
    // Prevent being closed by clickoutside
    setTimeout(() => {
      this.props.showLinkEditor(position, entityKey)
    }, 0)
  }

  handleLinkEditConfirm = (entityKey, url) => {
    LinkUtils.updateLink(entityKey, url)
    this.saveArticle()
    this.props.hideLinkEditor()
  }

  render() {
    const {editorState, stamp_id, stamp_list, titleMap, linkEditor, readOnly} = this.props
    const selectMap = stamp_list.map((d) => (
            <option value={d}>
              {titleMap[d] ? titleMap[d] : d}
            </option>
          ))
    return (
      <div id='richEditor' className='gakki-editor'>

        <div className='menu'>
          <select 
            className='select select-left'
            onChange={this.handleSelect}
            value={stamp_id}>
            <option value='new'> New Item </option>
            {selectMap}
          </select>

          <button
            className='btn btn-right'
            type='button'
            onClick={this.saveArticle}>Save</button>
        </div>

        <Toolbar
          editorState={editorState}
          onChange={this.onChange}
          handleLogger={this.handleLogger}
        />

        <textarea
          className='titleEditor'
          rows='1'
          maxLength='25'
          placeholder='Title'
          onChange={this.handleTitleChange}
          onBlur={this.handleTitleBlur}
          value={this.state.title}
        />

        {linkEditor.show &&
          <LinkEditor
            {...linkEditor}
            onConfirm={this.handleLinkEditConfirm}
            hideLinkEditor={this.props.hideLinkEditor}
            keepLinkEditor={this.props.keepLinkEditor}
          />
        }

        <Editor
          ref='editor'
          blockRendererFn={this.blockRenderer}
          editorState={editorState}
          onChange={this.onChange}
          readOnly={readOnly}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editorState, stamp_id, stamp_list, titleMap, saved } = state.articleData
  const { linkEditor } = state
  return {
    editorState,
    readOnly: state.subEditor.actived,
    stamp_id,
    stamp_list,
    titleMap,
    saved,
    linkEditor,
  }
}

export default connect(mapStateToProps, {
  saveData,
  loadData,
  updateArticle,
  trySaveTitleMap,
  tryLoadList,
  showLinkEditor,
  keepLinkEditor,
  hideLinkEditor,
  toggleSubEditor,
})(App)
