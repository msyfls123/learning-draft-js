import {
  LOAD_DATA,
  SAVE_DATA,
  UPDATE_ARTICLE,
} from '../constants/ActionTypes'

export default function articleData(state={}, action) {
  switch (action.type) {
    case SAVE_DATA:

      return {
        ...state,
        key: action.key,
        keyList: action.keyList,
        saved: action.result,
      }
    case LOAD_DATA:
      return {
        ...state,
        editorState: action.editorState,
        keyList: action.keyList,
        key: action.key,
      }
    case UPDATE_ARTICLE:
      return {
        ...state,
        editorState: action.editorState,
      }
    default: 
      return state
  }
}
