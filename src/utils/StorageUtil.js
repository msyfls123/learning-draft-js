import { convertToRaw, convertFromRaw } from 'draft-js'

export function saveToLocal(contentState, key='draft-data') {
  const rawContentState = convertToRaw(contentState)
  if (localStorage) {
    localStorage[key] = JSON.stringify(rawContentState)
    return true
  } else {
    return false
  }
}

export function loadFromLocal(key='draft-data') {
  if (localStorage) {
    const rawString = localStorage[key]
    return JSON.parse(rawString)
  } else {
    return null
  }
}
