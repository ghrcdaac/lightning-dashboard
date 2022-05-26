import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import Button from '../styles/button/button'

const Outer_container = styled.div`
position:absolute;
float:right;
width:2rem;
height:auto;
z-index:1000;
top:5.6rem;
right:null;
left:0.5rem;
bottom:null;
background-color:${(props)=>props.styleColor};
//background-color:white;
padding:5px;
border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;
display:flex;
justify-content:center;
`

const MarkerButton = (props) =>{

    const [styleColor, changeStyleColor] = useState("white");

    const clickHandler = () =>{
        if(styleColor === 'white'){
            changeStyleColor('#34a853')
        }else{
            changeStyleColor('white')
        }
        props.onClick();
    }

    return(
        <Outer_container styleColor={styleColor}>
            <Button
                variation='base-plain'
                size='small'
                useIcon='marker'
                title='Enable/Disable Marker'
                hideText
                onClick={clickHandler}
            >
                <span>Info</span>
            </Button>
        </Outer_container>
    )
}

export default MarkerButton