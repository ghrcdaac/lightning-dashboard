import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { themeVal } from '../../styles/utils/general';
import {themeVal} from '../styles/utils/general'
import { visuallyHidden, truncated } from '../styles/helpers';
import { FormSwitch } from "../styles/form/switch";
import { glsp } from '../styles/utils/theme-values';
import CalendarTag from "./CalendarTag";

const Outer_Container = styled.div`
height: 65px;
//position:absolute;
width: 100%;
background: #fff;
border-radius: 5px;
padding: 0 65px 0 45px;
box-shadow: 2px 4px 8px rgba(0,0,0,0.1);
//display:flex;
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

const LayerSwatch = styled.span`
  position: absolute;
  height:3.7rem;
  top: 31.5rem;
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

const Body = styled.div`
//background-color:blue;
//margin-top:0.2rem;
margin-left:-1.8rem;
`

const Container = styled.div`
display:flex;
justify-content:space-between;
`

const SwitchDiv = styled.div`
margin-top:0.3rem;
margin-right:-2.5rem;
`

const BaselineToggle = (props) =>{

    const [status, setStatus] = useState(false);
    const [value, setValue] = useState('Datasets');
    const [date, setDate] = useState('');
    //var value = 'Datasets';

    const onToggleClick = () =>{
        setStatus(!status)
    }

    const changeHandler = (e) =>{
        if(e.target.value !== 'Datasets'){
            props.baselineId(e.target.value);
        }
        setValue(e.target.value);
    }

    return(
        <Outer_Container>
            <LayerSwatch swatch={'#C0C0C0'}>
                <small>Color: {'Grey' || 'Grey'}</small>
            </LayerSwatch>
            <Container>
                <LayerTitle title={'Image Opacity'}>Baseline Image</LayerTitle>
                {(props.activeLayers.length !== 0) && (value !== 'Datasets') && <CalendarTag layers={props.layers} onClick={props.baselineHandler} comparingId={props.comparingId}/>}
                {/* <SwitchDiv>
                    <FormSwitch
                        hideText
                        onChange={onToggleClick}
                    >
                        Toggle Baseline Layer
                    </FormSwitch>
                </SwitchDiv> */}
            </Container>
            {(props.activeLayers.length !== 0) &&  
            <Body>
                <select name="layers" id="layers" onChange={changeHandler}>
                    <option>Datasets</option>
                    {props.layers.map((layer)=>(
                        <option key={layer.id}>{layer.id}</option>
                    ))}
                </select>
            </Body>}
            {props.activeLayers.length === 0 && 
            <Body>
                <h6 style={{marginTop:'0.5rem', color:'red'}}>Warning: Activate layer to compare</h6>
            </Body>}
        </Outer_Container>
    )
}

export default BaselineToggle