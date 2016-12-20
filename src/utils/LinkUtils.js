import {
  Entity,
  RichUtils,
} from 'draft-js'

import { ENTITY_TYPE } from '../constants/Draft'

export function canAddLink(editorState) {
  const selection = editorState.getSelection()
  return !selection.isCollapsed() &&
    selection.getAnchorKey() === selection.getFocusKey()
}

export function createLinkEntity(url='') {
  return Entity.create(
    ENTITY_TYPE.LINK,
    'IMMUTABLE',
    {
      url,
    }
  )
}

export function insertLinkEntity(editorState, entityKey) {
  const selectionState = editorState.getSelection()
  return RichUtils.toggleLink(
    editorState,
    selectionState,
    entityKey
  )
}

export function updateLink(entityKey, url) {
  Entity.mergeData(entityKey, { url })
}
