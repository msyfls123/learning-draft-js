import { Component } from 'react'
import { Editor, EditorState } from 'draft-js'

require('css/app.styl')

class App extends Component {
  constructor(props) {
    super(props)
    this.onChange = (editorState) => {this.setState({editorState})}
    
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  componentDidMount() {
    this.refs.editor.focus()
  }

  render() {
    const {editorState} = this.state
    return (
      <div className='gakki-editor'>
        <Editor
          ref='editor'
          editorState={editorState}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default App
