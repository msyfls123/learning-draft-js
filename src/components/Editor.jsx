import { Component } from 'react'
import { Editor, EditorState } from 'draft-js'
import { connect } from 'react-redux'
import {
  saveData,
  loadData,
  updateArticle,
  trySaveTitleMap,
} from '../actions'

require('css/app.styl')

class App extends Component {
  constructor(props) {
    super(props)
    this.onChange = (editorState) => {this.props.updateArticle(editorState)}
    this.state = {
      title: '',
    }
  }

  componentDidMount() {
    this.refs.editor.focus()
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

  saveArticle = () => {
    const { saveData, stamp_id } = this.props
    const title = this.state.title
    saveData(stamp_id, title)
  }

  handleSelect = (e) => {
    const stamp_id = e.target.value
    this.props.loadData(stamp_id)
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

  render() {
    const {editorState, stamp_id, stamp_list, titleMap} = this.props
    const selectMap = stamp_list.map((d) => (
            <option value={d}>
              {titleMap[d] ? titleMap[d] : d}
            </option>
          ))
    return (
      <div className='gakki-editor'>

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

        <textarea
          className='titleEditor'
          rows='1'
          maxLength='25'
          placeholder='Title'
          onChange={this.handleTitleChange}
          onBlur={this.handleTitleBlur}
          value={this.state.title}
        />

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
  const { editorState, stamp_id, stamp_list, titleMap, saved } = state.articleData
  return {
    editorState,
    stamp_id,
    stamp_list,
    titleMap,
    saved,
  }
}

export default connect(mapStateToProps, {
  saveData,
  loadData,
  updateArticle,
  trySaveTitleMap,
})(App)
