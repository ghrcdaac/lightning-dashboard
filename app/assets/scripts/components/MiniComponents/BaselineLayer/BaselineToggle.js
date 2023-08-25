import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
import { truncated } from "../../../styles/helpers";
import {VscCalendar} from '../../../../../../node_modules/react-icons/vsc'
import { useSelector, useDispatch } from "react-redux";
import { changeBaselineId, changeCalendarIcon, changeCalendarActive, changeBaselineDate } from "../../../redux/action/BaselineAction";

import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { SelectChangeEvent, Select } from '@mui/material';

const Outer_Container = styled.div`
// height: 65px;
width: 100%;
background: #fff;
border-bottom: 0.1px solid #E8E8E8;
padding: 0 65px 0 45px;
margin-bottom:0.8px;
display:flex;
input{
    width: 100%;
    height: 3px;
    background: #ddd;
    border-radius: 5px;
    outline: none;
    border: none;
    z-index: 2222;
}
input&:after{
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    background: #664AFF;
    border: 1px solid #664AFF;
    cursor: pointer;
}
`

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
margin-top:5px;
// margin-left:-1.8rem;
`

const MainContainer = styled.div`
display:flex;
height:65px;
width:100%;
`
const Swatch = styled.div`
position:relative;
height:90%;
margin-left:2px;
margin-top:1.3px;
border-radius: 25px;
width:3.8px;
z-index:999999;
background-color:#C0C0C0;
`

const BaselineToggle = (props) =>{

    const [value, setValue] = useState('None');
    const baseline_id = useSelector(state=>state.BASELINE_REDUCER.BASELINE_ID)
    const calendar_active = useSelector(state=>state.BASELINE_REDUCER.CALENDAR_ACTIVE)
    const dispatch = useDispatch();

    const changeHandler = (e) =>{
        if(e.target.value !== 'None'){
            props.baselineId(e.target.value);
            dispatch(changeBaselineId(e.target.value))
        }else{
            props.calendarStatus('None');
            dispatch(changeBaselineId("None"))
        }
        setValue(e.target.value);
    }

    const titleHandler = (e) =>{
        if(e.target.value !== 'None'){
            dispatch(changeBaselineId(e.target.value))
            dispatch(changeCalendarIcon(true))
        }else{
            dispatch(changeBaselineId(e.target.value));
            dispatch(changeCalendarIcon(false))
        }
        dispatch(changeBaselineDate(null))
    }

    const calendarIcon = (e) =>{
        dispatch(changeCalendarActive())
    }

    return(
        <MainContainer>
            <Swatch/>
            <Outer_Container>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <LayerTitle title={'Baseline Image'}>Baseline Image</LayerTitle>
                        {(props.activeLayers.length !== 0) &&  
                        <Body>
                            <FormControl sx={{ m: 1, minWidth: 200 }} size="small" disabled={false}>
                                <InputLabel id="demo-select-small-label">Select Dataset</InputLabel>
                                <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={element}
                                label="Datasets"
                                onChange={titleHandler}
                                >
                                {/* <MenuItem value={'None'} key={'None'}>{'None'}</MenuItem> */}
                                {props.layers.map((layer)=>(
                                    <MenuItem value={layer.id} key={layer.id}>{layer.id}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Body>}
                        {props.activeLayers.length === 0 && 
                        <Body>
                            <h6 style={{marginTop:'0.5rem', color:'black'}}>Note: Activate layer to compare</h6>
                        </Body>}
                    </div>
                    {(props.activeLayers.length !== 0) && (baseline_id !== 'Datasets') &&
                    <div style={{marginLeft:'10px', marginTop:'30px'}}>
                        <button style={{backgroundColor:'transparent', border:'none', cursor:'pointer'}} onClick={calendarIcon}><VscCalendar size="30px"/></button>
                    </div>}
            </Outer_Container>
        </MainContainer>
    )
}

export default BaselineToggle