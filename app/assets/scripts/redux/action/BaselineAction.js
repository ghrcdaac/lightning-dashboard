export const changeBaselineId = (payload) =>{
    return {
        type:"BASELINE_ID",
        payload:payload
    }
}

export const changeBaselineDate = (payload) =>{
    return {
        type:"BASELINE_DATE",
        payload:payload
    }
}

export const resetBaseline = () =>{
    return {
        type:"BASELINE_RESET"
    }
}