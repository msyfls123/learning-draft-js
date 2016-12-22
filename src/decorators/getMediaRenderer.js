import {
  EditorState,
  SelectionState,
  Modifier,
} from 'draft-js'
import * as SelectionUtils from '../utils/SelectionUtils'
import Media from '../components/Media'

const isFirefox = /firefox/i.test(navigator.userAgent)

function removeFigure(editorState, blockKey) {
  const contentState = editorState.getCurrentContent()
  const block = contentState.getBlockForKey(blockKey)

  const targetRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength(),
  })

  const contentStateWithoutFigure
    = Modifier.removeRange(
      contentState,
      targetRange,
      'backward'
    )

  return Modifier.setBlockType(
    contentStateWithoutFigure,
    contentStateWithoutFigure.getSelectionAfter(),
    'unstyled'
  )
}

export default function getMediaRenderer(
  getEditorState,
  onChange,
  updateEntity,
  onFocus,
  onBlur
) {
  return {
    component: Media,
    editable: false,
    props: {
      updateEntity,
      onStart: onFocus,
      onFinish: onBlur,
      onArrow(blockKey, direction) {
        const editorState = getEditorState()
        const contentState = editorState.getCurrentContent()
        const block = contentState[direction === 'up'
          ? 'getBlockBefore' : 'getBlockAfter'](blockKey)
        const offsetName = direction === 'up' ? 'end' : 'begin'

        onChange(SelectionUtils.setSelection(
          editorState,
          { block, offsetName, forcibly: false, hasFocus: false }
        ))

        if (isFirefox) {
          // http://gist.github.intra.douban.com/houmai/f65a4ce558251daf95491b74f5e9b791#file-5-md
          setTimeout(function() {
            const editorDOMNode = document.querySelector('.public-DraftEditor-content')
            editorDOMNode.blur()
            setTimeout(function() { editorDOMNode.focus() }, 0)
          }, 0)
        }
      },
      onRemove(blockKey) {
        let editorState = getEditorState()
        let newContentState = removeFigure(editorState, blockKey)
        let newEditorState = EditorState.push(
          editorState,
          newContentState,
          'remove-range'
        )

        onChange(EditorState.forceSelection(
          newEditorState,
          newContentState.getSelectionAfter()
        ))
      },
    }
  }
}
