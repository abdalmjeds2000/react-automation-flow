import { Anchor, CircleCheckBig, Plus } from 'lucide-react';
import { EditorCanvasCardType } from '../../../lib/types';
import { edgeSample } from '../../../lib/editor-utils';
import { EditorCanvasDefaultCardTypes } from '../../../lib/constant';
import { v4 } from 'uuid';
import { EdgeProps, useEdges, useNodes, useReactFlow } from 'reactflow';
import { Button, Popover } from 'antd';
import { useState } from 'react';

const AddItemMenu = ({ edge }: { edge: EdgeProps }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { addNodes, addEdges, deleteElements, fitView } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();
  
  const onAddItem = (type: EditorCanvasCardType['type']) => {
    if (!type) return;

    const newNodeId = v4();
    const newNode: Node = {
      id: newNodeId,
      type,
      draggable: true,
      position: {
        x: 0, // Midpoint X
        y: 0, // Midpoint Y
      },
      width: 320,
      dragging: false,
      selected: false,
      height: 80,
      data: {
        title: type,
        description: EditorCanvasDefaultCardTypes[type].description,
        completed: false,
        current: false,
        metadata: {},
        type: type,
      },
    };

    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    let edgesToAdd = [];
    console.log(sourceNode, targetNode);

    if(sourceNode?.type == "Condition") {
      if(edge.label == "yes") {
        edgesToAdd.push({
          ...edgeSample,
          id: v4(),
          source: edge.source,
          type: 'condition',
          sourceHandle: "yes",
          label: 'yes',
          target: newNodeId,
          targetHandle: null,
          style: {
            strokeWidth: 1,
            stroke: 'var(--salic-success)',
          },
        })
      } else if(edge.label == "no") {
        edgesToAdd.push({
          ...edgeSample,
          id: v4(),
          source: edge.source,
          type: 'condition',
          sourceHandle: "no",
          label: 'no',
          target: newNodeId,
          targetHandle: null,
          style: {
            strokeWidth: 1,
            stroke: 'var(--salic-danger)',
          },
        })
      }
    } else {
      edgesToAdd.push({
        ...edgeSample,
        id: v4(),
        source: edge.source,
        sourceHandle: "a",
        target: newNodeId,
        targetHandle: null
      })
    }

    // handle add target edges
    if(type == "Condition") {
      edgesToAdd.push({
        ...edgeSample,
        id: v4(),
        source: newNodeId,
        sourceHandle: 'yes',
        label: 'yes',
        target: edge.target,
        type: 'condition',
        style: {
          strokeWidth: 1,
          stroke: 'var(--salic-success)',
        },
      })
      edgesToAdd.push({
        ...edgeSample,
        id: v4(),
        source: newNodeId,
        sourceHandle: 'no',
        label: 'no',
        target: edge.target,
        type: 'condition',
        style: {
          strokeWidth: 1,
          stroke: 'var(--salic-danger)',
        },
      })
    } else {
      edgesToAdd.push({
        ...edgeSample,
        id: v4(),
        source: newNodeId,
        sourceHandle: "a",
        target: edge.target,
        targetHandle: null
      })
    }

    // Remove the current edge and add the new node and edges
    deleteElements({ edges: [{ id: edge.id }] });
    addNodes([newNode]);
    addEdges(edgesToAdd);

    fitView();
    // setOpen(false);
  };

  return (
    <Popover
      open={open}
      content={
        <div className='w-40 h-14 flex gap-2 text-primary2 dark:text-white text-sm font-semibold'>
          <div onClick={() => onAddItem('Action')} className='hover:bg-info-light rounded-md py-1 cursor-pointer basis-1/2 flex flex-col items-center justify-between'>
            <CircleCheckBig size={22} className='text-success' />
            <p>Action</p>
          </div>
          <div onClick={() => onAddItem('Condition')} className='hover:bg-info-light rounded-md py-1 cursor-pointer basis-1/2 text-center flex flex-col items-center justify-between'>
            <Anchor size={22} className='text-warning' />
            <p>Condition</p>
          </div>
        </div>
      }
      placement='bottom'
      trigger={['click']}
      onOpenChange={() => setOpen(!open)}
    >
      <Button
        size='small'
        type='primary'
        shape='circle'
        icon={<Plus size={14} />}
        className='bg-primary2 hover:!bg-primary !w-5 h-5 !min-w-5'
      />
    </Popover>
  )
}

export default AddItemMenu