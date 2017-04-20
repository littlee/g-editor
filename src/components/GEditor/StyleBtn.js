import React from 'react'

class StyleBtn extends React.Component {
  render() {
    return (
      <button type="button" className={'g-editor-style-btn' + (this.props.active ? ' active' : '')} onClick={this._toggle}>
        {this.props.label}
      </button>
      )
  }

  _toggle = (e) => {
    e.preventDefault()
    this.props.onToggle(this.props.style)
  }
}

export default StyleBtn