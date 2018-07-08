import React from 'react';
import { Group } from '@vx/group';
import { Cluster } from '@vx/hierarchy';
import { LinkVertical } from '@vx/shape';
import { hierarchy } from 'd3-hierarchy';

const width=600, height=300, fontSize=16, bg='white', fg='black',
  margin = { top: 40, left: 0, right: 0, bottom: 40 };
// TODO make width responsive?

function convert(n) {
  if(!n.op) {
    return  { name: n.value };
  }
  return {
    name: `${n.value} = ${n.left.value} ${n.op} ${n.right.value}`,
    children: [convert(n.left), convert(n.right)]
  };
}

export default function Path({node}) {
  if(!node) throw new Error("Path node prop is undefined");
  const data = hierarchy(convert(node));
  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill={bg} stroke={fg}
        strokeOpacity={0.2} />
      <Cluster
        top={margin.top}
        left={margin.left}
        root={data}
        size={[
          width - margin.left - margin.right,
          height - margin.top - margin.bottom
        ]}
        linkComponent={Link}
        nodeComponent={Node}
      />
    </svg>
  );
}

function Link({link}) {
  return <LinkVertical data={link}
    stroke={fg}
    strokeWidth="1"
    strokeOpacity={0.2}
    fill="none"
  />;
}

function Node({ node, events }) {
  const w=32, h=32;
  return (
    <Group top={node.y} left={node.x}>
      {node.children ?
        <rect width={w} height={h} y={-h/2} x={-w/2} fill={bg}/> :
        <rect width={w} height={h} y={-h/2} x={-w/2} fill="#022992"
          stroke="#1c85bd" strokeWidth="4" /> }
      <text
        dy={".33em"}
        fontSize={fontSize}
        fontFamily="Arial"
        textAnchor={"middle"}
        style={{ pointerEvents: "none" }}
        fill={node.children ? fg : "white"}
      >
        {node.data.name}
      </text>
    </Group>
  );
}
