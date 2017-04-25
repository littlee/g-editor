import React from 'react'
import { Editor, EditorState, RichUtils, AtomicBlockUtils, CompositeDecorator, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import './index.css'
import BlockStyle from './BlockStyle'
import InlineStyle from './InlineStyle'
import Media from './Media'
import Link from './Link'

const MediaComponent = (props) => {
  var entity = props.contentState.getEntity(props.block.getEntityAt(0))
  var src = entity.getData().src
  return <img src={src} alt="" />
}

const LinkComponent = (props) => {
  return (
    <a href={props.contentState.getEntity(props.entityKey).getData().url}>
      {props.children}
    </a>
    )
}

class GEditor extends React.Component {
  constructor(props) {
    super(props)

    var decorator = new CompositeDecorator([
      {
        strategy: function(contentBlock, callback, contentState) {
          contentBlock.findEntityRanges((character) => {
            var entityKey = character.getEntity()
            return (entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK')
          }, callback)
        },
        component: LinkComponent 
      }
    ])

    this.state = {
      editorState: EditorState.createEmpty(decorator),
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
          <Link onConfirm={this._addLink} onRemove={this._removeLink} editorState={this.state.editorState}/>
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
            keyBindingFn={this._keyBinding}
            handleKeyCommand={this._keyCommand}
            blockRendererFn={this._mediaBlockRenderer}
            editorState={this.state.editorState}
            onChange={this._onChange} />
        </div>
      </div>
    )
  }

  _keyBinding = (e) => {
    var hasCommandModifier = KeyBindingUtil.hasCommandModifier
    console.log(e.keyCode)
    if (e.keyCode === 49 && hasCommandModifier(e)) {
      return 'header-one'
    }
    if (e.keyCode === 50 && hasCommandModifier(e)) {
      return 'header-two'
    }
    if (e.keyCode === 51 && hasCommandModifier(e)) {
      return 'header-three'
    }
    if (e.keyCode === 52 && hasCommandModifier(e)) {
      return 'header-four'
    }
    if (e.keyCode === 53 && hasCommandModifier(e)) {
      return 'header-five'
    }
    if (e.keyCode === 54 && hasCommandModifier(e)) {
      return 'header-six'
    }
    if (e.keyCode === 55 && hasCommandModifier(e)) {
      return 'blockquote'
    }
    if (e.keyCode === 56 && hasCommandModifier(e)) {
      return 'unordered-list-item'
    }
    if (e.keyCode === 57 && hasCommandModifier(e)) {
      return 'ordered-list-item'
    }
    if (e.keyCode === 48 && hasCommandModifier(e)) {
      return 'code-block'
    }

    return getDefaultKeyBinding(e)
  }

  _keyCommand = (cmd) => {
    if (
      cmd === 'header-one' ||
      cmd === 'header-two' ||
      cmd === 'header-three' ||
      cmd === 'header-four' ||
      cmd === 'header-five' ||
      cmd === 'header-six' ||
      cmd === 'blockquote' ||
      cmd === 'unordered-list-item' ||
      cmd === 'ordered-list-item' ||
      cmd === 'code-block'
      ) {
      this._toggleBlockStyle(cmd)
      return 'handled'
    }

    return 'not-handled'
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

  _addLink = (href) => {
    var editorState = this.state.editorState
    var contentState = editorState.getCurrentContent()
    var contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: href })
    var entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    var newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })
    this._onChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey), true)
  }

  _removeLink = () => {
    var editorState = this.state.editorState
    var selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      this._onChange(RichUtils.toggleLink(editorState, selection, null), true)
    }
  }

}

export default GEditor