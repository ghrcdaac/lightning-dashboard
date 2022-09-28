import React from "react";
import styled from 'styled-components';

export const AccordionContainer = styled.div`
display:flex;
flex-direction:column;

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
display:null;
`