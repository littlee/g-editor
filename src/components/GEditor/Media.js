import React from 'react'
import Modal from 'react-modal'

class Media extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
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
      <div className='media-ctrl'>
        <button className='media-ctrl-btn' onClick={this._openModal}>Image</button>
        <Modal
          isOpen={this.state.openModal}
          onRequestClose={this._closeModal}
          style={style}
          contentLabel='g-ctrl-modal'
          >
          <div className='g-ctrl-modal-header'>插入图片</div>
          <div className='g-ctrl-modal-body'>
            <div>输入图片链接</div>
            <input type="text" ref="input" style={{ width:'100%' }}/>
            <small style={{ color: '#aaa' }}>可以通过将图片拖放到编辑区上传，也可以从剪切板粘贴图片 (Chrome Only)</small>
          </div>
          <div className='g-ctrl-modal-footer'>
            <button type="button" className="g-ctrl-modal-btn ok" onClick={this._insertImage}>好</button>
            <button type="button" className="g-ctrl-modal-btn cancel" onClick={this._closeModal}>取消</button>
          </div>
        </Modal>
      </div>
    )
  }

  _openModal = () => {
    this.setState({
      openModal: true
    })
  }

  _closeModal = () => {
    this.setState({
      openModal: false
    })
  }

  _insertImage = () => {
    this.props.onConfirm && this.props.onConfirm(this.refs.input.value)
    this._closeModal()
  }
}

export default Media