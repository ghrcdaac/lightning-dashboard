import React,{useState, useEffect} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import Button from '../styles/button/button'
import Calendar from 'react-calendar';
import find from 'lodash.find';
import CustomCalendar from './CustomCalendar';
import { date_to_string } from './HelperMethods';
import ReactDOM from 'react-dom'

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


    if(typeof props.comparingId !== 'undefined' || props.comparingId !== null){
        if(props.comparingId === "TRMM LIS Daily" || props.comparingId === "TRMM LIS Monthly"){
            calendarType = 'package'
            if(props.comparingId === 'TRMM LIS Monthly') view = 'year';
        }else{
            calendarType = 'custom'
        }
    }

    const clickHandler = () =>{
        setCalendar(!calendar);
    }

    const onClickDay = date =>{
        setDate(date);
        const dateString = date_to_string(date, props.comparingId)
        props.onClick(dateString, date);
    }

    const onClickMonth = date =>{
        setDate(date)
        const dateString = date_to_string(date, props.comparingId)
        props.onClick(dateString, date);
    }

    const customClickHandler = (dateString, data, id) =>{
        props.onClick(dateString,data, id);
    }

    return(
        <>
        <Outer_container styleColor='white'>
            {/* <Button
                variation='base-plain'
                size='small'
                useIcon='calendar'
                title='Calendar for Baseline Layer'
                hideText
                onClick={clickHandler}
                >
                <span>Info</span>
            </Button> */}
            {(typeof comparingLayer !== 'undefined') && <CalendarContainer bottom={(props.comparingId === 'TRMM LIS Full') && '22rem' || '17rem'}>
                {calendar && 
                    <div style={{margin:'10px'}}>
                        { (calendarType === 'package') && <Calendar view={view} minDate={new Date('2013-01-02')} maxDate={new Date('2013-12-31')} defaultActiveStartDate={new Date('2013-01-01')} onClickDay={onClickDay} onClickMonth={onClickMonth} value={date}/>}
                        { (calendarType === 'custom') && <CustomCalendar id={props.comparingId} onClick={customClickHandler}/>}
                    </div>
                }
            </CalendarContainer>}
        </Outer_container>
        </>
    )

    // return(
    //     <>
    //     {(typeof comparingLayer !== 'undefined') && <Outer_container styleColor='white'>
    //         <Button
    //             variation='base-plain'
    //             size='small'
    //             useIcon='calendar'
    //             title='Calendar for Baseline Layer'
    //             hideText
    //             onClick={clickHandler}
    //         >
    //             <span>Info</span>
    //         </Button>
    //         {(props.activeLayers.length !== 0) && <CalendarContainer>
    //             {props.comparing && calendar && 
    //                 <div style={{margin:'10px'}}>
    //                     {/* <div style={{marginBottom:'5px'}}><h5>Compare Date: {date_to_string(date, comparingLayer.id)}</h5></div> */}
    //                     { (calendarType === 'package') && <Calendar view={view} minDate={new Date('2013-01-02')} maxDate={new Date('2013-12-31')} defaultActiveStartDate={new Date('2013-01-01')} onClickDay={onClickDay} onClickMonth={onClickMonth} value={date}/>}
    //                     { (calendarType === 'custom') && <CustomCalendar id={comparingLayer.id} onClick={customClickHandler}/>}
    //                 </div>
    //             }
    //         </CalendarContainer>}
    //     </Outer_container>}
    //     </>
    // )
}

export default CalendarTag