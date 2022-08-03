import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import { data } from '../../../data/HotSpotData';
import ReactMapGL, {Marker, Popup } from 'react-map-gl';

const OuterContainer = styled.div`
height:10px;
width:10px;
//z-index:100;
//background-color:white;
// background-color: rgb(300, 300, 300);
`

// const HotSpots = styled.div.attrs(props=>({
//     style:{
//         height:props.size,
//         width:props.size
//     },
// }))`
// background-color:#FDD023;
// //background-color:#e5ebe6;
// background-image:url("https://i.pinimg.com/564x/a5/2e/3e/a52e3ead549f0fef288d9d074b979df2--computer.jpg");
// border-radius:50%;
// margin-bottom:5px;
// :hover{
//     cursor:pointer;
// }
// z-index:5;
// `

const HotSpots = styled.button`
height:30px;
width:30px;
border:none;
//background:url("https://www.nicepng.com/png/detail/48-480695_google-marker-pin-google-map-pointer-vector.png");
background-image:url("../../../../../assets/graphics/meta/favicon.png");
background-repeat: no-repeat;
background-size: contain;
//background-color:green;
//border-radius:50%;
margin-bottom:5px;
:hover{
    cursor:pointer;
}
z-index:5;
`

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
height:15px;
width:15px;
background-image:url("https://i.pinimg.com/564x/a5/2e/3e/a52e3ead549f0fef288d9d074b979df2--computer.jpg");
z-index:5;
:hover{
    cursor:pointer;
}
`
const HotSpot = ({ children, feature}) => {

    const [display, setDisplay]  = useState(false)
    const size = (feature.flashes/130) + 'px';
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
            <HotSpots onClick={_onClick} size={size} className="marker">
                {children}
            </HotSpots>
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