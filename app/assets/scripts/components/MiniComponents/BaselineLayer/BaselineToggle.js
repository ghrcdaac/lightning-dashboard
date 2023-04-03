import React, {useState, useRef, useEffect} from "react";
import styled, { withTheme, ThemeProvider } from 'styled-components';
//import { visuallyHidden, truncated } from '../styles/helpers';
import { truncated } from "../../../styles/helpers";
import {VscCalendar} from '../../../../../../node_modules/react-icons/vsc'
import { useSelector, useDispatch } from "react-redux";
import { changeBaselineId, changeCalendarIcon, changeCalendarActive, changeBaselineDate } from "../../../redux/action/BaselineAction";

const Outer_Container = styled.div`
height: 65px;
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
margin-left:-1.8rem;
`

const MainContainer = styled.div`
display:flex;
height:65px;
width:100%;
`
const Swatch = styled.div`
position:absolute;
height:62px;
margin-left:2px;
margin-top:1.3px;
border-radius: 25px;
width:3.8px;
z-index:999999;
background-color:#C0C0C0;
`
const Main = styled.div`
height:100%;
width:100%;
`
const BaselineToggle = (props) =>{

    const [value, setValue] = useState('Datasets');
    const baseline_id = useSelector(state=>state.BASELINE_REDUCER.BASELINE_ID)
    const calendar_active = useSelector(state=>state.BASELINE_REDUCER.CALENDAR_ACTIVE)
    const dispatch = useDispatch();

    const changeHandler = (e) =>{
        if(e.target.value !== 'Datasets'){
            props.baselineId(e.target.value);
            dispatch(changeBaselineId(e.target.value))
        }else{
            props.calendarStatus('Datasets');
            dispatch(changeBaselineId("Datasets"))
        }
        setValue(e.target.value);
    }

    const titleHandler = (e) =>{
        if(e.target.value !== 'Datasets'){
            dispatch(changeBaselineId(e.target.value))
            dispatch(changeCalendarIcon(true))
        }else{
            dispatch(changeBaselineId(e.target.value));
            dispatch(changeCalendarIcon(false))
        }
        dispatch(changeBaselineDate(null))
    }

    const calendarIcon = (e) =>{
        console.log("Hereeeeeeeeeeeeeeeeeeeeeee in CalendarICON")
        dispatch(changeCalendarActive())
    }

    return(
        <MainContainer>
            <Main>
                <Swatch/>
                <Outer_Container>
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <LayerTitle title={'Baseline Image'}>Baseline Image</LayerTitle>
                            {(props.activeLayers.length !== 0) &&  
                            <Body>
                                <select name="layers" id="layers" onChange={titleHandler}>
                                    <option>Datasets</option>
                                    {props.layers.map((layer)=>(
                                        <option key={layer.id}>{layer.id}</option>
                                    ))}
                                </select>
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
            </Main>
        </MainContainer>
    )
}

export default BaselineToggle