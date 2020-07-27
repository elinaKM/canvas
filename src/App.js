import React from 'react'
import styled from 'styled-components'
import Canvas from './components/Canvas'

function App() {
  return (
    <Canvas/>
  );
}

const Sidebar = styled.div`
  display: flex;
`

const Star = styled.button`
  border: 1px solid green;
  height: 100px;
  width: 100px;
`

const Wrapper = styled.div`
  display: flex;
`

export default App;
