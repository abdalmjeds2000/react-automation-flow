import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  ReactFlowInstance,
  addEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType,
  EdgeChange,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { EditorCanvasCardType, EditorNode, EditorNodeType } from '../../../lib/types'
import { useEditor } from '../../../providers/editor-provider'
import EditorCanvasCardSingle from './editor-canvas-card-single'
import { EditorCanvasDefaultCardTypes } from '../../../lib/constant'
import { v4 } from 'uuid'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../components/ui/resizable'
import EditorCanvasSidebar from './editor-canvas-sidebar'
import EditorCanvasCardTrigger from './editor-canvas-card-trigger'
import { initialNodes, initialEdges } from '../../../data.json'
import { Button } from 'antd'
import ConditionEdge from './custom-edge-condition'
import { edgeSample, getLayoutedElements } from '../../../lib/editor-utils'
import NormalEdge from './custom-edge-normal'

type Props = {}

const EditorCanvas = (props: Props) => {
  const { dispatch, state } = useEditor()
  // const { fitView } = useReactFlow();
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const [isWorkFlowLoading, setIsWorkFlowLoading] = useState<boolean>(false)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      //@ts-ignore
      setNodes((nds) => applyNodeChanges?.(changes, nds))
    },
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      //@ts-ignore
      setEdges((eds) => applyEdgeChanges?.(changes, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])
  
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const edge: any = {
        ...edgeSample,
        ...params,
        id: v4()
      };
  
      const isYesSourceHandle = params.sourceHandle === 'yes';
      const isNoSourceHandle = params.sourceHandle === 'no';
  
      if (isYesSourceHandle) {
        edge.type = 'condition';
        edge.label = 'yes';
        edge.style = {
          strokeWidth: 1,
          stroke: 'var(--salic-success)', // Green for "yes"
        };
      } 
      
      if (isNoSourceHandle) {
        edge.type = 'condition';
        edge.label = 'no';
        edge.style = {
          strokeWidth: 1,
          stroke: 'var(--salic-danger)', // Red for "no"
        };
      }

      console.log(edge);
      
  
      setEdges((eds) => addEdge(edge, eds as Edge[]));
    },
    [edges] // Ensure `edges` is included in the dependency array
  );

  const addNode = useCallback(
    (type: EditorCanvasCardType['type'], pos: { x: number; y: number }) => {
      if (typeof type === 'undefined' || !type) {
        return
      }

      const triggerAlreadyExists = state.editor.elements.find(
        (node) => node.type === 'Trigger'
      )

      if (type === 'Trigger' && triggerAlreadyExists) {
        alert('Only one trigger can be added to automations at the moment')
        return
      }

      if (!reactFlowInstance) return
      const position = reactFlowInstance.screenToFlowPosition({
        x: pos.x,
        y: pos.y,
      })

      const newNode = {
        id: v4(),
        type,
        position,
        "draggable": true,
        data: {
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          completed: false,
          current: false,
          metadata: {},
          type: type,
        },
      }
      console.log(newNode);
      
      //@ts-ignore
      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, state]
  )

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      const type: EditorCanvasCardType['type'] = event.dataTransfer.getData('application/reactflow')

      const position: { x: number; y: number } = {
        x: event.clientX,
        y: event.clientY,
      };

      addNode(type, position)

      // onLayout()

    },
    [reactFlowInstance, state]
  )

  const handleClickCanvas = () => {
    dispatch({
      type: 'SELECTED_ELEMENT',
      payload: {
        element: {
          data: {
            completed: false,
            current: false,
            description: '',
            metadata: {},
            title: '',
            type: 'Trigger',
          },
          id: '',
          position: { x: 0, y: 0 },
          type: 'Trigger',
        },
      },
    })
  }

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes as any, edges);
    console.log(layoutedNodes, layoutedEdges);
    
    setNodes(layoutedNodes as any);
    setEdges(layoutedEdges as any);
  }, [nodes, edges]);

  // useLayoutEffect(() => {
  //   onLayout()
  // }, [nodes.length, edges.length]);

  useEffect(() => {
    // fitView();
    dispatch({ type: 'LOAD_DATA', payload: { edges, elements: nodes as EditorNode[] } });
  }, [nodes, edges]);

  const nodeTypes = useMemo(
    () => ({
      Trigger: EditorCanvasCardTrigger,
      Condition: EditorCanvasCardSingle,
      Action: EditorCanvasCardSingle,
    }),
    []
  )

  const edgeTypes = useMemo(
    () => ({
      condition: ConditionEdge,
      normal: NormalEdge
    }),
    []
  )

  const onGetWorkFlow = async () => {
    setIsWorkFlowLoading(true);
    // Load workflow logic here
    setIsWorkFlowLoading(false);
  }

  useEffect(() => {
    onGetWorkFlow();
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center">
          <div className="relative w-full h-full">
            {isWorkFlowLoading ? (
              <div>Loading...</div>
            ) : (
              <ReactFlow
                className="bg-info-light"
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                maxZoom={3}
                minZoom={0.1}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                fitView
                onClick={handleClickCanvas}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
              >
                <Controls />
                <MiniMap
                  className="!bg-background"
                  zoomable
                  pannable
                />
                <Background
                  color='#c9d1db'
                  gap={16}
                  size={2}
                />
              </ReactFlow>
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={40}
        className="relative sm:block"
      >
        <Button onClick={onLayout} style={{ position: 'absolute', top: 10, right: 10 }}>Auto Layout</Button>
        {isWorkFlowLoading ? (
          <div className="absolute flex h-full w-full items-center justify-center">
            <svg
              aria-hidden="true"
              className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <EditorCanvasSidebar nodes={nodes as EditorNodeType[]} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default function () {
  return (
    <ReactFlowProvider>
      <EditorCanvas />
    </ReactFlowProvider>
  );
}