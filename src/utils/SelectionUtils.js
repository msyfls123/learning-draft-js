import { SelectionState, EditorState } from 'draft-js'

// If `offset` is given, ignore `offsetName`
export function genCollespedSelection(block, { offsetName='begin', offset, hasFocus=true } = {}) {
  const blockKey = block.getKey()
  if (!offset) {
    offset = offsetName === 'begin' ? 0 : block.getLength()
  }
  return new SelectionState({
    anchorKey: blockKey,
    anchorOffset: offset,
    focusKey: blockKey,
    focusOffset: offset,
    hasFocus,
  })
}

export function collapseSelectionToFocus(selectionState) {
  const focusKey = selectionState.getFocusKey()
  const focusOffset = selectionState.getFocusOffset()
  return selectionState.merge({
    anchorKey: focusKey,
    anchorOffset: focusOffset,
  })
}

export function collapseSelectionToEnd(selectionState) {
  const key = selectionState.getEndKey()
  const offset = selectionState.getEndOffset()
  return selectionState.merge({
    anchorKey: key,
    anchorOffset: offset,
    focusKey: key,
    focusOffset: offset,
  })
}

export function setSelection(
  editorState, {
    block,
    offsetName='begin',
    offset,
    forcibly=true,
    hasFocus=true
  }
) {
  const selectionState = genCollespedSelection(
    block, { offsetName, offset, hasFocus }
  )
  if (forcibly) {
    return EditorState.forceSelection(editorState, selectionState)
  } else {
    return EditorState.acceptSelection(editorState, selectionState)
  }
}

export function getSelectedBlock(editorState, onFocus=true) {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()
  const blockKey = selectionState[onFocus ? 'getFocusKey' : 'getAnchorKey']()
  return contentState.getBlockForKey(blockKey)
}

export function isAtBlockBegin(selectionState) {
  return selectionState.isCollapsed() &&
    selectionState.getAnchorOffset() === 0
}

export function isAtBlockEnd(selectionState, block) {
  return selectionState.isCollapsed() &&
    selectionState.getAnchorOffset() === block.getLength()
}

export function forceSelectionWithoutFocus(editorState, block, options) {
  return EditorState.set(editorState, {
    selection: genCollespedSelection(block, {
      ...options,
      hasFocus: false,
    }),
    forceSelection: true,
    nativelyRenderedContent: null,
    inlineStyleOverride: null,
  })
}
