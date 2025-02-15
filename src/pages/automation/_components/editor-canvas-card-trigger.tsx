import { EditorCanvasCardType } from '../../../lib/types'
import { Position } from 'reactflow'
import CustomHandle from './custom-handle'

const EditorCanvasCardTrigger = ({ data }: { data: EditorCanvasCardType }) => {
  return (
    <>
      <div className="relative w-80 dark:border-muted-foreground/70">
        <div className="w-fit mx-auto min-w-44 bg-primary2 text-white shadow-md rounded-md px-4 py-3 text-center">
          <h3 className="text-base">{data.title}</h3>
        </div>
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        id="a"
      />
    </>
  )
}

export default EditorCanvasCardTrigger