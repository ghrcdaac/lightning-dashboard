import { 
    BASELINE_DATE_F,
    BASELINE_DATE_I,
    BASELINE_ID,
    BASELINE_RESET,
    CALENDAR_ACTIVE,
    CALENDAR_ICON
} from "../constants/BaselineConstants"

export const changeBaselineId = (payload) =>{
    return {
        type:BASELINE_ID,
        payload:payload
    }
}

export const changeBaselineDate = (payload) =>{
    return {
        type:BASELINE_DATE_F,
        payload:payload
    }
}

export const changeBaselineDateInformal = (payload) =>{
    return {
        type:BASELINE_DATE_I,
        payload:payload
    }
}

export const resetBaseline = () =>{
    return {
        type:BASELINE_RESET
    }
}

export const changeCalendarIcon = (payload) =>{
    return{
        type:CALENDAR_ICON,
        payload:payload,
    }
}

export const changeCalendarActive =(payload)=>{
    return{
        type:CALENDAR_ACTIVE,
        payload:payload
    }
}