import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import { data } from '../../../data/HotSpotData';

const OuterContainer = styled.div`
height:10px;
width:10px;
//z-index:100;
//background-color:white;
`

const HotSpots = styled.div.attrs(props=>({
    style:{
        height:props.size,
        width:props.size
    },
}))`
background-color:#FDD023;
border-radius:50%;
margin-bottom:5px;
:hover{
    cursor:pointer;
}
z-index:5;
`

// const HotSpots = styled.div`
// height:20px;
// width:20px;
// background-color:#FDD023;
// //background-color:#e5ebe6;
// border-radius:50%;
// margin-bottom:5px;
// :hover{
//     cursor:pointer;
// }
// z-index:5;
// `

const Display = styled.div`
height:3rem;
width:5rem;
background-color:#F5F5DC;
color:#8B8000;
font-size:10px;
font-weight:bold;
position:relative;
left:20px;
z-index:10;
`
const InnerDisplay = styled.div`
margin-left:4px;
display:flex;
flex-direction:column;
justify-content:center;
z-index:10;
//text-align:center;
//align-items:center;
`
const Hover = styled.div`
height:12px;
width:12px;
background:transparent;
z-index:5;
:hover{
    cursor:pointer;
}
`
const HotSpot = ({ children, feature}) => {

    const [display, setDisplay]  = useState(false)
    const size = (feature.flashes/7) + 'px';
    const _onClick = (e) => {
    };
  
    const displayInfo = (e) =>{
        setDisplay(true)
    }

    const removeDisplay = () =>{
        setDisplay(false)
    }

    return (
        <OuterContainer>
            <Hover onMouseOver={displayInfo} onMouseLeave={removeDisplay}>
                <HotSpots onClick={_onClick} size={size} className="marker">
                    {children}
                </HotSpots>
            </Hover>
            {display && <Display>
                <InnerDisplay>
                    <div style={{zIndex:'1000'}}>Lat: {(feature.lat).slice(0,8)}</div>
                    <div style={{zIndex:'1000'}}>Lng: {(feature.lng).slice(0,8)}</div>
                    <div style={{zIndex:'1000'}}>Flash: {(feature.flashes).slice(0,8)}</div>
                </InnerDisplay>
            </Display>}
        </OuterContainer>
    );
};

export default HotSpot