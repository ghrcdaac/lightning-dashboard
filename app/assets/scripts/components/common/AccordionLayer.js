import React from "react";
import styled from 'styled-components';

export const AccordionContainer = styled.div`
display:flex;
flex-direction:column;
`
export const DatasetSwatch = styled.div`
position:absolute;
height:49px;
margin-left:2px;
margin-top:1.3px;
border-radius: 25px;
width:3.8px;
z-index:999;
background-color:#C0C0C0;
`

export const TitleWrapper = styled.div`
display:flex;
height:50px;
width:90%;
justify-content:space-between;
margin-left:15px;
align-items:center;
text-align:center;
font-weight: bold;
position:relative;
background-color:white;
z-index:10;
:hover{
    cursor:pointer;
}
`

export const AccordionTitle = styled.div`
height:50%;
`

export const BottomLineAccordion = styled.div`
width:100%;
height:1px;
background-color:#E8E8E8;
`

export const AccordionBody = styled.div`
position:relative;
-webkit-animation: slideDown-body 0.10s;
-moz-animation: slideDown-body 0.10s; 
-ms-animation: slideDown-body 0.10s;
-o-animation: slideDown-body 0.10s; 
animation: slideDown-body 0.10s; 

@keyframes slideDown-body {
    0%      {top:-400px}
    12.5%   {top:-350px}
    25%     {top:-300px}
    37.5%   {top:-250px}
    50%     {top:-200px}
    62.5%   {top:-150px}
    75%     {top:-100px}
    87.5%   {top:-50px}
    100%    {top:0px}
}

@keyframes slideUp-body {
    0%      {top:0px}
    12.5%   {top:-50px}
    25%     {top:-100px}
    37.5%   {top:-150px}
    50%     {top:-200px}
    62.5%   {top:-250px}
    75%     {top:-300px}
    87.5%   {top:-350px}
    100%    {top:400px}
}

z-index:5;
`
export const PanelTitle = styled.div`
display:flex;
justify-content:center;
align-items:center;
text-align:center;
font-weight: bold;
height:50px;
border:1px solid grey;
`