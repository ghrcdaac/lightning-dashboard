import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';

const Outer_container = styled.div`
position:absolute;
float:right;
width:15vw;
height:auto;
top:${(props) => props.top};
right:${(props) => props.right};
left:${(props) => props.left};
bottom:${(props) => props.bottom};
z-index:1000;
//background-color:${(props) => (props.primary ? props.primary :'red')};
`;

const Inner_container = styled.div`
float: right;
background-color: white;
//z-index: 1000;
font-family: monospace;
padding:10px;
display: flex;
justify-content: space-between;
width: 15vw;
height:'auto';
margin:.5rem;
border-top-right-radius:15px;
border-top-left-radius:15px;
border-bottom-right-radius:15px;
border-bottom-left-radius:15px;

-webkit-animation: fadein 3s;
-moz-animation: fadein 3s; 
-ms-animation: fadein 3s;
-o-animation: fadein 3s; 
animation: fadein 3s; 


@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}


@-moz-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
} 

@-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

`;

const Popups = (props) =>{

    const popup_lr = 'popup-left-right'
    const popup_tline = 'popup-timeline'

    console.log('im insdie popup')
    if(props.whichPop === popup_lr) localStorage.setItem(popup_lr, true)
    else localStorage.setItem(popup_tline, true)

    let TIMER = 5000;

    if(props.timer) TIMER = props.timer

    let place = 'top-right'

    let top='0';
    let right = 'null';
    let left = '4rem';
    let bottom='null';

    switch(props.place){
        case 'top-right':
            top='0';
            right='4rem';
            left='null';
            bottom='null'
            break;
        case 'top-left':
            top='5.5rem';
            right='null';
            left='1rem';
            bottom='null'
            break;
        case 'bottom-right':
            top='null';
            right='0';
            left='null';
            bottom='10rem'
            break;
        case 'bottom-left':
            top='null';
            right='null';
            left='1rem';
            bottom='8.5rem'
            break;
    }


    return(
        <Outer_container place={place} top={top} right={right} left={left} bottom={bottom}>
            {props.value.map((val)=>{
                TIMER = TIMER + (TIMER/2);
                return <Popup value={val} timer={TIMER} key={val}/>
            })}
        </Outer_container>
    )
}

const Popup = (props) =>{

    const [active, setActive] = useState(true);

    const clickHandler = () =>{
        setActive(false);
    }

    // setTimeout(() => {
    //     setActive(false);
    // }, props.timer);

    return(
        <>
            {active &&
                <Inner_container>
                    <div>{props.value}</div>
                    <div><button onClick={clickHandler}>&#10006;</button></div>
                </Inner_container>
            }
        </>
    )
}


export default Popups;

