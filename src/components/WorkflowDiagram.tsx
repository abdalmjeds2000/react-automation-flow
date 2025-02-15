// src/WorkflowDiagram.tsx
import React from "react";
import Tree, { RenderCustomNodeElementFn } from "react-d3-tree";
import { useCenteredTree } from "../helpers";
import classNames from "classnames";
import { v4 as uuid } from "uuid";

type Item = {
  id: string;
  name: string;
  children: Item[];
}
const WorkflowDiagram: React.FC<{ initData : any}> = ({ initData }) => {
  const [data, setData] = React.useState<Item>(initData);
  const [translate, containerRef] = useCenteredTree();

  const handleAddNode = (parent: any) => {
    const newNode: Item = {
      id: uuid(),
      name: "New Node",
      children: [],
    };
    
    const newData: Item = { ...data };
    
    const updateData = (children: any[]) => {
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === parent.id) {
          children[i].children = [ ...(children[i].children||[]), newNode ];
          break;
        } else if (children[i].children) {
          updateData(children[i].children);
        }
      }
    };
    updateData(newData.children);
    setData(newData);
  }
  const renderForeignObjectNode: RenderCustomNodeElementFn  = ({
    nodeDatum,
    toggleNode,
  }) => {
    const _nodeData: Item = nodeDatum as any;
    const hasChildren = _nodeData.id != data.id;
    return (
      <g className="-translate-x-[112px] -translate-y-[32px]">
        <foreignObject className={classNames("w-56", { "h-20": hasChildren }, { "h-16": !hasChildren })}>
          <div onClick={() => handleNodeClick(_nodeData)} className="w-full h-16 px-4 py-1.5 bg-slate-100 border border-slate-300 hover:border-violet-500 rounded-sm text-slate-600 flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-violet-200 border border-violet-300 text-violet-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentcolor"><path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z"/></svg>
            </div>
            <div className="leading-tight">
              <h3 className="font-semibold">{_nodeData.name}</h3>
              <p className="text-slate-400 text-sm">Lorem ipsum dolor.</p>
            </div>
          </div>
          {hasChildren && (
            <button
              onClick={() => handleAddNode(_nodeData)}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full aspect-square bg-white hover:bg-gray-200 border flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#AAA"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </button>
          )}
        </foreignObject>
      </g>
    )
  };

  const handleNodeClick = (nodeDatum: Item) => {
    window.alert("You are click on \"" + nodeDatum.name + "\"");
  };


  return (
    <div ref={containerRef} className="w-full h-screen">
      <Tree 
        data={data}
        orientation="vertical"
        pathFunc="step"
        translate={translate}
        zoom={1} zoomable scaleExtent={{ min: 0.3, max: 7 }}
        collapsible={false}
        initialDepth={9999}
        depthFactor={125}
        nodeSize={{ x: 224, y: 64 }}
        separation={{ siblings: 1.2, nonSiblings: 1.4 }}
        enableLegacyTransitions transitionDuration={300} centeringTransitionDuration={800}
        pathClassFunc={() => "!stroke-slate-500 stroke"}
        renderCustomNodeElement={renderForeignObjectNode}
      />
    </div>
  );
};

export default WorkflowDiagram;