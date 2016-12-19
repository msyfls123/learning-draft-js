import { 
  convertToRaw, 
  convertFromRaw,
  ContentState,
} from 'draft-js'

export function saveToLocal(contentState, key='draft-default') {
  const rawContentState = convertToRaw(contentState)
  if (localStorage) {
    localStorage[key] = JSON.stringify(rawContentState)
    return true
  } else {
    return false
  }
}

export function loadFromLocal(key='draft-default') {
  console.log(key)
  if (localStorage) {
    const rawString = localStorage[key]
    return rawString ? convertFromRaw(JSON.parse(rawString)) : ContentState.createFromText('')
  } else {
    return ContentState.createFrowText('')
  }
}

export function saveKeyList(keyList) {
  localStorage['key-list'] = JSON.stringify(keyList)
  return true
}

export function loadKeyList() {
  const rawList = localStorage['key-list']
  return rawList ? JSON.parse(rawList) : []
}
