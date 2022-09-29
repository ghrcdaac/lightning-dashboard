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
z-index:999999;
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
//top:0px;
//bottom:500px;
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