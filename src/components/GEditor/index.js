import React from 'react'
import { Editor, EditorState, RichUtils, AtomicBlockUtils } from 'draft-js'
import './index.css'
import BlockStyle from './BlockStyle'
import InlineStyle from './InlineStyle'
import Media from './Media'

const MediaComponent = (props) => {
  var entity = props.contentState.getEntity(props.block.getEntityAt(0))
  var src = entity.getData().src
  return <img src={src} alt="" />
}

class GEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      dragEnter: false
    }
    this.dragging = 0
  }

  render() {
    return (
      <div className="g-editor">
        <div className="g-editor-controls">
          <BlockStyle editorState={this.state.editorState} onToggle={this._toggleBlockStyle}/>
          <InlineStyle editorState={this.state.editorState} onToggle={this._toggleInlineStyle}/>
          <Media onConfirm={this._insertImage}/>
        </div>
        <div className="g-editor-inner"
          onDragEnter={this._dragEnter}
          onDragLeave={this._dragLeave}
          onDrop={this._drop}
          onDragOver={this._dragOver}
          onPaste={this._paste}
          >
          {
            this.state.dragEnter ? 
            <div className="g-editor-drag-overlay">
              <div className="g-editor-drag-text">拖拽到此处上传</div>
            </div> : null
          }
          <Editor
            ref="editor"
            blockRendererFn={this._mediaBlockRenderer}
            editorState={this.state.editorState}
            onChange={this._onChange} />
        </div>
      </div>
    )
  }

  _focus = () => {
    this.refs.editor.focus()
  }

  _onChange = (editorState, focus) => {
    this.setState({
      editorState
    }, () => {
      focus && this._focus()
    })
  }

  _toggleBlockStyle = (blockType) => {
    this._onChange(RichUtils.toggleBlockType(this.state.editorState, blockType), true)
  }

  _toggleInlineStyle = (inlineStyle) => {
    this._onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle), true)
  }

  _dragEnter = (e) => {
    e.preventDefault()
    this.dragging++
    this.setState({
      dragEnter: true
    })
  }

  _dragLeave = (e) => {
    e.preventDefault()
    this.dragging--
    if (this.dragging === 0) {
      this.setState({
        dragEnter: false
      })
    }
  }

  _dragOver = (e) => {
    e.preventDefault()
  }

  _drop = (e) => {
    e.preventDefault()
    this.setState({
      dragEnter: false
    })
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      var file = e.dataTransfer.files[0]
      var fileReader = new FileReader()
      fileReader.onload = (e) => {
        this._insertImage(e.target.result)
      }
      fileReader.readAsDataURL(file)
    }
  }

  _paste = (e) => {
    [].forEach.call(e.clipboardData.items, (item) => {
      if (item.kind === 'file') {
        var blob = item.getAsFile()
        var fileReader = new FileReader()
        fileReader.onload = (e) => {
          this._insertImage(e.target.result)
        }
        fileReader.readAsDataURL(blob)
      }
    })
  }

  _insertImage = (urlValue) => {
    var editorState = this.state.editorState
    var contentState = editorState.getCurrentContent()
    var contentStateWithEntity = contentState.createEntity('IMAGE', 'MUTABLE', { src: urlValue })
    var entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    var newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    })

    this._onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '), true)
  }

  _mediaBlockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: MediaComponent,
        editable: false
      }
    }

    return null
  }

}

export default GEditor