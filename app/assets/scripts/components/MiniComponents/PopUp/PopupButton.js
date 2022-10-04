import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
import Button from "../../../styles/button/button";
import Popups from "./Popup";

const Outer_container = styled.div`
position:absolute;
float:right;
width:1.9rem;
height:auto;
z-index:10;
top:7.4rem;
right:.55rem;
left:null;
bottom:null;
background-color:white;
padding:3px;
border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;
`;

const PopupButton = () =>{

    const [active, setActive] = useState(false);
    var timer;

    const clickHandler = () =>{
        if(active === true){
            setActive(false)
            clearInterval(timer)
        }else{
            setActive(true);
            timer = setTimeout(()=>{
                setActive(false);
            },10000)
        }
    }

    return(
        <>
            <Outer_container>
                <Button
                    variation='base-plain'
                    size='small'
                    useIcon='circle-information'
                    title='Show Popups'
                    hideText
                    onClick={clickHandler}
                >
                    <span>Info</span>
                </Button>
            </Outer_container>
            {active && < Popups value={['Hey, Welcome to Lightning Dashboard']} place={'top-right'} timer={3000}/>}
            {active && <Popups value={['Here in the left nav bar you can toggle  to activate layers']} place={'top-left'} timer={5000}/>}
            {active && <Popups value={['Timeline section (Toggle Layers to activate). Select different dates to render different COG.']} place={'bottom-left'} timer={10000}/>}
        </>

    )

}

export default PopupButton