import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
import {themeVal} from '../../../styles/utils/general'
import { visuallyHidden, truncated } from '../../../styles/helpers';
import { Main, MainContainer, Swatch, Middle, RangeInput, BodyContainer, LayerTitle, HeadComponent } from "./styles";
import { useSelector, useDispatch } from "react-redux";
import { changeMetadata, changeLAT, changeLON, removeMetadata, changeFRD } from "../../../redux/action/MetadataAction";
// import Button from "../../../styles/button/button"
import { Slider } from "@mui/material";
import { ButtonGroup } from '@mui/material';
import { Button } from '@mui/material';

const Filter = (props) =>{

    //-----------------------------------------------------------------------------------

    const [left_value_lat, setLeftValueLat] = useState(25)
    const [right_value_lat, setRightValueLat] = useState(75)
    const dispatch = useDispatch();

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

    
    
    const [lat_value, set_lat_Value] = React.useState([-45, 45]);
    const handle_lat_Change = (event, newValue) => {
        set_lat_Value(newValue);
    };
    
    const [lon_value, set_lon_Value] = React.useState([-90, 90]);
    const handle_lon_Change = (event, newValue) => {
        set_lon_Value(newValue);
    };
    

    const [frd_value, set_frd_value] = React.useState([0,22]);
    const handle_frd_Change = (event, newValue) =>{
        set_frd_value(newValue)
    }

    const renderHandler = () =>{
        dispatch(changeMetadata())
        dispatch(changeLAT(lat_value))
        dispatch(changeLON(lon_value))
        dispatch(changeFRD(frd_value))
    }

    const removeHandler = () =>{
        dispatch(removeMetadata())
    }

    return (
        <MainContainer>
            <Main>
                <Swatch/>
                <HeadComponent>
                    <div>
                        <div>
                            <LayerTitle title={'MetaData Filter'}>MetaData Filter</LayerTitle>
                        </div>
                        <div>
                        <ButtonGroup size="small" aria-label="small button group">
                            <Button onClick={renderHandler}>Render</Button>
                            <Button onClick={removeHandler}>Remove</Button>
                        </ButtonGroup>
                        </div>
                    </div>
                </HeadComponent>
                <h4 style={{marginLeft: '105px', marginTop:'10px'}}>Latitude</h4>
                <BodyContainer>
                    <div style={{width:"20px", marginRight:'15px'}}>{lat_value[0]}</div>
                    <Middle>
                        <Slider value={lat_value} onChange={handle_lat_Change} min={-90} max={90}/>
                    </Middle>
                    <div style={{width:"30px", marginLeft:'15px'}}>{lat_value[1]}</div>
                </BodyContainer>
                <h4 style={{marginLeft: '100px', marginTop:'10px'}}>Longitude</h4>
                <BodyContainer>
                    <div style={{width:"20px", marginRight:'15px'}}>{lon_value[0]}</div>
                        <Middle>
                            <Slider value={lon_value} onChange={handle_lon_Change} min={-180} max={180}/>
                        </Middle>
                    <div style={{width:"30px", marginLeft:'15px'}}>{lon_value[1]}</div>
                </BodyContainer>
                <h4 style={{marginLeft: '100px', marginTop:'10px'}}>FRD</h4>
                <BodyContainer>
                    <div style={{width:"20px", marginRight:'15px'}}>{frd_value[0]}</div>
                        <Middle>
                            <Slider value={frd_value} onChange={handle_frd_Change} min={0} max={100} step={0.05}/>
                        </Middle>
                    <div style={{width:"30px", marginLeft:'15px'}}>{frd_value[1]}</div>
                </BodyContainer>
            </Main>
        </MainContainer>
    )
}

export default Filter