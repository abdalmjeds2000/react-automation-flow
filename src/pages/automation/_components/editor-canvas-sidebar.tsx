import { EditorCanvasTypes, EditorNodeType } from '../../../lib/types'
import { useEditor } from '../../../providers/editor-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { EditorCanvasDefaultCardTypes } from '../../../lib/constant'
import { onDragStart } from '../../../lib/editor-utils'
import EditorCanvasIconHelper from './editor-canvas-card-icon-hepler'
import { Move } from 'lucide-react'

type Props = {
  nodes: EditorNodeType[]
}

const EditorCanvasSidebar = ({ nodes }: Props) => {
  const { state } = useEditor()

  return (
    <aside>
      <Tabs
        defaultValue="actions"
        className="h-screen overflow-scroll"
      >
        <TabsList>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <hr />
        <TabsContent
          value="actions"
          className="flex flex-col gap-4 p-4 bg-slate-100"
        >
          {Object.entries(EditorCanvasDefaultCardTypes)
            .map(([cardKey, cardValue]) => (
              <div
                key={cardKey}
                draggable
                className="w-full cursor-grab"
                onDragStart={(event) =>
                  onDragStart(event, cardKey as EditorCanvasTypes)
                }
              >
                <div className="flex flex-row items-center gap-4 p-4 bg-white rounded-lg shadow shadow-gray-200">
                  <div className='basis-8'>
                    <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} />
                  </div>
                  <div className="text-md basis-full">
                    <h3 className='font-semibold text-sm'>{cardKey}</h3>
                    <p className='text-xs'>{cardValue.description}</p>
                  </div>
                  <Move className='text-gray-300' />
                </div>
              </div>
            ))}
        </TabsContent>
        <TabsContent
          value="settings"
          className="-mt-6"
        >
          <div className="px-2 py-4 text-center text-xl font-bold">
            {state.editor.selectedNode.data.title}
          </div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore obcaecati nobis nam quasi quibusdam eaque dolor odio sit, quaerat autem vero unde suscipit et ipsam dignissimos a assumenda reprehenderit quas.
        </TabsContent>
      </Tabs>
    </aside>
  )
}

export default EditorCanvasSidebar