import React from 'react'
import EditorProvider from '../../providers/editor-provider'
import EditorCanvas from './_components/editor-canvas'

type Props = {}

const WorkflowEditor = (props: Props) => {
  return <div className='h-screen'>
    <EditorProvider>
      <EditorCanvas />
    </EditorProvider>
  </div>
}

export default WorkflowEditor