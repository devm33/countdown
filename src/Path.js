import React from 'react';
import { Group } from '@vx/group';
import { Cluster } from '@vx/hierarchy';
import { LinkVertical } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import { hierarchy } from 'd3-hierarchy';

const width=600, height=300, fontSize=12,
  margin = { top: 40, left: 0, right: 0, bottom: 40 };

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
      <LinearGradient id="top" from="#79d259" to="#37ac8c" />
      <rect width={width} height={height} rx={14} fill="#306c90"/>
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
    stroke="#f7f7f3"
    strokeWidth="1"
    strokeOpacity={0.2}
    fill="none"
  />;
}

function Node({ node, events }) {
  const w=40, h=20, bg="#306c90", fg="#ddf163";
  return (
    <Group top={node.y} left={node.x}>
      {node.children ?
        <rect width={w} height={h} y={-h/2} x={-w/2} fill={bg}/> :
        <circle r={12} fill={bg} stroke={fg}/> }
      <text
        dy={".33em"}
        fontSize={fontSize}
        fontFamily="Arial"
        textAnchor={"middle"}
        style={{ pointerEvents: "none" }}
        fill={node.children ? "white" : fg}
      >
        {node.data.name}
      </text>
    </Group>
  );
}
