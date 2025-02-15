import {
  Anchor,
  CircleCheckBig,
  GitBranch,
  Mail,
  MousePointerClickIcon,
  Zap,
} from 'lucide-react'
import { EditorCanvasTypes } from '../../../lib/types'

type Props = { type: EditorCanvasTypes }

const EditorCanvasIconHelper = ({ type }: Props) => {
  switch (type) {
    case 'Trigger':
      return (
        <div className='aspect-square bg-gray-500/15 rounded-md w-8 flex items-center justify-center'>
          <MousePointerClickIcon
            className="flex-shrink-0 text-gray-500"
            size={18}
          />
        </div>
      )
    case 'Condition':
      return (
        <div className='aspect-square bg-yellow-500/15 rounded-md w-8 flex items-center justify-center'>
          <Anchor
            className="flex-shrink-0 text-warning"
            size={18}
          />
        </div>
      )
    case 'Action':
      return (
        <div className='aspect-square bg-green-500/15 rounded-md w-8 flex items-center justify-center'>
          <CircleCheckBig
            className="flex-shrink-0 text-success"
            size={18}
          />
        </div>
      )
    default:
      return (
        <div className='aspect-square bg-gray-500/15 rounded-md w-8 flex items-center justify-center'>
          <Zap
            className="flex-shrink-0 text-gray-500"
            size={18}
          />
        </div>
      )
  }
}

export default EditorCanvasIconHelper