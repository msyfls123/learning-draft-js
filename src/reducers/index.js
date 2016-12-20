import { combineReducers } from 'redux'

import articleData from './articleData'
import linkEditor from './linkEditor'

const RootReducer = combineReducers({
  articleData,
  linkEditor,
})

export default RootReducer
