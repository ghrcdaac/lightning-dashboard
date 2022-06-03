import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import JsonData from './CustomCalendar-data.json'
import find from 'lodash.find';

const ButtonContainer = styled.div`
//position:absolute;
//background-color:red;
display:flex;
text-align:center;
flex-wrap:wrap;
justify-content:center;
align-items:center;
`
const Button = styled.div`
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
margin-bottom: 7px;
margin-right: 7px;
border: 1px solid black;
cursor:pointer;
padding: 2px;
width: 75px;
height: 65px;
text-align:center;
justify-content:center;
align-items:center;
`

const CustomCalendar = ({ id, onClick }) =>{

    const arr = JsonData.layers.filter((layer)=> layer.id === id)

    // const clickHandler = () =>{
    //     onClick();
    // }

    return(
        <ButtonContainer>
            {arr !== null && arr[0].data.map((data)=>(
                <Button onClick={()=>onClick(data[0])}>
                    <div style={{display:'flex', flexDirection:'column', textAlign:'center', justifyContent:'center', alignItems:'center'}}>
                        <div>{data[1]}</div>
                        {data.length > 2 && <div>{data[2]}</div>}
                    </div>
                </Button>
            ))}
        </ButtonContainer>
    )

}

export default CustomCalendar