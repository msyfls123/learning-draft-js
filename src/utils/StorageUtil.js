import { 
  convertToRaw, 
  convertFromRaw,
  ContentState,
} from 'draft-js'

export function saveToLocal(contentState, stamp_id='draft-default') {
  const rawContentState = convertToRaw(contentState)
  if (localStorage) {
    localStorage[stamp_id] = JSON.stringify(rawContentState)
    return true
  } else {
    return false
  }
}

export function loadFromLocal(stamp_id='draft-default') {
  if (localStorage) {
    const rawString = localStorage[stamp_id]
    return rawString ? convertFromRaw(JSON.parse(rawString)) : ContentState.createFromText('')
  } else {
    return ContentState.createFrowText('')
  }
}

export function saveStampList(stamp_list) {
  localStorage['stamp-list'] = JSON.stringify(stamp_list)
  return true
}

export function loadStampList() {
  const rawList = localStorage['stamp-list']
  return rawList ? JSON.parse(rawList) : []
}

export function saveTitleMap(titleMap) {
  localStorage['title-map'] = JSON.stringify(titleMap)
  return true
} 

export function loadTitleMap() {
  const rawMap = localStorage['title-map']
  return rawMap ? JSON.parse(rawMap) : {}
}
