import { useMemo } from 'react'
import { EditorCanvasCardType } from '../../../lib/types'
import { useEditor } from '../../../providers/editor-provider'
import { Position, useNodeId } from 'reactflow'
import EditorCanvasIconHelper from './editor-canvas-card-icon-hepler'
import CustomHandle from './custom-handle'
import { cn } from '../../../lib/utils'

const EditorCanvasCardSingle = (props: { data: EditorCanvasCardType | any }) => {
  const { data } = props
  const { dispatch, state } = useEditor()
  const nodeId = useNodeId()
  const logo = useMemo(() => {
    return <EditorCanvasIconHelper type={data.type} />
  }, [data])
  
  const selected = state.editor.selectedNode.id === nodeId

  return (
    <>
      <CustomHandle
        type="target"
        position={Position.Top}
        style={{ zIndex: 100 }}
      />
      {/* <NodeToolbar isVisible={data.toolbarVisible} position="right">
        {nodeId && <Button color='danger' variant='solid' size='small' shape='circle' icon={<Trash2 size={14} />} onClick={() => dispatch({ type: 'DELETE_ELEMENT', payload: { id: nodeId } })} />}
      </NodeToolbar> */}
      <div
        className="relative dark:border-muted-foreground/70"
        onClick={(e) => {
          e.stopPropagation()
          const val = state.editor.elements.find((n) => n.id === nodeId)
          if (val)
            dispatch({
              type: 'SELECTED_ELEMENT',
              payload: {
                element: val,
              },
            })
        }}
      >
        <div className={cn("w-80 h-20 bg-white border-2 border-white shadow-lg shadow-gray-500/5 rounded-md p-4 flex items-center gap-4", { "border-2 border-primary2": selected })}>
          <div>{logo}</div>
          <div>
            <h3 className="text-sm font-semibold mb-1">{data.title}</h3>
            <p className="text-xs leading-snug">{data.description}</p>
          </div>
        </div>
      </div>
      {
        data.type === 'Condition'
        ? (
          <>
            <CustomHandle
              type="source"
              position={Position.Left}
              id="yes"
            />
            <CustomHandle
              type="source"
              position={Position.Right}
              id="no"
            />
          </>
        )
        : <CustomHandle
            type="source"
            position={Position.Bottom}
            id="a"
          />
      }
    </>
  )
}

export default EditorCanvasCardSingle