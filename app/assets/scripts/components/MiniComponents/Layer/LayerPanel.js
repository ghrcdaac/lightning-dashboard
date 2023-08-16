import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import LayerCard from './LayerCard';
import { layer } from '../../../data/layers.json';

const Container = styled.div`
width:90%;
height:120px;
background-color: none;
position: absolute;
display:flex;
flex-direction:row;
overflow-x:auto;
bottom:20px;
margin-left:100px;
`

//TODO: add arrow sliders on left and right
const LayerPanel = ({ onAction }) =>{

    const [activeLayer, setactiveLayer] = useState({"name":"null"})

    const clickHandler = (layer) => {
        setactiveLayer(layer)
        onAction('layer.toggle', layer)
    }

    const setActive = (layer) => {
        setactiveLayer(layer)
    }

    return (
        <Container>
            {layer.map(( single_layer )=>(
                <LayerCard 
                clicked={clickHandler}
                layer={single_layer}
                activeLayer={activeLayer}
                />
            ))}
        </Container>
    )
}

export default LayerPanel