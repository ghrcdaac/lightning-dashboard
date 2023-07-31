import { min } from "lodash";
import React, {useState, useEffect} from "react";
import { Container, Inner_Container, Year, Month, Day, Time } from "./DropDownStyles";
import { get_arg1, get_arg2, get_arg3, get_arg4 } from "../../../data/isslis";
import { useSelector, useDispatch } from "react-redux";
import { changeMetadataPath } from "../../../redux/action/MetadataAction";

var year;

var cur_year, cur_month, cur_day, cur_arg4;

const TimelineDropDown = ({ onTimeChange, layer }) =>{

    year = get_arg1(layer.dataset_type);
    const [month, setMonth] = useState([])
    const [day, setDay] = useState([])
    const [arg4, setArg4] = useState([])

    //redux variable
    const dispatch = useDispatch();
    const path = useSelector(state=>state.METADATA_REDUCER.PATH)

    //changes or updates month dropdown value
    const yearHandler = (e) =>{
        cur_year = e.target.value
        //console.log(typeof(cur_year), cur_year)
        setDay([])
        setArg4([])
        setMonth([])
        if(e.target.value === 'Select Year'){
            setMonth([])
        }else{
            setMonth(get_arg2(layer.dataset_type,cur_year))
            dispatch(changeMetadataPath(''));
        }
    }

    //changes or updates day
    const monthHandler = (e) =>{
        cur_month = e.target.value;
        //console.log(typeof(cur_month), cur_month)
        setArg4([])
        if(cur_month === 'Select Month'){
            setDay([])
        }else{
            setDay(get_arg3(layer.dataset_type,cur_year, cur_month))
            dispatch(changeMetadataPath(''));
        }
    }

    //changes or updates 4th argument
    const dayHandler = (e) =>{
        cur_day = e.target.value
        //console.log(typeof(cur_day), cur_day)
        if(cur_day === 'Select Day'){
            setArg4([])
        }else{
            setArg4(get_arg4(layer.dataset_type,cur_year, cur_month, cur_day))
            dispatch(changeMetadataPath(''));
        }
    }

    const arg4Handler = (e) =>{
        cur_arg4 = e.target.value
        console.log("Here in arg4 handler")
        if(cur_arg4 === 'Select'){

        }else{
            cur_arg4 = e.target.value;
            var time = null
            var band = null
            console.log(time, band)
            if(cur_arg4.includes('_')){
                const split = cur_arg4.split("_")
                time = split[0]
                band = split[1]
            }else{
                time = cur_arg4
            }
            onTimeChange({
                year:cur_year,
                month:cur_month,
                day:cur_day,
                time:time, 
                band:band
            })
            dispatch(changeMetadataPath(cur_year+cur_month+cur_day+".txt"+"#"+cur_arg4));
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
                <Month name="month" id="month" onChange={monthHandler} disabled={(month.length === 0)}>
                    <option>Select Month</option>
                    {month.map((element)=>(
                        <option key={element}>{element}</option>
                    ))}
                </Month>
                <Day name="day" id="day" onChange={dayHandler} disabled={(day.length === 0)}>
                    <option>Select Day</option>
                    {day.map((element)=>(
                        <option key={element}>{element}</option>
                    ))}
                </Day>
                {(arg4.length === 0) && <Time name="time" id="time" disabled={(arg4.length === 0)}>
                    <option>Select Time</option>
                </Time>}
                {(arg4.length !== 0) && <Time name="time" id="time" disabled={(arg4.length === 0)} onChange={arg4Handler}>
                    <option>Select</option>
                    {arg4.map((element)=>(
                        <option key={element}>{element}</option>
                    ))}
                </Time>}
            </Inner_Container>
        </Container>
    )
}

export default TimelineDropDown