import { combineReducers } from 'redux'

import articleData from './articleData'
import linkEditor from './linkEditor'
import subEditor from './subEditor'

const RootReducer = combineReducers({
  articleData,
  linkEditor,
  subEditor,
})

export default RootReducer
