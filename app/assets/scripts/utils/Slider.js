import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { themeVal } from '../../styles/utils/general';
import {themeVal} from '../styles/utils/general'
import { visuallyHidden, truncated } from '../styles/helpers';
import { replaceSub2 } from '../utils/format';

const Outer_container = styled.div`
font: bold 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
//position: relative;
float:left;
width: 100%;
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
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
border-radius: 3px;
padding: 10px;
margin-bottom: 10px;
border: 0.01px solid grey;
//border: .05rem solid grey;
`;

const Input = styled.input`
-webkit-appearance: none;
width: 100%;
height: 5px;
background: #ddd;
border-radius: 10px;
outline: none;
border: none;
z-index: 2222;
margin-right:5px;

`
const Container = styled.div`
display:flex;
align-items:center;
`
const Left = styled.div`
margin-right:5px;
`
const Right = styled.div`
`
const LayerSwatch = styled.span`
  position: absolute;
  height:70px;
  top: 22.7rem;
  left: 0.125rem;
  bottom: 0.125rem;
  width: 0.25rem;
  //width:10rem;
  //background: grey;
  background: ${({ swatch }) => swatch || themeVal('color.primary')};
  border-radius: ${themeVal('shape.rounded')};

  > * {
    ${visuallyHidden()}
  }
`;
const LayerTitle = styled.h1`
  ${truncated()}
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0;
  margin-top:8px;
  margin-left:-30px;
  sub {
    bottom: 0;
  }
`;


const Range = styled.div`
height: 65px;
//position:absolute;
width: 100%;
background: #fff;
border-radius: 5px;
padding: 0 65px 0 45px;
box-shadow: 2px 4px 8px rgba(0,0,0,0.1);
margin-bottom:0.8px;
input{
    //-webkit-appearance: none;
    width: 100%;
    height: 3px;
    background: #ddd;
    border-radius: 5px;
    outline: none;
    border: none;
    z-index: 2222;
}
input&:after{
    //-webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    background: #664AFF;
    border: 1px solid #664AFF;
    cursor: pointer;
}
`
const SliderValue = styled.div`
position: relative;
width: 100%;
span{
    position: absolute;
    height: 45px;
    width: 45px;
    transform: translateX(-70%) scale(0);
    font-weight: 500;
    top: -40px;
    line-height: 55px;
    z-index: 2;
    color: #fff;
    transform-origin: bottom;
    transition: transform 0.3s ease-in-out;
}
span.show{
    transform: translateX(-70%) scale(1);   
}
span:after{
    position: absolute;
    content: '';
    height: 100%;
    width: 100%;
    background: #664AFF;
    border: 3px solid #fff;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    border-bottom-left-radius: 50%;
    box-shadow: 0px 0px 8px rgba(0,0,0,0.1);
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
}
`

const Field = styled.div`
display: flex;
//background-color:red;
align-items: center;
justify-content: center;
height: 50%;
position: relative;
margin-top:5px;
.value{
    position: absolute;
    font-size: 16px;
    //color: #664AFF;
    color: Gray;
    font-weight: 600;
    //background-color:red;
    justify-content: center;
    align-items: center;
    //margin-top:1px;
}
.value.left{
    left: -23px;
    //background-color:red;
    justify-content: center;
    align-items: center;
    //margin-top:1px;
}
.value.right{
    right: -43px;
    //background-color:red;
    justify-content: center;
    align-items: center;
    //margin-top:1px;
}
`

const Slider = (props) =>{

    const [value, setValue] = useState(100);

    const changeHandler = (e) =>{
        //console.log(e.target.value)
        // sliderValue.textContent = e.target.value + '%';
        setValue(e.target.value);
        props.slideHandler(e.target.value);
    }

    // return( 
    //     <Outer_container>
    //         <Inner_container>
    //             <label>Image opacity: <span id="slider-value">{value}%</span></label>
    //             <input style={{width: '100%'}} onChange={changeHandler} id="slider" type="range" min="0" max="100" step="0" value={value} orient='vertical'/>
    //         </Inner_container>
    //     </Outer_container>
    // )

    //style={{display:'flex', justifyContent:'center', textAlign:'center', alignItems:'center'}}>

    return(
        <Range>
            <SliderValue><span>100</span></SliderValue>
            <LayerSwatch swatch={'#C0C0C0'}>
                <small>Color: {'Grey' || 'Grey'}</small>
            </LayerSwatch>
            <LayerTitle title={'Image Opacity'}>Image Opacity: {value}%</LayerTitle>
            <Field>
                <div className="value left">0</div>
                <input type="range" min="0" max="100" value={value} onChange={changeHandler} steps="1"/>
                <div className="value right">100</div>
            </Field>
        </Range>       
    )
}

export default Slider