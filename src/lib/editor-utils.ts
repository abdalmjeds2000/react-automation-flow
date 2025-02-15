import { Edge, MarkerType } from 'reactflow';
import { EditorCanvasCardType } from './types'
import dagre from 'dagre';


export const edgeSample: Edge = {
  id: '',
  source: '',
  target: '',
  type: 'normal',
  animated: true,
  style: {
    strokeWidth: 1,
    stroke: 'var(--salic-primary2)',
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 12,
    height: 12,
    color: 'var(--salic-primary2)',
  },
}
export const onDragStart = (
  event: any,
  nodeType: EditorCanvasCardType['type']
) => {
  event.dataTransfer.setData('application/reactflow', nodeType)
  event.dataTransfer.effectAllowed = 'move'
}


type TreeNode = {
  edge: Edge;
  children: TreeNode[];
};

function buildNodeTree(edges: Edge[], nodes: Node[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Create TreeNodes for nodes
  nodes.forEach((node) => {
    nodeMap.set(node.id, { node, edge: null, children: [] });
  });

  // Build tree structure based on edges
  edges.forEach((edge) => {
    const parentNode = nodeMap.get(edge.source);
    const childNode = nodeMap.get(edge.target);

    if (parentNode && childNode) {
      const edgeNode: TreeNode = { node: null, edge, children: [] };
      parentNode.children.push(edgeNode);
      edgeNode.children.push(childNode);

      // Sort condition edges
      parentNode.children.sort((a, b) => {
        if (a.edge?.sourceHandle === 'yes' && b.edge?.sourceHandle === 'no') {
          return -1;
        } else if (a.edge?.sourceHandle === 'no' && b.edge?.sourceHandle === 'yes') {
          return 1;
        } else {
          return 0;
        }
      });
    }
  });

  // Identify root nodes
  nodes.forEach((node) => {
    const isRoot = !edges.some((edge) => edge.target === node.id);
    if (isRoot) {
      roots.push(nodeMap.get(node.id)!);
    }
  });

  return roots;
}

function flattenTreeByLevel<T extends Node | Edge>(treeNodes: TreeNode[], type: 'node' | 'edge'): T[] {
  const result: T[] = [];
  const queue: TreeNode[] = [...treeNodes];

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (type === 'node' && currentNode?.node) {
      result.push(currentNode.node as T);
    }

    if (type === 'edge' && currentNode?.edge) {
      result.push(currentNode.edge as T);
    }

    queue.push(...currentNode?.children ?? []);
  }

  return result;
}

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
const getNodeSizeBasedOnType = (type: EditorCanvasCardType['type']) => {
  let { nodeWidth, nodeHeight } = { nodeWidth: 350, nodeHeight: 80 };

  if (type === 'Trigger') {
    nodeWidth = 350;
    nodeHeight = 50;
  }
  return { nodeWidth, nodeHeight };
};
export const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const nodeTree = buildNodeTree(edges, nodes);
  const sortedNodes = flattenTreeByLevel<Node>(nodeTree, 'node');
  const sortedEdges = flattenTreeByLevel<Edge>(nodeTree, 'edge');
  
  dagreGraph.setGraph({ rankdir: direction, marginx: 50, marginy: 50 });
    
  // sort nodes here

  sortedNodes.forEach((node) => {
    const { nodeWidth, nodeHeight } = getNodeSizeBasedOnType(node.type);
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  sortedEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);
    
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const { nodeWidth, nodeHeight } = getNodeSizeBasedOnType(node.type);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      style: { position: 'absolute' },
    };
  });

  return { nodes: layoutedNodes, edges };
};
