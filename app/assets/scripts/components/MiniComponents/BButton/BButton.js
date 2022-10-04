import React from "react";
import styled from "styled-components";
import Download from "../../../utils/Download";

const Button = styled.div`
width:50%;
:hover{
    cursor:pointer;
}
//background-color: #4CAF50; /* Green */
background-color:${(props)=>props.color};
border: none;
color: white;
padding: 10px 20px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
`


const BButton = ({ name, color, data }) =>{

    return(
        <Button color={color} onClick={()=>Download(data)}>{name}</Button>
    )

}

export default BButton