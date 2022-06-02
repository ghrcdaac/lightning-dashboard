import React,{useState} from 'react';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import Button from '../styles/button/button'
import Calendar from 'react-calendar';
import find from 'lodash.find';
// import '../../../../node_modules/react-calendar/dist/Calendar.css';
//import './Calendar.css'

const Outer_container = styled.div`
position:absolute;
float:right;
width:2rem;
height:auto;
z-index:1000;
top:5.6rem;
right:null;
left:0.5rem;
bottom:null;
background-color:${(props)=>props.styleColor};
//background-color:white;
padding:5px;
border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;
display:flex;
justify-content:center;
`

const CalendarContainer = styled.div`
position: absolute;
background-color:white;
left:3rem;
width:350px;
//margin:10px;
border-top-right-radius:5px;
border-top-left-radius:5px;
border-bottom-right-radius:5px;
border-bottom-left-radius:5px;
`

const CalendarTag = (props) =>{

    //const[index, setIndex] = useState(1)
    const [calendar, setCalendar] = useState(false);
    const [date, setDate] = useState(new Date());
    const comparingLayer = find(props.layers, 'comparing');

    const clickHandler = () =>{
        //setIndex(index+1)
        setCalendar(!calendar);
        //props.onClick(index);
    }

    const onChange = date =>{
        setDate(date);
        //console.log(date);
        props.onClick(date);
    }

    return(
        <Outer_container styleColor='white'>
            <Button
                variation='base-plain'
                size='small'
                useIcon='calendar'
                title='Calendar for Baseline Layer'
                hideText
                onClick={clickHandler}
            >
                <span>Info</span>
            </Button>
            <CalendarContainer>
                {props.comparing && calendar && 
                    <div style={{margin:'10px'}}>
                        <div style={{marginBottom:'5px'}}><h5>Active Baseline Layer: {comparingLayer.id}</h5></div>
                        <Calendar minDate={new Date('2013-01-01')} maxDate={new Date('2013-12-31')} defaultActiveStartDate={new Date('2013-01-01')} onChange={onChange} value={date}/>
                    </div>
                }
            </CalendarContainer>
        </Outer_container>
    )
}

export default CalendarTag