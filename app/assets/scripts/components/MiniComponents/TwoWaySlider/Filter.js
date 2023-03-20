import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { themeVal } from '../../styles/utils/general';
import {themeVal} from '../../../styles/utils/general'
import { visuallyHidden, truncated } from '../../../styles/helpers';
import { Main, MainContainer, Swatch, Range, LayerTitle, Field, SliderValue } from "./styles";

const Filter = (props) =>{

    const [value, setValue] = useState(100);

    const changeHandler = (e) =>{
        //console.log(e.target.value)
        // sliderValue.textContent = e.target.value + '%';
        setValue(e.target.value);
        // props.slideHandler(e.target.value);
    }

    return(
        <MainContainer>
            <Main>
                <Swatch/>
                <Range>
                    <SliderValue><span>100</span></SliderValue>
                    <LayerTitle title={'Image Opacity'}>MetaData Filter: {value}%</LayerTitle>
                    <Field>
                        <div className="value left">0</div>
                        <input type="range" min="0" max="100" value={value} onChange={changeHandler} steps="1"/>
                        <input type="range" min="0" max="100" value={value} onChange={changeHandler} steps="3"/>
                        <div className="value right">100</div>
                    </Field>
                </Range>       
            </Main>
        </MainContainer>
    )
}

export default Filter