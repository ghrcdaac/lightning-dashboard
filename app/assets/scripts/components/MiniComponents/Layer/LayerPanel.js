import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import LayerCard from './LayerCard';

const Container = styled.div`
width:100%;
height:96px;
background-color: none;
position: absolute;
display:flex;
flex-direction:row;
bottom:20px;
margin-left:100px;
`

//TODO: add arrow sliders on left and right
const LayerPanel = (props) =>{

    return (
        <Container>
            {props.data.map(()=>(
                <LayerCard></LayerCard>
            ))}
        </Container>
    )
}

export default LayerPanel