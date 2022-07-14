const InitState = {
    BASELINE_ID:"Datasets",
    BASELINE_DATE:null,
    CALENDAR_ACTIVE:false,
}

const BASELINE_REDUCER = (state = InitState, action) =>{
    if(action.type === 'BASELINE_ID'){
        return{
            BASELINE_ID:action.payload, 
            BASELINE_DATE:state.BASELINE_DATE,
            CALENDAR_ACTIVE:state.CALENDAR_ACTIVE,
        }
    }else if(action.type === 'BASELINE_DATE'){
        return{
            BASELINE_ID:state.BASELINE_ID, 
            BASELINE_DATE:action.payload,
            CALENDAR_ACTIVE:state.CALENDAR_ACTIVE
        }
    }else if(action.type === 'BASELINE_RESET'){
        return InitState
    }else{
        return state
    }
}

export default BASELINE_REDUCER