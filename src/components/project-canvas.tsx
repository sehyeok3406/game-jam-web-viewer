'use client';

import { useMemo } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { ArrowUpRight, FileText, Sparkles } from 'lucide-react';
import type { ViewerDocument } from '@/lib/project';
import '@xyflow/react/dist/style.css';

type DocumentNode = Node<
  { document: ViewerDocument; onOpen: (document: ViewerDocument) => void },
  'document'
>;

function DocumentCard({ data }: NodeProps<DocumentNode>) {
  const { document, onOpen } = data;
  return (
    <button
      className={`canvas-document color-${document.color} nodrag`}
      aria-label={`${document.title} 문서 열기`}
      onClick={() => onOpen(document)}
    >
      <span className="note-eyebrow">
        {document.kind === 'idea' ? (
          <Sparkles size={13} />
        ) : (
          <FileText size={13} />
        )}
        {document.section}
        <ArrowUpRight size={14} />
      </span>
      <h3>{document.title}</h3>
      <p>{document.summary}</p>
      <span className="canvas-card-footer">
        문서 읽기 <ArrowUpRight size={14} />
      </span>
    </button>
  );
}

const nodeTypes = { document: DocumentCard };
const nodeColor = (node: DocumentNode) =>
  ({ cream: '#ecdba8', green: '#bad7bf', blue: '#c4d8e4', rose: '#e6c9c5' })[
    node.data.document.color
  ];

export default function ProjectCanvas({
  documents,
  onOpen,
}: {
  documents: ViewerDocument[];
  onOpen: (document: ViewerDocument) => void;
}) {
  const nodes = useMemo<DocumentNode[]>(
    () =>
      documents.map((document) => ({
        id: document.id,
        type: 'document',
        position: document.position,
        data: { document, onOpen },
        // Read-only nodes disable wrapper events by default; keep the document button clickable.
        style: { pointerEvents: 'all' },
        draggable: false,
        selectable: false,
        connectable: false,
        deletable: false,
      })),
    [documents, onOpen],
  );
  return (
    <ReactFlow<DocumentNode>
      key={documents.map((document) => document.id).join(',')}
      nodes={nodes}
      edges={[]}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      deleteKeyCode={null}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.3}
      maxZoom={1.8}
      proOptions={{ hideAttribution: false }}
      ariaLabelConfig={{
        'controls.zoomIn.ariaLabel': '확대',
        'controls.zoomOut.ariaLabel': '축소',
        'controls.fitView.ariaLabel': '전체 보기',
      }}
    >
      <Background color="#d9d7d0" gap={20} size={1} />
      <Controls showInteractive={false} aria-label="캔버스 확대·축소" />
      <MiniMap
        pannable
        zoomable
        nodeColor={nodeColor}
        ariaLabel="캔버스 전체 지도"
      />
    </ReactFlow>
  );
}
