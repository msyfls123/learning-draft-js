import { SHOW_LINK_EDITOR, HIDE_LINK_EDITOR, } from '../constants/ActionTypes'

export default function linkEditor(state={ show: false }, action) {
  switch(action.type) {
    case SHOW_LINK_EDITOR:
      return {
        ...state,
        show: true,
        position: action.position,
        entityKey: action.entityKey,
      }
    case HIDE_LINK_EDITOR:
      return {...state, show: false }
    default:
      return state
  }
}
