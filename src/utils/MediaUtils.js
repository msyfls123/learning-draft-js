import { Entity, AtomicBlockUtils } from 'draft-js'
import { ENTITY_TYPE, MEDIA_TYPE } from '../constants/Draft'

export function insertMediaBlock(editorState) {
  const entityKey = Entity.create(
    ENTITY_TYPE.MEDIA,
    'IMMUTABLE',
    {
      type: MEDIA_TYPE.IMAGE,
      url: 'http://139.129.133.18/dog/dog.gif',
    }
  )
  return AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  )
}
