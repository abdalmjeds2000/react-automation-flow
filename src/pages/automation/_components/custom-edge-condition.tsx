import { FC } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import AddItemMenu from './add-item-menu';

const ConditionEdge: FC<EdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    style = {}, // Allow additional styles via props
  } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10, // Smooth corners for step edges
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: label === 'yes' ? 'var(--salic-primary2)' : 'var(--salic-danger)', // Customize based on label
          strokeWidth: 2,
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        {label && (
          <div
            className='pointer-events-auto absolute'
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <div
              className={`px-1.5 py-0.5 text-xs rounded text-white ${
                label === 'yes'
                  ? 'bg-teal-600'
                  : 'bg-red-600'
              }`}
            >
              {label == "yes" ? "then" : "otherwise"}
            </div>
            <AddItemMenu edge={props} />
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default ConditionEdge;
