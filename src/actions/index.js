import {
  LOAD_DATA,
  SAVE_DATA,
  UPDATE_ARTICLE,
} from '../constants/ActionTypes'
import { EditorState } from 'draft-js'
import { 
  loadFromLocal,
  saveToLocal,
  saveKeyList,
  loadKeyList
} from 'utils/StorageUtil'

function dateString() {
  return +(new Date())
}

export function saveData(tempKey) {
  return (dispatch, getState) => {
    const state = getState().articleData.editorState
    const keyList = getState().articleData.keyList
    const key = tempKey ? tempKey : 'draft-' + dateString()
    const result = saveToLocal(state.getCurrentContent(), key)

    if (result && keyList.indexOf(key) === -1) {
      console.log(key)
      keyList.unshift(key)
    }

    saveKeyList(keyList)

    return dispatch({
      type: SAVE_DATA,
      key,
      keyList,
      result,
    })
  }
}

export function loadData(tempKey) {
  return (dispatch, getState) => {
    const keyList = getState().articleData.keyList
    const key = tempKey ? tempKey : keyList.shift()
    const contentState = loadFromLocal(key)
    const newKeyList = loadKeyList()

    const editorState = EditorState.push(
      getState().articleData.editorState,
      contentState,
      'load-from-local'
    )

    return dispatch({
      type: LOAD_DATA,
      editorState,
      key,
      keyList: newKeyList,
    })
  }
}

export function tryLoadKeyList() {
  const keyList = loadKeyList()
  return dispatch({
    type: 'LOAD_LIST',
    keylist,
  })
}

export function updateArticle(editorState) {
  return {
    type: UPDATE_ARTICLE,
    editorState
  }
}
