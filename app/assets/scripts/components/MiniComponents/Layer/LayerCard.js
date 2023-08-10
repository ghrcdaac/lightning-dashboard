import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';

const Container = styled.div`
display: flex;
flex-direction: column;
border-radius: 6px;
width: 111px; /* Set the width */
height: 101px; /* Set the height */
margin-right:40px;
background-color:white;
&:hover,
&:focus {
  /* Blue glow effect on hover or focus */
  box-shadow: 0 0 10px rgba(29, 161, 242, 0.5);
  background-color: rgba(29, 161, 242, 1);
  cursor:pointer;
}
`
const ImageContainer = styled.div`
width:100%;
height:65%;
background-image: url('https://www.distancecme.com/wp-content/uploads/2018/05/Lightening-scaled.jpg'); /* Replace with your image URL */
background-size: cover;
background-position: center;
border-radius: 4px 4px 0px 0px;
border:0px;
`
const TextContainer = styled.div`
width:100%;
height:35%;
text-align:center;
justify-content:center;
align-items:center;
display:flex;
font-weight: bold;
font-size: 12px;
`

const LayerCard = () =>{

    return (
        <Container>
            <ImageContainer>
            </ImageContainer>
            <TextContainer>
                TRMM LIS FULL
            </TextContainer>
        </Container>
    )
}

export default LayerCard