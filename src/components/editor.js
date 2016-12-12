import { Component } from 'react'
import {Editor, 
        EditorState, 
        ContentState,
        Modifier,
        RichUtils,
        getDefaultKeyBinding,
        KeyBindingUtil,
        convertToRaw,
        convertFromRaw} from 'draft-js';
import {ColorControls, colorStyleMap} from './color'
const {hasCommandModifier} = KeyBindingUtil

require('../css/editor.styl')

class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      saved: true
    }
    this.onChange = this.onChange.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this._onBoldClick = this._onBoldClick.bind(this)
    this.saveState = this.saveState.bind(this)
    this.logState = this.logState.bind(this)
    this.reverse = this.reverse.bind(this)
    this.select = this.select.bind(this)
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor)
    this.focus = () => this.refs.editor.focus()
  }

  _toggleColor(toggledColor) {
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    const nextContentState = Object.keys(colorStyleMap)
      .reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor        
      );
    }

    this.onChange(nextEditorState);
  }

  _onBoldClick() {
    console.log('bold')
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  reverse() {
    let contentState = this.state.editorState.getCurrentContent()
    const blockArray = contentState.getBlocksAsArray()
    blockArray.reverse()
    contentState = ContentState.createFromBlockArray(blockArray)
    const editorState = EditorState.createWithContent(contentState)
    this.setState({editorState})
    console.log('Reversed')
  }

  onChange(editorState) {
    this.setState({
      editorState,
      saved: false
    })
  }

  logState() {
    const contentState = this.state.editorState.getCurrentContent()
    console.log(contentState.getBlocksAsArray())
  }

  select() {
    const selection = this.state.editorState.getSelection()
    const editorState = this.state.editorState
    const newState = RichUtils.toggleBlockType(editorState, 'header-two')
    this.setState({
      editorState: newState
    })
    console.log(selection.getFocusKey(), RichUtils.getCurrentBlockType(editorState))
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newState) {
      this.onChange(newState)
      return 'handled'
    }
    if (command === 'myeditor-save') {
      this.saveState()
    }
    return 'not-handled'
  }

  saveState() {
    const currState = this.state.editorState.getCurrentContent()
    localStorage['contentState'] = JSON.stringify(convertToRaw(currState))
    this.setState({
      saved: true
    })
    console.log(convertToRaw(currState))
    console.log('Save')
  }

  componentDidMount() {
    const rawData = localStorage['contentState']
    const data = rawData ? JSON.parse(rawData) : null
    const state = data ? EditorState.createWithContent(convertFromRaw(data)) : EditorState.createEmpty()
    this.setState({
      editorState: state
    })
  }

  render() {
    const editorState = this.state.editorState
    return (
      <div className='gakki'>
        <div className='toolbar'>
          <button onClick={this._onBoldClick}>Bold</button>
          <button onClick={this.logState}>Log State</button>
          <button onClick={this.reverse}>Reverse</button>
          <button onClick={this.select}>H2: toggle</button>
          <button onClick={this.saveState}>Save</button>
          <ColorControls
            editorState={editorState}
            onToggle={this.toggleColor}
          />
          <label>{this.state.saved?'已保存':'未保存'}</label>
        </div>
        <div onClick={this.focus}>
          <Editor 
            customStyleMap={colorStyleMap}
            editorState={editorState} 
            onChange={this.onChange} 
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={myKeyBindingFn}
            ref='editor'
          />
        </div>
        </div>
    )
  }
}

function myKeyBindingFn(e) {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

export {
  MyEditor
}
