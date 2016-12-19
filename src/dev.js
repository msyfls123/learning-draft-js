import React, {Component} from 'react'
import {render} from 'react-dom'
import App from 'components/Editor'
import { configureStore } from './store/configureStore' 
import { Provider } from 'react-redux'
import { EditorState } from 'draft-js'
import { loadData } from './actions'

console.log(NODE_ENV)

var rootEle = document.querySelector('#app')

const store = configureStore({
  articleData: {
    editorState: EditorState.createEmpty(),
    key: +(new Date()),
    keyList: [],
    saved: false,
  },
})

store.dispatch(loadData(null))

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
