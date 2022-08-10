import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
import Button from '../../../styles/button/button'

const Outer_container = styled.div`
position:absolute;
float:right;
width:2rem;
height:auto;
z-index:1000;
top:3rem;
right:null;
left:0.5rem;
bottom:null;
background-color:${(props)=>props.styleColor};
padding:5px;
border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;
display:flex;
justify-content:center;
`

const MapButton = (props) =>{

    const [styleColor, changeStyleColor] = useState("white");

    const clickHandler = () =>{
        if(styleColor === 'white'){
            changeStyleColor('#007afc')
        }else{
            changeStyleColor('white')
        }
        props.mapStyle();
    }

    return(
        <Outer_container styleColor={styleColor}>
            <Button
                variation='base-plain'
                size='small'
                useIcon='map'
                title='Enable/Disable labels'
                hideText
                onClick={clickHandler}
            >
                <span>Info</span>
            </Button>
        </Outer_container>
    )
}

export default MapButton