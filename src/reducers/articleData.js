import {
  LOAD_DATA,
  SAVE_DATA,
  UPDATE_ARTICLE,
  LOAD_LIST,
  UPDATE_TITLE,
} from '../constants/ActionTypes'

export default function articleData(state={}, action) {
  switch (action.type) {
    case SAVE_DATA:
      return {
        ...state,
        stamp_id: action.stamp_id,
        stamp_list: action.stamp_list,
        titleMap: action.titleMap,
        saved: action.saved,
      }
    case LOAD_DATA:
      return {
        ...state,
        editorState: action.editorState,
        stamp_id: action.stamp_id,
        titleMap: action.titleMap,
      }
    case LOAD_LIST:
      return {
        ...state,
        stamp_list: action.stamp_list,
        titleMap: action.titleMap,
      }
    case UPDATE_ARTICLE:
      return {
        ...state,
        editorState: action.editorState,
      }
    case UPDATE_TITLE:
      return {
        ...state,
        titleMap: action.titleMap,
      }
    default: 
      return state
  }
}
