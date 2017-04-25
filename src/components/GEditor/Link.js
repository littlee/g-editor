import React from 'react'
import Modal from 'react-modal'

class Link extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      url: null
    }
  }

  render() {
    var style = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      },
      content: {
        position: 'absolute',
        top: '10%',
        left: '0',
        right: '0',
        bottom: 'auto',
        width: '300px',
        margin: 'auto',
        border: 'none',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '5px',
        outline: 'none',
        padding: '0'
      }
    }

    return (
      <div className="link-ctrl">
        <button className="link-ctrl-btn" onClick={this._openModal}>Add Link</button>
        <button className="link-ctrl-btn" onClick={this._removeLink}>Remove Link</button>
        <Modal
          isOpen={this.state.openModal}
          onRequestClose={this._closeModal}
          style={style}
          contentLabel="g-ctrl-modal"
          >
          <div className="g-ctrl-modal-header">插入链接</div>
          <div className="g-ctrl-modal-body">
            <div>输入链接</div>
            <input
              type="text"
              ref="input"
              style={{ width:'100%' }}
              value={this.state.url}
              onChange={(e) => { this.setState({ url: e.target.value }) }}/>
          </div>
          <div className="g-ctrl-modal-footer">
            <button type="button" className="g-ctrl-modal-btn ok" onClick={this._insertLink}>好</button>
            <button type="button" className="g-ctrl-modal-btn cancel" onClick={this._closeModal}>取消</button>
          </div>
        </Modal>
      </div>
    )
  }

  _openModal = () => {
    var editorState = this.props.editorState
    var selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      var contentState = editorState.getCurrentContent()
      var startKey = editorState.getSelection().getStartKey()
      var startOffset = editorState.getSelection().getStartOffset()
      var blockWithLinkAtBeginning = contentState.getBlockForKey(startKey)
      var linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset)

      var url = ''
      if (linkKey) {
        var linkInstance = contentState.getEntity(linkKey)
        url = linkInstance.getData().url
      }

      this.setState({
        openModal: true,
        url: url
      })
    }
  }

  _closeModal = () => {
    this.setState({
      openModal: false
    })
  }

  _insertLink = () => {
    this.props.onConfirm && this.props.onConfirm(this.state.url)
    this._closeModal()
  }

  _removeLink = () => {
    this.props.onRemove && this.props.onRemove()
  }
}

export default Link