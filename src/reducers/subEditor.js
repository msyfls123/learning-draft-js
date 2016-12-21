import { TOGGLE_SUBEDITOR, } from '../constants/ActionTypes'

export default function inlineToolbar(state={ actived: false }, action) {
  switch(action.type) {
    case TOGGLE_SUBEDITOR:
      return {...state, actived: action.toActive }
    default:
      return state
  }
}
