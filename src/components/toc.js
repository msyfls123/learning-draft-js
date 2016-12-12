import React, {Component} from 'react'
import Dragula from 'react-dragula'
import { ContentState, EditorState } from 'draft-js'

const options = {
  copy: false
}

class Toc extends Component{
  constructor(props) {
    super(props)
    this.orderContent = this.orderContent.bind(this)
  }
  
  componentDidMount() {
    const self = this
    const container = this.refs.toc;
    const drake = Dragula([container],options);
    drake.on('drop',function(el, target, source, sibdivng) {
      const elKey = el.getAttribute("data-id")
      const targetKey = sibdivng ? sibdivng.getAttribute("data-id") : null
      self.orderContent(elKey, targetKey)
    })
  }

  orderContent(elKey, targetKey) {
    const data = this.props.tocArray.slice(0)
    const dataLen = data.length
    let temp, idx = NaN

    data.forEach((d,i) => {
      if(d.getKey() === elKey) { temp = data.splice(i, 1)[0] }
    })
    data.forEach((d,i) => {
      if(d.getKey() === targetKey) { 
        idx = i
      }
    })

    if(isNaN(idx)) {
      data.push(temp)
    } else {
      data.splice(idx, 0 ,temp)
    }

    const nextContent = ContentState.createFromBlockArray(data)
    const state = EditorState.createWithContent(nextContent)

    this.props.onChange(state)
  }

  render() {
    const toc = this.props.tocArray 
    const tocMap = toc.map((d) => d.getKey())
    const tocDiv = tocMap.map((d, i) => (<li key={d} data-id={d}>{d}</li>))
    return (
      <ul className='toc' ref='toc'>
        {tocDiv}
      </ul>
    )
  }
}

export default Toc
