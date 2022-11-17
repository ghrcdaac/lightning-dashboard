import { min } from "lodash";
import React, {useState} from "react";
import { Container, Inner_Container, Year, Month, Day, Time } from "./DropDownStyles";
import { get_arg1, get_arg2, get_arg3, get_arg4 } from "../../../data/isslis";

const year = get_arg1();

var cur_year, cur_month, cur_day;

const TimelineDropDown = ({ onTimeChange }) =>{

    const [month, setMonth] = useState([])
    const [day, setDay] = useState([])
    const [arg4, setArg4] = useState([])

    //changes or updates month dropdown value
    const yearHandler = (e) =>{
        cur_year = e.target.value
        if(e.target.value === 'Select Year'){
            setMonth([])
        }else{
            console.log(e.target.value)
            setMonth(get_arg2(e.target.value))
        }
    }

    const monthHandler = (e) =>{
        cur_month = e.target.value;
        if(cur_month === 'Select Month'){
            setDay([])
        }else{
            setDay(get_arg3(cur_year, cur_month))
        }
    }

    const dayHandler = (e) =>{
        cur_day = e.target.value
        if(cur_day === 'Select Day'){
            setArg4([])
        }else{
            setArg4(get_arg4(cur_year, cur_month, cur_day))
        }
    }

    return(
        <Container>
            <Inner_Container>
                <Year name="year" id="year" onChange={yearHandler}>
                    <option>Select Year</option>
                    {year.map((element)=>(
                        <option key={element}>{element}</option>
                    ))}
                </Year>
                <Month name="month" id="month" onChange={monthHandler}>
                    <option>Select Month</option>
                    {month.map((element)=>(
                        <option key={element}>{element}</option>
                    ))}
                </Month>
                <Day name="day" id="day" onChange={dayHandler}>
                    <option>Select Day</option>
                    {day.map((element)=>(
                        <option key={element}>{element}</option>
                    ))}
                </Day>
                {/* {!day && <Time name="time" id="time" disabled={!day}>
                    <option>Select Time</option>
                </Time>} */}
                {day && <Time name="time" id="time" disabled={!day}>
                    <option>Select Time</option>
                    {arg4.map((element)=>(
                        <option key={element}>{element}</option>
                    ))}
                </Time>}
            </Inner_Container>
        </Container>
    )
}

export default TimelineDropDown