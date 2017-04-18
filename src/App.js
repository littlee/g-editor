import React, { Component } from 'react'
import { Editor, EditorState } from 'draft-js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange}/>
    )
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    })
  }
}

export default App
