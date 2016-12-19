import { Component } from 'react'
import { Editor, EditorState } from 'draft-js'
import { connect } from 'react-redux'
import {
  saveData,
  loadData,
  updateArticle,
} from '../actions'

require('css/app.styl')

class App extends Component {
  constructor(props) {
    super(props)
    this.onChange = (editorState) => {this.props.updateArticle(editorState)}
  }

  componentDidMount() {
    this.refs.editor.focus()
  }

  saveArticle = () => {
    const { saveData, keyId } = this.props
    saveData(keyId)
  }

  handleSelect = (e) => {
    const key = e.target.value
    this.props.loadData(key)
  }

  render() {
    const {editorState, keyId, keyList} = this.props
    return (
      <div className='gakki-editor'>
        <select onChange={this.handleSelect} value={keyId}>
          <option value='new'>New Item</option>
          { keyList.map((d) => (<option value={d}>{d}</option>)) } 
        </select>
        <button
          type='button'
          onClick={this.saveArticle}>Save</button>
        <Editor
          ref='editor'
          editorState={editorState}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { editorState, key, keyList, saved } = state.articleData
  return {
    editorState,
    keyId: key,
    keyList,
    saved,
  }
}

export default connect(mapStateToProps, {
  saveData,
  loadData,
  updateArticle
})(App)
