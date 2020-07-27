import React, { useRef } from 'react'
import { Arrow } from 'react-konva'
import useDoubleClick from 'use-double-click'
import { CONNECTOR_LENGHT_DEFAULT } from './../constants'

const Connector = ({ stars, indexNode1, indexNode2, id, x, y, onDoubleClick, onDragMove, onDragEnd }) => {

    let node1=stars[indexNode1];
    let node2=stars[indexNode2];
    
    const ref = useRef();

    useDoubleClick({
        onDoubleClick: e => {
            onDoubleClick(id);
        },
        ref: ref,
        latency: 250
    });

    const radius = 20;

    let dx = CONNECTOR_LENGHT_DEFAULT;
    let dy = 0;
    let angle = Math.atan2(-dy, dx);

    if (node1 && node2) {
        dx = node1.x - node2.x;
        dy = node1.y - node2.y;
        angle = Math.atan2(-dy, dx);
    }

    let arrowStart = node2 ? {
        x: node2.x + -radius * Math.cos(angle + Math.PI),
        y: node2.y + radius * Math.sin(angle + Math.PI)
    } : { x: x, y: y };

    let arrowEnd = node1 ? {
        x: node1.x + -radius * Math.cos(angle),
        y: node1.y + radius * Math.sin(angle)
    } : { x: x + CONNECTOR_LENGHT_DEFAULT, y: y };
    
    return (
        <Arrow
            points={[arrowStart.x, arrowStart.y, arrowEnd.x, arrowEnd.y]}
            stroke="#000"
            strokeWidth={5}
            // draggable //temporary, because of the problems with connector location
            onDoubleClick={onDoubleClick}
            onDragMove={onDragMove}
            pointerWidth={5}
            onDragEnd={onDragEnd}
            ref={ref}
        />
    );
};

export default Connector
