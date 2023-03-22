import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { themeVal } from '../../styles/utils/general';
import {themeVal} from '../../../styles/utils/general'
import { visuallyHidden, truncated } from '../../../styles/helpers';
import { Main, MainContainer, Swatch, Middle, Slider, RangeInput, BodyContainer, LayerTitle } from "./styles";


const Filter = (props) =>{

    //-----------------------------------------------------------------------------------

    const [left_value_lat, setLeftValueLat] = useState(25)
    const [right_value_lat, setRightValueLat] = useState(75)

    const left_handler_lat = (e) =>{
        setLeftValueLat(e.target.value)
    }

    const right_handler_lat = (e) =>{
        setRightValueLat(e.target.value)
    }

    const [left_value_lon, setLeftValueLon] = useState(25)
    const [right_value_lon, setRightValueLon] = useState(75)

    const left_handler_lon = (e) =>{
        setLeftValueLon(e.target.value)
    }

    const right_handler_lon = (e) =>{
        setRightValueLon(e.target.value)
    }

    return (
        <MainContainer>
            <Main>
                <Swatch/>
                <LayerTitle title={'MetaData Filter'}>MetaData Filter</LayerTitle>
                <h4 style={{marginLeft: '105px', marginTop:'10px'}}>Latitude</h4>
                <BodyContainer>
                    <div style={{width:"20px"}}>{left_value_lat}</div>
                    <Middle>
                        <div className="multi-range-slider">
                            <RangeInput id="input-left" min="0" max="100" value={left_value_lat} onChange={left_handler_lat}></RangeInput>
                            <RangeInput id="input-right" min="0" max="100" value={right_value_lat} onChange={right_handler_lat}></RangeInput>

                            <Slider left_value={left_value_lat} right_value={right_value_lat}>
                                <div className="track"></div>
                                <div className="range"></div>
                                <div className="thumb left"></div>
                                <div className="thumb right"></div>
                            </Slider>
                        </div>
                    </Middle>
                    <div style={{width:"30px"}}>{right_value_lat}</div>
                </BodyContainer>
                <h4 style={{marginLeft: '105px', marginTop:'10px'}}>Longitude</h4>
                <BodyContainer>
                    <div style={{width:"20px"}}>{left_value_lon}</div>
                    <Middle>
                        <div className="multi-range-slider">
                            <RangeInput id="input-left" min="0" max="100" value={left_value_lon} onChange={left_handler_lon}></RangeInput>
                            <RangeInput id="input-right" min="0" max="100" value={right_value_lon} onChange={right_handler_lon}></RangeInput>

                            <Slider left_value={left_value_lon} right_value={right_value_lon}>
                                <div className="track"></div>
                                <div className="range"></div>
                                <div className="thumb left"></div>
                                <div className="thumb right"></div>
                            </Slider>
                        </div>
                    </Middle>
                    <div style={{width:"30px"}}>{right_value_lon}</div>
                </BodyContainer>
            </Main>
        </MainContainer>
    )
}

export default Filter