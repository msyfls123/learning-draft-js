import {
  LOAD_DATA,
  SAVE_DATA,
  UPDATE_ARTICLE,
  LOAD_LIST,
  UPDATE_TITLE,
  SHOW_LINK_EDITOR,
  HIDE_LINK_EDITOR,
  TOGGLE_SUBEDITOR,
} from '../constants/ActionTypes'
import { EditorState } from 'draft-js'
import { 
  loadFromLocal,
  saveToLocal,
  saveStampList,
  loadStampList,
  saveTitleMap,
  loadTitleMap,
} from 'utils/StorageUtil'

function dateString() {
  return +(new Date())
}

export function saveData(tempStamp, title) {
  return (dispatch, getState) => {
    const state = getState().articleData.editorState
    const stamp_list = getState().articleData.stamp_list
    const titleMap = getState().articleData.titleMap
    const stamp_id = (tempStamp !== 'new' && tempStamp) ? tempStamp : 'draft-' + dateString()
    const saved = saveToLocal(state.getCurrentContent(), stamp_id)

    if (saved && stamp_list.indexOf(stamp_id) === -1) {
      stamp_list.unshift(stamp_id)
    }
    saveStampList(stamp_list)
    if (title) {
      titleMap[stamp_id] = title
      saveTitleMap(titleMap)
    }

    return dispatch({
      type: SAVE_DATA,
      stamp_id,
      stamp_list,
      titleMap,
      saved,
    })
  }
}

export function loadData(stamp_id, decorator) {
  return (dispatch, getState) => {
    const contentState = loadFromLocal(stamp_id, decorator)
    const titleMap = loadTitleMap()

    const editorState = EditorState.createWithContent(
      contentState,
      decorator,
    )

    return dispatch({
      type: LOAD_DATA,
      editorState,
      stamp_id,
      titleMap,
    })
  }
}

export function tryLoadList() {
  return (dispatch, getState) => {
    const stamp_list = loadStampList()
    const titleMap = loadTitleMap()
    return dispatch({
      type: LOAD_LIST,
      stamp_list,
      titleMap,
    })
  }
}

export function trySaveTitleMap(stamp_id, title) {
  return (dispatch, getState) => {
    const titleMap = getState().articleData.titleMap
    titleMap[stamp_id] = title
    saveTitleMap(titleMap)
    return dispatch({
      type: UPDATE_TITLE,
      titleMap,
    })
  }
}

export function updateArticle(editorState) {
  return {
    type: UPDATE_ARTICLE,
    editorState
  }
}

// link-editor
let hideTimerID = null

export function showLinkEditor(position, entityKey) {
  clearTimeout(hideTimerID)
  hideTimerID = null
  return {
    type: SHOW_LINK_EDITOR,
    position,
    entityKey,
  }
}

export function keepLinkEditor(newEntityKey) {
  return function(_, getState) {
    const { entityKey } = getState().linkEditor
    if (entityKey === newEntityKey) {
      clearTimeout(hideTimerID)
      hideTimerID = null
    }
  }
}

export function hideLinkEditor() {
  return function(dispatch) {
    hideTimerID = setTimeout(function() {
      dispatch({
        type: HIDE_LINK_EDITOR,
      })
      hideTimerID = null
    }, 100)
  }
}

// subEditor
export function toggleSubEditor(toActive) {
  return {
    type: TOGGLE_SUBEDITOR,
    toActive,
  }
}
