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

const LayerTitle = styled.h1`
  ${truncated()}
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0;
  margin-top:8px;
  sub {
    bottom: 0;
  }
`;

const Swatch = styled.div`
position:relative;
margin-left:2px;
margin-top:1.3px;
border-radius: 25px;
width:3.8px;
background-color:#C0C0C0;
`
const Container = styled.div`
display:flex;
height:auto;
width:100%;

`
const Body = styled.div`
height:auto;
width:auto;
margin-left:10px;
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
        //console.log("Here in titleHandler")
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
        <Container>
            <Swatch/>
            <Body>
                <LayerTitle title={'Baseline Image'}>Baseline Image</LayerTitle>
                {props.activeLayers.length === 0 && 
                    <h6 style={{marginTop:'0.5rem', color:'black'}}>Note: Activate layer to compare</h6>
                }
                <div style={{display:'flex', marginTop:'5px', marginLeft:'-10px'}}>
                    {props.activeLayers.length !== 0 && 
                        <FormControl sx={{ m: 1, minWidth: 200 }} size="small" disabled={false}>
                            <InputLabel id="demo-select-small-label">Select Dataset</InputLabel>
                            <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={element}
                            label="Datasets"
                            onChange={titleHandler}
                            >
                            <MenuItem value={"None"} key={"None"}>{"None"}</MenuItem>
                            {props.layers.map((layer)=>(
                                layer.timeline_type !== 'non-regular' && <MenuItem value={layer.id} key={layer.id}>{layer.id}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    }
                    {(props.activeLayers.length !== 0) && (baseline_id !== 'Datasets') &&
                    <div style={{marginLeft:'10px', marginTop:'10px'}}>
                        <button style={{backgroundColor:'transparent', border:'none', cursor:'pointer'}} onClick={calendarIcon}><VscCalendar size="30px"/></button>
                    </div>}
                </div>
            </Body>
        </Container>
    )
}

export default BaselineToggle