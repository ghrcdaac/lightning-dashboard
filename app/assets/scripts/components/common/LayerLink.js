import React from "react";
import styled from 'styled-components';

const COLOR = '#2276AC';

export const TitleBlock = styled.div`
display:flex;
justify-content:space-around;
//background-color:red;
width:100%;
transition:slideRight 0.6s ease;
`
export const TitleName = styled.div`
text-align:center;
:hover{
  cursor:pointer;
  color:${COLOR};
}
//left:0;
color:${(props)=>props.color}
`
export const LayerTitle = styled.div`
display:flex;
flex-direction:column;
width:50%;
margin-right:10px;
transition:1s;
left:0;
justify-content:center;
align-items:center;
color:${(props)=>props.color};
transition:slideRight 0.6s ease;
-webkit-animation: fadein 3s;
-moz-animation: fadein 3s; 
-ms-animation: fadein 3s;
-o-animation: fadein 3s; 
animation: fadein 3s; 

:hover{
  color:#2276AC;
}
`

export const LinkTitle = styled.div`
display:flex;
flex-direction:column;
width:50%;
margin-left:10px;
transition:1s;
left:0;
justify-content:center;
align-items:center;
:hover{
  color:#2276AC;
}
color:${(props)=>props.color}
`
export const BottomLine = styled.div`
width:124%;
height:3px;
background-color:grey;
//transition:1s;
left:${(props)=>props.left};
justify-content:center;
align-items:center;
background-color:#2276AC;
position:relative;
top:10px;
-webkit-animation: ${(props)=>props.animation};
-moz-animation: ${(props)=>props.animation}; 
-ms-animation: ${(props)=>props.animation};
-o-animation: ${(props)=>props.animation}; 
animation: ${(props)=>props.animation}; 

@keyframes fadein-title {
  0% { left:0px }
  25% { left:34.5px }
  50% {left:69px}
  75% {left:103.5px}
  100% {left:138px}
}

@keyframes fadeout-title {
  0% { left:138px }
  25% {left:103.5px}
  50% {left:69px}
  75% { left:34.5px }
  100% { left:0px }
}
`
export const LinkContainer = styled.div`
//background-color:red;
padding-top:5px;
width:17rem;
`

export const Link = styled.div`
padding-bottom:15px;
padding-left:15px;
padding-right:15px;
//background-color:white;
font-weight:bold;
width:17rem;
`

export const LayerBody = styled.div`
width:70%;
`
export const LinkBody = styled.div`
width:30%;
`
export const MainBody = styled.div`
display:flex;
position:relative;
width:25.8rem;
//left:-280px;
left:${(props)=>props.left};
-webkit-animation: ${(props)=>props.animation};
-moz-animation: ${(props)=>props.animation}; 
-ms-animation: ${(props)=>props.animation};
-o-animation: ${(props)=>props.animation}; 
animation: ${(props)=>props.animation}; 

@keyframes fadein-body {
  0% { left:0px }
  25% { left:-70px }
  50% {left:-140px}
  75% {left:-210px}
  100% {left:-280px}
}

@keyframes fadeout-body {
  0% {left:-280px}
  25% {left:-210px}
  50% {left:-140px}
  75% { left:-70px }
  100% { left:0px }
}
`