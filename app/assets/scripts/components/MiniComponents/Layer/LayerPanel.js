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