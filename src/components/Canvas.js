import React, { useState } from 'react'
import { Stage, Layer } from 'react-konva'
import styled from 'styled-components'
import StarImg from './../images/star.JPG'
import ConnectorImg from './../images/connector.JPG'
import Star from './Star'
import { STAR, CONNECTOR, STAR_CLASS, CONNECTOR_LENGHT_DEFAULT } from './../constants'
import Edge from './Edge'
import findIndex from 'lodash/findIndex'
import { haveIntersection } from './../utils'

const Canvas = () => {

    const dragType = React.useRef();
    const stageRef = React.useRef();

    const [stars, setStars] = useState([]);
    const [connectors, setConnectors] = useState([]);


    const removeStar = (id) => {

        let starIndex = findIndex(stars, { 'id': id });

        setStars(stars.filter(item => item.id !== id));
        setConnectors(connectors.filter(item => (item.indexNode1 !== starIndex && item.indexNode2 !== starIndex)));

    }

    const updateStarPosition = (e) => {

        let items = [...stars];
        let index = e.target.index;
        let item = {
            ...items[index],
            x: stageRef.current.getPointerPosition().x,
            y: stageRef.current.getPointerPosition().y
        };
        items[index] = item;
        setStars(items);
    }

    const removeConnector = (id) => {
        setConnectors(connectors.filter(item => item.id !== id));
    }

    // const updateConnectorPosition = (e) => {

    //     let items = [...connectors];
    //     let index = e.target.index;

    //     let item = {
    //         ...items[index],
    //         x: stageRef.current.getPointerPosition().x,
    //         y: stageRef.current.getPointerPosition().y
    //     };
    //     items[index] = item;
    //     console.log(item)
    //     setConnectors(items);
    // }

    const createUniqtId = ({ x, y }) => (x * y)

    const addShape = (e) => {

        stageRef.current.setPointersPositions(e);

        switch (dragType.current) {
            case STAR:
                setStars([...stars,
                {
                    ...stageRef.current.getPointerPosition(),
                    id: createUniqtId(stageRef.current.getPointerPosition()),
                    type: dragType.current,
                }]
                );
                break;

            case CONNECTOR:
                setConnectors([...connectors,
                {
                    x: stageRef.current.getPointerPosition().x,
                    y: stageRef.current.getPointerPosition().y,
                    toX: stageRef.current.getPointerPosition().x + CONNECTOR_LENGHT_DEFAULT,
                    toY: stageRef.current.getPointerPosition().y,
                    id: createUniqtId(stageRef.current.getPointerPosition()),
                    type: dragType.current,
                    indexNode1: null,
                    indexNode2: null
                }]
                );
                break;
        }
    }

    const verifyConnection = (connectTo, starIndex) => {
        if (connectTo === null || connectTo === starIndex) {
            return true
        } 
        alert("Ouups! Already Taken!");
        return false
    }


    const getIndexFromState = (connector) => {

        //Due to problems in changing location please don't move "From edge"
        console.log(connector.attrs.points);

        let fromX = connector.attrs.points[0];
        let fromY = connector.attrs.points[1];
        let ToX = connector.attrs.points[2];
        let ToY = connector.attrs.points[3];

        let index1 = findIndex(connectors, {'x': fromX, 'y': fromY});
        console.log("found index1: " + index1);
        let index2 = findIndex(connectors, {'toX': ToX, 'toY': ToY});
        console.log("found index2: " + index2);
        return index1 || index2;
    }

    const updateConnectorsLocationInSate = (connector, starIndex, searchBy) => {
        
        let items = [...connectors];
        let connectorIndex = null;
        let item;

        if (searchBy === "from") {
            let fromX = connector.attrs.points[0];
            let fromY = connector.attrs.points[1];
            connectorIndex = findIndex(connectors, {'x': fromX, 'y': fromY});
            console.log(connectorIndex);
            item = items[connectorIndex];
            item.toX = stars[starIndex].x;
            item.toY = stars[starIndex].y;
        } else {
            let toX = connector.attrs.points[2];
            let toY = connector.attrs.points[3];
            connectorIndex = findIndex(connectors, {'toX': toX, 'toY': toY});
            console.log(connectorIndex);
            item = items[connectorIndex];
            item.x = stars[starIndex].x;
            item.y = stars[starIndex].y;
        }
        items[connectorIndex] = item;
        setConnectors(items);
    }

    const connectShapes = (star, connector) => {

        let items = [...connectors];
        let index = getIndexFromState(connector);
        // let index = 0;
        let item = items[index];
        let starData = stars[star.index];
        let starX = starData.x;

        if (Math.abs(item.x - starX) > Math.abs(item.x + CONNECTOR_LENGHT_DEFAULT - starX))
        {
            item.indexNode1 = 
                verifyConnection(item.indexNode1, star.index) 
                    ? star.index : item.indexNode1;
            items[index] = item;
            setConnectors(items);
            updateConnectorsLocationInSate(connector, star.index, "from");
        } else {
            item.indexNode2 =
                verifyConnection(item.indexNode2, star.index)
                    ? star.index : item.indexNode1;
            items[index] = item;
            setConnectors(items);
            updateConnectorsLocationInSate(connector, star.index, "to");
        }
    }

    const connectHandler = (e) => {

        let star = null;
        let connector = null;
        let target = e.target;
        let intersect = false;
        target.parent.children.forEach(child => {
            if (child !== target && child.constructor.name !== target.constructor.name) {
                intersect = haveIntersection(child.getClientRect(), target.getClientRect());
                if (intersect) {
                    star = target.constructor.name === STAR_CLASS ? target : child;
                    connector = target.constructor.name === STAR_CLASS ? child : target;
                    connectShapes(star, connector);
                }
            }
        })
    }

    return (
        <Wrapper>
            <Buttons>
                <img
                    alt="star"
                    width="100px"
                    height="100px"
                    src={StarImg}
                    draggable="true"
                    onDragStart={e => {
                        dragType.current = STAR;
                    }}
                />
                <img
                    alt="connector"
                    width="100px"
                    height="100px"
                    src={ConnectorImg}
                    draggable="true"
                    onDragStart={e => {
                        dragType.current = CONNECTOR;
                    }}
                />
            </Buttons>
            <div
                onDrop={addShape}
                onDragOver={e => {
                    e.preventDefault();
                }}
            >
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    width="800"
                    height="500"
                    style={{ border: '1px solid grey' }}
                    ref={stageRef}
                >
                    <Layer>
                        {stars.map((star, i) =>
                            <Star
                                key={i}
                                id={star.id}
                                x={star.x}
                                y={star.y}
                                onDoubleClick={removeStar}
                                onDragMove={updateStarPosition}
                                onDragEnd={connectHandler}
                            />
                        )}
                        {connectors.map((connector, i) =>
                            <Edge
                                key={i}
                                id={connector.id}
                                x={connector.x}
                                y={connector.y}
                                onDoubleClick={removeConnector}
                                // onDragMove={updateConnectorPosition}
                                indexNode1={connector.indexNode1}
                                indexNode2={connector.indexNode2}
                                // onDragEnd={connectHandler}  BUggy because of problems in connector location
                                onClick = {e => {
                                    console.log(connectors)
                                    console.log(e)
                                }}
                                stars={stars}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
`

const Buttons = styled.div`
    display: flex;
    flex-direction: column;
`

export default Canvas