import { Component } from 'react'
import {Editor, EditorState} from 'draft-js';

require('../css/editor.styl')

class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()}
    this.onChange = (editorState) => this.setState({editorState})
  }
  render() {
    const {editorState} = this.state
    return (
      <div className='gakki'>
        <Editor editorState={editorState} onChange={this.onChange} />
      </div>
    )
  }
}

export {
  MyEditor
}
