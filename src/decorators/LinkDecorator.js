import React, { Component } from 'react'
import { Entity } from 'draft-js'
import Link from 'components/Link'

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
          Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

export default function(props) {
  class LinkWrapper extends Component {
    render() {
      return (
        <Link {...this.props} {...props} />
      )
    }
  }

  return {
    strategy: findLinkEntities,
    component: LinkWrapper,
  }
}
