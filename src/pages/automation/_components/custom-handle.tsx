import { CSSProperties } from 'react'
import { useEditor } from '../../../providers/editor-provider'
import { Handle, HandleProps } from 'reactflow'
import { cn } from '../../../lib/utils'

type Props = HandleProps & { style?: CSSProperties }

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
})

const CustomHandle = (props: Props) => {
  const { state } = useEditor()
  const isConnected = props.isConnectable
  return (
    <Handle
      {...props}
      isValidConnection={(e) => {
        const sourcesFromHandleInState = state.editor.edges.filter(
          (edge) => edge.source === e.source
        ).length
        const sourceNode = state.editor.elements.find(
          (node) => node.id === e.source
        )
        //target
        const targetFromHandleInState = state.editor.edges.filter(
          (edge) => edge.target === e.target
        ).length

        const targetNode = state.editor.elements.find(
          (node) => node.id === e.target
        )

        // if (targetFromHandleInState > 1 && sourceNode?.type !== 'End') return false
        // if (sourceNode?.type === 'Condition') return true
        // if (sourcesFromHandleInState > 1 && targetNode?.type !== 'End') return true
        // if (targetNode?.type == 'End') return true
        // return false
        return true
      }}
      className={cn("!h-2 !w-2 !border-none !bg-primary2", { "!bg-success": isConnected })}
    />
  )
}

export default CustomHandle