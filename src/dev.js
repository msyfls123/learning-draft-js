import React, {Component} from 'react'
import {render} from 'react-dom'
import App from 'components/Editor'

console.log(NODE_ENV)

var rootEle = document.querySelector('#app')

render(
  (
    <div>
      <h1> here is your editor </h1>
      <App />
    </div>
  ),
  rootEle
)
