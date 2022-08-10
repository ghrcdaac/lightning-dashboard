import React,{useState, useEffect} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import Button from '../../../styles/button/button';
import Calendar from 'react-calendar';
import find from 'lodash.find';
import CustomCalendar from './CustomCalendar';
import { date_to_string } from '../../../utils/HelperMethods';
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux';
import { changeBaselineDate, changeBaselineDateInformal } from '../../../redux/action/BaselineAction';
import BaselineJSON from '../../../data/Baseline'

const Outer_container = styled.div`
//position:absolute;
float:right;
width:2rem;
height:auto;
z-index:1000;
//top:5rem;
margin-top:0.4rem;
right:null;
//left:2rem;
bottom:null;
background-color:${(props)=>props.styleColor};
//background-color:red;
//border: solid black 2px;
padding:2px;
border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;
display:flex;
justify-content:center;
`
const CalendarContainer = styled.div`
position: absolute;
//background-color:white;
left:.7rem;
bottom:17rem;
//bottom:${(props)=>props.bottom}
//z-index:99999999999;
width:280px;
max-height:350px;
//margin:10px;
border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;

.react-calendar__month-view__days {
    // display: grid !important;
    // grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%; 

    .react-calendar__tile {
        border-top-right-radius:5px;
        border-top-left-radius:5px;
        border-bottom-right-radius:5px;
        border-bottom-left-radius:5px;
    }
  }
`

const CalendarTag = (props) =>{

    const [calendar, setCalendar] = useState(true);
    const [date, setDate] = useState(new Date());
    const comparingLayer = find(props.layers, 'comparing');
    var calendarType;
    var view = 'month';
    const dispatch = useDispatch();
    const baseline_id = useSelector(state=>state.BASELINE_REDUCER.BASELINE_ID)

    // console.log(BaselineJSON)
    if(typeof baseline_id !== 'undefined' && baseline_id !== null && baseline_id !== 'Datasets'){
        BaselineJSON.Baseline.map((element)=>{
            if(element.id === baseline_id){
                calendarType = element.calendarType
            }
        })
        if(baseline_id === 'TRMM LIS Monthly') view = 'year';
    }

    const clickHandler = () =>{
        setCalendar(!calendar);
    }

    const onClickDay = date =>{
        const dateString = date_to_string(date, props.comparingId)
        setDate(date);
        dispatch(changeBaselineDate(date))
        dispatch(changeBaselineDateInformal(dateString))
        props.onClick(dateString, date);
    }

    const onClickMonth = date =>{
        const dateString = date_to_string(date, props.comparingId)
        setDate(date)
        dispatch(changeBaselineDate(date))
        dispatch(changeBaselineDateInformal(dateString))
        props.onClick(dateString, date);
    }

    const customClickHandler = (dateString, data, id) =>{
        props.onClick(dateString,data, id);
        dispatch(changeBaselineDate(data))
    }

    return(
        <>
        <Outer_container styleColor='white'>
            {(typeof comparingLayer !== 'undefined') && <CalendarContainer bottom={(baseline_id === 'TRMM LIS Full') && '22rem' || '17rem'}>
                {calendar && 
                    <div style={{margin:'10px'}}>
                        { (calendarType === 'non-custom') && <Calendar view={view} minDate={new Date('2013-01-02')} maxDate={new Date('2013-12-31')} defaultActiveStartDate={new Date('2013-01-01')} onClickDay={onClickDay} onClickMonth={onClickMonth} value={date}/>}
                        { (calendarType === 'custom') && <CustomCalendar id={baseline_id} onClick={customClickHandler}/>}
                    </div>
                }
            </CalendarContainer>}
        </Outer_container>
        </>
    )
}

export default CalendarTag