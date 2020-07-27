import React, { useRef } from 'react'
import useDoubleClick from 'use-double-click'
import { Star as KonvaStar } from 'react-konva'

const Star = ({ onDoubleClick, onDragMove, id, ...rest }) => {

    const ref = useRef();

    useDoubleClick({
        onDoubleClick: e => {
            onDoubleClick(id);
        },
        ref: ref,
        latency: 250
    });

    return (
        <KonvaStar
            numPoints={6}
            innerRadius={20}
            outerRadius={40}
            fill="#38ede7"
            draggable
            shadowColor="black"
            shadowBlur={2}
            shadowOpacity={0.6}
            onDragMove={onDragMove}
            ref={ref}
            {...rest}
        />
    )
}

export default Star