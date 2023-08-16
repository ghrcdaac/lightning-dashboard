import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import LayerCard from './LayerCard';
// import { layer } from '../../../data/layers.json';

const Container = styled.div`
width:90%;
height:120px;
background-color: none;
position: absolute;
display:flex;
flex-direction:row;
overflow-x:auto;
bottom:${(props)=>props.bottom};
margin-left:100px;

overflow-y: auto;
scrollbar-width: thin; /* For Firefox */
scrollbar-color: #ccc transparent; /* For Firefox */

&::-webkit-scrollbar {
  width: 8px; /* Adjust as needed */
  height:8px;
}

&::-webkit-scrollbar-track {
  background: transparent;
}

&::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

&::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}

&:hover {
  &::-webkit-scrollbar-thumb {
    background-color: #888;
  }
}

&:not(:hover) {
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
}
`

//TODO: add arrow sliders on left and right
const LayerPanel = ({ onAction, layers, activeLayer }) =>{

    var bottom = '20px'
    if(activeLayer.length !== 0) {
        bottom = '150px'
    }

    const clickHandler = (layer) => {
        onAction('layer.toggle', layer)
    }

    return (
        <Container bottom={bottom}>
            {layers.map(( layer )=>(
                <LayerCard 
                clicked={clickHandler}
                layer={layer}
                activeLayer={activeLayer}
                />
            ))}
        </Container>
    )
}

export default LayerPanel