import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { themeVal } from '../../styles/utils/general';
import {themeVal} from '../../../styles/utils/general'
import { visuallyHidden, truncated } from '../../../styles/helpers';

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
//background:red;
border-bottom: 0.1px solid #E8E8E8;
// border-radius: 5px;
padding: 0 65px 0 45px;
//box-shadow: 2px 4px 8px rgba(0,0,0,0.1);
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
const MainContainer = styled.div`
display:flex;
height:74px;
width:100%;
//background-color:blue;
`
const Swatch = styled.div`
position:absolute;
height:69px;
margin-left:2px;
margin-top:2px;
border-radius: 25px;
width:3.8px;
z-index:999999;
background-color:#C0C0C0;
`
const Main = styled.div`
height:100%;
width:100%;
`

const Slider = (props) =>{

    const [value, setValue] = useState(100);

    const changeHandler = (e) =>{
        //console.log(e.target.value)
        // sliderValue.textContent = e.target.value + '%';
        setValue(e.target.value);
        props.slideHandler(e.target.value);
    }

    return(
        <MainContainer>
            <Main>
                <Swatch/>
                <Range>
                    <SliderValue><span>100</span></SliderValue>
                    <LayerTitle title={'Image Opacity'}>Image Opacity: {value}%</LayerTitle>
                    <Field>
                        <div className="value left">0</div>
                        <input type="range" min="0" max="100" value={value} onChange={changeHandler} steps="1"/>
                        <div className="value right">100</div>
                    </Field>
                </Range>       
            </Main>
        </MainContainer>
    )
}

export default Slider