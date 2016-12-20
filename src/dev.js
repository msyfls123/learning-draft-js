import React, {Component} from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from 'components/Editor'
import { configureStore } from './store/configureStore' 
import { EditorState } from 'draft-js'

console.log(NODE_ENV)

var rootEle = document.querySelector('#app')

const store = configureStore({
  articleData: {
    editorState: EditorState.createEmpty(),
    stamp_list: [],
    titleMap: {},
    saved: false,
  },
})

render(
  (
    <Provider store={store}>
      <div>
        <h1> here is your editor </h1>
        <App />
      </div>
    </Provider>
  ),
  rootEle
)
