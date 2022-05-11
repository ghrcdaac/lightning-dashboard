import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';

const Outer_container = styled.div`
font: bold 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
//position: relative;
float:left;
width: 18rem;
top: null;
right:null;
left: 0rem;
bottom:8rem;
padding: 10px;
z-index:1000;
//background-color: red;
`;

const Inner_container = styled.div`
background-color: #fff;

box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
border-radius: 3px;
padding: 10px;
margin-bottom: 10px;
border: .05rem solid grey;
`;

const Slider = (props) =>{

    const [value, setValue] = useState(100);

    const changeHandler = (e) =>{
        //console.log(e.target.value)
        // sliderValue.textContent = e.target.value + '%';
        setValue(e.target.value);
        props.slideHandler(e.target.value);
    }

    return( 
        <Outer_container>
            <Inner_container>
                <label>Layer opacity: <span id="slider-value">{value}%</span></label>
                <input style={{width: '100%'}} onChange={changeHandler} id="slider" type="range" min="0" max="100" step="0" value={value} orient='vertical'/>
            </Inner_container>
        </Outer_container>
    )
}

export default Slider