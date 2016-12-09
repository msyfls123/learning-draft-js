import { Component } from 'react'
import {Editor, 
        EditorState, 
        RichUtils,
        getDefaultKeyBinding,
        KeyBindingUtil,
        convertToRaw,
        convertFromRaw} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil

require('../css/editor.styl')

class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()}
    this.onChange = (editorState) => this.setState({editorState})
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this._onBoldClick = this._onBoldClick.bind(this)
  }

  _onBoldClick() {
    console.log('bold')
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newState) {
      this.onChange(newState)
      return 'handled'
    }
    if (command === 'myeditor-save') {
      const currState = this.state.editorState.getCurrentContent()
      localStorage['contentState'] = JSON.stringify(convertToRaw(currState))
      console.log(currState)
      console.log('Save')
    }
    return 'not-handled'
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
    const {editorState} = this.state
    return (
      <div className='gakki'>
        <button onClick={this._onBoldClick}>Bold</button>
        <Editor 
          editorState={editorState} 
          onChange={this.onChange} 
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={myKeyBindingFn}
        />
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
