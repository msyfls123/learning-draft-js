import { combineReducers } from 'redux'

import articleData from './articleData'

const RootReducer = combineReducers({
  articleData: articleData,
})

export default RootReducer
