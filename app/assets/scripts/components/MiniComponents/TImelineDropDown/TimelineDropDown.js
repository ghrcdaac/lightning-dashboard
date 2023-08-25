import { min } from "lodash";
import React, {useState, useEffect, useRef} from "react";
import { Container, Inner_Container, Year, Month, Day, Time } from "./DropDownStyles";
import { get_arg1, get_arg2, get_arg3, get_arg4 } from "../../../data/isslis";
import { useSelector, useDispatch } from "react-redux";
import { changeMetadataPath } from "../../../redux/action/MetadataAction";

import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { SelectChangeEvent, Select } from '@mui/material';

var year;
var cur_year, cur_month, cur_day, cur_arg4;

const TimelineDropDown = ({ onTimeChange, layer }) =>{
    
    useEffect(()=>{
        set_resetAll(Math.random());
    }, [layer])

    const [reset_all, set_resetAll] = useState(1);
    const [resetMonth, set_resetMonth] = useState(1);
    const [resetDay, set_resetDay] = useState(1);
    const [resetArg4, set_resetArg4] = useState(1);

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
        setDay([])
        setArg4([])
        setMonth(get_arg2(layer.dataset_type,cur_year))
        set_resetMonth(Math.random())
        set_resetDay(Math.random())
        set_resetArg4(Math.random())
        dispatch(changeMetadataPath(''));
    }

    //changes or updates day
    const monthHandler = (e) =>{
        cur_month = e.target.value;
        setDay([])
        setArg4([])
        setDay(get_arg3(layer.dataset_type,cur_year, cur_month))
        set_resetDay(Math.random())
        set_resetArg4(Math.random())
        dispatch(changeMetadataPath(''));
    }

    //changes or updates 4th argument
    const dayHandler = (e) =>{
        cur_day = e.target.value

        setArg4(get_arg4(layer.dataset_type,cur_year, cur_month, cur_day))
        set_resetArg4(Math.random())
        dispatch(changeMetadataPath(''));
    }

    const arg4Handler = (e) =>{
        cur_arg4 = e.target.value
        console.log("Here in arg4 handler")
        if(cur_arg4 === 'Select'){

        }else{
            cur_arg4 = e.target.value;
            var time = null
            var band = null
            if(cur_arg4.includes('_')){
                const split = cur_arg4.split("_")
                time = split[0]
                band = split[1]
            }else{
                time = cur_arg4
            }
            console.log(time, band)
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
        <Container key={reset_all}>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small" disabled={false}>
                <InputLabel id="demo-select-small-label">Select Year</InputLabel>
                <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={element}
                label="Age"
                onChange={yearHandler}
                >
                {year.map((element)=>(
                    <MenuItem value={element} key={element}>{element}</MenuItem>
                ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small" disabled={(month.length === 0)}>
                <InputLabel id="demo-select-small-label2" autoComplete='off'>Select Month</InputLabel>
                <Select
                labelId="demo-select-small-label2"
                id="demo-select-small"
                value={element}
                label="Age"
                onChange={monthHandler}
                autoComplete="off"
                key={resetMonth}
                >
                {month.map((element)=>(
                    <MenuItem value={element} key={element}>{element}</MenuItem>
                ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small" disabled={(day.length === 0)}>
                <InputLabel id="demo-select-small-label3" autoComplete="off">Select Day</InputLabel>
                <Select
                labelId="demo-select-small-label3"
                id="demo-select-small"
                value={element}
                label="Age"
                onChange={dayHandler}
                autoComplete="off"
                key={resetDay}
                >
                {day.map((element)=>(
                    <MenuItem value={element}>{element}</MenuItem>
                ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small" disabled={(arg4.length === 0)}>
                <InputLabel id="demo-select-small-label4">Select Time/Instrument</InputLabel>
                <Select
                labelId="demo-select-small-label4"
                id="demo-select-small"
                value={element}
                label="Age"
                onChange={arg4Handler}
                key={resetArg4}
                >
                {arg4.map((element)=>(
                    <MenuItem value={element}>{element}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </Container>
    )

}

export default TimelineDropDown