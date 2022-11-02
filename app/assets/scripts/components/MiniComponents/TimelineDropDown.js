import { min } from "lodash";
import React, {useState} from "react";
import styled from "styled-components";
import isslis from "../../data/isslis/Spring2022.json";

const Container = styled.div`
width:100%;
height:100%;
display: flex;
justify-content:center;
`
const Inner_Container = styled.div`
width:80%;
height:100%;
display: flex;
justify-content:space-around;
`

const Year = styled.select`
width:12%;
text-align:center;
font-weight: bold;
`

const Month = styled.select`
width:12%;
text-align:center;
font-weight: bold;
`

const Day = styled.select`
width:12%;
text-align:center;
font-weight: bold;
`

const Time = styled.select`
width:12%;
text-align:center;
font-weight: bold;
`

var currentData;
var dayData_normal = []
var curYear = "2022"
var curMonth, curDay, curTime;

const TimelineDropDown = ({ onTimeChange }) =>{
    const [month, setMonth] = useState(false)
    const [day, setDay] = useState(false)
    const [time, setTime] = useState(false);
    const [dayData, setDayData] = useState([]);
    const [timeData, setTimeData] = useState([]);

    console.log('im at top')
    var arr = [];
    for(var i = 1;i<=31;i++){
        arr.push(i)
    }


    const monthHandler = (e) =>{
        dayData_normal = []
        if(e.target.value === 'Select Month'){
            setDay(false);
            setTime(false);
            setMonth(false);
            setDayData([]);
        }else{
            curMonth = e.target.value;
            currentData = isslis.filter((element)=>{
                return element.month === curMonth
            })

            var init_day = parseInt(currentData[0].init_day);
            var end_day = parseInt(currentData[0].end_day);

            for(let i = init_day;i<=end_day;i++){
                dayData_normal.push(i.toString());
            }
            setDayData(dayData_normal);
            setMonth(true);
        }
    }

    const dayHandler = (e) =>{
        if(e.target.value === 'Select Day'){
            setDay(false);
            setTime(false);
        }else{
            setDay(true);
            curDay = e.target.value;
            var start_index = currentData[0].day_indices[curDay][0]
            var end_index = currentData[0].day_indices[curDay][1]

            var time_data = []
            for(var i = start_index;i<=end_index;i++){
                var file_name = currentData[0].file[i];
                var file_time = file_name.substr(25, 8);
                var hour = file_time.substr(0,2);
                var minute = file_time.substr(2, 2);
                var second = file_time.substr(4, 2);
                var time_string = hour + ":" + minute + ":" + second;
                time_data.push(time_string);
            }
            setTimeData(time_data);
        }
    }

    //need to handle this properly -- send data back from here
    const timeHandler = (e) =>{
        if(e.target.value === 'Select Time'){
            
        }else{
            curTime = e.target.value;
            curTime = curTime.substr(0,2) + curTime.substr(3,2) + curTime.substr(6,2)
            onTimeChange({
                year:curYear,
                month:curMonth,
                day:curDay,
                time:curTime
            })
        }
    }


    return(
        <Container>
            <Inner_Container>
                <Year name="year" id="year">
                    <option>2022</option>
                </Year>
                <Month name="month" id="month" onChange={monthHandler}>
                    <option>Select Month</option>
                    {isslis.map((element)=>(
                        <option>{element.month}</option>
                    ))}
                </Month>
                <Day name="day" id="day" onChange={dayHandler} disabled={!month}>
                    <option>Select Day</option>
                    {dayData.map((element)=>(
                        element < 10 ? <option>0{element}</option> : <option>{element}</option>
                    ))}
                </Day>
                <Time name="time" id="time" onChange={timeHandler} disabled={!day}>
                    <option>Select Time</option>
                    {timeData.map((element)=>(
                        <option>{element}</option>
                    ))}
                </Time>
            </Inner_Container>
        </Container>
    )

}

export default TimelineDropDown