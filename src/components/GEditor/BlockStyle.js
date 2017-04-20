import React from 'react'
import StyleBtn from './StyleBtn'

var BLOCK_TYPE = [
  {
    label: 'H1',
    style: 'header-one'
  },
  {
    label: 'H2',
    style: 'header-two'
  },
  {
    label: 'H3',
    style: 'header-three'
  },
  {
    label: 'H4',
    style: 'header-four',
  },
  {
    label: 'H5',
    style: 'header-five'
  },
  {
    label: 'H6',
    style: 'header-six'
  },
  {
    label: 'Blockquote',
    style: 'blockquote'
  },
  {
    label: 'UL',
    style: 'unordered-list-item'
  },
  {
    label: 'OL',
    style: 'ordered-list-item'
  },
  {
    label: 'Code Block',
    style: 'code-block'
  }
]

class BlockStyle extends React.Component {
  render() {
    var editorState = this.props.editorState
    var selection = editorState.getSelection()
    var blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

    return (
      <div className="block-style">
        {
          BLOCK_TYPE.map((type) => {
            return (
              <StyleBtn
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onToggle={this.props.onToggle}
                style={type.style}
              />
              )
          })
        }
      </div>
      )
  }
}

export default BlockStyle