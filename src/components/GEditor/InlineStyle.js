import React from 'react'
import StyleBtn from './StyleBtn'

var INLINE_STYLE = [
  {
    label: 'Bold',
    style: 'BOLD'
  },
  {
    label: 'Italic',
    style: 'ITALIC'
  },
  {
    label: 'Underline',
    style: 'UNDERLINE'
  },
  {
    label: 'Monospace',
    style: 'CODE'
  }
]

class InlineStyle extends React.Component {
  render() {
    var currentStyle = this.props.editorState.getCurrentInlineStyle()

    return (
      <div className="inline-style">
        {
          INLINE_STYLE.map((type) => {
            return (
              <StyleBtn
                key={type.label}
                active={currentStyle.has(type.style)}
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

export default InlineStyle