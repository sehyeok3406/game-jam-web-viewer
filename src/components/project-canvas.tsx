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
  'document' | 'group'
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
  ({
    cream: '#ecdba8',
    green: '#bad7bf',
    blue: '#c4d8e4',
    rose: '#e6c9c5',
    purple: '#d4c4e8',
    gray: '#c9c9c9',
  })[node.data.document.color];

export default function ProjectCanvas({
  documents,
  sections,
  onOpen,
}: {
  documents: ViewerDocument[];
  sections: {
    id: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
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
        style: {
          pointerEvents: 'all',
          width: document.width ? Math.max(180, document.width) : undefined,
          height: document.height ? Math.max(150, document.height) : undefined,
        },
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
      nodes={[
        ...sections.map((section): DocumentNode => ({
          id: `section:${section.id}`,
          type: 'group',
          position: { x: section.x, y: section.y },
          data: {
            document: {
              id: section.id,
              title: section.title,
              kind: 'document',
              section: section.title,
              summary: '',
              body: '',
              position: { x: section.x, y: section.y },
              color: 'gray',
            },
            onOpen,
          },
          style: {
            width: section.width,
            height: section.height,
            background: '#e9e4d540',
            border: '1px dashed #ada896',
            pointerEvents: 'none',
          },
          ariaLabel: section.title,
          selectable: false,
          draggable: false,
          deletable: false,
        })),
        ...nodes,
      ]}
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
